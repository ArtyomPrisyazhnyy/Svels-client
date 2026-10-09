import type { ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${match.index}-b`}>{match[1]}</strong>);
    } else if (match[2] !== undefined && match[3] !== undefined) {
      nodes.push(
        <a key={`${match.index}-a`} href={match[3]}>
          {match[2]}
        </a>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

function parseTableRow(line: string): string[] {
  return line
    .split('|')
    .map((cell) => cell.trim())
    .filter((cell, index, arr) => !(index === 0 && cell === '') && !(index === arr.length - 1 && cell === ''));
}

export function LegalMarkdownBody({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;
  let blockKey = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h1 key={blockKey++} className="legal-doc__h1">
          {renderInline(trimmed.slice(2))}
        </h1>,
      );
      index += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h2 key={blockKey++} className="legal-doc__h2">
          {renderInline(trimmed.slice(3))}
        </h2>,
      );
      index += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h3 key={blockKey++} className="legal-doc__h3">
          {renderInline(trimmed.slice(4))}
        </h3>,
      );
      index += 1;
      continue;
    }

    if (trimmed.startsWith('|') && lines[index + 1]?.includes('---')) {
      const header = parseTableRow(trimmed);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(parseTableRow(lines[index].trim()));
        index += 1;
      }
      blocks.push(
        <table key={blockKey++} className="legal-doc__table">
          <thead>
            <tr>
              {header.map((cell, cellIndex) => (
                <th key={`h-${cellIndex}`}>{renderInline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push(
        <ul key={blockKey++} className="legal-doc__list">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraphLines: string[] = [trimmed];
    index += 1;
    while (index < lines.length && lines[index].trim() && !lines[index].trim().startsWith('#')) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p key={blockKey++} className="legal-doc__p">
        {renderInline(paragraphLines.join(' '))}
      </p>,
    );
  }

  return <div className="legal-doc__body">{blocks}</div>;
}
