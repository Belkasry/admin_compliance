<template>
  <div>
  <v-data-table
    :headers="headers"
    :items="bulletins"
    :search="search"
    :loading="loading"
  >
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Bulletins</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <div>
          <v-btn @click="showDialog" color="primary">Add Bulletin</v-btn>
          <v-dialog v-model="dialogVisible" max-width="500px">
            <v-card>
              <v-card-title>Bulletin Officiel</v-card-title>
              <v-card-text>
                <div>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newBoFr.num_bo" label="Numero Bulletin Français"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field type="date" v-model="newBoFr.published_at" label="published_at"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newBoAr.num_bo" label="Numero Bulletin Arabe" locale="ar"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field type="date" v-model="newBoAr.published_at" label="published_at"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-btn @click="saveBulletin" color="blue">Enregistrer</v-btn>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
      </v-toolbar>
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
        { title: 'ID', key: 'id' },
        { title: 'Bulletin Number (French)', key: 'num_bo' },
        { title: 'Language', key: 'lang' },
        { title: 'Published Date', key: 'published_at' },
        { title: 'Année', key: 'year' },
        { title: 'Bulletin Number (Arabic)', key: 'bulletin_ar_fr', sortable: false },
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
      },
      newBoAr: {
        num_bo: '',
        published_at: '',
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
          this.loadData();
          this.dialogVisible = false;
        })
        .catch(error => {
          console.error(error);
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
