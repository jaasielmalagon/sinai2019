<template>
  <v-container fluid v-if="user.loggedIn">
    <v-row no-gutters>
      <v-col cols="12" xs="12">
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
    <v-row no-gutters>
      <v-col cols="12" xs="12">
        <clientes-table v-on:editClient="editItem($event)" :options="1"></clientes-table>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="showForm" fullscreen transition="dialog-bottom-transition">
        <v-card id="lateral">
          <v-toolbar dense color="#0051A0" dark>
            <v-btn icon @click="resetValues">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Registrar cliente</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="saveData">
              <v-icon>save</v-icon>
            </v-btn>
            <!-- <template v-slot:extension>
              <v-btn @click="saveData" fab color="green" dark small bottom right absolute>
                <v-icon>save</v-icon>
              </v-btn>
            </template>-->
            <template v-slot:extension>
              <v-tabs
                v-model="tabs"
                background-color="#0051A0"
                fixed-tabs
                centered
                dark
                icons-and-text
              >
                <v-tabs-slider></v-tabs-slider>

                <v-tab href="#one" @click="changeTipoCliente('D')">
                  Diario
                  <v-icon>payment</v-icon>
                </v-tab>

                <v-tab href="#two" active-class @click="changeTipoCliente('S')">
                  Semanal
                  <v-icon>remove_red_eye</v-icon>
                </v-tab>
              </v-tabs>
            </template>
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
                    <v-alert
                      :value="alertShow"
                      dismissible
                      dense
                      outlined
                      :type="alertStyle"
                      transition="scale-transition"
                    >{{alertMessage}}</v-alert>
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
                          :es-aval="true"
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
    <pre>{{user}}</pre>
  </v-container>
</template>

