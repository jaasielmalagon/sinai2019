<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center>
            <v-flex xs12 sm8 md4>
              <v-card >
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Iniciar Sesion</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <img src>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field prepend-icon="person" name="login" label="Username" type="text"></v-text-field>
                    <v-text-field
                      prepend-icon="lock"
                      name="password"
                      label="Password"
                      id="password"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary">Ingresar</v-btn>
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
export default {
  name: "LoginForm",
  data() {
    return {};
  }
};
</script>