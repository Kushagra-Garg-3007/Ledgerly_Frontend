function Skeleton({
  className = '',
  rounded = 'rounded-lg',
}) {
  return (
    <div
      className={`
        relative overflow-hidden

        bg-[#ebe3d9]

        ${rounded}

        ${className}
      `}
      aria-hidden="true"
    >
      <div className="absolute inset-0 motion-reduce:hidden">
        <div
          className="
            h-full
            w-[35%]

            -translate-x-full

            bg-gradient-to-r
            from-transparent
            via-white/12
            to-transparent

            animate-shimmer
          "
        />
      </div>
    </div>
  )
}
export default Skeleton

