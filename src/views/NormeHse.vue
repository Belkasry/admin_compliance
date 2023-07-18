<template>
  <div>
    <v-toolbar dark
               color="black">
      <v-spacer></v-spacer>
      <v-text-field
        variant="underlined"
        v-model="search"
        append-inner-icon="mdi-magnify"
        label="Search"
        single-line
        class="mx-2 mt-1"
      ></v-text-field>
      <v-btn color="white" variant="outlined" @click="openDialog" class="mx-2">Add Norme</v-btn>
    </v-toolbar>
    <v-container>
    <v-data-table
      :headers="headers"
      :items="normes"
      :search="search"
      :loading="loading"
      item-key="id"
    >
      <template v-slot:[`item.effect_at`]="{ item }">
        {{ formatDate(item.columns.effect_at) }}
      </template>
      <template v-slot:[`item.domain`]="{ item }">
        {{ item.columns.domain?.name }}
      </template>
      <template v-slot:[`item.text`]="{ item }">
        {{ item.columns.text?.intitule }}
      </template>
      <template v-slot:[`item.is_required`]="{ item }">
        {{ item.columns.is_required ? 'Oui' : 'Non' }}
      </template>
      <template v-slot:[`item.etat`]="{ item }">
        {{ list_etat_norme.find(e=>e.ref ==  item.columns.etat)?.value }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        {{ list_status_norme.find(e=>e.ref ==  item.columns.status)?.value }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="editNorme(item.raw)">mdi-pencil</v-icon>
        <v-icon @click="deleteNorme(item.raw)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    </v-container>
    <v-dialog v-model="dialog" fullscreen>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Add Norme</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              variant="text"
              @click="saveNorme"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="newNorme.text_id"
                variant="outlined"
                :items="texts"
                label="Textes HSE"
                item-value="id"
                item-title="intitule"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" v-model="newNorme.norme" label="Norme"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" v-model="newNorme.designation" label="Designation"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" v-model="newNorme.indice_classement"
                            label="Indice de Classement"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                variant="outlined"
                v-model="newNorme.domain_id"
                label="Domain ID"
                :items="domains"
                item-title="name"
                item-value="id"
                clearable="true"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" type="date" v-model="newNorme.effect_at"
                            label="Effect At"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea variant="outlined" v-model="newNorme.remarque" label="Remarque"></v-textarea>
            </v-col>
            <v-col cols="12" md="6">
              <v-select variant="outlined"
                        v-model="newNorme.status"
                        :items="list_status_norme"
                        item-value="ref"
                        item-title="value"
                        label="Statut"
                        clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch v-model="newNorme.is_required"
                        color="primary"
                        label="Is Required">
              </v-switch>
            </v-col>
            <v-col cols="12" md="6">
              <v-select variant="outlined"
                        v-model="newNorme.etat"
                        :items="list_etat_norme"
                        item-value="ref"
                        item-title="value"
                        label="Etat"
                        clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea variant="outlined" v-model="newNorme.important" label="Important"></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      dialog_edit:false,
      headers: [
        {title: 'Norme', key: 'norme'},
        {title: 'Designation', key: 'designation'},
        {title: 'Indice de Classement', key: 'indice_classement'},
        {title: 'Domain', key: 'domain'},
        {title: 'Text', key: 'text'},
        {title: 'Effect At', key: 'effect_at'},
        {title: 'Status', key: 'status'},
        {title: 'Is Required', key: 'is_required'},
        {title: 'Etat', key: 'etat'},
        {title: 'Important', key: 'important'},
        {title: 'Remarque', key: 'remarque'},
        {title: 'Actions', key: 'actions'},
      ],
      normes: [],
      texts: [],
      domains: [],
      search: '',
      loading: true,
      dialog: false,
      newNorme: {
        norme: '',
        designation: '',
        indice_classement: '',
        domain_id: null,
        text_id: null,
        effect_at: null,
        remarque: '',
        status: '',
        is_required: false,
        etat: '',
        important: '',
      },
      val_refs: [],
      mode: 'add',
      list_status_norme: [],
      list_etat_norme: [],
    };
  },
  created() {
    this.fetchNormesData();
    this.fetchTextsData();
    this.fetchDomains();
    this.fetchValRefs();

  },
  methods: {
    async fetchValRefs() {
      const response = await axios.get('/api/valref');
      this.val_refs = response.data;
      this.list_status_norme = this.val_refs?.status_norme
      this.list_etat_norme = this.val_refs?.etat_norme
    },
    async fetchNormesData() {
      const response = await axios.get('/api/normes');
      this.normes = response.data;
      this.loading = false;
    },
    editNorme(item) {
      this.mode = 'edit';
      this.newNorme = {...item};
      this.dialog = true;
    },
    async deleteNorme(id) {
      await axios.delete(`/api/normes/${id}`);
      this.fetchNormesData();
    },
    async fetchTextsData() {
      const response = await axios.get('/api/texts');
      this.texts = response.data;
    },
    async fetchDomains() {
      const response = await axios.get('/api/domains');
      this.domains = response.data;
    },
    formatDate(date) {
      return date;
    },
    async saveNorme() {
      console.log('New Norme:', this.newNorme);
      if (this.mode === 'add') {
        await axios.post('/api/normes', this.newNorme);
      } else if (this.mode === 'edit') {
        await axios.put('/api/normes/'+this.newNorme.id, this.newNorme);
      }

      this.fetchNormesData();
      this.newNorme = {
        norme: '',
        designation: '',
        indice_classement: '',
        domain_id: null,
        text_id: null,
        effect_at: null,
        remarque: '',
        status: '',
        is_required: false,
        etat: '',
        important: '',
      };

      this.dialog = false;
    },
    openDialog() {
      this.mode = 'add';
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>
