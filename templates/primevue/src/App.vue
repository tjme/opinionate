<template>
  <SuspenseWithError>
    <template #default>
      <Toast position="top-right" />
      <Menubar class="op-compact" :model="[
        {icon: 'pi pi-align-left', label: 'Entities', items:[
${types.filter(t => !t.meta.menu || t.meta.menu=="Entities").map(types => `\
          {icon: 'pi pi-table', label: '${types.meta.label}', to: '/${types.name.toLowerCase()}'}`).join(',\n')} ] },
        {icon: 'pi pi-align-left', label: 'Admin', items:[
${types.filter(t => t.meta.menu && t.meta.menu=="Admin").map(types => `\
          {icon: 'pi pi-table', label: '${types.meta.label}', to: '/${types.name.toLowerCase()}'}`).join(',\n')} ] }
        ]" />
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
  import Menubar from "primevue/menubar";
  import SuspenseWithError from "./components/SuspenseWithError.vue";
  import Toast from "primevue/toast";

  export default defineComponent({
    name: "App",
    components: {
      Menubar,
      SuspenseWithError,
      Toast,
    }
  })
</script>

<style>
  .big-center { text-align: center; margin: 4rem 2rem; font-size: 2rem; }
  .error { color: red; }
  .p-datatable-resizable .p-datatable-thead > tr > th { white-space: inherit; }
  .p-datatable-resizable .p-datatable-tbody > tr > td { max-width: 20rem; white-space: inherit; }
  .p-dialog-content .p-field { padding-top: 0.3rem; }
  .p-dialog-content .p-checkbox { padding-left: 0.3rem; }
  .p-dialog-content .p-field textarea { width: 100%; height: 4rem; }
  .p-accordion .p-accordion-content { padding: 0; }
  .p-menubar li.p-menuitem:hover .p-submenu-list { display: block; } /* fix for submenus in PrimeVue v3.3.5 */

  /* Make more compact/dense */
  .op-compact .p-mr-2 { margin: 0 0.2rem!important; }
  .op-compact .p-m-0 { margin: 0 0.2rem; }
  .op-compact .p-datatable-header,
  .op-compact .p-datatable-thead > tr > th,
  .op-compact .p-datatable-tbody > tr > td,
  .op-compact .p-paginator,
  .op-compact .p-toolbar,
  .op-compact .p-inputtext { padding: 0.2rem 0.4rem!important; }
  .op-compact .p-input-icon-left > .p-inputtext { padding-left: 2rem!important; }
  /* .op-compact .p-dropdown { height: 2rem; } */
  .op-compact .p-dropdown-label { padding-top: 0.7rem!important; }
  /* .op-compact .p-paginator-pages .p-paginator-page,
  .op-compact .p-paginator-first,
  .op-compact .p-paginator-prev,
  .op-compact .p-paginator-next,
  .op-compact .p-paginator-last,
  .op-compact .p-paginator-current { height: 2rem; min-width: 2rem; } */
  .op-compact .p-button { padding: 0.2rem; }
  .op-compact .p-button.p-button-icon-only { height: 1.7rem!important; width: 1.7rem; }
  .op-compact .p-input-icon-left > i:first-of-type { position: relative; left: 1.5rem; }
  .op-compact .p-hidden-accessible { width: 1px; overflow: hidden; }
  /* .op-compact .button-nogap,
  .op-compact .p-fileupload { margin-right: 0!important; } */
  /* .op-compact .p-input-icon-left,
  .op-compact .p-input-icon-right,
  .op-compact .p-button,
  .op-compact .p-buttonset { margin-right: 4px!important; } */
  /* .op-compact .header-button-group { text-align: right; } */
  /* #app .header-button-group .p-input-icon-left { flex-shrink: 3; } */
  .op-compact.p-menubar { padding: 0.3rem; }
  .op-compact.p-menubar .p-menuitem-link { padding: 0.3rem; }
</style>