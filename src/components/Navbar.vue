<template>
  <div>
    <v-navigation-drawer
      app
      v-model="drawer"
      absolute
      temporary
      :class="color"
      v-if="user.loggedIn"
    >
      <v-list nav dense>
        <v-list-item-group :v-model="null" active-class="deep-purple--text text--accent-4">
          <v-list-item v-for="(item, i) in items" :key="i" router :to="item.url">
            <v-list-item-title>
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app :color="color" dense dark>
      <v-app-bar-nav-icon v-if="user.loggedIn" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        SINAI
        <strong>V1.0</strong>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu v-if="user.loggedIn" left bottom>
        <template v-slot:activator="{ on }">
          <!-- <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>-->
          <v-row align="center" justify="end" no-gutters>
            <v-col class="hidden-xs-only" :cols="nameCols">
              <span v-if="user.data.displayName != null">{{user.data.displayName}}</span>
              <span v-else>{{user.data.email}}</span>
            </v-col>
            <v-col cols="1">
              <v-avatar v-if="user.data.photoURL != null" size="30px" v-on="on">
                <img :src="user.data.photoURL" :alt="user.data.displayName" />
              </v-avatar>
              <v-avatar v-else size="30px" color="#0051A0" v-on="on">
                <v-icon dark>mdi-account-circle</v-icon>
              </v-avatar>
            </v-col>
          </v-row>
        </template>

        <v-list>
          <v-list-item @click="logout()">
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>
<script>
import config from "../config";
import { mapGetters } from "vuex";
export default {
  name: "Navbar",
  data() {
    return {
      auth: config.auth,
      color: "#0051A0",
      // color: "brown lighten-5",
      drawer: false,
      items: [
        { title: "Prestamos", icon: "attach_money", url: "/prestamos" },
        { title: "Clientes", icon: "person_pin", url: "/clientes" },
        { title: "Pagos", icon: "payment", url: "/pagos" },
        {
          title: "Supervisores",
          icon: "supervisor_account",
          url: "/supervisores"
        },
        {
          title: "Control de gastos",
          icon: "trending_up",
          url: "/gastos"
        },
        {
          title: "Control de depositos",
          icon: "local_atm",
          url: "/depositos"
        },
        { title: "Nomina", icon: "payment", url: "/nomina" }
      ],
      mini: false,
      right: null
      // user: {
      //   uid: null,
      //   displayName: null,
      //   photoURL: null,
      //   email: null,
      //   phoneNumber: null
      // }
    };
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "user"
    }),
    nameCols() {
      if (typeof this.user.displayName != undefined && this.user.displayName != null) {
        let partes = this.user.displayName.split(" ");
        console.log(partes);
        if (partes.lenght == 3) {
          return 3;
        } else {
          return 2;
        }
      }else{
        return 2;
      }
    }
  },
  methods: {
    logout() {
      this.auth.signOut().then(() => {
        this.$router.replace({
          name: "login"
        });
      });
    }
  }
};
</script>