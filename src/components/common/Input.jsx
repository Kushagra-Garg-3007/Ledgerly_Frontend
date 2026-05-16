import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  {
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    rightElement,
    className = '',
    ...props
  },
  ref,
) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="
            block
            font-body
            text-sm
            font-semibold
            tracking-[-0.015em]
            text-[#4a3d36]
          "
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Soft inner top light */}
        <div
          className="
            pointer-events-none
            absolute inset-x-0 top-0
            h-[42%]
            rounded-t-[inherit]
            bg-gradient-to-b
            from-white/18
            to-transparent
          "
        />

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          ref={ref}
          onChange={onChange}
          className={`
            relative
            w-full

            rounded-md

            border
            border-[#d7c8b8]

            bg-[#f6f1ea]

            px-4
            py-[0.6rem]

            font-body
            text-[0.9rem]
            font-medium
            text-[#241b17]

            shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]

            outline-none

            transition-all
            duration-200
            ease-out

            placeholder:text-[#8d7f76]

            hover:border-[#c9b7a5]
            hover:bg-[#f8f4ee]

            focus:border-[#b79d89]
            focus:bg-[#faf7f2]
            focus:ring-2
            focus:ring-[#d8c0aa]/30
            focus:shadow-[0_0_0_1px_rgba(183,157,137,0.12)]

            ${rightElement ? 'pr-12' : ''}

            ${error
              ? `
                  border-red-300
                  focus:border-red-300
                  focus:ring-red-100/60
                `
              : ''
            }

            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div
            className="
              absolute right-3 top-1/2
              -translate-y-1/2
              flex items-center justify-center
              text-[#8a786b]
            "
          >
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="pl-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input