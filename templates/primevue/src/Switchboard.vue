<template>
  <Accordion :multiple="true">
${entities.filter(entity => entity.meta.templates.includes("switchboard")).map(entity => `\
    <AccordionTab header="${entity.meta.label}"><${entity.name} /></AccordionTab>`).join("\n")}
  </Accordion>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import Accordion from "primevue/accordion";
  import AccordionTab from 'primevue/accordiontab';
${entities.filter(entity => entity.meta.templates.includes("switchboard")).map(entity => `\
  import ${entity.name} from "./components/${entity.name.toLowerCase()}.vue";`).join("\n")}

  export default defineComponent({
    name: "Switchboard",
    components: {
      Accordion,
      AccordionTab,
${entities.filter(entity => entity.meta.templates.includes("switchboard")).map(entity => `\
      ${entity.name},`).join("\n")}
    }
  })
</script>
