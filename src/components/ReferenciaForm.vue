<template>
  <!-- <v-card dark>
    <v-card-title>
      <v-toolbar color="blue lighten-2" dark>
        <v-toolbar-title>Datos personales</v-toolbar-title>
      </v-toolbar>
    </v-card-title>
  <v-card-text class="px-5">-->
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 md3>
          <v-text-field
            v-model="request"
            :error-messages="requestErrors"
            :counter="5"
            label="Num. solicitud"
            required
            @input="$v.request.$touch()"
            @blur="$v.request.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md9>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="100px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="bornDate"
                label="Fecha de nacimiento"
                :error-messages="bornDateErrors"
                readonly
                v-on="on"
                @input="$v.bornDate.$touch()"
                @blur="$v.bornDate.$touch()"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="bornDate"
              ref="picker"
              :max="maxDate"
              min="1950-01-01"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md4>
          <v-text-field
            v-model="firstname"
            :error-messages="firstnameErrors"
            :counter="30"
            label="Nombre"
            required
            @input="$v.firstname.$touch()"
            @blur="$v.firstname.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md4>
          <v-text-field
            v-model="apaterno"
            :error-messages="apaternoErrors"
            :counter="20"
            label="Apellido paterno"
            required
            @input="$v.apaterno.$touch()"
            @blur="$v.apaterno.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md4>
          <v-text-field
            v-model="amaterno"
            :error-messages="amaternoErrors"
            :counter="20"
            label="Apellido materno"
            required
            @input="$v.amaterno.$touch()"
            @blur="$v.amaterno.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs5>
          <v-text-field
            v-model="curp"
            label="CURP"
            readonly
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="homoclave"
            :error-messages="homoclaveErrors"
            :counter="2"
            label="Homoclave"
            required
            @input="$v.homoclave.$touch()"
            @blur="$v.homoclave.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-text-field
            v-model="ocr"
            :error-messages="ocrErrors"
            :counter="13"
            label="Clave de elector"
            required
            @input="$v.ocr.$touch()"
            @blur="$v.ocr.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-radio-group row v-model="sexo" :error-messages="sexoErrors">
            <div>Sexo:</div>
            <v-radio label="Hombre" value="H"></v-radio>
            <v-radio label="Mujer" value="M"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs7>
          <v-select
            v-model="entidad"
            :items="items"
            item-text="label"
            item-value="value"
            :error-messages="entidadErrors"
            label="Entidad de nacimiento"
            required
            @change="$v.entidad.$touch()"
            @blur="$v.entidad.$touch()"
          ></v-select>
        </v-flex>
        <v-flex xs5>
          <v-text-field
            v-model="telefono"
            :error-messages="phoneErrors"
            :counter="10"
            label="Telefono celular"
            required
            @input="$v.telefono.$touch()"
            @blur="$v.telefono.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="direccion"
            :error-messages="addressErrors"
            label="Direccion particular"
            required
            @input="$v.direccion.$touch()"
            @blur="$v.direccion.$touch()"
          ></v-text-field>
        </v-flex>        
      </v-layout>
    </v-container>
  </v-form>
  <!-- </v-card-text>
    <v-card-actions>
      <v-btn color="green lighten-1" @click="submit">Aceptar</v-btn>
      <v-btn color="red darken-4" @click="clear">Cancelar</v-btn>
    </v-card-actions>
  </v-card>-->
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, between } from "vuelidate/lib/validators";

