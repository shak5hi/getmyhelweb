// Typographic wordmark: the name alone, no glyph.
export default function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center ${light ? "text-paper" : "text-purple"}`}>
      <span className="text-[1.4rem] font-extrabold leading-none tracking-[-0.04em]">GetMyHelp</span>
    </span>
  );
}
