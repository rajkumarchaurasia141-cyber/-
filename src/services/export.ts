import { DocumentData } from '../types/document';

// Plain text extractor
export function extractPlainText(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || '').trim();
}

// Download helper
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// TXT Export
export function exportAsTxt(doc: DocumentData): void {
  const text = `${doc.title.toUpperCase()}\n${'='.repeat(doc.title.length)}\n\n${extractPlainText(doc.content)}`;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  triggerDownload(blob, `${doc.title.replace(/[^a-z0-9_-]/gi, '_')}.txt`);
}

// HTML Export
export function exportAsHtml(doc: DocumentData): void {
  const { margins, size, orientation } = doc.pageSettings;
  const { count, gap, showRule } = doc.columnSettings;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${doc.title}</title>
  <style>
    @page {
      size: ${size.toLowerCase()} ${orientation};
      margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
      color: #1e293b;
      line-height: 1.6;
    }
    .document-body {
      column-count: ${count};
      column-gap: ${gap}mm;
      ${showRule ? 'column-rule: 1px solid #cbd5e1;' : ''}
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
    }
    th {
      background-color: #f1f5f9;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="document-body">
    ${doc.content}
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, `${doc.title.replace(/[^a-z0-9_-]/gi, '_')}.html`);
}

// DOCX / MS Word compatible Export
// Microsoft Word directly opens HTML files containing Word MSO metadata and CSS formatting seamlessly as native Word docs!
export function exportAsDocx(doc: DocumentData): void {
  const { count, gap } = doc.columnSettings;
  const { margins, size } = doc.pageSettings;

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${doc.title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: ${size === 'Letter' ? '8.5in 11in' : size === 'Legal' ? '8.5in 14in' : '210mm 297mm'};
          margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
          mso-header-margin: 36pt;
          mso-footer-margin: 36pt;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
          column-count: ${count};
          column-gap: ${gap}mm;
        }
        body {
          font-family: Calibri, Arial, sans-serif;
          font-size: 11pt;
          color: #000000;
          line-height: 1.15;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 12pt 0;
        }
        td, th {
          border: 1pt solid #cbd5e1;
          padding: 6pt;
        }
        h1 { font-size: 20pt; color: #1e40af; margin-top: 12pt; margin-bottom: 6pt; }
        h2 { font-size: 15pt; color: #1e293b; margin-top: 10pt; margin-bottom: 4pt; }
        h3 { font-size: 13pt; color: #334155; margin-top: 8pt; margin-bottom: 3pt; }
      </style>
    </head>
    <body>
      <div class="Section1">
        ${doc.content}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordHtml], {
    type: 'application/msword;charset=utf-8',
  });
  triggerDownload(blob, `${doc.title.replace(/[^a-z0-9_-]/gi, '_')}.doc`);
}

// Print / PDF Export
export function exportAsPdf(doc: DocumentData): void {
  // Check if native Android print interface is available
  if (typeof (window as unknown as { AndroidBridge?: { printDocument: (title: string, html: string) => void } }).AndroidBridge?.printDocument === 'function') {
    (window as unknown as { AndroidBridge: { printDocument: (title: string, html: string) => void } }).AndroidBridge.printDocument(doc.title, doc.content);
    return;
  }

  // Standard web print
  window.print();
}
