<template>
  <el-aside v-if="show" width="64">
    <nav-menu />
  </el-aside>
</template>

<script lang="ts">
import eventBus, { Bus } from "@/ts/EventBus";
import { Component, Prop, Vue } from "vue-property-decorator";
import NavMenu from "@/components/common/NavMenu.vue";

@Component({
  components: {
    NavMenu
  }
})
export default class Sidebar extends Vue {
  private show: boolean = true;

  // ==================== Event Handler ===================
  private onShow() {
    this.show = true;
  }

  private onHide() {
    this.show = false;
  }
  // ==================== Event Handler END ===================

  // ==================== Life Cycle ====================
  private created() {
    eventBus.$on(Bus.Sidebar.show, this.onShow);
    eventBus.$on(Bus.Sidebar.hide, this.onHide);
  }

  private mounted() {
    window.dispatchEvent(new Event("resize"));
  }

  private destroyed() {
    eventBus.$off(Bus.Sidebar.show, this.onShow);
    eventBus.$off(Bus.Sidebar.hide, this.onHide);
  }
  // ==================== Life Cycle END ====================
}
</script>

<style scoped lang="scss">
.el-aside {
  width: 64px;
}
</style>
