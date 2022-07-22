import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
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
  const [userPosts, setUserPosts] = useState([{ id: '', title: '', content: '', image: '' }])
  const [userPostNum, setUserPostNum] = useState(0)
  const [message, setMessage] = useState('')
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
          setUserEmail(userSnap.data().email)
          setUserImage(userSnap.data().image)
          setUserLanguages(userSnap.data().languages)
          setUserHobbies(userSnap.data().hobbies)
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
        .catch((error) => {
          setMessage(error)
        })
    } else {
      setMessage('ログインしていません')
    }
  }

  if (userEmail !== '') {
    return (
      <div>
        <p>プロフィール</p>
        {/* eslint-disable-next-line */}
        <img src={userImage} alt="プロフィール画像" className="w-[100px]" />
        <p>ユーザーID: {uid}</p>
        <p>ユーザー名: {userName}</p>
        <p>メールアドレス: {userEmail}</p>
        <p>プログラミング言語: {userLanguages}</p>
        <p>趣味: {userHobbies}</p>
        <br />
        {page === 'myProfile' && (
          <div>
            <Link href="/posts">
              <p>投稿一覧ページへ</p>
            </Link>
            <br />
            <Link href="/setting/profile/edit">
              <p>プロフィール編集ページへ</p>
            </Link>
            <br />
            <button onClick={clickLogout}>ログアウト</button>
            <p>{message}</p>
          </div>
        )}
        {page === 'otherProfile' && (
          <div>
            {userPageId === uid && (
              <Link href="/setting/profile/edit">
                <p>プロフィール編集ページへ</p>
              </Link>
            )}
            <br />
            <br />
            <br />
            <div>
              <p>投稿一覧</p>
              <br />
              {userPostNum === 0 && <p>投稿はありません</p>}
              {userPostNum >= 1 &&
                userPosts.map((post: any, index: number) => (
                  <div key={index}>
                    <p>ID: {post.id}</p>
                    {/* eslint-disable-next-line */}
                    <img src={post.image} alt="投稿サムネイル画像" className="w-[300px]" />
                    <p>タイトル: {post.title}</p>
                    <p>内容: {post.content}</p>
                    <Link href={`/posts/${post.id}`}>
                      <p>投稿詳細へ</p>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  } else {
    return <p>読み込み中です</p>
  }
}