${!types.meta.templates.includes("list") ? "" : `\
<template>
  <div class="card">
    <DataTable `+(types.meta.attributes
      || ":autoLayout='true' :resizableColumns='true' columnResizeMode='expand' breakpoint='400px'")+`
      ref="dtMaster" :value="records" v-model:selection="selectedRecords"
      dataKey="nodeId" :filters="filters" :paginator="true"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20, 40]" :rows="20"
      currentPageReportTemplate="{first} to {last} (of {totalRecords})"
      class="op-compact p-datatable-striped p-datatable-gridlines"
    >
      <template #header>
        <div class="table-header">
          <h2 class="p-m-0">`+types.meta.label+` List</h2>
          <div class="header-button-group">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Filter..." style="width:8rem" />
            </span>
`+(types.meta.readonly ? "" : `\
            <Button
              label="New"
              icon="pi pi-plus"
              class="p-button-success p-mr-2"
              @click="openNew"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              class="p-button-danger p-mr-2"
              @click="confirmDeleteSelected"
              :disabled="!selectedRecords || !selectedRecords.length"
            />
`)+`            <Button
              label="Export"
              icon="pi pi-upload"
              class="p-button-help p-mr-2"
              @click="dtMaster.exportCSV()"
            />
          </div>
        </div>
      </template>
      <Column :exportable="false" draggable="false">
        <template #body="slotProps">
          <Button
            icon="pi pi-`+(types.meta.readonly ? 'info' : 'pencil')+`"
            class="p-button-rounded p-button-success p-mr-2"
            @click="editRecord(slotProps.data)"
          />
`+(types.meta.readonly ? "" : `\
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-warning"
            @click="confirmDeleteRecord(slotProps.data)"
          />
`)+`        </template>
      </Column>
`+(types.meta.readonly ? "" : `\
      <Column :exportable="false" draggable="false" selectionMode="multiple" headerStyle="width:2rem"></Column>
`)+(types.fields.filter(f => isField(f) && f.meta.templates.includes("list")).map(fields => `\
      <Column field="`+fields.name+`" header="`+fields.meta.label+`" \
`+(fields.meta.readonly ? 'readonly ' : '')
+(fields.meta.attributes || ":sortable='true'")
+(fields.meta.align!='left' ? ' headerStyle="text-align:'+fields.meta.align+'" bodyStyle="text-align:'+fields.meta.align+'"' : '')+" >"
+(fields.meta.format=='boolean' ? '<template #body="slotProps"><Checkbox name="'+fields.name+'" v-model="slotProps.data.'+fields.name+'" :binary="true" :disabled="true" /></template>' : '')
+(fields.meta.format=='date' ? '<template #body="slotProps">{{formatDate(slotProps.data.'+fields.name+')}}</template>' : '')
+(fields.meta.format=='datetime' ? '<template #body="slotProps">{{formatDateTime(slotProps.data.'+fields.name+')}}</template>' : '')
+(fields.meta.format=='currency' ? '<template #body="slotProps">{{formatCurrency(slotProps.data.'+fields.name+')}}</template>' : '')
+"</Column>").join("\n"))
+`    </DataTable>
  </div>

  <Dialog
    v-model:visible="recordDialog"
    :style="{ width: '450px' }"
    header="`+types.meta.label+` Details"
    :modal="true"
    class="op-compact p-fluid"
  >
`+(types.fields.filter(f => isField(f) && f.meta.templates.includes("crud")).map(fields =>
    '<div class="p-field"><span class="p-float-label"><'
+(fields.meta.format=='text' ? 'Textarea :autoResize="true"'
: fields.meta.format=='boolean' ? 'Checkbox :binary="true"'
: fields.meta.format=='date' ? 'Calendar dateFormat="d M yy"'
: fields.meta.format=='datetime' ? 'Calendar dateFormat="d M yy" :showTime="true"'
: fields.meta.format=='currency' ? 'InputNumber mode="currency" currency="GBP"'
: fields.meta.format=='number' ? 'InputNumber :useGrouping=false'
: 'InputText')+' id="'+fields.name+'" v-model="record.'+fields.name.toLowerCase()+'" '
+(!fields.meta.readonly && !types.meta.readonly ? '' : 'readonly disabled')+' /><label for="'+fields.name+'">'+fields.meta.label+'</label></span></div>').join("\n"))+`
    <template #footer>
      <Button label="`+(types.meta.readonly ? 'Close' : 'Cancel')+`" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
`+(types.meta.readonly ? '' : `\
      <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveRecord" />
`)+`    </template>
  </Dialog>

  <Dialog
    v-model:visible="deleteRecordDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span v-if="record"
        >Are you sure you want to delete
        <b>{{ recordName(record) }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        class="p-button-text"
        @click="deleteRecordDialog = false"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        class="p-button-text"
        @click="deleteRecord"
      />
    </template>
  </Dialog>

  <Dialog
    v-model:visible="deleteRecordsDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span v-if="record"
        >Are you sure you want to delete the selected records?</span
      >
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        class="p-button-text"
        @click="deleteRecordsDialog = false"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        class="p-button-text"
        @click="deleteSelectedRecords"
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import InputText from "primevue/inputtext";
  import InputNumber from "primevue/inputnumber";
  import Calendar from "primevue/calendar";
  import Checkbox from "primevue/checkbox";
  import Textarea from "primevue/textarea";
  import Button from "primevue/button";
  import Dialog from "primevue/dialog";
  import { useToast } from "primevue/usetoast";
  import { useQuery, useMutation } from "villus";
  import gql from 'graphql-tag';
  import { `+types.name+(types.meta.readonly ? '' : ', '+types.name.toLowerCase()+'Patch')+` } from '../../models/types';

  const `+types.name+`Fields = gql\`fragment `+types.name+`Fields on `+types.name+` {`
+(types.fields.filter(f => isField(f))[0].name == "nodeId" ? "" : "nodeId:"+types.fields.filter(f => isField(f))[0].name+",")
+(types.fields.filter(f => isField(f)).map(fields => fields.name))+` }\`;
  const ReadAll = gql\`query readAll{all`+pluralize(types.name)+`
    {nodes{...`+types.name+`Fields } } } $\{ `+types.name+`Fields}\`;
  const Read = gql\`query read($nodeId:ID!){ `+types.name.toLowerCase()+`(nodeId:$nodeId)
    {...`+types.name+`Fields } } $\{ `+types.name+`Fields}\`;
  const Create = gql\`mutation create(`+types.fields
    .filter(f => isField(f) && f.meta.templates.includes("crud")).map(fields => '$'+fields.name+':'+getType(fields)+(fields.type.kind=="NON_NULL" ? "!" : ""))+`)
    {create`+types.name+`(input:{`+types.name.toLowerCase()+`:{ `+types.fields
        .filter(f => isField(f) && f.meta.templates.includes("crud")).map(fields => fields.name+':\$'+fields.name)+` } })
    { `+types.name.toLowerCase()+`{...`+types.name+`Fields } } } $\{ `+types.name+`Fields}\`;
  const Update = gql\`mutation update(`+types.fields
    .filter(f => isField(f) && (f.name=="nodeId" || f.meta.templates.includes("crud"))).map(fields => '$'+fields.name+':'+getType(fields)+(fields.name=="nodeId" ? "!" : ""))+`)
    {update`+types.name+`(input:{nodeId:$nodeId,
    `+types.name.toLowerCase()+`Patch:{ `+types.fields
      .filter(f => isField(f) && f.name!=="nodeId" && f.meta.templates.includes("crud")).map(fields => fields.name+':\$'+fields.name)+` } })
    { `+types.name.toLowerCase()+`{...`+types.name+`Fields } } } $\{ `+types.name+`Fields}\`;
  const Delete = gql\`mutation delete($nodeId:ID!)
    {delete`+types.name+`(input:{nodeId:$nodeId})
    { `+types.name.toLowerCase()+`{...`+types.name+`Fields } } } $\{ `+types.name+`Fields}\`;

  const defaultRecord: `+types.name+` | { `+types.fields.filter(f => isField(f)).map(fields =>
fields.name+': '+(isType(fields, "Int") ? 'number' : 'string')+'|null').join(",")+` } =
    Object.freeze({ `+types.fields.filter(f => isField(f)).map(fields => fields.name+': '+(fields.meta.default || null)).join(",")+` });

  export default defineComponent({
    name: "`+types.name+`",
    components: {
      DataTable,
      Column,
      InputText,
      InputNumber,
      Calendar,
      Checkbox,
      Textarea,
      Button,
      Dialog,
    },
    async setup() {
      function formatCurrency(value: string): string | void {
        if (value) {
          const v = +value;
          return v.toLocaleString("en-GB", {style: "currency", currency: "GBP"});
        }
      };
      function formatDate(value: string): string | void {
        if (value) {
          const v = new Date(value);
          return v.toLocaleString("en-GB", {year: "numeric", month: "short", day: "numeric"});
        }
      };
      function formatDateTime(value: string): string | void {
        if (value) {
          const v = new Date(value);
          return v.toLocaleString("en-GB", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"});
        }
      };
      const filters = ref({'global': {value: null}});
      const toast = useToast();
      const dtMaster = ref(null);
      const recordDialog = ref(false);
      const deleteRecordDialog = ref(false);
      const deleteRecordsDialog = ref(false);
      const record = ref(<any>null);
      const selectedRecords = ref(null);
      const submitted = ref(false);
      const { data: cRecs, execute: cEx, error: cErrors } = useMutation(Create); // Must be defined before first await
      const { data: uRecs, execute: uEx, error: uErrors } = useMutation(Update); // Must be defined before first await
      const { data: dRecs, execute: dEx, error: dErrors } = useMutation(Delete); // Must be defined before first await
      const { data: raRecs, error: raErrors } = await useQuery({query: ReadAll});
      raErrors.value && console.log("ReadAll Errors:"+JSON.stringify(raErrors.value.response.body.errors));
      const records = ref( raRecs.value.all`+pluralize(types.name)+`.nodes.map(r => {\ // fix for string columns that should be/sort as numeric
`+types.fields.filter(f => isField(f)).map(f =>
['number','currency'].includes(f.meta.format) ? 'r.'+f.name+' = r.'+f.name+' && +r.'+f.name+';' :
//['date'].includes(f.meta.format) ? 'r.'+f.name+' = formatDate(r.'+f.name+');' :
//['datetime'].includes(f.meta.format) ? 'r.'+f.name+' = formatDate(r.'+f.name+');' :
'').join('')+`
      return r }));

      function recordName(record: `+types.name+`): string | null {
        return `+types.fields.filter(f => isField(f)).map(fields => `"`+fields.meta.label+`: "+record.`+fields.name).join("+', '+")+`;
      };
      function openNew() {
        record.value = { ...defaultRecord };
        submitted.value = false;
        recordDialog.value = true;
      };
      function hideDialog() {
        recordDialog.value = false;
        submitted.value = false;
      };
      function findIndexById(nodeId: string) {
        let index = -1;
        for (let i = 0; i < records.value.length; i++) {
          if (records.value[i].nodeId === nodeId) {
            index = i;
            break;
          }
        }
        return index;
      };
      async function saveRecord() {
        submitted.value = true;

        if (record.value.nodeId) { // it's an update:
          console.log("Update Pre:"+JSON.stringify(record.value));
          await uEx( record.value );
          uErrors.value && console.log("Update Errors:"+JSON.stringify(uErrors.value.response.body.errors));
          records.value[findIndexById(record.value.nodeId)] = uRecs.value.update`+types.name+`.`+types.name.toLowerCase()+`;
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Record Updated",
            life: 3000,
          });
        } else { // it's a create:
          console.log("Create Pre:"+JSON.stringify(record.value));
          await cEx( {\
`+types.fields.filter(f => isField(f) && f.name!=="nodeId").map(fields => ` `+fields.name+`: record.value.`+fields.name).join(",")+` } );
          cErrors.value && console.log("Create Errors:"+JSON.stringify(cErrors.value.response.body.errors));
          records.value.push(cRecs.value.create`+types.name+`.`+types.name.toLowerCase()+`);
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Record Created",
            life: 3000,
          });
        };
        recordDialog.value = false;
        record.value = { ...defaultRecord };
      };
      function editRecord(rec: `+types.name+`) {
        record.value = { ...rec };
        recordDialog.value = true;
      };
      function confirmDeleteRecord(rec: `+types.name+`) {
        record.value = rec;
        deleteRecordDialog.value = true;
      };
      async function deleteRecord() {
        deleteRecordDialog.value = false;
        console.log("Delete Pre:"+JSON.stringify(record.value));
        await dEx( record.value );
        dErrors.value && console.log("Delete Errors:"+JSON.stringify(dErrors.value.response.body.errors));
        records.value = records.value.filter((val: `+types.name+`) => val.nodeId !== dRecs.value.delete`+types.name+`.`+types.name.toLowerCase()+`.nodeId);
        record.value = { ...defaultRecord };
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Record Deleted",
          life: 3000,
        });
      };
      function confirmDeleteSelected() {
        deleteRecordsDialog.value = true;
      };
      function deleteSelectedRecords() {
        selectedRecords.value.forEach(async (rec: `+types.name+`) => await dEx( rec ));
        records.value = records.value.filter((val: `+types.name+`) => !selectedRecords.value.includes(val));
        deleteRecordsDialog.value = false;
        selectedRecords.value = null;
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Records Deleted",
          life: 3000,
        });
      };
      return {
        formatCurrency,
        formatDate,
        formatDateTime,
        recordName,
        openNew,
        hideDialog,
        saveRecord,
        editRecord,
        confirmDeleteRecord,
        deleteRecord,
        confirmDeleteSelected,
        deleteSelectedRecords,
        filters,
        dtMaster,
        recordDialog,
        deleteRecordDialog,
        deleteRecordsDialog,
        record,
        selectedRecords,
        submitted,
        records,
      }
    }
  });
</script>

<style>
  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .confirmation-content i {
    padding-right: 1rem;
  }
  .confirmation-content span {
    line-height: 2;
    vertical-align: top;
  }
  /* .p-datatable { min-width: 550px; } */
</style>
`}