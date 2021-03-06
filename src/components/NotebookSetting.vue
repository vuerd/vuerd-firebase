<template>
  <el-container>
    <sidebar />
    <el-container>
      <el-header style="padding: 0; height: auto;">
        <nav-header />
      </el-header>
      <el-main class="main">
        <el-page-header
          @back="onBack"
          title=""
          :content="$t('notebookSetting')"
        />
        <notebook-info v-if="notebook !== null" :notebook="notebook" />
        <notebook-member v-if="notebook !== null" :notebook="notebook" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { NotebookModel, NotebookModelImpl } from "@/api/NotebookModel";
import { notebookDetail } from "@/api/NotebookAPI";
import { Component, Prop, Vue } from "vue-property-decorator";
import Sidebar from "@/components/common/Sidebar.vue";
import NavHeader from "@/components/common/NavHeader.vue";
import NotebookInfo from "@/components/NotebookSetting/NotebookInfo.vue";
import NotebookMember from "@/components/NotebookSetting/NotebookMember.vue";

@Component({
  components: {
    Sidebar,
    NavHeader,
    NotebookInfo,
    NotebookMember
  }
})
export default class NotebookSetting extends Vue {
  private notebook: NotebookModel | null = null;

  private getNotebook() {
    notebookDetail(this.$route.params.id)
      .then(doc => {
        if (!doc.exists) {
          this.$notify.error({
            title: "Error",
            message: this.$t("notFound.notebook") as string
          });
          this.$router.back();
        }
        const notebook = new NotebookModelImpl(doc);
        this.notebook = notebook;
        if (!notebook.roles[this.$store.state.user.uid]) {
          this.$notify.error({
            title: "Error",
            message: this.$t("notFound.role") as string
          });
          this.$router.back();
        }
      })
      .catch(err => {
        this.$notify.error({
          title: "Error",
          message: err.message
        });
        this.$router.back();
      });
  }

  private onBack() {
    this.$router.back();
  }

  private onNotebookReload() {
    this.getNotebook();
  }

  private created() {
    this.getNotebook();
  }
}
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
}
</style>
