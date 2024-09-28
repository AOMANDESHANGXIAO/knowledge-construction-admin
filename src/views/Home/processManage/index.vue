<script lang="ts" setup>
import DiscussionAPI, {
  QueryTopicResult,
  QueryIdeaResult,
  UpdateRateInput,
} from '@/apis/discussion'
import useRequest from '@/hooks/useRequest'
import ClassAPI, { QueryAllResult } from '@/apis/class_'
import { useUserStore } from '@/store/modules/user'
import rateCard from './components/rateCard.vue'
import CommonAPI, { UserInfo, GroupInfo } from '@/apis/common'
import { EdgeType, NodeType } from './utils/convert'
import WordCloudUI from '@/components/wordCloudUI/index.vue'
import { VueUiWordCloudDatasetItem } from 'vue-data-ui'
import FlowAPI, { QueryWordCloudResult } from '@/apis/flow'
import _ from 'lodash'
defineOptions({
  name: 'processManage',
})

/**
 * 当前话题状态
 */
type TopicStatus = 'propose' | 'feedback' | 'summary' | 'close'
const currentTopic: ComputedRef<{
  content: string
  className: string
  status: TopicStatus | undefined
}> = computed(() => {
  const class_ = classList.value.find(item => item.id === classId.value)
  const topic = topicList.value.find(item => item.id === topicId.value)
  return {
    content: topic?.topic_content || '尚未选择话题',
    className: class_?.class_name || '尚未选择班级',
    status: topic?.status || undefined,
  }
})
const statusTextMap = {
  propose: '提出观点',
  feedback: '反馈观点',
  summary: '汇总观点',
  close: '已经关闭',
}
const currentStep = computed(() => {
  if (currentTopic.value.status !== undefined) {
    return steps.indexOf(currentTopic.value.status)
  } else {
    return 0
  }
})
const steps: Array<keyof typeof statusTextMap> = [
  'propose',
  'feedback',
  'summary',
  'close',
]

const userStore = useUserStore()

const { run: update, loading } = useRequest({
  apiFn: async () => {
    const status = currentTopic.value.status
    let nextStatus: 'feedback' | 'summary' | 'close' = 'feedback'
    if (status === 'propose') {
      nextStatus = 'feedback'
    } else if (status === 'feedback') {
      nextStatus = 'summary'
    } else if (status === 'summary') {
      nextStatus = 'close'
    }
    return DiscussionAPI.update({
      topicId: topicId.value as number,
      status: nextStatus,
      operatorId: userStore.user.id as number,
    })
  },
  defaultNotify: true,
  onSuccess() {
    // 更新
    getTopicList()
  },
})

const handleNextStatus = () => {
  const status = currentTopic.value.status
  if (
    !topicId.value ||
    status === undefined ||
    status === 'close' ||
    userStore.user.id === undefined
  ) {
    ElNotification({
      type: 'error',
      message: '参数错误',
      title: 'error',
    })
    return
  }
  update()
}
/**
 * 控制话题
 */
const classList = ref<QueryAllResult['list']>([])
const classId = ref<undefined | number>(undefined)
const topicList = ref<QueryTopicResult['list']>([])
const topicId = ref<undefined | number>(undefined)

// 查询班级
const { run: getClassList } = useRequest({
  apiFn: async () => {
    // 测试接口
    return ClassAPI.queryAll()
  },
  formatter(data) {
    classList.value = data.list
  },
  defaultNotify: true,
})
// 查询话题
const { run: getTopicList } = useRequest({
  apiFn: async () => {
    return DiscussionAPI.queryAll({
      class_id: classId.value as number,
    })
  },
  onSuccess(data) {
    topicList.value = data.list
  },
  defaultNotify: true,
})
// 查询班级列表
Promise.all([getClassList()])
const handleChangeClass = async () => {
  await getTopicList()
  topicId.value = undefined
}
/**
 * 打分
 */
