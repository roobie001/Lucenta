export type TriageLevel = "priority" | "critical" | "routine";
export type ReviewDecision = "pending" | "confirmed" | "dismissed";

export interface StudyFinding {
  finding: string;
  shortFinding: string;
  confidence: number;
  region: string;
  calloutTag: string;
  recommendedReview: string;
  /** Normalized coordinates (0..1) on the 512x512 scan canvas */
  bbox: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  /** Slice range where the finding is visible, and peak slice */
  peakSlice: number;
  visibleRange: [number, number];
  confirmedReportSentence: string;
  dismissedReportSentence: string;
}

export interface DemoStudy {
  id: string;
  filename: string;
  patientId: string;
  patientMeta: string;
  modality: "CT" | "CR/DX" | "LOCAL";
  seriesCount: number;
  totalSlices: number;
  defaultSlice: number;
  triage: TriageLevel;
  studyKind: "ct-chest" | "ct-head" | "xr-chest" | "uploaded";
  finding: StudyFinding;
  initialReport: string;
  windowPreset: {
    label: string;
    ww: number;
    wl: number;
  };
  uploadedImageUrl?: string;
  dicomPixelData?: {
    width: number;
    height: number;
    pixels: Float32Array;
    minVal: number;
    maxVal: number;
  };
}

