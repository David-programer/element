<template>
    <div>
        <InformeAR v-for="(AR, index) in ARS" :key="index" :fecha="index" :enviados="AR.enviados" :ars="AR.ars" :pendientes="AR.pendientes" />
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import InformeAR from '../components/InformeAR.vue';

export default {
    beforeCreate(){
        ipcRenderer.send('all-ars', {type:  localStorage.getItem('type'), name: localStorage.getItem('name')});
        ipcRenderer.on('res-all-ars', (e, args)=>{
            const allARS = JSON.parse(args);
            this.ARS = allARS;
        });
    },
    components:{ InformeAR },
    data: ()=>({
        ARS: []
    })
}
</script>