import { signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLoginState, uidState } from '../atoms'
import { auth } from '../firebaseConfig'

export default function Login() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useRecoilState(isLoginState)
  const setUid = useSetRecoilState(uidState)

  useEffect(() => {
    if (isLogin === true) {
      router.push('/')
    }
  }, [isLogin, router])

  const [message, setMessage] = useState('')
  const clickLogin = (e: any) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    const email: string = (data.get('email') ?? '').toString()
    const password: string = (data.get('password') ?? '').toString()

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
      .then((userCredential) => {
        setIsLogin(true)
        setUid(userCredential.user.uid)
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
