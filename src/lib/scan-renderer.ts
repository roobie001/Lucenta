import type { DemoStudy } from "./demo-studies";

export interface RenderViewportOptions {
  study: DemoStudy;
  slice: number;
  contrast: number; // 0.4 .. 2.0 (default 1.0)
  brightness: number; // -60 .. 60 (default 0)
  invert: boolean;
  zoom: number; // 0.6 .. 3.5
  panX: number;
  panY: number;
  showAiOverlay: boolean;
  showHeatmap: boolean;
  uploadedImage?: HTMLImageElement | null;
}

// Deterministic pseudo-random helper for realistic tissue speckle
function hash2(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

// Offscreen cache for base 512x512 medical slice to keep 60fps zoom/pan/overlay smooth
let cachedKey = "";
let cachedCanvas: HTMLCanvasElement | null = null;

function getBaseSliceCanvas(
  study: DemoStudy,
  slice: number,
  uploadedImage?: HTMLImageElement | null
): HTMLCanvasElement {
  const key = `${study.id}:${slice}:${study.uploadedImageUrl ?? ""}:${
    study.dicomPixelData ? "dcm" : "proc"
  }`;
  if (cachedCanvas && cachedKey === key) {
    return cachedCanvas;
  }

  const size = 512;
  const off = cachedCanvas ?? document.createElement("canvas");
  off.width = size;
  off.height = size;
  const ctx = off.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  if (study.dicomPixelData) {
    renderDicomPixels(ctx, size, study.dicomPixelData);
  } else if (uploadedImage) {
    renderUploadedImage(ctx, size, uploadedImage);
  } else if (study.studyKind === "ct-chest") {
    renderChestCTSlice(ctx, size, slice, study.totalSlices);
  } else if (study.studyKind === "ct-head") {
    renderHeadCTSlice(ctx, size, slice, study.totalSlices);
  } else {
    renderChestXRay(ctx, size, slice);
  }

  cachedCanvas = off;
  cachedKey = key;
  return off;
}

function renderDicomPixels(
  ctx: CanvasRenderingContext2D,
  size: number,
  dcm: NonNullable<DemoStudy["dicomPixelData"]>
) {
  const temp = document.createElement("canvas");
  temp.width = dcm.width;
  temp.height = dcm.height;
  const tctx = temp.getContext("2d")!;
  const img = tctx.createImageData(dcm.width, dcm.height);
  const span = Math.max(1, dcm.maxVal - dcm.minVal);

  for (let i = 0; i < dcm.pixels.length; i++) {
    const v = Math.max(0, Math.min(255, ((dcm.pixels[i] - dcm.minVal) / span) * 255));
    const idx = i * 4;
    img.data[idx] = v;
    img.data[idx + 1] = v;
    img.data[idx + 2] = v;
    img.data[idx + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);
  const scale = Math.min(size / dcm.width, size / dcm.height);
  const dw = dcm.width * scale;
  const dh = dcm.height * scale;
  ctx.drawImage(temp, (size - dw) / 2, (size - dh) / 2, dw, dh);
}

function renderUploadedImage(
  ctx: CanvasRenderingContext2D,
  size: number,
  image: HTMLImageElement
) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);
  const scale = Math.min(size / image.width, size / image.height);
  const dw = image.width * scale;
  const dh = image.height * scale;
  ctx.drawImage(image, (size - dw) / 2, (size - dh) / 2, dw, dh);
}

/**
 * Procedural Axial Chest CT (512x512) that evolves realistically from lung apex (slice 1)
 * through carina/RUL (slice 118) to diaphragm/liver dome (slice 214).
 */
