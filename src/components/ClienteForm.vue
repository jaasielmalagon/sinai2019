<template>
  <!-- <v-card dark>
    <v-card-title>
      <v-toolbar color="blue lighten-2" dark>
        <v-toolbar-title>Datos personales</v-toolbar-title>
      </v-toolbar>
    </v-card-title>
  <v-card-text class="px-5">-->
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="6" v-if="!esReferencia && !esAval">
            <v-select
              v-model="cliente.comisionista"
              :items="comisionistas"
              item-text="nombre"
              :return-object="true"
              label="Comisionista"
              no-data-text="No hay comisionistas"
              @input="generateCurp"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6" v-if="!esReferencia">
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
                  v-model="cliente.bornDate"
                  label="Fecha de nacimiento"
                  :error-messages="bornDateErrors"
                  readonly
                  v-on="on"
                  @input="$v.cliente.bornDate.$touch()"
                  @blur="$v.cliente.bornDate.$touch()"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="cliente.bornDate"
                ref="picker"
                :max="maxDate"
                :min="minDate"
                @change="saveDate"
                @input="generateCurp"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="cliente.nombre"
              :error-messages="nombreErrors"
              :counter="30"
              label="Nombre"
              required
              @input="$v.cliente.nombre.$touch()"
              @blur="$v.cliente.nombre.$touch()"
              @keyup="uppercasedName"
              @change="generateCurp"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="cliente.apaterno"
              :error-messages="apaternoErrors"
              :counter="20"
              label="Apellido paterno"
              required
              @input="$v.cliente.apaterno.$touch()"
              @blur="$v.cliente.apaterno.$touch()"
              @keyup="uppercasedLastname"
              @change="generateCurp"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="cliente.amaterno"
              :error-messages="amaternoErrors"
              :counter="20"
              label="Apellido materno"
              required
              @input="$v.cliente.amaterno.$touch()"
              @blur="$v.cliente.amaterno.$touch()"
              @keyup="uppercasedLastname"
              @change="generateCurp"
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="5" v-if="!esReferencia">
            <v-text-field v-model="cliente.curp" label="CURP"></v-text-field>
          </v-col>
          <v-col cols="12" xs="3" v-if="!esReferencia">
            <v-text-field
              v-model="homoclave"
              :error-messages="homoclaveErrors"
              :counter="2"
              label="Homoclave"
              required
              @input="$v.homoclave.$touch()"
              @blur="$v.homoclave.$touch()"
              @change="generateCurp"
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="4" v-if="!esReferencia">
            <v-text-field
              v-model="cliente.ocr"
              :error-messages="ocrErrors"
              :counter="13"
              label="OCR"
              required
              @input="$v.cliente.ocr.$touch()"
              @blur="$v.cliente.ocr.$touch()"
              @change="generateCurp"
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="7" md="4">
            <v-radio-group
              row
              v-model="cliente.sexo"
              :error-messages="sexoErrors"
              @change="generateCurp"
            >
              <div>Sexo:</div>
              <v-radio label="Hombre" value="H"></v-radio>
              <v-radio label="Mujer" value="M"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" xs="5" md="4" v-if="!esReferencia">
            <v-switch
              @change="$emit('esCasado', switch1)"
              @input="generateCurp"
              v-model="switch1"
              color="success"
              label="El solicitante es casado."
            ></v-switch>
          </v-col>
          <v-col cols="12" xs="7" v-if="!esReferencia">
            <v-select
              v-model="cliente.entidad"
              :items="items"
              item-text="label"
              item-value="value"
              :error-messages="entidadErrors"
              label="Entidad de nacimiento"
              required
              @change="$v.cliente.entidad.$touch()"
              @blur="$v.cliente.entidad.$touch()"
              @input="generateCurp"
            ></v-select>
          </v-col>
          <v-col cols="12" xs="5">
            <v-text-field
              v-model="cliente.telefono"
              :error-messages="phoneErrors"
              :counter="10"
              label="Telefono celular"
              required
              @input="$v.cliente.telefono.$touch()"
              @blur="$v.cliente.telefono.$touch()"
              @change="generateCurp"
            ></v-text-field>
          </v-col>
          <v-col cols="12" v-if="!esReferencia">
            <v-text-field
              v-model="cliente.direccion"
              :error-messages="addressErrors"
              label="Direccion particular"
              required
              @input="$v.cliente.direccion.$touch()"
              @blur="$v.cliente.direccion.$touch()"
              @keyup="uppercasedAddress"
              @change="generateCurp"
            ></v-text-field>
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
  name: "ClienteForm",
  props: {
    initialClient: {
      type: Object,
      required: true
    },
    comisionistas: {
      type: Array,
      required: true
    },
    esReferencia: Boolean,
    esAval: Boolean
  },
  mixins: [validationMixin],
  validations: {
    cliente: {
      bornDate: { required, maxLength: maxLength(10) },
      nombre: { required, maxLength: maxLength(30) },
      apaterno: { required, maxLength: maxLength(20) },
      amaterno: { required, maxLength: maxLength(20) },
      direccion: { required, minLength: minLength(10) },
      entidad: { required },
      sexo: { required },
      ocr: { required, maxLength: maxLength(13) },
      telefono: { required, maxLength: maxLength(10) }
    },
    homoclave: { required, maxLength: maxLength(2) }
  },
  data() {
    return {
      homoclave:
        this.initialClient.curp.length == 18
          ? this.initialClient.curp.substr(17, 2)
          : "00",
      maxDate:
        new Date().toISOString().substr(0, 4) -
        18 +
        "-" +
        new Date().toISOString().substr(5, 2) +
        "-" +
        new Date().toISOString().substr(8, 2),
      minDate:
        new Date().toISOString().substr(0, 4) -
        60 +
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
      switch1: false
      // comisionistas: [],
    };
  },
  watch: {
    menu(val) {
      val &&
        setTimeout(() => {
          return (this.$refs.picker.activePicker = "YEAR");
        });
    }
  },
  methods: {
    generateCurp() {
      // console.log("generando curp...")
      if (
        this.cliente.nombre != "" &&
        this.cliente.apaterno != "" &&
        this.cliente.amaterno != "" &&
        this.cliente.bornDate != "" &&
        this.cliente.entidad != "" &&
        this.cliente.sexo != "" &&
        this.homoclave != ""
      ) {
        this.cliente.amaterno =
          this.cliente.amaterno == undefined ? "XXXXX" : this.cliente.amaterno;
        let apaternoFiltrado = this.filtrarApaterno();
        let amaternoFiltrado = this.filtrarAmaterno();

        let c1 =
          apaternoFiltrado.substring(0, 1) == "Ñ"
            ? "X"
            : apaternoFiltrado.substring(0, 1);

        let c2 = this.getSecondChar(apaternoFiltrado);

        let c3 =
          amaternoFiltrado.substring(0, 1) == "Ñ"
            ? "X"
            : amaternoFiltrado.substring(0, 1);

        this.cliente.curp = c1 + c2 + c3;
        let nombreFiltrado = this.filtrarNombre();
        this.setDateCurp();
        this.cliente.curp += this.cliente.sexo + this.cliente.entidad;
        let consonantesApaterno = this.consonantesApaterno(apaternoFiltrado);
        let consonantesAmaterno = this.consonantesAmaterno(amaternoFiltrado);
        let consonantesNombre = this.consonantesNombre(nombreFiltrado);

        this.cliente.curp +=
          consonantesApaterno[0] == "Ñ" ? "X" : consonantesApaterno[0];
        this.cliente.curp +=
          consonantesAmaterno[0] == "Ñ" ? "X" : consonantesAmaterno[0];
        this.cliente.curp +=
          consonantesNombre[0] == "Ñ" ? "X" : consonantesNombre[0];
        this.cliente.curp += this.homoclave;
      }
    },
    consonantesNombre(nombreFiltrado) {
      let consonantesNombre = [];
      for (let i = 1; i < nombreFiltrado.length; i++) {
        //recopilar todas las consonantes del nombre a partir del segundo caracter (omitimos el primero) en un arreglo
        if (
          nombreFiltrado.charAt(i) != "A" &&
          nombreFiltrado.charAt(i) != "E" &&
          nombreFiltrado.charAt(i) != "I" &&
          nombreFiltrado.charAt(i) != "O" &&
          nombreFiltrado.charAt(i) != "U" &&
          nombreFiltrado.charAt(i) != "a" &&
          nombreFiltrado.charAt(i) != "e" &&
          nombreFiltrado.charAt(i) != "i" &&
          nombreFiltrado.charAt(i) != "o" &&
          nombreFiltrado.charAt(i) != "u"
        ) {
          consonantesNombre.push(nombreFiltrado.charAt(i));
        }
      }
      return consonantesNombre;
    },
    consonantesAmaterno(amaternoFiltrado) {
      let consonantesAmaterno = [];
      for (let i = 1; i < amaternoFiltrado.length; i++) {
        //recopilar todas las consonantes del apellido materno a partir del segundo caracter (omitimos el primero) en un arreglo
        if (
          amaternoFiltrado.charAt(i) != "A" &&
          amaternoFiltrado.charAt(i) != "E" &&
          amaternoFiltrado.charAt(i) != "I" &&
          amaternoFiltrado.charAt(i) != "O" &&
          amaternoFiltrado.charAt(i) != "U" &&
          amaternoFiltrado.charAt(i) != "a" &&
          amaternoFiltrado.charAt(i) != "e" &&
          amaternoFiltrado.charAt(i) != "i" &&
          amaternoFiltrado.charAt(i) != "o" &&
          amaternoFiltrado.charAt(i) != "u"
        ) {
          consonantesAmaterno.push(amaternoFiltrado.charAt(i));
        }
      }
      return consonantesAmaterno;
    },
    consonantesApaterno(apaternoFiltrado) {
      let consonantesApaterno = [];
      for (let i = 1; i < apaternoFiltrado.length; i++) {
        //recopilar todas las consonantes del apellido paterno a partir del segundo caracter en un arreglo (omitimos el primero)
        if (
          apaternoFiltrado.charAt(i) != "A" &&
          apaternoFiltrado.charAt(i) != "E" &&
          apaternoFiltrado.charAt(i) != "I" &&
          apaternoFiltrado.charAt(i) != "O" &&
          apaternoFiltrado.charAt(i) != "U" &&
          apaternoFiltrado.charAt(i) != "a" &&
          apaternoFiltrado.charAt(i) != "e" &&
          apaternoFiltrado.charAt(i) != "i" &&
          apaternoFiltrado.charAt(i) != "o" &&
          apaternoFiltrado.charAt(i) != "u"
        ) {
          consonantesApaterno.push(apaternoFiltrado.charAt(i));
        }
      }
      return consonantesApaterno;
    },
    setDateCurp() {
      let year = this.cliente.bornDate.substring(2, 4);
      let month = this.cliente.bornDate.substring(5, 7);
      let day = this.cliente.bornDate.substring(8, 10);
      this.cliente.curp += year + month + day;
      // console.log(this.cliente.bornDate)
    },
    getSecondChar(apaternoFiltrado) {
      for (let i = 1; i < apaternoFiltrado.length; i++) {
        if (
          apaternoFiltrado.charAt(i) == "A" ||
          apaternoFiltrado.charAt(i) == "E" ||
          apaternoFiltrado.charAt(i) == "I" ||
          apaternoFiltrado.charAt(i) == "O" ||
          apaternoFiltrado.charAt(i) == "U" ||
          apaternoFiltrado.charAt(i) == "a" ||
          apaternoFiltrado.charAt(i) == "e" ||
          apaternoFiltrado.charAt(i) == "i" ||
          apaternoFiltrado.charAt(i) == "o" ||
          apaternoFiltrado.charAt(i) == "u"
        ) {
          return apaternoFiltrado.charAt(i);
        }
      }
      return "X";
    },
    filtrarNombre() {
      let partirNombre = this.cliente.nombre.split(" ");
      if (partirNombre.length >= 2) {
        if (
          partirNombre[0] == "JOSE" ||
          partirNombre[0] == "MARIA" ||
          partirNombre[0] == "JOSÉ" ||
          partirNombre[0] == "MARÍA" ||
          partirNombre[0] == "J" ||
          partirNombre[0] == "MA" ||
          partirNombre[0] == "J." ||
          partirNombre[0] == "MA." ||
          partirNombre[0] == "JOCE" ||
          partirNombre[0] == "MARYA" ||
          partirNombre[0] == "JOCÉ" ||
          partirNombre[0] == "JOZE" ||
          partirNombre[0] == "JOZÉ" ||
          partirNombre[0] == "DE" ||
          partirNombre[0] == "LOS" ||
          partirNombre[0] == "LAS" ||
          partirNombre[0] == "DEL" ||
          partirNombre[0] == "LA" ||
          partirNombre[0] == "EL"
        ) {
          this.cliente.curp += partirNombre[1].substring(0, 1);
          return partirNombre[1];
        } else {
          this.cliente.curp +=
            this.cliente.nombre.substring(0, 1) == "Ñ"
              ? "X"
              : this.cliente.nombre.substring(0, 1);
          return partirNombre[0];
        }
      } else {
        this.cliente.curp +=
          this.cliente.nombre.substring(0, 1) == "Ñ"
            ? "X"
            : this.cliente.nombre.substring(0, 1);
        return this.cliente.nombre;
      }
    },
    filtrarAmaterno() {
      let partirAmaterno = this.cliente.amaterno.split(" ");
      if (partirAmaterno.length >= 2) {
        for (let i = 0; i < partirAmaterno.length; i++) {
          if (
            partirAmaterno[i] != "DA" &&
            partirAmaterno[i] != "DAS" &&
            partirAmaterno[i] != "DE" &&
            partirAmaterno[i] != "DEL" &&
            partirAmaterno[i] != "DER" &&
            partirAmaterno[i] != "DI" &&
            partirAmaterno[i] != "DIE" &&
            partirAmaterno[i] != "DD" &&
            partirAmaterno[i] != "EL" &&
            partirAmaterno[i] != "LA" &&
            partirAmaterno[i] != "LOS" &&
            partirAmaterno[i] != "LAS" &&
            partirAmaterno[i] != "LE" &&
            partirAmaterno[i] != "LES" &&
            partirAmaterno[i] != "MAC" &&
            partirAmaterno[i] != "MC" &&
            partirAmaterno[i] != "VAN" &&
            partirAmaterno[i] != "VON" &&
            partirAmaterno[i] != "Y"
          ) {
            return partirAmaterno[i];
          }
        }
      } else {
        return partirAmaterno[0];
      }
    },
    filtrarApaterno() {
      let partirApaterno = this.cliente.apaterno.split(" ");
      if (partirApaterno.length >= 2) {
        for (let i = 0; i < partirApaterno.length; i++) {
          if (
            partirApaterno[i] != "DA" &&
            partirApaterno[i] != "DAS" &&
            partirApaterno[i] != "DE" &&
            partirApaterno[i] != "DEL" &&
            partirApaterno[i] != "DER" &&
            partirApaterno[i] != "DI" &&
            partirApaterno[i] != "DIE" &&
            partirApaterno[i] != "DD" &&
            partirApaterno[i] != "EL" &&
            partirApaterno[i] != "LA" &&
            partirApaterno[i] != "LOS" &&
            partirApaterno[i] != "LAS" &&
            partirApaterno[i] != "LE" &&
            partirApaterno[i] != "LES" &&
            partirApaterno[i] != "MAC" &&
            partirApaterno[i] != "MC" &&
            partirApaterno[i] != "VAN" &&
            partirApaterno[i] != "VON" &&
            partirApaterno[i] != "Y"
          ) {
            return partirApaterno[i];
          }
        }
      } else {
        return partirApaterno[0];
      }
    },
    clear() {
      this.nuevoCliente = {};
      this.menu = false;
      this.$v.$reset();
    },
    saveDate(date) {
      this.$refs.menu.save(date);
    },
    uppercasedName() {
      this.cliente.nombre = this.cliente.nombre.toUpperCase().normalize("NFD");
    },
    uppercasedLastname() {
      this.cliente.apaterno = this.cliente.apaterno
        .toUpperCase()
        .normalize("NFD");
      // .replace(/[\u0300-\u036f]/g, "");
      this.cliente.amaterno = this.cliente.amaterno
        .toUpperCase()
        .normalize("NFD");
      // .replace(/[\u0300-\u036f]/g, "");
    },
    uppercasedAddress() {
      this.cliente.direccion = this.cliente.direccion
        .toUpperCase()
        .normalize("NFD");
      // .replace(/[\u0300-\u036f]/g, "");
    },
    submit() {
      this.$v.$touch();
      return this.$v.$error;
    }
  },
  computed: {
    cliente() {
      if (this.initialClient.curp.length == 18) {
        this.homoclave = this.initialClient.curp.substring(16, 18);
      }
      return this.initialClient;
    },
    nombreErrors() {
      const errors = [];
      if (!this.$v.cliente.nombre.$dirty) return errors;
      !this.$v.cliente.nombre.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.cliente.nombre.required &&
        errors.push("Este campo es obligatorio.");
      return errors;
    },
    amaternoErrors() {
      const errors = [];
      if (!this.$v.cliente.amaterno.$dirty) return errors;
      !this.$v.cliente.amaterno.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.cliente.amaterno.required &&
        errors.push("Este campo es obligatorio.");
      return errors;
    },
    apaternoErrors() {
      const errors = [];
      if (!this.$v.cliente.apaterno.$dirty) return errors;
      !this.$v.cliente.apaterno.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.cliente.apaterno.required &&
        errors.push("Este campo es obligatorio.");
      return errors;
    },
    sexoErrors() {
      const errors = [];
      if (!this.$v.cliente.sexo.$dirty) return errors;
      !this.$v.cliente.sexo.required &&
        errors.push("Este campo es obligatorio");
      return errors;
    },
    entidadErrors() {
      const errors = [];
      if (!this.$v.cliente.entidad.$dirty) return errors;
      !this.$v.cliente.entidad.required &&
        errors.push("Este campo es obligatorio");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.cliente.direccion.$dirty) return errors;
      !this.$v.cliente.direccion.minLength &&
        errors.push("La direccion es incorrecta");
      !this.$v.cliente.direccion.required &&
        errors.push("Este campo es obligatorio.");
      return errors;
    },
    bornDateErrors() {
      const errors = [];
      if (!this.$v.cliente.bornDate.$dirty) return errors;
      !this.$v.cliente.bornDate.maxLength &&
        errors.push("La fecha de nacimiento es incorrecta.");
      !this.$v.cliente.bornDate.required &&
        errors.push("Este campo es obligatorio.");
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
      if (!this.$v.cliente.ocr.$dirty) return errors;
      !this.$v.cliente.ocr.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.cliente.ocr.required &&
        errors.push("Este campo es obligatorio.");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.cliente.telefono.$dirty) return errors;
      !this.$v.cliente.telefono.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.cliente.telefono.required &&
        errors.push("Este campo es obligatorio.");
      return errors;
    }
  }
};
</script>
