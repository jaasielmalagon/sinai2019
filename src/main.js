import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import router from './router'
// import config from "./config";

Vue.config.productionTip = false
Vue.use(Vuetify)
new Vue({
    vuetify,
    router,
    // config,
    render: h => h(App)
}).$mount('#app')