export const INITIAL_DEMO_STUDIES: DemoStudy[] = [
  {
    id: "ct-chest-0417",
    filename: "CT_CHEST_0417.dcm",
    patientId: "****3821",
    patientMeta: "62M • Chest CT w/o Contrast",
    modality: "CT",
    seriesCount: 3,
    totalSlices: 214,
    defaultSlice: 118,
    triage: "priority",
    studyKind: "ct-chest",
    windowPreset: { label: "Lung Window", ww: 1500, wl: -600 },
    finding: {
      finding: "Pulmonary nodule, right upper lobe",
      shortFinding: "Pulmonary nodule, RUL",
      confidence: 94.2,
      region: "RUL, segment 3",
      calloutTag: "RUL, segment 3 • 94.2%",
      recommendedReview: "Priority, needs radiologist sign-off",
      bbox: { x: 0.275, y: 0.34, w: 0.14, h: 0.14 },
      peakSlice: 118,
      visibleRange: [94, 142],
      confirmedReportSentence:
        "VERIFIED AI FINDING: 10 mm solid pulmonary nodule in the anterior segment of the right upper lobe (RUL, segment 3; Series 2, Slice 118/214) — confirmed by reviewing radiologist. Recommend 3-month follow-up CT or PET-CT correlation per Fleischner Society guidelines.",
      dismissedReportSentence:
        "AI FLAG REVIEWED & DISMISSED: Candidate RUL segment 3 focus (94.2% confidence) reviewed on Slices 94–142 and determined to represent normal pulmonary vascular confluence / partial volume artifact.",
    },
    initialReport: `EXAMINATION: CT Chest without IV contrast (Sample Study)
CLINICAL INDICATION: Persistent cough; screening evaluation.

TECHNIQUE: Helical axial CT acquisition of the thorax reconstructed at 1.25 mm slice thickness in lung and mediastinal windows.

FINDINGS:
- Lungs & Airways: Trachea and mainstem bronchi are patent. A 10 mm circumscribed, mildly lobulated non-calcified pulmonary nodule is flagged in the anterior segment of the right upper lobe (RUL, segment 3, slice 118/214). No pleural effusion or pneumothorax.
- Mediastinum & Heart: Heart size is within normal limits. No pericardial effusion. No pathologically enlarged mediastinal or hilar lymph nodes.
- Osseous Structures: Visualized thoracic spine and ribs are intact without acute fracture.

IMPRESSION:
1. Priority AI-flagged 10 mm right upper lobe pulmonary nodule (RUL, segment 3) awaiting radiologist confirmation.`,
  },
  {
    id: "ct-head-0912",
    filename: "CT_HEAD_0912.dcm",
    patientId: "****7409",
    patientMeta: "71F • Non-Contrast Head CT",
    modality: "CT",
    seriesCount: 2,
    totalSlices: 160,
    defaultSlice: 84,
    triage: "critical",
    studyKind: "ct-head",
    windowPreset: { label: "Brain Window", ww: 80, wl: 40 },
    finding: {
      finding: "Subdural hematoma, left frontal",
      shortFinding: "Subdural hematoma, left frontal",
      confidence: 96.8,
      region: "Left frontal convexity",
      calloutTag: "L Frontal SDH • 96.8%",
      recommendedReview: "Critical, immediate neurosurgical alert",
      bbox: { x: 0.56, y: 0.21, w: 0.21, h: 0.26 },
      peakSlice: 84,
      visibleRange: [52, 118],
      confirmedReportSentence:
        "VERIFIED CRITICAL FINDING: Acute crescentic left frontal subdural hematoma measuring up to 11 mm in thickness with local sulcal effacement and ~3 mm rightward midline shift (Slice 84/160) — confirmed by reviewing radiologist. Urgent neurosurgical consultation notified.",
      dismissedReportSentence:
        "AI FLAG REVIEWED & DISMISSED: Candidate left frontal hyperdensity (96.8% confidence) reviewed and attributed to beam-hardening / partial volume skull interface artifact.",
    },
    initialReport: `EXAMINATION: CT Head without IV contrast (Sample Study)
CLINICAL INDICATION: Mechanical fall, mild confusion.

TECHNIQUE: Non-contrast axial CT of the brain at 2.5 mm intervals from skull base to vertex.

FINDINGS:
- Extra-Axial Spaces: Crescent-shaped hyperdense extra-axial fluid collection along the left frontal convexity measuring ~11 mm in maximal thickness, consistent with an acute subdural hematoma. Mild local mass effect with effacement of adjacent left frontal sulci.
- Brain Parenchyma: Gray-white matter differentiation is otherwise preserved. No acute territorial infarction. Minimal (~3 mm) rightward subfalcine shift.
- Ventricles & Cisterns: Mildly asymmetric compression of the left frontal horn. Basal cisterns remain patent.
- Calvarium: No displaced calvarial fracture identified.

IMPRESSION:
1. Critical AI-flagged acute left frontal subdural hematoma with mild mass effect — pending immediate radiologist sign-off.`,
  },
  {
    id: "xr-chest-1104",
    filename: "XR_CHEST_1104.dcm",
    patientId: "****2195",
    patientMeta: "38M • PA Chest Radiograph",
    modality: "CR/DX",
    seriesCount: 1,
    totalSlices: 2,
    defaultSlice: 1,
    triage: "routine",
    studyKind: "xr-chest",
    windowPreset: { label: "CXR Standard", ww: 2048, wl: 1024 },
    finding: {
      finding: "No acute cardiopulmonary finding",
      shortFinding: "No acute cardiopulmonary finding",
      confidence: 98.5,
      region: "Bilateral lung fields & mediastinum",
      calloutTag: "Normal Baseline • 98.5%",
      recommendedReview: "Routine, cleared for standard sign-off",
      bbox: { x: 0.22, y: 0.21, w: 0.56, h: 0.56 },
      peakSlice: 1,
      visibleRange: [1, 2],
      confirmedReportSentence:
        "VERIFIED NORMAL BASELINE: Bilateral lung fields are clear without focal consolidation, pneumothorax, or pleural effusion. Cardiothoracic ratio is within normal limits — confirmed by reviewing radiologist.",
      dismissedReportSentence:
        "AI BASELINE OVERRIDDEN: Radiologist noted subtle finding requiring manual dictation outside routine normal template.",
    },
    initialReport: `EXAMINATION: Chest Radiograph, PA and Lateral Views (Sample Study)
CLINICAL INDICATION: Pre-employment screening.

FINDINGS:
- Lungs & Pleura: The lungs are well-expanded and clear bilaterally. No focal airspace consolidation, pulmonary mass, pleural effusion, or pneumothorax. Costophrenic angles are sharp.
- Heart & Mediastinum: Cardiothoracic ratio is normal. Mediastinal contours and aortic knob are unremarkable.
- Bones & Soft Tissues: Visualized osseous thorax is intact.

IMPRESSION:
1. No acute cardiopulmonary disease.`,
  },
];
