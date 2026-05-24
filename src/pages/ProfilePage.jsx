import { useSelector } from 'react-redux'
import Card from '../components/common/Card'

function ProfilePage() {
  const { user } = useSelector((state) => state.auth)

  const displayName =
    user?.displayName ||
    user?.name ||
    user?.fullName ||
    user?.username ||
    'Account'

  const email = user?.email || ''

  return (
    <div className="pb-10 text-[#1f1814]">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#86756a]">
            Profile
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em]">
            {displayName}
          </h1>
          {email ? (
            <p className="mt-2 text-sm text-[#6a5d55]">
              {email}
            </p>
          ) : null}
        </div>

        <Card className="rounded-[1.6rem] border-[#e4d8cb] bg-white/75 p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b7d75]">
                Display Name
              </p>
              <p className="mt-2 font-body text-sm font-semibold text-[#2a221d]">
                {displayName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b7d75]">
                Email
              </p>
              <p className="mt-2 font-body text-sm font-semibold text-[#2a221d]">
                {email || '—'}
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default ProfilePage
