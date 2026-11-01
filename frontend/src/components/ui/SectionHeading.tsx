interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({ eyebrow, title, intro, id, dark = false, className = "" }: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p data-reveal className={`text-base font-bold ${dark ? "text-lavender" : "text-purple"}`}>
        {eyebrow}
      </p>
      <h2 id={id} data-reveal className={`display-lg mt-4 text-balance ${dark ? "text-paper" : "text-ink"}`}>
        {title}
      </h2>
      {intro && (
        <p data-reveal className={`lede mt-6 max-w-2xl ${dark ? "text-paper/80" : "text-ink-muted"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
