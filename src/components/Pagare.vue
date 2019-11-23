<template>
  <v-card color="grey lighten-5">
    <v-toolbar color="#4472C4" dark>
      <v-toolbar-title class="display-1">PAGARÉ</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-icon @click="print('pagare')">print</v-icon>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text id="pagare">
      <v-container>
        <v-layout row wrap>
          <v-flex xs4 d-flex>
            <v-card elevation="0" :color="morado">
              <v-card-text class="mt-3 display-3 text-xs-center font-weight-bold">P A G A R É</v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs8>
            <v-layout row>
              <v-flex xs3>
                <v-card tile elevation="0" :color="blanco">
                  <v-card-title class="body-2">OPERACIÓN:</v-card-title>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-card tile elevation="0" class="cuadro-redondeado" :color="morado">
                  <v-card-title class="body-2">&nbsp;</v-card-title>
                </v-card>
              </v-flex>

              <v-flex xs3>
                <v-card tile elevation="0" :color="blanco">
                  <v-card-title class="body-2">BUENO POR:</v-card-title>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-card tile elevation="0" class="cuadro-redondeado" :color="morado">
                  <v-card-title class="body-2">
                    <strong>$</strong>
                    {{(prestamo.intereses + prestamo.capital).toFixed(2)}}
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs6 class="border-t border-r">
                <v-card tile flat>
                  <v-card-text>
                    <div class="text-xs-right">
                      <span class="body-2">FECHA DE EXPEDICIÓN</span>
                      <br />
                      <span class="grey--text caption">{{prestamo.inicio}}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs6 class="border-t">
                <v-card tile flat>
                  <v-card-text>
                    <div class="text-xs-right">
                      <span class="body-2">LUGAR DE EXPEDICIÓN</span>
                      <br />
                      <span class="grey--text caption">{{prestamo.cliente.direccion}}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12 class="text-xs-justify">
            <v-card elevation="0" class="mt-2 mb-1 py-2">
              <v-card-text class="subheading">
                Debo (emos) y pagaré (mos) incondicionalmente por este pagaré a la orden de
                <strong>__________________________________________________</strong>,
                <strong>{{formatedDate}}</strong> la cantidad de
                <strong>$ {{(prestamo.intereses + prestamo.capital).toFixed(2)}} ({{formatedNumber}} MEXICANOS MXN)</strong>.
                Valor recibido a mi (nuestra) entera satisfacción.
                <br />Este pagaré generará un interés ordinario de 7% (siete por ciento) mensual por concepto de interés ordinario por todo el tiempo que permanezca insoluto el adeudo.
                Igualmente obligándome a pagar para el caso de mora un interés moratorio equivalente al INTERÉS MORATORIO CON NÚMERO 9.5 % (nueve punto cinco por ciento)
                mensual a partir de la fecha en que se constituya en mora y hasta su total liquidación.
                <br />La cantidad resultante de los intereses podrá ser capitalizada de conformidad al artículo 363 del código de comercio. Los deudores renuncian al fuero que por razón de
                su domicilio presente o futuro pudiera corresponderles y se someten a la jurisdicción de los tribunales de Tehuacán, Puebla.
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs5>
            <v-card class="cuadro-redondeado" elevation="0" :color="morado">
              <v-card-title class="ml-1 title font-weight-regular">DATOS DEL SUSCRIPTOR</v-card-title>
              <v-card-text class="body-2 text-xs-left">
                <v-flex xs12>
                  <v-text-field
                    label="NOMBRE:"
                    :placeholder="prestamo.cliente.nombre + ' ' + prestamo.cliente.apaterno + ' ' + prestamo.cliente.amaterno"
                    :value="prestamo.cliente.nombre + ' ' + prestamo.cliente.apaterno + ' ' + prestamo.cliente.amaterno"
                    :v-model="prestamo.cliente.nombre + ' ' + prestamo.cliente.apaterno + ' ' + prestamo.cliente.amaterno"
                    filled
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="DIRECCIÓN:"
                    :placeholder="prestamo.cliente.direccion"
                    :value="prestamo.cliente.direccion"
                    :v-model="prestamo.cliente.direccion"
                    filled
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="TELÉFONO:"
                    :placeholder="prestamo.cliente.telefono"
                    :value="prestamo.cliente.telefono"
                    :v-model="prestamo.cliente.telefono"
                    filled
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-divider class="linea-firma mt-5"></v-divider>
                <p class="text-xs-center">FIRMA</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs5 offset-xs2 v-if="aval.nombre != 'NO DISPONIBLE'">
            <v-card class="cuadro-redondeado" elevation="0" :color="morado">
              <v-card-title class="ml-1 title font-weight-regular">DATOS DEL AVAL</v-card-title>
              <v-card-text class="body-2 text-xs-left">
                <v-flex xs12>
                  <v-text-field
                    label="NOMBRE:"
                    :placeholder="aval.nombre + ' ' + aval.apaterno + ' ' + aval.amaterno"
                    :value="aval.nombre + ' ' + aval.apaterno + ' ' + aval.amaterno"
                    :v-model="aval.nombre + ' ' + aval.apaterno + ' ' + aval.amaterno"
                    filled
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="DIRECCIÓN:"
                    :placeholder="aval.direccion"
                    :value="aval.direccion"
                    :v-model="aval.direccion"
                    filled
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="TELÉFONO:"
                    :placeholder="aval.telefono"
                    :value="aval.telefono"
                    :v-model="aval.telefono"
                    filled
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-divider class="linea-firma mt-5"></v-divider>
                <p class="text-xs-center">FIRMA</p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import config from "../config";
