<template>
  <div id="app">
    <a-config-provider :locale="zhCN">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default {
  name: 'App',
  data() {
    return {
      zhCN,
    };
  },
  watch: {
    $route: {
      handler(route) {
        if (route.meta && route.meta.title) {
          document.title = route.meta.title;
        } else {
          document.title = 'cx';
        }
      },
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
