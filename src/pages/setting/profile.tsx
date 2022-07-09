import { onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { isLoginState, uidState } from "../../atoms"
import { auth } from "../../firebaseConfig"

export default function Profile() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useRecoilState(isLoginState)
  const [uid, setUid] = useRecoilState(uidState)

  useEffect(() => {
    if (isLogin === false) {
      router.push("/")
    }
  }, [isLogin])

  const [message, setMessage] = useState("")

  const clickLogout = () => {

    if (isLogin === true) {
      signOut(auth)
        .then(() => {
          setIsLogin(false)
          setUid("")
          router.push("/")
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
      <button onClick={clickLogout}>ログアウト</button>
      <p>{message}</p>
    </div>
  )
}