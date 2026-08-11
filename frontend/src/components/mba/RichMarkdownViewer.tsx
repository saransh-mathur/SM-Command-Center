import React from 'react';
import { 
  Layers, 
  Calculator, 
  Terminal, 
  Briefcase 
} from 'lucide-react';

interface RichMarkdownViewerProps {
  content: string;
}

export const RichMarkdownViewer: React.FC<RichMarkdownViewerProps> = ({ content }) => {
  if (!content) return null;

  // Split into structural blocks separated by double newlines or triple newlines
  const rawBlocks = content.split(/\n\s*\n/);

  const renderInlineFormatted = (text: string) => {
    // Replace bold **text** and `code`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\$[^\$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[11px] border border-slate-800">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return <span key={i} className="px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 font-mono text-[11px] border border-amber-500/20">{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  const renderBlock = (block: string, index: number) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // 1. ASCII Art Diagrams & Preformatted Boxes
    if (
      trimmed.startsWith('+--') || 
      trimmed.startsWith('|   ') || 
      trimmed.includes('+---------------------------------------------------------------------------------+') ||
      trimmed.includes('[ Sender ]') ||
      trimmed.includes('[ Source Documents ]') ||
      trimmed.includes('-->') ||
      trimmed.includes('==>')
    ) {
      // Check if it's a markdown table vs ASCII box
      if (trimmed.includes('| :---') || trimmed.includes('|:---')) {
        return renderMarkdownTable(trimmed, index);
      }
      return (
        <div key={index} className="my-4 rounded-xl bg-slate-950 border border-emerald-500/30 overflow-hidden shadow-glass">
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-emerald-950/40 border-b border-emerald-500/20 font-mono text-[10px] text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-emerald-400" />
              SYSTEM ARCHITECTURE & PROCESS FLOW
            </span>
            <span className="text-[9px] uppercase tracking-wider text-emerald-500/80">Interactive Diagram</span>
          </div>
          <pre className="p-4 text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre selection:bg-emerald-800 selection:text-white">
            {trimmed}
          </pre>
        </div>
      );
    }

    // 2. Markdown Tables
    if (trimmed.includes('|') && (trimmed.includes('| :---') || trimmed.includes('|:---') || trimmed.includes('---|---') || trimmed.includes('| --- |'))) {
      return renderMarkdownTable(trimmed, index);
    }

    // 3. Code Blocks (```latex or ```python or ```)
    if (trimmed.startsWith('```')) {
      const lines = trimmed.split('\n');
      const lang = lines[0].replace('```', '').trim().toLowerCase();
      const code = lines.slice(1, lines[lines.length - 1].startsWith('```') ? -1 : undefined).join('\n');
      
      const isLatex = lang === 'latex' || code.includes('\\text{') || code.includes('\\frac');
      
      return (
        <div key={index} className={`my-3 rounded-xl overflow-hidden border ${isLatex ? 'bg-amber-950/20 border-amber-500/30' : 'bg-slate-950 border-slate-800'}`}>
          <div className={`flex items-center justify-between px-3.5 py-1.5 border-b font-mono text-[10px] ${isLatex ? 'bg-amber-950/40 border-amber-500/20 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <span className="flex items-center gap-1.5">
              {isLatex ? <Calculator className="w-3 h-3 text-amber-400" /> : <Terminal className="w-3 h-3 text-cyan-400" />}
              {isLatex ? 'MATHEMATICAL DERIVATION & EQUATION' : `${lang.toUpperCase()} SCRIPT`}
            </span>
          </div>
          <pre className={`p-3.5 font-mono text-xs overflow-x-auto ${isLatex ? 'text-amber-200' : 'text-cyan-300'}`}>
            {code}
          </pre>
        </div>
      );
    }

    // 4. Main Document Titles (# 🎓 or # 📖)
    if (trimmed.startsWith('# 🎓') || trimmed.startsWith('# 📖') || trimmed.startsWith('# ')) {
      const cleanHeading = trimmed.replace(/^#+\s*/, '');
      const isMainUnit = cleanHeading.includes('UNIT');
      return (
        <div key={index} className={`pt-2 pb-1 border-b border-slate-800/80 ${isMainUnit ? 'mb-3' : 'mb-2'}`}>
          <h2 className={`font-extrabold tracking-tight ${isMainUnit ? 'text-lg text-emerald-300 font-mono flex items-center gap-2' : 'text-base text-white'}`}>
            {cleanHeading}
          </h2>
        </div>
      );
    }

    // 5. Section Headers (## or ### or 1. / 2. / 3. Numbered Titles)
    if (trimmed.startsWith('## ') || trimmed.startsWith('### ') || /^\d+\.\s+[A-Z]/.test(trimmed)) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      return (
        <div key={index} className="pt-3 pb-1">
          <h3 className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2 border-b border-slate-800/60 pb-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            {headingText}
          </h3>
        </div>
      );
    }

    // 6. Callouts (> **Official ...**)
    if (trimmed.startsWith('>')) {
      const calloutText = trimmed.replace(/^>\s*/, '');
      return (
        <div key={index} className="p-3.5 my-2.5 rounded-xl bg-slate-900/80 border-l-4 border-l-emerald-500 border border-slate-800 text-xs text-slate-300 leading-relaxed shadow-sm">
          {renderInlineFormatted(calloutText)}
        </div>
      );
    }

    // 7. Bullet Lists (- or * or 1.)
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n');
      return (
        <ul key={index} className="my-2.5 space-y-2 text-xs text-slate-300">
          {items.map((item, itIdx) => {
            const cleanItem = item.replace(/^[-•*]\s*/, '').trim();
            if (!cleanItem) return null;

            // Check for Case Study Challenge/Strategy/Outcome badges
            const isChallenge = cleanItem.includes('*Challenge:*') || cleanItem.includes('Challenge:');
            const isStrategy = cleanItem.includes('*Strategy:*') || cleanItem.includes('Strategy:');
            const isOutcome = cleanItem.includes('*Outcome:*') || cleanItem.includes('Outcome:');
            const isCaseTitle = cleanItem.startsWith('**') && (cleanItem.includes('(') || cleanItem.includes(':'));

            if (isCaseTitle) {
              return (
                <li key={itIdx} className="pt-2 font-bold text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  {renderInlineFormatted(cleanItem)}
                </li>
              );
            }

            return (
              <li key={itIdx} className={`pl-4 relative leading-relaxed ${isOutcome ? 'text-emerald-300 font-medium' : isStrategy ? 'text-cyan-200' : isChallenge ? 'text-amber-200' : 'text-slate-300'}`}>
                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
                {renderInlineFormatted(cleanItem)}
              </li>
            );
          })}
        </ul>
      );
    }

    // 8. Default Paragraph
    return (
      <p key={index} className="text-xs text-slate-300 leading-relaxed my-2">
        {renderInlineFormatted(trimmed)}
      </p>
    );
  };

  const renderMarkdownTable = (tableText: string, index: number) => {
    const lines = tableText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return null;

    const headers = lines[0].split('|').map(h => h.trim()).filter(h => h.length > 0);
    // Line 1 is the separator line (e.g. | :--- | :--- |)
    const rows = lines.slice(2).map(row => 
      row.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0)
    );

    return (
      <div key={index} className="my-4 overflow-x-auto rounded-xl border border-slate-800 shadow-glass">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800">
              {headers.map((h, hIdx) => (
                <th key={hIdx} className="p-3 text-cyan-300 font-mono font-bold text-[11px] tracking-wide border-r border-slate-800/60 last:border-r-0">
                  {renderInlineFormatted(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-3 text-slate-300 leading-relaxed border-r border-slate-800/40 last:border-r-0">
                    {renderInlineFormatted(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {rawBlocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
};
