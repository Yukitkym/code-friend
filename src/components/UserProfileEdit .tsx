import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IoIosArrowDropdown, IoIosArrowDropright } from 'react-icons/io'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../atoms'
import { db, storage } from '../firebaseConfig'
import { hobbies, languages } from '../languagesAndHobbies'
import { Loading } from './Loading '

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
  const [hobbiesDisplay, setHobbiesDisplay] = useState(hobbies)

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

  const changeHobbiesDisplay = (tit: string) => {
    const copyHobbiesDisplay = hobbiesDisplay.map((hobbie) =>
      hobbie.title == tit ? { ...hobbie, isDisplay: !hobbie.isDisplay } : hobbie
    )
    setHobbiesDisplay(copyHobbiesDisplay)
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
        <h1 className="lg:text-[24px] py-[15px] lg:py-[20px] text-center">
          {page === 'notFirstTime' ? 'プロフィール編集ページ' : 'プロフィールを登録しましょう'}
        </h1>
        <div className="lg:w-[700px] mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10">
          <div className="text-[14px] lg:text-[16px] mx-[15px] lg:mx-[60px] my-[15px] lg:my-[40px]">
            <p className="mb-[5px]">プロフィール画像</p>
            <div className="w-[70px] lg:w-[100px] h-[70px] lg:h-[100px] relative mb-[10px]">
              <Image
                src={
                  userImage
                    ? userImage
                    : 'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2FpostInit.jpg?alt=media&token=b468ee38-405a-4044-a9f5-d55a38ff222e'
                }
                alt="プロフィール画像"
                layout="fill"
                className="rounded-full"
              />
            </div>
            <input id="image" type="file" className="text-[12px] lg:text-[16px] mt-[10px] lg:mt-[5px] mb-[15px]" />
            <p className="mb-[5px]">ユーザー名</p>
            <input
              value={userName}
              onChange={(e: any) => setUserName(e.target.value)}
              className="w-[100%] mb-[15px] text-black"
            />
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
            <input
              value={userContact}
              onChange={(e: any) => setUserContact(e.target.value)}
              className="w-[100%] mb-[15px] text-black"
            />
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
              {hobbiesDisplay.map(({ title, isDisplay, category }) => (
                <>
                  <p className="flex text-code-blue font-en pb-[10px]">
                    &quot;{title}&quot;
                    <span className="code-white">:</span>
                    {!isDisplay ? (
                      <IoIosArrowDropright
                        className="text-[25px] ml-[10px]"
                        onClick={() => changeHobbiesDisplay(title)}
                      />
                    ) : (
                      <IoIosArrowDropdown
                        className="text-[25px] ml-[10px]"
                        onClick={() => changeHobbiesDisplay(title)}
                      />
                    )}
                  </p>
                  <div className="flex flex-wrap float-left pl-[10px] mt-[-10px] mb-[15px] w-[100%]">
                    {category.map((hobby: string) => (
                      <div key={hobby} className="flex" style={{ display: isDisplay ? '' : 'none' }}>
                        <input
                          type="checkbox"
                          className="h-[16px] w-[16px] my-auto mr-[5px]"
                          id={hobby}
                          onChange={(e: any) => hobbyCheckboxClick(e)}
                        />
                        <p className="code-blue mr-[10px]">
                          {hobby}
                          <span className="code-white">,</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </div>
            {page === 'notFirstTime' && (
              <div>
                <button
                  onClick={clickEditDone}
                  className="lg:mt-[20px] bg-btn-blue w-[100%] rounded-full h-[40px] tracking-[3px]"
                >
                  編集完了
                </button>
                <div className="text-right">
                  <Link href="/setting/profile">
                    <button className="mt-[20px] lg:mt-[30px] bg-btn-gray w-[200px] rounded h-[40px]">
                      プロフィールページへ
                    </button>
                  </Link>
                </div>
              </div>
            )}
            {page === 'firstTime' && (
              <button
                onClick={clickEditDone}
                className="lg:mt-[20px] bg-btn-blue w-[100%] rounded-full h-[40px] tracking-[3px]"
              >
                登録完了
              </button>
            )}
          </div>
        </div>
      </div>
    )
  } else {
    return <Loading />
  }
}
