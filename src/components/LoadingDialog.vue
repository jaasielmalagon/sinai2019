<template>
  <v-dialog v-model="activator" hide-overlay persistent width="300">
    <v-card color="primary" dark>
      <v-card-text>
        Procesando petición, por favor espere...
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "LoadingDialog",  
  props: ["activator"],
  data() {
    return {};
  }
};
</script>
