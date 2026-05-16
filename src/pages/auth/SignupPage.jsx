import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import { register as registerUser } from '../../api/authApi'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import AuthLayout from '../../layouts/AuthLayout'
import { errorToast, successToast } from '../../utils/toast'
import { setAuthError, setAuthLoading } from '../../redux/authSlice'
import { authValidationRules } from '../../utils/auth/validationRules'

function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading } = useSelector((state) => state.auth)

  const [showPassword, setShowPassword] = useState(false)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const passwordValue = watch('password')

  const onSubmit = async (values) => {
    dispatch(setAuthLoading(true))
    dispatch(setAuthError(null))

    try {
      await registerUser({
        name: values.fullName,
        email: values.email,
        password: values.password,
      })

      successToast(
        'Account created successfully. Please log in.',
      )

      navigate('/login')
    } catch (error) {
      dispatch(setAuthError(error.message))
      errorToast(error.message)
    } finally {
      dispatch(setAuthLoading(false))
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerTo="/login"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        {/* Full Name */}
        <Input
          label="Full name"
          name="fullName"
          autoComplete="name"
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          {...register(
            'fullName',
            authValidationRules.fullName,
          )}
        />

        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register(
            'email',
            authValidationRules.email,
          )}
        />

        {/* Password */}
        <div className="space-y-2">
          <div
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsPasswordFocused(false)
              }
            }}
          >
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
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
                authValidationRules.password,
              )}
            />
          </div>

          {isPasswordFocused && (
            <div
              className="
  ml-1

  max-w-[90%]

  rounded-lg

  border border-[#ddd4ca]

  bg-[#f9f2d2]

  px-3 py-2

  text-[12px]
  leading-[1.55]
  text-[#7b6f66]

  shadow-[0_1px_2px_rgba(40,28,20,0.03)]
"
            >
              Password should contain at least
              8 characters, one uppercase letter,
              one lowercase letter, and one number.
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm password"
          name="confirmPassword"
          type={
            showConfirmPassword
              ? 'text'
              : 'password'
          }
          autoComplete="new-password"
          placeholder="Re-enter your password"
          className="pr-12"
          error={
            errors.confirmPassword?.message
          }
          rightElement={(
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (prev) => !prev,
                )
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
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >
              {showConfirmPassword ? (
                <Eye
                  size={18}
                  strokeWidth={2}
                />
              ) : (
                <EyeOff
                  size={18}
                  strokeWidth={2}
                />
              )}
            </button>
          )}
          {...register(
            'confirmPassword',
            {
              required:
                'Please confirm your password',
              validate: (value) =>
                value === passwordValue ||
                'Passwords do not match',
            },
          )}
        />

        {/* Terms */}
        <label
          className="
            inline-flex items-start gap-2

            text-sm
            text-[#6b5e57]
          "
        >
          <input
            type="checkbox"
            className="
              mt-0.5
              h-4 w-4

              rounded

              border-[#c8b6a3]

              text-[#5a473d]

              focus:ring-[#d9c2ad]/55
            "
            {...register('acceptTerms', {
              required:
                'You must accept terms and conditions',
            })}
          />

          <span>
            I agree to the terms and conditions.
          </span>
        </label>

        {errors.acceptTerms?.message && (
          <p className="text-xs font-medium text-red-600">
            {
              errors.acceptTerms.message
            }
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          loading={
            loading || isSubmitting
          }
          disabled={
            loading || isSubmitting
          }
          fullWidth
        >
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}

export default SignupPage
