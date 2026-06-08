import { cn } from '@/shared/utils/cn'

interface BadgeProps {
  children: string
  tone?: 'default' | 'accent' | 'success' | 'warning'
}

const tones = {
  default: 'border-[color:var(--border)] text-[color:var(--muted)]',
  accent: 'border-cyan-300/35 text-[color:var(--primary)]',
  success: 'border-emerald-300/35 text-emerald-300',
  warning: 'border-amber-300/35 text-amber-300',
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}
