<template>
  <div id="app">
    <v-app id="inspire" v-if="!user.loggedIn">
      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center>
            <v-flex xs12 sm8 md4>
              <v-card>
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <img src />
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      prepend-icon="email"
                      name="correo"
                      label="Correo electrónico"
                      type="email"
                      v-model="email"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="lock"
                      name="password"
                      label="Contraseña"
                      id="password"
                      type="password"
                      v-model="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="googleLogin()" text small color="primary">Ingresar con google</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn @click="login()" text small color="success">Iniciar sesión</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
    <v-app id="inspire" v-else>
      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center>
            <v-flex xs12 sm8 md4>
              <v-card>
                <v-toolbar dark color="#0051A0">
                  <v-toolbar-title>Sesión iniciada como:</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <img src />
                </v-toolbar>
                <v-card-text>
                  <p class="title font-weight-medium text-center">
                    <v-avatar v-if="user.data.photoURL != null">
                      <img :src="user.data.photoURL" :alt="user.data.displayName" />
                    </v-avatar>
                    <v-avatar v-else color="#0051A0">
                      <v-icon dark>mdi-account-circle</v-icon>
                    </v-avatar>
                    <br />
                    <span
                      v-if="user.data.displayName != null"
                      class="font-italic font-weight-black font-weight-bold"
                    >{{user.data.displayName}}</span>
                    <span
                      v-else
                      class="font-italic font-weight-black font-weight-bold"
                    >{{user.data.email}}</span>
                  </p>
                  <p
                    class="subtitle-2 text-center"
                  >Para iniciar sesión con otro usuario primero cierre la sesión activa.</p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="logout()" text small color="error">Cerrar sesión</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import store from "../store";
import config from "../config";
import { mapGetters } from "vuex";
import { setTimeout } from "timers";
export default {
  name: "LoginForm",
  data() {
    return {
      auth: config.auth,
      db: config.db,
      provider: config.googleAuth,
      email: "",
      password: ""
    };
  },
  methods: {
    googleLogin() {
      this.auth
        .signInWithPopup(this.provider)
        .then(
          result => {
            this.cargarPermisos(result.user);
          }
        )
        .catch(function(error) {
          console.log(error);
          alertify.error("No se pudo iniciar la sesión con Google.");
          setTimeout(() => {
            location.reload();
          }, 1500);
        });
    },
    login() {
      if (this.email.length < 4) {
        alertify.error(
          "Por favor ingrese una dirección de correo de Google válida."
        );
        return;
      }
      if (this.password.length < 4) {
        alertify.error(
          "Por favor ingrese una contraseña con 4 o más caracteres."
        );
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      this.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(data => {
          this.cargarPermisos(this.user);
        })
        .catch(function(error) {
          console.log(error);
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === "auth/wrong-password") {
            alertify.error("Contraseña incorrecta.");
            return;
          } else {            
            alertify.error(errorMessage);
            return;
          }
        });
      // [END authwithemail]
    },
    logout() {
      this.auth.signOut().then(() => {
        this.$router.replace({
          name: "login"
        });
      });
    },
    registrarUsuario() {
      this.auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    },
    cargarPermisos(user) {
      console.log(user);
      this.db //A CONTINUACIÓN CARGAMOS NUEVAMENTE LOS DATOS DEL CLIENTE DESDE LA BDD
        .ref("/usuarios")
        .orderByChild("uid")
        .equalTo(user.data.uid)
        .limitToFirst(1)
        .once("value", snapshot => {
          let snap = snapshot.val();
          let permisos = null;
          for (let key in snap) {
            permisos = snap[key];
            console.log(permisos);
          }
          if (permisos != null) {
            store.dispatch("fetchPermisos", permisos);
            alertify.success("Bienvenido " + user.displayName);
            this.$router.replace({ name: "clientes" });
          } else {
            // alertify.error(
            //   "Los datos del usuario no pudieron ser cargados correctamente."
            // );
            alertify.alert(
              "Error al iniciar sesión",
              "Los datos del usuario no pudieron ser cargados correctamente.",
              function() {}
            );
          }
        });
    }
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  }
};
</script>