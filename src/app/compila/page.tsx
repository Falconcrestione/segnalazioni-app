"use client";

export default function CompilaPDF() {
  return (
    <iframe
      src="/pdfjs/web/viewer.html?file=/report_auto_fillable.pdf#toolbar=1&navpanes=0"
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
      }}
      onLoad={(e) => {
        // Script per ritorno automatico dopo download
        const iframe = e.currentTarget as HTMLIFrameElement;
        iframe.contentWindow?.document.addEventListener("click", (ev: any) => {
          const el = ev.target.closest("a");
          if (!el) return;
          if (el.getAttribute("download") !== null) {
            setTimeout(() => {
              window.location.href = "/";
            }, 1500);
          }
        });
      }}
    ></iframe>
  );
}
