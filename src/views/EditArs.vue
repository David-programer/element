<template>
    <div class="container-edit-ars">
        <div class="container-data">
            <div class="nav"> 
                <p>FECHA: {{$route.params.fecha}}</p>
            </div>
            <div v-if="data.length == 0" class="sin-registros">Aún no hay registros</div>
            <div v-if="data.length >= 1" class="container-render-data">
                <p>FACTURA</p> <p>GAVETA</p> <p>INGRESO</p> <p>SALIDA</p> <p>ESTADO</p> <p>&#8505;</p>
                <div v-for="ar in data" :key="ar._id" :class="ar.color == 'blue' ? 'colorBlue item-render-data' : 'colorGreen item-render-data'">
                    <p>{{ar.factura}}</p>
                    <p v-on:keyup="updateAR" :id="ar._id" :class="ar.gaveta.length <= 1 ? 'gaveta-input' : 'gaveta-input-before'" contenteditable>{{ar.gaveta}}</p>
                    <p class="color">{{ar.ingreso}}</p>
                    <p class="color">{{ar.salida}}</p>
                    <p>{{ar.estado}}</p>
                    <p class="color" v-on:click="setInAR" :id="ar._id" style="cursor:pointer;">&#8505;</p>
                </div>
            </div>
        </div>
        <div class="container-panel-control">
            <div v-if="type !== 'laboratorio'">
                <h2>AGREGAR</h2>
                <input id="factura" type="text" placeholder="FACTURA" v-model="registro.factura" autofocus @keypress.enter="createAR()" >
                <select v-model="registro.color">
                    <option selected value="blue" >AR AZUL</option>
                    <option value="green">AR VERDE</option>
                </select>
                <select v-model="registro.laboratorio">
                    <option v-for="(laboratorio, index) in this.laboratorios" :key="index" :value="laboratorio">{{laboratorio}}</option>
                </select>
                <button @click="createAR() ">AGREGAR</button>
            </div>
            <div>
                <h2>BUSCAR</h2>
                <input type="text" placeholder="FACTURA" @keypress.enter="buscarAR()" v-model="buscar" id="buscar">
                <button @click="buscarAR()">BUSACR</button>
                <label v-if="type !== 'laboratorio'"><input type="checkbox" v-model="marcar"> SALIDA</label>
            </div>
            <div>
                <h2>DESCARGAR</h2>
                <button @click="handleDownlad">EXCEL</button>
            </div>
        </div>
        <InformationAR :factura="arRead.factura" :gaveta="arRead.gaveta" :laboratorio="arRead.laboratorio" :color="arRead.color" :salida="arRead.salida" :estado="arRead.estado" :ingreso="arRead.ingreso" :idAR="arRead._id" :tiempo="arRead.tiempo" @estadoCambiado="readARS()"/>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import InformationAR from '../components/InformationAR.vue'
//$event.target.nextElementSibling.focus()
export default {
    beforeCreate(){
        ipcRenderer.send('read-laboratorios');
        ipcRenderer.on('laboratorios-read', (e, args)=>{
            const laboratorios = JSON.parse(args)
            this.laboratorios = laboratorios;
        });
    },
    created(){
        this.readARS();
    },
    data: ()=>({
        data: [],
        registro:{
            factura: null,
            color: null,
            laboratorio: null,
            salida: '--',
            gaveta: '',
            estado: 'Normal',
            tiempo: ''
        },
        buscar: null,
        laboratorios: [],
        marcar : false,
        type: localStorage.getItem('type'),
        arRead: {}
    }),
    methods: {
        readARS(){
            ipcRenderer.send('readerARS', {fecha: this.$route.params.fecha, name: localStorage.getItem('name'), type: localStorage.getItem('type')});
            ipcRenderer.on('ARS-read', (e, args)=>{
            let arsRead = JSON.parse(args);
            this.data = arsRead;
        })},
        createAR(){
            if (this.registro.color && this.registro.factura && this.registro.laboratorio) {
                ipcRenderer.send('create-ar', this.registro);
                ipcRenderer.on('AR-saved', (e, args)=>{
                    this.readARS();
                    this.registro.factura = null
                    document.getElementById('factura').focus();
                })
            }else{
                document.getElementById('factura').focus();
            }
        },
        buscarAR(){
            if(!this.marcar){
                for (const key in this.data) {
                if(this.data[key].factura == this.buscar){
                    console.log(this.data)
                    let arBuscado = this.data[key]
                    this.data = [];
                    this.data.push(arBuscado)
                }
            }
            }else{
                ipcRenderer.send('salida-ar', this.buscar);
                ipcRenderer.on('actualizado',(e, args)=>{
                    this.readARS();
                    this.buscar = null;
                    document.getElementById('buscar').focus();
                })
            }
        },
        updateAR(e){
            ipcRenderer.send('update-ar', {id: e.target.id, asunto: 'gaveta', valor: e.target.textContent})
        },
        setInAR(e){
            ipcRenderer.send('reader-one-ar', e.target.id)
            ipcRenderer.on('read-one-ar', (e, args)=>{
                const arReadRequest = JSON.parse(args);
                this.arRead = arReadRequest;
                this.$store.state.show = true
            });
        },
        handleDownlad(){
            if(this.data.length !== 0){
                ipcRenderer.send('downlad-excel', this.data);
                ipcRenderer.on('informe-descargado', (e, args)=>{
                    return alert('Informe descargado correctamente')
                })
            }else{
                alert('No hay ARS para descargar en formato Excel');
            }
        }
    },
    components: { InformationAR }
}
</script>

<style lang="scss" scoped>
    .container-edit-ars{
        display: grid;
        grid-template-columns: 2fr 280px;
        grid-template-areas: 
            "data control";
    }

    .sin-registros{
        text-align: center;
        font-weight: 600;
    }

    .container-data{
        grid-area: data;
    }

    .container-panel-control{
        grid-area: control;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
        box-shadow: 0 0 15px rgba($color: #666666, $alpha: .5);
        border-top: 1px solid #D6D6D6;
    }

    .container-panel-control div{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .container-panel-control div:first-child{
        margin-top: 50px;
    }

    .container-panel-control div input, .container-panel-control div button, .container-panel-control div select{
        padding: 5px;
        text-align: center;
        font-weight: 600;
        text-transform: uppercase;
    }

    .container-panel-control div button{
        cursor: pointer;
    }

    .container-data .nav{
        padding: 10px;
        border-top: 1px solid #D6D6D6;
    }

    .container-render-data{
        display: grid;
        grid-template-columns: repeat(6, 1fr);
    }

    .container-render-data > p{
        padding: 10px;
        text-align: center;
        background-color: #f3f3f3;
        border-top: 1px solid #D6D6D6;
        font-weight: 600;
    }

    .item-render-data{
        grid-column: span 6;
        grid-row: span 1;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-auto-flow: column;
    }

    .item-render-data p{
        padding: 10px;
        text-align: center;
    }

    .gaveta-input{
        text-transform: uppercase;
    }

    .gaveta-input::before{
        content: '--';
    }

    .gaveta-input:focus::before{
        content: none;
    }

    .container-data{
        text-transform: uppercase;
    }
</style>