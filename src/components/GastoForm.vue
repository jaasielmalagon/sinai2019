<template>
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col xs12>
            <v-alert :value="true" type="info" dismissible>
              Ingrese los datos del gasto y presione el botón
              <v-icon color="white">save</v-icon>en la parte superior.
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-menu
              ref="datemenu"
              v-model="datemenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              full-width
              min-width="100px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="gasto.fecha"
                  label="Fecha"
                  readonly
                  v-on="on"
                  :error-messages="fechaErrors"
                  @change="$v.gasto.fecha.$touch()"
                  @blur="$v.gasto.fecha.$touch()"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="gasto.fecha"
                ref="picker"
                :max="maxDate"
                min="2018-01-01"
                @change="date"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="gasto.monto"
              label="Monto"
              prefix="$"
              required
              :error-messages="montoErrors"
              @change="$v.gasto.monto.$touch()"
              @blur="$v.gasto.monto.$touch()"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="gasto.concepto"
              label="Concepto"
              required
              :error-messages="conceptoErrors"
              @change="$v.gasto.concepto.$touch()"
              @blur="$v.gasto.concepto.$touch()"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="gasto.observaciones" label="Observaciones"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
/* eslint-disable */
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  decimal
} from "vuelidate/lib/validators";

export default {
  name: "GastoForm",
  mixins: [validationMixin],
  validations: {
    gasto: {
      fecha: { required },
      monto: { required, decimal },
      concepto: { required }
    }
  },
  data() {
    return {
      gasto: {
        fecha: "",
        monto: "",
        concepto: "",
        observaciones: ""
      },
      datemenu: false
    };
  },
  computed: {
    maxDate() {
      let hoy = new Date();
      var dd = String(hoy.getDate()).padStart(2, "0");
      var mm = String(hoy.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = hoy.getFullYear();
      // return dd + "-" + mm + "-" + yyyy;
      return yyyy + "-" + mm + "-" + dd;
    },
    fechaErrors() {
      const errors = [];
      if (!this.$v.gasto.fecha.$dirty) return errors;
      !this.$v.gasto.fecha.required &&
        errors.push("Es necesario indicar la fecha del gasto");
      return errors;
    },
    conceptoErrors() {
      const errors = [];
      if (!this.$v.gasto.concepto.$dirty) return errors;
      !this.$v.gasto.concepto.required &&
        errors.push("Indique en qué se ha gastado el dinero");
      return errors;
    },
    montoErrors() {
      const errors = [];
      if (!this.$v.gasto.monto.$dirty) return errors;
      !this.$v.gasto.monto.required &&
        errors.push("Indique la cantidad gastada");
      !this.$v.gasto.monto.decimal &&
        errors.push("Este campo solo se admite números");
      this.$v.gasto.monto.decimal < 1 &&
        errors.push("Este campo solo se admite números");
      return errors;
    }
  },
  methods: {
    date(date) {
      this.$refs.datemenu.save(date);
      // console.log(this.gasto.fecha);
    },
    clear() {
      this.gasto = { fecha: "", monto: 0, concepto: "", observaciones: "" };
      this.menu = false;
      this.$v.$reset();
    },
    submit() {
      this.$v.$touch();
      return this.$v.$error; //retorna true o false
    }
  }
};
</script>