type ideaType = 'idea' | 'group' | 'all'
const ideaType = ref<undefined | ideaType>('all')
const ideaTypeList: Array<{ label: string; value: ideaType }> = [
  { label: '单独观点', value: 'idea' },
  { label: '小组观点', value: 'group' },
  { label: '全部', value: 'all' },
]
const currentGroupId = ref<undefined | number>(undefined)
const groupList = ref<GroupInfo[]>([])
const { run: getGroupList } = useRequest({
  apiFn: async () => {
    return CommonAPI.queryGroupsByClassId({
      class_id: classId.value as number,
    })
  },
  onSuccess(data) {
    groupList.value = data.list
  },
  defaultNotify: false,
})
watch(
  () => classId.value,
  async () => {
    if (classId.value !== undefined) {
      await getGroupList()
      currentGroupId.value = undefined
    }
  }
)
const currentPublisherId = ref<undefined | number>(undefined)
const publisherList = ref<UserInfo[]>([])
const { run: getPublisherList } = useRequest({
  apiFn: async () => {
    return CommonAPI.queryStudentsByGroupId({
      group_id: currentGroupId.value as number,
    })
  },
  onSuccess(data) {
    publisherList.value = data.list
  },
})
watch(
  () => currentGroupId.value,
  async () => {
    if (currentGroupId.value !== undefined) {
      await getPublisherList()
      currentPublisherId.value = undefined
    }
  }
)
// 查询观点
const ideaList = ref<QueryIdeaResult[]>([])
const currentIdeaId = ref<undefined | number>(undefined)
const { run: getIdeaList } = useRequest({
  apiFn: async () => {
    let params: {
      topicId: number
      groupId?: number
      ideaType?: 'idea' | 'group'
      publisherId?: number
    } = {
      topicId: topicId.value as number,
      groupId: currentGroupId.value as number,
      publisherId: currentPublisherId.value as number,
    }
    if (ideaType.value !== 'all') {
      params = {
        ...params,
        ideaType: ideaType.value,
      }
    }
    return DiscussionAPI.queryIdeaForRate(params)
  },
  onSuccess(data) {
    ideaList.value = data.list
  },
})
watch(
  () => [
    topicId.value,
    currentGroupId.value,
    currentPublisherId.value,
    ideaType.value,
  ],
  async () => {
    if (!topicId.value) return
    await getIdeaList()
    currentIdeaId.value = undefined
  }
)

const nodes = ref<NodeType[]>([])
const edges = ref<EdgeType[]>([])

const { run: getIdeaContent } = useRequest({
  apiFn: async () => {
    return FlowAPI.queryContentByNodeID({
      node_id: currentIdeaId.value as number,
    })
  },
  onSuccess(data) {
    nodes.value = data.nodes
    edges.value = data.edges
  },
})
watch(
  () => currentIdeaId.value,
  async () => {
    if (!currentIdeaId.value) return
    await getIdeaContent()
  }
)

const rateCardData = computed(() => {
  const currentPosition = ideaList.value.findIndex(
    item => item.id === currentIdeaId.value
  )
  const currentIdea = ideaList.value[currentPosition]
  const totalPosition = ideaList.value.length
  const currentPublisher = currentIdea?.nickname
  const currentTeam = currentIdea?.group_name
  return {
    publisher: currentPublisher,
    pulishTime: String(currentIdea?.created_time) || 'None',
    team: currentTeam,
    ideaType: currentIdea?.type,
    initCTGrades: {
      recognition: currentIdea?.recognition || 0,
      understanding: currentIdea?.understanding || 0,
      evaluation: currentIdea?.evaluation || 0,
      analysis: currentIdea?.analysis || 0,
      create: currentIdea?.create || 0,
    },
    currentPosition: currentPosition + 1, // index + 1
    totalPosition,
    ideaData: { nodes: nodes.value, edges: edges.value },
  }
})
const handlePrev = () => {
  if (currentIdeaId.value === undefined || currentIdeaId.value === 0) {
    return
  }

  currentIdeaId.value -= 1
}
const handleNext = () => {
  if (
    currentIdeaId.value === undefined ||
    currentIdeaId.value === ideaList.value.length - 1
  ) {
    return
  }

  currentIdeaId.value += 1
}
const submitData: UpdateRateInput = {
  recognition: 0,
  understanding: 0,
  evaluation: 0,
  analysis: 0,
  create: 0,
  node_table_id: currentIdeaId.value as number,
  version: 0,
}
const { run: updateRate, loading: updateRateLoading } = useRequest({
  apiFn: async () => {
    return DiscussionAPI.updateRate(submitData)
  },
  defaultNotify: true,
})
const handleSubmit = (val: {
  recognition: number
  understanding: number
  evaluation: number
  analysis: number
  create: number
}) => {
  submitData.recognition = val.recognition
  submitData.understanding = val.understanding
  submitData.evaluation = val.evaluation
  submitData.analysis = val.analysis
  submitData.create = val.create
  submitData.node_table_id = currentIdeaId.value as number
  const currentIdea = ideaList.value.find(
    item => item.id === currentIdeaId.value
  )
  submitData.version = currentIdea?.version || 0
  let isValid = true
  // submitData.version = ideaList.value[currentIdeaId.value as number].version
  Object.keys(submitData).forEach(key => {
    if (
      submitData[key as keyof UpdateRateInput] === undefined ||
      isNaN(submitData[key as keyof UpdateRateInput]) ||
      typeof submitData[key as keyof UpdateRateInput] !== 'number'
    ) {
      isValid = false
    }
  })
  if (!isValid) {
    ElNotification({
      type: 'error',
      title: '提示',
      message: '参数不合法',
    })
    return
  }

  updateRate()
}
/**
 * 查询词云
 */