import numsToLetters from "../plugins/numsToLetters";
export default {
  name: "Pagare",
  props: {
    prestamo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      db: config.db,
      ntl: numsToLetters,
      azul: "#0050A1",
      morado: "#D9E2F3",
      blanco: "#FFF",
      aval: {}
    };
  },
  mounted() {
    let aval = "";
    this.db
      .ref("/solicitudes")
      .orderByKey()
      .equalTo(this.prestamo.solicitud)
      .on("value", snapshot => {
        let snap = snapshot.val();
        for (let key in snap) {
          aval = snap[key].aval;
          if (aval != "" && aval != undefined) {
            this.db
              .ref("/personas")
              .orderByKey()
              .equalTo(aval)
              .on("value", snapshot => {
                let snap = snapshot.val();
                for (let key in snap) {
                  this.aval = snap[key];
                }
                // console.log(this.aval);
              });
          } else {
            this.aval = {
              nombre: "NO DISPONIBLE",
              apaterno: "",
              amaterno: "",
              direccion: "NO DISPONIBLE",
              telefono: "NO DISPONIBLE"
            };
          }
        }
      });
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
      let vueScript = popupWin.document.createElement("script");
      vueScript.setAttribute(
        "src",
        // "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"
        "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"
      );

      let vuetifyScript = popupWin.document.createElement("script");
      vuetifyScript.setAttribute(
        "src",
        // "https://cdn.jsdelivr.net/npm/vuetify@1.5.16/dist/vuetify.min.js"
        "https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.js"
      );
      let vuetifyCss = popupWin.document.createElement("link");
      vuetifyCss.setAttribute(
        "href",
        "https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css"
      );
      vuetifyCss.setAttribute("rel", "stylesheet");
      let vuetifyFont = popupWin.document.createElement("link");
      vuetifyFont.setAttribute(
        "href",
        "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons"
      );
      vuetifyFont.setAttribute("rel", "stylesheet");
      popupWin.document.write(`
      <html lang="es">
        <head>
          <title>Pagaré</title>          
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
          <style>
            .cuadro-redondeado {
              border-radius: 20px;
            }
            .recuadro {
              border: #8eaadb solid 1px;
            }
            .border-t {
              border-top: black solid 2px;
            }
            .border-r {
              border-right: black solid 2px;
            }
            .border-b {
              border-bottom: black solid 2px;
            }
            .linea-firma {
              border: black solid 1px;
              margin-bottom: 5px;
              /* margin-top: 80px; */
            }
          </style>
        </head>
        <body onload="window.print();window.close();">
          <div id="app">
            <v-app>
              <v-content>
                <v-container>
                  <v-layout row> 
                  <v-flex xs12 class="recuadro cuadro-redondeado" style="background-color: black">      
                  <v-card>           
                    ${printContents}
                    </v-card>
                  </v-flex>
                  <v-layout>
                </v-container>
              </v-content>
            </v-app>
          </div>                    
        </body>
      </html>`);
      popupWin.document.head.appendChild(vuetifyFont);
      popupWin.document.head.appendChild(vuetifyCss);
      popupWin.document.body.appendChild(vueScript);
      popupWin.document.body.appendChild(vuetifyScript);
      popupWin.document.close();
    }
  },
  computed: {
    formatedNumber() {
      return this.ntl.NumeroALetras(
        this.prestamo.intereses + this.prestamo.capital
      );
    },
    formatedDate() {
      let elements = this.prestamo.tabla[15].fecha.split("-");

      let date = new Date(elements[1] + "/" + elements[0] + "/" + elements[2]);

      var month = date.toLocaleString("es-MX", { month: "long" });
      return (
        "el dia " +
        (
          date.getDate() +
          " del mes de " +
          month +
          " del año " +
          date.getFullYear()
        ).toLocaleUpperCase()
      );
    }
  }
};
</script>
<style>
.cuadro-redondeado {
  border-radius: 20px;
}
.recuadro {
  border: #8eaadb solid 1px;
}
.border-t {
  border-top: black solid 2px;
}
.border-r {
  border-right: black solid 2px;
}
.border-b {
  border-bottom: black solid 2px;
}
.linea-firma {
  border: black solid 1px;
  margin-bottom: 5px;
  /* margin-top: 80px; */
}
</style>