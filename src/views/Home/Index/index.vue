<script lang="ts" setup>
import {ChatLineRound, Coffee, DataLine, Document, Location, Notification, Setting} from "@element-plus/icons-vue";
import {useCssVar} from "@vueuse/core";
import {useRouter, useRoute} from 'vue-router'

defineOptions({
  name: 'homeIndex',
})
const coolBlack = useCssVar('--st-cool-black-color')


// 根据当前的路由确定el-menu-item的激活状态
const router = useRouter()

const defaultActive = computed(() => {
  // 获取当前的路由的path
  return router.currentRoute.value.path
})

const route = useRoute()
</script>

<template>
  <el-row class="st-home-container">
    <div class="menu-tab">
      <div class="title">思维之流</div>
      <el-menu class="st-home-menu" active-text-color="#fff" :background-color="coolBlack" text-color="#fff" router
               :default-active="defaultActive">
        <el-menu-item index="/home/class">
          <section class="st-menu-item">
            <el-icon>
              <Notification/>
            </el-icon>
            <span>班级管理</span>
          </section>
        </el-menu-item>
        <el-menu-item index="/home/discuss">
          <section class="st-menu-item">
            <el-icon>
              <ChatLineRound/>
            </el-icon>
            <span>讨论管理</span>
          </section>
        </el-menu-item>
        <el-menu-item index="/home/analysis">
          <section class="st-menu-item">
            <el-icon>
              <DataLine/>
            </el-icon>
            <span>学习分析</span>
          </section>
        </el-menu-item>
        <el-menu-item index="/home/admin">
          <section class="st-menu-item">
            <el-icon>
              <Coffee/>
            </el-icon>
            <span>管理员</span>
          </section>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="router-container">
      <router-view :key="route.path"/>
    </div>
  </el-row>
</template>

<style lang="scss" scoped>
.st-home-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  //background-color: #888888;

  .menu-tab {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 150px;

    .title {
      width: 100%;
      height: 50px;
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      line-height: 50px;
      background-color: var(--st-cool-black-color);
    }
  }

  .router-container {
    flex: 1;
    height: 100%;
  }

  .st-home-menu {
    height: 100%;

    .st-menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    &:deep(.el-menu-item) {
      padding: 0;

      &:hover {
        background-color: var(--st-theme-color);
      }
    }

    &:deep(.el-menu-item.is-active) {
      background-color: var(--st-theme-color);
    }
  }
}
</style>
