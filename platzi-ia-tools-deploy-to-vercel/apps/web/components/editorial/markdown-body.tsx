import { cn } from '@/lib/utils/cn';

export interface MarkdownBodyProps {
  body: string;
  className?: string;
}

/**
 * Renderer minimalista de markdown para contenido editorial propio. Soporta
 * párrafos separados por líneas en blanco y énfasis en negrita con `**…**`.
 * No pretende cubrir toda la especificación CommonMark — sólo el subconjunto
 * que usamos en el seed. Si en el futuro se migra a Sanity Portable Text o a
 * un markdown real, este componente se sustituye por el renderer oficial.
 */
export function MarkdownBody({ body, className }: MarkdownBodyProps) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={cn('text-brand-800 space-y-4 leading-relaxed', className)}>
      {paragraphs.map((p, i) => (
        <p key={i}>{renderInline(p)}</p>
      ))}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-brand-900 font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
