import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader
import store from "./store";
import router from './router';
import config from "./config";
config.auth.onAuthStateChanged(user => {
    store.dispatch("fetchUser", user);
});
Vue.config.productionTip = false
Vue.use(Vuetify)
new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')