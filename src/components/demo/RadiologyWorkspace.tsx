"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  INITIAL_DEMO_STUDIES,
  type DemoStudy,
  type ReviewDecision,
} from "@/lib/demo-studies";
import { parseBasicDicom } from "@/lib/dicom-parser";
import { renderScanViewport } from "@/lib/scan-renderer";

interface StudyState {
  slice: number;
  decision: ReviewDecision;
  signedOffAt: string | null;
  reportText: string;
}

type MobileTab = "worklist" | "viewer" | "report";

function formatSignOffTimestamp(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function updateReportWithDecision(
  currentText: string,
  study: DemoStudy,
  decision: "confirmed" | "dismissed"
): string {
  const confirmedLine = study.finding.confirmedReportSentence;
  const dismissedLine = study.finding.dismissedReportSentence;

  // Remove any previously injected AI decision block so toggling Confirm/Dismiss stays clean
  const cleaned = currentText
    .replace(`\n\n${confirmedLine}`, "")
    .replace(`\n\n${dismissedLine}`, "")
    .replace(confirmedLine, "")
    .replace(dismissedLine, "")
    .trimEnd();

  const appended = decision === "confirmed" ? confirmedLine : dismissedLine;
  return `${cleaned}\n\n${appended}`;
}

export function RadiologyWorkspace({ userEmail }: { userEmail: string | null }) {
  const [studies, setStudies] = useState<DemoStudy[]>(INITIAL_DEMO_STUDIES);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_DEMO_STUDIES[0].id);
  const [worklistFilter, setWorklistFilter] = useState<"all" | "priority">("all");
  const [mobileTab, setMobileTab] = useState<MobileTab>("viewer");

  const [studyStates, setStudyStates] = useState<Record<string, StudyState>>(() => {
    const initial: Record<string, StudyState> = {};
    for (const s of INITIAL_DEMO_STUDIES) {
      initial[s.id] = {
        slice: s.defaultSlice,
        decision: "pending",
        signedOffAt: null,
        reportText: s.initialReport,
      };
    }
    return initial;
  });

  // Viewer controls
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [invert, setInvert] = useState(false);
  const [contrast, setContrast] = useState(1.08);
  const [brightness, setBrightness] = useState(2);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  // Uploaded image elements cache keyed by studyId
  const uploadedImagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Canvas & container refs
  const viewportContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Drag-to-pan state
  const dragRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    origPanX: number;
    origPanY: number;
  }>({ dragging: false, startX: 0, startY: 0, origPanX: 0, origPanY: 0 });

  // Confirmation modal / toast state
  const [signOffModal, setSignOffModal] = useState<{
    studyFilename: string;
    timestamp: string;
    reportText: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeStudy = useMemo(
    () => studies.find((s) => s.id === selectedId) ?? studies[0],
    [studies, selectedId]
  );
  const activeState = studyStates[activeStudy.id];

  const visibleStudies = useMemo(() => {
    if (worklistFilter === "all") return studies;
    return studies.filter(
      (s) => s.triage === "priority" || s.triage === "critical"
    );
  }, [studies, worklistFilter]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const handleSelectStudy = (study: DemoStudy) => {
    setSelectedId(study.id);
    setIsPlaying(false);
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setMobileTab("viewer");
  };

  const setActiveSlice = useCallback(
    (nextSlice: number) => {
      setStudyStates((prev) => {
        const cur = prev[activeStudy.id];
        if (!cur) return prev;
        const clamped = Math.max(1, Math.min(activeStudy.totalSlices, nextSlice));
        return {
          ...prev,
          [activeStudy.id]: { ...cur, slice: clamped },
        };
      });
    },
    [activeStudy.id, activeStudy.totalSlices]
  );

  // Cine loop playback
  useEffect(() => {
    if (!isPlaying || activeStudy.totalSlices <= 1) return;
    const interval = setInterval(() => {
      setStudyStates((prev) => {
        const cur = prev[activeStudy.id];
        if (!cur) return prev;
        const next = cur.slice >= activeStudy.totalSlices ? 1 : cur.slice + 1;
        return {
          ...prev,
          [activeStudy.id]: { ...cur, slice: next },
        };
      });
    }, 85);
    return () => clearInterval(interval);
  }, [isPlaying, activeStudy.id, activeStudy.totalSlices]);

  // Draw canvas whenever parameters or container size change
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = viewportContainerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Render in logical CSS coordinates scaled by DPR
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    renderScanViewport(canvas, {
      study: activeStudy,
      slice: activeState.slice,
      contrast,
      brightness,
      invert,
      zoom,
      panX: pan.x * dpr,
      panY: pan.y * dpr,
      showAiOverlay,
      showHeatmap,
      uploadedImage: uploadedImagesRef.current[activeStudy.id] ?? null,
    });
    ctx.restore();
  }, [
    activeStudy,
    activeState.slice,
    contrast,
    brightness,
    invert,
    zoom,
    pan.x,
    pan.y,
    showAiOverlay,
    showHeatmap,
  ]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    const container = viewportContainerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      drawCanvas();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawCanvas]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    setZoom((z) => Math.max(0.6, Math.min(3.5, Number((z + delta).toFixed(2)))));
  };

  // Click-drag pan
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origPanX: pan.x,
      origPanY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({
      x: dragRef.current.origPanX + dx,
      y: dragRef.current.origPanY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.dragging) {
      dragRef.current.dragging = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture already released
      }
    }
  };

  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setContrast(1.08);
    setBrightness(2);
    setInvert(false);
  };

  // Human-in-the-loop Confirm / Dismiss
  const handleDecision = (decision: "confirmed" | "dismissed") => {
    setStudyStates((prev) => {
      const cur = prev[activeStudy.id];
      if (!cur) return prev;
      return {
        ...prev,
        [activeStudy.id]: {
          ...cur,
          decision,
          reportText: updateReportWithDecision(cur.reportText, activeStudy, decision),
        },
      };
    });
    showToast(
      decision === "confirmed"
        ? `Confirmed AI flag on ${activeStudy.filename} — appended to report.`
        : `Dismissed AI flag on ${activeStudy.filename} — report updated.`
    );
  };

  // Finalize & Sign Report
  const handleFinalizeAndSign = () => {
    const timestamp = formatSignOffTimestamp(new Date());
    const signerLabel = userEmail
      ? `Signed off by Attending Radiologist (${userEmail})`
      : "Signed off by Attending Radiologist";
    const signFooter = `\n\n----------------------------------------\n${signerLabel} • ${timestamp}\nStatus: Ready for PACS`;

    let finalReport = activeState.reportText;
    if (!finalReport.includes("Status: Ready for PACS")) {
      finalReport = `${finalReport.trimEnd()}${signFooter}`;
    }

    setStudyStates((prev) => ({
      ...prev,
      [activeStudy.id]: {
        ...prev[activeStudy.id],
        decision:
          prev[activeStudy.id].decision === "dismissed" ? "dismissed" : "confirmed",
        signedOffAt: timestamp,
        reportText: finalReport,
      },
    }));

    setSignOffModal({
      studyFilename: activeStudy.filename,
      timestamp,
      reportText: finalReport,
    });
  };

  const handleDownloadReport = (filename: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename.replace(/\.[^.]+$/, "")}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Structured radiology report exported (.txt).");
  };

  const handleCopyReport = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Signed report copied to clipboard.");
    } catch {
      showToast("Unable to access clipboard in this browser context.");
    }
  };

  // Local DICOM / Image Upload Handler
  const handleLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const lower = file.name.toLowerCase();
    const id = `local-${Date.now()}`;

    if (lower.endsWith(".dcm")) {
      try {
        const buffer = await file.arrayBuffer();
        const parsed = parseBasicDicom(buffer);

        const newStudy: DemoStudy = {
          id,
          filename: file.name,
          patientId: parsed?.patientId ? parsed.patientId.slice(0, 12) : "LOCAL-001",
          patientMeta: parsed?.parsedPixels
            ? `Local DICOM • ${parsed.cols}×${parsed.rows}`
            : "Local DICOM File (Preview Mode)",
          modality: (parsed?.modality as DemoStudy["modality"]) || "CT",
          seriesCount: 1,
          totalSlices: 1,
          defaultSlice: 1,
          triage: "priority",
          studyKind: parsed?.parsedPixels ? "uploaded" : "ct-chest",
          windowPreset: {
            label: "DICOM Auto",
            ww: parsed?.windowWidth ?? 1500,
            wl: parsed?.windowCenter ?? 40,
          },
          dicomPixelData:
            parsed?.parsedPixels && parsed.pixels
              ? {
                  width: parsed.cols,
                  height: parsed.rows,
                  pixels: parsed.pixels,
                  minVal: parsed.minVal,
                  maxVal: parsed.maxVal,
                }
              : undefined,
          finding: {
            finding: "Local DICOM loaded — awaiting manual review",
            shortFinding: "Local DICOM preview",
            confidence: 91.4,
            region: "Uploaded frame 1/1",
            calloutTag: "Local Preview • 91.4%",
            recommendedReview: "Priority, manual radiologist verification",
            bbox: { x: 0.32, y: 0.32, w: 0.36, h: 0.36 },
            peakSlice: 1,
            visibleRange: [1, 1],
            confirmedReportSentence:
              "VERIFIED LOCAL STUDY: Radiologist completed interactive visual inspection of locally loaded DICOM frame.",
            dismissedReportSentence:
              "AI OVERLAY DISMISSED: Local DICOM study reviewed manually without AI region callout.",
          },
          initialReport: `EXAMINATION: Local DICOM Preview (${file.name})
NOTE: Rendered strictly in-browser; no image data was transmitted off-device.

FINDINGS:
- ${
            parsed?.parsedPixels
              ? `Uncompressed ${parsed.cols}x${parsed.rows} DICOM pixel buffer decoded locally.`
              : "Compressed or non-standard DICOM transfer syntax detected; showing reference anatomical preview alongside extracted header."
          }

IMPRESSION:
1. Local study ready for radiologist inspection and manual reporting.`,
        };

        setStudies((prev) => [newStudy, ...prev]);
        setStudyStates((prev) => ({
          ...prev,
          [id]: {
            slice: 1,
            decision: "pending",
            signedOffAt: null,
            reportText: newStudy.initialReport,
          },
        }));
        setSelectedId(id);
        setZoom(1.0);
        setPan({ x: 0, y: 0 });
        showToast(`Loaded ${file.name} locally in browser.`);
      } catch {
        showToast("Could not read DICOM file locally.");
      }
      return;
    }

    // PNG / JPG local preview
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      uploadedImagesRef.current[id] = img;
      const newStudy: DemoStudy = {
        id,
        filename: file.name,
        patientId: "LOCAL-IMG",
        patientMeta: `Local Image • ${img.width}×${img.height}`,
        modality: "LOCAL",
        seriesCount: 1,
        totalSlices: 1,
        defaultSlice: 1,
        triage: "priority",
        studyKind: "uploaded",
        uploadedImageUrl: objectUrl,
        windowPreset: { label: "Standard 8-bit", ww: 255, wl: 128 },
        finding: {
          finding: "Local image loaded — ready for visual review",
          shortFinding: "Local image preview",
          confidence: 92.0,
          region: "Primary image ROI",
          calloutTag: "Sample ROI • 92.0%",
          recommendedReview: "Priority, needs radiologist sign-off",
          bbox: { x: 0.3, y: 0.28, w: 0.4, h: 0.4 },
          peakSlice: 1,
          visibleRange: [1, 1],
          confirmedReportSentence:
            "VERIFIED LOCAL IMAGE: Radiologist confirmed findings on locally previewed study.",
          dismissedReportSentence:
            "AI OVERLAY DISMISSED: Local image reviewed manually without AI region callout.",
        },
        initialReport: `EXAMINATION: Local Image Preview (${file.name})
NOTE: Processed strictly client-side in your browser; no upload occurred.

FINDINGS:
- Image dimensions: ${img.width} × ${img.height} px. Interactive window/contrast, brightness, invert, zoom, and pan controls enabled.

IMPRESSION:
1. Local study ready for radiologist annotation and sign-off.`,
      };

      setStudies((prev) => [newStudy, ...prev]);
      setStudyStates((prev) => ({
        ...prev,
        [id]: {
          slice: 1,
          decision: "pending",
          signedOffAt: null,
          reportText: newStudy.initialReport,
        },
      }));
      setSelectedId(id);
      setZoom(1.0);
      setPan({ x: 0, y: 0 });
      showToast(`Previewing ${file.name} locally.`);
    };
    img.src = objectUrl;
  };

  const triageBadgeStyles = (triage: DemoStudy["triage"]) => {
    if (triage === "critical") {
      return "border-[#f43f5e]/40 bg-[#f43f5e]/15 text-[#fb7185]";
    }
    if (triage === "routine") {
      return "border-[#14b8a6]/40 bg-[#14b8a6]/15 text-[#14b8a6]";
    }
    return "border-[#f59e0b]/40 bg-[#f59e0b]/15 text-[#fbbf24]";
  };

  const triageLabel = (triage: DemoStudy["triage"]) => {
    if (triage === "critical") return "Critical";
    if (triage === "routine") return "Routine";
    return "Priority";
  };

  const getWorklistStatusDisplay = (study: DemoStudy, state: StudyState) => {
    if (state.signedOffAt) {
      return { text: "Signed Off", cls: "text-[#14b8a6]" };
    }
    if (state.decision === "confirmed") {
      return { text: "Verified", cls: "text-[#14b8a6]" };
    }
    if (state.decision === "dismissed") {
      return { text: "Dismissed", cls: "text-slate-400" };
    }
    if (study.triage === "routine") {
      return { text: "Ready", cls: "text-[#14b8a6]" };
    }
    return { text: "Needs Sign-Off", cls: "text-[#f59e0b]" };
  };

  const aiSummaryStatus = activeState.signedOffAt
    ? "SIGNED OFF"
    : activeState.decision === "confirmed"
    ? "VERIFIED"
    : activeState.decision === "dismissed"
    ? "DISMISSED"
    : "PROCESSED";

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0a0f18] text-slate-200 select-none">
      {/* Hidden file input for local DICOM/PNG/JPG preview */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".dcm,.png,.jpg,.jpeg"
        onChange={handleLocalUpload}
        className="hidden"
      />

      {/* COMPACT TOP BAR (52px) */}
      <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-[#1e293b] bg-[#0d131f] px-3 sm:px-4">
        {/* Top Bar Left: Logo + Wordmark + Breadcrumb + SAMPLE DATASET pill */}
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-90"
            title="Back to Lucentaa home"
          >
            <svg
              viewBox="0 0 128 128"
              className="h-7 w-7 shrink-0"
              aria-hidden="true"
            >
              <rect width="128" height="128" rx="28" fill="#06090f" />
              <circle
                cx="64"
                cy="64"
                r="36"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="7"
              />
              <rect x="24" y="61" width="80" height="6" rx="3" fill="#14b8a6" />
              <circle cx="88" cy="40" r="6" fill="#f59e0b" />
            </svg>
            <span className="text-sm font-bold tracking-tight text-slate-100">
              Lucent<span className="text-[#14b8a6]">aa</span>
            </span>
          </Link>

          <span className="hidden text-slate-600 sm:inline">/</span>
          <span className="hidden truncate text-xs font-medium text-slate-300 sm:inline">
            Clinical Review Workspace
          </span>

          <span className="hidden shrink-0 items-center rounded-full border border-[#14b8a6]/35 bg-[#14b8a6]/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#14b8a6] md:inline-flex">
            SAMPLE DATASET
          </span>
        </div>

        {/* Top Bar Center: Active study metadata strip */}
        <div className="hidden min-w-0 items-center gap-2 rounded-md border border-[#1e293b] bg-[#06090f] px-3 py-1 font-mono text-[11px] text-slate-300 xl:flex">
          <span className="font-semibold text-slate-100">{activeStudy.filename}</span>
          <span className="text-slate-600">•</span>
          <span>Patient ID: {activeStudy.patientId}</span>
          <span className="text-slate-600">•</span>
          <span>Modality: {activeStudy.modality}</span>
          <span className="text-slate-600">•</span>
          <span className="text-[#14b8a6]">
            Series: {activeStudy.seriesCount} / Slices: {activeStudy.totalSlices}
          </span>
        </div>

        {/* Top Bar Right: Demo Badge + Upload + Sign-Off & Export + Back to / */}
        <div className="flex shrink-0 items-center gap-2">
          <span
            title={
              userEmail
                ? `Signed in as ${userEmail} (Sample Data)`
                : "Guest demo access — static sample data only"
            }
            className="hidden items-center gap-1.5 rounded border border-[#1e293b] bg-[#111827] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 2xl:inline-flex"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#14b8a6]" />
            DEMO WORKSPACE • SAMPLE DATA
          </span>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#1e293b] bg-[#111827] px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-[#14b8a6]/50 hover:text-white"
            title="Preview a local .dcm, .png, or .jpg scan in browser"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              className="h-3.5 w-3.5 text-[#14b8a6]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 13V4m0 0L6.5 7.5M10 4l3.5 3.5M4 13.5v1.75A1.75 1.75 0 005.75 17h8.5A1.75 1.75 0 0016 15.25V13.5"
              />
            </svg>
            <span className="hidden sm:inline">Upload DICOM</span>
          </button>

          <button
            type="button"
            onClick={handleFinalizeAndSign}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0d9488] px-3 py-1.5 text-xs font-semibold text-[#06090f] transition-all hover:bg-[#14b8a6] hover:shadow-[0_0_16px_rgba(20,184,166,0.35)]"
          >
            <span>Sign-Off &amp; Export Report</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md border border-[#1e293b] px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-100"
          >
            <span>←</span>
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </header>

      {/* Mobile/Tablet Section Switcher (< lg) */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#1e293b] bg-[#0d131f] px-3 py-1.5 lg:hidden">
        <div className="flex gap-1">
          {(
            [
              { id: "worklist", label: `Worklist (${visibleStudies.length})` },
              { id: "viewer", label: "Scan Viewer" },
              { id: "report", label: "AI Summary & Report" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileTab(tab.id)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                mobileTab === tab.id
                  ? "bg-[#14b8a6]/15 text-[#14b8a6]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[10px] text-slate-400">
          {activeStudy.filename}
        </span>
      </div>

      {/* THREE-COLUMN WORKSPACE BODY */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* LEFT SIDEBAR (280px) — AI-TRIAGED WORKLIST */}
        <aside
          className={`${
            mobileTab === "worklist" ? "flex w-full" : "hidden"
          } shrink-0 flex-col border-r border-[#1e293b] bg-[#0d131f] lg:flex lg:w-[280px]`}
        >
          <div className="flex items-center justify-between border-b border-[#1e293b] px-3.5 py-3">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              WORKLIST ({visibleStudies.length})
            </h2>
            <div className="inline-flex rounded-md border border-[#1e293b] bg-[#06090f] p-0.5">
              <button
                type="button"
                onClick={() => setWorklistFilter("all")}
                className={`rounded px-2 py-0.5 font-mono text-[10px] transition-colors ${
                  worklistFilter === "all"
                    ? "bg-[#1e293b] text-slate-100"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setWorklistFilter("priority")}
                className={`rounded px-2 py-0.5 font-mono text-[10px] transition-colors ${
                  worklistFilter === "priority"
                    ? "bg-[#f59e0b]/20 text-[#fbbf24]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Priority
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
            {visibleStudies.map((study) => {
              const state = studyStates[study.id];
              const isSelected = study.id === activeStudy.id;
              const statusInfo = getWorklistStatusDisplay(study, state);

              return (
                <button
                  key={study.id}
                  type="button"
                  onClick={() => handleSelectStudy(study)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    isSelected
                      ? "border-[#14b8a6]/60 bg-[#111827] shadow-[0_0_16px_rgba(20,184,166,0.12)]"
                      : "border-[#1e293b] bg-[#111827]/55 hover:border-slate-700 hover:bg-[#111827]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${triageBadgeStyles(
                        study.triage
                      )}`}
                    >
                      {triageLabel(study.triage)}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[#14b8a6]">
                      {study.finding.confidence.toFixed(1)}%
                    </span>
                  </div>

                  <div className="mt-2 truncate font-mono text-xs font-semibold text-slate-100">
                    {study.filename}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                    Patient {study.patientId} • {study.modality}
                  </div>

                  <p
                    className={`mt-2 text-xs font-medium leading-snug ${
                      study.triage === "critical"
                        ? "text-[#fb7185]"
                        : study.triage === "routine"
                        ? "text-slate-300"
                        : "text-[#fbbf24]"
                    }`}
                  >
                    {study.finding.shortFinding}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between border-t border-[#1e293b] pt-2 font-mono text-[10px]">
                    <span className="text-slate-500">
                      {study.totalSlices} slices
                    </span>
                    <span className={`font-medium ${statusInfo.cls}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[#1e293b] bg-[#0a0f18]/70 px-3.5 py-2.5 font-mono text-[10px] leading-relaxed text-slate-500">
            DEMO WORKSPACE • SAMPLE DATA
            <br />
            Sorted by AI clinical urgency score.
          </div>
        </aside>

        {/* CENTER VIEWPORT (FLEX-GROW) — INTERACTIVE SCAN CANVAS */}
        <section
          className={`${
            mobileTab === "viewer" ? "flex" : "hidden"
          } relative min-w-0 flex-1 flex-col bg-[#06090f] lg:flex`}
        >
          {/* Floating Top Viewer Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e293b] bg-[#0d131f]/90 px-3 py-2 backdrop-blur-sm">
            {/* Toggle switches */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowAiOverlay((v) => !v)}
                aria-pressed={showAiOverlay}
                className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  showAiOverlay
                    ? "border-[#f59e0b]/50 bg-[#f59e0b]/15 text-[#fbbf24]"
                    : "border-[#1e293b] bg-[#111827] text-slate-400 hover:text-slate-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    showAiOverlay ? "bg-[#f59e0b]" : "bg-slate-600"
                  }`}
                />
                AI Overlay
              </button>

              <button
                type="button"
                onClick={() => setShowHeatmap((v) => !v)}
                aria-pressed={showHeatmap}
                className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  showHeatmap
                    ? "border-[#f43f5e]/50 bg-[#f43f5e]/15 text-[#fb7185]"
                    : "border-[#1e293b] bg-[#111827] text-slate-400 hover:text-slate-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    showHeatmap ? "bg-[#f43f5e]" : "bg-slate-600"
                  }`}
                />
                Heatmap
              </button>

              <button
                type="button"
                onClick={() => setInvert((v) => !v)}
                aria-pressed={invert}
                className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  invert
                    ? "border-[#14b8a6]/50 bg-[#14b8a6]/15 text-[#14b8a6]"
                    : "border-[#1e293b] bg-[#111827] text-slate-400 hover:text-slate-200"
                }`}
              >
                Invert
              </button>
            </div>

            {/* Sliders: Window / Contrast, Brightness, Zoom */}
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <label className="flex items-center gap-1.5 font-mono text-slate-400">
                <span className="hidden sm:inline">Window</span>
                <span className="sm:hidden">W</span>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.02}
                  value={contrast}
                  onChange={(e) => setContrast(parseFloat(e.target.value))}
                  className="h-1 w-16 cursor-pointer accent-[#14b8a6] sm:w-20"
                />
              </label>

              <label className="flex items-center gap-1.5 font-mono text-slate-400">
                <span className="hidden sm:inline">Bright</span>
                <span className="sm:hidden">B</span>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  step={1}
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="h-1 w-16 cursor-pointer accent-[#14b8a6] sm:w-20"
                />
              </label>

              <label className="flex items-center gap-1.5 font-mono text-slate-400">
                <span>Zoom</span>
                <input
                  type="range"
                  min={0.6}
                  max={3.5}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="h-1 w-16 cursor-pointer accent-[#14b8a6] sm:w-20"
                />
                <span className="w-9 text-right text-[#14b8a6]">
                  {zoom.toFixed(1)}x
                </span>
              </label>

              <button
                type="button"
                onClick={resetView}
                className="rounded border border-[#1e293b] bg-[#111827] px-2 py-0.5 font-mono text-[10px] text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Interactive HTML5 Scan Canvas Container */}
          <div
            ref={viewportContainerRef}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={resetView}
            className="relative min-h-0 flex-1 cursor-grab overflow-hidden bg-[#06090f] active:cursor-grabbing"
          >
            <canvas ref={canvasRef} className="block h-full w-full" />

            {/* PACS HUD Corner Annotations */}
            <div className="pointer-events-none absolute left-3.5 top-3 space-y-0.5 font-mono text-[11px] leading-tight text-slate-400/90">
              <div className="font-semibold text-slate-200">
                {activeStudy.patientMeta}
              </div>
              <div>
                Patient ID: {activeStudy.patientId} • {activeStudy.modality}
              </div>
              <div>
                {activeStudy.windowPreset.label} (WL {activeStudy.windowPreset.wl} / WW{" "}
                {activeStudy.windowPreset.ww})
              </div>
            </div>

            <div className="pointer-events-none absolute right-3.5 top-3 space-y-0.5 text-right font-mono text-[11px] leading-tight text-slate-400/90">
              <div className="text-[#14b8a6]">LUCENTAA AI • FIRST PASS</div>
              <div>
                Slice: {activeState.slice} / {activeStudy.totalSlices}
              </div>
              <div>Zoom: {(zoom * 100).toFixed(0)}%</div>
            </div>

            {/* Anatomical orientation markers */}
            {activeStudy.studyKind !== "uploaded" && (
              <>
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-500">
                  R
                </div>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-500">
                  L
                </div>
                <div className="pointer-events-none absolute left-1/2 top-2.5 -translate-x-1/2 font-mono text-[11px] font-bold text-slate-500">
                  {activeStudy.studyKind === "xr-chest" ? "S" : "A"}
                </div>
              </>
            )}

            <div className="pointer-events-none absolute bottom-2.5 left-3.5 font-mono text-[10px] text-slate-500">
              Scroll to zoom • Drag to pan • Double-click to reset
            </div>

            {activeState.slice !== activeStudy.finding.peakSlice && (
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveSlice(activeStudy.finding.peakSlice);
                }}
                className="absolute bottom-2.5 right-3.5 rounded border border-[#f59e0b]/45 bg-[#0a0f18]/90 px-2.5 py-1 font-mono text-[10px] font-medium text-[#fbbf24] transition-colors hover:bg-[#f59e0b]/15"
              >
                Jump to Finding (Slice {activeStudy.finding.peakSlice})
              </button>
            )}
          </div>

          {/* Bottom Slice Scrubber */}
          <div className="flex shrink-0 items-center gap-3 border-t border-[#1e293b] bg-[#0d131f] px-3.5 py-2.5">
            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              disabled={activeStudy.totalSlices <= 1}
              aria-label={isPlaying ? "Pause cine loop" : "Play cine loop"}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#1e293b] bg-[#111827] text-slate-200 transition-colors hover:border-[#14b8a6]/50 hover:text-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPlaying ? (
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <rect x="3.5" y="3" width="3" height="10" rx="0.6" />
                  <rect x="9.5" y="3" width="3" height="10" rx="0.6" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M4.5 3.2a.6.6 0 01.9-.52l7.5 4.8a.6.6 0 010 1.04l-7.5 4.8a.6.6 0 01-.9-.52V3.2z" />
                </svg>
              )}
            </button>

            <span className="hidden font-mono text-[11px] uppercase tracking-wider text-slate-400 sm:inline">
              Slice
            </span>

            <input
              type="range"
              min={1}
              max={activeStudy.totalSlices}
              value={activeState.slice}
              onChange={(e) => {
                setIsPlaying(false);
                setActiveSlice(parseInt(e.target.value, 10));
              }}
              className="h-1.5 flex-1 cursor-pointer accent-[#14b8a6]"
            />

            <span className="w-24 text-right font-mono text-xs font-semibold text-slate-200">
              {activeState.slice} <span className="text-slate-500">/</span>{" "}
              {activeStudy.totalSlices}
            </span>
          </div>
        </section>

        {/* RIGHT SIDEBAR (340px) — AI SUMMARY & CLINICAL SIGN-OFF */}
        <aside
          className={`${
            mobileTab === "report" ? "flex w-full" : "hidden"
          } shrink-0 flex-col border-l border-[#1e293b] bg-[#0d131f] lg:flex lg:w-[340px]`}
        >
          <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto p-3.5">
            {/* AI Summary Card (styled identically to landing page card) */}
            <div className="rounded-xl border border-[#14b8a6]/35 bg-[#14b8a6]/[0.04] p-4 shadow-[0_0_24px_rgba(20,184,166,0.14)]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  AI SUMMARY (SAMPLE)
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                    activeState.decision === "dismissed"
                      ? "border-slate-600 bg-slate-800/70 text-slate-300"
                      : "border-[#14b8a6]/45 bg-[#14b8a6]/15 text-[#14b8a6]"
                  }`}
                >
                  {aiSummaryStatus}
                </span>
              </div>

              <div className="mt-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-2.5">
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-slate-400">
                    FINDING
                  </span>
                  <span
                    className={`text-right text-xs font-medium ${
                      activeStudy.triage === "critical"
                        ? "text-[#fb7185]"
                        : activeStudy.triage === "routine"
                        ? "text-[#14b8a6]"
                        : "text-[#f59e0b]"
                    }`}
                  >
                    {activeStudy.finding.finding}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2.5">
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-slate-400">
                    CONFIDENCE
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#14b8a6]">
                    {activeStudy.finding.confidence.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-2.5">
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-slate-400">
                    REGION
                  </span>
                  <span className="text-right font-mono text-xs text-slate-200">
                    {activeStudy.finding.region}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-slate-400">
                    RECOMMENDED REVIEW
                  </span>
                  <span
                    className={`text-right text-xs font-medium ${
                      activeStudy.triage === "critical"
                        ? "text-[#fb7185]"
                        : activeStudy.triage === "routine"
                        ? "text-[#14b8a6]"
                        : "text-[#f59e0b]"
                    }`}
                  >
                    {activeStudy.finding.recommendedReview}
                  </span>
                </div>
              </div>
            </div>

            {/* Human-in-the-Loop Action Controls */}
            <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  RADIOLOGIST VERIFICATION
                </span>
                {activeState.decision !== "pending" && (
                  <span className="font-mono text-[10px] text-[#14b8a6]">
                    {activeState.decision === "confirmed" ? "Approved" : "Dismissed"}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDecision("confirmed")}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                    activeState.decision === "confirmed"
                      ? "bg-[#14b8a6] text-[#06090f] shadow-[0_0_14px_rgba(20,184,166,0.35)]"
                      : "bg-[#0d9488] text-[#06090f] hover:bg-[#14b8a6]"
                  }`}
                >
                  Confirm Flag
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision("dismissed")}
                  className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                    activeState.decision === "dismissed"
                      ? "border-slate-500 bg-slate-700/80 text-white"
                      : "border-[#1e293b] bg-slate-800/70 text-slate-300 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  Dismiss
                </button>
              </div>
            </div>

            {/* Draft Radiology Report Box */}
            <div className="flex min-h-[220px] flex-1 flex-col rounded-xl border border-[#1e293b] bg-[#111827] p-3">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="draft-radiology-report"
                  className="font-mono text-[10px] uppercase tracking-wider text-slate-400"
                >
                  DRAFT RADIOLOGY REPORT
                </label>
                <span className="font-mono text-[10px] text-slate-500">
                  Editable
                </span>
              </div>

              <textarea
                id="draft-radiology-report"
                value={activeState.reportText}
                onChange={(e) =>
                  setStudyStates((prev) => ({
                    ...prev,
                    [activeStudy.id]: {
                      ...prev[activeStudy.id],
                      reportText: e.target.value,
                    },
                  }))
                }
                spellCheck={false}
                className="min-h-[170px] w-full flex-1 resize-none rounded-lg border border-[#1e293b] bg-[#06090f] p-2.5 font-mono text-[11px] leading-relaxed text-slate-200 outline-none transition-colors focus:border-[#14b8a6]/60"
              />

              {activeState.signedOffAt && (
                <div className="mt-2 rounded border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-2.5 py-1.5 font-mono text-[10px] text-[#14b8a6]">
                  Signed off {activeState.signedOffAt} • Ready for PACS
                </div>
              )}

              <button
                type="button"
                onClick={handleFinalizeAndSign}
                className="mt-3 w-full rounded-md bg-[#0d9488] px-4 py-2.5 text-xs font-semibold text-[#06090f] transition-all hover:bg-[#14b8a6] hover:shadow-[0_0_18px_rgba(20,184,166,0.35)]"
              >
                Finalize &amp; Sign Report
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation Toast */}
      {toastMessage && (
        <div className="pointer-events-none fixed bottom-14 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-[#14b8a6]/45 bg-[#0d131f]/95 px-4 py-2 font-mono text-xs text-slate-100 shadow-[0_0_24px_rgba(20,184,166,0.25)] backdrop-blur-md">
          {toastMessage}
        </div>
      )}

      {/* Sign-Off & Export Confirmation Modal */}
      {signOffModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signoff-modal-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#14b8a6]/40 bg-[#0d131f] p-6 shadow-[0_0_40px_rgba(20,184,166,0.2)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#14b8a6]/40 bg-[#14b8a6]/15 text-[#14b8a6]">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 10.5l3.5 3.5 7.5-8"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    id="signoff-modal-title"
                    className="text-base font-bold text-slate-100"
                  >
                    Report Finalized &amp; Signed
                  </h3>
                  <p className="font-mono text-xs text-[#14b8a6]">
                    Signed off by Attending Radiologist • Ready for PACS
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSignOffModal(null)}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-[#1e293b] bg-[#06090f] p-3 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between text-slate-400">
                <span>Study: {signOffModal.studyFilename}</span>
                <span>{signOffModal.timestamp}</span>
              </div>
              <pre className="mt-2.5 max-h-48 overflow-y-auto whitespace-pre-wrap text-[11px] leading-relaxed text-slate-200">
                {signOffModal.reportText}
              </pre>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => handleCopyReport(signOffModal.reportText)}
                className="rounded-md border border-[#1e293b] bg-[#111827] px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
              >
                Copy Report
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDownloadReport(
                    signOffModal.studyFilename,
                    signOffModal.reportText
                  )
                }
                className="rounded-md bg-[#0d9488] px-4 py-2 text-xs font-semibold text-[#06090f] transition-all hover:bg-[#14b8a6]"
              >
                Export .TXT Report
              </button>
              <button
                type="button"
                onClick={() => setSignOffModal(null)}
                className="rounded-md border border-[#1e293b] px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
