import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../atoms'
import { auth, db } from '../firebaseConfig'
import { Loading } from './Loading '

export default function UserProfile(props: any) {
  const page = props.page

  const router = useRouter()

  const [isLogin, setIsLogin] = useRecoilState(isLoginState)
  const [uid, setUid] = useRecoilState(uidState)
  const setOpen = useSetRecoilState(modal)
  const setAction = useSetRecoilState(modalAction)

  useEffect(() => {
    if (isLogin === false && page === 'myProfile') {
      router.push('/')
    }
    /* eslint-disable-next-line */
  }, [isLogin])

  const [userName, setUserName] = useState('')
  const [userProfile, setUserProfile] = useState('')
  const [userImage, setUserImage] = useState('')
  const [userLanguages, setUserLanguages] = useState(['None'])
  const [userHobbies, setUserHobbies] = useState(['None'])
  const [userContact, setUserContact] = useState('')
  const [userPosts, setUserPosts] = useState([{ id: '', title: '', content: '', image: '' }])
  const [userPostNum, setUserPostNum] = useState(0)
  // /user/[id]ページの際に[id]の部分を取得
  const userPageId = router.asPath.slice(6)
  // 情報を取ってくるユーザーのID
  const readingUserId = page === 'myProfile' ? uid : userPageId

  useEffect(() => {
    const getUserProfile = async () => {
      if (readingUserId !== '') {
        const userRef = doc(db, 'users', readingUserId)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          setUserName(userSnap.data().name)
          setUserProfile(userSnap.data().profile)
          setUserImage(userSnap.data().image)
          setUserLanguages(userSnap.data().languages)
          setUserHobbies(userSnap.data().hobbies)
          setUserContact(userSnap.data().contact)
          setUserPosts(userSnap.data().posts)
          setUserPostNum(userSnap.data().postNum)
        }
      }
    }
    getUserProfile()
  }, [readingUserId])

  const clickLogout = () => {
    if (isLogin === true) {
      signOut(auth)
        .then(() => {
          setUid('')
          setIsLogin(false)
          router.push('/')
          setOpen(true)
          setAction('ログアウト')
        })
        .catch((error) => console.log(error))
    }
  }

  if (userName !== '') {
    return (
      <div className="min-h-[88vh] lg:min-h-[84vh] bg-bg-color text-code-white pb-[40px]">
        <h1 className="lg:text-[24px] py-[15px] lg:py-[20px] text-center">プロフィール</h1>
        <div className="lg:w-[600px] mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10">
          <div className="text-[14px] lg:text-[16px] mx-[15px] lg:mx-[60px] my-[15px] lg:my-[40px]">
            <div className="w-[70px] lg:w-[100px] h-[70px] lg:h-[100px] mb-[15px] lg:mb-[30px] relative mx-auto">
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
            <p className="mb-[10px]">
              ユーザー名: <span className="text-code-blue">{userName}</span>
            </p>
            <p className="mb-[10px]">
              プログラミング言語: <span className="text-code-blue">{userLanguages.join(', ')}</span>
            </p>
            <p className="mb-[10px]">
              趣味: <span className="text-code-blue">{userHobbies.join(', ')}</span>
            </p>
            <p className="mb-[10px]">
              コンタクト: <span className="text-code-blue">{userContact !== '' ? userContact : '記載なし'}</span>
            </p>
            {userProfile !== '' ? (
              <div>
                <p className="mb-[4px]">プロフィール文</p>
                <div className="bg-zinc-700 w-[100%] rounded">
                  <div className="p-[10px]">
                    {userProfile.split('\n').map((sentence: string, index: number) => (
                      <p key={index}>{sentence}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mb-[10px]">
                プロフィール文: <span className="text-code-blue">記載なし</span>
              </p>
            )}
            {readingUserId === uid && (
              <div className="mt-[20px] lg:mt-[40px]">
                <Link href="/setting/profile/edit">
                  <button className="w-[180px] lg:w-[250px] h-[35px] lg:h-[40px] bg-btn-blue rounded mr-[10px]">
                    プロフィール編集ページへ
                  </button>
                </Link>
                <Link href="/createPost">
                  <button className="w-[130px] lg:w-[200px] h-[35px] lg:h-[40px] bg-btn-blue rounded">
                    新規投稿ページへ
                  </button>
                </Link>
                <div className="mt-[25px] lg:mt-[40px] text-right">
                  <button className="bg-orange-700 w-[150px] rounded-full h-[40px]" onClick={clickLogout}>
                    ログアウト
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:w-[900px] mx-auto">
          <div className="text-[14px] lg:text-[16px]">
            <p className="lg:text-[24px] py-[15px] lg:py-[20px] mt-[25px] lg:mt-[40px] mb-[20px] lg:mb-[30px] text-center">
              投稿一覧
            </p>
            {userPostNum === 0 && <p className="text-center">投稿はありません</p>}
            {userPostNum === 1 &&
              userPosts.map((post: any, index: number) => (
                <div key={index} className="w-[195px] lg:w-[270px] h-[130px] lg:h-[180px] relative mb-[30px] mx-[auto]">
                  <Image src={post.image} alt="投稿サムネイル画像" layout="fill" />
                  <div className="absolute bg-black opacity-[40%] w-[100%] h-[100%]"></div>
                  <p className="text-[16px] lg:text-[24px] text-code-white absolute mx-[10px] mt-[10px]">
                    {post.title}
                  </p>
                  <Link href={`/posts/${post.id}`}>
                    <a className="top-[90px] lg:top-[130px] px-[25px] lg:px-[60px] py-[3px] lg:py-[6px] ml-[35px] lg:ml-[30px] text-code-white absolute border-[1px] border-code-white rounded bg-code-blue opacity-[75%]">
                      投稿詳細へ
                    </a>
                  </Link>
                </div>
              ))}
            {userPostNum >= 2 && (
              <div className="lg:flex lg:flex-wrap">
                {userPosts.map((post: any, index: number) => (
                  <div
                    key={index}
                    className="w-[195px] lg:w-[270px] h-[130px] lg:h-[180px] mx-auto lg:mx-[15px] mb-[15px] lg:mb-[30px] relative"
                  >
                    <Image src={post.image} alt="投稿サムネイル画像" layout="fill" />
                    <div className="absolute bg-black opacity-[40%] w-[100%] h-[100%]"></div>
                    <p className="text-[16px] lg:text-[24px] text-code-white absolute mx-[10px] mt-[10px]">
                      {post.title}
                    </p>
                    <Link href={`/posts/${post.id}`}>
                      <a className="top-[90px] lg:top-[130px] px-[25px] lg:px-[60px] py-[3px] lg:py-[6px] ml-[35px] lg:ml-[30px] text-code-white absolute border-[1px] border-code-white rounded bg-code-blue opacity-[75%]">
                        投稿詳細へ
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } else {
    return <Loading />
  }
}
