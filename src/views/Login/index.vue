<script lang="ts" setup>
defineOptions({
  name: 'index',
})
</script>

<template>
  <div class="st-login-container">
    <div class="login-form-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.st-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  .login-form-container {
    padding: 20px 20px 50px 50px;
    width: 400px;
    height: 400px;
    border-radius: 10px;
    box-shadow: 0 0 0 1px var(--st-theme-color);
  }
}
</style>
