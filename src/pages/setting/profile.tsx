import { onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { useState } from "react"
import { useRecoilState } from "recoil"
import { isLoginState } from "../../atoms"
import { auth } from "../../firebaseConfig"

export default function Profile() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useRecoilState(isLoginState)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLogin(true)
    } else {
      setIsLogin(false)
      router.push("/")
    }
  })

  const [message, setMessage] = useState("")

  const clickLogout = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        signOut(auth)
          .then(() => {
            setIsLogin(false)
            router.push("/")
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        setMessage("ログインしていません")
      }
    })
  }

  return (
    <div>
      <p>プロフィール</p>
      <button onClick={clickLogout}>ログアウト</button>
      <p>{message}</p>
    </div>
  )
}