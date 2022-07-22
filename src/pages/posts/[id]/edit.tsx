import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isLoginState, modal, modalAction, uidState } from '../../../atoms'
import { db, storage } from '../../../firebaseConfig'

export default function PostsIdEdit() {
  const router = useRouter()
  const postId = router.asPath.slice(7, 27)

  const isLogin = useRecoilValue(isLoginState)
  const uid = useRecoilValue(uidState)
  const setOpen = useSetRecoilState(modal)
  const setAction = useSetRecoilState(modalAction)

  const [poster, setPoster] = useState(uid)

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
      imageUrl = document.getElementById(choiceImage).src
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
        await uploadBytes(ref(storage, `postImages/${post.id}`), image.files[0])
        const pathReference = ref(storage, `postImages/${post.id}`)
        await getDownloadURL(pathReference).then((url) => {
          imageUrl = url
        })
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
    router.push('/posts')
    setOpen(true)
    setAction('投稿の削除')
  }

  if (postNum >= 0) {
    return (
      <div>
        <p>投稿編集ページ</p>
        <br />
        <p>タイトル</p>
        <input
          value={post.title}
          onChange={(e: any) =>
            setPost({ id: post.id, title: e.target.value, content: post.content, image: post.image })
          }
        />
        <p>内容</p>
        <input
          value={post.content}
          onChange={(e: any) => setPost({ id: post.id, title: post.title, content: e.target.value, image: post.image })}
        />
        <br />
        <br />
        {/* eslint-disable-next-line */}
        <img src={post.image} alt="現在のサムネイル画像" className="w-[300px]" />
        <br />
        <select
          name="selectImage"
          id="selectImage"
          value={selectImage}
          onChange={(e) => setSelectImage(e.target.value)}
        >
          <option value="not change">現在の画像を使う</option>
          <option value="choice">サンプル画像から選ぶ</option>
          <option value="upload">画像をアップロードする</option>
        </select>
        <br />
        <br />
        <input id="image" type="file" disabled={selectImage === 'not change' || selectImage === 'choice'} />
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
  } else {
    return <p>読み込み中です</p>
  }
}
