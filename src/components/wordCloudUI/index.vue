<script lang="ts" setup>
import { VueDataUi, VueUiWordCloudConfig } from 'vue-data-ui'
import 'vue-data-ui/style.css'
import merge from 'lodash/merge'
defineOptions({
  name: 'WordCloudUI',
})
const props = withDefaults(
  defineProps<{
    config?: VueUiWordCloudConfig
    dataset: Array<{ name: string; value: number }>
    waitTime?: number
    title?: string
    subTitle?: string
  }>(),
  {
    waitTime: 1000,
    title: '默认标题',
    subTitle: '默认副标题',
  }
)
const defaultConfig: VueUiWordCloudConfig = {
  responsive: true,
  useCssAnimation: true,
  theme: '',
  animationDelayMs: 20,
  userOptions: {
    show: true,
  },
  style: {
    fontFamily: 'inherit',
    chart: {
      backgroundColor: '#FFFFFF',
      color: '#1A1A1A',
      height: '300',
      width: '512',
      words: {
        maxFontSize: 100,
        minFontSize: 10,
        bold: false,
        proximity: 10,
        packingWeight: 1,
        color: '#1A1A1A',
        usePalette: true,
      },
      title: {
        text: props.title,
        color: '#1A1A1A',
        fontSize: 20,
        bold: true,
        subtitle: {
          // text: props.subTitle,
          color: '#CCCCCC',
          fontSize: 16,
          bold: false,
        },
      },
    },
  },
  table: {
    show: false,
    responsiveBreakpoint: 300,
    columnNames: {
      series: 'Word',
      value: 'Value',
    },
    th: {
      backgroundColor: '#FFFFFF',
      color: '#1A1A1A',
      outline: 'none',
    },
    td: {
      backgroundColor: '#FFFFFF',
      color: '#1A1A1A',
      outline: 'none',
      roundingValue: 0,
      prefix: '',
      suffix: '',
    },
  },
}
const config = computed(() => {
  return merge({}, defaultConfig, props.config)
})
const renderLoading = ref(true)
const loaderClassName = computed(() => {
  const i = Math.floor(Math.random() * 3) + 1
  return `loader-${i}`
})
onMounted(() => {
  setTimeout(() => {
    renderLoading.value = false
  }, props.waitTime)
})
</script>

<template>
  <div
    style="width: 100%; min-width: 300px; min-height: 300px"
    class="container flex-center"
  >
    <!-- loading UI -->
    <div
      v-if="renderLoading"
      style="position: absolute; width: 50px; height: 50px"
      class="flex-center"
      :class="loaderClassName"
    ></div>
    <!-- WordCloud UI -->
    <VueDataUi
      v-else
      component="VueUiWordCloud"
      :config="config"
      :dataset="dataset"
    >
    </VueDataUi>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  border: 1px solid #ccc;
  padding: 10px;
  // box-shadow: 0 0 10px #ccc;
  border-radius: 10px;
  overflow: hidden;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* HTML: <div class="loader"></div> */