export default {
  name: "ReferenciaForm",
  mixins: [validationMixin],
  validations: {
    bornDate: { required, maxLength: maxLength(10) },
    firstname: { required, maxLength: maxLength(30) },
    apaterno: { required, maxLength: maxLength(20) },
    amaterno: { required, maxLength: maxLength(20) },
    request: { required, between: between(1, 99999), maxLength: maxLength(5) },
    direccion: { required },
    entidad: { required },
    sexo: { required },
    homoclave: { required, maxLength: maxLength(2) },
    ocr: { required, maxLength: maxLength(13) },
    telefono: { required, maxLength: maxLength(10) },
  },
  data() {
    return {      
      request: "",
      firstname: "",
      apaterno: "",
      amaterno: "",
      bornDate: "",
      sexo: false,
      curp: "",
      homoclave: "",
      ocr: "",
      direccion: "",
      telefono: "",
      entidad: "",
      maxDate:
        new Date().toISOString().substr(0, 4) -
        18 +
        "-" +
        new Date().toISOString().substr(5, 2) +
        "-" +
        new Date().toISOString().substr(8, 2),
      menu: false,
      items: [
        { id: "MEX-AGS", value: "AS", label: "Aguascalientes (AGS)" },
        { id: "MEX-BCN", value: "BC", label: "Baja California Norte (BCN)" },
        { id: "MEX-BCS", value: "BS", label: "Baja California Sur (BCS)" },
        { id: "MEX-CAM", value: "CC", label: "Campeche (CAM)" },
        { id: "MEX-CHIS", value: "CS", label: "Chiapas (CHIS)" },
        { id: "MEX-CHIH", value: "CH", label: "Chihuahua (CHIH)" },
        { id: "MEX-COAH", value: "CL", label: "Coahuila (COAH)" },
        { id: "MEX-COL", value: "CM", label: "Colima (COL)" },
        { id: "MEX-DF", value: "DF", label: "Distrito Federal (DF)" },
        { id: "MEX-DGO", value: "DG", label: "Durango (DGO)" },
        { id: "MEX-GTO", value: "GT", label: "Guanajuato (GTO)" },
        { id: "MEX-GRO", value: "GR", label: "Guerrero (GRO)" },
        { id: "MEX-HGO", value: "HG", label: "Hidalgo (HGO)" },
        { id: "MEX-JAL", value: "JC", label: "Jalisco (JAL)" },
        { id: "MEX-EDM", value: "MC", label: "México - Estado de (EDM)" },
        { id: "MEX-MICH", value: "MN", label: "Michoacán (MICH)" },
        { id: "MEX-MOR", value: "MS", label: "Morelos (MOR)" },
        { id: "MEX-NAY", value: "NT", label: "Nayarit (NAY)" },
        { id: "MEX-NL", value: "NL", label: "Nuevo León (NL)" },
        { id: "MEX-OAX", value: "OC", label: "Oaxaca (OAX)" },
        { id: "MEX-PUE", value: "PL", label: "Puebla (PUE)" },
        { id: "MEX-QRO", value: "QO", label: "Querétaro (QRO)" },
        { id: "MEX-QROO", value: "QR", label: "Quintana Roo (QROO)" },
        { id: "MEX-SLP", value: "SP", label: "San Luis Potosí (SLP)" },
        { id: "MEX-SIN", value: "SL", label: "Sinaloa (SIN)" },
        { id: "MEX-SON", value: "SR", label: "Sonora (SON)" },
        { id: "MEX-TAB", value: "TC", label: "Tabasco (TAB)" },
        { id: "MEX-TAMPS", value: "TS", label: "Tamaulipas (TAMPS)" },
        { id: "MEX-TLAX", value: "TL", label: "Tlaxcala (TLAX)" },
        { id: "MEX-VER", value: "VZ", label: "Veracruz (VER)" },
        { id: "MEX-YUC", value: "YN", label: "Yucatán (YUC)" },
        { id: "MEX-ZAC", value: "ZS", label: "Zacatecas (ZAC)" }
      ],
      nuevoCliente: {
        firstname: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: false,
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: ""
      },
      defaultCliente: {
        firstname: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: false,
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: ""
      }
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  mounted: function() {
    // this.writeClientData();
  },
  methods: {
    writeClientData() {
      //this.db.ref("clientes/").push(this.nuevoCliente);
      this.db.ref("clientes/").push(this.nuevoCliente);
      // console.log("datos guardados...");
    },
    submit() {
      this.$v.$touch();
    },
    clear() {
      // this.$v.$reset();
      this.nuevoCliente = this.defaultCliente;
      this.request = "";
      this.firstname = "";
      this.apaterno = "";
      this.amaterno = "";
      this.bornDate = "";
      this.sexo = false;
      this.curp = "";
      this.homoclave = "";
      this.ocr = "";
      this.direccion = "";
      this.telefono = "";
      this.entidad = "";
      this.menu = false;
    },
    saveDate(date) {
      this.$refs.menu.save(date);
    }
  },
  computed: {
    requestErrors() {
      const errors = [];
      if (!this.$v.request.$dirty) return errors;
      !this.$v.request.maxLength &&
        errors.push("El numero de solicitud indicado es demasiado extenso.");
      !this.$v.request.required && errors.push("Este campo es obligatorio.");
      !this.$v.request.between &&
        errors.push("El numero de solicitud es invalido.");
      return errors;
    },
    firstnameErrors() {
      const errors = [];
      if (!this.$v.firstname.$dirty) return errors;
      !this.$v.firstname.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.firstname.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    amaternoErrors() {
      const errors = [];
      if (!this.$v.amaterno.$dirty) return errors;
      !this.$v.amaterno.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.amaterno.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    apaternoErrors() {
      const errors = [];
      if (!this.$v.apaterno.$dirty) return errors;
      !this.$v.apaterno.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.apaterno.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    sexoErrors() {
      const errors = [];
      if (!this.$v.sexo.$dirty) return errors;
      !this.$v.email.required && errors.push("Este campo es obligatorio");
      return errors;
    },
    entidadErrors() {
      const errors = [];
      if (!this.$v.entidad.$dirty) return errors;
      !this.$v.entidad.required && errors.push("Este campo es obligatorio");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.direccion.$dirty) return errors;
      !this.$v.direccion.maxLength && errors.push("La direccion es incorrecta");
      !this.$v.direccion.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    bornDateErrors() {
      const errors = [];
      if (!this.$v.bornDate.$dirty) return errors;
      !this.$v.bornDate.maxLength &&
        errors.push("La fecha de nacimiento es incorrecta.");
      !this.$v.bornDate.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    homoclaveErrors() {
      const errors = [];
      if (!this.$v.homoclave.$dirty) return errors;
      !this.$v.homoclave.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.homoclave.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    ocrErrors() {
      const errors = [];
      if (!this.$v.ocr.$dirty) return errors;
      !this.$v.ocr.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.ocr.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.telefono.$dirty) return errors;
      !this.$v.telefono.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.telefono.required && errors.push("Este campo es obligatorio.");
      return errors;
    }
  }
};
</script>
