import {
  db,
  QuerySnapshot,
  DocumentReference,
  DocumentSnapshot,
  CollectionReference,
  Paging
} from "@/plugins/firebase";
import {
  NotebookPaging,
  Notebook,
  NotebookAdd,
  Member,
  MemberAdd,
  Role,
  Heart,
  EditorTemplate
} from "./NotebookModel";
import store, { Commit } from "@/store";
import moment from "moment";
import { getTreesColRef } from "./TreeAPI";
import { TreeNode } from "./TreeModel";

export function getNotebooksColRef(): CollectionReference {
  return db.collection("notebooks");
}

export function getNotebooksDocRef(id: string): DocumentReference {
  return getNotebooksColRef().doc(id);
}

export function getMembersColRef(notebookId: string): CollectionReference {
  return getNotebooksDocRef(notebookId).collection("members");
}

export function getMembersDocRef(
  notebookId: string,
  uid: string
): DocumentReference {
  return getMembersColRef(notebookId).doc(uid);
}

export function getHeartsColRef(notebookId: string): CollectionReference {
  return getNotebooksDocRef(notebookId).collection("hearts");
}

export function getHeartsDocRef(
  notebookId: string,
  uid: string
): DocumentReference {
  return getHeartsColRef(notebookId).doc(uid);
}

export async function notebookAdd(
  notebookAdd: NotebookAdd,
  editorTemplate: EditorTemplate
): Promise<DocumentReference> {
  if (!store.state.user || !store.state.info) {
    throw new Error("not found user");
  }
  const notebook = notebookAdd as Notebook;
  notebook.roles = {};
  notebook.roles[store.state.user.uid] = "owner";
  notebook.members = [store.state.user.uid];
  notebook.heartCount = 0;
  notebook.updatedAt = moment().unix();
  notebook.createdAt = moment().unix();
  const docRef = await getNotebooksColRef().add(notebook);

  if (editorTemplate === "all-editor-sample") {
    const batch = db.batch();
    batch.set(getTreesColRef(docRef.id).doc(), {
      path: "example",
      name: "example",
      updatedAt: moment().unix(),
      createdAt: moment().unix()
    } as TreeNode);
    batch.set(getTreesColRef(docRef.id).doc(), {
      path: "example/hello.vuerd",
      name: "hello.vuerd",
      value: "",
      updatedAt: moment().unix(),
      createdAt: moment().unix()
    } as TreeNode);
    batch.set(getTreesColRef(docRef.id).doc(), {
      path: "example/hello.md",
      name: "hello.md",
      value: "# hello [tui.editor](https://github.com/nhn/tui.editor)",
      updatedAt: moment().unix(),
      createdAt: moment().unix()
    } as TreeNode);
    batch.set(getTreesColRef(docRef.id).doc(), {
      path: "example/hello.rich",
      name: "hello.rich",
      value: `<h1>hello</h1><h2><a href="https://github.com/quill/quill">quill</a></h2>`,
      updatedAt: moment().unix(),
      createdAt: moment().unix()
    } as TreeNode);
    batch.set(getTreesColRef(docRef.id).doc(), {
      path: "example/hello.summernote.rich",
      name: "hello.summernote.rich",
      value: `<h1>hello</h1><h2><a href="https://github.com/summernote/summernote">summernote</a></h2>`,
      updatedAt: moment().unix(),
      createdAt: moment().unix()
    } as TreeNode);
    batch.set(getTreesColRef(docRef.id).doc(), {
      path: "example/hello.medium.rich",
      name: "hello.medium.rich",
      value: `<h1>hello</h1><h2><a href="https://github.com/yabwe/medium-editor">medium-editor</a></h2>`,
      updatedAt: moment().unix(),
      createdAt: moment().unix()
    } as TreeNode);
    await batch.commit();
  } else {
    await getTreesColRef(docRef.id).add({
      path: "unnamed",
      name: "unnamed",
      updatedAt: moment().unix(),
      createdAt: moment().unix()
    } as TreeNode);
  }

  const user = store.state.info;
  await getMembersDocRef(docRef.id, store.state.user.uid).set({
    uid: store.state.user.uid,
    name: user.name,
    nickname: user.nickname,
    email: store.state.user.email,
    image: user.image,
    role: "owner",
    status: "accept",
    createdAt: moment().unix()
  } as Member);
  store.commit(Commit.resetNotebook);
  store.commit(Commit.resetMyNotebook);
  return docRef;
}

