<template>
  <div>
    <v-form>
      <v-container fluid>
        <v-row>
          <v-col cols="12" xs="12">
            <v-alert :value="true" type="info" dismissible>
              Seleccione los parámetros del préstamo y posteriormente presione el botón "Calcular" para generar la tabla de amortización.
              <br />Una vez verificados los datos presione el botón
              <v-icon color="white">save</v-icon>para generar el préstamo.
            </v-alert>
          </v-col>
          <v-col cols="12" xs="12" md="6">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              full-width
              min-width="100px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="prestamo.inicio"
                  label="Fecha de inicio"
                  :error-messages="formErrors"
                  readonly
                  v-on="on"
                  @input="$v.prestamo.inicio.$touch()"
                  @blur="$v.prestamo.inicio.$touch()"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="prestamo.inicio"
                ref="picker"
                @change="saveDate"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" xs="12" md="6">
            <v-select
              v-model="prestamo.capital"
              :items="capitales"
              item-text="label"
              item-value="value"
              label="Monto de préstamo"
              required
              :disabled="estado"
              :error-messages="formErrors"
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" md="6">
            <v-select
              v-model="prestamo.tipo"
              :items="tipos"
              item-text="label"
              item-value="value"
              label="Tipo de pago"
              required
              :disabled="estado"
              :error-messages="formErrors"
              @change="setSelectedValues()"
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" md="6">
            <v-select
              v-model="prestamo.tasa"
              :items="tasas"
              item-text="label"
              item-value="value"
              label="Tasa de interés"
              required
              :disabled="estado"
              :error-messages="formErrors"
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" md="6">
            <v-select
              v-model="prestamo.plazo"
              :items="plazos"
              item-text="label"
              item-value="value"
              label="Plazo de crédito"
              required
              :disabled="estado"
              :error-messages="formErrors"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
/* eslint-disable */
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";

export default {
  name: "PrestamoForm",
  props: {
    estado: Boolean,
    prestamo: {
      type: Object,
      required: true
    }
  },
  mixins: [validationMixin],
  validations: {
    prestamo: {
      capital: { required },
      tipo: { required },
      tasa: { required },
      plazo: { required },
      inicio: { required }
    }
  },
  data() {
    return {
      capitales: [
        { id: 1, value: 1000, label: "$1000" },
        { id: 2, value: 2000, label: "$2000" },
        { id: 3, value: 3000, label: "$3000" },
        { id: 4, value: 4000, label: "$4000" },
        { id: 5, value: 5000, label: "$5000" },
        { id: 6, value: 6000, label: "$6000" },
        { id: 7, value: 7000, label: "$7000" },
        { id: 8, value: 8000, label: "$8000" },
        { id: 9, value: 9000, label: "$9000" },
        { id: 10, value: 10000, label: "$10000" },
        { id: 11, value: 11000, label: "$11000" },
        { id: 12, value: 12000, label: "$12000" },
        { id: 13, value: 13000, label: "$13000" },
        { id: 14, value: 14000, label: "$14000" },
        { id: 15, value: 15000, label: "$15000" },
        { id: 16, value: 16000, label: "$16000" },
        { id: 17, value: 17000, label: "$17000" },
        { id: 18, value: 18000, label: "$18000" },
        { id: 19, value: 19000, label: "$19000" },
        { id: 20, value: 20000, label: "$20000" }
      ],
      tasas: [
        { id: 1, value: 0.08, label: "8%" },
        { id: 2, value: 0.07, label: "7%" },
        { id: 3, value: 0.065, label: "6.5%" }
      ],
      plazos: [
        { id: 1, value: 16, label: "16 pagos" },
        { id: 2, value: 20, label: "20 pagos" }
      ],
      tipos: [
        { id: 1, value: "D", label: "Pago diario" },
        { id: 2, value: "S", label: "Pago semanal" }
      ],
      menu: false
    };
  },
  computed: {
    formErrors() {
      const errors = [];
      if (
        !this.$v.prestamo.capital.$dirty ||
        !this.$v.prestamo.tasa.$dirty ||
        !this.$v.prestamo.plazo.$dirty ||
        !this.$v.prestamo.tipo.$dirty ||
        !this.$v.prestamo.inicio.$dirty
      )
        return errors;
      !this.$v.prestamo.capital.required &&
        errors.push("Este campo es obligatorio");

      !this.$v.prestamo.tasa.required &&
        errors.push("Este campo es obligatorio");

      !this.$v.prestamo.plazo.required &&
        errors.push("Este campo es obligatorio");

      !this.$v.prestamo.tipo.required &&
        errors.push("Este campo es obligatorio");
      return errors;
    },
    maxDate(){
      let fecha = null;
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      fecha = dd + "-" + mm + "-" + yyyy;
      return fecha;
    }
  },
  methods: {
    saveDate(date) {
      this.$refs.menu.save(date);
    },
    setSelectedValues() {
      if (this.prestamo.tipo == "D") {
        this.prestamo.plazo = 20;
        this.prestamo.tasa = 0.065;
      } else if (this.prestamo.tipo == "S") {
        this.prestamo.plazo = 16;
        this.prestamo.tasa = 0.08;
      }
    },
    clear() {
      this.prestamo = {};
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
