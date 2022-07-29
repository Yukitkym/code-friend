import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../atoms'
import { db, storage } from '../firebaseConfig'

export default function NewPost(props: any) {
  // 通常の新規投稿ページは'notFirstTime'、新規登録後の新規投稿ページは'firstTime'
  const page = props.page

  const router = useRouter()

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)
  const setOpen = useSetRecoilState(modal)
  const setAction = useSetRecoilState(modalAction)

  useEffect(() => {
    if (isLogin === false) {
      router.push('/')
    }
  }, [isLogin, router])

  const [selectImage, setSelectImage] = useState('choice')
  const [choiceImage, setChoiceImage] = useState('example1')

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
    let imageUrl = ''
    if (selectImage === 'choice') {
      const sample = (document.getElementById(choiceImage) as HTMLInputElement).id
      imageUrl = `https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2F${sample}.jpg?alt=media&token=6bb2265e-27fd-4153-a8f4-52fbd1e0ee0f`
    } else {
      const image = document.getElementById('image') as HTMLInputElement
      if (image.value !== '') {
        if (image.files) {
          await uploadBytes(ref(storage, `postImages/${postId}`), image.files[0])
          const pathReference = ref(storage, `postImages/${postId}`)
          await getDownloadURL(pathReference)
            .then((url) => {
              imageUrl = url
            })
            .catch((error) => console.log(error))
        }
      } else {
        imageUrl =
          'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2FpostInit.jpg?alt=media&token=b468ee38-405a-4044-a9f5-d55a38ff222e'
      }
    }
    await updateDoc(updateRef, {
      image: imageUrl
    })

    // usersに投稿を作成
    const userGetDoc = await getDoc(doc(db, 'users', uid))
    const userDocData = userGetDoc.data()
    const posts = userDocData ? userDocData.posts : null
    const postNum: number = userDocData ? userDocData.postNum : null
    const updatedPosts =
      postNum === 0
        ? [{ id: postId, title: title, content: content, image: imageUrl }]
        : [...posts, { id: postId, title: title, content: content, image: imageUrl }]
    const updatedPostNum: number = postNum + 1

    await updateDoc(doc(db, 'users', uid), {
      postNum: updatedPostNum,
      posts: updatedPosts
    })

    router.push('/setting/profile')
    setOpen(true)
    setAction('新規投稿')
  }

  return (
    <div className="min-h-[88vh] lg:min-h-[84vh] bg-bg-color text-code-white pb-[40px]">
      <h1 className="lg:text-[24px] pt-[15px] lg:py-[20px] text-center">
        {page === 'notFirstTime' ? '新規投稿ページ' : '投稿をしてみましょう'}
      </h1>
      <form
        onSubmit={(e: any) => clickPost(e)}
        className="lg:w-[800px] mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10"
      >
        <div className="text-[14px] lg:text-[16px] mx-[15px] lg:mx-[60px] my-[15px] lg:my-[40px]">
          <p className="mb-[5px]">タイトル</p>
          <input name="title" className="w-[100%] lg:w-[70%] text-black mb-[15px]" />
          <p className="mb-[5px]">内容</p>
          <textarea name="content" cols={10} rows={6} className="w-[100%] lg:w-[70%] text-black mb-[10px]" />
          <div className="mb-[10px]">
            <select
              name="selectImage"
              id="selectImage"
              value={selectImage}
              onChange={(e) => setSelectImage(e.target.value)}
              className="bg-btn-gray"
            >
              <option value="choice">サンプル画像から選ぶ</option>
              <option value="upload">画像をアップロードする</option>
            </select>
          </div>
          <input id="image" type="file" disabled={selectImage === 'choice'} />
          {selectImage === 'choice' && (
            <div className="flex overflow-x-auto">
              {/* 1から6までの配列を作成し、それを使ってexample1〜6までの画像を表示 */}
              {[...Array(6)]
                .map((_, i) => i + 1)
                .map((num: number) => (
                  <div
                    key={num}
                    className={`mt-[20px] mr-[20px] px-[10px] py-[10px] flex-none ${
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
          <button className="bg-btn-blue w-[100%] rounded-full h-[40px] mt-[30px] tracking-[3px]">
            {page === 'notFirstTime' ? '新規投稿' : '投稿する'}
          </button>
        </div>
      </form>
    </div>
  )
}
