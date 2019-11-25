import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import store, { Commit } from "@/store";
import router from "@/router";

const firebaseConfig = {
  apiKey: "AIzaSyBbknapvaSLGiJkzPmwO-lg8NNgKOUlrOM",
  authDomain: "vuerd-547c3.firebaseapp.com",
  databaseURL: "https://vuerd-547c3.firebaseio.com",
  projectId: "vuerd-547c3",
  storageBucket: "vuerd-547c3.appspot.com",
  messagingSenderId: "917202474220",
  appId: "1:917202474220:web:133d6cec0d98c6bad881c9",
  measurementId: "G-Q7R17B0E9E"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebase;
export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();

export type QuerySnapshot = firebase.firestore.QuerySnapshot;
export type DocumentReference = firebase.firestore.DocumentReference;
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot;
export type QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
export type CollectionReference = firebase.firestore.CollectionReference;
export type User = firebase.User;
export type AuthProvider = firebase.auth.EmailAuthProvider;
export interface Paging {
  limit?: number;
  last?: DocumentSnapshot | null;
  sort?: Sort;
  orderBy?: OrderBy;
}
export type Sort = "asc" | "desc";
export type OrderBy = "createdAt" | "updatedAt" | "title";

auth.onAuthStateChanged((user: User | null) => {
  if (user) {
    store.commit(Commit.signIn, user);
    router.push(store.state.referer);
  } else {
    store.commit(Commit.signOut);
  }
});
