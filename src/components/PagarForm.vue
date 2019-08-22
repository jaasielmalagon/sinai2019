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
                item-key="key"
                :headers="headers"
                :items="items"
                :loading="loading"
                loading-text="Cargando... espere, por favor."
                class="elevation-1"
              >
                <template v-slot:item.idMovimiento="{item}">
                  <td class="text-left">
                    <v-chip class="ma-2" x-small pill v-if="item.idMovimiento == 14">
                      <strong>
                        <v-avatar left color="green">PR</v-avatar>Pago Regular
                      </strong>
                    </v-chip>
                    <v-chip class="ma-2" x-small pill v-if="item.idMovimiento == 7">
                      <strong>
                        <v-avatar left color="red">CM</v-avatar>Cargo Moratorio
                      </strong>
                    </v-chip>
                  </td>
                </template>
                <template v-slot:item.amortizacion="{ item }">
                  <td class="text-right">
                    <strong>$</strong>
                    {{item.amortizacion.toFixed(2)}}
                  </td>
                </template>
                <template v-slot:item.interes="{ item }">
                  <td class="text-right">
                    <strong>$</strong>
                    {{item.interes.toFixed(2)}}
                  </td>
                </template>
                <template v-slot:item.total="{ item }">
                  <td class="text-right">
                    <strong>$</strong>
                    {{item.total.toFixed(2)}}
                  </td>
                </template>
                <template v-slot:body.append>
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
      headers: [
        {
          text: "Movimiento",
          align: "center",
          sortable: false,
          value: "idMovimiento"
        },
        {
          text: "Capital",
          align: "center",
          sortable: false,
          value: "amortizacion"
        },
        {
          text: "Interés",
          align: "center",
          sortable: false,
          value: "interes"
        },
        {
          text: "Total",
          align: "center",
          sortable: false,
          value: "total"
        },
        {
          text: "Fecha límite",
          align: "center",
          sortable: false,
          value: "fechaPagoVencimiento"
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
        total = total + this.selected[i].total;
      }      
      return total;
    },
    totalInteres() {
      let total = 0;
      for (let i = 0; i < this.selected.length; i++) {
        total = total + this.selected[i].interes;
      }
      return total;
    },
    totalCapital() {
      let total = 0;
      for (let i = 0; i < this.selected.length; i++) {
        total = total + this.selected[i].amortizacion;
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
    this.db
      .ref("/cargoabono")
      .orderByChild("idContrato")
      .equalTo(this.prestamo.key)
      .on("value", snapshot => {
        let items = snapshot.val();
        let array = [];
        for (let key in items) {
          if (items[key].estado == "N") {
            array.push({
              key: key,
              amortizacion: items[key].amortizacion,
              estado: items[key].estado,
              fechaPago: items[key].fechaPago,
              fechaPagoVencimiento: items[key].fechaLimitePago,
              idCliente: items[key].idCliente,
              idContrato: items[key].idContrato,
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
      });
  }
};
</script>