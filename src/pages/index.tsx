import { collection, onSnapshot, query } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import { hobbies, languages } from '../languagesAndHobbies'
import { IoIosArrowDropright, IoIosArrowDropdown } from 'react-icons/io'
import { BsSearch } from 'react-icons/bs'

export default function Home() {
  const [users, setUsers] = useState([
    {
      uid: '',
      name: '',
      image: '',
      languages: [],
      hobbies: [],
      postNum: 0,
      posts: [
        {
          id: '',
          title: '',
          content: '',
          image: ''
        }
      ]
    }
  ])

  const q = query(collection(db, 'users'))

  useEffect(() => {
    const unSub = onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((user) => ({
          uid: user.id,
          name: user.data().name,
          image: user.data().image,
          languages: user.data().languages,
          hobbies: user.data().hobbies,
          postNum: user.data().postNum,
          posts: user.data().posts
        }))
      )
    })
    return () => unSub()
    /* eslint-disable-next-line */
  }, [])

  // temporaryは検索ボタンが押されるまでの仮の要素
  const [temporaryFilteringText, setTemporaryFilteringText] = useState('')
  const [temporaryFilteringLanguage, setTemporaryFilteringLanguage] = useState(['None'])
  const [temporaryFilteringHobby, setTemporaryFilteringHobby] = useState(['None'])
  const [filteringText, setFilteringText] = useState('')
  const [filteringLanguage, setFilteringLanguage] = useState(['None'])
  const [filteringHobby, setFilteringHobby] = useState(['None'])

  const [hobbiesDisplay, setHobbiesDisplay] = useState(hobbies)
  const changeHobbiesDisplay = (tit: string) => {
    const copyHobbiesDisplay = hobbiesDisplay.map((hobbie) =>
      hobbie.title == tit ? { ...hobbie, isDisplay: !hobbie.isDisplay } : hobbie
    )
    setHobbiesDisplay(copyHobbiesDisplay)
  }

  const searchClick = () => {
    // 検索ボタンを押すとtemporary(仮の要素)から正式な要素に移り、フィルタリングを行う
    setFilteringText(temporaryFilteringText)
    setFilteringLanguage(temporaryFilteringLanguage)
    setFilteringHobby(temporaryFilteringHobby)
  }

  const resetClick = () => {
    // チェックボックスのチェックを外す
    const allCheckbox = document.querySelectorAll(`input[type='checkbox']`) as NodeListOf<HTMLInputElement>
    for (let i = 0; i < allCheckbox.length; i++) {
      allCheckbox[i].checked = false
    }

    setTemporaryFilteringText('')
    setTemporaryFilteringLanguage(['None'])
    setTemporaryFilteringHobby(['None'])
    setFilteringText('')
    setFilteringLanguage(['None'])
    setFilteringHobby(['None'])
  }

  const languageCheckboxClick = (e: any) => {
    if (e.target.checked === true) {
      if (temporaryFilteringLanguage[0] === 'None') {
        setTemporaryFilteringLanguage([e.target.id])
      } else {
        setTemporaryFilteringLanguage([...temporaryFilteringLanguage, e.target.id])
      }
    } else {
      const newFilteringLanguage = temporaryFilteringLanguage.filter((language) => !language.match(e.target.id))
      if (newFilteringLanguage.length !== 0) {
        setTemporaryFilteringLanguage(newFilteringLanguage)
      } else {
        setTemporaryFilteringLanguage(['None'])
      }
    }
  }

  const hobbyCheckboxClick = (e: any) => {
    if (e.target.checked === true) {
      if (temporaryFilteringHobby[0] === 'None') {
        setTemporaryFilteringHobby([e.target.id])
      } else {
        setTemporaryFilteringHobby([...temporaryFilteringHobby, e.target.id])
      }
    } else {
      const newFilteringHobby = temporaryFilteringHobby.filter((hobby) => !hobby.match(e.target.id))
      if (newFilteringHobby.length !== 0) {
        setTemporaryFilteringHobby(newFilteringHobby)
      } else {
        setTemporaryFilteringHobby(['None'])
      }
    }
  }

  const checkText = (userName: string, posts: any, postNum: number) => {
    let checkTextFlag = false
    if (userName.match(filteringText)) {
      checkTextFlag = true
    }
    for (let i = 0; i < postNum; i++) {
      if (posts[i].title.match(filteringText)) {
        checkTextFlag = true
      }
    }
    return checkTextFlag
  }

  const checkLanguage = (languages: any) => {
    let checkLanguageFlag = true
    for (let i = 0; i < filteringLanguage.length; i++) {
      if (!languages.includes(filteringLanguage[i]) && !(filteringLanguage[0] === 'None')) {
        checkLanguageFlag = false
      }
    }
    return checkLanguageFlag
  }

  const checkHobby = (hobby: any) => {
    let checkHobbyFlag = true
    for (let i = 0; i < filteringHobby.length; i++) {
      if (!hobby.includes(filteringHobby[i]) && !(filteringHobby[0] === 'None')) {
        checkHobbyFlag = false
      }
    }
    return checkHobbyFlag
  }

  return (
    <div className="bg-bg-color pb-[40px]">
      <div>
        <p className="tag-gray text-[30px] text-center pt-[70px] pb-[60px]">
          &lt;<span className="code-blue">h1</span>&gt;
          <span className="code-white">エンジニア友達をつくりませんか？</span>&lt;<span className="code-blue">/h1</span>
          &gt;
        </p>
        <p className="tag-gray text-[20px] text-center pb-[90px]">
          &lt;<span className="code-blue">p</span>&gt;
          <span className="code-white">
            同じ言語を学習している友達や、同じ趣味で一緒に遊べるエンジニア友達を探しませんか？
          </span>
          &lt;<span className="code-blue">/p</span>&gt;
        </p>
      </div>
      <div className="w-[800px] mx-auto">
        <div className="border-b-[1px] border-border-color mb-[16px]">
          <p className="text-comment-out text-[20px] fonr-en">{'// 条件から探す'}</p>
          <p className="tag-gray text-[20px]">
            &lt;<span className="text-code-green font-ja">Filtering</span>&gt;
          </p>
        </div>
        <div className="bg-bg-light-color border-[#000078] border-[1px] border-opacity-10 px-[42px] pt-[22px] pb-[30px]">
          <p className="search-row">
            &quot;フリーワード&quot;<span className="code-white">:</span>
            <span className="text-code-orange ml-[10px]">
              &quot;
              <input
                className="w-[518px] bg-[#36311A] border-[#BD9B03] border-[1px]"
                value={temporaryFilteringText}
                onChange={(e: any) => setTemporaryFilteringText(e.target.value)}
              />
              &quot;
            </span>
          </p>
          <div className="code-blue flex">
            <p className="search-row w-[450px] mr-[10px]">
              &quot;プログラミング言語&quot;<span className="code-white">:</span>
            </p>
            <div>
              <div className="flex flex-wrap float-left">
                {languages.map((language: string) => (
                  <div key={language} className="flex">
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] my-auto mr-[5px]"
                      id={language}
                      onChange={(e: any) => languageCheckboxClick(e)}
                    />
                    <p className="code-blue mr-[10px]">
                      {language}
                      <span className="code-white">,</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="search-row">
              &quot;趣味&quot;<span className="code-white">:</span>
              <span className="text-braces-yellow ml-[10px]">{'{'}</span>
            </p>
            <div>
              {hobbiesDisplay.map(({ title, isDisplay, category }) => (
                <>
                  <p className="search-row-sub flex">
                    &quot;{title}&quot;
                    <span className="code-white">:</span>
                    {!isDisplay ? (
                      <IoIosArrowDropright
                        className="text-[25px] ml-[10px]"
                        onClick={() => changeHobbiesDisplay(title)}
                      />
                    ) : (
                      <IoIosArrowDropdown
                        className="text-[25px] ml-[10px]"
                        onClick={() => changeHobbiesDisplay(title)}
                      />
                    )}
                  </p>
                  <div className="flex flex-wrap float-left pl-[60px] mt-[-10px] mb-[15px] w-[100%]">
                    {isDisplay &&
                      category.map((hobby: string) => (
                        <div key={hobby} className="flex">
                          <input
                            type="checkbox"
                            className="h-[16px] w-[16px] my-auto mr-[5px]"
                            id={hobby}
                            onChange={(e: any) => hobbyCheckboxClick(e)}
                          />
                          <p className="code-blue mr-[10px]">
                            {hobby}
                            <span className="code-white">,</span>
                          </p>
                        </div>
                      ))}
                  </div>
                </>
              ))}
            </div>
            <p className="text-braces-yellow">{'}'}</p>
          </div>
          <div className="flex mt-[40px] text-white">
            <div className="bg-btn-blue w-[340px] h-[48px] flex items-center mr-[20px]" onClick={searchClick}>
              <div className="flex m-auto">
                <BsSearch className="my-auto mr-[20px]" />
                <p className="tracking-[15px]">検索</p>
              </div>
            </div>
            <div className="bg-btn-gray w-[340px] h-[48px] flex items-center" onClick={resetClick}>
              <p className="m-auto">リセット</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[800px] mx-auto mt-[50px]">
        <div className="border-b-[1px] border-border-color mb-[16px]">
          <p className="text-comment-out text-[20px] fonr-en">{'// 一覧から探す'}</p>
          <p className="tag-gray text-[20px]">
            &lt;<span className="text-code-green font-ja">List</span>&gt;
          </p>
        </div>
        <div className="flex flex-wrap flex-center items-start">
          {users.map((user: any, index: number) => {
            if (
              checkText(user.name, user.posts, user.postNum) &&
              checkLanguage(user.languages) &&
              checkHobby(user.hobbies)
            ) {
              return (
                <div key={index} className="bg-black-light m-[10px] min-w-[30%] max-w-[30%]">
                  <div className="m-[8px]">
                    <div className="flex">
                      <Link href={`/user/${user.uid}`}>
                        <Image
                          src={
                            user.image
                              ? user.image
                              : 'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/userImages%2Finit.jpg?alt=media&token=69a50ddd-5912-4415-91cb-1cdb1fdf6d3f'
                          }
                          alt="ユーザー画像"
                          width="60px"
                          height="60px"
                          className="rounded-full"
                        />
                      </Link>
                      <Link href={`/user/${user.uid}`}>
                        <p className="text-code-white my-auto ml-[10px] text-[18px]">{user.name}</p>
                      </Link>
                    </div>
                    <p className="text-code-white mt-[10px]">言語</p>
                    <p className="text-code-blue overflow-scroll h-[40px]">{user.languages.join(', ')}</p>
                    <p className="text-code-white">趣味</p>
                    <p className="text-code-blue overflow-scroll h-[40px]">{user.hobbies.join(', ')}</p>
                    {user.postNum === 0 && (
                      <div className="mt-[20px] pb-[10px]">
                        <Link href={`/user/${user.uid}`}>
                          <a className="text-code-blue border-[1px] border-code-blue rounded px-[50px] py-[5px] mt-[20px]">
                            もっと知りたい
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="max-h-[240px] overflow-scroll">
                    {user.postNum >= 1 && (
                      <div className="relative h-[160px]">
                        <Image
                          src={
                            user.posts[0].image
                              ? user.posts[0].image
                              : 'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2FpostInit.jpg?alt=media&token=b468ee38-405a-4044-a9f5-d55a38ff222e'
                          }
                          alt="投稿サムネイル1"
                          layout="fill"
                        />
                        <div className="absolute bg-black opacity-[40%] w-[100%] h-[100%]"></div>
                        <p className="text-code-white absolute text-[24px] mx-[5px] mt-[10px]">{user.posts[0].title}</p>
                        <Link href={`/posts/${user.posts[0].id}`}>
                          <a className="text-code-white absolute top-[110px] border-[1px] border-code-white rounded bg-code-blue opacity-[75%] px-[50px] py-[3px] ml-[20px]">
                            もっと詳しく
                          </a>
                        </Link>
                      </div>
                    )}
                    {user.postNum >= 2 && (
                      <div className="relative h-[160px] border-t-[1px]">
                        <Image
                          src={
                            user.posts[1].image
                              ? user.posts[1].image
                              : 'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2FpostInit.jpg?alt=media&token=b468ee38-405a-4044-a9f5-d55a38ff222e'
                          }
                          alt="投稿サムネイル2"
                          layout="fill"
                        />
                        <div className="absolute bg-black opacity-[40%] w-[100%] h-[100%]"></div>
                        <p className="text-code-white absolute text-[24px] mx-[5px] mt-[10px]">{user.posts[1].title}</p>
                        <Link href={`/posts/${user.posts[1].id}`}>
                          <a className="text-code-white absolute top-[110px] border-[1px] border-code-white rounded bg-code-blue opacity-[75%] px-[50px] py-[3px] ml-[20px]">
                            もっと詳しく
                          </a>
                        </Link>
                      </div>
                    )}
                    {user.postNum >= 3 && (
                      <div className="relative h-[160px] border-t-[1px]">
                        <Image
                          src={
                            user.posts[2].image
                              ? user.posts[2].image
                              : 'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/postImages%2FpostInit.jpg?alt=media&token=b468ee38-405a-4044-a9f5-d55a38ff222e'
                          }
                          alt="投稿サムネイル3"
                          layout="fill"
                        />
                        <div className="absolute bg-black opacity-[40%] w-[100%] h-[100%]"></div>
                        <p className="text-code-white absolute text-[24px] mx-[5px] mt-[10px]">{user.posts[2].title}</p>
                        <Link href={`/posts/${user.posts[2].id}`}>
                          <a className="text-code-white absolute top-[110px] border-[1px] border-code-white rounded bg-code-blue opacity-[75%] px-[50px] py-[3px] ml-[20px]">
                            もっと詳しく
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}
