import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTransaction, getTransactions } from '../api/transactionApi'
import { getCategories } from '../api/categoryApi'
import { getProfile, login } from '../api/authApi'
import { setAuthError, setAuthLoading, setUser } from '../redux/authSlice'
import { setCategories, setCategoryError, setCategoryLoading } from '../redux/categorySlice'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import Input from '../components/common/Input'
import SkeletonPage from '../components/skeletons/SkeletonPage'
import { errorToast, infoToast, successToast, warningToast } from '../utils/toast'

function DashboardApiExample() {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const categories = useSelector((state) => state.categories)

  const [email, setEmail] = useState('demo@ledgerly.com')
  const [password, setPassword] = useState('123456')
  const [fieldError, setFieldError] = useState('')

  const [transactions, setTransactions] = useState([])
  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState('')
  const [creatingTx, setCreatingTx] = useState(false)
  const [pageBootLoading, setPageBootLoading] = useState(true)

  const handleLogin = async () => {
    if (!email || !password) {
      setFieldError('Email and password are required.')
      warningToast('Please fill email and password first.')
      return
    }

    setFieldError('')
    dispatch(setAuthLoading(true))
    dispatch(setAuthError(null))

    try {
      await login({ email, password })
      const profileData = await getProfile()
      dispatch(setUser(profileData?.data || profileData?.user || null))
      successToast('Login successful.')
    } catch (error) {
      dispatch(setAuthError(error.message))
      errorToast(`API failure: ${error.message}`)
    } finally {
      dispatch(setAuthLoading(false))
    }
  }

  const loadCategories = async () => {
    dispatch(setCategoryLoading(true))
    dispatch(setCategoryError(null))

    try {
      const categoryData = await getCategories()
      dispatch(setCategories(categoryData?.data || categoryData?.categories || []))
      infoToast('Categories loaded.')
    } catch (error) {
      dispatch(setCategoryError(error.message))
      errorToast(error.message)
    } finally {
      dispatch(setCategoryLoading(false))
    }
  }

  const loadTransactions = async () => {
    setTxLoading(true)
    setTxError('')

    try {
      const txData = await getTransactions()
      setTransactions(txData?.data || txData?.transactions || [])
      infoToast('Transactions refreshed.')
    } catch (error) {
      setTxError(error.message)
      errorToast(error.message)
    } finally {
      setTxLoading(false)
    }
  }

  const handleCreateTransaction = async () => {
    setCreatingTx(true)

    try {
      await createTransaction({
        title: 'Sample Transaction',
        amount: 500,
        type: 'expense',
      })
      successToast('Transaction created successfully.')
      await loadTransactions()
    } catch (error) {
      errorToast(error.message)
    } finally {
      setCreatingTx(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const boot = async () => {
      await Promise.allSettled([loadCategories(), loadTransactions()])
      if (isMounted) {
        setTimeout(() => setPageBootLoading(false), 300)
      }
    }

    boot()

    return () => {
      isMounted = false
    }
  }, [])

  if (pageBootLoading) {
    return <SkeletonPage cards={3} rows={5} />
  }

  return (
    <div className="space-y-6">
      <Card title="Auth Actions" subtitle="Redux stores shared auth state only.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="email"
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldError}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldError}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="primary" loading={auth.loading} onClick={handleLogin}>
            Login Example
          </Button>
          <Button variant="secondary" onClick={loadCategories} loading={categories.loading}>
            Load Categories
          </Button>
        </div>
      </Card>
      <div>
        <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, sit.</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem earum, voluptatibus repellendus voluptatem temporibus cum? Sequi nisi unde saepe cumque voluptatum harum eaque. Est adipisci, alias minus quod autem facilis nihil voluptatibus quidem sapiente ab ducimus tempora accusamus quia cupiditate sequi iste, officiis cumque. Libero, neque culpa numquam, quos laboriosam doloremque aliquid qui ratione iste reiciendis, accusantium deserunt. Dolorum itaque est doloribus perspiciatis aliquam et dignissimos adipisci iure necessitatibus, exercitationem, cupiditate doloremque, hic odio dolores sapiente facilis. Aperiam accusantium magni vel fuga sapiente autem deserunt vitae optio, eius recusandae voluptate voluptatem. Praesentium nostrum nisi ratione repudiandae? Blanditiis consectetur illum quia, repellat eius sunt saepe ratione eligendi molestias, reiciendis suscipit fugiat at natus temporibus corrupti hic. Enim quis labore accusamus id, cupiditate vero officia sequi sit, quo et esse hic ducimus, ipsum sint laudantium in deleniti voluptatibus magnam? Vero facilis ipsum voluptatum dolor laboriosam. Illo perspiciatis, deleniti eos itaque delectus assumenda quidem eaque amet! Nihil rem id dolorum libero voluptatibus cum et fugiat dolores eius delectus impedit illum qui dignissimos hic, tempore ad, neque temporibus alias quos. Officia odit ex dicta placeat similique aut nihil in laborum dolorem magni! Perspiciatis ea sint doloribus commodi, fuga natus tempora maiores nihil assumenda quidem debitis fugiat sed esse qui quasi, ipsa voluptatum modi. Iste ratione aut harum? Harum, molestias? Expedita, quia! Perferendis laboriosam officia fugit! Non deserunt amet ipsam impedit modi. Aperiam laudantium tempore enim ex consequatur rem fugiat, sapiente molestias corrupti neque, repudiandae libero modi laborum odit officia nihil nulla minima quidem provident nam autem dolorum vel? Distinctio, aliquam nam dicta in iure quam eius saepe architecto ut animi rerum, expedita, obcaecati consequuntur voluptatibus. Eos beatae quasi aliquid architecto delectus corporis asperiores culpa unde ea, reiciendis maiores, error ad ipsum possimus voluptates dolore nisi fugiat nulla illo! Modi sunt est excepturi? Esse corrupti dolor doloribus repellat, voluptates veritatis eveniet placeat quasi itaque consequuntur enim quae possimus magnam aperiam illum, ut dolorum autem debitis laborum asperiores, rerum minus! Minus atque excepturi dolore laborum inventore consequuntur molestias optio voluptatem veritatis omnis voluptates nihil quae labore quaerat quidem quis, magnam modi, cupiditate earum qui eius iusto in! Vel quos quo exercitationem enim excepturi, itaque voluptatibus, veniam rem ab ratione perspiciatis, accusantium facilis omnis dolorem dignissimos ipsam voluptate asperiores sequi mollitia quam nisi harum. Pariatur dolor repellat earum quisquam architecto recusandae nam repellendus, iusto commodi, sint perspiciatis animi dicta atque cum placeat, velit vitae ad. Iusto nesciunt non, cupiditate culpa quo repellat officia dolorum repellendus et incidunt iure, repudiandae, amet ullam nemo at fugit veritatis pariatur atque perspiciatis aspernatur? Nostrum magni pariatur ratione officia voluptas eum, fuga in architecto exercitationem harum, quae ducimus nam dolor blanditiis. Recusandae deserunt consequuntur, molestias accusantium accusamus molestiae! Nam mollitia quos impedit quisquam maxime assumenda eligendi earum explicabo, harum fugit nesciunt tempore inventore sunt, consectetur doloribus voluptate laboriosam sit facere. Tenetur reiciendis odit earum optio beatae! Eaque autem, esse numquam ea quo provident tenetur nemo possimus aspernatur reprehenderit beatae accusantium reiciendis enim. Voluptate dignissimos eligendi, tempora sint reiciendis esse eveniet incidunt modi eius porro commodi quibusdam ex soluta molestiae eaque sunt. Officia dolore facilis magni iste error nobis quidem. Hic deleniti earum aspernatur qui recusandae? Esse necessitatibus tempore sapiente quisquam voluptas doloremque debitis nostrum itaque blanditiis voluptate, ut rerum! Quisquam debitis libero dolorum eveniet architecto magnam nisi quidem autem a neque illum provident, similique ea nulla quo? Est reiciendis perferendis accusamus enim laudantium nisi numquam nam aperiam repellendus dignissimos maiores tenetur qui illum delectus suscipit quis distinctio dolores, voluptates id odio aut doloribus? Dolore quasi aspernatur nam consectetur, doloremque sit quia, velit iusto tempore nisi fugit eligendi magni officia cumque ratione illo et atque nulla est. Maxime sit molestias ullam odit. Voluptatum atque quo odio, excepturi dolores impedit repellendus numquam ut minus incidunt quam, quae sed. Architecto quo libero delectus laboriosam omnis. Eos, voluptatem. Sequi dolorem deleniti ut amet itaque nobis assumenda rerum quia tempore unde, libero laudantium dolor nulla optio hic mollitia quis officia debitis quo voluptate! Id nostrum accusamus soluta, asperiores facilis eveniet ipsa nemo deserunt cumque voluptas, eos, assumenda fuga iure omnis est pariatur consequatur non placeat reprehenderit sit quas molestiae quod repellat officia. In fuga inventore magnam ut cum! Reiciendis optio deserunt culpa quis facere est aperiam, officiis sapiente consectetur possimus! Perspiciatis aut nam id eos repellat necessitatibus laborum! Culpa sit fugiat expedita numquam, fuga voluptatibus qui ducimus veritatis deserunt repellendus obcaecati ea mollitia in. Adipisci, vero incidunt et, magni dolorum, fuga impedit distinctio dignissimos sequi fugit harum modi! Exercitationem, nisi et provident nostrum ducimus blanditiis quisquam eius a possimus error recusandae. Quisquam quibusdam voluptatum voluptate vero natus corporis molestiae vitae maiores maxime eum optio hic tempora nihil blanditiis, dignissimos, eaque vel quos. Fugiat optio tempora numquam rem alias similique eveniet reprehenderit ipsam ut modi? Libero, quas porro! Sapiente vero amet error ipsam accusamus harum iusto culpa itaque repudiandae non nesciunt numquam quibusdam est id tenetur aliquam, voluptatem ut eaque adipisci nemo recusandae officia? Dolor recusandae mollitia odio eligendi, maxime corrupti laborum fuga, officia, earum aliquam eum repellat? Quae odio aspernatur nihil sunt facilis facere beatae veritatis? Aut ullam quos error. Magni autem recusandae, fuga ullam nulla distinctio eum, omnis nesciunt repudiandae deleniti, facere dolorum quam cum explicabo harum adipisci optio aliquid facilis illum nobis iste aliquam maiores praesentium. Iste fugit sapiente at enim ex numquam eligendi, vitae, alias corporis officia culpa reprehenderit expedita. Vero ab nisi reiciendis veritatis distinctio? Iure, id soluta debitis at voluptatum ratione recusandae non! Officiis temporibus, tempore libero harum culpa commodi vero molestiae sint. Natus quis, nemo aperiam atque et nobis voluptatibus veritatis repellat error vero voluptates eum reprehenderit provident optio cum est commodi harum itaque molestias nostrum. Maiores voluptate labore consequatur, at similique et voluptatem nam inventore, minus maxime quidem non tempore. Consequuntur odio eligendi veritatis quaerat tenetur, nulla alias voluptatem consectetur nostrum suscipit id? Quaerat temporibus corporis obcaecati, dignissimos molestias error. Quis natus, architecto nemo voluptatibus nobis animi unde consequuntur temporibus nam voluptas beatae necessitatibus voluptates alias ea, suscipit deserunt iusto ullam, praesentium perspiciatis magni rerum aliquam omnis ab accusantium. Obcaecati.
        </p>
      </div>
      <Card title="Transactions" subtitle="Page-level local state for transactions.">
        <div className="mb-5 flex flex-wrap gap-3">
          <Button variant="outline" onClick={loadTransactions} loading={txLoading}>
            Refresh Transactions
          </Button>
          <Button variant="danger" onClick={handleCreateTransaction} loading={creatingTx}>
            Create Sample Transaction
          </Button>
        </div>

        {!txLoading && transactions.length === 0 && (
          <EmptyState
            icon="[Tx]"
            title="No transactions yet"
            description={txError || 'Create your first transaction to get started.'}
          />
        )}

        {!txLoading && transactions.length > 0 && (
          <ul className="space-y-2.5 text-sm text-[#5a4d46]">
            {transactions.map((item, index) => (
              <li key={item.id || index} className="rounded-md border border-[#dbcdbf] bg-[#f9f4ed] px-3.5 py-2.5 shadow-[0_2px_8px_rgba(40,28,20,0.06)]">
                {item.title || item.name || 'Transaction'}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

export default DashboardApiExample
