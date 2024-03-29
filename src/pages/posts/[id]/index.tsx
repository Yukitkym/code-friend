import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { uidState } from '../../../atoms'
import { Loading } from '../../../components/Loading '
import { db } from '../../../firebaseConfig'

export default function PostsId() {
  const router = useRouter()
  const postId = router.asPath.slice(7)

  const uid = useRecoilValue(uidState)

  const [post, setPost] = useState({ poster: '', title: '', content: '', image: '' })
  const [user, setUser] = useState({
    name: '',
    image: '',
    languages: [],
    hobbies: [],
    contact: ''
  })
  useEffect(() => {
    const getPost = async () => {
      const postRef = doc(db, 'posts', postId)
      const postSnap = await getDoc(postRef)
      if (postSnap.exists()) {
        setPost(postSnap.data() as any)
        const userRef = doc(db, 'users', postSnap.data().poster)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          setUser(userSnap.data() as any)
        }
      }
    }
    getPost()
  }, [postId])

  if (user.image !== '') {
    return (
      <div className="min-h-[88vh] lg:min-h-[84vh] bg-bg-color text-code-white pb-[40px]">
        <h1 className="lg:text-[24px] pt-[15px] lg:py-[20px] text-center">投稿詳細ページ</h1>
        <div className="lg:w-[540px] mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10">
          <div className="text-[14px] lg:text-[16px] mx-[15px] lg:mx-[60px] my-[15px] lg:my-[40px]">
            <div className="w-[270px] lg:w-[420px] h-[180px] lg:h-[280px] relative mx-auto">
              <Image src={post.image} alt="投稿サムネイル画像" layout="fill" />
              <div className="absolute bg-black opacity-[40%] w-[100%] h-[100%]"></div>
              <p className="text-[20px] lg:text-[30px] mx-[10px] mt-[15px] text-code-white absolute">{post.title}</p>
            </div>
            {post.content !== '' && (
              <div className="bg-zinc-700 w-[100%] rounded mt-[10px]">
                <div className="p-[10px]">
                  {post.content.split('\n').map((sentence: string, index: number) => (
                    <p key={index}>{sentence}</p>
                  ))}
                </div>
              </div>
            )}
            {post.poster === uid && (
              <Link href={`/posts/${postId}/edit`}>
                <button className="bg-btn-blue w-[100%] rounded-full h-[40px] mt-[20px] tracking-[3px]">
                  投稿編集ページへ
                </button>
              </Link>
            )}
            <div className="mt-[30px]">
              <p className="text-[16px] lg:text-[20px]">投稿ユーザー</p>
              <Link href={`/user/${post.poster}`}>
                <div className="flex mt-[10px]">
                  <Image src={user.image} alt="プロフィール画像" width="60px" height="60px" className="rounded-full" />
                  <p className="text-[16px] lg:text-[20px] my-auto ml-[10px]">{user.name}</p>
                </div>
              </Link>
              <p className="mt-[15px]">言語</p>
              <p className="text-code-blue">{user.languages.join(', ')}</p>
              <p className="mt-[10px]">趣味</p>
              <p className="text-code-blue">{user.hobbies.join(', ')}</p>
              <p className="mt-[10px]">コンタクト</p>
              <p className="text-code-blue">{user.contact !== '' ? user.contact : '記載なし'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <Loading />
  }
}
