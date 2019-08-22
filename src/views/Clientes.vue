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
        <clientes-table v-on:editClient="editItem($event)" :options="1"></clientes-table>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog
        v-model="showForm"
        fullscreen
        hide-overlay        
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar color="#4472C4" dark>
            <v-btn icon dark @click="cancel">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark @click="saveData">
                <v-icon>save</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-flex xs10 d-flex offset-xs1>
              <div>
                <v-alert
                  v-model="alertShow"
                  dismissible
                  transition="scale-transition"
                  :color="alertStyle"
                  icon="warning"
                >{{alertMessage}}</v-alert>
              </div>
            </v-flex>
            <v-divider class="divisor"></v-divider>

            <v-flex xs10 d-flex offset-xs1>
              <v-card>
                <v-toolbar color="#4472C4" dark>
                  <v-toolbar-title>Datos del solicitante</v-toolbar-title>
                </v-toolbar>
                <!-- <cliente-form
              v-if="selectedItem.key !== ''"
              v-if="selectedItem.key === ''"
              :initial-client="selectedItem"
              :comisionistas="comisionistas"
              :es-referencia="false"
              v-on:esCasado="isMarried($event)"
                ></cliente-form>-->
                <cliente-form
                  ref="form1"
                  :initial-client="solicitante"
                  :comisionistas="comisionistas"
                  :es-referencia="false"
                  v-on:esCasado="isMarried($event)"
                ></cliente-form>
              </v-card>
            </v-flex>
            <v-divider class="divisor"></v-divider>

            <v-flex v-if="married" xs10 d-flex offset-xs1>
              <v-card>
                <v-toolbar color="#4472C4" dark>
                  <v-toolbar-title>Datos del conyuge</v-toolbar-title>
                </v-toolbar>
                <cliente-form
                  ref="form2"
                  :initial-client="conyuge"
                  :comisionistas="comisionistas"
                  :es-referencia="true"
                ></cliente-form>
              </v-card>
            </v-flex>
            <v-divider v-if="married" class="divisor"></v-divider>

            <v-flex xs10 d-flex offset-xs1>
              <v-card>
                <v-toolbar color="#4472C4" dark>
                  <v-toolbar-title>Datos de la referencia</v-toolbar-title>
                </v-toolbar>
                <cliente-form
                  ref="form3"
                  :initial-client="referencia"
                  :comisionistas="comisionistas"
                  :es-referencia="true"
                ></cliente-form>
              </v-card>
            </v-flex>
            <v-divider class="divisor"></v-divider>

            <v-flex xs10 d-flex offset-xs1>
              <v-card>
                <v-toolbar color="#4472C4" dark>
                  <v-toolbar-title>Datos del aval</v-toolbar-title>
                </v-toolbar>
                <cliente-form
                  ref="form4"
                  :initial-client="aval"
                  :comisionistas="comisionistas"
                  :es-referencia="true"
                ></cliente-form>
              </v-card>
            </v-flex>
            <v-divider class="divisor"></v-divider>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <loading-dialog :activator="loadingDialog"></loading-dialog>
    <!-- <pre>{{$data}}</pre> -->
  </v-container>
</template>

<script>
import ClienteForm from "../components/ClienteForm";
import ClientesTable from "../components/ClientesTable";
import LoadingDialog from "../components/LoadingDialog";
import config from "../config";
import { setTimeout } from "timers";

