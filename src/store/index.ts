import Vue from "vue";
import Vuex from "vuex";
import { User, Paging } from "@/plugins/firebase";
import { TreeNodeModel } from "@/api/TreeModel";
import { User as UserInfo } from "@/api/UserModel";
import { getUsersDocRef, userSignIn } from "@/api/UserAPI";
import { NotebookPaging, NotebookModel } from "@/api/NotebookModel";
import { Tag } from "@/models/vue-tags-input";
import i18n from "@/plugins/vue-i18n";
import eventBus, { Bus } from "@/ts/EventBus";

Vue.use(Vuex);

export interface Notebook {
  list: NotebookModel[];
  paging: NotebookPaging | null;
  scrollTop: number;
  tags: Tag[];
}

export interface MyNotebook {
  list: NotebookModel[];
  paging: Paging | null;
  scrollTop: number;
}

export interface State {
  user: User | null;
  info: UserInfo | null;
  referer: string;
  notebookId: string | null;
  treeList: TreeNodeModel[];
  unsubscribe: { (): void; (): void } | null;
  treeActiveId: string | null;
  notebook: Notebook;
  myNotebook: MyNotebook;
}

export const enum Commit {
  signIn = "signIn",
  signOut = "signOut",
  referer = "referer",
  setNotebookId = "setNotebookId",
  setTreeList = "setTreeList",
  setTreeActiveId = "setTreeActiveId",
  setNotebook = "setNotebook",
  setMyNotebook = "setMyNotebook",
  resetNotebook = "resetNotebook",
  resetMyNotebook = "resetMyNotebook"
}

export default new Vuex.Store<State>({
  state: {
    user: null,
    info: null,
    referer: "/",
    notebookId: null,
    treeList: [],
    unsubscribe: null,
    treeActiveId: null,
    notebook: {
      list: [],
      paging: {
        last: null,
        tags: []
      },
      scrollTop: 0,
      tags: []
    },
    myNotebook: {
      list: [],
      paging: {
        last: null
      },
      scrollTop: 0
    }
  },
  mutations: {
    signIn(state: State, user: User) {
      state.user = user;
      userSignIn();
      if (state.unsubscribe !== null) {
        state.unsubscribe();
        state.unsubscribe = null;
      }
      state.unsubscribe = getUsersDocRef(user.uid).onSnapshot(doc => {
        if (doc.exists) {
          const info = doc.data() as UserInfo;
          state.info = info;
          i18n.locale = info.language;
          eventBus.$emit(Bus.Setting.setInfo);
        }
      });
    },
    signOut(state: State) {
      if (state.unsubscribe !== null) {
        state.unsubscribe();
        state.unsubscribe = null;
      }
      state.user = null;
      state.info = null;
      state.notebookId = null;
      state.treeList = [];
      state.myNotebook = {
        list: [],
        paging: {
          last: null
        },
        scrollTop: 0
      };
    },
    referer(state: State, referer: string) {
      state.referer = referer;
    },
    setNotebookId(state: State, notebookId: string) {
      state.notebookId = notebookId;
    },
    setTreeList(state: State, treeList: TreeNodeModel[]) {
      state.treeList = treeList;
    },
    setTreeActiveId(state: State, treeActiveId: string | null) {
      state.treeActiveId = treeActiveId;
    },
    setNotebook(
      state: State,
      payload: {
        list?: NotebookModel[];
        paging?: NotebookPaging | null;
        scrollTop?: number;
        tags?: Tag[];
      }
    ) {
      const { list, paging, scrollTop, tags } = payload;
      if (paging !== undefined) {
        state.notebook.paging = paging;
      }
      if (state.notebook.paging && tags !== undefined) {
        state.notebook.tags = tags;
        state.notebook.paging.tags = tags;
      }
      if (list !== undefined && list.length !== 0) {
        state.notebook.list.push.apply(state.notebook.list, list);
      }
      if (scrollTop !== undefined) {
        state.notebook.scrollTop = scrollTop;
      }
    },
    setMyNotebook(
      state: State,
      payload: {
        list?: NotebookModel[];
        paging: Paging | null;
        scrollTop?: number;
      }
    ) {
      const { list, paging, scrollTop } = payload;
      state.myNotebook.paging = paging;
      if (list !== undefined && list.length !== 0) {
        state.myNotebook.list.push.apply(state.myNotebook.list, list);
      }
      if (scrollTop !== undefined) {
        state.myNotebook.scrollTop = scrollTop;
      }
    },
    resetNotebook(state: State) {
      state.notebook = {
        list: [],
        paging: {
          last: null,
          tags: []
        },
        scrollTop: 0,
        tags: []
      };
    },
    resetMyNotebook(state: State) {
      state.myNotebook = {
        list: [],
        paging: {
          last: null
        },
        scrollTop: 0
      };
    }
  }
});
