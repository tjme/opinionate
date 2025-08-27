<template>
  <Toast position="top-right" />
  <Menubar class="op-compact" :model="[
    {icon: 'pi pi-align-left', label: 'Entities', items:[
${entities.filter(entity => !entity.meta.menu || entity.meta.menu=="Entities").map(entity => `\
      {icon: 'pi pi-table', label: '${entity.meta.label}', to: '/${entity.name.toLowerCase()}'}`).join(',\n')} ] }
    ]">
    <template #item="{ item, props, hasSubmenu }">
      <router-link v-if="item.to" :to="item.to" class="p-menuitem-link">
        <span :class="item.icon" class="p-menuitem-icon"></span>
        <span>{{ item.label }}</span>
      </router-link>
      <a v-else :href="item.url" :target="item.target" v-bind="props.action">
        <span :class="item.icon"></span>
        <span>{{ item.label }}</span>
        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down"></span>
      </a>
    </template>
  </Menubar>
  <SuspenseWithError>
    <template #default>
      <router-view></router-view>
    </template>
    <template #fallback>
      <p class="big-center">Loading, please wait ...</p>
    </template>
    <template #error="props">
      <p class="big-center error">{{ props.error }}</p>
    </template>
  </SuspenseWithError>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import SuspenseWithError from "./components/SuspenseWithError.vue";

  export default defineComponent({
    name: "App",
    components: {
      SuspenseWithError,
    }
  })
</script>