function renderChestCTSlice(
  ctx: CanvasRenderingContext2D,
  size: number,
  slice: number,
  totalSlices: number
) {
  const z = slice / totalSlices; // 0 (apex) .. 1 (base)
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = "#04060a";
  ctx.fillRect(0, 0, size, size);

  // CT circular FOV vignette
  const fovGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 248);
  fovGrad.addColorStop(0, "#0b0f16");
  fovGrad.addColorStop(0.95, "#07090e");
  fovGrad.addColorStop(1, "#020305");
  ctx.fillStyle = fovGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 246, 0, Math.PI * 2);
  ctx.fill();

  // CT gantry table cradle at bottom
  ctx.save();
  ctx.strokeStyle = "rgba(130, 145, 165, 0.32)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy + 250, 320, Math.PI * 1.32, Math.PI * 1.68);
  ctx.stroke();
  ctx.restore();

  // Thoracic contour scaling smoothly with slice z
  const ribExpansion = 0.72 + Math.sin(Math.min(1, z * 1.15) * Math.PI * 0.65) * 0.28;
  const bodyRx = 196 * ribExpansion;
  const bodyRy = 148 * ribExpansion;

  // Subcutaneous soft tissue & chest wall musculature
  ctx.save();
  const wallGrad = ctx.createRadialGradient(cx, cy + 8, 60, cx, cy + 8, bodyRx);
  wallGrad.addColorStop(0, "#4c5563");
  wallGrad.addColorStop(0.76, "#5d6778");
  wallGrad.addColorStop(0.89, "#353c48");
  wallGrad.addColorStop(1, "#1e242d");
  ctx.fillStyle = wallGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 6, bodyRx, bodyRy, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pectoralis & dorsal muscle bands
  ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 6, bodyRx - 14, bodyRy - 14, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Scapulae laterally on upper/mid slices
  if (z < 0.72) {
    const scapAlpha = 0.55 * (1 - z / 0.72);
    ctx.strokeStyle = `rgba(226, 234, 245, ${scapAlpha})`;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + dir * (bodyRx - 22), cy + 48);
      ctx.quadraticCurveTo(cx + dir * (bodyRx - 34), cy + 86, cx + dir * (bodyRx - 62), cy + 106);
      ctx.stroke();
    }
  }

  // Ribs (bright cortical bone arcs pulsing subtly across slice z)
  const ribPhase = (slice % 18) / 18;
  const ribCount = 6;
  for (let i = 0; i < ribCount; i++) {
    const t = (i + ribPhase) / ribCount;
    const angleStart = 0.25 + t * 0.95;
    const span = 0.42;
    const rAlpha = 0.45 + 0.45 * Math.sin(t * Math.PI);
    ctx.strokeStyle = `rgba(235, 242, 250, ${rAlpha.toFixed(2)})`;
    ctx.lineWidth = 5.5;
    ctx.lineCap = "round";
    // Left side of image (patient's right ribs)
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy + 6,
      bodyRx - 20,
      bodyRy - 18,
      0,
      Math.PI - angleStart - span,
      Math.PI - angleStart
    );
    ctx.stroke();
    // Right side of image (patient's left ribs)
    ctx.beginPath();
    ctx.ellipse(cx, cy + 6, bodyRx - 20, bodyRy - 18, 0, angleStart, angleStart + span);
    ctx.stroke();
  }

  // Sternum (anterior midline)
  ctx.fillStyle = "rgba(235, 242, 250, 0.85)";
  ctx.beginPath();
  ctx.ellipse(cx, cy - bodyRy + 16, 15, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Lung fields (left = patient's right lung; right = patient's left lung)
  const lungHeight = (bodyRy - 32) * (z > 0.82 ? Math.max(0.25, 1 - (z - 0.82) * 3.8) : 1);
  const lungWidth = (bodyRx - 34) * 0.43;

  const drawLungField = (side: -1 | 1) => {
    const lx = cx + side * (lungWidth * 0.98 + 10);
    const ly = cy + 6;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lx - side * (lungWidth * 0.62), ly - lungHeight * 0.55);
    ctx.bezierCurveTo(
      lx + side * lungWidth * 0.35,
      ly - lungHeight * 1.04,
      lx + side * lungWidth * 1.05,
      ly - lungHeight * 0.25,
      lx + side * lungWidth * 0.95,
      ly + lungHeight * 0.42
    );
    ctx.bezierCurveTo(
      lx + side * lungWidth * 0.82,
      ly + lungHeight * 0.98,
      lx - side * lungWidth * 0.32,
      ly + lungHeight * 0.96,
      lx - side * lungWidth * 0.68,
      ly + lungHeight * 0.55
    );
    ctx.bezierCurveTo(
      lx - side * lungWidth * 0.88,
      ly + lungHeight * 0.2,
      lx - side * lungWidth * 0.82,
      ly - lungHeight * 0.3,
      lx - side * lungWidth * 0.62,
      ly - lungHeight * 0.55
    );
    ctx.closePath();

    // Aerated lung parenchyma gradient (dark in lung window)
    const lungGrad = ctx.createRadialGradient(lx, ly, 8, lx, ly, lungWidth * 1.15);
    lungGrad.addColorStop(0, "#121821");
    lungGrad.addColorStop(0.75, "#0d1118");
    lungGrad.addColorStop(1, "#18202c");
    ctx.fillStyle = lungGrad;
    ctx.fill();
    ctx.clip();

    // Subtle parenchymal texture & pulmonary vascular arborization
    const hilumX = cx + side * 42;
    const hilumY = cy + 6;
    const branchCount = 18;
    for (let b = 0; b < branchCount; b++) {
      const ang =
        (side === -1 ? Math.PI : 0) +
        (b / (branchCount - 1) - 0.5) * 2.25 +
        Math.sin(slice * 0.14 + b) * 0.12;
      const len = 50 + (b % 4) * 22 + Math.cos(slice * 0.09 + b * 1.7) * 14;
      const ex = hilumX + Math.cos(ang) * len;
      const ey = hilumY + Math.sin(ang) * len * 0.88;
      const mx = (hilumX + ex) / 2 + Math.sin(b * 2.1 + slice * 0.05) * 8;
      const my = (hilumY + ey) / 2 + Math.cos(b * 1.4) * 8;

      ctx.strokeStyle = `rgba(175, 192, 212, ${0.14 + (b % 3) * 0.07})`;
      ctx.lineWidth = Math.max(0.8, 2.8 - (b % 4) * 0.45);
      ctx.beginPath();
      ctx.moveTo(hilumX, hilumY);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.stroke();

      // Secondary branching twig
      const ex2 = ex + Math.cos(ang + 0.42) * 20;
      const ey2 = ey + Math.sin(ang + 0.42) * 18;
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = "rgba(165, 182, 204, 0.12)";
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex2, ey2);
      ctx.stroke();
    }

    // Small cross-sectional vessel dots
    for (let d = 0; d < 28; d++) {
      const rx = hash2(d + side * 31, Math.floor(slice / 3)) * 2 - 1;
      const ry = hash2(d + 97, Math.floor(slice / 3) + 11) * 2 - 1;
      const px = lx + rx * lungWidth * 0.72;
      const py = ly + ry * lungHeight * 0.72;
      const r = 1 + hash2(d, slice) * 1.6;
      ctx.fillStyle = "rgba(190, 205, 224, 0.22)";
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Liver/diaphragm dome emerging on right lower slices (z > 0.78)
    if (z > 0.78 && side === -1) {
      const domeR = (z - 0.78) * 320;
      const domeGrad = ctx.createRadialGradient(lx, ly + 8, 4, lx, ly + 8, Math.max(10, domeR));
      domeGrad.addColorStop(0, "#707a8a");
      domeGrad.addColorStop(0.85, "#4c5563");
      domeGrad.addColorStop(1, "rgba(76,85,99,0)");
      ctx.fillStyle = domeGrad;
      ctx.beginPath();
      ctx.arc(lx, ly + 8, domeR, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  drawLungField(-1); // Viewer's left = Patient's Right Lung
  drawLungField(1); // Viewer's right = Patient's Left Lung

  // Mediastinum, heart & great vessels (shifting realistically along z)
  const heartGrowth = Math.max(0, Math.min(1, (z - 0.38) / 0.42));
  const heartRx = 26 + heartGrowth * 34;
  const heartRy = 30 + heartGrowth * 34;
  const heartCx = cx + heartGrowth * 18;
  const heartCy = cy - 10 + heartGrowth * 12;

  const medGrad = ctx.createRadialGradient(heartCx, heartCy, 8, heartCx, heartCy, heartRx + 16);
  medGrad.addColorStop(0, "#7b8594");
  medGrad.addColorStop(0.75, "#5c6675");
  medGrad.addColorStop(1, "#3d4552");
  ctx.fillStyle = medGrad;
  ctx.beginPath();
  ctx.ellipse(heartCx, heartCy, heartRx, heartRy, -0.25, 0, Math.PI * 2);
  ctx.fill();

  // Ascending & descending aorta (brighter contrast-like vascular density)
  ctx.fillStyle = "#9aa5b5";
  ctx.beginPath();
  ctx.arc(cx + 16, cy + 44, 13, 0, Math.PI * 2); // Descending thoracic aorta
  ctx.fill();
  if (z < 0.65) {
    ctx.beginPath();
    ctx.arc(cx - 8, cy - 14, 15, 0, Math.PI * 2); // Ascending aorta / arch
    ctx.fill();
  }

  // Trachea / mainstem bronchi bifurcation (air-filled dark lumen with bright cartilaginous wall)
  if (z < 0.58) {
    const split = Math.max(0, (z - 0.44) * 140);
    for (const dir of split > 2 ? [-1, 1] : [0]) {
      const tx = cx + dir * split;
      const ty = cy + 6;
      ctx.fillStyle = "#828d9e";
      ctx.beginPath();
      ctx.arc(tx, ty, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#06080c";
      ctx.beginPath();
      ctx.arc(tx, ty, 7.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Thoracic Vertebral Body + Spinous Process + Spinal Canal (posterior midline)
  const vx = cx;
  const vy = cy + bodyRy - 48;
  ctx.fillStyle = "#dbe4f0";
  ctx.beginPath();
  ctx.ellipse(vx, vy, 21, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // Trabecular bone interior
  ctx.fillStyle = "#8f9bad";
  ctx.beginPath();
  ctx.ellipse(vx, vy, 15, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  // Spinous process & laminae
  ctx.strokeStyle = "#d5dfec";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(vx - 16, vy + 8);
  ctx.lineTo(vx, vy + 36);
  ctx.lineTo(vx + 16, vy + 8);
  ctx.stroke();
  // Spinal canal
  ctx.fillStyle = "#222936";
  ctx.beginPath();
  ctx.arc(vx, vy + 15, 7, 0, Math.PI * 2);
  ctx.fill();

  // TARGET PATHOLOGY: Right Upper Lobe (RUL, segment 3) Pulmonary Nodule
  // Visible across slices 94..142, peaking sharply at slice 118
  if (slice >= 94 && slice <= 142) {
    const dist = Math.abs(slice - 118) / 24; // 0 at peak, 1 at edge
    const intensity = Math.max(0, 1 - dist * dist);
    const nx = size * 0.345; // Inside viewer's left lung (RUL anterior segment)
    const ny = size * 0.41;
    const nr = 4 + intensity * 7.5;

    // Subtle spiculated margins
    ctx.save();
    ctx.translate(nx, ny);
    ctx.fillStyle = `rgba(218, 226, 236, ${(0.35 + intensity * 0.58).toFixed(2)})`;
    ctx.beginPath();
    const lobes = 12;
    for (let i = 0; i <= lobes; i++) {
      const a = (i / lobes) * Math.PI * 2;
      const rad = nr * (0.85 + 0.25 * Math.sin(a * 3 + slice * 0.15) + 0.12 * Math.cos(a * 5));
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Inner dense core
    const coreGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, nr);
    coreGrad.addColorStop(0, `rgba(242, 246, 252, ${(0.5 + intensity * 0.45).toFixed(2)})`);
    coreGrad.addColorStop(1, "rgba(180, 192, 206, 0)");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, nr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
  applySubtleScanNoise(ctx, size);
}

/**
 * Procedural Axial Head CT (512x512) with skull vault, brain parenchyma, ventricles,
 * and acute left frontal crescentic subdural hematoma peaking at slice 84/160.
 */
function renderHeadCTSlice(
  ctx: CanvasRenderingContext2D,
  size: number,
  slice: number,
  totalSlices: number
) {
  const z = slice / totalSlices; // 0 (skull base) .. 1 (vertex)
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = "#04060a";
  ctx.fillRect(0, 0, size, size);

  const fovGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 246);
  fovGrad.addColorStop(0, "#090c12");
  fovGrad.addColorStop(1, "#020305");
  ctx.fillStyle = fovGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 246, 0, Math.PI * 2);
  ctx.fill();

  // Cranial size tapers toward skull base & vertex
  const headScale = 0.62 + Math.sin(Math.max(0.08, Math.min(0.95, z)) * Math.PI) * 0.38;
  const rx = 156 * headScale;
  const ry = 188 * headScale;

  // Scalp soft tissue
  ctx.fillStyle = "#3c4452";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx + 10, ry + 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Calvarium (bright cortical bone)
  ctx.fillStyle = "#eef2f8";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner brain parenchyma
  const brainRx = rx - 13;
  const brainRy = ry - 13;
  const brainGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, brainRy);
  brainGrad.addColorStop(0, "#4a5362");
  brainGrad.addColorStop(0.78, "#586374");
  brainGrad.addColorStop(0.95, "#687487");
  brainGrad.addColorStop(1, "#2a313c");
  ctx.fillStyle = brainGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, brainRx, brainRy, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, brainRx, brainRy, 0, 0, Math.PI * 2);
  ctx.clip();

  // Cerebral sulci & gyri folds
  for (let s = 0; s < 36; s++) {
    const a = (s / 36) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * (brainRx - 2);
    const y1 = cy + Math.sin(a) * (brainRy - 2);
    const len = 14 + (s % 4) * 5;
    const x2 = cx + Math.cos(a + Math.sin(slice * 0.08 + s) * 0.08) * (brainRx - len);
    const y2 = cy + Math.sin(a + Math.cos(slice * 0.07 + s) * 0.08) * (brainRy - len);
    ctx.strokeStyle = "rgba(18, 22, 30, 0.55)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Subtle midline shift when SDH is present (slices 52..118)
  const sdhStrength =
    slice >= 52 && slice <= 118 ? Math.max(0, 1 - Math.pow((slice - 84) / 34, 2)) : 0;
  const midlineShift = -sdhStrength * 5; // Pushed slightly rightward (viewer's left)

  // Falx cerebri (midline hyperdense dural reflection)
  ctx.strokeStyle = "rgba(215, 223, 234, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - brainRy + 4);
  ctx.quadraticCurveTo(cx + midlineShift, cy, cx, cy + brainRy - 4);
  ctx.stroke();

  // Lateral ventricles (dark CSF butterfly shape in mid-slices 0.35..0.72)
  if (z > 0.3 && z < 0.75) {
    const vScale = Math.sin(((z - 0.3) / 0.45) * Math.PI);
    ctx.fillStyle = "#141820";
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(
        cx + midlineShift + side * (16 * vScale + 4),
        cy - 8,
        10 * vScale,
        34 * vScale,
        side * -0.22,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    // Choroid plexus calcifications
    ctx.fillStyle = "rgba(220, 228, 238, 0.7)";
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + midlineShift + side * 18, cy + 16, 3.2 * vScale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Frontal sinuses on lower slices
  if (z < 0.34) {
    ctx.fillStyle = "#06080c";
    ctx.beginPath();
    ctx.ellipse(cx, cy - brainRy + 10, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // TARGET PATHOLOGY: Acute Subdural Hematoma, Left Frontal (viewer's RIGHT side, anterior)
  if (sdhStrength > 0.02) {
    ctx.save();
    ctx.fillStyle = `rgba(226, 232, 240, ${(0.3 + sdhStrength * 0.62).toFixed(2)})`;
    ctx.beginPath();
    // Outer arc hugging inner table of left frontal skull (-PI/2 to -0.05)
    ctx.ellipse(cx, cy, brainRx, brainRy, 0, -Math.PI * 0.46, 0.08);
    // Inner concave margin compressing cortex
    const thickness = 16 * sdhStrength + 4;
    ctx.ellipse(
      cx - thickness * 0.55,
      cy + thickness * 0.35,
      brainRx - thickness,
      brainRy - thickness,
      0,
      0.08,
      -Math.PI * 0.46,
      true
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
  applySubtleScanNoise(ctx, size);
}

/**
 * Procedural Chest X-Ray (PA View on slice 1, Lateral View on slice 2).
 */
function renderChestXRay(ctx: CanvasRenderingContext2D, size: number, slice: number) {
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = "#07090d";
  ctx.fillRect(0, 0, size, size);

  if (slice === 2) {
    // Lateral Chest Radiograph
    const bgGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 240);
    bgGrad.addColorStop(0, "#38414e");
    bgGrad.addColorStop(1, "#0d1118");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(36, 24, size - 72, size - 48);

    // Thoracic spine posteriorly (right side)
    for (let v = 0; v < 11; v++) {
      ctx.fillStyle = "rgba(218, 226, 238, 0.55)";
      ctx.fillRect(332, 84 + v * 28, 26, 20);
    }
    // Retrocardiac & retrosternal clear spaces (darker radiolucent lung)
    ctx.fillStyle = "rgba(15, 20, 28, 0.72)";
    ctx.beginPath();
    ctx.ellipse(245, 230, 88, 138, 0.08, 0, Math.PI * 2);
    ctx.fill();
    // Cardiac silhouette anteriorly
    ctx.fillStyle = "rgba(186, 198, 214, 0.42)";
    ctx.beginPath();
    ctx.ellipse(205, 315, 58, 72, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Diaphragm domes
    ctx.strokeStyle = "rgba(220, 230, 242, 0.7)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(118, 392);
    ctx.quadraticCurveTo(220, 344, 360, 396);
    ctx.stroke();
    applySubtleScanNoise(ctx, size);
    return;
  }

  // PA Chest Radiograph
  // Outer collimated film borders
  ctx.fillStyle = "#0c1016";
  ctx.fillRect(46, 22, size - 92, size - 44);

  // Soft-tissue neck & shoulders
  const bodyGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 225);
  bodyGrad.addColorStop(0, "#707c8e");
  bodyGrad.addColorStop(0.65, "#475161");
  bodyGrad.addColorStop(1, "#181f29");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 56, 36);
  ctx.lineTo(cx + 56, 36);
  ctx.lineTo(cx + 186, 108);
  ctx.lineTo(cx + 178, 466);
  ctx.lineTo(cx - 178, 466);
  ctx.lineTo(cx - 186, 108);
  ctx.closePath();
  ctx.fill();

  // Aerated bilateral lung fields (radiolucent dark)
  for (const side of [-1, 1]) {
    const lx = cx + side * 78;
    const lungGrad = ctx.createRadialGradient(lx, cy - 10, 20, lx, cy - 10, 128);
    lungGrad.addColorStop(0, "#141a23");
    lungGrad.addColorStop(0.8, "#1c2430");
    lungGrad.addColorStop(1, "#2a3444");
    ctx.fillStyle = lungGrad;

    ctx.beginPath();
    ctx.moveTo(cx + side * 24, 92);
    ctx.bezierCurveTo(
      cx + side * 96,
      80,
      cx + side * 144,
      160,
      cx + side * 150,
      368
    );
    // Sharp costophrenic angle
    ctx.quadraticCurveTo(cx + side * 94, 342, cx + side * 24, 368);
    ctx.closePath();
    ctx.fill();

    // Posterior & anterior ribs across lung fields
    for (let r = 0; r < 8; r++) {
      const ry = 108 + r * 30;
      ctx.strokeStyle = "rgba(195, 208, 224, 0.24)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx + side * 22, ry - 10);
      ctx.quadraticCurveTo(cx + side * 95, ry - 18, cx + side * 142, ry + 14);
      ctx.stroke();
    }

    // Clavicles
    ctx.strokeStyle = "rgba(226, 234, 245, 0.62)";
    ctx.lineWidth = 6.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + side * 18, 108);
    ctx.quadraticCurveTo(cx + side * 78, 86, cx + side * 142, 98);
    ctx.stroke();
  }

  // Spine & mediastinal shadow
  ctx.fillStyle = "rgba(182, 194, 210, 0.42)";
  ctx.fillRect(cx - 22, 42, 44, 355);

  // Cardiac silhouette (prominently toward patient's left = viewer's right)
  const heartGrad = ctx.createRadialGradient(cx + 28, 290, 14, cx + 24, 290, 82);
  heartGrad.addColorStop(0, "rgba(218, 226, 238, 0.72)");
  heartGrad.addColorStop(1, "rgba(150, 164, 182, 0.2)");
  ctx.fillStyle = heartGrad;
  ctx.beginPath();
  ctx.ellipse(cx + 26, 292, 62, 74, -0.25, 0, Math.PI * 2);
  ctx.fill();

  // Diaphragm & subdiaphragmatic density
  ctx.fillStyle = "rgba(195, 206, 222, 0.62)";
  ctx.beginPath();
  ctx.moveTo(84, 376);
  ctx.quadraticCurveTo(cx - 72, 336, cx, 366);
  ctx.quadraticCurveTo(cx + 82, 344, 428, 382);
  ctx.lineTo(428, 466);
  ctx.lineTo(84, 466);
  ctx.closePath();
  ctx.fill();

  // Tracheal air column
  ctx.fillStyle = "rgba(12, 16, 22, 0.72)";
  ctx.fillRect(cx - 6, 42, 12, 128);

  applySubtleScanNoise(ctx, size);
}

function applySubtleScanNoise(ctx: CanvasRenderingContext2D, size: number) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    // Only add subtle medical grain inside active image pixels
    if (d[i] > 6) {
      const px = (i >> 2) % size;
      const py = (i >> 2) / size;
      const noise = (hash2(px, py) - 0.5) * 9;
      d[i] = Math.max(0, Math.min(255, d[i] + noise));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + noise));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + noise));
    }
  }
  ctx.putImageData(img, 0, 0);
}

/**
 * Main render entrypoint: composites base scan + window/contrast/brightness/invert +
 * zoom/pan + optional thermal heatmap + crisp AI bounding box & floating callout tag.
 */
export function renderScanViewport(
  canvas: HTMLCanvasElement,
  opts: RenderViewportOptions
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = "#06090f";
  ctx.fillRect(0, 0, width, height);

  const base = getBaseSliceCanvas(opts.study, opts.slice, opts.uploadedImage);

  const baseScale = Math.min(width / base.width, height / base.height) * 0.88;
  const drawSize = base.width * baseScale * opts.zoom;
  const dx = width / 2 - drawSize / 2 + opts.panX;
  const dy = height / 2 - drawSize / 2 + opts.panY;

  ctx.save();
  const brightPct = Math.max(20, 100 + opts.brightness);
  const contrastPct = Math.round(opts.contrast * 100);
  ctx.filter = `contrast(${contrastPct}%) brightness(${brightPct}%)${
    opts.invert ? " invert(100%)" : ""
  }`;
  ctx.drawImage(base, dx, dy, drawSize, drawSize);
  ctx.restore();

  const { finding, triage } = opts.study;
  const [minSlice, maxSlice] = finding.visibleRange;
  const inSliceRange = opts.slice >= minSlice && opts.slice <= maxSlice;

  // Thermal Heatmap overlay
  if (opts.showHeatmap && inSliceRange) {
    const bx = dx + finding.bbox.x * drawSize;
    const by = dy + finding.bbox.y * drawSize;
    const bw = finding.bbox.w * drawSize;
    const bh = finding.bbox.h * drawSize;
    const hcx = bx + bw / 2;
    const hcy = by + bh / 2;
    const hRadius = Math.max(bw, bh) * 0.95;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const heatGrad = ctx.createRadialGradient(hcx, hcy, 2, hcx, hcy, hRadius);
    if (triage === "routine") {
      heatGrad.addColorStop(0, "rgba(20, 184, 166, 0.55)");
      heatGrad.addColorStop(0.55, "rgba(13, 148, 136, 0.24)");
      heatGrad.addColorStop(1, "rgba(13, 148, 136, 0)");
    } else {
      heatGrad.addColorStop(0, "rgba(244, 63, 94, 0.72)");
      heatGrad.addColorStop(0.38, "rgba(245, 158, 11, 0.48)");
      heatGrad.addColorStop(0.72, "rgba(20, 184, 166, 0.2)");
      heatGrad.addColorStop(1, "rgba(20, 184, 166, 0)");
    }
    ctx.fillStyle = heatGrad;
    ctx.beginPath();
    ctx.arc(hcx, hcy, hRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // AI Overlay: crisp dashed bounding box + corner brackets + floating callout tag
  if (opts.showAiOverlay && inSliceRange) {
    const bx = dx + finding.bbox.x * drawSize;
    const by = dy + finding.bbox.y * drawSize;
    const bw = finding.bbox.w * drawSize;
    const bh = finding.bbox.h * drawSize;

    const accent =
      triage === "critical"
        ? "#f43f5e"
        : triage === "routine"
        ? "#14b8a6"
        : "#f59e0b";
    const fillRgba =
      triage === "critical"
        ? "rgba(244, 63, 94, 0.08)"
        : triage === "routine"
        ? "rgba(20, 184, 166, 0.05)"
        : "rgba(245, 158, 11, 0.08)";

    ctx.save();
    // Subtle inner tint
    ctx.fillStyle = fillRgba;
    ctx.fillRect(bx, by, bw, bh);

    // Crisp dashed bounding box
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(bx, by, bw, bh);
    ctx.setLineDash([]);

    // Solid L-shaped corner brackets
    const cornerLen = Math.max(8, Math.min(16, Math.min(bw, bh) * 0.24));
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = accent;
    const corners: [number, number, number, number][] = [
      [bx, by, 1, 1],
      [bx + bw, by, -1, 1],
      [bx, by + bh, 1, -1],
      [bx + bw, by + bh, -1, -1],
    ];
    for (const [cx0, cy0, sx, sy] of corners) {
      ctx.beginPath();
      ctx.moveTo(cx0 + sx * cornerLen, cy0);
      ctx.lineTo(cx0, cy0);
      ctx.lineTo(cx0, cy0 + sy * cornerLen);
      ctx.stroke();
    }

    // Floating callout tag
    const label = finding.calloutTag;
    ctx.font = '600 11px "JetBrains Mono", ui-monospace, monospace';
    const textMetrics = ctx.measureText(label);
    const padX = 8;
    const tagW = textMetrics.width + padX * 2 + 12;
    const tagH = 22;
    let tagX = bx;
    let tagY = by - tagH - 8;
    if (tagY < 14) tagY = by + bh + 8;
    if (tagX + tagW > width - 12) tagX = width - tagW - 12;

    // Leader line connecting box to tag
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx + bw / 2, tagY < by ? by : by + bh);
    ctx.lineTo(tagX + 16, tagY < by ? tagY + tagH : tagY);
    ctx.stroke();

    // Tag pill background
    ctx.fillStyle = "rgba(10, 15, 24, 0.92)";
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tagW, tagH, 5);
    ctx.fill();
    ctx.stroke();

    // Status dot inside tag
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(tagX + 10, tagY + tagH / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Tag text
    ctx.fillStyle = "#f1f5f9";
    ctx.textBaseline = "middle";
    ctx.fillText(label, tagX + 18, tagY + tagH / 2 + 0.5);

    ctx.restore();
  }
}
