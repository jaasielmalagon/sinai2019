<template>
  <v-container fluid>
    <v-card class="light-blue lighten-5">
      <v-card-title>
        <v-container fluid>
          <v-row no-gutters>
            <v-col cols="12" xs="12" md="4">
              <div class="display-2 font-weight-light">Clientes</div>
            </v-col>
            <v-col cols="12" xs="12" md="8">
              <v-row no-gutters>
                <v-col cols="12" xs="12" md="4">
                  <v-select
                    @change="filtrar($event)"
                    :items="comisionistas"
                    item-text="nombre"
                    :return-object="true"
                    label="Comisionistas"
                    no-data-text="No hay comisionistas"
                  ></v-select>
                </v-col>
                <v-col cols="12" xs="12" md="6" offset-md="1">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>
      <v-card-text style="padding: 0">
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :search="search"
          :loading="loading"
          loading-text="Cargando... espere, por favor."
          class="elevation-1"
          :items-per-page="5"
        >
          <template v-slot:item.opc="{ item }" v-if="options == 1">
            <v-icon
              @click="$emit('editClient', item)"
              small
              class="mr-2"
              dark
              color="light-blue accent-3"
            >edit</v-icon>
            <v-icon @click="deleteItem(item)" small dark color="red lighten-1">delete</v-icon>
          </template>
          <template v-slot:item.opc="{ item }" v-else>
            <v-icon
              @click="$emit('selectClient', item)"
              small
              class="mr-2"
              dark
              color="light-blue accent-3"
            >check</v-icon>
          </template>
          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">
              El parámetro buscado
              <strong>"{{search}}"</strong> no generó resultados.
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
      <loading-dialog :activator="loadingDialog"></loading-dialog>

      <v-dialog v-if="options == 1" v-model="deleteDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">¿Realmente desea eliminar el elemento seleccionado?</v-card-title>
          <v-card-text>Si lo elimina, la información no podrá ser recuperada.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" flat @click="deleteDialog = false">No, cancelar</v-btn>
            <v-btn color="green darken-1" flat @click="confirmDeletion()">Si, eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import config from "../config";
import LoadingDialog from "./LoadingDialog";
export default {
  name: "ClientesTable",
  components: { LoadingDialog },
  props: {
    options: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      db: config.db,
      search: "",
      isMobile: false,
      loading: true,
      deleteDialog: false,
      loadingDialog: false,
      selectedItem: {
        key: "",
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: "",
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: 1,
        comisionista: ""
      },
      headers: [
        { text: "ID", align: "center", sortable: true, value: "key" },
        {
          text: "Nombre",
          align: "center",
          sortable: true,
          value: "nombre"
        },
        {
          text: "Ap. paterno",
          align: "center",
          sortable: true,
          value: "apaterno"
        },
        {
          text: "Ap. materno",
          align: "center",
          sortable: true,
          value: "amaterno"
        },
        { text: "Curp", align: "center", sortable: true, value: "curp" },
        {
          text: "OCR",
          align: "center",
          sortable: true,
          value: "ocr"
        },
        {
          text: "Dirección",
          align: "center",
          sortable: true,
          value: "direccion"
        },
        {
          text: "Teléfono",
          align: "center",
          sortable: true,
          value: "telefono"
        },
        // { text: "Entidad", align: "center", sortable: true, value: "estado" },
        // { text: "Tipo", align: "center", value: "pagar" },
        { text: "Opciones", align: "center", value: "opc" }
      ],
      items: [],
      filteredItems: [],
      comisionistas: []
    };
  },
  mounted: function() {
    // this.cargarDatos();
  },
  methods: {
    deleteItem(item) {
      // this.editedIndex = this.teams.indexOf(item);
      this.selectedItem = item;
      this.deleteDialog = true;
    },
    confirmDeletion() {
      this.deleteDialog = false;
      this.loadingDialog = true;
      this.db
        .ref("/personas/" + this.selectedItem.key)
        .update({
          activo: 0
        })
        .then(() => {
          this.loadingDialog = false;
        });
    },
    cargarPersonas(items) {
      this.items = [];
      for (let key in items) {
        // console.log(items[key]);
        if (items[key].activo == 1) {
          this.items.push({
            key: key,
            nombre: items[key].nombre,
            apaterno: items[key].apaterno,
            amaterno: items[key].amaterno,
            bornDate: items[key].bornDate,
            sexo: items[key].sexo,
            curp: items[key].curp,
            ocr: items[key].ocr,
            direccion: items[key].direccion,
            telefono: items[key].telefono,
            entidad: items[key].entidad,
            tipo: items[key].tipo,
            comisionista: items[key].comisionista
          });
        }
      }
      this.items.reverse();
      this.filteredItems = this.items;
    },
    filtrar(comisionista) {
      this.filteredItems = this.items;
      if (comisionista.id !== 0) {
        let items = this.filteredItems.filter(function(item) {
          return item.comisionista.id === comisionista.id;
        });
        this.filteredItems = items;
      }
    }
  },
  created() {
    //CARGAR PERSONAS
    this.db
      .ref("/personas")
      .orderByChild("tipo")
      .equalTo(1)
      .on("value", snapshot => {
        this.cargarPersonas(snapshot.val());
        this.loading = false;
      });
    //CARGAR COMISIONISTAS
    this.db.ref("/empleados").on("value", snapshot => {
      this.comisionistas = [];
      let items = snapshot.val();
      for (let key in items) {
        this.comisionistas.push(items[key]);
      }
    });
  }
};
</script>

<style>
.mobile {
  color: #333;
}

@media screen and (max-width: 768px) {
  .mobile table.v-table tr {
    max-width: 100%;
    position: relative;
    display: block;
  }

  .mobile table.v-table tr:nth-child(odd) {
    border-left: 6px solid deeppink;
  }

  .mobile table.v-table tr:nth-child(even) {
    border-left: 6px solid cyan;
  }

  .mobile table.v-table tr td {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    height: auto;
    padding: 10px;
  }

  .mobile table.v-table tr td ul li:before {
    content: attr(data-label);
    padding-right: 0.5em;
    text-align: left;
    display: block;
    color: #999;
  }
  .v-datatable__actions__select {
    width: 50%;
    margin: 0px;
    justify-content: flex-start;
  }
  .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
    background: transparent;
  }
}
.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.flex-item {
  padding: 5px;
  width: 50%;
  height: 40px;
  font-weight: bold;
}
</style>
