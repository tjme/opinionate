<template>
  <Accordion :multiple="true">
${types.filter(t => t.meta.templates.includes("switchboard")).map(types => `\
    <AccordionTab header="${types.meta.label}"><${types.name} /></AccordionTab>`).join("\n")}
  </Accordion>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import Accordion from "primevue/accordion";
  import AccordionTab from 'primevue/accordiontab';
${types.filter(t => t.meta.templates.includes("switchboard")).map(types => `\
  import ${types.name} from "./components/${types.name.toLowerCase()}.vue";`).join("\n")}

  export default defineComponent({
    name: "Switchboard",
    components: {
      Accordion,
      AccordionTab,
${types.filter(t => t.meta.templates.includes("switchboard")).map(types => `\
      ${types.name},`).join("\n")}
    }
  })
</script>