.loader-1 {
  width: 40px;
  aspect-ratio: 1;
  background: linear-gradient(45deg, #0000 50%, #00aaff 0),
    linear-gradient(-45deg, #0000 50%, #ff00aa 0), #00aaff;
  background-size: 200% 200%;
  background-repeat: no-repeat;
  animation: l2 1.5s infinite;
}
@keyframes l2 {
  0% {
    background-position: bottom left, bottom right;
  }
  30%,
  50% {
    background-position: bottom left, top left;
  }
  80%,
  100% {
    background-position: top right, top left;
  }
}
/* HTML: <div class="loader"></div> */
.loader-2 {
  width: 40px;
  aspect-ratio: 1;
  background: linear-gradient(#00aaff 0 0), linear-gradient(#ff00aa 0 0),
    #00aaff;
  background-repeat: no-repeat;
  animation: l1 1.5s infinite;
}
@keyframes l1 {
  0% {
    background-size: 100% 0, 0 100%;
  }
  30%,
  50% {
    background-size: 100% 0, 100% 100%;
  }
  80%,
  100% {
    background-size: 100% 100%, 100% 100%;
  }
}
/* HTML: <div class="loader"></div> */
.loader-3 {
  width: 80px;
  aspect-ratio: 2;
  --c: linear-gradient(#ffd412 25%, #abd406 0 50%, #ff821c 0 75%, #ffd412 0);
  background: var(--c), var(--c), var(--c), var(--c);
  background-size: 26% 400%;
  background-position: calc(0 * 100% / 3) 100%, calc(1 * 100% / 3) 100%,
    calc(2 * 100% / 3) 100%, calc(3 * 100% / 3) 100%;
  background-repeat: no-repeat;
  animation: l10 2s infinite;
}
@keyframes l10 {
  0% {
    background-position: calc(0 * 100% / 3) calc(3 * 100% / 3),
      calc(1 * 100% / 3) calc(3 * 100% / 3),
      calc(2 * 100% / 3) calc(3 * 100% / 3),
      calc(3 * 100% / 3) calc(3 * 100% / 3);
  }
  8.33% {
    background-position: calc(0 * 100% / 3) calc(2 * 100% / 3),
      calc(1 * 100% / 3) calc(3 * 100% / 3),
      calc(2 * 100% / 3) calc(3 * 100% / 3),
      calc(3 * 100% / 3) calc(3 * 100% / 3);
  }
  16.67% {
    background-position: calc(0 * 100% / 3) calc(2 * 100% / 3),
      calc(1 * 100% / 3) calc(2 * 100% / 3),
      calc(2 * 100% / 3) calc(3 * 100% / 3),
      calc(3 * 100% / 3) calc(3 * 100% / 3);
  }
  25% {
    background-position: calc(0 * 100% / 3) calc(2 * 100% / 3),
      calc(1 * 100% / 3) calc(2 * 100% / 3),
      calc(2 * 100% / 3) calc(2 * 100% / 3),
      calc(3 * 100% / 3) calc(3 * 100% / 3);
  }
  30%,
  33.33% {
    background-position: calc(0 * 100% / 3) calc(2 * 100% / 3),
      calc(1 * 100% / 3) calc(2 * 100% / 3),
      calc(2 * 100% / 3) calc(2 * 100% / 3),
      calc(3 * 100% / 3) calc(2 * 100% / 3);
  }
  41.67% {
    background-position: calc(0 * 100% / 3) calc(1 * 100% / 3),
      calc(1 * 100% / 3) calc(2 * 100% / 3),
      calc(2 * 100% / 3) calc(2 * 100% / 3),
      calc(3 * 100% / 3) calc(2 * 100% / 3);
  }
  50% {
    background-position: calc(0 * 100% / 3) calc(1 * 100% / 3),
      calc(1 * 100% / 3) calc(1 * 100% / 3),
      calc(2 * 100% / 3) calc(2 * 100% / 3),
      calc(3 * 100% / 3) calc(2 * 100% / 3);
  }
  58.33% {
    background-position: calc(0 * 100% / 3) calc(1 * 100% / 3),
      calc(1 * 100% / 3) calc(1 * 100% / 3),
      calc(2 * 100% / 3) calc(1 * 100% / 3),
      calc(3 * 100% / 3) calc(2 * 100% / 3);
  }
  63%,
  66.67% {
    background-position: calc(0 * 100% / 3) calc(1 * 100% / 3),
      calc(1 * 100% / 3) calc(1 * 100% / 3),
      calc(2 * 100% / 3) calc(1 * 100% / 3),
      calc(3 * 100% / 3) calc(1 * 100% / 3);
  }
  75% {
    background-position: calc(0 * 100% / 3) calc(0 * 100% / 3),
      calc(1 * 100% / 3) calc(1 * 100% / 3),
      calc(2 * 100% / 3) calc(1 * 100% / 3),
      calc(3 * 100% / 3) calc(1 * 100% / 3);
  }
  83.33% {
    background-position: calc(0 * 100% / 3) calc(0 * 100% / 3),
      calc(1 * 100% / 3) calc(0 * 100% / 3),
      calc(2 * 100% / 3) calc(1 * 100% / 3),
      calc(3 * 100% / 3) calc(1 * 100% / 3);
  }
  91.67% {
    background-position: calc(0 * 100% / 3) calc(0 * 100% / 3),
      calc(1 * 100% / 3) calc(0 * 100% / 3),
      calc(2 * 100% / 3) calc(0 * 100% / 3),
      calc(3 * 100% / 3) calc(1 * 100% / 3);
  }
  97%,
  100% {
    background-position: calc(0 * 100% / 3) calc(0 * 100% / 3),
      calc(1 * 100% / 3) calc(0 * 100% / 3),
      calc(2 * 100% / 3) calc(0 * 100% / 3),
      calc(3 * 100% / 3) calc(0 * 100% / 3);
  }
}
/* HTML: <div class="loader"></div> */
.loader-4 {
  width: 40px;
  aspect-ratio: 0.577;
  clip-path: polygon(0 0, 100% 100%, 0 100%, 100% 0);
  position: relative;
  animation: l19 2s infinite linear;
  overflow: hidden;
}
.loader-4:before {
  content: '';
  position: absolute;
  inset: -150% -150%;
  background: repeating-conic-gradient(
    from 30deg,
    #ffabab 0 60deg,
    #abe4ff 0 120deg,
    #ff7373 0 180deg
  );
  animation: inherit;
  animation-direction: reverse;
}
@keyframes l19 {
  100% {
    transform: rotate(360deg);
  }
}
</style>
