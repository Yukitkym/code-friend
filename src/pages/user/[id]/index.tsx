import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { isLoginState, uidState } from '../../../atoms'
import { db } from '../../../firebaseConfig'

export default function UserId() {
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
  const [userPosts, setUserPosts] = useState([{ id: '', title: '', content: '', image: '' }])
  const [userPostNum, setUserPostNum] = useState(0)

  const userId = router.asPath.slice(6)

  useEffect(() => {
    const getUserProfile = async () => {
      if (userId !== '') {
        const userRef = doc(db, 'users', userId)
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
  }, [userId])

  if (userEmail !== '') {
    return (
      <div>
        <p>プロフィール</p>
        {/* eslint-disable-next-line */}
        <img src={userImage} alt="プロフィール画像" className="w-[100px]" />
        <p>ユーザーID: {userId}</p>
        <p>ユーザー名: {userName}</p>
        <p>メールアドレス: {userEmail}</p>
        <p>プログラミング言語: {userLanguages}</p>
        <p>趣味: {userHobbies}</p>
        <br />
        {userId === uid && (
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
    )
  } else {
    return <p>読み込み中です</p>
  }
}