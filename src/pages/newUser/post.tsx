import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../../atoms'
import { db, storage } from '../../firebaseConfig'

export default function NewUserPost() {
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

    router.push('/')
    setOpen(true)
    setAction('新規投稿')
  }

  return (
    <div>
      <p>投稿をしてみましょう</p>
      <form onSubmit={(e: any) => clickPost(e)}>
        <p>タイトル</p>
        <input name="title" className="bg-code-blue" />
        <p>内容</p>
        <input name="content" className="bg-code-blue" />
        <br />
        <br />
        <select
          name="selectImage"
          id="selectImage"
          value={selectImage}
          onChange={(e) => setSelectImage(e.target.value)}
        >
          <option value="choice">サンプル画像から選ぶ</option>
          <option value="upload">画像をアップロードする</option>
        </select>
        <br />
        <br />
        <input id="image" type="file" disabled={selectImage === 'choice'} />
        <br />
        <br />
        {selectImage === 'choice' && (
          <div className="flex">
            {/* eslint-disable */}
            <img
              src="https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2Fexample1.jpg?alt=media&token=6bb2265e-27fd-4153-a8f4-52fbd1e0ee0f"
              alt="例1"
              id="example1"
              className={`w-[300px] mr-[30px] p-[5px] ${choiceImage === 'example1' ? 'bg-code-blue' : 'bg-white'}`}
              onClick={() => setChoiceImage('example1')}
            />
            <img
              src="https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2Fexample2.jpg?alt=media&token=eb9e6e66-5bbe-4cca-94b5-53268bcc78d5"
              alt="例2"
              id="example2"
              className={`w-[300px] mr-[30px] p-[5px] ${choiceImage === 'example2' ? 'bg-code-blue' : 'bg-white'}`}
              onClick={() => setChoiceImage('example2')}
            />
            <img
              src="https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2Fexample3.jpg?alt=media&token=918e08bb-ac56-4ba6-aa1a-37d5dee38958"
              alt="例3"
              id="example3"
              className={`w-[300px] mr-[30px] p-[5px] ${choiceImage === 'example3' ? 'bg-code-blue' : 'bg-white'}`}
              onClick={() => setChoiceImage('example3')}
            />
            <img
              src="https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2Fexample4.jpg?alt=media&token=0fe201b0-af92-44df-9df4-961b7f8d7b36"
              alt="例4"
              id="example4"
              className={`w-[300px] mr-[30px] p-[5px] ${choiceImage === 'example4' ? 'bg-code-blue' : 'bg-white'}`}
              onClick={() => setChoiceImage('example4')}
            />
            <img
              src="https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2Fexample5.jpg?alt=media&token=3ccdfcea-10ef-42f8-baf2-c02462724e11"
              alt="例5"
              id="example5"
              className={`w-[300px] mr-[30px] p-[5px] ${choiceImage === 'example5' ? 'bg-code-blue' : 'bg-white'}`}
              onClick={() => setChoiceImage('example5')}
            />
            <img
              src="https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2Fexample6.jpg?alt=media&token=ca652961-f177-4c66-88d0-87618a0d89eb"
              alt="例6"
              id="example6"
              className={`w-[300px] mr-[30px] p-[5px] ${choiceImage === 'example6' ? 'bg-code-blue' : 'bg-white'}`}
              onClick={() => setChoiceImage('example6')}
            />
            {/* eslint-enable */}
          </div>
        )}
        <br />
        <button className="bg-code-green">投稿する</button>
      </form>
    </div>
  )
}
