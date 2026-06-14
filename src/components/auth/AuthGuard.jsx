import { useSelector } from 'react-redux'

function AuthGuard({
  children,
  disabledClassName = '',
  title = 'Login required',
  className = ''
}) {
  const { initialized, isAuthenticated } = useSelector((state) => state.auth)
  const disabled = initialized && !isAuthenticated

  return (
    <div className={`relative ${className}`}>
      <div className={disabled ? `opacity-55 ${disabledClassName}` : ''}>
        {children}
      </div>

      {disabled ? (
        <div
          className="absolute inset-0 cursor-not-allowed"
          title={title}
          aria-hidden="true"
        />
      ) : null}
    </div>
  )
}

export default AuthGuard
