import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { modal, modalAction } from '../atoms'
import { auth } from '../firebaseConfig'

export default function CheckMail() {
  const router = useRouter()
  const setOpen = useSetRecoilState(modal)
  const setAction = useSetRecoilState(modalAction)
  const [checkMail, setCheckMail] = useState(false)

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
        console.log(error)
      })
  }

  if (checkMail === false) {
    return (
      <div className="bg-bg-color text-code-white pb-[40px] min-h-[84vh]">
        <h1 className="text-center text-[24px] py-[20px]">メールアドレスの確認がされていません</h1>
        <div className="w-[600px] mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10">
          <div className="mx-[60px] my-[40px]">
            <p>メールアドレスを確認してください</p>
            <p>※受信ボックスではなく、迷惑メールフォルダに届いている可能性があります</p>
            <button
              className="bg-btn-blue w-[100%] rounded-full h-[40px] mt-[30px] tracking-[1px]"
              onClick={clickCheck}
            >
              メールアドレスを確認しました
            </button>
            <button className="bg-btn-gray w-[300px] rounded h-[40px] mt-[20px]" onClick={clickSendAgain}>
              確認メールを再度送る
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    router.push('/newUser/profile')
    setOpen(true)
    setAction('メールアドレスの確認')
    return (
      <div className="bg-bg-color text-code-white min-h-[84vh]">
        <p className="text-center text-[20px] pt-[20px]">メールアドレスが確認できました</p>
      </div>
    )
  }
}
