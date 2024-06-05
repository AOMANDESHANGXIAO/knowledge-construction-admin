<script lang="ts" setup>
import { useCounterStore } from '@/store/modules/counter'
defineOptions({
  name: 'main',
})
const counter = useCounterStore()
const incrument = () => {
  counter.incrument()
}
</script>

<template>
  <div>主页面视图</div>
  <div>{{ counter.state }}</div>
  <el-button @click="incrument">123</el-button>
</template>

<style lang="scss" scoped></style>
