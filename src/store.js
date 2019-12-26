import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            data: null,
            permisos: null
        }
    },
    getters: {
        user(state) {
            return state.user
        }
    },
    mutations: {
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        },
        SET_PERMISOS(state, value) {
            state.user.permisos = value;
        },
    },
    actions: {
        fetchUser({ commit }, user) {
            commit("SET_LOGGED_IN", user !== null);
            if (user) {
                commit("SET_USER", {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                });
            } else {
                commit("SET_USER", null);
            }
        },
        fetchPermisos({ commit }, permisos) {
            if (permisos) {
                commit("SET_PERMISOS", permisos);
            } else {
                commit("SET_PERMISOS", null);
            }
        }
    }
});