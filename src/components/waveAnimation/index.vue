<script setup lang="ts">
import type { Props } from "./type.ts";
import { getHexColorDark, getHexColorLight } from "@/utils/colorHandler/index.ts";

const props = withDefaults(defineProps<Props>(), {
  color: "#4579e2",
});

const lightenColor = computed(() => {
  return getHexColorLight(props.color, 0.2);
});

const darkenColor = computed(() => {
  return getHexColorDark(props.color, 0.2);
});
</script>

<template>
  <div class="page">
    <svg class="waves" viewBox="0 24 150 24" preserveAspectRatio="none">
      <defs>
        <path
            id="wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <!--中-->
      <use
          class="wave"
          xlink:href="#wave"
          :fill="props.color"
          x="50"
          y="0"
      ></use>
      <!--深-->
      <use
          class="wave"
          xlink:href="#wave"
          :fill="darkenColor"
          x="50"
          y="2"
      ></use>
      <!--浅-->
      <use
          class="wave"
          xlink:href="#wave"
          :fill="lightenColor"
          x="50"
          y="4"
      ></use>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  svg use {
    transition: fill 0.5s;
  }

  .waves {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
  }
}

.waves {
  .wave {
    animation: move 3s linear infinite;
    @for $i from 1 through 3 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * -2s};
        animation-duration: #{12s - $i * 3s};
      }
    }
  }

  @keyframes move {
    from {
      transform: translate(-90px, 0%);
    }
    to {
      transform: translate(85px, 0%);
    }
  }
}
</style>
