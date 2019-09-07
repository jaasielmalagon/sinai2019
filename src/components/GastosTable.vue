<template>
  <v-container grid-list-md text-xs-center>
    <v-card class="light-blue lighten-5">
      <v-card-title>
        <v-container grid-list-md text-xs-center>
          <v-row>
            <v-col xs12 md4>
              <div class="display-2 font-weight-light">Control de gastos</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col xs12>
              <v-card flat elevation="1" class="light-blue lighten-5">
                <v-card-title>
                  Filtrar por:
                  <v-tooltip left v-if="search.length > 0 || (since != '' && until != '')">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click="clearSearch"
                        v-on="on"
                        absolute
                        dark
                        fab
                        top
                        right
                        color="#0051A0"
                      >
                        <v-icon>refresh</v-icon>
                      </v-btn>
                    </template>
                    <span>Mostrar todos los registros</span>
                  </v-tooltip>
                </v-card-title>
                <v-card-text>
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-header v-slot="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4">Buscar por periodo</v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open">Seleccione el periodo que desea ver</span>
                              <v-row v-else no-gutters style="width: 100%">
                                <v-col cols="5">
                                  Desde el:
                                  <strong>{{ since || 'No establecido' }}</strong>
                                </v-col>
                                <v-col cols="5">
                                  Hasta el:
                                  <strong>{{ until || 'No establecido' }}</strong>
                                </v-col>
                              </v-row>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row justify="space-around" no-gutters>
                          <v-col cols="3">
                            <v-menu
                              ref="sincemenu"
                              v-model="sincemenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              full-width
                              min-width="100px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field v-model="since" label="Desde..." readonly v-on="on"></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="since"
                                ref="picker"
                                :max="maxDate"
                                min="2018-01-01"
                                @change="sinceDate"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>

                          <v-col cols="3">
                            <v-menu
                              ref="untilmenu"
                              v-model="untilmenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              full-width
                              min-width="100px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field v-model="until" label="Hasta..." readonly v-on="on"></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="until"
                                ref="picker"
                                :max="maxDate"
                                min="2018-01-01"
                                @change="untilDate"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-row>
                    <v-col xs12>
                      <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Buscar en la tabla"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :loading="loading"
          loading-text="Cargando... espere, por favor."
          class="elevation-1"
        >
          <template v-slot:item.monto="{ item }">
            <!-- <td class="text-right"> -->
            <strong>$</strong>
            {{item.monto.toFixed(2)}}
            <!-- </td> -->
          </template>
          <template v-slot:item.opciones="{ item }">
            <v-icon @click="deleteItem(item)" small dark color="red lighten-1">delete</v-icon>
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
            <v-btn color="red darken-1" text @click="deleteDialog = false">No, cancelar</v-btn>
            <v-btn color="green darken-1" text @click="confirmDeletion()">Si, eliminar</v-btn>
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
  data() {
    return {
      db: config.db,
      search: "",
      loading: true,
      loadingDialog: false,
      deleteDialog: false,
      headers: [
        {
          text: "Fecha",
          align: "center",
          sortable: true,
          value: "fecha"
        },
        {
          text: "Concepto",
          align: "center",
          sortable: true,
          value: "concepto"
        },
        {
          text: "Monto",
          align: "center",
          sortable: true,
          value: "monto"
        },
        {
          text: "Observaciones",
          align: "center",
          sortable: true,
          value: "observaciones"
        },
        {
          text: "Opciones",
          align: "center",
          sortable: false,
          value: "opciones"
        }
      ],
      items: [],
      sincemenu: false,
      untilmenu: false,
      since: "",
      until: "",
      selectedItem: {}
    };
  },
  computed: {
    maxDate() {
      let hoy = new Date();
      var dd = String(hoy.getDate()).padStart(2, "0");
      var mm = String(hoy.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = hoy.getFullYear();
      // return dd + "-" + mm + "-" + yyyy;
      return yyyy + "-" + mm + "-" + dd;
    },
    totalPagos() {
      let total = 0;
      for (let i = 0; i < this.items.length; i++) {
        total = total + this.items[i].monto;
      }
      return total;
    }
  },
  watch: {
    menu(val) {
      val &&
        setTimeout(() => {
          return (this.$refs.picker.activePicker = "YEAR");
        });
    }
  },
  methods: {
    sinceDate(date) {
      this.$refs.sincemenu.save(date);
      if (this.since != "" && this.until != "") {
        this.getItemsBetween(this.since, this.until);
      }
    },
    untilDate(date) {
      this.$refs.untilmenu.save(date);
      if (this.since != "" && this.until != "") {
        this.getItemsBetween();
      }
    },
    deleteItem(item) {
      // this.editedIndex = this.teams.indexOf(item);
      this.selectedItem = item;
      this.deleteDialog = true;
    },
    confirmDeletion() {
      this.deleteDialog = false;
      this.loadingDialog = true;
      this.db
        .ref("/gastos/" + this.selectedItem.key)
        .remove()
        .then(() => {
          this.loadingDialog = false;
        });
    },
    getAllItems() {
      this.db
        .ref("/gastos")
        .orderByKey()
        .on("value", snapshot => {
          this.loadItems(snapshot.val());
          this.loading = false;
        });
    },
    getItemsBetween() {
      let since =
        this.since.substring(8, 10) +
        "-" +
        this.since.substring(5, 7) +
        "-" +
        this.since.substring(0, 4);
      let until =
        this.until.substring(8, 10) +
        "-" +
        this.until.substring(5, 7) +
        "-" +
        this.until.substring(0, 4);
      this.db
        .ref("/gastos")
        .orderByChild("fecha")
        .startAt(since)
        .endAt(until)
        .on("value", snapshot => {
          this.loadItems(snapshot.val());
          this.loading = false;
        });
    },
    loadItems(items) {
      // console.log(items);
      this.items = [];
      for (let key in items) {
        this.items.push({
          key: key,
          observaciones: items[key].observaciones,
          concepto: items[key].concepto,
          monto: items[key].monto,
          fecha: items[key].fecha
        });
      }
      this.items.reverse();
      // console.log(this.items);
    },
    clearSearch() {
      this.since = "";
      this.until = "";
      this.search = "";
      this.getAllItems();
    }
  },
  mounted() {
    //CARGAR ITEMS
    this.getAllItems();
  }
};
</script>
