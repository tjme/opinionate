<template>
  <SuspenseWithError>
    <template #default>
      <Toast position="top-right" />
      <Accordion :multiple="true">
${types.map(types => `\
	      <AccordionTab header="${types.meta.label}">
          <${types.name} />
        </AccordionTab>`).join("\n")}
        </Accordion>
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
  import Toast from "primevue/toast";
  import Accordion from "primevue/accordion";
  import AccordionTab from 'primevue/accordiontab';
${types.map(types => `\
  import ${types.name} from "./components/${types.name.toLowerCase()}.vue";`).join("\n")}

  export default defineComponent({
    name: "App",
    components: {
      SuspenseWithError,
      Toast,
      Accordion,
      AccordionTab,
${types.map(types => `\
      ${types.name},`).join("\n")}
    }
  })
</script>

<style>
.big-center { text-align: center; margin: 4rem 2rem; font-size: 2rem; }
.error { color: red; }

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
  .op-compact .p-button.p-button-icon-only { height: 2rem; width: 2rem; }
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
</style>