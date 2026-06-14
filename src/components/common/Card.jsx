function Card({ title, subtitle, children, className = '', align = 'left' }) {
  const isCenter = align === 'center'

  return (
    <section
      className={`
        relative
        overflow-hidden

        rounded-2xl

        border border-[#e7ddd2]

        bg-[#fcfaf7]

        p-6

        shadow-[0_2px_10px_rgba(40,28,20,0.05)]

        transition-all duration-200 ease-out

        hover:-translate-y-[1px]
        hover:shadow-[0_8px_24px_rgba(40,28,20,0.08)]

        ${className}
      `}
    >
      {/* Subtle top surface tone */}
      <div
        className="
          pointer-events-none
          absolute inset-x-0 top-0
          h-px
          bg-white/80
        "
      />

      <div className="relative z-10">
        {title && (
          <h2
            className={`
              font-heading
              text-[1.28rem]
              font-semibold
              tracking-[-0.04em]
              text-[#1f1814]

              ${isCenter ? 'text-center' : 'text-left'}
            `}
          >
            {title}
          </h2>
        )}

        {subtitle && (
          <p
            className={`
              mt-2
              font-body
              text-sm
              leading-7
              text-[#6f6258]

              ${
                isCenter
                  ? 'mx-auto max-w-[42ch] text-center'
                  : 'max-w-[65ch] text-left'
              }
            `}
          >
            {subtitle}
          </p>
        )}

        <div className="mt-6">{children}</div>
      </div>
    </section>
  )
}

export default Card
