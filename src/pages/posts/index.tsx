import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { isLoginState, uidState } from '../../atoms'
import { db } from '../../firebaseConfig'

export default function Posts() {
  const router = useRouter()

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)

  useEffect(() => {
    if (isLogin === false) {
      router.push('/')
    }
    /* eslint-disable-next-line */
  }, [isLogin])

  const [posts, setPosts] = useState([{ id: '', title: '', content: '' }])
  // 読み込み中か判別するために-1に設定
  const [postNum, setPostNum] = useState(-1)

  useEffect(() => {
    const getUserPosts = async () => {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        setPosts(userSnap.data().posts)
        setPostNum(userSnap.data().postNum)
      }
    }
    getUserPosts()
  }, [uid])

  if (postNum >= 0) {
    return (
      <div>
        <p>投稿一覧</p>
        <br />
        {postNum === 0 && <p>投稿はありません</p>}
        {postNum >= 1 &&
          posts.map((post: any, index: number) => (
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
        <br />
        <Link href="/createPost">
          <p>新規投稿はこちら</p>
        </Link>
      </div>
    )
  } else {
    return <p>読み込み中です</p>
  }
}