export default {
  name: "Clientes",
  components: { ClienteForm, ClientesTable, LoadingDialog },
  data() {
    return {
      db: config.db,
      formTitle: "",
      showForm: false,
      loadingDialog: false,
      refresh: false,
      notifications: false,
      sound: true,
      widgets: false,
      married: false,
      alertMessage: "",
      alertStyle: "",
      alertShow: false,
      comisionistas: [],
      clientes: [],
      /*selectedItem: {
        key: "",
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: "",
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: 1,
        comisionista: ""
      },*/
      defaultCliente: {
        key: "",
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: "",
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: "",
        comisionista: ""
      },
      solicitante: {
        key: "",
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: "",
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: 1,
        comisionista: ""
      },
      conyuge: {
        key: "",
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: "",
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: 2,
        comisionista: ""
      },
      referencia: {
        key: "",
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: "",
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: 3,
        comisionista: ""
      },
      aval: {
        key: "",
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: "",
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: 4,
        comisionista: ""
      }
    };
  },
  methods: {
    editItem(item) {
      this.loadingDialog = true;
      this.cancel();
      this.formTitle = "Editar cliente";
      this.db
        .ref("/solicitudes")
        .orderByChild("solicitante")
        .equalTo(item.key)
        .once("value", snapshot => {
          this.cargarSolicitud(snapshot.val());
          setTimeout(() => {
            this.loadingDialog = false;
            this.showForm = true;
          }, 1800);
        });
    },
    cargarSolicitud(snap) {
      let solicitud = null;
      for (let key in snap) {
        solicitud = snap[key];
      }

      this.db //A CONTINUACIÓN CARGAMOS NUEVAMENTE LOS DATOS DEL CLIENTE DESDE LA BDD
        .ref("/personas")
        .orderByKey()
        .equalTo(solicitud.solicitante)
        .once("value", snapshot => {
          let snap = snapshot.val();
          for (let key in snap) {
            Object.assign(this.solicitante, snap[key]);
            this.solicitante.key = key;
          }
        });
      this.db //A CONTINUACIÓN CARGAMOS NUEVAMENTE LOS DATOS DEL CONYUGE DESDE LA BDD
        .ref("/personas")
        .orderByKey()
        .equalTo(solicitud.conyuge)
        .once("value", snapshot => {
          let snap = snapshot.val();
          for (let key in snap) {
            Object.assign(this.conyuge, snap[key]);
            this.conyuge.key = key;
          }
        });
      this.db //A CONTINUACIÓN CARGAMOS NUEVAMENTE LOS DATOS DE LA REFERENCIA DESDE LA BDD
        .ref("/personas")
        .orderByKey()
        .equalTo(solicitud.referencia)
        .once("value", snapshot => {
          let snap = snapshot.val();
          for (let key in snap) {
            Object.assign(this.referencia, snap[key]);
            this.referencia.key = key;
          }
        });
      this.db //A CONTINUACIÓN CARGAMOS NUEVAMENTE LOS DATOS DEL AVAL DESDE LA BDD
        .ref("/personas")
        .orderByKey()
        .equalTo(solicitud.aval)
        .once("value", snapshot => {
          let snap = snapshot.val();
          for (let key in snap) {
            Object.assign(this.aval, snap[key]);
            this.aval.key = key;
          }
        });
    },
    add() {
      this.cancel();
      this.formTitle = "Añadir cliente";
      this.showForm = true;
    },
    renew() {
      this.showForm = false;
      this.refresh = true;
    },
    isMarried(is) {
      this.married = is;
    },
    cancel() {
      this.showForm = false;
      Object.assign(this.solicitante, this.defaultCliente);
      Object.assign(this.conyuge, this.defaultCliente);
      Object.assign(this.aval, this.defaultCliente);
      Object.assign(this.referencia, this.defaultCliente);
      // Object.assign(this.selectedItem, this.defaultCliente);
    },
    saveData() {
      this.loadingDialog = true;
      if (
        this.$refs.form1.submit() ||
        this.$refs.form3.submit() ||
        this.$refs.form4.submit() ||
        (this.married && this.$refs.form2.submit())
      ) {
        this.loadingDialog = false;
        this.alert(
          "Existen campos vacíos en la solicitud. Para continuar por favor rellene todos los campos.",
          "error"
        );
        this.closeAlert();
      } else {
        if (
          this.solicitante.curp.length >= 16 &&
          this.solicitante.key != "" &&
          this.aval.curp.length >= 16 &&
          this.aval.key != "" &&
          this.referencia.curp.length >= 16 &&
          this.referencia.key != "" &&
          this.conyuge.key != ""
        ) {
          let flag = true;
          if (flag) {
            //ACTUALIZA SOLICITANTE
            this.db.ref("/personas/" + this.solicitante.key).transaction(
              () => {
                return this.normalizedObject(this.solicitante, 1);
              },
              (error, commited) => {
                if (error) {
                  flag = false;
                  // console.error(error);
                } else if (!commited) {
                  flag = false;
                }
              }
            );
          }
          if (flag) {
            //ACTUALIZA CONYUGE
            this.db.ref("/personas/" + this.conyuge.key).transaction(
              () => {
                return this.normalizedObject(this.conyuge, 2);
              },
              (error, commited) => {
                if (error) {
                  flag = false;
                  // console.error(error);
                } else if (!commited) {
                  flag = false;
                }
              }
            );
          }
          if (flag) {
            //ACTUALIZA REFERENCIA
            this.db.ref("/personas/" + this.referencia.key).transaction(
              () => {
                return this.normalizedObject(this.referencia, 3);
              },
              (error, commited) => {
                if (error) {
                  flag = false;
                  // console.error(error);
                } else if (!commited) {
                  flag = false;
                }
              }
            );
          }
          if (flag) {
            //ACTUALIZA AVAL
            this.db.ref("/personas/" + this.aval.key).transaction(
              () => {
                return this.normalizedObject(this.aval, 4);
              },
              (error, commited) => {
                if (error) {
                  flag = false;
                  // console.error(error);
                } else if (!commited) {
                  flag = false;
                }
              }
            );
          }
          this.loadingDialog = false;
          if (flag) {
            //ARROJA EL MENSAJE FINAL DEPENDIENDO EL ESTADO DE LA TRANSACCIÓN
            this.alert("Actualización completada exitosamente.", "success");
          } else {
            this.alert("Actualización no realizada.", "error");
          }
          this.closeAlert();
        } else if (
          this.solicitante.curp.length >= 16 &&
          this.solicitante.key == "" &&
          this.referencia.curp.length >= 16 &&
          this.aval.curp.length >= 16
        ) {
          let solicitanteKey = this.db
            .ref("personas/")
            .push(this.normalizedObject(this.solicitante, 1)).key;
          let conyugeKey = this.db
            .ref("personas/")
            .push(this.normalizedObject(this.conyuge, 2)).key;
          let referenciaKey = this.db
            .ref("personas/")
            .push(this.normalizedObject(this.referencia, 3)).key;
          let avalKey = this.db
            .ref("personas/")
            .push(this.normalizedObject(this.aval, 4)).key;
          if (
            solicitanteKey != "" &&
            // conyugeKey != "" &&
            referenciaKey != "" &&
            avalKey != ""
          ) {
            this.db
              .ref("solicitudes/")
              .push({
                solicitante: solicitanteKey,
                conyuge: conyugeKey,
                referencia: referenciaKey,
                aval: avalKey
              })
              .then(() => {
                this.loadingDialog = false;
                this.alert("Solicitud guardada exitosamente", "success");
                this.closeAlert();
              });
          }
        }
      }
    },
    normalizedObject(object, tipo) {
      return {
        nombre: object.nombre,
        apaterno: object.apaterno,
        amaterno: object.amaterno,
        bornDate: object.bornDate,
        sexo: object.sexo,
        curp: object.curp,
        ocr: object.ocr,
        direccion: object.direccion,
        telefono: object.telefono,
        entidad: object.entidad,
        tipo: tipo,
        comisionista: object.comisionista,
        activo: 1
      };
    },
    closeAlert() {
      setTimeout(() => {
        this.alertShow = false;
        this.alertIcon = "";
        this.alertMessage = "";
        this.alertStyle = "";
        // this.cancel();
      }, 3000);
    },
    alert(msj, type) {
      this.alertIcon = "new_releases";
      this.alertStyle = type;
      this.alertMessage = msj;
      this.alertShow = true;
    }
  },
  created() {
    //CARGAR COMISIONISTAS
    this.db.ref("/empleados").on("value", snapshot => {
      this.comisionistas = [];
      let items = snapshot.val();
      for (let key in items) {
        this.comisionistas.push(items[key]);
      }
    });
  }
};
</script>

<style>
.divisor {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>