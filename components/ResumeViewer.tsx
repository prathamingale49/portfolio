"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, X } from "lucide-react";

type ResumeViewerProps = {
  resumeHref: string;
};

export function ResumeViewer({ resumeHref }: ResumeViewerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const embeddedResumeHref = `${resumeHref}#view=FitH&navpanes=0`;

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <>
      <div className="overflow-hidden border border-line-soft bg-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-3 py-3">
          <div className="text-sm text-slate-400">Embedded PDF</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex h-9 items-center gap-2 border border-line-soft px-3 text-sm text-slate-200 hover:border-copper/60"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Open large
            </button>
            <a
              href={resumeHref}
              download
              className="inline-flex h-9 items-center gap-2 border border-copper/60 px-3 text-sm text-copper hover:bg-copper/10"
            >
              <Download className="size-4" aria-hidden="true" />
              Download
            </a>
          </div>
        </div>
        <iframe
          src={embeddedResumeHref}
          title="Pratham Ingale resume"
          className="h-[34rem] w-full bg-white"
        />
      </div>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Resume PDF viewer"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden border border-line-soft bg-[#0b0d0b] shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-3">
              <span className="text-sm font-medium text-[#f4efe3]">Resume</span>
              <div className="flex items-center gap-2">
                <a
                  href={resumeHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-2 border border-line-soft px-3 text-sm text-slate-200 hover:border-copper/60"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  New tab
                </a>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="grid size-9 place-items-center border border-line-soft text-slate-200 hover:border-copper/60"
                  aria-label="Close resume viewer"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <iframe src={embeddedResumeHref} title="Large resume viewer" className="min-h-0 flex-1 bg-white" />
          </div>
        </div>
      ) : null}
    </>
  );
}
