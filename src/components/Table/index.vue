<script lang="ts" setup>
// import { ElTable, ElPagination } from 'element-plus'
defineOptions({
  name: 'my-table',
})
interface ElTableColumnOptions {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
}

const props = defineProps<{
  columns: ElTableColumnOptions[]
  totalNum: number
  pageSize: number
  currentPage: number
}>()

const emits = defineEmits([
  'update:pageSize',
  'update:currentPage',
  'update:totalNum',
])

const pageSizeValue = ref(props.pageSize)
const currentPageValue = ref(props.currentPage)
const totalNumValue = ref(props.totalNum)

watch(
  () => props.pageSize,
  val => {
    pageSizeValue.value = val
  }
)

watch(
  () => props.totalNum,
  val => {
    totalNumValue.value = val
  }
)

watch(
  () => props.currentPage,
  val => {
    currentPageValue.value = val
  }
)

watch(
  () => pageSizeValue.value,
  val => {
    emits('update:pageSize', val)
  }
)
watch(
  () => currentPageValue.value,
  val => {
    emits('update:currentPage', val)
  }
)
watch(
  () => totalNumValue.value,
  val => {
    emits('update:totalNum', val)
  }
)

const elTableRef = ref()
const elPaginationRef = ref()
defineExpose({
  elTableRef,
  elPaginationRef,
})
</script>

<template>
  <el-scrollbar style="width:100%;height: 90%;max-height:700px">
    <el-table
      v-bind="$attrs"
      style="width: 100%"
      stripe
      border
      ref="elTableRef"
    >
      <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
        <slot :name="slotName" v-bind="slotProps"> </slot>
      </template>
      <el-table-column type="index" width="50" />
      <el-table-column
        v-for="col in props.columns"
        :key="col.prop"
        v-bind="col"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      ref="elPaginationRef"
      style="margin-top: 10px"
      background
      v-bind="$attrs"
      layout="prev, pager, next"
      v-model:total="totalNumValue"
      v-model:page-size="pageSizeValue"
      v-model:current-page="currentPageValue"
    >
    </el-pagination>
  </el-scrollbar>
</template>

<style lang="scss" scoped></style>
