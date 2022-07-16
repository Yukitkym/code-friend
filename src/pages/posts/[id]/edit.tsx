import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { isLoginState, uidState } from "../../../atoms"
import { db, storage } from "../../../firebaseConfig"

export default function PostsIdEdit() {
  const router = useRouter()
  const postId = router.asPath.slice(7, 27)

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)

  const [poster, setPoster] = useState(uid)

  const getPoster = async () => {
    // urlを直打ちした場合、初回レンダリング時にpostIdは[id]/editとなるため
    if (postId.length === 20) {
      const postRef = doc(db, "posts", postId)
      const postSnap = await getDoc(postRef)
      if (postSnap.exists()) {
        setPoster(postSnap.data().poster)
      }
    }
  }
  getPoster()

  useEffect(() => {
    if ((isLogin === false) || (poster !== uid)) {
      router.push(`/posts/${postId}`)
    }
  }, [isLogin, poster])

  const [post, setPost] = useState({id: "", title: "", content: "", image: ""})
  const [posts, setPosts] = useState([{id: "", title: "", content: ""}])
  const [postNum, setPostNum] = useState(0)

  const getUserPost = async () => {
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
    const image = document.getElementById("image") as HTMLInputElement
    if (image.value !== "") {
      // 画像をStorageに保存
      await uploadBytes(ref(storage, `postImages/${post.id}`), image.files[0])
      const pathReference = ref(storage, `postImages/${post.id}`)
      let imageUrl = ""
      await getDownloadURL(pathReference)
      .then((url) => {
        imageUrl = url
      })
      await updateDoc(doc(db, 'posts', post.id), {
        "title": post.title,
        "content": post.content,
        "image": imageUrl
      })
      const newPosts = posts.map((oldPost) => {
        return oldPost.id === post.id ? {
          "id": post.id,
          "title": post.title,
          "content": post.content,
          "image": imageUrl
      } : oldPost
      })
      await updateDoc(doc(db, "users", uid), {
        "posts": newPosts
      })
    } else {
      const newPosts = posts.map((oldPost) => {
        return oldPost.id === post.id ? post : oldPost
      })
      await updateDoc(doc(db, "users", uid), {
        "posts": newPosts
      })
      await updateDoc(doc(db, "posts", postId), {
        "title": post.title,
        "content": post.content
      })
    }
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
    await deleteDoc(doc(db, "posts", postId))
    await deleteObject(ref(storage, `postImages/${postId}`))
    router.push("/posts")
  }

  return (
    <div>
      <p>投稿編集ページ</p>
      <br />
      <p>タイトル</p>
      <input value={post.title} onChange={(e: any) => setPost({id: post.id, title: e.target.value, content: post.content, image: post.image})}/>
      <p>内容</p>
      <input value={post.content} onChange={(e: any) => setPost({id: post.id, title: post.title, content: e.target.value, image: post.image})}/>
      <br />
      <br />
      <img src={post.image} className="w-[300px]" />
      <br />
      <input id="image" type="file" />
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