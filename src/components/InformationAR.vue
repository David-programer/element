<template>
    <div v-if="$store.state.show" class="information-ar">
        <div class="card-container">
            <p :class="color == 'blue' ? 'color-blue' : 'color-green'">{{factura}}</p>
            <div class="data-ar-one">
                <p><b>Fecha de ingreso:</b> {{ingreso}}</p>
                <p>Fecha de salida: {{salida}}</p>
                <p>Laboratorio: {{laboratorio}}</p>
                <p>Estado: {{estado}}</p>
                <p>{{tiempo}}</p>
                <p>Gaveta: {{gaveta}}</p>
                <p>AR: {{color == 'blue' ? 'Azul' : 'Verde'}}</p>
            </div>
            <hr>
            <div class="card-actions">
                <select @change="setEstado" v-model="newEstado">
                    <option value="Normal">Normal</option>
                    <option value="Talla">Talla</option>
                    <option value="Poros">Poros</option>
                    <option value="Rayado">Rayado</option>
                    <option value="Manchado">Manchado</option>
                    <option value="Trocados">Trocados</option>
                    <option value="Desprendido">Desprendido</option>
                    <option value="Recomendado">Recomendado</option>
                    <option value="Transitions">Transitions</option>
                    <option value="Ovations">Ovations</option>
                    <option value="Ovations AR">Ovations AR</option>
                    <option value="Ovations Talla">Ovations Talla</option>
                </select>
                <button @click="$store.state.show = false">CERRAR</button>
            </div>  
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';
export default {
    data: ()=>({
        newEstado: 'Normal'
    }),
    props:{
        idAR: null,
        factura: null,
        gaveta: null,
        laboratorio: null,
        color: null,
        salida: null,
        estado: null,
        ingreso: null,
        tiempo: null
    },
    methods: {
        setEstado(){
            ipcRenderer.send('update-ar', {id: this.idAR, asunto: 'estado', valor:this.newEstado });
            if(this.salida.length >= 3){
                ipcRenderer.send('update-ar', {id: this.idAR, asunto: 'tiempo', valor:'Después del proceso' })
            }else{
                ipcRenderer.send('update-ar', {id: this.idAR, asunto: 'tiempo', valor:'Antes del proceso' })
            }
            this.$store.state.show = false;
            this.$emit('estadoCambiado')
            this.newEstado = 'Normal'
        }
    }
}
</script>

<style lang="scss" scoped>
    .information-ar{
        position: fixed;
        width: 100vw;
        height: 100vh;
        background-color: rgba($color: #000000, $alpha: .5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .card-container{
        width: 400px;
        padding: 30px;
        border-radius: 10px;
        background-color: white;
    }

    .card-container > p:first-child{
        font-weight: 600;
        font-size: 25px;
        text-align: center;
        padding: 5px;
    }

    .card-container .data-ar-one p{
        padding: 3px 0;
    }

    .card-container .data-ar-one{
        margin: 20px 0px 20px 20px;
    }

    .color-blue{
        color: #3CD1F1;
        background-color: #d9f8ff;
        border: 1px solid #9dedff;
    }

    .color-green{
        color: #9CC881;
        background-color: #e3ffd1;
        border: 1px solid #bdff94;
    }

    .card-actions{
        display: flex;
        margin-top: 10px;
        align-items: center;
        justify-content: flex-end;
        gap: calc(50% - 32px);
    }

    .card-actions button{
        padding: 10px;
        cursor: pointer;
        background-color: white;
        border: none;
        color: gray;
        font-weight: 600;
    }

    .card-actions button:hover{
        background-color: rgb(230, 230, 230);
    }

    .card-actions select{
        border: none;
        padding: 10px;
        font-size: 15px;
    }
</style>