import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { isLoginState, uidState } from '../../../atoms'
import { auth, db } from '../../../firebaseConfig'

export default function Profile() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useRecoilState(isLoginState)
  const [uid, setUid] = useRecoilState(uidState)

  useEffect(() => {
    if (isLogin === false) {
      router.push('/')
    }
    /* eslint-disable-next-line */
  }, [isLogin])

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userImage, setUserImage] = useState('')
  const [userLanguages, setUserLanguages] = useState(['None'])
  const [userHobbies, setUserHobbies] = useState(['None'])

  const [message, setMessage] = useState('')

  const getUserProfile = async () => {
    if (uid !== '') {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        setUserName(userSnap.data().name)
        setUserEmail(userSnap.data().email)
        setUserImage(userSnap.data().image)
        setUserLanguages(userSnap.data().languages)
        setUserHobbies(userSnap.data().hobbies)
      }
    }
  }
  getUserProfile()

  const clickLogout = () => {
    if (isLogin === true) {
      signOut(auth)
        .then(() => {
          setUid('')
          setIsLogin(false)
          router.push('/')
        })
        .catch((error) => {
          setMessage(error)
        })
    } else {
      setMessage('ログインしていません')
    }
  }

  return (
    <div>
      <p>プロフィール</p>
      {/* eslint-disable-next-line */}
      <img src={userImage} alt="プロフィール画像" className="w-[100px]" />
      <p>ユーザーID: {uid}</p>
      <p>ユーザー名: {userName}</p>
      <p>メールアドレス: {userEmail}</p>
      <p>プログラミング言語: {userLanguages}</p>
      <p>趣味: {userHobbies}</p>
      <br />
      <Link href="/posts">
        <p>投稿一覧ページへ</p>
      </Link>
      <br />
      <Link href="/setting/profile/edit">
        <p>プロフィール編集ページへ</p>
      </Link>
      <br />
      <button onClick={clickLogout}>ログアウト</button>
      <p>{message}</p>
    </div>
  )
}
