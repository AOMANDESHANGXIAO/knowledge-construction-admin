<script lang="ts" setup>
import DiscussionAPI, { QueryTopicResult } from '@/apis/discussion'
import useRequest from '@/hooks/useRequest'
import ClassAPI, { QueryAllResult } from '@/apis/class_'
import { useUserStore } from '@/store/modules/user'
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
const ideaContent = ref(
  '没有类型标注时，这个 event 参数会隐式地标注为 any 类型。这也会在 tsconfig.json 中配置了 "strict": true 或 "noImplicitAny": true 时报出一个 TS 错误。因此，建议显式地为事件处理函数的参数标注类型。此外，你在访问 event 上的属性时可能需要使用类型断言'
)
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

const CTGrades: Ref<Record<keyof typeof CTElementsTextMAP, number>> = ref({
  recognition: 0,
  understanding: 0,
  evaluation: 0,
  analysis: 0,
  create: 0,
})
const handleSubmitScore = () => {
  console.log('submit score')
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
        <el-form>
          <el-row :gutter="20">
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
          <!-- <el-popconfirm
            title="你确定要调整话题吗?"
            @confirm="handleNextStatus"
          >
            <template #reference>
              <el-button type="primary" plain>确认调整话题</el-button>
            </template>
          </el-popconfirm> -->
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
        <div class="left-container box">
          <section class="title">⭐批判元素评分</section>
          <el-text><b>已评价/总评价:</b> 5/15 </el-text>
          <el-divider />
          <section class="content">
            <div class="left">
              <div class="title">观点如下</div>
              <div class="idea-content">
                {{ ideaContent }}
              </div>
              <div class="bottom">
                <h4>
                  <span>发布者: 张三</span>&nbsp;&nbsp;<span
                    >所属团队: 团队A</span
                  >
                </h4>
                <section><span>发布时间: 2022-01-01</span></section>
              </div>
            </div>
            <div class="right">
              <el-form>
                <el-form-item
                  v-for="(item, index) in CTElements"
                  :label="CTElementsTextMAP[item]"
                  :key="index"
                >
                  <el-radio-group v-model="CTGrades[item]">
                    <el-radio value="1" size="small" border>包 含</el-radio>
                    <el-radio value="2" size="small" border>不包含</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <el-popconfirm @confirm="handleSubmitScore" title="确定要提交吗?">
                <template #reference>
                  <el-button type="primary" style="width: 100%"
                    >提 交</el-button
                  >
                </template>
              </el-popconfirm>
            </div>
          </section>
        </div>
        <div class="right-container box"></div>
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
    display: flex;
    gap: 20px;
    width: 100%;
    padding: 20px;
    flex: 1;
    background-color: #f5f5f5;
    .box {
      flex: 1;
      height: 100%;
      background-color: #fff;
      padding: 10px;
    }
    .left-container {
      .content {
        display: flex;
        gap: 10px;
        height: 100%;
        .left {
          flex: 1;
          height: 100%;
          // background-color: pink;
        }
        .right {
          flex: 1;
          height: 100%;
          // background-color: pink;
        }
      }
    }
    .right-container {
    }
  }
}
</style>
