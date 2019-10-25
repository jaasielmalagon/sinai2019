<template>
  <v-card color="grey lighten-5">
    <v-toolbar color="#4472C4" dark>
      <v-toolbar-title>Detalles del préstamo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-icon @click="print('detalles-prestamo')">print</v-icon>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col xs="12" sm="5">
            <v-text-field
              :placeholder="prestamo.cliente.nombre + ' ' + prestamo.cliente.apaterno + ' ' + prestamo.cliente.amaterno"
              :value="prestamo.cliente.nombre + ' ' + prestamo.cliente.apaterno + ' ' + prestamo.cliente.amaterno"
              label="Nombre del cliente"
              readonly
            >{{prestamo.cliente.nombre}}</v-text-field>
          </v-col>
          <v-col xs="12" sm="5" offset-sm="2">
            <v-text-field
              :value="prestamo.cliente.bornDate"
              :placeholder="prestamo.cliente.bornDate"
              label="Fecha de nacimiento"
              readonly
            ></v-text-field>
          </v-col>
          <v-col xs="12" sm="5">
            <v-text-field
              :value="prestamo.cliente.curp"
              :placeholder="prestamo.cliente.curp"
              label="CURP"
              readonly
            ></v-text-field>
          </v-col>
          <v-col xs="12" sm="5" offset-sm="2">
            <v-text-field
              :value="prestamo.cliente.telefono"
              :placeholder="prestamo.cliente.telefono"
              label="Teléfono personal"
              readonly
            ></v-text-field>
          </v-col>
          <v-col xs="12">
            <v-text-field
              :value="prestamo.cliente.direccion"
              :placeholder="prestamo.cliente.direccion"
              label="Domicilio particular"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- <pre>{{$data.prestamo}}</pre> -->
      </v-container>
      <v-data-table
        :headers="amortHeaders"
        :items="prestamo.tabla"
        :items-per-page="prestamo.plazo"
        class="elevation-5"
        hide-default-footer
        calculate-widths
      >
        <template v-slot:item.inicial="{ item }">
          <strong>$</strong> {{item.inicial.toFixed(2)}}
        </template>
        <template v-slot:item.final="{ item }">
          <strong>$</strong> {{item.final.toFixed(2)}}
        </template>
        <template v-slot:item.pagoCapital="{ item }">
          <strong>$</strong> {{item.pagoCapital.toFixed(2)}}
        </template>
        <template v-slot:item.pagoInteres="{ item }">
          <strong>$</strong> {{item.pagoInteres.toFixed(2)}}
        </template>
        <template v-slot:item.totalPago="{ item }">
          <strong>$</strong> {{item.totalPago.toFixed(2)}}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AmortizacionTable",
  props: {
    prestamo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amortHeaders: [
        {
          text: "No. pago",
          align: "center",
          value: "nPago"
        },
        {
          text: "Fecha vencimiento",
          align: "center",
          value: "vencimiento"
        },
        {
          text: "Fecha de pago",
          align: "center",
          value: "fecha"
        },
        {
          text: "Saldo inicial",
          align: "center",
          value: "inicial"
        },
        {
          text: "Saldo final",
          align: "center",
          value: "final"
        },
        {
          text: "Abono a capital",
          align: "center",
          value: "pagoCapital"
        },
        {
          text: "Intereses",
          align: "center",
          value: "pagoInteres"
        },
        {
          text: "Total del pago",
          align: "center",
          value: "totalPago"
        }
      ]
    };
  },
  methods: {
    print(element) {
      let printContents, popupWin;
      printContents = document.getElementById(element).innerHTML;
      popupWin = window.open(
        "",
        "_blank",
        "top=0,left=0,height=100%,width=auto"
      );
      popupWin.document.open();
      popupWin.document.write(`
      <html lang="es">
        <head>
          <title>Tabla de amortización</title>
          <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet">
          <link href="https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css" rel="stylesheet">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
        </head>
        <body onload="window.print();window.close()">
          <div id="app">
            <v-app>
              <v-content>
                <v-container>
                  <v-row>
                    ${printContents}
                  <v-layout>
                </v-container>
              </v-content>
            </v-app>
          </div>                    
        </body>
      </html>`);
      let vueScript = popupWin.document.createElement("script");
      vueScript.setAttribute(
        "src",
        "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"
      );
      popupWin.document.body.appendChild(vueScript);

      let vuetifyScript = popupWin.document.createElement("script");
      vuetifyScript.setAttribute(
        "src",
        "https://cdn.jsdelivr.net/npm/vuetify@1.5.16/dist/vuetify.min.js"
      );
      popupWin.document.body.appendChild(vuetifyScript);
      popupWin.document.close();
    }
  },
  mounted() {
    // console.log(this.prestamo.tabla);
  }
};
</script>
<style>
td,
th {
  margin: 0%;
  padding: 0%;
}
</style>
