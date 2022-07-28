import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../atoms'
import { auth, db } from '../firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'

export default function LoginSignUp(props) {
  // ログインページの時はlogin、新規登録ページの時はsignUp
  const page = props.page

  const router = useRouter()

  const [isLogin, setIsLogin] = useRecoilState(isLoginState)
  const setUid = useSetRecoilState(uidState)
  const setOpen = useSetRecoilState(modal)
  const setAction = useSetRecoilState(modalAction)

  useEffect(() => {
    if (isLogin === true) {
      router.push('/')
    }
  }, [isLogin, router])

  const [message, setMessage] = useState('')
  const errorMessage = (errorCode: string) => {
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
        setMessage('認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください')
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
  }

  const loginOrSignUpFunction = (loginOrSignUp: string, e: any) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    const userName: string = (data.get('userName') ?? '').toString()
    const email: string = (data.get('email') ?? '').toString()
    const password: string = (data.get('password') ?? '').toString()
    const checkPassword: string = (data.get('checkPassword') ?? '').toString()

    if (userName === '' && loginOrSignUp === 'signUp') {
      setMessage('ユーザーネームが入力されていません')
      return
    }
    if (userName.length >= 15 && loginOrSignUp === 'signUp') {
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

    if (password.length < 6 && loginOrSignUp === 'signUp') {
      setMessage('パスワードが6文字以上入力されていません')
      return
    }

    if (password !== checkPassword && loginOrSignUp === 'signUp') {
      setMessage('パスワードが一致していません')
      return
    }

    if (password === password.slice(0, 1).repeat(password.length) && loginOrSignUp === 'signUp') {
      setMessage('パスワードが全て同じ文字です')
      return
    }

    if (loginOrSignUp === 'login') {
      // ログイン時
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setIsLogin(true)
          setUid(userCredential.user.uid)
          userCredential.user.emailVerified ? router.push('/') : router.push('/checkMail')
          setOpen(true)
          setAction('ログイン')
        })
        .catch((error) => {
          errorMessage(error.code)
        })
    } else {
      // 新規登録時
      const setUserFireStore = async (uid: string) => {
        await setDoc(doc(db, 'users', uid), {
          hobbies: ['None'],
          languages: ['None'],
          name: userName,
          email: email,
          profile: '',
          image:
            'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/userImages%2Finit.jpg?alt=media&token=69a50ddd-5912-4415-91cb-1cdb1fdf6d3f',
          postNum: 0,
          posts: [{}]
        })
        setIsLogin(true)
        setUid(uid)
        await sendEmailVerification(auth.currentUser).then(() => {
          router.push('/checkMail')
          setOpen(true)
          setAction('新規登録')
        })
      }

      // Firebase Authを使い、メールアドレスとパスワードを登録
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setUserFireStore(userCredential.user.uid)
        })
        .catch((error) => {
          errorMessage(error.code)
        })
    }
  }

  const clickLogin = (e: any) => {
    loginOrSignUpFunction('login', e)
  }

  const clickSignUp = (e: any) => {
    loginOrSignUpFunction('signUp', e)
  }

  if (page === 'login') {
    return (
      <div className="min-h-[88vh] lg:min-h-[84vh] bg-bg-color text-code-white">
        <div className="lg:w-[450px] mx-auto">
          <h1 className="lg:text-[24px] py-[15px] lg:py-[20px] text-center">ログイン</h1>
          <p className="text-[14px] lg:text-[16px] lg:pb-[20px] text-center">
            新規登録がまだの方は
            <Link href="/signUp">
              <a className="text-code-blue">こちら</a>
            </Link>
            へ
          </p>
          <form
            className="w-[80%] lg:w-auto mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10"
            onSubmit={(e: any) => clickLogin(e)}
          >
            <div className="text-[14px] lg:text-[16px] mx-[20px] lg:mx-[60px] my-[15px] lg:my-[40px]">
              <p className="text-red-500 mb-[10px]">{message}</p>
              <p>メールアドレス</p>
              <input name="email" className="w-[100%] text-black-light mb-[20px]" />
              <p>パスワード</p>
              <input name="password" type="password" className="mb-[30px] lg:mb-[40px] w-[100%] text-black-light" />
              <button className="h-[30px] lg:h-[40px] bg-btn-blue w-[100%] rounded-full">ログイン</button>
            </div>
          </form>
        </div>
      </div>
    )
  } else {
    return (
      <div className="min-h-[88vh] lg:min-h-[84vh] lg:pb-[40px] bg-bg-color text-code-white">
        <div className="lg:w-[450px] mx-auto">
          <h1 className="lg:text-[24px] py-[15px] lg:py-[20px] text-center">サインアップ</h1>
          <p className="text-[14px] lg:text-[16px] lg:pb-[20px] text-center">
            新規登録済みの方は
            <Link href="/login">
              <a className="text-code-blue">こちら</a>
            </Link>
            へ
          </p>
          <form
            className="w-[80%] lg:w-auto mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10"
            onSubmit={(e: any) => clickSignUp(e)}
          >
            <div className="text-[14px] lg:text-[16px] mx-[20px] lg:mx-[60px] my-[15px] lg:my-[40px]">
              <p className="mb-[5px] lg:mb-[10px] text-red-500">{message}</p>
              <p>ユーザーネーム</p>
              <input name="userName" className="mb-[15px] lg:mb-[20px] w-[100%] text-black-light" />
              <p>メールアドレス</p>
              <input name="email" className="mb-[15px] lg:mb-[20px] w-[100%] text-black-light" />
              <p>パスワード</p>
              <input name="password" type="password" className="mb-[15px] lg:mb-[20px] w-[100%] text-black-light" />
              <p>パスワード確認用</p>
              <input name="checkPassword" type="password" className="mb-[25px] lg:mb-[40px] w-[100%] text-black-light" />
              <button className="h-[30px] lg:h-[40px] bg-btn-blue w-[100%] rounded-full">サインアップ</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
