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
    <div className="bg-bg-color pb-[40px] px-[10px] lg:px-0">
      <div>
        <p className="text-[15px] lg:text-[30px] pt-[30px] lg:pt-[70px] pb-[25px] lg:pb-[60px] tag-gray text-center ">
          &lt;<span className="code-blue">h1</span>&gt;
          <span className="code-white">エンジニア友達をつくりませんか？</span>&lt;<span className="code-blue">/h1</span>
          &gt;
        </p>
        <p className="text-[12px] lg:text-[20px] pb-[30px] lg:pb-[90px] tag-gray text-center ">
          &lt;<span className="code-blue">p</span>&gt;
          <span className="code-white">
            同じ言語を学習している友達や、同じ趣味で一緒に遊べるエンジニア友達を探しませんか？
          </span>
          &lt;<span className="code-blue">/p</span>&gt;
        </p>
      </div>
      <div className="lg:w-[800px] md:w-[300px] mx-auto">
        <div className="border-b-[1px] border-border-color mb-[16px]">
          <p className="text-[14px] lg:text-[20px] text-comment-out fonr-en">{'// 条件から探す'}</p>
          <p className="text-[14px] lg:text-[20px] tag-gray">
            &lt;<span className="text-code-green font-ja">Filtering</span>&gt;
          </p>
        </div>
        <div className="text-[12px] lg:text-[16px] lg:px-[42px] lg:pt-[22px] lg:pb-[30px] bg-bg-light-color border-[#000078] border-[1px] border-opacity-10">
          <p className="search-row">
            &quot;フリーワード&quot;<span className="code-white">:</span>
            <span className="text-code-orange ml-[10px]">
              &quot;
              <input
                className="w-[200px] lg:w-[518px] bg-[#36311A] border-[#BD9B03] border-[1px]"
                value={temporaryFilteringText}
                onChange={(e: any) => setTemporaryFilteringText(e.target.value)}
              />
              &quot;
            </span>
          </p>
          <p className="inline-block lg:hidden search-row">
            &quot;プログラミング言語&quot;<span className="code-white">:</span>
          </p>
          <div className="mb-[15px] lg:mb-0 code-blue flex">
            <p className="hidden lg:inline-block w-[450px] search-row mr-[10px]">
              &quot;プログラミング言語&quot;<span className="code-white">:</span>
            </p>
            <div>
              <div className="ml-[10px] lg:ml-auto flex flex-wrap float-left">
                {languages.map((language: string) => (
                  <div key={language} className="mb-[1px] lg:mb-0 flex">
                    <input
                      type="checkbox"
                      className="h-[12px] lg:h-[16px] w-[12px] lg:w-[16px] mr-[2px] lg:mr-[5px] my-auto"
                      id={language}
                      onChange={(e: any) => languageCheckboxClick(e)}
                    />
                    <p className="mr-[5px] lg:mr-[10px] code-blue ">
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
                  <p className="lg:pb-[10px] pl-[10px] lg:pl-[30px] text-code-blue font-en flex">
                    &quot;{title}&quot;
                    <span className="code-white">:</span>
                    {!isDisplay ? (
                      <IoIosArrowDropright
                        className="text-[18px] lg:text-[25px] ml-[10px]"
                        onClick={() => changeHobbiesDisplay(title)}
                      />
                    ) : (
                      <IoIosArrowDropdown
                        className="text-[18px] lg:text-[25px] ml-[10px]"
                        onClick={() => changeHobbiesDisplay(title)}
                      />
                    )}
                  </p>
                  <div className="pl-[15px] lg:pl-[60px] lg:mt-[-10px] mb-[5px] lg:mb-[15px] flex flex-wrap float-left w-[100%]">
                    {category.map((hobby: string) => (
                      <div key={hobby} className="mb-[1px] lg:mb-0 flex" style={{ display: isDisplay ? '' : 'none' }}>
                        <input
                          type="checkbox"
                          className="h-[12px] lg:h-[16px] w-[12px] lg:w-[16px] mr-[2px] lg:mr-[5px] my-auto"
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
          <div className="mt-[20px] lg:mt-[40px] flex text-white">
            <div
              className="w-[200px] lg:w-[340px] h-[32px] lg:h-[48px] bg-btn-blue  flex items-center mr-[20px]"
              onClick={searchClick}
            >
              <div className="flex m-auto">
                <BsSearch className="my-auto mr-[20px]" />
                <p className="tracking-[15px]">検索</p>
              </div>
            </div>
            <div
              className="w-[100px] lg:w-[340px] h-[32px] lg:h-[48px] bg-btn-gray flex items-center"
              onClick={resetClick}
            >
              <p className="m-auto">リセット</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-[800px] mt-[30px] lg:mt-[50px] mx-auto ">
        <div className="border-b-[1px] border-border-color mb-[16px]">
          <p className="text-[14px] lg:text-[20px] text-comment-out fonr-en">{'// 一覧から探す'}</p>
          <p className="text-[14px] lg:text-[20px] tag-gray">
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
                <div
                  key={index}
                  className="m-[8px] lg:m-[10px] min-w-[45%] lg:min-w-[30%] max-w-[45%] lg:max-w-[30%] bg-black-light"
                >
                  <div className="text-[12px] lg:text-[16px] m-[8px]">
                    <div className="flex">
                      <Link href={`/user/${user.uid}`}>
                        <div className="w-[40px] lg:w-[60px] h-[40px] lg:h-[60px] relative">
                          <Image
                            src={
                              user.image
                                ? user.image
                                : 'https://firebasestorage.googleapis.com/v0/b/code-friend.appspot.com/o/userImages%2Finit.jpg?alt=media&token=69a50ddd-5912-4415-91cb-1cdb1fdf6d3f'
                            }
                            alt="ユーザー画像"
                            layout="fill"
                            className="rounded-full"
                          />
                        </div>
                      </Link>
                      <Link href={`/user/${user.uid}`}>
                        <p className="text-[14px] lg:text-[18px] text-code-white my-auto ml-[10px]">{user.name}</p>
                      </Link>
                    </div>
                    <p className="text-[14px] lg:text-[16px] text-code-white mt-[10px]">言語</p>
                    <p className="text-code-blue overflow-scroll h-[40px]">{user.languages.join(', ')}</p>
                    <p className="text-[14px] lg:text-[16px] text-code-white">趣味</p>
                    <p className="text-code-blue overflow-scroll h-[40px]">{user.hobbies.join(', ')}</p>
                    {user.postNum === 0 && (
                      <div className="lg:mt-[20px] pb-[10px]">
                        <Link href={`/user/${user.uid}`}>
                          <a className="px-[25px] lg:px-[50px] py-[5px] lg:py-[5px] text-code-blue border-[1px] border-code-blue rounded">
                            もっと知りたい
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="max-h-[153px] lg:max-h-[240px] overflow-scroll">
                    {user.postNum >= 1 && (
                      <div className="h-[102px] lg:h-[160px] relative">
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
                        <p className="text-[16px] lg:text-[24px] text-code-white absolute mx-[5px] mt-[10px]">
                          {user.posts[0].title}
                        </p>
                        <Link href={`/posts/${user.posts[0].id}`}>
                          <a className="text-[14px] lg:text-[16px] top-[70px] lg:top-[110px] px-[20px] lg:px-[50px] py-[1px] lg:py-[3px] ml-[14px] lg:ml-[20px] text-code-white absolute  border-[1px] border-code-white rounded bg-code-blue opacity-[75%]">
                            もっと詳しく
                          </a>
                        </Link>
                      </div>
                    )}
                    {user.postNum >= 2 && (
                      <div className="h-[102px] lg:h-[160px] relative border-t-[1px]">
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
                        <p className="text-[16px] lg:text-[24px] text-code-white absolute mx-[5px] mt-[10px]">
                          {user.posts[1].title}
                        </p>
                        <Link href={`/posts/${user.posts[1].id}`}>
                          <a className="text-[14px] lg:text-[16px] top-[70px] lg:top-[110px] px-[20px] lg:px-[50px] py-[1px] lg:py-[3px] ml-[14px] lg:ml-[20px] text-code-white absolute  border-[1px] border-code-white rounded bg-code-blue opacity-[75%]">
                            もっと詳しく
                          </a>
                        </Link>
                      </div>
                    )}
                    {user.postNum >= 3 && (
                      <div className="h-[102px] lg:h-[160px] relative border-t-[1px]">
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
                        <p className="text-[16px] lg:text-[24px] text-code-white absolute mx-[5px] mt-[10px]">
                          {user.posts[2].title}
                        </p>
                        <Link href={`/posts/${user.posts[2].id}`}>
                          <a className="text-[14px] lg:text-[16px] top-[70px] lg:top-[110px] px-[20px] lg:px-[50px] py-[1px] lg:py-[3px] ml-[14px] lg:ml-[20px] text-code-white absolute  border-[1px] border-code-white rounded bg-code-blue opacity-[75%]">
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
