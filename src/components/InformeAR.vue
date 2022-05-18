<template>
    <div class="container-informe" @click="$router.push(`/edit-ars/${fecha}`)">
        <p>FECHA: {{fecha}}</p>
        <p>ARS: {{ars}}</p>
        <p>ENVIADOS: {{enviados}}</p>
        <p :class="pendientes == 0 ? 'pendientes-disabled' : ''">PENDIENTES: {{pendientes}}</p>
    </div>
</template>

<script>
export default {
    name: "informe-ar",
    props: {
        fecha: String,
        ars: String,
        enviados: String,
        pendientes: String
    }
}
</script>

<style lang="scss" scoped>
    .container-informe{
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: #f3f3f3;
        border: 1px solid #D6D6D6;
    }

    .container-informe:hover{
        cursor: pointer;
        background-color: #D6D6D6;
    }

    .container-informe p{
        font-weight: 600;
        width: 100%;
        text-align: right;
    }

    .container-informe p:nth-child(1){
        text-align: left;
    }

    .container-informe p:nth-child(3){
        color: #9CC881;
    }

    .container-informe p:nth-child(4){
        color: #E86100;
        margin-right: 20px;
    }

    .pendientes-disabled{
        color: gray !important;
    }
</style>