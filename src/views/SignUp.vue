<template>
    <div class="container">
        <div class=image>
            <img src="../assets/logo.png">
        </div>
        <div class="form">
            <div v-if="!user.type">
                <h1>Bienvenido</h1>
                <button @click="user.type = 'laboratorio'">LABORATORIO</button>
                <button @click="user.type = 'punto'">PUNTO DE VENTA</button>
                <button @click="user.type = 'admin'">ADMINISTRADOR</button>
            </div>

            <div v-if="user.type">
                <input type="text" v-model="user.name" placeholder="Nombre">
                <input type="text" v-model="user.email" placeholder="Correo">
                <input type="number" v-model="user.phone" placeholder="Teléfono">
                <input type="password" v-model="user.password" placeholder="Contraseña">
                <button @click="createUser()">ENVIAR</button>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
export default {
    name: 'sign-up',
    data: ()=>({
        user: {
            type: null,
            name: null,
            email: null,
            phone: null,
            password: null,
        }
    }),
    methods: {
        createUser(){
        ipcRenderer.send('create-user', this.user);
        ipcRenderer.on('new-user-created',(e, args)=>{
            const userSave = JSON.parse(args);
            localStorage.setItem('registered', 'true');
            localStorage.setItem('id', userSave._id);
            localStorage.setItem('type', this.user.type);
            localStorage.setItem('name', this.user.name);
            alert('Cuenta creada correctamente');
            this.$router.push('/');
        });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #2c3e50;
    }

    .container .image {
        padding: 50px;
        background-color: #2c3e50;
        border-radius: 10px 0px 0 10px;
        box-shadow: -10px 0px 25px rgba($color: #3d3d3d, $alpha: .2);
    }

    .container .image img{
        width: 200px;
        height: 200px;
    }

    .container .form div {
        height: 304px;
        padding: 50px;
        box-shadow: 10px 0px 25px rgba($color: #3d3d3d, $alpha: .2);
        border-radius: 0px 10px 10px 0px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 500px;
        gap: 10px;
    }

    .container .form div button{
        padding: 5px;
        border-radius: 5px;
        border: 1px solid gray;
    }

    .container .form div button:hover{
        cursor: pointer;
        background-color: rgb(213, 213, 213);
    }

    .container .form div input{
        padding: 7px;
        border-radius: 5px;
        border: 1px solid gray;
    }

    .container .form div input:focus{
        outline: none;
    }
</style>