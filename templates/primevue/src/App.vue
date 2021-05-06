<template>
  <SuspenseWithError>
    <template #default>
      <Toast position="top-right" />
      <Menubar class="op-compact" :model="[
        {icon: 'pi pi-align-left', label: 'Entities', items:[
${entities.filter(entity => !entity.meta.menu || entity.meta.menu=="Entities").map(entity => `\
          {icon: 'pi pi-table', label: '${entity.meta.label}', to: '/${entity.name.toLowerCase()}'}`).join(',\n')} ] },
        {icon: 'pi pi-align-left', label: 'Admin', items:[
${entities.filter(entity => entity.meta.menu && entity.meta.menu=="Admin").map(entity => `\
          {icon: 'pi pi-table', label: '${entity.meta.label}', to: '/${entity.name.toLowerCase()}'}`).join(',\n')} ] }
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
  import SuspenseWithError from "./components/SuspenseWithError.vue";

  export default defineComponent({
    name: "App",
    components: {
      SuspenseWithError,
    }
  })
</script>

<style>
  .big-center { text-align: center; margin: 4rem 2rem; font-size: 2rem; }
  .error { color: red; }
  .table-header { display: flex; align-items: center; justify-content: space-between; }
  .confirmation-content i { padding-right: 1rem; }
  .confirmation-content span { line-height: 2; vertical-align: top; }
  .p-float-label .p-checkbox + label { left: 1.5rem; }
  .p-datatable-resizable .p-datatable-thead > tr > th { white-space: inherit; }
  .p-datatable-resizable .p-datatable-tbody > tr > td { max-width: 20rem; white-space: nowrap; }
  .p-datatable-resizable .p-datatable-tbody > tr > td a {display: table; height:100%; width:100%;}
  .p-accordion .p-accordion-content { padding: 0; }
  .p-menubar li.p-menuitem:hover .p-submenu-list { display: block; } /* fix for submenus in PrimeVue v3.3.5 */
  div.p-field.p-invalid > span.p-float-label > span.p-inputwrapper > input { background-image: linear-gradient(to bottom, #B00020, #B00020), linear-gradient(to bottom, #B00020, #B00020); }
  div.p-field.p-invalid > span.p-float-label > label { color: #B00020; top: 34%; }

  @media screen and (min-width: 500px) { /* reduce menubar breakpoint */
    .p-menubar .p-menubar-button { display: none; }
    .p-menubar .p-menubar-root-list { position: relative; display: flex; padding: 0; background: none; }
    .p-menubar .p-menubar-root-list .p-menuitem .p-menuitem-link { border-radius: 4px!important; }
    .p-menubar .p-menubar-root-list > .p-menuitem { width: auto; position: static; }
    .p-menubar .p-submenu-list { width: 12.5rem!important; position: absolute!important; z-index: 1; }
  }

  /* Make more compact/dense */
  .op-compact .p-mr-2 { margin: 0 0.1rem!important; }
  .op-compact .p-m-0 { margin: 0 0.1rem; }
  .op-compact .p-datatable-header,
  .op-compact .p-datatable-thead > tr > th,
  .op-compact .p-datatable-tbody > tr > td,
  .op-compact .p-paginator,
  .op-compact .p-toolbar,
  .op-compact .header-button-group .p-inputtext { padding: 0.1rem 0.2rem; }
  .op-compact .header-button-group .p-input-icon-left > .p-inputtext { padding-left: 2rem; }
  .op-compact .p-paginator .p-dropdown { height: 2rem; }
  .op-compact .p-paginator .p-dropdown-label { padding-top: 0.4rem; }
  .op-compact .p-paginator-pages .p-paginator-page,
  .op-compact .p-paginator-first,
  .op-compact .p-paginator-prev,
  .op-compact .p-paginator-next,
  .op-compact .p-paginator-last,
  .op-compact .p-paginator-current { height: 2rem; min-width: 2rem; }
  .op-compact .p-datatable-thead > tr > th { white-space: normal!important; font-size: 85%; }
  .op-compact .p-button { padding: 0.2rem; }
  .op-compact .p-button.p-button-icon-only { height: 1.7rem!important; width: 1.7rem; }
  .op-compact .p-input-icon-left > i:first-of-type { position: relative; left: 1.5rem; }
  .op-compact .p-hidden-accessible { width: 1px; overflow: hidden; }
  .op-compact.p-menubar { padding: 0.3rem; }
  .op-compact.p-menubar .p-menuitem-link { padding: 0.3rem; }
</style>