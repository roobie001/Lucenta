export interface ParsedDicomResult {
  patientId?: string;
  modality?: string;
  rows: number;
  cols: number;
  windowCenter?: number;
  windowWidth?: number;
  pixels?: Float32Array;
  minVal: number;
  maxVal: number;
  parsedPixels: boolean;
}

function readAscii(view: DataView, offset: number, length: number): string {
  let out = "";
  for (let i = 0; i < length && offset + i < view.byteLength; i++) {
    const code = view.getUint8(offset + i);
    if (code === 0) break;
    out += String.fromCharCode(code);
  }
  return out.trim();
}

/**
 * Lightweight browser-side DICOM Part 10 parser for uncompressed 8/16-bit grayscale images.
 * Safely extracts common metadata tags and falls back cleanly for compressed/encapsulated pixel data.
 */
export function parseBasicDicom(buffer: ArrayBuffer): ParsedDicomResult | null {
  if (buffer.byteLength < 132) return null;
  const view = new DataView(buffer);
  const magic = readAscii(view, 128, 4);
  if (magic !== "DICM") return null;

  let offset = 132;
  let rows = 512;
  let cols = 512;
  let bitsAllocated = 16;
  let pixelRepresentation = 0;
  let rescaleSlope = 1;
  let rescaleIntercept = 0;
  let windowCenter: number | undefined;
  let windowWidth: number | undefined;
  let patientId: string | undefined;
  let modality: string | undefined;
  let pixelDataOffset = -1;
  let pixelDataLength = 0;

  const explicitVRsWithLongLen = new Set(["OB", "OW", "OF", "SQ", "UT", "UN", "OD", "OL"]);

  let safety = 0;
  while (offset + 8 <= view.byteLength && safety < 4000) {
    safety++;
    const group = view.getUint16(offset, true);
    const element = view.getUint16(offset + 2, true);
    const tag = (group << 16) | element;

    // Check if explicit VR (two uppercase ASCII letters)
    const b4 = view.getUint8(offset + 4);
    const b5 = view.getUint8(offset + 5);
    const isExplicitVR = b4 >= 65 && b4 <= 90 && b5 >= 65 && b5 <= 90;

    let vr = "";
    let length = 0;
    let valueOffset = 0;

    if (isExplicitVR) {
      vr = String.fromCharCode(b4, b5);
      if (explicitVRsWithLongLen.has(vr)) {
        if (offset + 12 > view.byteLength) break;
        length = view.getUint32(offset + 8, true);
        valueOffset = offset + 12;
      } else {
        length = view.getUint16(offset + 6, true);
        valueOffset = offset + 8;
      }
    } else {
      length = view.getUint32(offset + 4, true);
      valueOffset = offset + 8;
    }

    if (length === 0xffffffff) {
      // Undefined length (e.g. encapsulated pixel data or SQ) - cannot decode uncompressed flat buffer
      if (tag === 0x7fe00010) break;
      // Skip ahead cautiously
      offset = valueOffset + 8;
      continue;
    }

    if (valueOffset + length > view.byteLength) break;

    switch (tag) {
      case 0x00100020: // PatientID
        patientId = readAscii(view, valueOffset, length);
        break;
      case 0x00080060: // Modality
        modality = readAscii(view, valueOffset, length);
        break;
      case 0x00280010: // Rows
        if (length >= 2) rows = view.getUint16(valueOffset, true);
        break;
      case 0x00280011: // Columns
        if (length >= 2) cols = view.getUint16(valueOffset, true);
        break;
      case 0x00280100: // BitsAllocated
        if (length >= 2) bitsAllocated = view.getUint16(valueOffset, true);
        break;
      case 0x00280103: // PixelRepresentation (0=unsigned, 1=signed)
        if (length >= 2) pixelRepresentation = view.getUint16(valueOffset, true);
        break;
      case 0x00281050: {
        // WindowCenter
        const num = parseFloat(readAscii(view, valueOffset, length).split("\\")[0]);
        if (!Number.isNaN(num)) windowCenter = num;
        break;
      }
      case 0x00281051: {
        // WindowWidth
        const num = parseFloat(readAscii(view, valueOffset, length).split("\\")[0]);
        if (!Number.isNaN(num)) windowWidth = num;
        break;
      }
      case 0x00281052: {
        const num = parseFloat(readAscii(view, valueOffset, length));
        if (!Number.isNaN(num)) rescaleIntercept = num;
        break;
      }
      case 0x00281053: {
        const num = parseFloat(readAscii(view, valueOffset, length));
        if (!Number.isNaN(num)) rescaleSlope = num;
        break;
      }
      case 0x7fe00010: // PixelData
        pixelDataOffset = valueOffset;
        pixelDataLength = length;
        break;
    }

    if (tag === 0x7fe00010) break;
    offset = valueOffset + length;
  }

  const expectedCount = rows * cols;
  if (
    pixelDataOffset > 0 &&
    rows > 0 &&
    cols > 0 &&
    expectedCount <= 4096 * 4096 &&
    (bitsAllocated === 8 || bitsAllocated === 16)
  ) {
    const bytesPerPixel = bitsAllocated / 8;
    if (pixelDataLength >= expectedCount * bytesPerPixel) {
      const pixels = new Float32Array(expectedCount);
      let minVal = Infinity;
      let maxVal = -Infinity;

      for (let i = 0; i < expectedCount; i++) {
        const byteIdx = pixelDataOffset + i * bytesPerPixel;
        let raw = 0;
        if (bitsAllocated === 8) {
          raw = view.getUint8(byteIdx);
        } else {
          raw = pixelRepresentation === 1
            ? view.getInt16(byteIdx, true)
            : view.getUint16(byteIdx, true);
        }
        const val = raw * rescaleSlope + rescaleIntercept;
        pixels[i] = val;
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
      }

      return {
        patientId,
        modality,
        rows,
        cols,
        windowCenter,
        windowWidth,
        pixels,
        minVal,
        maxVal,
        parsedPixels: true,
      };
    }
  }

  return {
    patientId,
    modality,
    rows,
    cols,
    windowCenter,
    windowWidth,
    minVal: 0,
    maxVal: 255,
    parsedPixels: false,
  };
}
