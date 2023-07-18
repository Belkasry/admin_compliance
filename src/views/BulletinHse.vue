<template>
  <div>
    <v-dialog v-model="dialogVisible">
      <v-card>
        <v-card-title>Bulletin Officiel</v-card-title>
        <v-card-text>
          <div>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field variant="outlined" v-model="newBoFr.num_bo"
                              label="Numero Bulletin Français"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field variant="outlined" type="date" v-model="newBoFr.published_at"
                              label="published_at"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-file-input variant="outlined" v-model="document_fr" label="Fichier BO Fr"></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field variant="outlined" v-model="newBoAr.num_bo" label="Numero Bulletin Arabe"
                              locale="ar"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field variant="outlined" type="date" v-model="newBoAr.published_at"
                              label="published_at"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-file-input variant="outlined" v-model="document_ar" label="Fichier BO Ar"></v-file-input>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="saveBulletin" color="blue">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="bulletins"
      :search="search"
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar dark
                   color="black">
          <v-toolbar-title>Bulletins</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-inner-icon="mdi-magnify"
            label="Search"
            single-line
            variant="underlined"
            class="mx-2 mt-1"
          ></v-text-field>
          <div class="mx-2">
            <v-btn @click="showDialog" variant="outlined" color="white">Add Bulletin</v-btn>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editBulletin(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteBulletin(item)">mdi-delete</v-icon>
        <v-icon v-if="item.raw.document_id" small class="mr-2" @click="downloadFile(item.raw.document_id)">mdi-download</v-icon>
      </template>
      <template v-slot:[`item.bulletin_ar_fr`]="{ item }">
      <span v-for="bulletin in item.columns.bulletin_ar_fr" :key="bulletin.id">
        {{ bulletin.num_bo }}
      </span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      headers: [
        {title: 'ID', key: 'id'},
        {title: 'Bulletin Number (French)', key: 'num_bo'},
        {title: 'Language', key: 'lang'},
        {title: 'Published Date', key: 'published_at'},
        {title: 'Année', key: 'year'},
        {title: 'Bulletin Number (Arabic)', key: 'bulletin_ar_fr', sortable: false},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
      bulletins: [],
      search: '',
      loading: true,
      pagination: {
        page: 1,
        itemsPerPage: 10,
      },
      totalItems: 0,
      dialogVisible: false,
      newBoFr: {
        num_bo: '',
        published_at: '',
        lang: 'fr',
      },
      document_fr: null,
      document_ar: null,
      newBoAr: {
        num_bo: '',
        published_at: '',
        lang: 'ar',
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    async saveBulletin() {

      const bulletins = [];
      if (this.newBoFr.num_bo) bulletins.push(this.newBoFr)
      if (this.newBoAr.num_bo) bulletins.push(this.newBoAr)

      const data = new FormData();
      data.append('bulletins', JSON.stringify(bulletins));


      if (this.document_fr) {
        let filesArray_fr = Array.isArray(this.document_fr)
          ? this.document_fr
          : [this.document_fr];
        Array.from(filesArray_fr).forEach((file) => {
          data.append("document_fr", file);
        });
      }

      if (this.document_ar) {
        let filesArray_ar = Array.isArray(this.document_ar)
          ? this.document_ar
          : [this.document_ar];
        Array.from(filesArray_ar).forEach((file) => {
          data.append("document_ar", file);
        });
      }


      await axios
        .post('/api/bulletins_fr_ar', data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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
          this.loadData();
          this.dialogVisible = false;
        })
        .catch(error => {
          console.error(error);
        });
    },
    async editBulletin(item) {
      console.log(item);
    },
    async deleteBulletin(item) {
      console.log(item);
    },
    async downloadFile(id_document) {
      console.log(id_document);
      await axios({
        method: 'GET',
        url: `/api/documents/${id_document}/download`,
        responseType: 'blob', // Set the response type to blob
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'filename.ext'); // Set the desired file name and extension
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          // Handle any errors
          console.error('Error downloading file:', error);
        });
    },
    async loadData() {
      // Simulating an API call to fetch the bulletins
      this.loading = true;
      // Replace this with your actual API call to retrieve the bulletins
      const data = await axios.get('/api/bulletins_default_fr');
      this.bulletins = data.data;
      this.totalItems = data.length;
      this.loading = false;
    },
  },
};
</script>
