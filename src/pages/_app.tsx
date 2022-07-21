import { RecoilRoot } from 'recoil'
import '../../styles/globals.css'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <RecoilRoot>
        <Header />
        <Modal />
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  )
}

export default MyApp
