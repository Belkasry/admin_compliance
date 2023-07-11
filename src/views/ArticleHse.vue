<template>
  <div>
    <div style="background: black;" class="py-4">
      <v-btn @click.stop="drawer = !drawer" class="mx-5" color="white" outlined>
        <v-icon>mdi-file-tree</v-icon>
      </v-btn>
      <v-btn @click="dialog_import=true" tonal color="info">
        <v-icon>mdi-file-import</v-icon>
        Importer
      </v-btn>
    </div>
    <v-navigation-drawer
      width="50vw"
      permanent
      location="right"
      v-model="drawer"
    >
      <ArbreTexte @fetch-parent="callback" ref="arbre"></ArbreTexte>
    </v-navigation-drawer>
    <v-card class="ma-5">
      <ArticlesList :articles="articles" :breadcrumbs="breadcrumbs"></ArticlesList>
    </v-card>
    <v-dialog v-model="dialog_import" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Importer un fichier</span>
          <v-alert v-if="error" type="error">
            {{ error }}
          </v-alert>
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="excelFile"
            accept=".xls,.xlsx"
            label="Import Excel File"
            variant="outlined"
            prepend-inner-icon="mdi-file-excel"
            density="compact"
            color="primary"
          ></v-file-input>
          <template v-if="excelFile">
            <v-autocomplete
              v-model="text_id"
            variant="outlined"
            :items="texts"
            label="Textes HSE"
            item-value="id"
            item-title="intitule"
            >
            </v-autocomplete>
            <v-select
              v-model="columns.column_dernier_title"
              :items="excelColumns"
              label="Column du Dernier titre"
              variant="outlined"
              dense
              item-title="column"
              item-value="order"
              clearable="true"
              color="primary"></v-select>
            <v-select
              v-model="columns.column_article"
              :items="excelColumns"
              label="Column description Article"
              variant="outlined"
              dense
              clearable="true"
              item-title="column"
              item-value="order"
              color="primary"></v-select>
            <v-select
              v-model="columns.column_type"
              :items="excelColumns"
              label="Column Type"
              variant="outlined"
              dense
              clearable="true"
              item-title="column"
              item-value="order"
              color="primary"></v-select>
            <v-select
              v-model="columns.column_remarque"
              :items="excelColumns"
              label="Column Remarque"
              variant="outlined"
              dense
              clearable="true"
              item-title="column"
              item-value="order"
              color="primary"></v-select>
            <v-select
              v-model="columns.column_annexe"
              :items="excelColumns"
              label="Column Annexe"
              variant="outlined"
              dense
              clearable="true"
              item-title="column"
              item-value="order"
              color="primary"></v-select>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="dialog_import=false">Cancel</v-btn>
          <v-btn color="blue darken-1" @click="submitMap">Importer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import ArbreTexte from "@/components/ArbreTexte.vue";
import ArticlesList from "@/components/ArticlesList.vue";
const treeData = {
  name: 'title TEXTE HSE',
  children: []
}

export default {
  components: {ArticlesList, ArbreTexte},
  data() {
    return {
      texts:[],
      text_id: null,
      dialog_import: false,
      drawer: false,
      error: null,
      treeData,
      treeDatas: [],
      breadcrumbs: ["TEXTE HSE"],
      articles: [],
      columns: {
        column_text: 1,
        column_dernier_title: 5,
        column_article: 6,
        column_type: 7,
        column_annexe: 8,
        column_remarque: 9,
      },
      excelFile: null,
      excelColumns: [
        {order: 1, column: "A"},
      ]
    }
  },
  mounted() {
    this.fetch();
  },
  watch: {
    excelFile: function () {
      this.getHeader();
    },
  },
  methods: {
    async getHeader() {
      const formData = new FormData();
      if (this.excelFile) {
        let filesArray = Array.isArray(this.excelFile)
          ? this.excelFile
          : [this.excelFile];
        Array.from(filesArray).forEach((file) => {
          formData.append("file", file);
        });
      }
      await axios
        .post("/api/excel/header", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.excelColumns = response.data;
        })
        .catch((error) => {
          this.error = error.response.data.message;
          console.log(error);
        });
    },
    async submitMap() {
      const formData = new FormData();
      formData.append('column_text', this.columns.column_text);
      formData.append('column_dernier_title', this.columns.column_dernier_title);
      formData.append('column_article', this.columns.column_article);
      formData.append('column_type', this.columns.column_type);
      formData.append('column_annexe', this.columns.column_annexe);
      formData.append('column_remarque', this.columns.column_remarque);
      formData.append('text_id', this.text_id);

      if (this.excelFile) {
        let filesArray = Array.isArray(this.excelFile)
          ? this.excelFile
          : [this.excelFile];
        Array.from(filesArray).forEach((file) => {
          formData.append("file", file);
        });
      }
      await axios
        .post("/api/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          this.dialog_import = false;
          this.fetch()
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    fetch() {
      this.init()
      this.$refs.arbre.fetch();
    },
    async init() {
      const response = await axios.get('/api/text')
      this.articles = await response.data
      const response_texts = await axios.get('/api/texts')
      this.texts = await response_texts.data;
    },
    async callback(model) {
      let id = model.id;
      let response;
      if (id) {
        response = await axios.get('/api/text/' + id)
        this.articles = response.data
        if (this.articles.length > 0) {
          const response_breadcrumbs = (await axios.get('/api/parents/' + id));
          this.breadcrumbs = response_breadcrumbs.data;
        }
      } else {
        let id = model.text_id;
        response = await axios.get('/api/text_hse/' + id);
        this.articles = response.data
        if (this.articles.length > 0) {
          this.breadcrumbs = [this.articles[0].text.intitule]
        }
      }
    },
    async getTreeData() {
      const response = await axios.get('/api/tree')
      this.treeDatas = await response.data;
    },
    async reloadArbre() {

    }
  }
}
</script>
