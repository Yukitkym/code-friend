import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { isLoginState } from '../atoms'

export const Header = () => {
  // ログインしている場合はHeaderが変わる
  const isLogin = useRecoilValue(isLoginState)

  return (
    <div className="h-[45px] lg:h-[60px] bg-black-light">
      <div className="lg:w-[900px] h-full flex mx-auto">
        <Link href="/">
          <h1 className="text-[20px] lg:text-[30px] ml-[5px] lg:ml-0 text-white font-en my-auto">
            &lt;/&gt;Code Friend
          </h1>
        </Link>
        <Link suppressHydrationWarning href={isLogin === false ? '/login' : '/setting/profile'}>
          <div className="w-[140px] lg:w-[164px] mr-[10px] lg:mr-0 ml-auto my-auto h-[30px] border-[1px] border-white rounded-[5px] text-center">
            <p suppressHydrationWarning className="text-white font-ja text-[12px] lg:text-[16px] pt-[4px] lg:pt-[2px]">
              {isLogin === false ? '新規登録・ログイン' : 'プロフィール'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
