<template>
  <div id="app">
    <nav-bar v-if="$route.name !== 'Sign Up' && $route.name !== 'Edit ARS' "/>
    <router-view/>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
var { ipcRenderer } = require('electron');

export default {
  beforeCreate(){
    localStorage.getItem('registered') ? "" : localStorage.setItem('registered', 'false');
    localStorage.getItem('registered') == 'true' ? "" :this.$router.push('/sign-up');
  },
  mounted(){
    ipcRenderer.on('goToHome', ()=>{
      this.$router.push('/')
    });

    ipcRenderer.on('goToRegistros', ()=>{
      this.$router.push('/registros')
    });
  },
  components: { NavBar }
}
</script>

<style lang="scss">
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }

  body{
    overflow-y: none;
  }

  #app {
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .colorBlue{
    background-color: #EEFCFF;
    border: 1px solid #BDF2FE
  }

  .colorGreen{
    background-color: #F1FFE9;
    border: 1px solid #D5FFBC;
  }

  .colorBlue .color{
    color: #3CD1F1;
  }

  .colorGreen .color{
    color: #9CC881;
  }
</style>
