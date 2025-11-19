<template>
  <Accordion :value="[]" multiple>
${entities.filter(entity => entity.meta?.templates?.includes("switchboard")).map(entity => `\
    <AccordionPanel value="${entity.name}"><AccordionHeader>${entity.meta.label}</AccordionHeader><AccordionContent><${entity.name} /></AccordionContent></AccordionPanel>`).join("\n")}
  </Accordion>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import Accordion from "primevue/accordion";
  import AccordionPanel from "primevue/accordionpanel";
  import AccordionHeader from "primevue/accordionheader";
  import AccordionContent from "primevue/accordioncontent";
${entities.filter(entity => entity.meta.templates.includes("switchboard")).map(entity => `\
  import ${entity.name} from "./components/${entity.name.toLowerCase()}.vue";`).join("\n")}

  export default defineComponent({
    name: "Switchboard",
    components: {
      Accordion,
      AccordionPanel,
      AccordionHeader,
      AccordionContent,
${entities.filter(entity => entity.meta.templates.includes("switchboard")).map(entity => `\
      ${entity.name},`).join("\n")}
    }
  })
</script>
