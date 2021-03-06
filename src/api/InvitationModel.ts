import { DocumentSnapshot } from "@/plugins/firebase";

export interface Member {
  uid: string;
  name: string | null;
  nickname: string | null;
  email: string | null;
  image: string | null;
}

export interface MemberModel extends Member {
  id: string;
}

export class MemberModelImpl implements MemberModel {
  public id: string;
  public uid: string;
  public name: string | null;
  public nickname: string | null;
  public email: string | null;
  public image: string | null;

  constructor(doc: DocumentSnapshot) {
    const data = doc.data() as Member;
    this.id = doc.id;
    this.uid = data.uid;
    this.name = data.name;
    this.nickname = data.nickname;
    this.email = data.email;
    this.image = data.image;
  }
}
