import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../atoms'
import { db, storage } from '../firebaseConfig'

export default function NewPost(props) {
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
      imageUrl = document.getElementById(choiceImage).src
    } else {
      const image = document.getElementById('image') as HTMLInputElement
      if (image.value !== '') {
        await uploadBytes(ref(storage, `postImages/${postId}`), image.files[0])
        const pathReference = ref(storage, `postImages/${postId}`)
        await getDownloadURL(pathReference).then((url) => {
          imageUrl = url
        })
      } else {
        imageUrl =
          'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2FpostInit.jpg?alt=media&token=b468ee38-405a-4044-a9f5-d55a38ff222e'
      }
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

    router.push('/setting/profile')
    setOpen(true)
    setAction('新規投稿')
  }

  return (
    <div className="bg-bg-color text-code-white pb-[40px]">
      <h1 className="text-center text-[24px] py-[20px]">{page === 'notFirstTime' ? '新規投稿ページ' : '投稿をしてみましょう'}</h1>
      <form onSubmit={(e: any) => clickPost(e)} className="w-[800px] mx-auto bg-bg-light-color border-[#000078] border-[1px] border-opacity-10">
        <div className="mx-[60px] my-[40px]">
          <p className="mb-[5px]">タイトル</p>
          <input name="title" className="text-black mb-[15px] w-[70%]" />
          <p className="mb-[5px]">内容</p>
          <textarea
              name="content"
              cols={10}
              rows={6}
              className="w-[70%] text-black mb-[10px]"
            />
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
              {[1, 2, 3, 4, 5, 6].map((num: number) => (
                <div className={`mt-[20px] mr-[20px] px-[10px] pt-[10px] pb-[5px] flex-none ${choiceImage === `example${num}` ? 'bg-code-blue' : 'bg-white'}`}>
                  <Image
                    src={`https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2Fexample${num}.jpg?alt=media&token=6bb2265e-27fd-4153-a8f4-52fbd1e0ee0f`}
                    alt={`例${num}`}
                    width="210px"
                    height="140px"
                    id={`example${num}`}
                    onClick={() => setChoiceImage(`example${num}`)}
                  />
                </div>
              ))}
            </div>
          )}
          <button className="bg-btn-blue w-[100%] rounded-full h-[40px] mt-[30px] tracking-[3px]">{page === 'notFirstTime' ? '新規投稿' : '投稿する'}</button>
        </div>
      </form>
    </div>
  )
}
