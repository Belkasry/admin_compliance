<template>
  <div style="max-width :50vw">
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="arbre in texts" :key="arbre.id"
      >
        <v-expansion-panel-title>
          {{ arbre.label }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card-text>
            <tree-view id="my-tree" :initial-model="arbre.children" @treeNodeClick="handleClick">
              <template #text="{ model }">
                <!-- The TreeViewNode's model is available, and built-in classes and overrides are available -->
                <a>
                  {{ model.id }} - {{ model.title }}
                </a>
                <v-btn size="x-small" class="mx-2"
                       variant="outlined" @click="test(model)" v-if="model.children.length>0">
                  <v-icon>mdi-filter</v-icon>
                </v-btn>
              </template>
            </tree-view>
          </v-card-text>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-divider vertical></v-divider>
    <v-divider></v-divider>
  </div>
</template>
<script>
import axios from "axios";
import {TreeView} from "@grapoza/vue-tree"

const modelDefaults = {
  expandable: true,
  selectable: true,
};
export default {
  components: {
    TreeView
  },
  data: () => ({
    modelDefaults,
    selectionMode: 'selectionFollowsFocus',
    breweries: [],
    isLoading: false,
    tree: [],
    types: [],
    texts: []
  }),
  watch: {},
  mounted() {
    this.fetch()
  },
  methods: {
    handleClick(target) {
      console.log(target.treeNodeSpec.state.expanded);
      target.treeNodeSpec.state.expanded = !target.treeNodeSpec.state.expanded;
    },
    emitFetchParent(parentData) {
      this.$emit('fetch-parent', parentData);
    },
    fetch() {
      return axios.get('/api/tree')
        .then(res => {
          return res.data;
        })
        .then(data => (this.texts = data))
        .catch(err => console.log(err))
    },
    test(item){
      this.$emit('fetch-parent', item);
    },
  },
}
</script>

<style lang="css">
@import '@grapoza/vue-tree/css';
</style>
