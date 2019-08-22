<template>
  <v-container>
    <v-row>
      <v-col xs12>
        <div class="text-center">
          <v-btn @click="add" fab dark small color="light-green lighten-2">
            <v-icon dark>add</v-icon>
          </v-btn>
          <!-- <v-btn @click="renew" fab dark small color="teal">
            <v-icon dark>refresh</v-icon>
          </v-btn>-->
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs12>
        <prestamos-table opciones="normal" v-on:selectItem="selectItem($event)"></prestamos-table>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog
        v-model="formDialog"
        fullscreen
        hide-overlay        
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="#4472C4">
            <v-btn icon dark @click="cancel(1)">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                @click="confirmSave = true"
                dark
                icon
                :disabled="prestamo.tabla =='' || prestamo.key != ''"
              >
                <v-icon>save</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
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

            <v-col xs12 md8 offset-md2 d-flex v-if="showForm && prestamo.cliente != ''">
              <v-card color="grey lighten-5">
                <v-toolbar color="#4472C4" dark>
                  <v-toolbar-title>Parámetros del préstamo</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
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
                  <v-container>
                    <v-row class="text-xs-center">
                      <v-col xs6 class="headline">
                        <v-card>
                          <v-card-title class="headline title font-weight-regular">Cliente:</v-card-title>
                          <v-card-text
                            class="mx-2 subheading"
                          >{{prestamo.cliente.nombre}} {{prestamo.cliente.apaterno}} {{prestamo.cliente.amaterno}}</v-card-text>
                        </v-card>
                      </v-col>
                      <v-col xs6 class="headline">
                        <v-card>
                          <v-card-title class="headline title font-weight-regular">Comisionista:</v-card-title>
                          <v-card-text class="mx-2 body-2">{{prestamo.comisionista.nombre}}</v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                  <prestamo-form ref="prestamoForm" :prestamo="prestamo"></prestamo-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="success" @click="generarPrestamo">Calcular</v-btn>
                  <v-btn color="error" @click="cancel(0)">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-divider class="divisor" v-if="showForm && prestamo.cliente != ''"></v-divider>

            <v-col
              id="detalles-prestamo"
              xs12
              md10
              offset-md1
              xl8
              offset-xl2
              d-flex
              v-if="prestamo.tabla != ''"
            >
              <amortizacion-table :prestamo="prestamo"></amortizacion-table>
            </v-col>

            <v-divider class="divisor" v-if="prestamo.tabla != ''"></v-divider>

            <v-col
              id="caratula-prestamo"
              xs12
              md10
              offset-md1
              xl8
              offset-xl2
              d-flex
              v-if="prestamo.tabla != ''"
            >
              <caratula-credito :prestamo="prestamo"></caratula-credito>
            </v-col>

            <v-divider class="divisor" v-if="prestamo.tabla != ''"></v-divider>

            <v-col xs12 md10 offset-md1 xl8 offset-xl2 d-flex v-if="prestamo.tabla != ''">
              <pagare :prestamo="prestamo"></pagare>
            </v-col>
            <v-divider class="divisor" v-if="showForm && prestamo.cliente == ''"></v-divider>
            <v-row>
              <v-col xs12 d-flex v-if="prestamo.cliente == ''">
                <clientes-table v-on:selectClient="setSolicitud($event)" :options="2"></clientes-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="confirmationDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">¿Realmente desea guardar la información?</v-card-title>
          <v-card-text class="text-xs-justify">
            <p>Al presionar en "Si, continuar" el sistema asignará al cliente el préstamo con el balance de amortización generado.</p>
            <p>Antes de continuar asegúrese de haber comprobado que toda la información sea correcta.</p>
            <strong>Esta acción es irreversible y no podrá ser modificada posteriormente.</strong>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" flat @click="confirmationDialog = false">No, cancelar</v-btn>
            <v-btn color="green darken-1" flat @click="saveData">Si, continuar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <loading-dialog :activator="loadingDialog"></loading-dialog>
  </v-container>
</template>