<script>
import ClienteDiarioForm from "../components/ClienteDiarioForm";
import ClienteForm from "../components/ClienteForm";
import ClientesTable from "../components/ClientesTable";
import LoadingDialog from "../components/LoadingDialog";
import config from "../config";
import { setTimeout } from "timers";
import { mapGetters } from "vuex";
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
      hidden: false,
      clientFound: false,
      tipoCliente: "D",
      whoIsFound: []
    };
  },
  methods: {
    resetValues() {
      Object.assign(this.solicitante, this.defaultCliente);
      Object.assign(this.conyuge, this.defaultCliente);
      Object.assign(this.referencia, this.defaultCliente);
      Object.assign(this.aval, this.defaultCliente);
      Object.assign(this.clientediario, this.defaultCliente);
      this.showForm = false;
    },
    changeTipoCliente(tipo) {
      this.tipoCliente = tipo;
      // console.log(this.tipoCliente);
    },
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
      if (solicitud.solicitante != undefined && solicitud.solicitante != "") {
        this.db //A CONTINUACIÓN CARGAMOS NUEVAMENTE LOS DATOS DEL CLIENTE DESDE LA BDD
          .ref("/personas")
          .orderByKey()
          .equalTo(solicitud.solicitante)
          .once("value", snapshot => {
            let snap = snapshot.val();
            for (let key in snap) {
              if (snap[key].tipoPrestamo == "S") {
                Object.assign(this.solicitante, snap[key]);
                console.log(solicitud, this.solicitante.tipoPrestamo);
                this.tipoCliente = this.solicitante.tipoPrestamo;
                if (solicitud.conyuge != undefined && solicitud.conyuge != "") {
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
                }
                if (
                  solicitud.referencia != undefined &&
                  solicitud.referencia != ""
                ) {
                  this.db //A CONTINUACIÓN CARGAMOS NUEVAMENTE LOS DATOS DE LA REFERENCIA DESDE LA BDD
                    .ref("/personas")
                    .orderByKey()
                    .equalTo(solicitud.referencia)
                    .once("value", snapshot => {
                      let snap = snapshot.val();
                      console.log(snap);
                      for (let key in snap) {
                        Object.assign(this.referencia, snap[key]);
                        this.referencia.key = key;
                      }
                    });
                }
                if (solicitud.aval != undefined && solicitud.aval != "") {
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
                }
                this.tabs = "two";
              } else if (snap[key].tipoPrestamo == "D") {
                Object.assign(this.clientediario, snap[key]);
                this.tabs = "one";
                this.tipoCliente = this.clientediario.tipoPrestamo;
              }
              this.solicitante.key = key;
            }
          });
      }
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
    insertarDiario() {
      let cliente = this.normalizedObject(this.clientediario, 1, "D");
      this.searchClient(cliente);
      setTimeout(() => {
        if (this.clientFound == false) {
          let clienteKey = this.db.ref("personas/").push(cliente).key;
          if (clienteKey != "") {
            this.db
              .ref("solicitudes/")
              .push({
                solicitante: clienteKey
              })
              .then(() => {
                this.loadingDialog = false;
                alertify.success("Cliente guardado exitosamente");
                Object.assign(this.clientediario, this.defaultCliente);
              });
          }
        } else {
          this.loadingDialog = false;
          alertify.error("Los datos ingresados ya se encuentran registrados.");
        }
      }, 1800);
    },
    insertarSemanal() {
      let solicitante = this.normalizedObject(this.solicitante, 1, "S");
      let existeSolicitante = this.searchClient(solicitante);
      let conyuge = this.normalizedObject(this.conyuge, 2, "S");
      // let existeConyuge = this.searchClient(conyuge);
      let referencia = this.normalizedObject(this.referencia, 3, "S");
      // let existeReferencia = this.searchClient(referencia);
      let aval = this.normalizedObject(this.aval, 4, "S");
      let existeAval = this.searchClient(aval);
      setTimeout(() => {
        // console.log(solicitante);
        console.log(this.clientFound);
        // return;
        if (
          // this.existeSolicitante != true &&
          // this.existeConyuge != true &&
          // this.existeReferencia != true &&
          // this.existeAval != true
          this.clientFound == false
        ) {
          let solicitanteKey = this.db.ref("personas/").push(solicitante).key;
          let conyugeKey = this.db.ref("personas/").push(conyuge).key;
          let referenciaKey = this.db.ref("personas/").push(referencia).key;
          let avalKey = this.db.ref("personas/").push(aval).key;
          if (
            solicitanteKey != "" &&
            // conyugeKey != "" &&
            // referenciaKey != "" &&
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
                alertify.success("Solicitud guardada exitosamente");
              });
          }
        } else {
          let quien = "";
          console.log(this.whoIsFound);
          for (let i = 0; i < this.whoIsFound.length; i++) {
            quien +=
              this.whoIsFound[i].nombre +
              " " +
              this.whoIsFound[i].apaterno +
              " " +
              this.whoIsFound[i].amaterno;
            if (this.whoIsFound.length > 1 && this.whoIsFound.length + 1 < i) {
              quien += ", ";
            }
          }
          alertify.error(
            "Los datos de " + quien + " ya se encuentran registrados."
          );
          this.loadingDialog = false;
        }
      }, 2500);
    },
    actualizarSemanal() {
      let flag = true;
      if (flag) {
        //ACTUALIZA SOLICITANTE
        this.db.ref("/personas/" + this.solicitante.key).transaction(
          () => {
            return this.normalizedObject(this.solicitante, 1, "S");
          },
          (error, commited) => {
            if (error) {
              flag = false;
              console.error(error);
            } else if (!commited) {
              flag = false;
            }
          }
        );
      }
      if (
        flag &&
        typeof this.conyuge.key != undefined &&
        typeof this.conyuge.key != ""
      ) {
        //ACTUALIZA CONYUGE
        this.db.ref("/personas/" + this.conyuge.key).transaction(
          () => {
            return this.normalizedObject(this.conyuge, 2, "S");
          },
          (error, commited) => {
            if (error) {
              flag = false;
              console.error(error);
            } else if (!commited) {
              flag = false;
            }
          }
        );
      }
      if (
        flag &&
        typeof this.referencia.key != undefined &&
        typeof this.referencia.key != ""
      ) {
        //ACTUALIZA REFERENCIA
        this.db.ref("/personas/" + this.referencia.key).transaction(
          () => {
            return this.normalizedObject(this.referencia, 3, "S");
          },
          (error, commited) => {
            if (error) {
              flag = false;
              console.error(error);
            } else if (!commited) {
              flag = false;
            }
          }
        );
      }
      if (
        flag &&
        typeof this.aval.key != undefined &&
        typeof this.aval.key != ""
      ) {
        //ACTUALIZA AVAL
        this.db.ref("/personas/" + this.aval.key).transaction(
          () => {
            return this.normalizedObject(this.aval, 4, "S");
          },
          (error, commited) => {
            if (error) {
              flag = false;
              console.error(error);
            } else if (!commited) {
              flag = false;
            }
          }
        );
      }
      console.log(flag);
      this.loadingDialog = false;
      if (flag) {
        //ARROJA EL MENSAJE FINAL DEPENDIENDO EL ESTADO DE LA TRANSACCIÓN
        alertify.success("Actualización completada exitosamente.");
      } else {
        alertify.error("Actualización no realizada.");
      }
    },
    actualizarDiario() {
      this.db.ref("/personas/" + this.solicitante.key).transaction(
        () => {
          return this.normalizedObject(this.clientediario, 1, "D");
        },
        (error, commited) => {
          console.log(error, commited);
          if (error) {
            //ARROJA EL MENSAJE FINAL DEPENDIENDO EL ESTADO DE LA TRANSACCIÓN
            this.loadingDialog = false;
            alertify.error("Ocurrió un error. Actualización no realizada.");
          } else {
            this.loadingDialog = false;
            alertify.success("Actualización completada exitosamente.");
          }
        }
      );
    },
    guardarDiario() {
      //Para clientes de tipo diario
      if (this.tipoCliente == "D" && this.$refs.form0.submit() == true) {
        this.loadingDialog = false;
        alertify.error(
          "Existen campos vacíos en la solicitud, por favor rellene todos los campos."
        );
      } else if (
        this.tipoCliente == "D" &&
        this.$refs.form0.submit() == false
      ) {
        //GUARDAR CLIENTE TIPO DIARIO EN LA BDD
        if (this.solicitante.key != null && this.solicitante.key != undefined) {
          //ACTUALIZAR CLIENTE
          this.actualizarDiario();
        } else {
          //GUARDAR NUEVO CLIENTE
          this.insertarDiario();
        }
      }
    },
    guardarSemanal() {
      if (
        //ERROR clientes de tipo semanal por campos vacíos en los forms
        this.tipoCliente == "S" &&
        this.$refs.form1.submit() == true &&
        this.$refs.form4.submit() == true
      ) {
        this.loadingDialog = false;
        alertify.error(
          "Existen campos vacíos en la solicitud, por favor rellene todos los campos."
        );
      } else if (
        //INSERTAR EL CLIENTE SEMANAL
        this.tipoCliente == "S" &&
        this.$refs.form1.submit() == false &&
        this.$refs.form4.submit() == false
      ) {
        if (
          //ACTUALIZARLO SI YA EXISTE
          this.solicitante.curp.length >= 16 &&
          this.solicitante.key != "" &&
          this.aval.curp.length >= 16 &&
          this.aval.key != ""
        ) {
          this.actualizarSemanal();
        } else if (
          //INSERTAR SI NO EXISTE EL CLIENTE
          this.solicitante.curp.length >= 16 &&
          this.solicitante.key == "" &&
          this.aval.curp.length >= 16
        ) {
          this.insertarSemanal();
        } else {
          this.loadingDialog = false;
          alertify.error(
            "Los datos no pudieron ser guardados debido a un error desconocido."
          );
        }
      }
    },
    saveData() {
      this.loadingDialog = true;
      this.whoIsFound = [];
      this.clientFound = false;
      if (this.tabs == "one") {
        this.guardarDiario();
      } else if (this.tabs == "two") {
        this.guardarSemanal();
      }
    },
    searchClient(cliente) {
      this.db
        .ref("/personas")
        .orderByChild("curp")
        .equalTo(cliente.curp)
        .once("value", snapshot => {
          console.log(snapshot.val());
          if (snapshot.val() != null) {
            this.clientFound = true;
            return true;
          }
        });
      this.db
        .ref("/personas")
        .orderByChild("ocr")
        .equalTo(cliente.ocr)
        .once("value", snapshot => {
          console.log(snapshot.val());
          if (snapshot.val() != null) {
            this.clientFound = true;
            return true;
          }
        });
      this.db
        .ref("/personas")
        .orderByChild("telefono")
        .equalTo(cliente.telefono)
        .once("value", snapshot => {
          console.log(snapshot.val());
          if (snapshot.val() != null) {
            this.clientFound = true;
            return true;
          }
        });
      this.whoIsFound.push(cliente);
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
    },
    verifyLogin() {      
      if (this.user.loggedIn == false) {
        this.$router.replace({ name: "login" });
      } else {
        //CARGAR COMISIONISTAS
        this.db.ref("/empleados").on("value", snapshot => {
          this.comisionistas = [];
          let items = snapshot.val();
          for (let key in items) {
            this.comisionistas.push(items[key]);
          }
        });
      }
    }
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    }),
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
  mounted() {
    this.verifyLogin();
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