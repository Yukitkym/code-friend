import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const languages = [
    'HTML/CSS',
    'JavaScript',
    'PHP',
    'Ruby',
    'Python',
    'Java',
    'GO',
    'Kotlin',
    'Scala',
    'Swift',
    'SQL',
    'C',
    'C++',
    'C#',
    'R',
    'Visual Basic'
  ]
  const languages1 = languages.slice(0, 5)
  const languages2 = languages.slice(5, 11)
  const languages3 = languages.slice(11)
  const hobby = {
    game: [
      'PCゲーム',
      'テレビゲーム',
      '将棋',
      'チェス',
      'ポーカー',
      '麻雀',
      'ボードゲーム',
      'トレーディングカードゲーム'
    ],
    sports: [
      '筋トレ',
      'ランニング',
      '野球',
      'サッカー',
      'テニス',
      'バスケ',
      'バレーボール',
      'ダンス',
      'ゴルフ',
      'スポーツ観戦',
      'ダーツ',
      'ビリヤード',
      'ボルダリング',
      'サーフィン',
      'スノボ',
      'スキー'
    ],
    watching: ['アニメ', '映画鑑賞']
  }
  const game1 = hobby.game.slice(0, 6)
  const game2 = hobby.game.slice(6)
  const sports1 = hobby.sports.slice(0, 6)
  const sports2 = hobby.sports.slice(6, 11)
  const sports3 = hobby.sports.slice(11)
  const watching = hobby.watching

  let posts: any = []

  for (let i = 1; i < 21; i++) {
    const initPost = {
      userName: 'Takayama',
      language: ['JavaScript', 'SQL', 'Visual Basic'],
      hobby: ['テレビゲーム', 'ボードゲーム', '筋トレ'],
      postNum: 0,
      posts: [{}]
    }
    if (i % 4 === 2) {
      initPost.postNum = 1
      initPost.posts = [{ postTitle: 'ポーカーが趣味のエンジニアと出会いたい！' }]
    } else if (i % 4 === 3) {
      initPost.postNum = 2
      initPost.posts = [
        { postTitle: 'ポーカーが趣味のエンジニアと出会いたい！' },
        { postTitle: 'ポーカーが趣味のエンジニアと出会いたい！' }
      ]
    } else if (i % 4 === 0) {
      initPost.postNum = 3
      initPost.posts = [
        { postTitle: 'ポーカーが趣味のエンジニアと出会いたい！' },
        { postTitle: 'ポーカーが趣味のエンジニアと出会いたい！' },
        { postTitle: 'ポーカーが趣味のエンジニアと出会いたい！' }
      ]
    }
    posts = [...posts, initPost]
  }

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
      if (posts[i].postTitle.match(filteringText)) {
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
          {posts.map((post: any, index: number) => {
            if (
              checkText(post.userName, post.posts, post.postNum) &&
              checkLanguage(post.language) &&
              checkHobby(post.hobby)
            ) {
              return (
                <div key={index} className="bg-black-light mb-[10px]">
                  <p className="text-code-white">{post.userName}</p>
                  <p className="text-code-white">{post.language}</p>
                  <p className="text-code-white">{post.hobby}</p>
                  {post.postNum === 0 && (
                    <Link href="/">
                      <a className="text-code-blue">もっと知りたい</a>
                    </Link>
                  )}
                  {post.postNum >= 1 && (
                    <div>
                      <p className="text-code-white">{post.posts[0].postTitle}</p>
                      <Link href="/">
                        <a className="text-code-blue">もっと詳しく</a>
                      </Link>
                    </div>
                  )}
                  {post.postNum >= 2 && (
                    <div>
                      <p className="text-code-white">{post.posts[1].postTitle}</p>
                      <Link href="/">
                        <a className="text-code-blue">もっと詳しく</a>
                      </Link>
                    </div>
                  )}
                  {post.postNum >= 3 && (
                    <div>
                      <p className="text-code-white">{post.posts[2].postTitle}</p>
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