const wordCloudData = ref<QueryWordCloudResult['list']>([])
const { run: getWordCloud, loading: cloudWordLoading } = useRequest({
  apiFn: async () => {
    return FlowAPI.queryWordCloud({
      topic_id: topicId.value as number,
    })
  },
  onSuccess(data) {
    wordCloudData.value = data.list
  },
})
watch(
  () => topicId.value,
  async () => {
    if (topicId.value !== undefined) {
      await getWordCloud()
    }
  }
)
const generateWordCloudList = (text: string): VueUiWordCloudDatasetItem[] => {
  const list: VueUiWordCloudDatasetItem[] = []
  // 排序，取前十个词
  const segmenter: {
    segment: string
    index: number
    input: string
    isWordLike: Boolean
  }[] = Array.from(
    // @ts-ignore
    new Intl.Segmenter('cn', { granularity: 'word' }).segment(text)
  )

  const wordCounts = _.countBy(
    segmenter.filter(item => item.segment.length > 1),
    'segment'
  )

  for (const key in wordCounts) {
    list.push({
      name: key,
      value: wordCounts[key],
    })
  }
  return _.orderBy(list, ['value'], ['desc']).slice(0, 15)
}
const BASE_WAIT_TIME = 150
const getWaitTime = (index: number) => {
  return (index + 1) * BASE_WAIT_TIME
}
const handleRefresh = () => {
  if (!topicId.value) {
    ElNotification({
      title: '提示',
      message: '请先选择话题',
      type: 'info',
    })
  } else {
    getWordCloud()
  }
}
</script>

