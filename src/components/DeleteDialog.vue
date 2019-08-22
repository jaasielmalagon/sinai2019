<template>
    <v-dialog v-model="activator" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">¿Realmente desea eliminar el elemento seleccionado?</v-card-title>
        <v-card-text>Si lo elimina, la información no podrá ser recuperada.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click="ac = false">No, cancelar</v-btn>
          <v-btn color="green darken-1" flat @click="confirmDeletion(props.item.key)">Si, eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: "DeleteDialog",  
  props: ["activator"],
  data() {
    return {};
  }
};
</script>

