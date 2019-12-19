<template>
  <div id="app">
    <v-app id="inspire">
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
                  <v-spacer></v-spacer>
                  <v-btn @click="login()" color="primary">Ingresar</v-btn>
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
import config from "../config";
export default {
  name: "LoginForm",
  data() {
    return {
      auth: config.auth,
      email: "",
      password: "",
      user: {
        uid: null,
        displayName: null,
        photoURL: null,
        email: null,
        phoneNumber: null
      }
    };
  },
  methods: {
    login() {
      if (this.email.length < 4) {
        alertify.error("Please enter an email address.");
        return;
      }
      if (this.password.length < 4) {
        alertify.error("Please enter a password.");
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      this.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(data => {
          this.auth.onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              this.user.uid = user.uid;
              this.user.displayName = user.displayName;
              this.user.photoURL = user.photoURL;
              this.user.email = user.email;
              this.user.phoneNumber = user.phoneNumber;
              localStorage.setItem("user", JSON.stringify(this.user));              
              console.log(this.user);
            }
          });
          this.$router.replace({ name: "Dashboard" });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === "auth/wrong-password") {
            alertify.error("Wrong password.");
            return;
          } else {
            alertify.error(errorMessage);
            return;
          }
        });
      // [END authwithemail]
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
    }
  },
  mounted() {
    // this.user = JSON.parse(localStorage.getItem("user"));
  }
};
</script>