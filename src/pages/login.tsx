import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { isLoginState } from '../atoms'
import { auth } from '../firebaseConfig'

export default function Login() {
  const router = useRouter()

  /* eslint-disable-next-line */
  const [isLogin, setIsLogin] = useRecoilState(isLoginState)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLogin(true)
      router.push('/')
    } else {
      setIsLogin(false)
    }
  })

  const [message, setMessage] = useState('')
  const clickLogin = (e: any) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const email = data.get('email') !== null ? data.get('email')!.toString() : ''
    const password = data.get('password') !== null ? data.get('password')!.toString() : ''
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    if (email === '') {
      setMessage('メールアドレスが入力されていません')
      return
    }

    // メールアドレスの正規表現
    const pattern = /^[a-zA-Z0-9_+-]+(\.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/

    if (!pattern.test(email)) {
      setMessage('メールアドレスに不正な値が入力されています')
      return
    }

    if (password === '') {
      setMessage('パスワードが入力されていません')
      return
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLogin(true)
        router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code
        setMessage(errorCode)
      })
  }
  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={(e: any) => clickLogin(e)}>
        <p>メールアドレス</p>
        <input name="email" className="bg-code-blue" />
        <p>パスワード</p>
        <input name="password" className="bg-code-blue" />
        <br />
        <br />
        <button className="bg-code-green">ログイン</button>
      </form>
      <p>
        新規登録がまだの方は
        <Link href="/signUp">
          <a className="text-code-blue">こちら</a>
        </Link>
        へ
      </p>
      <p>{message}</p>
    </div>
  )
}
