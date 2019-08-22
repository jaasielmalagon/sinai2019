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
        <v-layout row wrap>
          <v-flex xs12 sm5>
            <v-text-field
              :placeholder="prestamo.cliente.nombre + ' ' + prestamo.cliente.apaterno + ' ' + prestamo.cliente.amaterno"
              :value="prestamo.cliente.nombre + ' ' + prestamo.cliente.apaterno + ' ' + prestamo.cliente.amaterno"
              label="Nombre del cliente"
              readonly
            >{{prestamo.cliente.nombre}}</v-text-field>
          </v-flex>
          <v-flex xs12 sm5 offset-sm2>
            <v-text-field
              :value="prestamo.cliente.bornDate"
              :placeholder="prestamo.cliente.bornDate"
              label="Fecha de nacimiento"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm5>
            <v-text-field
              :value="prestamo.cliente.curp"
              :placeholder="prestamo.cliente.curp"
              label="CURP"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm5 offset-sm2>
            <v-text-field
              :value="prestamo.cliente.telefono"
              :placeholder="prestamo.cliente.telefono"
              label="Teléfono personal"
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              :value="prestamo.cliente.direccion"
              :placeholder="prestamo.cliente.direccion"
              label="Domicilio particular"
              readonly
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-data-table
        :headers="amortHeaders"
        :items="prestamo.tabla"
        class="elevation-5"
        hide-actions
      >
        <template v-slot:items="props">
          <td class="text-xs-right">{{ props.item.nPago }}</td>
          <td class="text-xs-center">{{ props.item.fecha }}</td>
          <td class="text-xs-center">
            <strong>$</strong>
            {{ (props.item.inicial).toFixed(2) }}
          </td>
          <td class="text-xs-center">
            <strong>$</strong>
            {{ (props.item.final).toFixed(2) }}
          </td>
          <td class="text-xs-center">
            <strong>$</strong>
            {{ (props.item.pagoCapital).toFixed(2) }}
          </td>
          <td class="text-xs-center">
            <strong>$</strong>
            {{ (props.item.pagoInteres).toFixed(2) }}
          </td>
          <td class="text-xs-center">
            <strong>$</strong>
            {{ (props.item.totalPago).toFixed(2) }}
          </td>
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
          align: "center"
        },
        {
          text: "Fecha de pago",
          align: "center"
        },
        {
          text: "Saldo inicial",
          align: "center"
        },
        {
          text: "Saldo final",
          align: "center"
        },
        {
          text: "Abono a capital",
          align: "center"
        },
        {
          text: "Intereses",
          align: "center"
        },
        {
          text: "Total del pago",
          align: "center"
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
                  <v-layout row wrap>
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
  }
};
</script>
<style>
td, th{
  margin: 0%;
  padding: 0%;
}
</style>
