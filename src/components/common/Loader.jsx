function Loader({ size = 'md', centered = false }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-[2px]',
    md: 'h-7 w-7 border-[2.5px]',
    lg: 'h-10 w-10 border-[3px]'
  }

  const spinner = (
    <span className="relative inline-flex">
      {/* Outer subtle ring */}
      <span
        className={`
          ${sizeClasses[size] || sizeClasses.md}

          rounded-full

          border-[#d9cec1]/80

          border-t-[#3b2b24]
          border-r-[#6b5e57]

          animate-spin

          shadow-[0_2px_10px_rgba(60,40,20,0.10)]
        `}
      />

      {/* Soft glossy center glow */}
      <span
        className="
          absolute inset-0

          rounded-full

          bg-gradient-to-br
          from-white/40
          to-transparent

          pointer-events-none
        "
      />
    </span>
  )

  if (centered) {
    return <div className="flex justify-center py-8">{spinner}</div>
  }

  return spinner
}

export default Loader
