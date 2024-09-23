<script lang="ts" setup>
import _ from 'lodash'
/**
 * 这个组件用来展示话题的评分
 */
import { convertToHTML, NodeType, EdgeType } from '../utils/convert'
defineOptions({
  name: 'rate-card',
})
const props = withDefaults(
  defineProps<{
    publisher?: string
    publishTime?: string
    team?: string
    ideaType?: string
    currentPosition?: number
    totalPosition?: number
    ideaData?: {
      nodes: NodeType[]
      edges: EdgeType[]
    }
    initCTGrades?: {
      recognition: number
      understanding: number
      evaluation: number
      analysis: number
      create: number
    }
    submitLoading?: boolean
  }>(),
  {
    publisher: 'None',
    publishTime: 'None',
    team: 'None',
    ideaType: 'None',
    currentPosition: 0,
    totalPosition: 0,
    ideaData: () => {
      return {
        nodes: [] as NodeType[],
        edges: [] as EdgeType[],
      }
    },
    initCTGrades: () => {
      return {
        recognition: 0,
        understanding: 0,
        evaluation: 0,
        analysis: 0,
        create: 0,
      }
    },
    submitLoading: false,
  }
)

const ideaHTML = computed(() => {
  const { ideaData } = props
  if (!ideaData || ideaData.nodes.length === 0 || ideaData.edges.length === 0) {
    return `<span>观点加载中...</span>`
  }
  return convertToHTML(ideaData)
})

const emits = defineEmits<{
  (e: 'next'): void
  (e: 'prev'): void
  (
    e: 'update:initCTGrades',
    CTGrades: Record<keyof typeof CTElementsTextMAP, number>
  ): void
  (e: 'submit', CTGrades: Record<keyof typeof CTElementsTextMAP, number>): void
}>()
const handleClickNextBtn = () => {
  emits('next')
}
const handleClickPrevBtn = () => {
  emits('prev')
}
const CTElementsTextMAP = {
  recognition: '识别',
  understanding: '理解',
  evaluation: '评价',
  analysis: '分析',
  create: '创造',
}
type CTElement = keyof typeof CTElementsTextMAP
const CTElements: Ref<CTElement[]> = ref([
  'recognition',
  'understanding',
  'evaluation',
  'analysis',
  'create',
])
const CTGrades: Ref<Record<keyof typeof CTElementsTextMAP, number>> = ref(
  props.initCTGrades
)
watch(
  () => props.initCTGrades,
  () => {
    CTGrades.value = props.initCTGrades
  }
)
const btnText = computed(() => {
  const isModified = Object.keys(props.initCTGrades).find(key => {
    return props.initCTGrades[key as keyof typeof props.initCTGrades] !== 0
  })
  return isModified ? '修 改' : '提 交'
})
const handleSubmit = _.throttle(() => emits('submit', CTGrades.value), 200)
</script>

<template>
  <div class="card">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <div class="left">
        <el-descriptions :column="2" border>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">发布者</div>
            </template>
            {{ props.publisher }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">发布时间</div>
            </template>
            {{ props.publishTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">所属团队</div>
            </template>
            {{ props.team }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">观点类型</div>
            </template>
            {{ props.ideaType }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">当前位置</div>
            </template>
            {{ props.currentPosition }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">总数量</div>
            </template>
            {{ props.totalPosition }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="content-container">
          <el-divider content-position="left">观点如下:</el-divider>
          <el-text>
            <div v-html="ideaHTML"></div>
          </el-text>
          <el-divider content-position="left">操作</el-divider>
          <div class="btn-group">
            <el-button type="primary" plain @click="handleClickPrevBtn"
              >上一个</el-button
            >
            <el-button type="primary" @click="handleClickNextBtn"
              >下一个</el-button
            >
          </div>
        </div>
      </div>
      <div class="right">
        <el-divider content-position="left">批判元素评分</el-divider>
        <el-form>
          <el-form-item
            v-for="item in CTElements"
            :key="item"
            :label="CTElementsTextMAP[item]"
          >
            <el-radio-group v-model="CTGrades[item]">
              <el-radio :value="0" border>不包含</el-radio>
              <el-radio :value="1" border>包含</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-divider content-position="center">操作</el-divider>
        <div class="btn-group">
          <el-button
            type="primary"
            round
            @click="handleSubmit"
            style="width: 100%"
            :loading="submitLoading"
            >{{ btnText }}</el-button
          >
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  header {
    display: flex;
    align-items: center;
    height: 30px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;

    h1 {
      font-size: 18px;
      font-weight: 500;
      line-height: 30px;
      width: 30px;
      // width:px;
    }
  }
  main {
    display: flex;
    height: calc(100% - 20px);
    .left {
      width: 50%;
      // background-color: pink;
      .cell-item {
        display: flex;
        align-items: center;
      }
      .content-container {
        padding: 10px;
        font-size: 14px;
        .title {
          font-size: 16px;
          font-weight: 700;
        }
        .content {
          margin-top: 10px;
        }
        .btn-group {
          display: flex;
          // justify-content: space-between;
          margin-top: 10px;
        }
      }
    }
    .right {
      width: 50%;
      padding: 20px;
      // background-color: skyblue;
    }
  }
}
</style>
