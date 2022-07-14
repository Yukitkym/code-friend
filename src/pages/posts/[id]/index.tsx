import { collection, doc, getDoc, query, where } from "firebase/firestore"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { isLoginState, uidState } from "../../../atoms"
import { db } from "../../../firebaseConfig"

export default function PostsId() {
  const router = useRouter()

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)

  useEffect(() => {
    if (isLogin === false) {
      router.push("/")
    }
  }, [isLogin])

  const [post, setPost] = useState({id: "", title: "", content: ""})
  const [posts, setPosts] = useState([{id: "", title: "", content: ""}])
  const [postNum, setPostNum] = useState(0)

  const postId = router.asPath.slice(7)

  const getUserPost = async () => {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      setPosts(userSnap.data().posts)
      setPostNum(userSnap.data().postNum)
    }
    for (let i = 0; i < postNum; i++) {
      if (posts[i].id === postId) {
        setPost(posts[i])
      }
    }
  }
  getUserPost()

  return (
    <div>
      <p>投稿詳細ページ</p>
      <br />
      <p>{post.id}</p>
      <p>{post.title}</p>
      <p>{post.content}</p>
    </div>
  )
}