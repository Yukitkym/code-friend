import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { isLoginState } from '../atoms'

export const Header = () => {
  // ログインしている場合はHeaderが変わる
  const isLogin = useRecoilValue(isLoginState)

  return (
    <div className="h-[60px] bg-black-light">
      <div className="w-[900px] h-full flex mx-auto">
        <Link href="/">
          <h1 className="text-white font-en text-[30px] my-auto">&lt;/&gt;Code Friend</h1>
        </Link>
        <Link suppressHydrationWarning href={isLogin === false ? '/login' : '/setting/profile'}>
          <div className="mr-0 ml-auto my-auto h-[30px] w-[164px] border-[1px] border-white rounded-[5px] text-center">
            <p suppressHydrationWarning className="text-white font-ja text-[16px] pt-[2px]">
              {isLogin === false ? '新規登録・ログイン' : 'プロフィール'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
