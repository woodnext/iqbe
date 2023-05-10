import { atom } from "jotai";
import { User } from "firebase/auth"

export type FirebaseUser = User | null
export type UserData = {
  isLogined: boolean,
  nickname: string,
  photoURL: string,
} | null

export const fireBaseUserAtom = atom<FirebaseUser>(null)

export const userDataAtom = atom<UserData>(null)