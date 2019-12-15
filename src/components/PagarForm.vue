<template>
  <v-row justify="center">
    <v-card>
      <v-toolbar color="#4472C4" dark>
        <v-toolbar-title>
          Cliente:
          <small>{{prestamo.cliente.nombre}} {{prestamo.cliente.apaterno}} {{prestamo.cliente.amaterno}}</small>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn @click="$emit('emitItems', selected)" dark icon :disabled="selected.lenght == 0">
            <v-icon color="white">check</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col xs3>
              <v-subheader>
                <strong>Fecha actual:</strong>
              </v-subheader>
            </v-col>
            <v-col xs3>
              <v-subheader>
                <strong>{{hoy}}</strong>
              </v-subheader>
            </v-col>
            <v-col xs3>
              <v-subheader>
                <strong>Total a pagar:</strong>
              </v-subheader>
            </v-col>
            <v-col xs3>
              <v-subheader>
                <strong>$ {{totalPagos}}</strong>
              </v-subheader>
            </v-col>
          </v-row>
          <v-row>
            <v-col xs12>
              <v-data-table
                v-model="selected"
                show-select
                item-key="nPago"
                :headers="headers"
                :items="items"
                :loading="loading"
                :items-per-page="5"
                loading-text="Cargando... espere, por favor."
                class="elevation-1"
                dense
              >
                <!-- <template v-slot:item.estado="{item}">
                  <td class="text-left">
                    <v-chip class="ma-2" x-small pill v-if="item.estado == 0">
                      <strong>
                        <v-avatar left color="red">
                          <v-icon color="white">mdi-close</v-icon>
                        </v-avatar>No pagado
                      </strong>
                    </v-chip>
                    <v-chip class="ma-2" x-small pill v-if="item.estado == 1">
                      <strong>
                        <v-avatar left color="green">
                          <v-icon color="white">mdi-check</v-icon>
                        </v-avatar>Pagado
                      </strong>
                    </v-chip>
                  </td>
                </template>-->
                <template v-slot:item.pagoCapital="{ item }">
                  <td class="text-right">
                    <strong>$</strong>
                    {{item.pagoCapital.toFixed(2)}}
                  </td>
                </template>-->
                <template v-slot:item.pagoInteres="{ item }">
                  <td class="text-right">
                    <strong>$</strong>
                    {{item.pagoInteres.toFixed(2)}}
                  </td>
                </template>
                <template v-slot:item.totalPago="{ item }">
                  <td class="text-right">
                    <strong>$</strong>
                    {{item.totalPago.toFixed(2)}}
                  </td>
                </template>
                <template v-slot:body.append>                  
                  <td></td>
                  <td></td>
                  <td></td>
                  <td class="text-center">
                    <strong>$ {{totalCapital.toFixed(2)}}</strong>
                  </td>
                  <td class="text-center">
                    <strong>$ {{totalInteres.toFixed(2)}}</strong>
                  </td>
                  <td class="text-center">
                    <strong>$ {{totalPagos.toFixed(2)}}</strong>
                  </td>
                  <td></td>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <!-- <pre>{{$data.selected}}</pre> -->
  </v-row>
