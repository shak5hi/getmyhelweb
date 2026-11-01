interface ChapterProps {
  id: string;
  // which shot of the 3D world sits behind this chapter's heading
  shot: string;
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  intro?: React.ReactNode;
  dark?: boolean;
  // which side of the screen the words take; the world frames itself on the other
  align?: "left" | "right" | "center";
  // anything that belongs with the heading itself, such as the closing call to action
  aside?: React.ReactNode;
  // more of the story told over the world before the content arrives
  between?: React.ReactNode;
  // the page of content that slides up over the world
  sheetClassName?: string;
  children?: React.ReactNode;
}

// One chapter of the home page: its heading set over the world, then its
// content on a sheet that rises over it. Without the world (reduced motion,
// no WebGL) the heading simply sits on the page.
export default function Chapter({
  id,
  shot,
  eyebrow,
  title,
  titleId,
  intro,
  dark = false,
  align = "left",
  aside,
  between,
  sheetClassName = "bg-paper",
  children,
}: ChapterProps) {
  return (
    <section id={id} aria-labelledby={titleId} className="relative">
      <div
        data-shot={shot}
        data-label={eyebrow}
        className={`moment moment-${align} ${dark ? "moment-dark on-dark text-paper" : "text-ink"}`}
      >
        <div aria-hidden="true" className={`moment-wash ${dark ? "wash-dark" : "wash-light"}`} />
        <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <div
            className={
              align === "right"
                ? "max-w-[36rem] md:ml-auto"
                : align === "center"
                  ? "mx-auto max-w-[44rem] md:text-center"
                  : "max-w-[36rem]"
            }
          >
            <p data-reveal className={`text-base font-bold ${dark ? "text-marigold" : "text-purple"}`}>
              {eyebrow}
            </p>
            <h2 id={titleId} data-reveal className="display-lg mt-4 text-balance">
              {title}
            </h2>
            {intro && (
              <p data-reveal className={`lede mt-6 ${dark ? "text-paper/85" : "text-ink"}`}>
                {intro}
              </p>
            )}
            {aside}
          </div>
        </div>
      </div>
      {between}
      {children && <div className={`sheet ${sheetClassName}`}>{children}</div>}
    </section>
  );
}