<script>
import Pagare from "../components/Pagare";
import CaratulaCredito from "../components/CaratulaCredito";
import AmortizacionTable from "../components/AmortizacionTable";
import PrestamosTable from "../components/PrestamosTable";
import PrestamoForm from "../components/PrestamoForm";
import ClientesTable from "../components/ClientesTable";
import LoadingDialog from "../components/LoadingDialog";
import config from "../config";
import { setTimeout } from "timers";

export default {
  name: "Prestamos",
  components: {
    PrestamosTable,
    PrestamoForm,
    ClientesTable,
    LoadingDialog,
    AmortizacionTable,
    CaratulaCredito,
    Pagare
  },
  data() {
    return {
      db: config.db,
      formTitle: "",
      formDialog: false,
      showForm: false,
      loadingDialog: false,
      refresh: false,
      notifications: false,
      sound: true,
      widgets: false,
      alert: {
        message: "",
        style: "",
        show: false
      },
      clientes: [],
      solicitud: {
        key: "",
        aval: "",
        conyuge: "",
        referencia: "",
        solicitante: ""
      },
      defaultSolicitud: {
        key: "",
        aval: "",
        conyuge: "",
        referencia: "",
        solicitante: ""
      },
      prestamo: {
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
      defaultPrestamo: {
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
        tabla: [] //{ fecha: "", capital: "", interes: "", pago: "", inicial: "", final: "" }
      },
      confirmationDialog: false
    };
  },
  methods: {
    saveData() {
      this.loadingDialog = true;
      let formInvalid = this.$refs.prestamoForm.submit();
      if (
        this.prestamo.solicitud != "" &&
        this.prestamo.cliente != "" &&
        this.prestamo.tabla.length >= 16 &&
        formInvalid == false
      ) {
        this.db
          .ref("prestamos/")
          .push(this.prestamo)
          .then(() => {
            this.loadingDialog = false;
            this.alerta(
              "Préstamo generado y guardado correctamente",
              "success"
            );
            this.confirmationDialog = false;
            this.closeAlert();
            this.cancel(0);
          });
      } else {
        this.loadingDialog = false;
        this.alerta(
          "Para generar un préstamo primero seleccione una solicitud y complete todos los campos del formulario.",
          "error"
        );
        this.closeAlert();
      }
    },
    buscarPrestamoActivo(item) {
      // console.log(item);
      let result = false;
      this.db
        .ref("/prestamos")
        .orderByChild("cliente/key")
        .equalTo(item.key)
        .once("value", snapshot => {
          let snap = snapshot.val();
          for (let key in snap) {
            if (snap[key].activo == true) {
              // console.log(snap[key]);
              result = true;
              break;
            }
          }
        });
      return result;
    },
    generarPrestamo() {
      this.loadingDialog = true;
      let formInvalid = this.$refs.prestamoForm.submit();
      if (formInvalid == false) {
        this.prestamo.inicio = this.getDate();
        if (this.prestamo.inicio != null) {
          let pagoCapital = this.prestamo.capital / this.prestamo.plazo;
          let pagoInteres =
            (this.prestamo.capital * this.prestamo.tasa * 4) /
            this.prestamo.plazo;
          this.prestamo.pago = parseFloat(
            (pagoCapital + pagoInteres).toFixed(2)
          );
          this.prestamo.intereses = parseFloat(
            (pagoInteres * this.prestamo.plazo).toFixed(2)
          );
          this.prestamo.totalPrestamo = parseFloat(
            this.prestamo.intereses + this.prestamo.capital
          );
          this.tablaAmortizacion();
          this.loadingDialog = false;
        }
      } else {
        this.loadingDialog = false;
        this.alerta(
          "El préstamo no ha sido generado correctamente, por favor verifique la información y reintente.",
          "error"
        );
        this.closeAlert();
      }
    },
    tablaAmortizacion() {
      let pagoCapital = this.prestamo.capital / this.prestamo.plazo;
      let pagoInteres =
        (this.prestamo.capital * this.prestamo.tasa * 4) / this.prestamo.plazo;
      let totalPago = pagoCapital + pagoInteres;
      let prestamo = this.prestamo.capital + this.prestamo.intereses;
      for (let i = 0; i < this.prestamo.plazo; i++) {
        let pagoN = {
          nPago: i + 1,
          fecha: this.siguientePago(i + 1),
          vencimiento: this.fechaVencimiento(i + 1), //CAMBIAR
          pagoCapital: parseFloat(pagoCapital.toFixed(2)),
          pagoInteres: parseFloat(pagoInteres.toFixed(2)),
          totalPago: parseFloat(totalPago.toFixed(2)),
          final: parseFloat((prestamo - totalPago * (i + 1)).toFixed(2)),
          inicial: parseFloat((prestamo - totalPago * i).toFixed(2)),
          estado: "A"
        };
        this.prestamo.tabla.push(pagoN);
      }
      return this.prestamo.tabla.length == this.prestamo.plazo;
    },
    siguientePago(semanas) {
      let hoy = new Date();
      let semanasEnMilisegundos = 1000 * 60 * 60 * 24 * 7 * semanas;
      let suma = hoy.getTime() + semanasEnMilisegundos; //getTime devuelve milisegundos de esa fecha
      let proximaFecha = new Date(suma);
      var dd = String(proximaFecha.getDate()).padStart(2, "0");
      var mm = String(proximaFecha.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = proximaFecha.getFullYear();
      return dd + "-" + mm + "-" + yyyy;
    },
    fechaVencimiento(semanas) {
      let hoy = new Date();
      let semanasEnMilisegundos = 1000 * 60 * 60 * 24 * 7 * semanas;
      let diaEnMilisegundos = 1000 * 60 * 60 * 24;
      let suma = hoy.getTime() - diaEnMilisegundos + semanasEnMilisegundos; //getTime devuelve milisegundos de esa fecha
      let proximaFecha = new Date(suma);
      var dd = String(proximaFecha.getDate()).padStart(2, "0");
      var mm = String(proximaFecha.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = proximaFecha.getFullYear();
      return dd + "-" + mm + "-" + yyyy;
    },
    getDate() {
      let fecha = null;
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      fecha = dd + "-" + mm + "-" + yyyy;
      return fecha;
    },
    setSolicitud(item) {      
      this.loadingDialog = true;
      if (!this.buscarPrestamoActivo(item)) {
        this.db
          .ref("/solicitudes")
          .orderByChild("solicitante")
          .equalTo(item.key)
          .once("value", snapshot => {
            let snap = snapshot.val();
            this.solicitud = null;            
            for (let key in snap) {
              this.solicitud = snap[key];
              this.solicitud.key = key;
            }            
            if (this.solicitud != null && this.solicitud.key != "") {
              this.prestamo.solicitud = this.solicitud.key;
              this.prestamo.comisionista = item.comisionista;
              this.prestamo.cliente = item;
              this.prestamo.activo = true;
              this.loadingDialog = false;
              this.showForm = true;
            } else {
              this.showForm = false;
              this.loadingDialog = false;
              this.alerta(
                "La solicitud de crédito seleccionada no se ha cargado correctamente. Intente de nuevo más tarde.",
                "error"
              );
              this.closeAlert();
            }
          });
      } else {
        this.loadingDialog = false;
        this.showForm = false;
        this.alerta(
          "No puede asignar un nuevo préstamo a este cliente debido a que aún cuenta con un préstamo activo.",
          "error"
        );
        this.closeAlert();
      }
    },
    selectItem(item) {
      this.formTitle = "Generar préstamo";
      this.formDialog = true;
      Object.assign(this.prestamo, item);
      // console.log(this.prestamo);
    },
    add() {
      // this.cancel();
      this.formTitle = "Generar préstamo";
      this.formDialog = true;
    },
    cancel(x) {
      if (x == 1) {
        this.showForm = false;
        this.formDialog = false;
      }
      Object.assign(this.solicitud, this.defaultSolicitud);
      Object.assign(this.prestamo, this.defaultPrestamo);
    },
    closeAlert() {
      setTimeout(() => {
        this.alert.show = false;
        this.alert.message = "";
        this.alert.style = "";
        // this.cancel();
      }, 3000);
    },
    alerta(msj, type) {
      this.alert.style = type;
      this.alert.message = msj;
      this.alert.show = true;
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