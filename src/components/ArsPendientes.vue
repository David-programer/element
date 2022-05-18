<template>
    <div :class="ar == 'blue' ? 'colorBlue ars-pendientes' : 'colorGreen ars-pendientes'">
        <p>{{factura}}</p>
        <p v-text="gv.length <= 1 ? '--' : gv"/>
        <p class="color">{{fecha}}</p>
    </div>
</template>

<script>
export default {
    name: "ars-pendientes",
    props:{
        factura: String,
        gv: String,
        fecha: String,
        ar: String
    }
}
</script>

<style lang="scss" scoped>
    .ars-pendientes{
        display: flex;
        width: 50%;
        padding: 10px;
    }

    .ars-pendientes p{
        width: 100%;
        font-weight: 600;
        text-align: center;
    }

    .ars-pendientes p:nth-child(2){
        text-transform: uppercase;
    }
</style>