import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../atoms'
import { db, storage } from '../firebaseConfig'
import { games, languages, sports, watching } from '../languagesAndHobbies'

export default function UserProfileEdit(props) {
  // 通常のプロフィール編集時は'notFirstTime'、新規登録後のプロフィール編集時は'firstTime'
  const page = props.page

  const router = useRouter()

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)
  const setOpen = useSetRecoilState(modal)
  const setAction = useSetRecoilState(modalAction)

  useEffect(() => {
    if (isLogin === false) {
      router.push('/')
    }
    /* eslint-disable-next-line */
  }, [isLogin])

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userProfile, setUserProfile] = useState('')
  const [userImage, setUserImage] = useState('')
  const [userLanguages, setUserLanguages] = useState(['None'])
  const [userHobbies, setUserHobbies] = useState(['None'])
  const [userContact, setUserContact] = useState('')

  useEffect(() => {
    const getUserProfile = async () => {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)

      // userEmail !== userSnap.data().email は、useStateによる無限ループを防ぐために
      if (userSnap.exists() && userEmail !== userSnap.data().email) {
        setUserName(userSnap.data().name)
        setUserEmail(userSnap.data().email)
        setUserProfile(userSnap.data().profile)
        setUserImage(userSnap.data().image)
        setUserLanguages(userSnap.data().languages)
        setUserHobbies(userSnap.data().hobbies)
        setUserContact(userSnap.data().contact)
      }

      // firestoreから取ってきた情報をチェックボックスに反映させる
      for (let i = 0; i < userLanguages.length; i++) {
        if (userLanguages.length !== 1 || userLanguages[0] !== 'None') {
          const languageCheckbox = document.getElementById(userLanguages[i]) as HTMLInputElement
          languageCheckbox.checked = true
        }
      }
      for (let i = 0; i < userHobbies.length; i++) {
        if (userHobbies.length !== 1 || userHobbies[0] !== 'None') {
          const hobbyCheckbox = document.getElementById(userHobbies[i]) as HTMLInputElement
          hobbyCheckbox.checked = true
        }
      }
    }
    getUserProfile()
  }, [uid, userEmail, userHobbies, userLanguages])

  const languageCheckboxClick = (e: any) => {
    if (e.target.checked === true) {
      if (userLanguages[0] === 'None') {
        setUserLanguages([e.target.id])
      } else {
        setUserLanguages([...userLanguages, e.target.id])
      }
    } else {
      const newFilteringLanguages = userLanguages.filter((language) => !language.match(e.target.id))
      if (newFilteringLanguages.length !== 0) {
        setUserLanguages(newFilteringLanguages)
      } else {
        setUserLanguages(['None'])
      }
    }
  }

  const hobbyCheckboxClick = (e: any) => {
    if (e.target.checked === true) {
      if (userHobbies[0] === 'None') {
        setUserHobbies([e.target.id])
      } else {
        setUserHobbies([...userHobbies, e.target.id])
      }
    } else {
      const newFilteringHobbies = userHobbies.filter((hobby) => !hobby.match(e.target.id))
      if (newFilteringHobbies.length !== 0) {
        setUserHobbies(newFilteringHobbies)
      } else {
        setUserHobbies(['None'])
      }
    }
  }

  const clickEditDone = async () => {
    const image = document.getElementById('image') as HTMLInputElement
    if (image.value !== '') {
      await uploadBytes(ref(storage, `userImages/${uid}`), image.files[0])
      const pathReference = ref(storage, `userImages/${uid}`)
      let imageUrl = ''
      await getDownloadURL(pathReference).then((url) => {
        imageUrl = url
        setUserImage(url)
      })
      await updateDoc(doc(db, 'users', uid), {
        name: userName,
        profile: userProfile,
        image: imageUrl,
        languages: userLanguages,
        hobbies: userHobbies,
        contact: userContact
      })
    } else {
      await updateDoc(doc(db, 'users', uid), {
        name: userName,
        profile: userProfile,
        languages: userLanguages,
        hobbies: userHobbies,
        contact: userContact
      })
    }
    if (page === 'notFirstTime') {
      router.push('/setting/profile')
      setOpen(true)
      setAction('プロフィールの編集')
    } else {
      router.push('/newUser/post')
      setOpen(true)
      setAction('プロフィールの登録')
    }
  }

  if (userEmail !== '') {
    return (
      <div className="bg-bg-color text-code-white pb-[40px]">
        <h1 className="text-center text-[24px] py-[20px]">{page === 'notFirstTime' ? 'プロフィール編集ページ' : 'プロフィールを登録しましょう'}</h1>
        <div className="w-[700px] mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10">
          <div className="mx-[60px] my-[40px]">
            <p className="mb-[5px]">プロフィール画像</p>
            <div className="w-[100px] mb-[10px]">
              <Image
                src={
                  userImage
                    ? userImage
                    : 'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2FpostInit.jpg?alt=media&token=b468ee38-405a-4044-a9f5-d55a38ff222e'
                }
                alt="プロフィール画像"
                width="100px"
                height="100px"
                className="rounded-full"
              />
            </div>
            <input id="image" type="file" className="mb-[15px]" />
            <p className="mb-[5px]">ユーザー名</p>
            <input value={userName} onChange={(e: any) => setUserName(e.target.value)} className="w-[100%] mb-[15px] text-black" />
            <p className="mb-[5px]">ユーザープロフィール</p>
            <textarea
              name="userProfile"
              cols={10}
              rows={6}
              value={userProfile}
              onChange={(e: any) => setUserProfile(e.target.value)}
              className="w-[100%] text-black mb-[10px]"
            />
            <p className="mb-[5px]">連絡先</p>
            <input value={userContact} onChange={(e: any) => setUserContact(e.target.value)} className="w-[100%] mb-[15px] text-black" />
            <p className="mb-[5px]">プログラミング言語</p>
            <div className="flex flex-wrap float-left mb-[15px]">
              {languages.map((language: string, index: number) => (
                <div key={index} className="flex">
                  <input
                    type="checkbox"
                    className="h-[16px] w-[16px] m-auto"
                    id={language}
                    onChange={(e: any) => languageCheckboxClick(e)}
                  />
                  <p className="code-blue mr-[10px]">{language},</p>
                </div>
              ))}
            </div>
            <p className="mb-[5px]">趣味</p>
            <div className="flex flex-wrap float-left mb-[15px]">
              {games.map((game: string, index: number) => (
                <div key={index} className="flex">
                  <input
                    type="checkbox"
                    className="h-[16px] w-[16px] m-auto"
                    id={game}
                    onChange={(e: any) => hobbyCheckboxClick(e)}
                  />
                  <p className="code-blue mr-[10px]">{game},</p>
                </div>
              ))}
              {sports.map((sport: string, index: number) => (
                <div key={index} className="flex">
                  <input
                    type="checkbox"
                    className="h-[16px] w-[16px] m-auto"
                    id={sport}
                    onChange={(e: any) => hobbyCheckboxClick(e)}
                  />
                  <p className="code-blue mr-[10px]">{sport},</p>
                </div>
              ))}
              {watching.map((watch: string, index: number) => (
                <div key={index} className="flex">
                  <input
                    type="checkbox"
                    className="h-[16px] w-[16px] m-auto"
                    id={watch}
                    onChange={(e: any) => hobbyCheckboxClick(e)}
                  />
                  <p className="code-blue mr-[10px]">{watch},</p>
                </div>
              ))}
            </div>
            {page === 'notFirstTime' && (
              <div>
                <button onClick={clickEditDone} className="bg-btn-blue w-[100%] rounded-full h-[40px] mt-[20px] tracking-[3px]">編集完了</button>
                <div className="text-right">
                  <Link href="/setting/profile">
                    <button className="bg-btn-gray w-[200px] rounded h-[40px] mt-[30px]">プロフィールページへ</button>
                  </Link>
                </div>
              </div>
            )}
            {page === 'firstTime' && <button onClick={clickEditDone} className="bg-btn-blue w-[100%] rounded-full h-[40px] mt-[20px] tracking-[3px]">登録完了</button>}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="bg-bg-color text-code-white h-[84vh]">
        <p className="text-center text-[20px] pt-[20px]">読み込み中です</p>
      </div>
    )
  }
}
