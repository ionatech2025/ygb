import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { slugifyHeading } from '../../../../core/content/pdmPublicInfoSections';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h2: ({ children }) => {
          const text = String(children);
          return (
            <h2
              id={slugifyHeading(text)}
              className="mt-12 scroll-mt-28 border-b border-border/60 pb-3 text-xl font-semibold tracking-tight text-text first:mt-0 sm:text-2xl"
            >
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          const text = String(children);
          return (
            <h3
              id={slugifyHeading(text)}
              className="mt-8 scroll-mt-28 text-lg font-semibold tracking-tight text-text"
            >
              {children}
            </h3>
          );
        },
        p: ({ children }) => (
          <p className="mt-4 text-[0.9375rem] leading-7 text-text-muted">{children}</p>
        ),
        strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
        ul: ({ children }) => (
          <ul className="mt-4 list-disc space-y-2 pl-6 text-[0.9375rem] leading-7 text-text-muted marker:text-brand/70">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-[0.9375rem] leading-7 text-text-muted marker:font-semibold marker:text-brand/80">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="mt-6 rounded-r-xl border-l-4 border-brand bg-brand-light/40 px-4 py-3 text-[0.9375rem] italic leading-7 text-text dark:bg-brand/10">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="mt-6 overflow-x-auto rounded-xl ring-1 ring-border/80">
            <table className="min-w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-surface-muted/80">{children}</thead>,
        th: ({ children }) => (
          <th className="border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-border/60 px-4 py-3 text-text-muted">{children}</td>
        ),
        tr: ({ children }) => <tr className="even:bg-surface-muted/30">{children}</tr>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="font-semibold text-brand underline-offset-2 transition hover:text-brand-hover hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="my-10 border-border/60" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
