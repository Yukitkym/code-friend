import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: typeof window === 'undefined' ? undefined : sessionStorage
})

export const isLoginState = atom({
  key: 'isLoginState',
  default: false,
  effects_UNSTABLE: [persistAtom]
})

export const uidState = atom({
  key: 'uidState',
  default: '',
  effects_UNSTABLE: [persistAtom]
})

export const modal = atom({
  key: 'modal',
  default: false
})

export const modalAction = atom({
  key: 'modalAction',
  default: ''
})
