import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/analytics";
import "firebase/performance";
import store, { Commit } from "@/store";
import router, { routes } from "@/router";

const firebaseConfig = {
  apiKey: "AIzaSyBbknapvaSLGiJkzPmwO-lg8NNgKOUlrOM",
  authDomain: "vuerd.io",
  databaseURL: "https://vuerd-547c3.firebaseio.com",
  projectId: "vuerd-547c3",
  storageBucket: "vuerd-547c3.appspot.com",
  messagingSenderId: "917202474220",
  appId: "1:917202474220:web:133d6cec0d98c6bad881c9",
  measurementId: "G-Q7R17B0E9E"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const analytics = firebase.analytics();
export const performance = firebase.performance();

export type QuerySnapshot = firebase.firestore.QuerySnapshot;
export type DocumentReference = firebase.firestore.DocumentReference;
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot;
export type CollectionReference = firebase.firestore.CollectionReference;
export type FirestoreError = firebase.firestore.FirestoreError;
export type AuthError = firebase.auth.AuthError;
export type User = firebase.User;
export type Trace = firebase.performance.Trace;
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
    analytics.setUserId(user.uid);
    store.commit(Commit.signIn, user);
    if (
      store.state.referer !== "/" &&
      store.state.referer !== routes.SignIn.path &&
      router.currentRoute.path !== store.state.referer
    ) {
      router.push(store.state.referer);
    }
  } else {
    store.commit(Commit.signOut);
  }
});
