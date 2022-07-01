import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { auth } from '../firebaseConfig'

export default function SignUp() {
  const router = useRouter()
  const [message, setMessage] = useState('')

  const clickSignUp = (e: any) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const userName: string = data.get('userName') !== null ? data.get('userName')!.toString() : ''
    const email = data.get('email') !== null ? data.get('email')!.toString() : ''
    const password = data.get('password') !== null ? data.get('password')!.toString() : ''
    const checkPassword = data.get('checkPassword') !== null ? data.get('checkPassword')!.toString() : ''
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    if (userName === '') {
      setMessage('ユーザーネームが入力されていません')
      return
    }
    if (userName.length >= 15) {
      setMessage('ユーザーネームは15文字以上入力できません')
      return
    }

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

    if (password.length < 6) {
      setMessage('パスワードが6文字以上入力されていません')
      return
    }

    if (password !== checkPassword) {
      setMessage('パスワードが一致していません')
      return
    }

    if (password === password.slice(0, 1).repeat(password.length)) {
      setMessage('パスワードが全て同じ文字です')
      return
    }

    // Firebase Authを使い、メールアドレスとパスワードを登録
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code

        switch (errorCode) {
          case 'auth/cancelled-popup-request':
          case 'auth/popup-closed-by-user':
            return
          case 'auth/email-already-in-use':
            setMessage('このメールアドレスは使用されています')
            return
          case 'auth/invalid-email':
            setMessage('メールアドレスの形式が正しくありません')
            return
          case 'auth/user-disabled':
            setMessage('サービスの利用が停止されています')
            return
          case 'auth/user-not-found':
            setMessage('メールアドレスまたはパスワードが違います')
            return
          case 'auth/user-mismatch':
            setMessage('認証されているユーザーと異なるアカウントが選択されました')
            return
          case 'auth/weak-password':
            setMessage('パスワードは6文字以上にしてください')
            return
          case 'auth/wrong-password':
            setMessage('メールアドレスまたはパスワードが違います')
            return
          case 'auth/popup-blocked':
            setMessage(
              '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください'
            )
            return
          case 'auth/operation-not-supported-in-this-environment':
          case 'auth/auth-domain-config-required':
          case 'auth/operation-not-allowed':
          case 'auth/unauthorized-domain':
            setMessage('現在この認証方法はご利用頂けません')
            return
          case 'auth/requires-recent-login':
            setMessage('認証の有効期限が切れています')
            return
          default:
            setMessage('認証に失敗しました。しばらく時間をおいて再度お試しください')
            return
        }
      })
  }
  return (
    <div>
      <h1>サインアップ</h1>
      <form onSubmit={(e: any) => clickSignUp(e)}>
        <p>ユーザーネーム</p>
        <input name="userName" className="bg-code-blue" />
        <p>メールアドレス</p>
        <input name="email" className="bg-code-blue" />
        <p>パスワード</p>
        <input name="password" className="bg-code-blue" />
        <p>パスワード確認用</p>
        <input name="checkPassword" className="bg-code-blue" />
        <button className="bg-code-green">サインアップ</button>
      </form>
      <p>{message}</p>
    </div>
  )
}
