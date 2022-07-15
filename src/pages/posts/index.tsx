import { doc, getDoc } from "firebase/firestore"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { isLoginState, uidState } from "../../atoms"
import { db } from "../../firebaseConfig"

export default function Posts() {
  const router = useRouter()

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)

  useEffect(() => {
    if (isLogin === false) {
      router.push("/")
    }
  }, [isLogin])

  const [posts, setPosts] = useState([{id: "", title: "", content: ""}])
  const [postNum, setPostNum] = useState(0)

  const getUserPosts = async () => {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      setPosts(userSnap.data().posts)
      setPostNum(userSnap.data().postNum)
    }
  }
  getUserPosts()

  return (
    <div>
      <p>投稿一覧</p>
      <br />
      {postNum === 0 && (
        <p>投稿はありません</p>
      )}
      {postNum >= 1 && posts.map((post: any, index: number) => (
        <div key={index}>
          <p>ID：　{post.id}</p>
          <p>タイトル： {post.title}</p>
          <p>内容：　{post.content}</p>
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
}