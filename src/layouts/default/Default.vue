<template>
  <v-app>
    <div class="container-layout">
      <div class="menu-layout">
        <MenuDrawer></MenuDrawer>
      </div>
      <v-card class="card-layout">
        <default-view/>
      </v-card>
    </div>

  </v-app>
</template>

<script setup>
import DefaultView from './View.vue'
import MenuDrawer from "@/layouts/default/MenuDrawer.vue";
</script>
<style>
.container-layout {
  display: flex;
  min-height: 100vh;
}

.menu-layout {
  flex: 0 0 auto;
  min-height: 100vh;
  /* Add any additional styles for the menu */
}

.card-layout {
  flex: 1;
  /* Add any additional styles for the card */
}
</style>
