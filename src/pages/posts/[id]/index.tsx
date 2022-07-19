import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { uidState } from '../../../atoms'
import { db } from '../../../firebaseConfig'

export default function PostsId() {
  const router = useRouter()
  const postId = router.asPath.slice(7)

  const uid = useRecoilValue(uidState)

  const [post, setPost] = useState({ poster: '', title: '', content: '', image: '' })

  const getPost = async () => {
    const postRef = doc(db, 'posts', postId)
    const postSnap = await getDoc(postRef)
    if (postSnap.exists()) {
      setPost(postSnap.data())
    }
  }
  getPost()

  if (post.poster !== '') {
    return (
      <div>
        <p>投稿詳細ページ</p>
        <br />
        <p>{postId}</p>
        <p>{post.title}</p>
        <p>{post.content}</p>
        {/* eslint-disable-next-line */}
        <img src={post.image} alt="投稿サムネイル画像" className="w-[300px]" />
        <p>{post.poster}</p>
        {post.poster === uid && (
          <Link href={`/posts/${postId}/edit`}>
            <p>投稿編集ページへ</p>
          </Link>
        )}
      </div>
    )
  } else {
    return <p>読み込み中です</p>
  }
}
