import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-[rgba(56,189,248,0.36)] bg-[rgba(56,189,248,0.14)] text-sky-100 hover:border-[rgba(56,189,248,0.55)] hover:bg-[rgba(56,189,248,0.2)]',
  secondary:
    'border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--text)] hover:border-cyan-300/45',
  ghost:
    'border-transparent bg-transparent text-[color:var(--muted)] hover:text-[color:var(--text)]',
  danger:
    'border-rose-300/35 bg-rose-400/10 text-rose-200 hover:border-rose-300/55',
}

const baseClassName =
  'focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

interface SharedButtonProps {
  variant?: ButtonVariant
  icon?: ReactNode
}

export function Button({
  children,
  className,
  icon,
  variant = 'secondary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & SharedButtonProps) {
  return (
    <button
      className={cn(baseClassName, variants[variant], className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  className,
  icon,
  variant = 'secondary',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & SharedButtonProps) {
  return (
    <a className={cn(baseClassName, variants[variant], className)} {...props}>
      {icon}
      {children}
    </a>
  )
}
