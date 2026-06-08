interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase text-[color:var(--primary)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold text-[color:var(--text)] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          {description}
        </p>
      ) : null}
    </div>
  )
}
