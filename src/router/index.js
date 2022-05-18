import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignUp from '../views/SignUp.vue'
import EditArs from '../views/EditArs.vue'
import Registros  from '../views/Registros.vue'
import Administrar from '../views/Administrar.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sign-up',
    name: 'Sign Up',
    component: SignUp
  },
  ,
  {
    path: '/edit-ars/:fecha',
    props: true,
    name: 'Edit ARS',
    component: EditArs
  },
  {
    path: '/registros',
    name: 'Registros',
    component: Registros
  },
  {
    path: '/administrar',
    name: 'administrar',
    component: Administrar
  },
]

const router = new VueRouter({
  routes
})

export default router
