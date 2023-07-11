<template>
  <div>
    <v-dialog v-model="dialogVisible" fullscreen>

      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="dialogVisible = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title><span class="headline">{{ dialogTitle }}</span></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            variant="text"
            @click="saveText"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" v-model="newText.num_text" label="Text Number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" v-model="newText.written_at" label="Written At"
                              type="date"></v-text-field>
              </v-col>
              <v-col cols="12" md="12" class="my-3">
                <v-card>
                  <v-card-title>Bulletin Officiel</v-card-title>
                  <v-card-text>
                    <v-switch v-model="bulletin_select"
                              color="primary"
                              :label="bulletin_select?'Choisir un bulletin':'Ajoutez Nouveau Bulletin'">

                    </v-switch>
                    <v-autocomplete
                      v-if="bulletin_select"
                      :items="bulletins"
                      variant="outlined"
                      label="Bulletin Officiel"
                      item-title="num_bo"
                      item-value="id"
                      v-model="newText.bo_id"
                      clearable></v-autocomplete>
                    <div v-else>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newBoFr.num_bo" label="Numero Bulletin Français">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field type="date" v-model="newBoFr.published_at"
                                        label="published_at"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field v-model="newBoAr.num_bo" label="Numero Bulletin Arabe" locale="ar">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field type="date" v-model="newBoAr.published_at"
                                        label="published_at"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-spacer></v-spacer>
                        <v-btn @click="saveBulletin" color="blue">
                          Enregistrer
                        </v-btn>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea variant="outlined" v-model="newText.remarque" label="Remarque"></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-select variant="outlined"
                          v-model="newText.status_disklosure"
                          :items="list_status_disklosure"
                          item-value="ref"
                          item-title="value"
                          label="Status Disclosure"
                          clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="d-none">
                <v-textarea variant="outlined" v-model="newText.intitule" label="Intitule"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea variant="outlined" v-model="newText.intitule_fr" label="Intitule Français"></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea variant="outlined" v-model="newText.intitule_ar" label="Intitule Arabe"></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" v-model="newText.page_fr" label="Page FR" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field variant="outlined" v-model="newText.page_ar" label="Page AR" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select variant="outlined" v-model="newText.nature" :items="list_nature_text" item-value="ref"
                          item-title="value" label="Nature"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select :items="list_status_text" item-title="value" item-value="ref" variant="outlined"
                          v-model="newText.status" label="Status"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  variant="outlined"
                  v-model="newText.domain_id"
                  label="Domain ID"
                  :items="domains"
                  item-title="name"
                  item-value="id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  variant="outlined"
                  v-model="newText.scope_id"
                  label="Scope ID"
                  :items="scopes"
                  item-title="name"
                  item-value="id"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="newText.has_annexe" label="Has Annexe"></v-switch>
                <v-switch v-model="newText.is_digital" label="Is Digital"></v-switch>
                <v-switch v-model="newText.has_schema" label="Has Schema"></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea variant="outlined" v-model="newText.important" label="Important"></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <br>
                <br>
                <br>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="texts"
      :search="search"
      :loading="loading"
    >
      <template #top>
        <v-toolbar color="black">
          <v-toolbar-title>Texts</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field variant="outlined"
                        v-model="search"
                        append-inner-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
          ></v-text-field>
          <v-btn color="primary" dark @click="openDialog">Add Text</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="deleteText(item.raw.id)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios';
import {enable} from "core-js/internals/internal-metadata";

export default {
  data() {
    return {
      bulletins: [],
      domains:[],
      scopes:[],
      list_status_disklosure: [ ],
      list_status_text: [ ],
      list_nature_text: [],
      bulletin_select: true,
      panel_bo: true,
      headers: [
        {title: 'ID', key: 'id'},
        {title: 'Text Number', key: 'num_text'},
        {title: 'Written At', key: 'written_at'},
        {title: 'Status', key: 'status'},
        {title: 'Actions', key: 'actions'},
      ],
      texts: [],
      search: '',
      loading: false,
      newText: {
        num_text: null,
        written_at: null,
        bo_id: null,
        remarque: null,
        status_disklosure: null,
        intitule: null,
        intitule_ar: null,
        intitule_fr: null,
        page_ar: null,
        page_fr: null,
        nature: null,
        status: null,
        domain_id: null,
        scope_id: null,
        has_annexe: null,
        is_digital: null,
        has_schema: null,
        important: null,
      },
      newBoFr: {
        num_bo: null,
        lang: "fr",
        published_at: null,
      },
      newBoAr: {
        num_bo: null,
        lang: "ar",
        published_at: null,
      },
      dialogVisible: false,
      dialogTitle: '',
    };
  },
  watch: {
    newText: {
      handler() {
        this.newText.intitule = this.newText.intitule_fr || this.newText.intitule_ar;
      },
      deep: true
    }
  },
  mounted() {
    this.fetchValRefs();
    this.loadTexts();
    this.fetchDomain();
    this.fetchScope();
    this.fetchBo();
  },
  methods: {
    async fetchValRefs() {
      const response = await axios.get('/api/valref');
      this.val_refs = response.data;
      this.list_status_text=this.val_refs?.status_text
      this.list_status_disklosure=this.val_refs?.status_disklosure_text
      this.list_nature_text=this.val_refs?.nature_text
    },
    async saveBulletin() {
      const data = {
        bulletins: []
      }
      if (this.newBoFr.num_bo) data.bulletins.push(this.newBoFr)
      if (this.newBoAr.num_bo) data.bulletins.push(this.newBoAr)
      await axios
        .post('/api/bulletins_fr_ar', data)
        .then((response) => {
          this.newBoFr = {
            num_bo: null,
            lang: "fr",
            published_at: null,
          };
          this.newBoAr = {
            num_bo: null,
            lang: "ar",
            published_at: null,
          };
          this.fetchBo();
          this.bulletin_select = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    async fetchBo() {
      await axios
        .get('/api/bulletins_default_fr')
        .then(response => {
          this.bulletins = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    async fetchScope() {
      await axios
        .get('/api/scopes')
        .then(response => {
          this.scopes = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    async fetchDomain() {
      await axios
        .get('/api/domains')
        .then(response => {
          this.domains = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    enable,
    loadTexts() {
      this.loading = true;
      axios
        .get('/api/texts')
        .then(response => {
          this.texts = response.data;
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteText(id) {
      // Implement the delete functionality here
      // You can make a DELETE request to the /api/texts/{id} endpoint
      // and handle the success and error cases accordingly.
    },
    openDialog() {
      this.dialogVisible = true;
      this.dialogTitle = 'Add Text';
      this.newText = {
        num_text: null,
        written_at: null,
        bo_id: null,
        remarque: null,
        status_disklosure: null,
        intitule: null,
        intitule_ar: null,
        intitule_fr: null,
        page_ar: null,
        page_fr: null,
        nature: null,
        status: null,
        domain_id: null,
        scope_id: null,
        has_annexe: false,
        is_digital: false,
        has_schema: false,
        important: null,
      };
      // Reset other fields as needed
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async saveText() {
     await axios
        .post('/api/texts', this.newText)
        .then((response) => {
          console.log(response.data)
          this.loadTexts();
          this.closeDialog();
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
};
</script>
