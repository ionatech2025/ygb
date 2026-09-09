export interface YgbLogoProps {
  className?: string;
  /** Tailwind height utility; default matches navbar lockup size. */
  heightClassName?: string;
  alt?: string;
}

export function YgbLogo({
  className = '',
  heightClassName = 'h-10',
  alt = 'Youth Go Budget',
}: YgbLogoProps) {
  return (
    <img
      src="/ygb_logo.png"
      alt={alt}
      className={`${heightClassName} w-auto object-contain ${className}`.trim()}
      decoding="async"
    />
  );
}
