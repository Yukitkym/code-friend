import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../atoms'
import { auth, db } from '../firebaseConfig'

export default function UserProfile(props) {
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
      signOut(auth).then(() => {
        setUid('')
        setIsLogin(false)
        router.push('/')
        setOpen(true)
        setAction('ログアウト')
      })
    }
  }

  if (userName !== '') {
    return (
      <div className="bg-bg-color text-code-white pb-[40px]">
        <h1 className="text-center text-[24px] py-[20px]">プロフィール</h1>
        <div className="w-[600px] mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10">
          <div className="mx-[60px] my-[40px]">
            <div className="w-[100px] mx-auto mb-[30px]">
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
            {userProfile !== '' ?
            (
              <div>
                <p className="mb-[4px]">プロフィール文</p>
                <div className='bg-zinc-700 w-[100%] rounded'>
                  <div className='p-[10px]'>
                    {userProfile.split('\n').map((sentence) => (
                      <p className="text-code-blue">{sentence}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mb-[10px]">プロフィール文: <span className="text-code-blue">記載なし</span></p>
            )}
            {readingUserId === uid && (
              <div className="mt-[40px]">
                <Link href="/setting/profile/edit">
                  <button className="bg-btn-blue w-[250px] rounded h-[40px] mr-[20px]">プロフィール編集ページへ</button>
                </Link>
                <Link href="/createPost">
                  <button className="bg-btn-blue w-[200px] rounded h-[40px]">新規投稿ページへ</button>
                </Link>
                <div className="text-right mt-[40px]">
                  <button className="bg-orange-700 w-[150px] rounded-full h-[40px]" onClick={clickLogout}>
                    ログアウト
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-[900px] mx-auto">
          <div>
            <p className="text-center text-[24px] mt-[40px] mb-[30px]">投稿一覧</p>
            {userPostNum === 0 && <p className="text-center">投稿はありません</p>}
            {userPostNum === 1 &&
              userPosts.map((post: any, index: number) => (
                <div key={index} className="relative w-[270px] h-[180px] mb-[30px] mx-[auto]">
                  <Image src={post.image} alt="投稿サムネイル画像" layout="fill" />
                  <div className="absolute bg-black opacity-[40%] w-[100%] h-[100%]"></div>
                  <p className="text-code-white absolute text-[24px] mx-[10px] mt-[10px]">{post.title}</p>
                  <Link href={`/posts/${post.id}`}>
                    <a className="text-code-white absolute top-[130px] border-[1px] border-code-white rounded bg-code-blue opacity-[75%] px-[60px] py-[6px] ml-[30px]">
                      投稿詳細へ
                    </a>
                  </Link>
                </div>
              ))}
            {userPostNum >= 2 && (
              <div className="flex flex-wrap">
                {userPosts.map((post: any, index: number) => (
                  <div key={index} className="relative w-[270px] h-[180px] mb-[30px] mx-[15px]">
                    <Image src={post.image} alt="投稿サムネイル画像" layout="fill" />
                    <div className="absolute bg-black opacity-[40%] w-[100%] h-[100%]"></div>
                    <p className="text-code-white absolute text-[24px] mx-[10px] mt-[10px]">{post.title}</p>
                    <Link href={`/posts/${post.id}`}>
                      <a className="text-code-white absolute top-[130px] border-[1px] border-code-white rounded bg-code-blue opacity-[75%] px-[60px] py-[6px] ml-[30px]">
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
    return (
      <div className="bg-bg-color text-code-white h-[84vh]">
        <p className="text-center text-[20px] pt-[20px]">読み込み中です</p>
      </div>
    )
  }
}
