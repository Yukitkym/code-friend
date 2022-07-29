import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../../../atoms'
import { Loading } from '../../../components/Loading '
import { db, storage } from '../../../firebaseConfig'

export default function PostsIdEdit() {
  const router = useRouter()
  const postId = router.asPath.slice(7, 27)

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)
  const setOpen = useSetRecoilState(modal)
  const setAction = useSetRecoilState(modalAction)

  const [poster, setPoster] = useState(uid)

  useEffect(() => {
    const getPoster = async () => {
      // urlを直打ちした場合、初回レンダリング時にpostIdは[id]/editとなるため
      if (postId.length === 20) {
        const postRef = doc(db, 'posts', postId)
        const postSnap = await getDoc(postRef)
        if (postSnap.exists()) {
          setPoster(postSnap.data().poster)
        }
      }
    }
    getPoster()
  }, [postId])

  useEffect(() => {
    if (isLogin === false || poster !== uid) {
      router.push(`/posts/${postId}`)
    }
    /* eslint-disable-next-line */
  }, [isLogin, poster])

  const [post, setPost] = useState({ id: '', title: '', content: '', image: '' })
  const [posts, setPosts] = useState([{ id: '', title: '', content: '', image: '' }])
  // 読み込み中か判別するために-1に設定
  const [postNum, setPostNum] = useState(-1)
  const [selectImage, setSelectImage] = useState('not change')
  const [choiceImage, setChoiceImage] = useState('example1')

  useEffect(() => {
    const getUserPost = async () => {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists() && post.id === '') {
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
  }, [post.id, postId, postNum, posts, uid])

  const clickEditDone = async () => {
    let imageUrl = ''
    if (selectImage === 'not change') {
      // 画像は変更しないver
      const newPosts = posts.map((oldPost) => {
        return oldPost.id === post.id ? post : oldPost
      })
      await updateDoc(doc(db, 'users', uid), {
        posts: newPosts
      })
      await updateDoc(doc(db, 'posts', postId), {
        title: post.title,
        content: post.content
      })
    } else if (selectImage === 'choice') {
      // サンプル画像ver
      const sample = (document.getElementById(choiceImage) as HTMLInputElement).id
      imageUrl = `https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2F${sample}.jpg?alt=media&token=6bb2265e-27fd-4153-a8f4-52fbd1e0ee0f`
      const newPosts = posts.map((oldPost) => {
        return oldPost.id === post.id
          ? {
              id: post.id,
              title: post.title,
              content: post.content,
              image: imageUrl
            }
          : oldPost
      })
      await updateDoc(doc(db, 'users', uid), {
        posts: newPosts
      })
      await updateDoc(doc(db, 'posts', post.id), {
        title: post.title,
        content: post.content,
        image: imageUrl
      })
    } else {
      // アップロードされた画像ver
      const image = document.getElementById('image') as HTMLInputElement
      if (image.value !== '') {
        // 画像をStorageに保存
        if (image.files) {
          await uploadBytes(ref(storage, `postImages/${post.id}`), image.files[0])
          const pathReference = ref(storage, `postImages/${post.id}`)
          await getDownloadURL(pathReference)
            .then((url) => {
              imageUrl = url
            })
            .catch((error) => console.log(error))
          await updateDoc(doc(db, 'posts', post.id), {
            title: post.title,
            content: post.content,
            image: imageUrl
          })
          const newPosts = posts.map((oldPost) => {
            return oldPost.id === post.id
              ? {
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  image: imageUrl
                }
              : oldPost
          })
          await updateDoc(doc(db, 'users', uid), {
            posts: newPosts
          })
        }
      } else {
        const newPosts = posts.map((oldPost) => {
          return oldPost.id === post.id ? post : oldPost
        })
        await updateDoc(doc(db, 'users', uid), {
          posts: newPosts
        })
        await updateDoc(doc(db, 'posts', postId), {
          title: post.title,
          content: post.content
        })
      }
    }
    router.push(`/posts/${post.id}`)
    setOpen(true)
    setAction('投稿の編集')
  }

  const clickDelete = async () => {
    const newPosts = posts.filter((oldPost) => oldPost.id !== post.id)

    if (postNum < 2) {
      await updateDoc(doc(db, 'users', uid), {
        posts: [{}],
        postNum: 0
      })
    } else {
      await updateDoc(doc(db, 'users', uid), {
        posts: newPosts,
        postNum: postNum - 1
      })
    }
    await deleteDoc(doc(db, 'posts', postId))
    await deleteObject(ref(storage, `postImages/${postId}`))
    router.push('/setting/profile')
    setOpen(true)
    setAction('投稿の削除')
  }

  if (postNum >= 0) {
    return (
      <div className="min-h-[88vh] lg:min-h-[84vh] bg-bg-color text-code-white pb-[40px]">
        <h1 className="lg:text-[24px] pt-[15px] lg:py-[20px] text-center">投稿編集ページ</h1>
        <div className="lg:w-[650px] mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10">
          <div className="text-[14px] lg:text-[16px] mx-[15px] lg:mx-[60px] my-[15px] lg:my-[40px]">
            <p className="mb-[5px]">タイトル</p>
            <input
              value={post.title}
              onChange={(e: any) =>
                setPost({ id: post.id, title: e.target.value, content: post.content, image: post.image })
              }
              className="text-black w-[100%] mb-[15px]"
            />
            <p className="mb-[5px]">内容</p>
            <textarea
              name="userProfile"
              cols={10}
              rows={6}
              value={post.content}
              onChange={(e: any) =>
                setPost({ id: post.id, title: post.title, content: e.target.value, image: post.image })
              }
              className="w-[100%] text-black mb-[10px]"
            />
            <p className="mb-[5px]">現在のサムネイル画像</p>
            <div className="relative w-[210px] lg:w-[300px] h-[140px] lg:h-[200px]">
              <Image
                src={
                  post.image
                    ? post.image
                    : 'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2FpostInit.jpg?alt=media&token=b468ee38-405a-4044-a9f5-d55a38ff222e'
                }
                alt="現在のサムネイル画像"
                layout="fill"
              />
            </div>
            <div>
              <select
                name="selectImage"
                id="selectImage"
                value={selectImage}
                onChange={(e) => setSelectImage(e.target.value)}
                className="mt-[15px] text-black"
              >
                <option value="not change">現在の画像を使う</option>
                <option value="choice">サンプル画像から選ぶ</option>
                <option value="upload">画像をアップロードする</option>
              </select>
            </div>
            {selectImage === 'upload' && <input id="image" type="file" className="mt-[15px]" />}
            {selectImage === 'choice' && (
              <div className="flex overflow-x-auto">
                {/* 1から6までの配列を作成し、それを使ってexample1〜6までの画像を表示 */}
                {[...Array(6)]
                  .map((_, i) => i + 1)
                  .map((num: number) => (
                    <div
                      key={num}
                      className={`mt-[20px] mr-[20px] px-[10px] pt-[10px] pb-[5px] flex-none ${
                        choiceImage === `example${num}` ? 'bg-code-blue' : 'bg-white'
                      }`}
                    >
                      <div className="w-[150px] lg:w-[210px] h-[100px] lg:h-[140px] relative">
                        <Image
                          src={`https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2Fexample${num}.jpg?alt=media&token=6bb2265e-27fd-4153-a8f4-52fbd1e0ee0f`}
                          alt={`例${num}`}
                          layout="fill"
                          id={`example${num}`}
                          onClick={() => setChoiceImage(`example${num}`)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
            <button
              onClick={clickEditDone}
              className="bg-btn-blue w-[100%] rounded-full h-[40px] mt-[30px] tracking-[3px]"
            >
              編集完了
            </button>
            <div className="mt-[25px] lg:mt-[30px] flex">
              <Link href={`/posts/${post.id}`}>
                <button className="w-[180px] lg:w-[350px] bg-btn-gray rounded h-[40px] tracking-[1px]">
                  投稿詳細ページへ
                </button>
              </Link>
              <button
                className="w-[120px] lg:w-[150px] bg-orange-700 rounded h-[40px] mx-0 ml-auto"
                onClick={clickDelete}
              >
                投稿を削除
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <Loading />
  }
}
