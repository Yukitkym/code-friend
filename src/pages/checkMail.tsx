import { onAuthStateChanged, sendEmailVerification } from "firebase/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { modal, modalAction } from "../atoms"
import { auth } from "../firebaseConfig"

export default function CheckMail() {
  const router = useRouter()
  const setOpen = useSetRecoilState(modal)
  const setAction = useSetRecoilState(modalAction)
  const [checkMail, setCheckMail] = useState(false)
  const [message, setMessage] = useState('')

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCheckMail(user.emailVerified)
    }
  })

  const clickCheck = () => {
    window.location.reload()
  }

  const clickSendAgain = () => {
    sendEmailVerification(auth.currentUser)
    .then(() => {
      setOpen(true)
      setAction('メールアドレスの確認メールの送信')
    })
    .catch((error) => {
      setMessage(error)
    })
  }

  if (checkMail === false) {
    return (
      <div>
        <p className="text-red-600">{message}</p>
        <p>メールアドレスの確認がされていません</p>
        <p>メールアドレスを確認してください</p>
        <br />
        <button onClick={clickCheck}>メールアドレスを確認しました</button>
        <br />
        <button onClick={clickSendAgain}>確認メールを再度送る</button>
      </div>
    )
  } else {
    router.push('/newUser')
    setOpen(true)
    setAction('メールアドレスの確認')
    return (
      <div>
        <p>メールアドレスが確認できました</p>
      </div>
    )
  }
}