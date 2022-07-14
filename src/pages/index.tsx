import { collection, onSnapshot, query } from 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import {
  game1,
  game2,
  languages1,
  languages2,
  languages3,
  sports1,
  sports2,
  sports3,
  watching
} from '../languagesAndHobbies'

export default function Home() {
  const [users, setUsers] = useState([
    {
      uid: '',
      name: '',
      languages: [],
      hobbies: [],
      postNum: 0,
      posts: [
        {
          id: '',
          title: '',
          content: ''
        }
      ]
    }
  ])

  const q = query(collection(db, 'users'))

  useEffect(() => {
    const unSub = onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((user) => ({
          uid: user.data().uid,
          name: user.data().name,
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
    <div className="bg-bg-color">
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
        <div className="bg-bg-light-color border-[#000078] border-[1px] border-opacity-10 px-[42px] pt-[22px] h-[800px]">
          <p className="search-row">
            &quot;フリーワード&quot;<span className="code-white">:</span>
            <span className="text-code-orange">
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
            <p className="search-row w-[450px]">
              &quot;プログラミング言語&quot;<span className="code-white">:</span>
            </p>
            <div>
              <div className="flex flex-wrap float-left">
                {languages1.map((language: string, index: number) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] m-auto"
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
              <div className="flex flex-wrap float-left">
                {languages2.map((language: string, index: number) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] m-auto"
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
              <div className="flex flex-wrap float-left">
                {languages3.map((language: string, index: number) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] m-auto"
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
              <span className="text-braces-yellow">{'{'}</span>
            </p>
            <div>
              <p className="search-row-sub">
                &quot;ゲーム・思考系&quot;<span className="code-white">:</span>
                <span className="text-braces-pink">{'{'}</span>
              </p>
              <div className="flex flex-wrap float-left pl-[60px]">
                {game1.map((game: string, index: number) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] m-auto"
                      id={game}
                      onChange={(e: any) => hobbyCheckboxClick(e)}
                    />
                    <p className="code-blue mr-[10px]">
                      {game}
                      <span className="code-white">,</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap float-left pl-[60px]">
                {game2.map((game: string, index: number) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] m-auto"
                      id={game}
                      onChange={(e: any) => hobbyCheckboxClick(e)}
                    />
                    <p className="code-blue mr-[10px]">
                      {game}
                      <span className="code-white">,</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="code-white pl-[30px]">
                <span className="text-braces-pink">{'}'}</span>,
              </p>
            </div>
            <div>
              <p className="search-row-sub">
                &quot;スポーツ系&quot;<span className="code-white">:</span>
                <span className="text-braces-pink">{'{'}</span>
              </p>
              <div className="flex flex-wrap float-left pl-[60px]">
                {sports1.map((sports: string, index: number) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] m-auto"
                      id={sports}
                      onChange={(e: any) => hobbyCheckboxClick(e)}
                    />
                    <p className="code-blue mr-[10px]">
                      {sports}
                      <span className="code-white">,</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap float-left pl-[60px]">
                {sports2.map((sports: string, index: number) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] m-auto"
                      id={sports}
                      onChange={(e: any) => hobbyCheckboxClick(e)}
                    />
                    <p className="code-blue mr-[10px]">
                      {sports}
                      <span className="code-white">,</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap float-left pl-[60px]">
                {sports3.map((sports: string, index: number) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] m-auto"
                      id={sports}
                      onChange={(e: any) => hobbyCheckboxClick(e)}
                    />
                    <p className="code-blue mr-[10px]">
                      {sports}
                      <span className="code-white">,</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="code-white pl-[30px]">
                <span className="text-braces-pink">{'}'}</span>,
              </p>
            </div>
            <div>
              <p className="search-row-sub">
                &quot;鑑賞系&quot;<span className="code-white">:</span>
                <span className="text-braces-pink">{'{'}</span>
              </p>
              <div className="flex flex-wrap float-left pl-[60px]">
                {watching.map((watch: string, index: number) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] m-auto"
                      id={watch}
                      onChange={(e: any) => hobbyCheckboxClick(e)}
                    />
                    <p className="code-blue mr-[10px]">
                      {watch}
                      <span className="code-white">,</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="code-white pl-[30px]">
                <span className="text-braces-pink">{'}'}</span>,
              </p>
            </div>
          </div>
          <div className="bg-btn-gray w-[148px] h-[48px] text-center mt-[20px] mb-[20px] flex items-center">
            <p className="text-white m-auto">もっと見る</p>
          </div>
          <div className="flex">
            <div className="bg-btn-blue w-[340px] h-[48px] flex items-center" onClick={searchClick}>
              <p className="text-white m-auto">検索</p>
            </div>
            <div className="bg-btn-gray w-[340px] h-[48px] flex items-center" onClick={resetClick}>
              <p className="text-white m-auto">リセット</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[800px] mx-auto">
        <div className="border-b-[1px] border-border-color mb-[16px]">
          <p className="text-comment-out text-[20px] fonr-en">{'// 一覧から探す'}</p>
          <p className="tag-gray text-[20px]">
            &lt;<span className="text-code-green font-ja">List</span>&gt;
          </p>
        </div>
        <div>
          {users.map((user: any, index: number) => {
            if (
              checkText(user.name, user.posts, user.postNum) &&
              checkLanguage(user.languages) &&
              checkHobby(user.hobbies)
            ) {
              return (
                <div key={index} className="bg-black-light mb-[10px]">
                  <p className="text-code-white">{user.name}</p>
                  <p className="text-code-white">{user.languages}</p>
                  <p className="text-code-white">{user.hobbies}</p>
                  {user.postNum === 0 && (
                    <Link href="/">
                      <a className="text-code-blue">もっと知りたい</a>
                    </Link>
                  )}
                  {user.postNum >= 1 && (
                    <div>
                      <p className="text-code-white">{user.posts[0].title}</p>
                      <Link href="/">
                        <a className="text-code-blue">もっと詳しく</a>
                      </Link>
                    </div>
                  )}
                  {user.postNum >= 2 && (
                    <div>
                      <p className="text-code-white">{user.posts[1].title}</p>
                      <Link href="/">
                        <a className="text-code-blue">もっと詳しく</a>
                      </Link>
                    </div>
                  )}
                  {user.postNum >= 3 && (
                    <div>
                      <p className="text-code-white">{user.posts[2].title}</p>
                      <Link href="/">
                        <a className="text-code-blue">もっと詳しく</a>
                      </Link>
                    </div>
                  )}
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}
