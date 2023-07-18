<template>
  <v-card>
    <v-card-title>{{ text.intitule }}</v-card-title>
    <v-card-text>
      <p><strong>Written At:</strong> {{ text.written_at }}</p>
      <p><strong>Status Disklosure:</strong> {{ text.status_disklosure }}</p>
      <p><strong>Nature:</strong> {{ text.nature }}</p>
      <p><strong>Status:</strong> {{ text.status }}</p>
      <p><strong>Domain:</strong> {{ text.domain?.name }}</p>
      <p><strong>Scope:</strong> {{ text.scope?.name }}</p>
      <p><strong>Has Annexe:</strong> {{ text.has_annexe ? 'Yes' : 'No' }} - <v-icon v-if="text.annexe_id" @click="downloadFile(text.annexe_id)" >mdi-content-save</v-icon> </p>
      <p><strong>Is Digital:</strong> {{ text.is_digital ? 'Yes' : 'No' }}</p>
      <p><strong>Has Schema:</strong> {{ text.has_schema ? 'Yes' : 'No' }}</p>
      <p><strong>Important:</strong> {{ text.important ? 'Yes' : 'No' }}</p>
      <p><strong>BO:</strong> {{ text.bo?.num_bo}} - <v-icon v-if="text.bo?.document_id" @click="downloadFile(text.bo?.document_id)" >mdi-content-save</v-icon> </p>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      text: {},
    };
  },

  mounted() {
    this.fetchText();
  },
  methods: {
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
    async fetchText() {
      return await axios.get(`/api/texts/${this.$route.params.id}`)
        .then(res => {
          return res.data;
        })
        .then(data => (this.text = data))
        .catch(err => console.log(err))
    },
  },
};
</script>
