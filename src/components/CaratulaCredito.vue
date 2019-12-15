<template>
  <v-card color="grey lighten-5">
    <v-toolbar color="#4472C4" dark>
      <v-toolbar-title class="display-1">CARÁTULA DE CRÉDITO</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-icon @click="print('caratula-prestamo')">print</v-icon>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-layout row wrap>
          <v-flex class="recuadro" xs6>
            <v-card :color="morado">
              <v-card-title class="ml-1 title font-weight-regular">NOMBRE DEL ACREDITADO:</v-card-title>
              <v-card-text
                class="mx-2 body-2"
              >{{prestamo.cliente.nombre}} {{prestamo.cliente.apaterno}} {{prestamo.cliente.amaterno}}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs6>
            <v-card :color="morado">
              <v-card-title class="ml-1 title font-weight-regular">Folio:</v-card-title>
              <v-card-text class="mx-2 body-2">{{folio}}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs12>
            <v-card :color="blanco">
              <v-card-title class="ml-1 title font-weight-regular">DOMICILIO DEL ACREDITADO:</v-card-title>
              <v-card-text class="mx-2 body-2">{{prestamo.cliente.direccion}}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs6>
            <v-card :color="morado">
              <v-card-title class="ml-1 title font-weight-regular">CLAVE DE POBLACIÓN:</v-card-title>
              <v-card-text class="mx-2 body-2">{{prestamo.cliente.curp}}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs6>
            <v-card :color="morado">
              <v-card-title class="ml-1 title font-weight-regular">CLAVE DE ELECTOR:</v-card-title>
              <v-card-text class="mx-2 body-2">{{prestamo.cliente.ocr}}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs4>
            <v-card :color="blanco">
              <v-card-title class="ml-1 title font-weight-regular">FECHA DE DESEMBOLSO:</v-card-title>
              <v-card-text class="mx-2 body-2">{{prestamo.inicio}}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs4>
            <v-card :color="blanco">
              <v-card-title class="ml-1 title font-weight-regular">PLAZO DE CRÉDITO:</v-card-title>
              <v-card-text
                class="mx-2 body-2"
              >{{prestamo.plazo}} {{prestamo.tipo == "D" ? "Dias naturales" : "Semanas naturales"}}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs4>
            <v-card :color="blanco">
              <v-card-title class="ml-1 title font-weight-regular">FECHA LÍMITE DE PAGO:</v-card-title>
              <v-card-text class="mx-2 body-2">{{prestamo.tabla[prestamo.tabla.length-1].fecha}}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs6>
            <v-card :color="morado">
              <v-card-title
                class="ml-1 title font-weight-regular"
              >TASA DE INTERÉS ORDINARIO MENSUAL:</v-card-title>
              <v-card-text class="mx-2 body-2">
                {{(prestamo.tasa * 100).toFixed(0)}}
                <strong>%</strong>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs6>
            <v-card :color="morado">
              <v-card-title
                class="ml-1 title font-weight-regular"
              >TASA DE INTERÉS MORATORIO MENSUAL:</v-card-title>
              <v-card-text class="mx-2 body-2">
                15
                <strong>%</strong>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs4>
            <v-card :color="blanco">
              <v-card-title class="ml-1 title font-weight-regular">MONTO PRESTADO:</v-card-title>
              <v-card-text class="mx-2 body-2">
                <strong>$</strong>
                {{(prestamo.capital).toFixed(2)}}
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs4>
            <v-card :color="blanco">
              <v-card-title class="ml-1 title font-weight-regular">MONTO TOTAL A PAGAR:</v-card-title>
              <v-card-text class="mx-2 body-2">
                <strong>$</strong>
                {{(prestamo.intereses + prestamo.capital).toFixed(2)}}
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs4>
            <v-card :color="blanco">
              <v-card-title class="ml-1 title font-weight-regular">PARCIALIDADES:</v-card-title>
              <v-card-text class="mx-2 body-2">
                <strong>$</strong>
                {{(prestamo.tabla[0].totalPago).toFixed(2)}}
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs12>
            <v-card :color="morado">
              <v-card-title class="ml-1 title font-weight-regular">OTRAS COMISIONES RELEVANTES:</v-card-title>
              <v-card-text class="mx-2 body-2">
                Comisión por intento fallido de cobro:
                <strong>$100.00 MXN</strong>. Reconociendo el cliente que esta comisión
                <strong>pertenecerá a la Financiera SINAI</strong> por concepto de la realización de las gestiones de cobro y
                <strong>no será tomada como abono al monto total adeudado por el mismo</strong>.
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs12>
            <v-card :color="blanco">
              <v-card-title class="ml-1 title font-weight-regular">DATOS DEL AVAL:</v-card-title>
              <v-card-text class="mx-2 body-2">
                <p>
                  <strong>NOMBRE:</strong>
                  {{aval.nombre}} {{aval.apaterno}} {{aval.amaterno}}
                </p>
                <p>
                  <strong>DOMICILIO:</strong>
                  {{aval.direccion}}
                </p>
                <p>
                  <strong>TELÉFONO:</strong>
                  {{aval.telefono}}
                </p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs12>
            <v-card :color="morado">
              <v-card-title class="ml-1 title font-weight-regular">ADVERTENCIAS:</v-card-title>
              <v-card-text class="text-xs-justify">
                <p>
                  <strong>1.</strong> Todo incumplimiento en tiempo y forma de sus pagos de acuerdo a la tabla de amortización generará comisiones e intereses moratorios.
                </p>
                <p>
                  <strong>2.</strong> El aval garantizará el pago del crédito otorgado. De no ser así, este responderá como obligado principal, adquiriendo así la deuda de su avalado ante la financiera.
                </p>
                <p>
                  <strong>3.</strong> La presente corátula brinda montos de pago con carácter informativo, los cuales son resultado del cálculo sobre las condiciones de monto, plazo, tasa y forma de pago del crédito otorgado, por ende el importe del pago total, así como el monto total de adeudo podrán aumentar a razón de las fechas en que efectivamente sea realizado el pago programado.
                </p>
                <p>
                  <strong>ESTA CARÁTULA FORMA PARTE DEL CONTRATO DE APERTURA DE CRÉDITO ENTRE FINANCIERA SINAI Y EL ACREDITADO. AL PRESENTE CONTRATO SE ANEXA LA TABLA DE AMORTIZACIÓN CORRESPONDIENTE Y LAS IDENTIFICACIONES DEL ACREDITADO Y EL AVAL.</strong>
                </p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs6>
            <v-card :color="blanco">
              <v-card-title
                class="ml-1 title font-weight-regular"
              >ENTERADO Y CONFORME FIRMA EL AVAL:</v-card-title>
              <v-card-text class="mx-2 mt-5 body-2">
                <v-divider class="divisor"></v-divider>
                <p class="text-xs-center">
                  <strong>NOMBRE:</strong>
                  {{aval.nombre}} {{aval.apaterno}} {{aval.amaterno}}
                </p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex class="recuadro" xs6>
            <v-card :color="blanco">
              <v-card-title
                class="ml-1 title font-weight-regular"
              >ENTERADO Y CONFORME FIRMA EL CLIENTE:</v-card-title>
              <v-card-text class="mx-2 mt-5 body-2">
                <v-divider class="divisor"></v-divider>
                <p class="text-xs-center">
                  <strong>NOMBRE:</strong>
                  {{prestamo.cliente.nombre}} {{prestamo.cliente.apaterno}} {{prestamo.cliente.amaterno}}
                </p>
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
export default {
  name: "CaratulaCredito",
  props: {
    prestamo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      db: config.db,
      morado: "#D9E2F3",
      blanco: "#FFF",
      aval: {},
      folio: 0
    };
  },
  mounted() {
    this.foliar();
    let aval = "";
    this.db
      .ref("/solicitudes")
      .orderByKey()
      .equalTo(this.prestamo.solicitud)
      .on("value", snapshot => {
        let snap = snapshot.val();
        for (let key in snap) {
          aval = snap[key].aval;
          // console.log(aval);
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
      popupWin.document.write(`
      <html lang="es">
        <head>
          <title>Carátula de crédito</title>
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
    },
    foliar() {
      console.log(this.prestamo);
      if (
        this.prestamo.key != "" &&
        this.prestamo.key != null &&
        this.prestamo.key != undefined
      ) {
        this.folio = this.prestamo.folio;
      } else {
        this.db
          .ref("/prestamos")
          .orderByKey()
          .on("value", snapshot => {
            let snap = snapshot.val();
            console.log(snap);
            if (snap != null) {
              let folio = 0;
              for (let key in snap) {
                folio++;
              }
              console.log(folio);
              this.folio = folio + 1;
            } else {
              this.folio = 1;
            }
          });
      }
    }
  }
};
</script>
<style>
.recuadro {
  border: #8eaadb solid 1px;
}
.divisor {
  border: black solid 1px;
  margin-bottom: 5px;
}
</style>