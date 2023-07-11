<template>
  <v-layout>
    <v-navigation-drawer
      expand-on-hover
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          title="Sandra Adams"
          subtitle="sandra_a88@gmailcom"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>


      <v-list density="compact" nav>
        <v-list-item link to="/bulletin" prepend-icon="mdi-script-text-outline" title="Bulletins"
                     value="bulletins"></v-list-item>
        <v-list-item link to="/text" prepend-icon="mdi-text-box" title="Textes HSE" value="texts"></v-list-item>
        <v-list-item link to="/article" prepend-icon="mdi-card-text-outline" title="Articles"
                     value="articles"></v-list-item>
        <v-list-item link to="/norme" prepend-icon="mdi-text-short" title="Normes" value="normes"></v-list-item>
        <v-divider></v-divider>
        <v-list-item link to="/valref" prepend-icon="mdi-cog-box" title="Valeur Référentielles"
                     value="valeurs"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="height: 100vh"></v-main>
  </v-layout>
</template>

<script>
export default {};
</script>
