<template>
  <v-alert
    :v-model="activate"
    dismissible
    transition="scale-transition"
    :color="estilo"
    :icon="icono"
  >{{message}}</v-alert>
</template>
<script>
export default {
  name: "Alert",
  props: {
    estilo: {
      type: String,
      required: true
    },
    icono: {
      type: String,
      required: false
    },
    message: {
      type: String,
      required: true
    },
    activate: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {};
  }
};
</script>