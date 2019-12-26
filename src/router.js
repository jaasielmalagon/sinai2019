import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'
import NotFound from './views/NotFound'
import Prestamos from './views/Prestamos'
import Clientes from './views/Clientes'
import Pagos from './views/Pagos'
import Gastos from './views/Gastos'
Vue.use(Router);
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/gastos',
            name: 'gastos',
            component: Gastos,
            // beforeEnter: user.uid != null
        }, {
            path: '/pagos',
            name: 'pagos',
            component: Pagos,
            // beforeEnter: user != null
        },
        // {
        //     path: '/cierrediario',
        //     name: 'cierre-diario',
        //     component: CierreDiario,
        //     // beforeEnter: guestUser
        // },
        {
            path: '/login',
            name: 'login',
            component: Login,
            // beforeEnter: user.uid == null
        },
        {
            path: '/',
            name: 'home',
            component: Login,
            // beforeEnter: user.uid == null
        },
        {
            path: '/prestamos',
            name: 'prestamos',
            component: Prestamos
        },
        {
            path: '/clientes',
            name: 'clientes',
            component: Clientes
        },
        { path: '*', component: NotFound }
    ]
})