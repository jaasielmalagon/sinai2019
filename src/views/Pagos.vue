<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" xs="12" background-color="blue-grey lighten-4">
        <v-card>
          <v-toolbar dense color="#0051A0" dark>
            <template v-slot:extension>
              <v-tabs
                v-model="tab"
                background-color="#0051A0"
                fixed-tabs
                centered
                dark
                icons-and-text
              >
                <v-tabs-slider></v-tabs-slider>

                <v-tab href="#tab-1">
                  Realizar pago
                  <v-icon>payment</v-icon>
                </v-tab>

                <v-tab href="#tab-2">
                  Pagos realizados
                  <v-icon>remove_red_eye</v-icon>
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>
          <v-card-text style="padding: 0">
            <v-tabs-items v-model="tab">
              <v-tab-item value="tab-1">
                <!-- <v-card flat outlined style="padding: 0px">
                  <v-card-text> -->
                    <prestamos-table opciones="pagar" v-on:selectItem="selectItem($event)"></prestamos-table>
                  <!-- </v-card-text>
                </v-card> -->
              </v-tab-item>
              <v-tab-item value="tab-2">
                <v-card flat>
                  <v-card-text>
                    <pagos-table></pagos-table>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="formDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="#4472C4">
            <v-btn icon dark @click="cancel">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <!-- <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                @click="confirmationDialog = true"
                dark
                icon
                :disabled="selectedItem.key == ''"
              >
                <v-icon color="white">check</v-icon>
              </v-btn>
            </v-toolbar-items>-->
          </v-toolbar>

          <!-- <v-card-text> -->
          <v-row>
            <v-col xs12 md4 d-flex offset-md4 style="margin-bottom: 5px" v-if="!showForm">
              <div>
                <v-alert
                  v-model="alert.show"
                  dismissible
                  transition="scale-transition"
                  :color="alert.style"
                  icon="warning"
                  class="text-xs-center"
                >{{alert.message}}</v-alert>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col xs12 d-flex v-if="selectedItem.key != ''">
              <pagar-form :prestamo="selectedItem" v-on:emitItems="emitedItem($event)"></pagar-form>
              <!-- <pre>{{$data.selectedItem}}</pre> -->
            </v-col>
          </v-row>
          <!-- </v-card-text> -->
        </v-card>
      </v-dialog>
    </v-row>
    <!-- CONFIRMATION DIALOG  -->
    <v-dialog v-model="confirmationDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Aplicar pago</v-card-title>
        <v-card-text class="text-xs-justify">
          <p>Al presionar en "Si, continuar" serán liquidados los cargos seleccionados en la tabla.</p>
          <p>Antes de continuar asegúrese de haber comprobado que toda la información sea correcta y haber recibido el monto total indicado.</p>
          <strong>Esta acción es irreversible y no podrá ser modificada posteriormente.</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text small color="red darken-1" @click="confirmationDialog = false">No, cancelar</v-btn>
          <v-btn text small color="green darken-1" @click="saveData">Si, continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END CONFIRMATION DIALOG  -->
    <loading-dialog :activator="loadingDialog"></loading-dialog>
  </v-container>
</template>

<script>
import PagarForm from "../components/PagarForm";
import PrestamosTable from "../components/PrestamosTable";
import PagosTable from "../components/PagosTable";
import LoadingDialog from "../components/LoadingDialog";
import config from "../config";
import { setTimeout } from "timers";

