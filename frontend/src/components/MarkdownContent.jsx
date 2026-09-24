import React from 'react';

function renderInline(value) {
  return value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-surface-700 font-mono text-[0.9em]">{part.slice(1, -1)}</code>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function tableCells(line) {
  const value = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return value.split('|').map((cell) => cell.trim());
}

function isTableSeparator(line) {
  const cells = tableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function renderTable(rows, key) {
  const [header, ...body] = rows;
  return (
    <div key={key} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-surface-600/50">
      <table className="min-w-full text-left text-[11px]">
        <thead className="bg-slate-100 dark:bg-surface-700/80 text-slate-700 dark:text-slate-100">
          <tr>{header.map((cell, index) => <th key={index} className="px-3 py-2 font-bold whitespace-nowrap">{renderInline(cell)}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-surface-600/40">
          {body.map((row, rowIndex) => <tr key={rowIndex} className="bg-white dark:bg-surface-800/50 even:bg-slate-50 dark:even:bg-surface-700/30">{header.map((_, cellIndex) => <td key={cellIndex} className="px-3 py-2 align-top text-slate-700 dark:text-slate-200">{renderInline(row[cellIndex] || '')}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default function MarkdownContent({ text }) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  let list = [];
  let code = null;

  const flushList = () => {
    if (!list.length) return;
    blocks.push(<ul key={`list-${blocks.length}`} className="list-disc pl-5 space-y-1">{list.map((item, index) => <li key={index}>{renderInline(item)}</li>)}</ul>);
    list = [];
  };
  const flushCode = () => {
    if (code === null) return;
    blocks.push(<pre key={`code-${blocks.length}`} className="overflow-x-auto rounded-lg bg-slate-950 text-slate-100 p-3 my-2 text-[11px] leading-relaxed"><code>{code.join('\n')}</code></pre>);
    code = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim().startsWith('```')) {
      if (code === null) { flushList(); code = []; } else flushCode();
      continue;
    }
    if (code !== null) { code.push(line); continue; }
    if (line.includes('|') && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      flushList();
      const rows = [tableCells(line)];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      index -= 1;
      blocks.push(renderTable(rows, `table-${index}`));
      continue;
    }
    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (heading) { flushList(); blocks.push(<h4 key={index} className="font-bold text-sm mt-3 first:mt-0">{renderInline(heading[2])}</h4>); continue; }
    if (bullet || numbered) { list.push((bullet || numbered)[1]); continue; }
    flushList();
    if (!line.trim()) { blocks.push(<div key={index} className="h-2" />); continue; }
    blocks.push(<p key={index}>{renderInline(line)}</p>);
  }
  flushList();
  flushCode();
  return <div className="space-y-1 text-inherit [&_strong]:text-inherit [&_h4]:text-inherit">{blocks}</div>;
}