export function notebookPaging(paging: NotebookPaging): Promise<QuerySnapshot> {
  if (!paging.limit) {
    paging.limit = 20;
  }
  if (!paging.orderBy) {
    paging.orderBy = "createdAt";
  }
  if (!paging.sort) {
    paging.sort = "desc";
  }
  let ref = getNotebooksColRef()
    .where("published", "==", true)
    .orderBy(paging.orderBy, paging.sort)
    .limit(paging.limit);
  if (paging.tags && paging.tags.length !== 0) {
    ref = ref.where(
      "tags",
      "array-contains-any",
      paging.tags.map(tag => tag.text)
    );
  }
  if (paging.last) {
    ref = ref.startAfter(paging.last);
  }
  return ref.get();
}

export function myNotebookPaging(paging: Paging): Promise<QuerySnapshot> {
  if (!store.state.user) {
    throw new Error("not found user");
  }
  if (!paging.limit) {
    paging.limit = 20;
  }
  if (!paging.orderBy) {
    paging.orderBy = "createdAt";
  }
  if (!paging.sort) {
    paging.sort = "desc";
  }
  let ref = getNotebooksColRef()
    .where("members", "array-contains", store.state.user.uid)
    .orderBy(paging.orderBy, paging.sort)
    .limit(paging.limit);
  if (paging.last) {
    ref = ref.startAfter(paging.last);
  }
  return ref.get();
}

export function notebookDetail(id: string): Promise<DocumentSnapshot> {
  return getNotebooksDocRef(id).get();
}

export async function notebookModify(
  id: string,
  notebookAdd: NotebookAdd
): Promise<void> {
  if (!store.state.user) {
    throw new Error("not found user");
  }
  await getNotebooksDocRef(id).update(notebookAdd);
  store.commit(Commit.resetNotebook);
  store.commit(Commit.resetMyNotebook);
}

export async function notebookRemove(notebookId: string): Promise<void> {
  if (!store.state.user) {
    throw new Error("not found user");
  }
  await getNotebooksDocRef(notebookId).delete();
  store.commit(Commit.resetNotebook);
  store.commit(Commit.resetMyNotebook);
}

export function memberList(id: string): Promise<QuerySnapshot> {
  return getMembersColRef(id)
    .orderBy("createdAt", "asc")
    .get();
}

export function memberInvitation(
  notebookId: string,
  membersAdd: MemberAdd[]
): Promise<void> {
  if (!store.state.user) {
    throw new Error("not found user");
  }
  const batch = db.batch();
  for (const member of membersAdd) {
    batch.set(getMembersDocRef(notebookId, member.id), {
      fromId: store.state.user.uid,
      uid: member.uid,
      name: member.name,
      nickname: member.nickname,
      email: member.email,
      image: member.image,
      role: "reader",
      status: "invitation",
      createdAt: moment().unix()
    } as Member);
  }
  return batch.commit();
}

export function memberRemove(
  notebookId: string,
  memberId: string
): Promise<void> {
  if (!store.state.user) {
    throw new Error("not found user");
  }
  return getMembersDocRef(notebookId, memberId).delete();
}

export function memberRoleModify(
  notebookId: string,
  memberId: string,
  role: Role
): Promise<void> {
  if (!store.state.user) {
    throw new Error("not found user");
  }
  return getMembersDocRef(notebookId, memberId).update({
    role
  });
}

export function heartDetail(notebookId: string): Promise<DocumentSnapshot> {
  if (!store.state.user) {
    throw new Error("not found user");
  }
  return getHeartsDocRef(notebookId, store.state.user.uid).get();
}

export function heartAdd(notebookId: string): Promise<void> {
  if (!store.state.user) {
    throw new Error("not found user");
  }
  return getHeartsDocRef(notebookId, store.state.user.uid).set({
    createdAt: moment().unix()
  } as Heart);
}

export function heartRemove(notebookId: string): Promise<void> {
  if (!store.state.user) {
    throw new Error("not found user");
  }
  return getHeartsDocRef(notebookId, store.state.user.uid).delete();
}