</template>
<script>
import config from "../config";
export default {
  name: "PagarForm",
  props: {
    prestamo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      db: config.db,
      loading: true,
      singleSelect: false,
      selected: [],
      // headers: [
      //   {
      //     text: "Movimiento",
      //     align: "center",
      //     sortable: false,
      //     value: "idMovimiento"
      //   },
      //   {
      //     text: "Capital",
      //     align: "center",
      //     sortable: false,
      //     value: "capital"
      //   },
      //   {
      //     text: "Interés",
      //     align: "center",
      //     sortable: false,
      //     value: "interes"
      //   },
      //   {
      //     text: "Total",
      //     align: "center",
      //     sortable: false,
      //     value: "total"
      //   },
      //   {
      //     text: "Fecha límite",
      //     align: "center",
      //     sortable: false,
      //     value: "fechaPagoVencimiento"
      //   }
      // ],
      headers: [
        {
          text: "Pago",
          align: "center",
          sortable: true,
          value: "nPago"
        },
        // {
        //   text: "Estado",
        //   align: "center",
        //   sortable: false,
        //   value: "estado"
        // },
        {
          text: "Vencimiento",
          align: "center",
          sortable: false,
          value: "vencimiento"
        },
        {
          text: "Capital",
          align: "center",
          sortable: false,
          value: "pagoCapital"
        },
        {
          text: "Interés",
          align: "center",
          sortable: false,
          value: "pagoInteres"
        },
        {
          text: "Total",
          align: "center",
          sortable: false,
          value: "totalPago"
        }
      ],
      items: []
    };
  },
  methods: {
    saveData() {}
  },
  computed: {
    totalPagos() {
      let total = 0;
      for (let i = 0; i < this.selected.length; i++) {
        total = total + this.selected[i].totalPago;
      }
      return total;
    },
    totalInteres() {
      let total = 0;
      for (let i = 0; i < this.selected.length; i++) {
        total = total + this.selected[i].pagoInteres;
      }
      return total;
    },
    totalCapital() {
      let total = 0;
      for (let i = 0; i < this.selected.length; i++) {
        total = total + this.selected[i].pagoCapital;
      }
      return total;
    },
    hoy() {
      let hoy = new Date();
      var dd = String(hoy.getDate()).padStart(2, "0");
      var mm = String(hoy.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = hoy.getFullYear();
      return dd + "-" + mm + "-" + yyyy;
    }
  },
  mounted() {
    // console.log(this.prestamo.key);
    /* this.db
      .ref("/cargoabono")
      .orderByChild("idPrestamo")
      .equalTo(this.prestamo.key)
      .on("value", snapshot => {
        let items = snapshot.val();
        let array = [];
        for (let key in items) {
          if (items[key].estado == "NP") {
            console.log(items[key]);
            array.push({
              key: key,
              capital: items[key].capital,
              estado: items[key].estado,
              fechaPago: items[key].fechaPago,
              fechaPagoVencimiento: items[key].fechaLimitePago,
              cliente: items[key].cliente,
              idPrestamo: items[key].idPrestamo,
              idMovimiento: items[key].idMovimiento,
              idVencimiento: items[key].idVencimiento,
              interes: items[key].interes,
              refinanciamiento: items[key].refinanciamiento,
              total: items[key].total
            });
          }
        }
        this.items = array;
        this.loading = false;
      });*/
    // console.log(this.prestamo);
    this.db
      .ref("/prestamos")
      .orderByKey()
      .equalTo(this.prestamo.key)
      .limitToFirst(1)
      .on("value", snapshot => {
        let items = snapshot.val();
        let array = [];
        for (let key in items) {
          for (let i = 0; i < items[key].tabla.length; i++) {
            // console.log(items[key].tabla[i]);
            if (
              items[key].tabla[i] != undefined &&
              items[key].tabla[i] != null &&
              (items[key].tabla[i].estado == "A" || items[key].tabla[i].estado == 0)
            ) {
              array.push(items[key].tabla[i]);
            }
          }
        }
        this.items = array;
        for (let i = 0; i < this.items.length; i++) {
          let year = this.items[i].vencimiento.substring(6, 10);
          let month = this.items[i].vencimiento.substring(3, 5);
          let day = this.items[i].vencimiento.substring(0, 2);
          let fechaVencimiento = new Date(
            year,
            month - 1,
            day,
            "13",
            "00",
            "00",
            "00"
          );
          let hoy = new Date();
          if (fechaVencimiento.getTime() < hoy.getTime()) {
            // console.log(hoy.getTime(),fechaVencimiento.getTime());
          }
        }
        this.loading = false;
      });
  }
};
</script>