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
      <v-dialog v-model="showForm" fullscreen transition="dialog-bottom-transition">
        <v-card id="lateral">
          <v-toolbar dense color="#0051A0">
            <template v-slot:extension>
              <v-btn @click="saveData" fab color="green" dark small bottom right absolute>
                <v-icon>save</v-icon>
              </v-btn>
            </template>
            <v-tabs v-model="tabs" background-color="#0051A0" centered dark icons-and-text>
              <v-tabs-slider></v-tabs-slider>

              <v-tab href="#one">
                Diario
                <v-icon>payment</v-icon>
              </v-tab>

              <v-tab href="#two">
                Semanal
                <v-icon>remove_red_eye</v-icon>
              </v-tab>
            </v-tabs>
          </v-toolbar>
          <v-card-text flat class="grey lighten-3 text-center">
            <v-tabs-items v-model="tabs">
              <v-tab-item value="one">
                <v-card flat class="grey lighten-3 text-center">
                  <v-card-text style="overflow-y: scroll; max-height:800px; margin-top: 8px;">
                    <v-alert
                      :value="alertShow"
                      dismissible
                      dense
                      outlined
                      :type="alertStyle"
                      transition="scale-transition"
                    >{{alertMessage}}</v-alert>
                    <cliente-diario-form
                      ref="form0"
                      :initial-client="clientediario"
                      :comisionistas="comisionistas"
                    ></cliente-diario-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item value="two">
                <v-card flat class="grey lighten-3 text-center">
                  <v-card-text style="overflow-y: scroll; max-height:800px; margin-top: 8px;">
                    <v-flex xs10 d-flex>
                      <v-alert
                        :value="alertShow"
                        dismissible
                        dense
                        outlined
                        :type="alertStyle"
                        transition="scale-transition"
                      >{{alertMessage}}</v-alert>
                    </v-flex>
                    <v-divider class="divisor"></v-divider>

                    <v-flex xs12>
                      <v-card>
                        <v-toolbar color="#4472C4" dark>
                          <v-toolbar-title>Datos del solicitante</v-toolbar-title>
                        </v-toolbar>
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

                    <v-flex v-if="married" xs12>
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

                    <v-flex xs12>
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

                    <v-flex xs12>
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
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
          <!-- <v-fab-transition>
            <v-btn :key="activeFab.icon" :color="activeFab.color" fab dark top right>
              <v-icon>{{ activeFab.icon }}</v-icon>
            </v-btn>
          </v-fab-transition>-->
        </v-card>
      </v-dialog>
    </v-row>
    <loading-dialog :activator="loadingDialog"></loading-dialog>
    <!-- <pre>{{$data}}</pre> -->
  </v-container>
</template>

<script>
import ClienteDiarioForm from "../components/ClienteDiarioForm";
import ClienteForm from "../components/ClienteForm";
import ClientesTable from "../components/ClientesTable";
import LoadingDialog from "../components/LoadingDialog";
import config from "../config";
import { setTimeout } from "timers";

export default {
  name: "Clientes",
  components: { ClienteForm, ClientesTable, LoadingDialog, ClienteDiarioForm },
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
      alertStyle: "error",
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
      clientediario: {
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
        comisionista: "",
        ocupacion: ""
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
      },
      tabs: null,
      fab: false,
      hidden: false
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
        typeof this.$refs.form0 !== "undefined" &&
        this.$refs.form0.submit() == true
      ) {
        this.loadingDialog = false;
        this.alert(
          "Existen campos vacíos en la solicitud. Para continuar por favor rellene todos los campos.",
          "error"
        );
        this.closeAlert();
      } else if (
        typeof this.$refs.form0 !== "undefined" &&
        this.$refs.form0.submit() == false
      ) {
        //INSERTAR EN LA BDD
        // alert("Insertando en la BDD");
        let clienteKey = this.db
          .ref("personas/")
          .push(this.normalizedObject(this.clientediario, 1, "D")).key;

        if (clienteKey != "") {
          this.db
            .ref("solicitudes/")
            .push({
              solicitante: clienteKey
            })
            .then(() => {
              this.loadingDialog = false;
              this.alert("Cliente guardado exitosamente", "success");
              this.closeAlert();
              Object.assign(this.clientediario, this.defaultCliente);
            });
        }
      } else if (
        ((typeof this.$refs.form1 == "undefined" ||
          typeof this.$refs.form3 == "undefined" ||
          typeof this.$refs.form4 == "undefined") &&
          (this.$refs.form1.submit() ||
            this.$refs.form3.submit() ||
            this.$refs.form4.submit())) ||
        (this.married && this.$refs.form2.submit())
      ) {
        this.loadingDialog = false;
        this.alert(
          "Existen campos vacíos en la solicitud. Para continuar por favor rellene todos los campos.",
          "error"
        );
        this.closeAlert();
      } else if (
        ((typeof this.$refs.form1 !== "undefined" ||
          typeof this.$refs.form3 !== "undefined" ||
          typeof this.$refs.form4 !== "undefined") &&
          (this.$refs.form1.submit() == false ||
            this.$refs.form3.submit() == false ||
            this.$refs.form4.submit() == false)) ||
        (this.married && this.$refs.form2.submit())
      ) {
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
            .push(this.normalizedObject(this.solicitante, 1, "S")).key;
          let conyugeKey = this.db
            .ref("personas/")
            .push(this.normalizedObject(this.conyuge, 2, "S")).key;
          let referenciaKey = this.db
            .ref("personas/")
            .push(this.normalizedObject(this.referencia, 3, "S")).key;
          let avalKey = this.db
            .ref("personas/")
            .push(this.normalizedObject(this.aval, 4, "S")).key;
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
    normalizedObject(object, tipo, tipoPrestamo) {
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
        tipoPrestamo: tipoPrestamo,
        comisionista: object.comisionista,
        activo: 1
      };
    },
    closeAlert() {
      setTimeout(() => {
        this.alertShow = false;
        this.alertIcon = "";
        this.alertMessage = "";
        // this.alertStyle = "";
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
  computed: {
    activeFab() {
      switch (this.tabs) {
        case "one":
          return { color: "success", icon: "share" };
        case "two":
          return { color: "red", icon: "edit" };
        case "three":
          return { color: "green", icon: "keyboard_arrow_up" };
        default:
          return {};
      }
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
#lateral .v-btn--example {
  bottom: 0;
  position: absolute;
  margin: 0 0 16px 16px;
}
</style>