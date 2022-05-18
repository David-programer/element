<template>
    <div class="nav">
        <img src="../assets/logo_lentes.jpg" @click="$router.push('/')">
        <h1>{{name}}</h1>
        <button v-if="type == 'admin'" @click="$router.push('/administrar')">ADMINISTRAR</button>
    </div>
</template>

<script>
export default {
    name: "navbar",
    data: ()=>({
        name: localStorage.getItem('name'),
        type: localStorage.getItem('type'),
    })
}
</script>

<style scoped lang="scss">
    .nav{
        display: flex;
        align-items: center;
        width: 100vw;
        height: 5rem;
        box-shadow: 0px 6px 8px rgba($color: #6b6b6b, $alpha: .3);
    }

    .nav img{
        height: 100%;
    }

    .nav h1{
        text-transform: uppercase;
        width: 100%;
        text-align: center;
    }

    .nav button{
        margin-right: 30px;
        padding: 10px;
        cursor: pointer;
    }
</style>

