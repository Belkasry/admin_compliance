<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="valeurRefs"
      :search="search"
      :loading="loading"
      :loading-text="'Loading...'"
      :no-data-text="'No data found'"
      item-key="id"
    >
      <template #top>
        <v-toolbar color="black">
          <v-toolbar-title>Valeurs Référentielles</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
        v-model="search"
        label="Search"
        single-line
        append-inner-icon="mdi-magnify"
        variant="underlined"
        class="mx-2 mt-1"
        clearable
        ></v-text-field>
        <v-btn   color="white" class="mx-2" @click="openDialog" variant="outlined">Add New</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item.raw)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.ref" label="Ref"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.value" label="Value"></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-select v-model="editedItem.type"
                          :items="[
                            'status_text',
                            'status_norme',
                            'etat_norme',
                            'status_disklosure_text',
                            'nature_text'
                            ]"
                          label="Type"></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      valeurRefs: [], // Array to hold ValeurRef records
      search: '', // Search query
      loading: false, // Loading indicator
      dialog: false, // Dialog control
      formTitle: '', // Title for the form in the dialog
      editedItem: {}, // Currently edited item
      mode: 'add', // Form mode: add or edit
      headers: [
        {title: 'Ref', key: 'ref'},
        {title: 'Value', key: 'value'},
        {title: 'Type', key: 'type'},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
    };
  },
  methods: {
    // Fetch all ValeurRef records
    fetchValeurRefs() {
      // Set loading indicator to true
      this.loading = true;

      // Perform an API request to fetch the records
      // Replace 'api/valeur-refs' with your actual API endpoint
      axios.get('api/valrefs').then((response) => {
        this.valeurRefs = response.data;
        this.loading = false;
      }).catch((error) => {
        console.error(error);
        this.loading = false;
      });
    },
    // Open the dialog for adding/editing a record
    openDialog() {
      this.formTitle = 'Add New';
      this.mode = 'add';
      this.editedItem = {};
      this.dialog = true;
    },
    // Close the dialog
    closeDialog() {
      this.dialog = false;
    },
    // Save the added/edited record
    async saveItem() {
      if (this.mode == 'add') {
        await axios.post('api/valrefs', this.editedItem).then(() => {
          this.dialog = false;
          this.fetchValeurRefs();
        }).catch((error) => {
          console.error(error);
        });
      } else if (this.mode == 'edit') {
        const id = this.editedItem.id;
        delete this.editedItem.id;
        await axios.put(`api/valrefs/${id}`, this.editedItem).then(() => {
          this.dialog = false;
          this.fetchValeurRefs();
        }).catch((error) => {
          console.error(error);
        });
      }
    },
    // Edit an existing record
    editItem(item) {
      this.formTitle = 'Edit';
      this.mode = 'edit';
      this.editedItem = item.raw;
      //unset created_at and updated_at
      delete this.editedItem.created_at;
      delete this.editedItem.updated_at;
      this.dialog = true;
    },
    // Delete a record
    deleteItem(item) {
      if (confirm('Are you sure you want to delete this item?')) {
        // Perform an API request to delete the record
        // Replace 'api/valeur-refs' with your actual API endpoint
        axios.delete(`api/valrefs/${item.id}`).then(() => {
          this.fetchValeurRefs();
        }).catch((error) => {
          console.error(error);
        });
      }
    },
  },
  mounted() {
    // Fetch the initial list of records when the component is mounted
    this.fetchValeurRefs();
  },
};
</script>
