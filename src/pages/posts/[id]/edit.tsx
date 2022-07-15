import { doc, getDoc, updateDoc } from "firebase/firestore"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { isLoginState, uidState } from "../../../atoms"
import { db } from "../../../firebaseConfig"

export default function PostsIdEdit() {
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

  const getUserPost = async () => {
    const postId = router.asPath.slice(7, 21)
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists() && post.id === "") {
      setPosts(userSnap.data().posts)
      setPostNum(userSnap.data().postNum)
      for (let i = 0; i < postNum; i++) {
        if (posts[i].id === postId) {
          setPost(posts[i])
        }
      }
    }
  }
  getUserPost()

  const clickEditDone = async  () => {
    const newPosts = posts.map((oldPost) => {
      return oldPost.id === post.id ? post : oldPost
    })
    await updateDoc(doc(db, "users", uid), {
      "posts": newPosts
    })
    router.push(`/posts/${post.id}`)
  }

  const clickDelete = async () => {
    const newPosts = posts.filter((oldPost) => oldPost.id !== post.id)

    if (postNum < 2) {
      await updateDoc(doc(db, "users", uid), {
        "posts": [{}],
        "postNum": 0
      })
    } else {
      await updateDoc(doc(db, "users", uid), {
        "posts": newPosts,
        "postNum": postNum - 1
      })
    }

    router.push("/posts")
  }

  return (
    <div>
      <p>投稿編集ページ</p>
      <br />
      <p>タイトル</p>
      <input value={post.title} onChange={(e: any) => setPost({id: post.id, title: e.target.value, content: post.content})}/>
      <p>内容</p>
      <input value={post.content} onChange={(e: any) => setPost({id: post.id, title: post.title, content: e.target.value})}/>
      <br />
      <br />
      <button onClick={clickEditDone}>編集完了</button>
      <br />
      <br />
      <button onClick={clickDelete}>投稿を削除</button>
      <br />
      <br />
      <Link href={`/posts/${post.id}`}>
        <p>投稿詳細ページへ</p>
      </Link>
    </div>
  )
}