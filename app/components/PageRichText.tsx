import React from 'react';

type RichTextChild = { type: string; text?: string; format?: number };
type RichTextNode = { type: string; children?: RichTextChild[]; tag?: string };
type RichTextContent = { root?: { children?: RichTextNode[] } } | null;

function renderChild(child: RichTextChild, j: number): React.ReactNode {
  if (child.type === 'text') {
    let text: React.ReactNode = child.text ?? '';
    const format = child.format ?? 0;
    if (format & 1) text = <strong key={j}>{text}</strong>;
    if (format & 2) text = <em key={j}>{text}</em>;
    return text;
  }
  return null;
}

export default function PageRichText({ content }: { content: RichTextContent }) {
  if (!content?.root?.children) return null;

  return (
    <div className="page-rich-text">
      {content.root.children.map((node: RichTextNode, i: number) => {
        const children = node.children?.map((child, j) => renderChild(child, j));
        if (node.type === 'paragraph') {
          return <p key={i}>{children}</p>;
        }
        if (node.type === 'heading' && node.tag) {
          const Tag = node.tag as keyof JSX.IntrinsicElements;
          return <Tag key={i}>{children}</Tag>;
        }
        return <p key={i}>{children}</p>;
      })}
    </div>
  );
}
