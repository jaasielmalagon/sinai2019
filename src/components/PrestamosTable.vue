<template>
  <v-container grid-list-md text-xs-center>
    <v-card class="light-blue lighten-5">
      <v-card-title>
        <v-container grid-list-md text-xs-center>
          <v-row>
            <v-col xs12 md4>
              <div class="display-2 font-weight-light">Préstamos</div>
            </v-col>
            <v-col xs12 md8>
              <v-row>
                <v-col xs12 md6>
                  <v-select
                    @change="filtrar($event)"
                    :items="comisionistas"
                    item-text="nombre"
                    :return-object="true"
                    label="Comisionistas"
                    no-data-text="No hay comisionistas"
                  ></v-select>
                </v-col>
                <v-col xs12 md6>
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
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :search="search"
          :loading="loading"
          loading-text="Cargando... espere, por favor."
          class="elevation-1"
          dense
        >
          <template v-slot:item.activo="{ item }">
            <v-chip v-if="!item.activo" color="red" text-color="white">Inactivo</v-chip>
            <v-chip v-if="item.activo" color="green" text-color="white">Activo</v-chip>
          </template>
          <template v-slot:item.opc="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon color="success" @click="$emit('selectItem', item)">
                  <v-icon v-if="opciones == 'normal'">remove_red_eye</v-icon>
                  <v-icon v-if="opciones == 'pagar'">payment</v-icon>
                </v-btn>
              </template>
              <span v-if="opciones == 'normal'">Ver detalles</span>
              <span v-if="opciones == 'pagar'">Realizar pago</span>
            </v-tooltip>
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

      <v-dialog v-model="deleteDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">¿Realmente desea eliminar el elemento seleccionado?</v-card-title>
          <v-card-text>Si lo elimina, la información no podrá ser recuperada.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" @click="deleteDialog = false">No, cancelar</v-btn>
            <v-btn color="green darken-1" @click="confirmDeletion()">Si, eliminar</v-btn>
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
  components: { LoadingDialog },
  props: {
    opciones: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      db: config.db,
      search: "",
      loading: true,
      deleteDialog: false,
      loadingDialog: false,
      prestamo: {
        // key: "",
        solicitud: "",
        tipo: "",
        capital: "",
        tasa: "",
        intereses: "",
        plazo: "",
        comisionista: "",
        pago: "",
        abonos: [] //{ fecha: "", monto: "" }
      },
      headers: [
        {
          text: "Nombre",
          align: "center",
          sortable: true,
          value: "cliente.nombre"
        },
        {
          text: "Ap. paterno",
          align: "center",
          sortable: true,
          value: "cliente.apaterno"
        },
        {
          text: "Ap. materno",
          align: "center",
          sortable: true,
          value: "cliente.amaterno"
        },
        {
          text: "Inicio",
          align: "center",
          sortable: true,
          value: "inicio"
        },
        {
          text: "Capital",
          align: "center",
          sortable: true,
          value: "capital"
        },
        {
          text: "Intereses",
          align: "center",
          sortable: true,
          value: "intereses"
        },
        {
          text: "Monto total",
          align: "center",
          sortable: true,
          value: "montototal"
        },
        {
          text: "Tipo",
          align: "center",
          sortable: true,
          value: "tipo"
        },
        {
          text: "Comisionista",
          align: "center",
          sortable: true,
          value: "cliente.comisionista.nombre"
        },
        {
          text: "Estado",
          align: "center",
          sortable: true,
          value: "activo"
        },
        {
          text: "Opciones",
          align: "center",
          value: "opc",
          sortable: false
        }
      ],
      items: [],
      filteredItems: [],
      comisionistas: []
    };
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
    loadItems(items) {
      // console.log(items);
      this.items = [];
      for (let key in items) {
        // console.log(items[key]);
        // if (items[key].activo == true) {
        this.items.push({
          key: key,
          activo: items[key].activo,
          inicio: items[key].inicio,
          solicitud: items[key].solicitud,
          cliente: items[key].cliente,
          tipo: items[key].tipo,
          capital: items[key].capital,
          tasa: items[key].tasa,
          intereses: items[key].intereses,
          montototal: items[key].capital + items[key].intereses,
          plazo: items[key].plazo,
          comisionista: items[key].comisionista,
          pago: items[key].pago,
          tabla: items[key].tabla
        });
        // }
      }
      // console.log(this.items)
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
  mounted() {
    //CARGAR ITEMS
    this.db
      .ref("/prestamos")
      .orderByKey()
      .on("value", snapshot => {
        this.loadItems(snapshot.val());
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
