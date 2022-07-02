import { RecoilRoot } from 'recoil'
import '../../styles/globals.css'
import { Header } from '../components/Header'

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <RecoilRoot>
        <Header />
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  )
}

export default MyApp
