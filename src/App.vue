<template>
  <v-app>
    <navbar></navbar>
    <v-content class="blue-grey lighten-4">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
export default {
  name: "App",
  components: { Navbar },
  data() {
    return {};
  }
};
</script>
