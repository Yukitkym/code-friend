import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { isLoginState, uidState } from '../atoms'
import { db, storage } from '../firebaseConfig'

export default function CreatePost() {
  const router = useRouter()

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)

  useEffect(() => {
    if (isLogin === false) {
      router.push('/')
    }
  }, [isLogin, router])

  const clickPost = async (e: any) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    const title: string = (data.get('title') ?? '').toString()
    const content: string = (data.get('content') ?? '').toString()

    // postsに投稿を作成
    await addDoc(collection(db, 'posts'), {
      title: title,
      content: content,
      poster: 'yet'
    })
    const q = await query(collection(db, 'posts'), where('poster', '==', 'yet'))
    const querySnapshot = await getDocs(q)
    let postId = ''
    querySnapshot.forEach((doc) => {
      postId = doc.id
    })
    const updateRef = doc(db, 'posts', postId)
    await updateDoc(updateRef, {
      poster: uid
    })

    // 画像をStorageに保存し、URLをpostsに作成
    let imageUrl = ""
    const image = document.getElementById("image") as HTMLInputElement
    if (image.value !== "") {
      await uploadBytes(ref(storage, `postImages/${postId}`), image.files[0])
      const pathReference = ref(storage, `postImages/${postId}`)
      await getDownloadURL(pathReference)
      .then((url) => {
        imageUrl = url
      })
    } else {
      imageUrl = "https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2FpostInit.jpg?alt=media&token=b468ee38-405a-4044-a9f5-d55a38ff222e"
    }
    await updateDoc(updateRef, {
      image: imageUrl
    })

    // usersに投稿を作成
    const userDocData = await (await getDoc(doc(db, 'users', uid))).data()
    const posts = userDocData.posts
    const postNum: number = userDocData.postNum
    const updatedPosts =
      postNum === 0
        ? [{ id: postId, title: title, content: content, image: imageUrl }]
        : [...posts, { id: postId, title: title, content: content, image: imageUrl }]
    const updatedPostNum: number = postNum + 1

    await updateDoc(doc(db, 'users', uid), {
      postNum: updatedPostNum,
      posts: updatedPosts
    })

    router.push('/posts')
  }

  return (
    <div>
      <p>新規投稿ページ</p>
      <form onSubmit={(e: any) => clickPost(e)}>
        <p>タイトル</p>
        <input name="title" className="bg-code-blue" />
        <p>内容</p>
        <input name="content" className="bg-code-blue" />
        <br />
        <br />
        <input id="image" type="file" />
        <br />
        <br />
        <button className="bg-code-green">新規投稿</button>
      </form>
    </div>
  )
}
