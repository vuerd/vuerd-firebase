import { NotificationPaging } from "./NotificationModel";
import { QuerySnapshot } from "@/plugins/firebase";
import store from "@/store";
import { getUsersDocRef } from "@/api/UserAPI";

export function getNotificationColRef(uid: string) {
  return getUsersDocRef(uid).collection("notification");
}

export function getNotificationDocRef(uid: string, id: string) {
  return getNotificationColRef(uid).doc(id);
}

export function findAllNotificationBy(
  paging: NotificationPaging
): Promise<QuerySnapshot> {
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
  let ref = getNotificationColRef(store.state.user.uid)
    .orderBy(paging.orderBy, paging.sort)
    .limit(paging.limit);
  if (paging.read !== undefined) {
    ref = ref.where("read", "==", paging.read);
  }
  if (paging.last) {
    ref = ref.startAfter(paging.last);
  }
  return ref.get();
}