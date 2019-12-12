<template>
  <div v-if="editor">
    <markdown
      v-if="editor.type === 'markdown'"
      :value="editor.value"
      :width="windowWidth"
    />
    <erd
      v-else-if="editor.type === 'vuerd'"
      :value="editor.value"
      :width="windowWidth"
      :height="windowHeight"
    />
    <div v-else class="none">
      <h1>{{ message }}</h1>
    </div>
    <div class="mark">
      <el-link
        type="primary"
        href="https://vuerd-547c3.web.app"
        target="_blank"
      >
        vuerd.io
      </el-link>
    </div>
  </div>
</template>

<script lang="ts">
import { findTreeById } from "@/api/TreeAPI";
import { TreeNodeModelImpl } from "@/api/TreeModel";
import { Editor, treeNodeModelToEditor } from "@/models/Editor";
import { fromEvent, Observable, Subscription } from "rxjs";
import { FirestoreError } from "@/plugins/firebase";
import { Component, Prop, Vue } from "vue-property-decorator";
import Markdown from "@/components/Document/ContainerView/Markdown.vue";
import Erd from "@/components/Export/ERD.vue";

@Component({
  components: {
    Markdown,
    Erd
  }
})
export default class Export extends Vue {
  private editor: Editor | null = null;
  private message: string = "None";
  private windowWidth: number = window.innerWidth;
  private windowHeight: number = window.innerHeight;
  private resize$: Observable<Event> = fromEvent(window, "resize");
  private subResize!: Subscription;

  private getTree() {
    findTreeById(this.$route.params.notebookId, this.$route.params.id)
      .then(doc => {
        if (doc.exists) {
          this.editor = treeNodeModelToEditor(new TreeNodeModelImpl(doc));
        } else {
          this.message = "not found document";
        }
      })
      .catch((err: FirestoreError) => {
        if (err.code === "permission-denied") {
          this.message = "It's not disclosed";
        } else {
          this.message = err.message;
        }
      });
  }

  private onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  private created() {
    this.getTree();
  }

  private mounted() {
    this.subResize = this.resize$.subscribe(this.onResize);
    window.dispatchEvent(new Event("resize"));
  }

  private destroyed() {
    this.subResize.unsubscribe();
  }
}
</script>

<style scoped lang="scss">
.none {
  position: absolute;
  text-align: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100px;
  height: 53px;
  margin: auto;
}
.mark {
  padding: 5px;
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 999999;
}
</style>