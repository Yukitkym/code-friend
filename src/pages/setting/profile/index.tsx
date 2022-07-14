import { signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { isLoginState, uidState } from "../../../atoms"
import { auth, db } from "../../../firebaseConfig"

export default function Profile() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useRecoilState(isLoginState)
  const [uid, setUid] = useRecoilState(uidState)

  useEffect(() => {
    if (isLogin === false) {
      router.push("/")
    }
  }, [isLogin])

  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userLanguages, setUserLanguages] = useState(["None"])
  const [userHobbies, setUserHobbies] = useState(["None"])

  const [message, setMessage] = useState("")

  const getUserProfile = async () => {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      setUserName(userSnap.data().name)
      setUserEmail(userSnap.data().email)
      setUserLanguages(userSnap.data().languages)
      setUserHobbies(userSnap.data().hobbies)
    }
  }
  getUserProfile()

  const clickLogout = () => {
    if (isLogin === true) {
      signOut(auth)
        .then(() => {
          setUid("")
          setIsLogin(false)
          // router.push("/")
        })
        .catch((error) => {
          setMessage(error)
        })
    } else {
      setMessage("ログインしていません")
    }
  }

  return (
    <div>
      <p>プロフィール</p>
      <p>ユーザーID: {uid}</p>
      <p>ユーザー名: {userName}</p>
      <p>メールアドレス: {userEmail}</p>
      <p>プログラミング言語: {userLanguages}</p>
      <p>趣味: {userHobbies}</p>
      <p>投稿はこちらへ(後々リンクを作成予定)</p>
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