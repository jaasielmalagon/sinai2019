<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="display-4 text-xs-center">There's nothing.</div>
      </v-flex>
    </v-layout>
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
  name: "CierreDiario",
  data() {
    return {
      db: config.db,
      pago: {
        idPago: "",
        idCliente: "",
        monto: 0.0,
        concepto: "",
        fecha: ""
      },
      aplicacionPago: {
        idPago: "",
        idCargoAbono: "",
        amortizacionCapital: 0.0,
        interes: 0.0,
        total: 0.0,
        fecha: ""
      },
      cargoAbono: {
        idCargo: "",
        idVencimiento: "",
        idContrato: "",
        idCliente: "",
        amortizacion: 0.0,
        interes: 0.0,
        total: 0.0,
        fechaPagoVencimiento: "",
        fechaPago: "",
        estado: "",
        refinanciamiento: 0 //1 = con, 0 = sin
      },
      vencimiento: {
        idPrestamo: "",
        nPago: "",
        idCliente: "",
        saldoInicial: "",
        saldoFinal: "",
        capital: "",
        interes: "",
        totalPago: "",
        fechaExigible: "",
        estado: "", //0 = no exigible, 1 = exigible
        refinanciamiento: "", //1 = con, 0 = sin
        fechaVencimiento: "",
        fechaProcesado: ""
      },
      tipoMovimiento: {
        id: 0,
        descripcion: "",
        estado: 0 //1 = activo, 2 = inactivo
      },
      cierre: {
        key: "",
        inicioCierre: "",
        finalCierre: ""
      }
    };
  },
  methods: {
    saveData() {},
    fechaCierre() {
      if (this.cierre.key == "") {
        this.cierre.key = this.db.ref("/fechasCierre").push({
          inicioCierre: this.today(),
          finalCierre: ""
        }).key;
      } else {
        var updates = {};
        updates["/fechasCierre/" + this.cierre.key + "/finalCierre/"] = this.today(); //exigible
        this.db.ref().update(updates);
      }
    },
    moratorios() {
      let today = this.today();
      this.db
        .ref("/cargoabono")
        .orderByChild("fechaPagoVencimiento")
        .equalTo(today)
        .once("value", snapshot => {
          let snap = snapshot.val();
          for (let key in snap) {
            if (snap[key].estado == "N") {
              this.db.ref("/cargoabono").push({
                idVencimiento: "",
                idContrato: snap[key].idContrato,
                idCliente: snap[key].idCliente,
                idMovimiento: 7,
                amortizacion: 50,
                interes: 0,
                total: 50,
                fechaPagoVencimiento: this.tomorrow(),
                fechaPago: "",
                estado: "N",
                refinanciamiento: 0 //1 = con, 0 = sin
              });
            }
          }
        });
    },
    cargos() {
      let today = this.today();
      let tomorrow = this.tomorrow();
      this.db
        .ref("/vencimientos")
        .orderByChild("fechaExigible")
        .equalTo(tomorrow)
        .once("value", snapshot => {
          let snap = snapshot.val();
          for (let key in snap) {
            if (snap[key].estado == 0) {
              this.cargoAbono = {
                idVencimiento: key,
                idContrato: snap[key].idPrestamo,
                idCliente: snap[key].idCliente,
                idMovimiento: 14,
                amortizacion: snap[key].capital,
                interes: snap[key].interes,
                total: snap[key].totalPago,
                fechaPagoVencimiento: snap[key].fechaExigible,
                fechaPago: "",
                estado: "N",
                refinanciamiento: 0 //1 = con, 0 = sin
              };
              // key del nuevo item.
              var newKey = this.db
                .ref()
                .child("cargoabono")
                .push().key;
              var updates = {};
              updates["/cargoabono/" + newKey] = this.cargoAbono;
              updates["/vencimientos/" + key + "/estado/"] = 1; //exigible

              this.db.ref().update(updates);
            }
          }
        });
    },
    vencimientos() {
      this.db.ref("/prestamos").once("value", snapshot => {
        let snap = snapshot.val();
        let today = this.today();
        let tomorrow = this.tomorrow();
        // console.log(tomorrow);
        for (let key in snap) {
          for (let i = 0; i < snap[key].tabla.length; i++) {
            if (
              snap[key].tabla[i].vencimiento == tomorrow &&
              snap[key].tabla[i].estado == "A"
            ) {
              this.vencimiento = {
                idPrestamo: key,
                nPago: i,
                idCliente: snap[key].cliente.key,
                saldoInicial: snap[key].tabla[i].inicial,
                saldoFinal: snap[key].tabla[i].final,
                capital: snap[key].tabla[i].pagoCapital, //para qué?????
                interes: snap[key].tabla[i].pagoInteres,
                totalPago: snap[key].tabla[i].totalPago,
                estado: 0, //0 = no exigible, 1 = exigible
                refinanciamiento: 0, //1 = con, 0 = sin
                fechaExigible: snap[key].tabla[i].fecha,
                fechaVencimiento: snap[key].tabla[i].vencimiento,
                fechaProcesado: today
              };
              // key del nuevo item.
              var newPostKey = this.db
                .ref()
                .child("vencimientos")
                .push().key;
              var updates = {};
              updates["/vencimientos/" + newPostKey] = this.vencimiento;
              updates["/prestamos/" + key + "/tabla/" + i + "/estado/"] = "P";

              this.db.ref().update(updates);
            }
          }
        }
      });
    },
    today() {
      let hoy = new Date();
      var dd = String(hoy.getDate()).padStart(2, "0");
      var mm = String(hoy.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = hoy.getFullYear();
      return dd + "-" + mm + "-" + yyyy;
    },
    tomorrow() {
      let hoy = new Date();
      let diasEnMilisegundos = 1000 * 60 * 60 * 24 * 2;
      let suma = hoy.getTime() + diasEnMilisegundos; //getTime devuelve milisegundos de esa fecha
      let proximaFecha = new Date(suma);
      var dd = String(proximaFecha.getDate()).padStart(2, "0");
      var mm = String(proximaFecha.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = proximaFecha.getFullYear();
      return dd + "-" + mm + "-" + yyyy;
    }
  },
  created() {
    this.fechaCierre();
    // this.vencimientos();
    // this.cargos();
    // this.moratorios();
    // this.fechaCierre();
  }
};
</script>

<style>
.divisor {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>