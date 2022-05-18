<template>
  <div class="home">

    <div class="actual">
      <h2>INFORME ACTUAL</h2>
      <InformeAR :fecha="hoy.fecha" :enviados="hoy.enviados" :ars="hoy.ars" :pendientes="hoy.pendientes"/>
    </div>

    <div class="arsPendientes">
      <h2>{{ type == 'laboratorio' ? 'ARS AÚN NO ENVIADOS' : 'ARS EN LABORATORIO' }}</h2>
      <div class="tabla-ars-pendientes">
        <ArsPendientes  v-for="item in pendientes" :key="item._id" :factura="item.factura" :gv="item.gaveta" :fecha="item.ingreso" :ar="item.color"/>
      </div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import ArsPendientes from '../components/ArsPendientes.vue'
import InformeAR from '../components/InformeAR.vue'

export default {
  created(){
    this.readInformeActual();
    this.readArsPending();
  },
  name: 'Home',
  data: ()=>({
    hoy: {
      fecha: '',
      enviados: '',
      ars: '',
      pendientes: ''
    },
    pendientes: [],
    type: localStorage.getItem('type')
  }),
  methods: {
    readInformeActual(){
      let fecha = new Date();
      let dia = fecha.getDate(),
        mes = fecha.getMonth() + 1,
        año = fecha.getFullYear();
      ipcRenderer.send('readerARS', {fecha: `${dia}-${mes}-${año}`, name: localStorage.getItem('name'), type: localStorage.getItem('type')});
      ipcRenderer.on('ARS-read', (e, args)=>{
        let arsRead = JSON.parse(args);
        this.hoy.ars = `${arsRead.length}`
        this.hoy.fecha = `${dia}-${mes}-${año}`;
        let count = 0;
        for (const key in arsRead) {
          if(arsRead[key].salida.length >= 3) count += 1
        }
        this.hoy.enviados = `${count}`;
        this.hoy.pendientes = `${this.hoy.ars - this.hoy.enviados}`;
      })
    },
    readArsPending(){
      ipcRenderer.send('read-ars-pending', {name: localStorage.getItem('name'), type: localStorage.getItem('type')});
      ipcRenderer.on('ARS-pending', (e, args)=>{
        const arsPending = JSON.parse(args);
        this.pendientes = arsPending;
      })
    }
  },
  components: { InformeAR,ArsPendientes }
}
</script>

<style lang="scss" scoped>
  .home{
    margin-top: 20px;
    padding: 20px;
  }

  .home h2{
    margin-bottom: 18px;
  }

  .arsPendientes{
    margin-top: 40px;
  }

  .tabla-ars-pendientes{
    display: flex;
    flex-wrap: wrap;
  }
</style>
