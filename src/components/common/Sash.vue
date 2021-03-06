<template>
  <div
    class="sash"
    :class="{ vertical: vertical, horizontal: horizontal }"
    :style="{ top: `${centerTop}px`, left: `${centerLeft}px` }"
    @mousedown="onMousedown"
  />
</template>

<script lang="ts">
import { fromEvent, Observable, Subscription } from "rxjs";
import { Component, Prop, Vue } from "vue-property-decorator";

const SIZE_SASH = 5;

@Component
export default class Sash extends Vue {
  @Prop({ type: Boolean, default: false })
  private vertical!: boolean;
  @Prop({ type: Boolean, default: false })
  private horizontal!: boolean;
  @Prop({ type: Number, default: 0 })
  private top!: number;
  @Prop({ type: Number, default: 0 })
  private left!: number;

  private mouseup$: Observable<MouseEvent> = fromEvent<MouseEvent>(
    window,
    "mouseup"
  );
  private mousemove$: Observable<MouseEvent> = fromEvent<MouseEvent>(
    window,
    "mousemove"
  );
  private subMouseup: Subscription | null = null;
  private subMousemove: Subscription | null = null;

  get centerTop() {
    return this.top === 0 && !this.horizontal
      ? this.top
      : this.top - SIZE_SASH / 2;
  }

  get centerLeft() {
    return this.left === 0 && !this.vertical
      ? this.left
      : this.left - SIZE_SASH / 2;
  }

  // ==================== Event Handler ===================
  private onMousedown(event: MouseEvent) {
    this.onMouseup(event);
    this.subMouseup = this.mouseup$.subscribe(this.onMouseup);
    this.subMousemove = this.mousemove$.subscribe(this.onMousemove);
    this.$emit("mousedown", event);
  }

  private onMouseup(event: MouseEvent) {
    if (this.subMouseup && this.subMousemove) {
      this.subMouseup.unsubscribe();
      this.subMousemove.unsubscribe();
    }
    this.$emit("mouseup", event);
  }

  private onMousemove(event: MouseEvent) {
    event.preventDefault();
    this.$emit("mousemove", event);
  }

  // ==================== Event Handler END ===================
}
</script>

<style scoped lang="scss">
.sash {
  position: fixed;
  z-index: 1000;

  &.vertical {
    width: 5px;
    height: 100%;
    cursor: ew-resize;
  }

  &.horizontal {
    width: 100%;
    height: 5px;
    cursor: ns-resize;
  }
}
</style>
