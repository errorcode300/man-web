<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  font-family: 'Microsoft YaHei', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  /* -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  color: #2c3e50;
  background-color: #F9F9F9;
  min-width: 1000px;
  width: 100%;
}
html, body{
  margin: 0;
}
</style>
