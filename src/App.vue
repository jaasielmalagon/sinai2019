<template>
  <v-app>
    <v-navigation-drawer
      v-if="user.uid != null"
      app
      v-model="drawer"
      absolute
      temporary
      :class="color"
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
      <v-app-bar-nav-icon v-if="user.uid != null" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        SINAI
        <strong>V1.0</strong>
      </v-toolbar-title>
      <!-- <v-img
        width="80"
        height="40"
        :src="require('@/assets/sinai-small.png')"        
      ></v-img>-->
      <!-- src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAMAAAD0WI85AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRFutOmE1idqsPbR3ux5O7bAEaY6/Llor/aOHKsAEialbxz9vnzX58oXqAms8jeus3hlbPR+fv80+PFAFKg4uvygbFYyt261eHtVZgdM22pdJvD9vn7XJ0nAEqcVZka7PL3WZ0hbJbAobvW0d7qAEmXYJ8na6M78PbrydnpJGOkpsHb+vz5GVygaZO/UpYZxNqxnLnUDlScAE2fS4C1AEWWQXeu2eTuWJ0emb94fKHHZZC9/P3+3enSAE+fV5kfU4S0g6XJ5u3z3efwvtHjkrHQydjmibZjAFKfsc6Z2OPuo8WF7vPoYo264+vyAlCgv9aqXaAo8PT4cqhEz9zq+Pv2zNroPHaw6vD1AUyYmLbTAEyeWJoh7vP3fa1S6O708/b6AFCi+vz9U5kZqcmOeaxNLWimjq3NZaA0hKnL1eDrh6jJ3ObvwtPk+Pr8NXCr/f78TpYU8vb5XY27EU+XWYi3AEGRL2uprsqTxdblWp8jVpweADyO4OvWc6ZDkbpteJ3D2ObMAE6fjblpBU2YttGfWpslYZ8tiKrMAFKi1ePIwNLiWYy58/f6ZJ4z8/fwAE2c/P37XJ4ixNbor8bcWIm4jrZpAE+cHWCiAEGW/f38KGakAESSXYq4U5kcyNblBlKepcaJIl+iXKAmAlKgdalIAlCiUJgXAlKeKWWfbaU/Bk+adJ3HWoa3aKI36PDgAEeb2ujOnsJ/Xo6+yNjnWp8iAlKjV4q78fX5A1Gfh7RgC1GYyNy2i6zOf6TIXZ8jOnGlUIa6jLhnzNvrAFGjAU+bAFGg////AVGgAFGhAVGh/v///f7+/v7+/v7//v/+AFCgAE+h///+/v79AVCg09/rAVKf7/T4AVChUZMXAlGekLLSb5jCkLDO5uzyx9foqMDZ4OnxYZC+CFWhWpcprsfgJWaoKGimCVGdcpjBpsiON3KkA0eTeJ/HdadKfq9UAD+RXI270OHCXIu9VZsbjq7Pzd++AU+fi67KjKrJt8vfAkuaX5wqAESYVoi2w9Tj////+TvAJgAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAABPuSURBVHja7Fp7XFRl3hfwCAdnEDyag3AGhMFLQMoAokxgijVecbyCAxGgbpnipTdsQbMmIsklgXXzhlSCl8R0aoXELm6Fcy6IAuapZl2Tdt+y963Xaid9k9zO/p4zM2dmmAGGCpcPn35/MIcz53nm+T6/2/f3e84gfkAINXfQwAAyZNzAALLjaX5AAFk/aO/AADJoLj8ggLw+kR8QQIa+eHFAAKG2nuAHBJAb/8MPCCBDj0YOCCBtL77NDwggw59sHhBAIv+xhe9/QKiLey9SvRsy5/SF/gaEGjrxmUVjF22dOLQXg058MoTvZ0CWrCjOTagIrkiQF6+IdHdQ88EpfP8CQn33nEkqlQiiMR0f7G4K+WRc/wJS/kZunUQiLTDJkyvgsyL5O/e0WDyH71dAhq40wfKrTUcXvL5gkalaopHI3nZn3Kx7xvUrIOPGJkg00oTgietRabEgo0CiqZa5oZMdsjl8fwIy97kEjURauNK6uydeCJVWVyf36Cdtb9gr5D8PZNxzyC3kU8ptdx6uk2jqHu4pDJ/YMIfvR0B2HE+AQFX1RJu9jn4Mlmoy3r/Q7cDzWw/P7UdAljyZUC3V5D7b5HB3cEa1RCKb2O3ILRumtPUfIOUjCyVSSe6znYnJXTKpRJMxt5uRTSPvOcH3GyAXfJORf8xqc0qQr5g0kozTzd3U6Rvep/oNkKZZMtCHfIULoli+MhQQ3uhy6PqV92zh+w2QG7IIqcTke95lUM7QSOue6zJyDT98/WK/AYJcWlp4utz1t2/Lq6WmOV0p5ODh4Xx/AbLj4TqpNPTgkq78Z2uhRNNVWrxxz9jy/gKk/DokkIoXdtjfCwgbNkIlMrAXCqShrv29fFHuAr7vgFBLBt87eOgFNx9+pQrobrEYQoOuwJ+/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" -->
      <!-- <v-toolbar-title>
        <strong>V1.0</strong>
      </v-toolbar-title>-->
      <v-spacer></v-spacer>
      <!-- 
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
      </v-btn>-->

      <v-menu v-if="user.uid != null" left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>         
          <v-list-item @click="logout()">
            <v-list-item-title>Cerrar sesión</v-list-item-title>
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
      right: null,
      user: {
        uid: null,
        displayName: null,
        photoURL: null,
        email: null,
        phoneNumber: null
      }
    };
  },
  methods: {
    logout() {
      this.auth.signOut();
      localStorage.clear();
    }
  },
  mounted() {
    if (localStorage.getItem("user")) {      
      this.user = JSON.parse(localStorage.getItem("user"));
      console.log(this.user);
    }
  }
};
</script>