<template>
  <div class="container">
    <el-scrollbar style="height: 100%">
      <!-- 显示当前正在管理的话题的信息 -->
      <header>
        <section class="title">⭐话题信息</section>
        <h2>当前话题:{{ currentTopic.content }}</h2>
        <h3>所属班级:{{ currentTopic.className }}</h3>
        <div>
          话题状态:
          <span :class="currentTopic.status">{{
            currentTopic.status ? statusTextMap[currentTopic.status] : '加载中'
          }}</span>
        </div>
        <el-steps :active="currentStep" finish-status="success">
          <el-step v-for="item in steps" :title="statusTextMap[item]"></el-step>
        </el-steps>
      </header>
      <!-- 控制器，包括修改状态的空间 -->
      <main>
        <section class="title">⭐控制话题</section>
        <el-form style="padding-top: 10px">
          <el-row :gutter="20" style="padding-top: 10px">
            <el-col :span="12">
              <el-form-item label="选择班级">
                <el-select
                  v-model="classId"
                  placeholder="请选择班级"
                  @change="handleChangeClass"
                >
                  <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.class_name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择话题">
                <el-select v-model="topicId" placeholder="请选择话题">
                  <el-option
                    v-for="item in topicList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.topic_content"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-popconfirm
            title="你确定要推进话题吗?"
            @confirm="handleNextStatus"
          >
            <template #reference>
              <el-button type="primary" :loading="loading">推进话题</el-button>
            </template>
          </el-popconfirm>
        </el-form>
      </main>
      <!-- table区域，显示当前话题参与的每个组的情况 -->
      <footer>
        <!-- 评分 -->
        <el-row style="width: 100%; height: 500px">
          <el-col :span="24">
            <rate-card
              :publish-time="rateCardData.pulishTime"
              :publisher="rateCardData.publisher"
              :team="rateCardData.team"
              :init-c-t-grades="rateCardData.initCTGrades"
              :idea-type="rateCardData.ideaType"
              :current-position="rateCardData.currentPosition"
              :total-position="rateCardData.totalPosition"
              :idea-data="rateCardData.ideaData"
              :submit-loading="updateRateLoading"
              @prev="handlePrev"
              @next="handleNext"
              @submit="handleSubmit"
            >
              <template #header>
                <el-form
                  style="
                    width: calc(100% - 30px);
                    display: flex;
                    align-items: center;
                  "
                >
                  <el-row
                    :gutter="20"
                    style="display: flex; align-items: center; width: 100%"
                  >
                    <el-col :span="6">
                      <el-form-item label="观点">
                        <el-select placeholder="观点" v-model="currentIdeaId">
                          <el-option
                            v-for="item in ideaList"
                            :key="item.renderId"
                            :label="`${item.renderId}:${item.content}`"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="团队">
                        <el-select
                          placeholder="请选择团队"
                          v-model="currentGroupId"
                        >
                          <el-option
                            v-for="item in groupList"
                            :key="item.id"
                            :label="item.group_name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="发布者">
                        <el-select
                          placeholder="请选择发布者"
                          v-model="currentPublisherId"
                        >
                          <el-option
                            v-for="item in publisherList"
                            :key="item.id"
                            :label="item.nickname"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="类型">
                        <el-select
                          placeholder="请选择观点类型"
                          v-model="ideaType"
                          ><el-option
                            v-for="item in ideaTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </rate-card>
          </el-col>
        </el-row>
        <!-- 控制词云刷新 -->
        <el-row
          style="width: 100%; height: 100px"
          class="flex-space-between control-box"
        >
          <div class="title">小组讨论词云一览:</div>
          <el-icon
            :size="30"
            @click="handleRefresh"
            class="refresh-icon"
            :class="{ 'is-loading': cloudWordLoading }"
            ><Refresh
          /></el-icon>
        </el-row>
        <!-- 词云 -->
        <el-row style="width: 100%; min-height: 500px">
          <div class="word-cloud-layout" v-if="wordCloudData.length > 0">
            <div v-for="(item, index) in wordCloudData" :key="index">
              <WordCloudUI
                :dataset="generateWordCloudList(item.text)"
                :title="item.group_name"
                :wait-time="getWaitTime(index)"
              ></WordCloudUI>
            </div>
          </div>
          <div v-else class="empty-container">
            <el-empty>暂未选择任何讨论</el-empty>
          </div>
        </el-row>
        <!-- 学生评价一览 -->
        <!-- <el-row style="width: 100%; height: 100px" class="flex-space-between control-box">
        </el-row> -->
      </footer>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .title {
    font-size: 20px;
    font-weight: 700;
  }

  header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    // height: 200px;
    background-color: #f5f5f5;
    padding: 20px;
    h2 {
      font-size: 30px;
      font-weight: 500;
    }
    h3 {
      font-size: 20px;
      font-weight: 500;
    }
    span {
      font-size: 18px;
      font-weight: 700;
      &.PROPOSE {
        color: #6ec207;
      }
      &.FEEDBACK {
        color: #6256ca;
      }
      &.SUMMARY {
        color: #ff6600;
      }
      &.CLOSE {
        color: #697565;
      }
    }
  }
  main {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    // height: 200px;
    padding: 20px;
  }
  footer {
    width: 100%;
    min-height: 400px;
    padding: 20px;
    background-color: #f5f5f5;
    .box {
      flex: 1;
      height: 100%;
      background-color: #fff;
      padding: 10px;
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.control-box {
  margin-top: 30px;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  .title {
    font-size: 30px;
    font-weight: 300;
    text-decoration: dashed;
  }
  .refresh-icon {
    cursor: pointer;
    transition: all 0.3s;
    &.is-loading {
      animation: rotate 1s linear infinite;
      cursor: not-allowed;
    }
  }
}
.flex-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.word-cloud-layout {
  margin-top: 30px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 33%);
  grid-gap: 10px;
  // grid-template-rows: repeat(2, 50%);
  background-color: #fff;

  > div {
    position: relative;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #888888;
    &:after {
      content: '';
      display: block;
      padding-top: 100%;
    }
    // 设置内部实际内容的定位
    > * {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
}
.empty-container {
  width: 100%;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
}
</style>
