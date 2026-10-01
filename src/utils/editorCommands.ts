// Rich text manipulation utilities using DOM APIs and Range/Selection

export interface SavedSelection {
  range: Range | null;
  startContainer?: Node;
  startOffset?: number;
  endContainer?: Node;
  endOffset?: number;
}

let lastSelectionRange: Range | null = null;

export function saveSelection(): Range | null {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    lastSelectionRange = sel.getRangeAt(0).cloneRange();
    return lastSelectionRange;
  }
  return null;
}

export function restoreSelection(savedRange: Range | null = lastSelectionRange): void {
  if (!savedRange) return;
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }
}

export function executeCommand(command: string, value: string | undefined = undefined): void {
  restoreSelection();
  document.execCommand(command, false, value);
  saveSelection();
}

export function applyFontFamily(fontFamily: string): void {
  restoreSelection();
  // Using fontName or wrapping selection in span
  document.execCommand('styleWithCSS', false, 'true');
  document.execCommand('fontName', false, fontFamily);
  saveSelection();
}

export function applyFontSize(sizeInPx: number): void {
  restoreSelection();
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
    // If collapsed, insert span or style next input
    return;
  }
  const range = sel.getRangeAt(0);
  const selectedContent = range.extractContents();
  const span = document.createElement('span');
  span.style.fontSize = `${sizeInPx}px`;
  span.appendChild(selectedContent);
  range.insertNode(span);
  
  // Reselect
  sel.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  sel.addRange(newRange);
  saveSelection();
}

export function applyTextColor(color: string): void {
  restoreSelection();
  document.execCommand('styleWithCSS', false, 'true');
  document.execCommand('foreColor', false, color);
  saveSelection();
}

export function applyHighlightColor(color: string): void {
  restoreSelection();
  document.execCommand('styleWithCSS', false, 'true');
  document.execCommand('hiliteColor', false, color);
  saveSelection();
}

export function applyLineSpacing(spacing: string): void {
  restoreSelection();
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  let node: Node | null = sel.anchorNode;
  while (node && node.nodeName !== 'P' && node.nodeName !== 'DIV' && node.nodeName !== 'BODY' && node.nodeName !== 'H1' && node.nodeName !== 'H2') {
    node = node.parentNode;
  }

  if (node && node instanceof HTMLElement && node.nodeName !== 'BODY') {
    node.style.lineHeight = spacing;
  } else {
    document.execCommand('formatBlock', false, 'p');
    const p = sel.anchorNode?.parentElement;
    if (p) p.style.lineHeight = spacing;
  }
}

export function applyHeadingStyle(tag: string): void {
  restoreSelection();
  if (tag === 'p' || tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'blockquote' || tag === 'pre') {
    document.execCommand('formatBlock', false, tag);
  }
  saveSelection();
}

export function insertTable(rows: number, cols: number): void {
  restoreSelection();
  let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;"><thead><tr>`;
  for (let c = 0; c < cols; c++) {
    tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 10px; background-color: #f8fafc; font-weight: 600;">Header ${c + 1}</th>`;
  }
  tableHtml += `</tr></thead><tbody>`;

  for (let r = 1; r < rows; r++) {
    tableHtml += `<tr>`;
    for (let c = 0; c < cols; c++) {
      tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 8px;">Cell ${r},${c + 1}</td>`;
    }
    tableHtml += `</tr>`;
  }
  tableHtml += `</tbody></table><p><br></p>`;

  document.execCommand('insertHTML', false, tableHtml);
  saveSelection();
}

export function insertImageHtml(src: string, alt: string = 'Document Image'): void {
  restoreSelection();
  const imgHtml = `
    <div class="doc-image-wrapper" style="text-align: center; margin: 12px 0;">
      <img src="${src}" alt="${alt}" style="max-width: 80%; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: inline-block;" />
    </div>
    <p><br></p>
  `;
  document.execCommand('insertHTML', false, imgHtml);
  saveSelection();
}

export function insertShapeHtml(type: 'divider' | 'callout-info' | 'callout-success' | 'callout-warning' | 'quote' | 'badge'): void {
  restoreSelection();
  let shapeHtml = '';

  switch (type) {
    case 'divider':
      shapeHtml = `<hr style="border: 0; height: 2px; background: linear-gradient(to right, #cbd5e1, #64748b, #cbd5e1); margin: 20px 0;" /><p><br></p>`;
      break;
    case 'callout-info':
      shapeHtml = `
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
          <strong style="color: #1e40af;">💡 Note:</strong>
          <p style="margin: 4px 0 0 0; color: #1e3a8a;">Add your informational note or key highlight here.</p>
        </div>
        <p><br></p>`;
      break;
    case 'callout-success':
      shapeHtml = `
        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
          <strong style="color: #15803d;">✓ Success / Approved:</strong>
          <p style="margin: 4px 0 0 0; color: #166534;">Verified requirement or completed goal.</p>
        </div>
        <p><br></p>`;
      break;
    case 'callout-warning':
      shapeHtml = `
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
          <strong style="color: #b45309;">⚠️ Warning:</strong>
          <p style="margin: 4px 0 0 0; color: #92400e;">Critical notice or deadline consideration.</p>
        </div>
        <p><br></p>`;
      break;
    case 'quote':
      shapeHtml = `
        <blockquote style="border-left: 4px solid #cbd5e1; padding-left: 16px; margin: 16px 0; font-style: italic; color: #475569;">
          "The greatest glory in living lies not in never falling, but in rising every time we fall."
        </blockquote>
        <p><br></p>`;
      break;
    case 'badge':
      shapeHtml = `<span style="background-color: #dbeafe; color: #1e40af; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; display: inline-block; margin-right: 8px;">CONFIDENTIAL</span>&nbsp;`;
      break;
  }

  document.execCommand('insertHTML', false, shapeHtml);
  saveSelection();
}

export function insertColumnBreak(): void {
  restoreSelection();
  document.execCommand('insertHTML', false, '<div class="column-break" style="break-before: column; page-break-before: column; height: 1px;"></div><p><br></p>');
  saveSelection();
}
