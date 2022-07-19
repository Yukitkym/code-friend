import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { isLoginState, uidState } from '../../../atoms'
import { db, storage } from '../../../firebaseConfig'
import { games, languages, sports, watching } from '../../../languagesAndHobbies'

export default function ProfileEdit() {
  const router = useRouter()

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)

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

  const getUserProfile = async () => {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    // userEmail !== userSnap.data().email は、useStateによる無限ループを防ぐために
    if (userSnap.exists() && userEmail !== userSnap.data().email) {
      setUserName(userSnap.data().name)
      setUserEmail(userSnap.data().email)
      setUserImage(userSnap.data().image)
      setUserLanguages(userSnap.data().languages)
      setUserHobbies(userSnap.data().hobbies)
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
      updateDoc(doc(db, 'users', uid), {
        name: userName,
        image: imageUrl,
        languages: userLanguages,
        hobbies: userHobbies
      })
    } else {
      updateDoc(doc(db, 'users', uid), {
        name: userName,
        languages: userLanguages,
        hobbies: userHobbies
      })
    }
  }

  if (userEmail !== '') {
    return (
      <div>
        <p>プロフィール編集ページです</p>
        <br />
        <p>ユーザー名</p>
        <input value={userName} onChange={(e: any) => setUserName(e.target.value)} />
        <br />
        <br />
        {/* eslint-disable-next-line */}
        <img src={userImage} alt="現在のプロフィール画像" className="w-[100px]" />
        <br />
        <input id="image" type="file" />
        <br />
        <br />
        <p>プログラミング言語</p>
        <div className="flex">
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
        <br />
        <p>趣味</p>
        <div className="flex">
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
        <br />
        <button onClick={clickEditDone}>編集完了</button>
        <br />
        <br />
        <Link href="/setting/profile">
          <p>プロフィールページへ</p>
        </Link>
      </div>
    )
  } else {
    return (
      <p>読み込み中です</p>
    )
  }
}