export default {
  name: "Pagos",
  components: {
    PrestamosTable,
    PagosTable,
    LoadingDialog,
    PagarForm
  },
  data() {
    return {
      db: config.db,
      formTitle: "",
      formDialog: false,
      showForm: false,
      loadingDialog: false,
      alert: {
        message: "",
        style: "",
        show: false
      },
      confirmationDialog: false,
      defaultItem: {
        key: "",
        activo: "",
        inicio: "",
        solicitud: "",
        cliente: "",
        tipo: "",
        capital: "",
        tasa: "",
        intereses: "",
        plazo: "",
        comisionista: "",
        pago: "",
        abonos: [],
        refinanciamiento: 0, //1: si, 0: no
        tabla: [] //{ fecha: "", capital: "", interes: "", pago: "", inicial: "", final: "" }
      },
      selectedItem: {
        key: "",
        activo: "",
        inicio: "",
        solicitud: "",
        cliente: "",
        tipo: "",
        capital: "",
        tasa: "",
        intereses: "",
        plazo: "",
        comisionista: "",
        pago: "",
        abonos: [],
        refinanciamiento: 0, //1: si, 0: no
        tabla: [] //{ fecha: "", capital: "", interes: "", pago: "", inicial: "", final: "" }
      },
      tab: null
    };
  },
  methods: {
    emitedItem($event) {
      this.selectedItem.cargos = $event;
      this.confirmationDialog = true;
    },
    // saveData() {
    //   this.loadingDialog = true;
    //   let hoy = this.hoy();
    //   // console.log(this.selectedItem.cargos);
    //   for (let i = 0; i < this.selectedItem.cargos.length; i++) {
    //     let error = null;
    //     this.db
    //       .ref("cargoabono/" + this.selectedItem.cargos[i].key)
    //       .update({ estado: "S", fechaPago: hoy }, e => {
    //         error = e;
    //       });
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       this.db
    //         .ref("pagos/")
    //         .push({
    //           fechaPago: hoy,
    //           idCliente: this.selectedItem.cargos[i].cliente,
    //           idPrestamo: this.selectedItem.cargos[i].idPrestamo,
    //           idCargo: this.selectedItem.cargos[i].key,
    //           capital: this.selectedItem.cargos[i].capital,
    //           interes: this.selectedItem.cargos[i].interes,
    //           total: this.selectedItem.cargos[i].total
    //         })
    //         .then(() => {
    //           this.loadingDialog = false;
    //           this.alerta("Pago procesado y guardado correctamente", "success");
    //           this.confirmationDialog = false;
    //           // this.closeAlert();
    //           // this.cancel();
    //         });
    //     }
    //   }
    // },
    saveData() {
      this.loadingDialog = true;
      let hoy = this.hoy();
      // console.log(this.selectedItem);
      for (let i = 0; i < this.selectedItem.cargos.length; i++) {
        // console.log(
        //   "/prestamos/" +
        //     this.selectedItem.key +
        //     "/tabla/" +
        //     (this.selectedItem.cargos[i].nPago - 1)
        // );
        this.loadingDialog = false;
        this.db
          .ref(
            "/prestamos/" +
              this.selectedItem.key +
              "/tabla/" +
              (this.selectedItem.cargos[i].nPago - 1)
          )
          .update(
            {
              estado: 1,
              fecha: hoy
            },
            function(error) {
              if (error) {
                alertify.error("EL PAGO NO PUDO SER PROCESADO");
                this.loadingDialog = false;
              } else {
                // console.log(this.selectedItem);
                this.db
                  .ref("pagos/")
                  .push({
                    vencimiento: this.selectedItem.cargos[i].vencimiento,
                    fechaPago: hoy,
                    cliente: this.selectedItem.cliente,
                    idPrestamo: this.selectedItem.key,
                    nPago: this.selectedItem.cargos[i].nPago,
                    comisionista: this.selectedItem.comisionista,
                    monto: this.selectedItem.cargos[i].totalPago,
                    capital: this.selectedItem.cargos[i].pagoCapital,
                    interes: this.selectedItem.cargos[i].pagoInteres
                  })
                  .then(
                    function() {
                      this.cambiarEstadoPrestamo();
                      alertify.success("PAGO PROCESADO CORRECTAMENTE");
                      this.loadingDialog = false;
                      this.confirmationDialog = false;
                      this.closeAlert();
                      this.cancel();
                    }.bind(this)
                  );
              }
            }.bind(this)
          );
      }
    },
    cambiarEstadoPrestamo() {
      let pagados = 0;
      this.db
        .ref("/prestamos")
        .orderByKey()
        .equalTo(this.selectedItem.key)
        .once("value", snapshot => {
          let snap = snapshot.val();
          console.log(snap)
          for (let key in snap) {
            console.log(snap[key].activo)
            if (snap[key].activo == true) {
              let tabla = snap[key].tabla;
              for (let i = 0; i < tabla.length; i++) {
                if (tabla[i].estado == 1) {
                  pagados++;
                }
              }
              console.log(pagados)
              if (tabla.length == pagados) {
                this.db.ref("/prestamos/" + this.selectedItem.key).update(
                  {
                    activo: false
                  },
                  function(error) {
                    console.log(error)
                    if (error) {
                      alertify.error("Error al liquidar préstamo " + this.selectedItem.key);                      
                    } else {
                      alertify.success("PAGO PROCESADO CORRECTAMENTE");
                    }
                    this.loadingDialog = false;
                  }.bind(this)
                );
              }
            }
          }
        });
    },
    closeAlert() {
      setTimeout(() => {
        this.alert.show = false;
        this.alert.message = "";
        this.alert.style = "";
        this.showForm = false;
      }, 3000);
    },
    alerta(msj, type) {
      this.alert.style = type;
      this.alert.message = msj;
      this.alert.show = true;
    },
    selectItem(item) {
      // console.log(item);
      this.formTitle = "Aplicar de pago";
      this.formDialog = true;
      Object.assign(this.selectedItem, item);
    },
    cancel() {
      this.closeAlert();
      this.showForm = false;
      this.formDialog = false;
      Object.assign(this.selectedItem, this.defaultItem);
    },
    hoy() {
      let hoy = new Date();
      var dd = String(hoy.getDate()).padStart(2, "0");
      var mm = String(hoy.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = hoy.getFullYear();
      return dd + "-" + mm + "-" + yyyy;
    }
  },
  created() {}
};
</script>

<style>
.divisor {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>