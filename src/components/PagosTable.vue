<template>
  <v-container grid-list-md text-xs-center>
    <v-card class="light-blue lighten-5">
      <v-card-title>
        <v-container grid-list-md text-xs-center>
          <!-- <v-row>
            <v-col xs12 md4>
              <div class="display-2 font-weight-light">Pagos realizados</div>
            </v-col>
          </v-row>-->
          <v-row>
            <v-col xs12 md8>
              <v-card flat elevation="1" class="light-blue lighten-5">
                <v-card-title>Filtrar por:</v-card-title>
                <v-card-text>
                  <v-expansion-panels popout>
                    <v-expansion-panel>
                      <v-expansion-panel-header v-slot="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4">Buscar por periodo</v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open">Seleccione el periodo que desea ver</span>
                              <v-row v-else no-gutters style="width: 100%">
                                <v-col cols="6">
                                  Desde el:
                                  <strong>{{ since || 'No establecido' }}</strong>
                                </v-col>
                                <v-col cols="6">
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
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn @click="resetDates" text color="red">Limpiar campos</v-btn>
                        </v-card-actions>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-row>
                    <!-- <v-col xs6>
                      <v-select
                        @change="filtrar($event)"
                        :items="comisionistas"
                        item-text="nombre"
                        :return-object="true"
                        label="Comisionistas"
                        no-data-text="No hay comisionistas"
                      ></v-select>
                    </v-col>-->
                    <v-col cols="12" md="6">
                      <v-select
                        :items="comisionistas"
                        item-text="nombre"
                        :return-object="true"
                        label="Comisionistas"
                        no-data-text="No hay comisionistas"
                        @input="filtrar($event)"
                      ></v-select>
                    </v-col>
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
          :items="filteredItems"
          :search="search"
          :loading="loading"
          loading-text="Cargando... espere, por favor."
          class="elevation-1"
        >
          <template v-slot:item.cliente="{ item }">{{item}}</template>
          <template v-slot:item.comisionista="{ item }">{{item}}</template>
          <template v-slot:item.capital="{ item }">
            <!-- <td class="text-right"> -->
            <strong>$</strong>
            {{item.capital.toFixed(2)}}
            <!-- </td> -->
          </template>
          <template v-slot:item.interes="{ item }">
            <!-- <td class="text-right"> -->
            <strong>$</strong>
            {{item.interes.toFixed(2)}}
            <!-- </td> -->
          </template>
          <template v-slot:item.monto="{ item }">
            <!-- <td class="text-right"> -->
            <strong>$</strong>
            {{item.monto.toFixed(2)}}
            <!-- </td> -->
          </template>
          <template v-slot:body.append>
            <td colspan="7"></td>
            <td class="text-center">
              <strong>$ {{totalCapital.toFixed(2)}}</strong>
            </td>
            <td class="text-center">
              <strong>$ {{totalInteres.toFixed(2)}}</strong>
            </td>
            <td class="text-center">
              <strong>$ {{totalPagos.toFixed(2)}}</strong>
            </td>
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
          text: "Num. Pago",
          align: "center",
          sortable: true,
          value: "nPago"
        },
        {
          text: "Vencimiento",
          align: "center",
          sortable: true,
          value: "vencimiento"
        },
        {
          text: "Fecha pago",
          align: "center",
          sortable: true,
          value: "fechaPago"
        },
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
          text: "Comisionista",
          align: "center",
          sortable: true,
          value: "comisionista.nombre"
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
          value: "interes"
        },
        {
          text: "Monto total",
          align: "center",
          sortable: true,
          value: "monto"
        }
      ],
      items: [],
      filteredItems: [],
      comisionistas: [],
      // maxDate:
      //   new Date().toISOString().substr(0, 4) -
      //   18 +
      //   "-" +
      //   new Date().toISOString().substr(5, 2) +
      //   "-" +
      //   new Date().toISOString().substr(8, 2),
      sincemenu: false,
      untilmenu: false,
      since: "",
      until: ""
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
      for (let i = 0; i < this.filteredItems.length; i++) {
        total = total + this.filteredItems[i].monto;
      }
      return total;
    },
    totalInteres() {
      let total = 0;
      for (let i = 0; i < this.filteredItems.length; i++) {
        total = total + this.filteredItems[i].interes;
      }
      return total;
    },
    totalCapital() {
      let total = 0;
      for (let i = 0; i < this.filteredItems.length; i++) {
        total = total + this.filteredItems[i].capital;
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
    resetDates(){
      this.sincemenu = false,
      this.untilmenu = false,
      this.since = "",
      this.until = ""
      this.getAllItems();
    },
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
        .ref("/personas/" + this.selectedItem.key)
        .update({
          activo: 0
        })
        .then(() => {
          this.loadingDialog = false;
        });
    },
    getAllItems() {
      this.db
        .ref("/pagos")
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
        .ref("/pagos")
        .orderByChild("fechaPago")
        .startAt(since)
        .endAt(until)
        .on("value", snapshot => {
          this.loadItems(snapshot.val());
          this.loading = false;
        });
    },
    loadItems(items) {
      this.items = [];
      for (let key in items) {
        // console.log(items[key].cliente, items[key].comisionista);
        this.items.push({
          key: key,
          capital: items[key].capital,
          cliente: items[key].cliente,
          comisionista: items[key].comisionista,
          fechaPago: items[key].fechaPago,
          vencimiento: items[key].vencimiento,
          idPrestamo: items[key].idPrestamo,
          interes: items[key].interes,
          monto: items[key].monto,
          nPago: items[key].nPago
        });
      }
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
    this.getAllItems();
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
