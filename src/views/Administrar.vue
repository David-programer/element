<template>
    <div class="container-admin">
        <div class="nav-admin">
            <button v-for="user in users" :key="user._id" @click="readUserComplete(user.name)">{{user.name}}</button>
        </div>
        <div v-if="userMoment.name" class="informacion-user">
            <div>
                <h2>INFORME</h2>
                <InformeAR :fecha="hoy.fecha" :enviados="hoy.enviados" :ars="hoy.ars" :pendientes="hoy.pendientes"/>
            </div>

            <div v-if="pendientes.length >= 1 && userMoment.type !== 'punto'">
                <h2>ARS EN ESTE LABORATORIO</h2>
                <div class="tabla-ars-pendientes">
                    <ArsPendientes  v-for="item in pendientes" :key="item._id" :factura="item.factura" :gv="item.gaveta" :fecha="item.ingreso" :ar="item.color"/>
                </div>
            </div>

            <div>
                <h2>INFORMACIÓN PERSONAL</h2>
                <p>Nombre: {{userMoment.name}}</p>
                <p>Correo: {{userMoment.email}}</p>
                <p>Teléfono: {{userMoment.phone}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import InformeAR from '../components/InformeAR.vue'
import ArsPendientes from '../components/ArsPendientes.vue'
const { ipcRenderer } = require('electron');

export default {
    beforeCreate(){
        ipcRenderer.send('read-users');
        ipcRenderer.on('users-read', (e, args)=>{
            const users = JSON.parse(args)
            this.users = users;
        });
    },
    data: ()=>({
        users : [],
        userMoment: {},
        hoy: {
            fecha: '',
            enviados: '',
            ars: '',
            pendientes: ''
        },
        pendientes: [],
    }),
    methods: {
        readUserComplete(name){
            for (const key in this.users) {
                if(this.users[key].name == name){
                    this.userMoment = this.users[key]
                }
            }
            this.readInformeActual(name, this.userMoment.type);
            this.readArsPending(name, this.userMoment.type);
        },    
        readInformeActual(name, type){
            let fecha = new Date();
            let dia = fecha.getDate(),
                mes = fecha.getMonth() + 1,
                año = fecha.getFullYear();
            ipcRenderer.send('readerARS', {fecha: `${dia}-${mes}-${año}`, name, type});
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
        readArsPending(name, type){
            ipcRenderer.send('read-ars-pending', {name, type});
            ipcRenderer.on('ARS-pending', (e, args)=>{
            const arsPending = JSON.parse(args);
            this.pendientes = arsPending;
        })
        },
    },
    components:{ InformeAR, ArsPendientes}
}
</script>

<style lang="scss" scoped>
    .container-admin{
        display: grid;
        grid-template-columns: 250px 2fr;
    }
    .nav-admin{
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 30px;
        height: calc(100vh - 80px);
        border-right: 1px solid lightgrey;
    }

    .nav-admin button{
        text-transform: uppercase;
        padding: 5px;
        cursor: pointer;
    }

    .tabla-ars-pendientes{
        display: flex;
        flex-wrap: wrap;
    }

    .informacion-user{
        padding: 30px;
        display: flex;
        gap: 30px;
        flex-direction: column;
    }

    .informacion-user div h2{
        margin-bottom: 10px;
    }
</style>