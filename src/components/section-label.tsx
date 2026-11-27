type SectionLabelProps = {
  index: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ index, children, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] ${className}`}
    >
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      <span className="tabular-nums">{index}</span>
      <span aria-hidden="true" className="opacity-40">
        /
      </span>
      <span>{children}</span>
    </p>
  );
}
