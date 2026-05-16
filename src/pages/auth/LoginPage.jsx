import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import { login, getProfile } from '../../api/authApi'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import AuthLayout from '../../layouts/AuthLayout'
import { errorToast, infoToast, successToast } from '../../utils/toast'
import { setAuthError, setAuthLoading, setUser } from '../../redux/authSlice'
import { authValidationRules } from '../../utils/auth/validationRules'
import { persistAuthToken } from '../../utils/auth/session'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading } = useSelector((state) => state.auth)

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (values) => {
    dispatch(setAuthLoading(true))
    dispatch(setAuthError(null))

    try {
      const loginData = await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      })

      persistAuthToken(loginData)

      let userData =
        loginData?.user ||
        loginData?.data?.user ||
        null

      try {
        const profileData = await getProfile()

        userData =
          profileData?.data ||
          profileData?.user ||
          userData
      } catch {
        infoToast(
          'Logged in. Profile sync will retry automatically.'
        )
      }

      dispatch(setUser(userData))

      successToast('Welcome back. Login successful.')

      navigate('/ledger')
    } catch (error) {
      dispatch(setAuthError(error.message))

      errorToast(
        error.message ||
        'Unable to login. Please try again.'
      )
    } finally {
      dispatch(setAuthLoading(false))
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue managing your finance operations."
      footerText="New to Ledgerly?"
      footerLinkText="Create an account"
      footerTo="/signup"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register(
            'email',
            authValidationRules.email
          )}
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Enter your password"
          className="pr-12"
          error={errors.password?.message}
          rightElement={(
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                text-[#8b7d75]
                transition-all duration-200
                hover:bg-[#efe4d8]
                hover:text-[#5f5047]
              "
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showPassword ? (
                <Eye size={18} strokeWidth={2} />
              ) : (
                <EyeOff size={18} strokeWidth={2} />
              )}
            </button>
          )}
          {...register(
            'password',
            authValidationRules.password
          )}
        />

        <div className="flex items-center justify-between gap-3 pt-1">
          <label
            className="
              inline-flex items-center gap-2.5
              font-body
              text-sm
              text-[#6b5e57]
            "
          >
            <input
              type="checkbox"
              className="
                h-4 w-4
                rounded
                border-[#c8b6a3]
                text-[#5a473d]
                focus:ring-[#d9c2ad]/55
              "
              {...register('rememberMe')}
            />

            Remember me
          </label>

          <Link
            to="#"
            className="
              text-sm
              font-semibold
              text-[#5a473d]
              transition-colors duration-200
              hover:text-[#3f312a]
            "
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading || isSubmitting}
          disabled={
            loading ||
            isSubmitting
          }
          fullWidth
        >
          Log in
        </Button>
      </form>

    </AuthLayout>
  )
}

export default LoginPage
