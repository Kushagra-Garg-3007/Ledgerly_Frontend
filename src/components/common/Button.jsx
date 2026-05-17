import Loader from './Loader'

const variantClasses = {
  primary: `
    bg-gradient-to-br
    from-[#1f1814]
    via-[#2c211c]
    to-[#3b2b24]
    text-white
    border border-[#5a4439]/25
    shadow-[0_6px_14px_rgba(40,28,20,0.22)]
    hover:shadow-[0_8px_18px_rgba(40,28,20,0.26)]
  `,

  secondary: `
    bg-gradient-to-br
    from-[#83756d]
    via-[#72655d]
    to-[#63574f]
    text-[#f7f2ec]
    border border-[#7f7067]/20
    shadow-[0_5px_12px_rgba(40,28,20,0.14)]
    hover:shadow-[0_7px_16px_rgba(40,28,20,0.18)]
  `,

  danger: `
    bg-gradient-to-br
    from-[#5b2f34]
    via-[#6f3a42]
    to-[#7c434b]
    text-white
    border border-[#8f6466]/20
    shadow-[0_5px_12px_rgba(70,30,35,0.18)]
    hover:shadow-[0_7px_16px_rgba(70,30,35,0.22)]
  `,

  outline: `
    border border-[#d9cfc3]
    bg-gradient-to-br
    from-[#ffffff]
    via-[#fdfaf5]
    to-[#f3ede6]
    text-[#4b3e37]
    shadow-[0_4px_10px_rgba(40,28,20,0.08)]
    hover:border-[#cfc3b6]
    hover:from-[#ffffff]
    hover:via-[#fdfcf9]
    hover:to-[#f0e8df]
    hover:shadow-[0_6px_14px_rgba(40,28,20,0.11)]
  `,
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) {
  const isDisabled = loading || disabled

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        relative overflow-hidden
        inline-flex items-center justify-center gap-2

        rounded-md

        font-body
        font-semibold
        tracking-[0.1px]

        transition-all duration-200 ease-out

        hover:-translate-y-[0.5px]
        active:translate-y-0

        disabled:cursor-not-allowed
        disabled:opacity-60

        focus:outline-none
        focus:ring-[3px]
        focus:ring-[#8b6e59]/25
        focus:ring-offset-1
        cursor-pointer
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Subtle glossy top reflection */}
      <span
        className={`
          pointer-events-none
          absolute inset-x-0 top-0
          h-[42%]
          rounded-t-[inherit]
          bg-gradient-to-b
          ${variant === 'primary'
            ? 'from-white/[0.10] to-transparent'
            : variant === 'secondary'
              ? 'from-white/[0.18] to-transparent'
              : variant === 'danger'
                ? 'from-white/[0.12] to-transparent'
                : 'from-white/[0.30] to-transparent'
          }
        `}
      />

      {/* Content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {loading && <Loader size="sm" />}
        {children}
      </span>
    </button>
  )
}

export default Button
