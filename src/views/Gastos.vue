<template>
  <v-container>
    <v-row>
      <v-col xs12>
        <div class="text-center">
          <v-btn @click="add" fab dark color="light-green lighten-2">
            <v-icon dark>add</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs12>
        <gastos-table></gastos-table>
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
            <v-spacer></v-spacer>
            <!-- <v-toolbar-items>
              <v-btn @click="confirmSave = true" dark icon>
                <v-icon>save</v-icon>
              </v-btn>
            </v-toolbar-items> -->
          </v-toolbar>
          <v-card-text>
            <v-col xs12 md8 offset-md2 d-flex>
              <v-card color="grey lighten-5">
                <v-toolbar color="#4472C4" dark>
                  <v-toolbar-title>Detalles del gasto</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-col xs12 md4 d-flex offset-md4 style="margin-bottom: 5px">
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
                  <gasto-form ref="gastoForm"></gasto-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" dark icon @click="$refs.gastoForm.clear()"><v-icon>close</v-icon></v-btn>
                  <v-btn color="success" dark icon @click="saveData"><v-icon>save</v-icon></v-btn>                  
                </v-card-actions>
              </v-card>
            </v-col>
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
import GastosTable from "../components/GastosTable";
import GastoForm from "../components/GastoForm";
import LoadingDialog from "../components/LoadingDialog";
import config from "../config";
import { setTimeout } from "timers";

export default {
  name: "Gastos",
  components: {
    GastosTable,
    GastoForm,
    LoadingDialog
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
      confirmationDialog: false
    };
  },
  methods: {
    saveData() {
      this.loadingDialog = true;
      let formInvalid = this.$refs.gastoForm.submit();
      if (formInvalid == false) {
        let gasto = this.$refs.gastoForm.gasto;
        this.db
          .ref("gastos/")
          .push({
            concepto: gasto.concepto,
            fecha:
              gasto.fecha.substring(8, 10) +
              "-" +
              gasto.fecha.substring(5, 7) +
              "-" +
              gasto.fecha.substring(0, 4),
            observaciones: gasto.observaciones,
            monto: Number(gasto.monto)
          })
          .then(() => {
            this.loadingDialog = false;
            this.alerta("Gasto registrado correctamente", "success");
            this.confirmationDialog = false;
            this.closeAlert();
            this.$refs.gastoForm.clear();
          });
      } else {
        this.loadingDialog = false;
        this.alerta("No se permite dejar campos vacíos", "error");
        this.closeAlert();
      }
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
    selectItem(item) {
      this.formTitle = "Generar préstamo";
      this.formDialog = true;
      Object.assign(this.prestamo, item);
      // console.log(this.prestamo);
    },
    add() {
      this.formTitle = "Agregar gasto";
      this.formDialog = true;
    },
    cancel() {
      this.$refs.gastoForm.clear();
      this.showForm = false;
      this.formDialog = false;
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
    },
    verifyLogin(){
      if (this.user.loggedIn == false) {
        this.$router.replace({ name: "login" });
      }
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