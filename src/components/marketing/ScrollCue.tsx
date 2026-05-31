export function ScrollCue({ label = "Scroll" }: { label?: string }) {
  return (
    <span className="scroll-cue" aria-hidden="true">
      <span>{label}</span>
    </span>
  );
}
