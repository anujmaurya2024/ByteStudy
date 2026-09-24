import React from 'react';

function renderInline(value) {
  return value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-surface-700 font-mono text-[0.9em]">{part.slice(1, -1)}</code>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
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

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (code === null) { flushList(); code = []; } else flushCode();
      return;
    }
    if (code !== null) { code.push(line); return; }
    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (heading) { flushList(); blocks.push(<h4 key={index} className="font-bold text-sm mt-3 first:mt-0">{renderInline(heading[2])}</h4>); return; }
    if (bullet || numbered) { list.push((bullet || numbered)[1]); return; }
    flushList();
    if (!line.trim()) { blocks.push(<div key={index} className="h-2" />); return; }
    blocks.push(<p key={index}>{renderInline(line)}</p>);
  });
  flushList();
  flushCode();
  return <div className="space-y-1">{blocks}</div>;
}
