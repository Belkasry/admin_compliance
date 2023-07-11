<template>
  <div v-if="articles && articles.length>0" class="px-6">
    <div>
      <v-breadcrumbs
        :items="breadcrumbs"
        large
      >
      </v-breadcrumbs>
    </div>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          variant="outlined"
          class="w-66"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete :items="texts"
                        variant="outlined"
                        label="Textes HSE"
                        item-title="intitule"
                        item-value="id"
                        v-model="text" clearable>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="filterarticles"
      :search="search"
    >
      <template v-slot:[`item.parents`]="{ item }">
        <v-breadcrumbs :items="item.columns.parents.concat(item.raw.title)">
          <template v-slot:divider>
            <strong> <v-icon color="blue" size="large">mdi-chevron-right</v-icon></strong>
          </template>
        </v-breadcrumbs>
      </template>
      <template v-slot:[`item.article`]="{ item }">
        <div v-html="formatImages(item.columns.article, item.columns.blobs)"/>
      </template>
      <template v-slot:[`item.blobs`]="{ item }">
        <v-btn v-for="blob in item.columns.blobs" :key="blob.id" @click="showBlob(blob)" color="purple" class="mr-2"
               size="x-small">
          <v-icon icon="mdi-file-pdf" color="white"></v-icon>
          {{ blob.id }}
        </v-btn>
      </template>
      <template v-slot:[`item.annexe`]="{ item }">
        <v-btn v-if="item.columns.annexe !=null" @click="showAnnexe(item)" color="purple" class="mr-2" size="x-small">
          <v-icon icon="mdi-exclamation" color="white"></v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog_annexe" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Annexe</span>
        </v-card-title>
        <v-card-text>
          {{ annexe.intitule_annexe }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="dialog_annexe=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_blob">
      <div>
        <img :src="'data:image/png;base64,'+blob?.blob">
      </div>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { VDataTable } from 'vuetify/labs/VDataTable'
const headers = [
  {title: 'Chemin', key: 'parents', width: '20%'},
  {title: 'Article', key: 'article'},
  {title: 'Type', key: 'type'},
  {title: 'Remarque', key: 'remarque'},
  {title: 'Annexe', key: 'annexe'},
  {title: 'Blobs', key: 'blobs'},
]
// write articles in data() and use it

export default {
  components: {
    VDataTable
  },
  props: {
    articles: Array,
    breadcrumbs: Array,
  },
  data() {
    return {
      text: null,
      dialog_blob: false,
      blob: null,
      dialog_annexe: false,
      annexe: {intitule_annexe: ''},
      search: '',
      headers: headers,
      texts: [],
      filterarticles: [],
    }
  },
  beforeMount() {
    this.fetchTexts();
    this.filterarticles = this.articles
  },
  computed: {
    breadcrumbs_formated() {
      return this.breadcrumbs.map((item) => {
        return {
          text: item,
          disabled: false,
        }
      })
    },
  },
  methods: {
    formatImages(article, imgs) {
      let formattedText = article;
      for (let i = 0; i < imgs.length; i++) {
        // <v-btn v-for="blob in item.blobs" :key="blob.id" @click="showBlob(blob)" color="purple" class="mr-2" size="x-small">
        // <v-icon icon="mdi-file-pdf" color="white"></v-icon>{{blob.id}}
        //</v-btn>
        const imgTag = '<img src="data:image/png;base64, ' + imgs[i].blob + '">';
        formattedText = formattedText.replace('#img', imgTag);
      }
      return formattedText;
    },
    showBlob(item) {
      this.blob = item
      this.dialog_blob = true
    },
    showAnnexe(item) {
      this.annexe = item.annexe
      console.log(JSON.stringify(this.annexe))
      this.dialog_annexe = true
    },
    async fetchTexts() {
      await axios.get('/api/texts').then((response) => {
        this.texts = response.data;
      });
    }
  },
  watch: {
    articles: {
      immediate: true,
      handler(newArticles) {
        this.filterarticles = newArticles;
      }
    },
    text: function (val) {
      if (val) {
        this.filterarticles = this.articles.filter((article) => {
          return article.text_id == val
        })
      } else {
        this.filterarticles = this.articles
      }
      console.log(this.filterarticles);
    }
  }
}
</script>
