<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" absolute temporary :class="color">
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
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        SINAI
        <strong>V1.0</strong>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <!-- 
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
      </v-btn>-->

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>    
    <v-content class="blue-grey lighten-4">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
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
    };
  }
};
</script>
