${!entity.meta.templates.includes("list") ? "" : `\
<template>
  <div class="card">
    <DataTable `+(entity.meta.attributes
      || ":autoLayout='true' :resizableColumns='true' columnResizeMode='expand' breakpoint='400px'")+`
      ref="dtMaster" :value="records" v-model:selection="selectedRecords"
      dataKey="nodeId" :filters="filters" :paginator="true"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[8, 16, 32, 64]" :rows="16"
      currentPageReportTemplate="{first} to {last} (of {totalRecords})"
      class="op-compact p-datatable-striped p-datatable-gridlines" >
      <template #header>
        <div class="table-header">
          <h2 class="p-m-0">{{title}}</h2>
          <div class="header-button-group">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Filter..." style="width:8rem" />
            </span>
`+(entity.meta.readonly && entity.meta.readonly!="false" ? "" : `\
            <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
            <Button label="Delete" icon="pi pi-trash" class="p-button-danger p-mr-2" @click="confirmDeleteSelected" :disabled="!selectedRecords || !selectedRecords.length" />
`)+`            <Button label="Export" icon="pi pi-upload" class="p-button-help p-mr-2" @click="dtMaster.exportCSV()" />
          </div>
        </div>
      </template>
      <Column :exportable="false" draggable="false">
        <template #body="slotProps">
          <Button icon="pi pi-`+(entity.meta.readonly && entity.meta.readonly!="false" ? 'info' : 'pencil')+`"
            class="p-button-rounded p-button-success p-mr-2" @click="editRecord(slotProps.data)" />
`+(entity.meta.readonly && entity.meta.readonly!="false" ? "" : `\
          <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteRecord(slotProps.data)" />
`)+`        </template>
      </Column>
`+(entity.meta.readonly && entity.meta.readonly!="false" ? "" : `\
      <Column :exportable="false" draggable="false" selectionMode="multiple" headerStyle="width:2rem"></Column>`)+(entity.fields.filter(f => f.meta.templates.includes("list") && getType(f)!=null).map(fields => `
      <Column field="`+fields.name+(isField(fields) ? '' : '.totalCount')+`" header="`+fields.meta.label+`" \
`+(fields.meta.readonly && fields.meta.readonly!="false" ? 'readonly ' : '')
+(fields.meta.attributes || ":sortable='true'")
+(fields.meta.align!='left' ? ' headerStyle="text-align:'+fields.meta.align+'" bodyStyle="text-align:'+fields.meta.align+'"' : '')+" >"
+((fields.meta.linkEntity ? '<template #body="slotProps"><a :href=\'"/#/'+fields.meta.linkEntity+'?'+(fields.meta.linkFields || entities.find(e => (e.name)==fields.meta.linkEntity).meta.primaryKey)+'="+slotProps.data.'+fields.meta.linkFieldsFrom+'\' v-text="slotProps.data.'+fields.name+(getType(fields)==false ? '.totalCount' : '')+'" >' : '')
+(fields.meta.format=='boolean' ? '<template #body="slotProps"><Checkbox name="'+fields.name+'" v-model="slotProps.data.'+fields.name+'" :binary="true" :disabled="true" /></template>' :
fields.meta.format=='date' ? '<template #body="slotProps">{{formatDate(slotProps.data.'+fields.name+')}}</template>' :
fields.meta.format=='datetime' ? '<template #body="slotProps">{{formatDateTime(slotProps.data.'+fields.name+')}}</template>' :
fields.meta.format=='currency' ? '<template #body="slotProps">{{formatCurrency(slotProps.data.'+fields.name+')}}</template>' : '')
+(fields.meta.linkEntity ? '</a></template>' : ''))
+"</Column>").join(""))+`
    </DataTable>
  </div>

  <Dialog v-model:visible="recordDialog" header="`+entity.meta.label+` Details" :modal="true"
    class="op-compact" >`+(entity.fields.filter(f => isField(f) && f.meta.templates.includes("crud")).map(fields => `
    <div class="p-field" :class="errors.`+fields.name+' ? \'p-invalid\' : \'\'"><FloatLabel variant="in" class="p-float-label"><'
+(fields.meta.format=='text' ? 'Textarea :autoResize="true"'
: fields.meta.format=='boolean' ? 'Checkbox :binary="true"'
: fields.meta.format=='date' ? 'DatePicker dateFormat="d M yy"'
: fields.meta.format=='datetime' ? 'DatePicker dateFormat="d M yy" :showTime="true"'
: fields.meta.format=='currency' ? 'InputNumber mode="currency" currency="GBP"'
: fields.meta.format=='number' ? 'InputNumber :useGrouping=false'
: 'InputText')+' id="'+fields.name+'" v-model="'+fields.name+'V" variant="filled" fluid'
+(!(fields.meta.readonly && fields.meta.readonly!="false") && !(entity.meta.readonly && entity.meta.readonly!="false") ? '' : ' readonly disabled')+' /><label for="'+fields.name+'">'+fields.meta.label+'</label></FloatLabel><small class="p-error">{{errors.'+fields.name+'}}</small></div>').join(""))+`
    <template #footer>
      <Button label="`+(entity.meta.readonly && entity.meta.readonly!="false" ? 'Close' : 'Cancel')+`" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
`+(entity.meta.readonly && entity.meta.readonly!="false" ? '' : `\
      <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveRecord" :disabled="!meta.valid || !meta.dirty" />
`)+`    </template>
  </Dialog>

  <Dialog v-model:visible="deleteRecordDialog" header="Confirm" :modal="true" >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span>Are you sure you want to delete?
        <b>{{ recordName(recordV) }}</b></span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRecordDialog = false" />
      <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteRecord" />
    </template>
  </Dialog>

  <Dialog v-model:visible="deleteRecordsDialog" header="Confirm" :modal="true" >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
      <span>Are you sure you want to delete the selected records?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRecordsDialog = false" />
      <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRecords" />
    </template>
  </Dialog>
</template>

<script lang="ts">
  import { formatCurrency, formatDate, formatDateTime } from "../utility";
  import { defineComponent, ref } from "vue";
  import { useRoute } from "vue-router";
  import { useToast } from "primevue/usetoast";
  import { useQuery, useMutation } from "villus";
  import gql from "graphql-tag";
  import { useField, useForm } from "vee-validate";
  import { `+entity.name+(entity.meta.readonly && entity.meta.readonly!="false" ? '' : ', '+entity.name+'Patch')+` } from "../../models/types";

  const `+entity.name+`Fields = gql\`fragment `+entity.name+`Fields on `+entity.name+` {`
+(entity.fields.filter(f => isField(f))[0].name == "nodeId" ? "" : "nodeId:"+entity.fields.filter(f => isField(f))[0].name+",")
+(entity.fields.filter(f => getType(f)!=null).map(fields => fields.name+(isField(fields) ? "" : "{totalCount}")))+` }\`;
  const ReadAll = gql\`query readAll($condition:`+entity.name+`Condition) {all`+entity.meta.plural+` (condition:$condition)
    {nodes{...`+entity.name+`Fields } } } $\{ `+entity.name+`Fields}\`;
  const Create = gql\`mutation create(`+entity.fields
    .filter(f => isField(f) && f.meta.templates.includes("crud")).map(field => '$'+field.name+':'+getType(field)+(field.type.kind=="NON_NULL" ? "!" : ""))+`)
    {create`+entity.name+`(input:{`+to1LowerCase(entity.name)+`:{ `+entity.fields
        .filter(f => isField(f) && f.meta.templates.includes("crud")).map(field => field.name+':\$'+field.name)+` } })
    { `+to1LowerCase(entity.name)+`{...`+entity.name+`Fields } } } $\{ `+entity.name+`Fields}\`;
  const Update = gql\`mutation update(`+entity.fields
    .filter(f => isField(f) && (f.name=="nodeId" || f.meta.templates.includes("crud"))).map(field => '$'+field.name+':'+getType(field)+(field.name=="nodeId" ? "!" : ""))+`)
    {update`+entity.name+`(input:{nodeId:$nodeId,
    `+to1LowerCase(entity.name)+`Patch:{ `+entity.fields
      .filter(f => isField(f) && f.name!=="nodeId" && f.meta.templates.includes("crud")).map(field => field.name+':\$'+field.name)+` } })
    { `+to1LowerCase(entity.name)+`{...`+entity.name+`Fields } } } $\{ `+entity.name+`Fields}\`;
  const Delete = gql\`mutation delete($nodeId:ID!)
    {delete`+entity.name+`(input:{nodeId:$nodeId})
    { `+to1LowerCase(entity.name)+`{...`+entity.name+`Fields } } } $\{ `+entity.name+`Fields}\`;
  type recType = { `+entity.fields.filter(f => getType(f)!=null).map(field => field.name+'?: '+
    (!isField(field) ? "{ totalCount?: number }" : ["text","date","datetime"].includes(field.meta.format) ? "string" : field.meta.format)).join(", ")+` }

  export default defineComponent({
    name: "`+entity.name+`",
    async setup() {
      const route = useRoute();
      const query = Object.entries(route.query).map(([key, val]) => [key, val && [`+entity.fields.filter(f => isField(f) && ['number','currency'].includes(f.meta.format)).map(f =>
         '"'+f.name+'"').join()+`].includes(key) ? +val : val]);
      const where = query.map(([key, val]) => key+" is "+val).join(", and ");
      const title = ref("`+plural(entity.meta.label)+`"+(where && ", where "+where));
      const validationSchema = {`+entity.fields.filter(f => isField(f) && !f.meta.readonly).map(field => `
        `+field.name+': "'+(field.meta.required ? "required|" : "")+field.meta.format+'"').join(",")+`
      };
      const initialValues = {`+entity.fields.filter(f => isField(f) && !(f.meta.default==null)).map(field => `
        `+field.name+': '+field.meta.default)+`};
      const { values: recordV, errors, meta, resetForm, setValues, handleSubmit } = useForm<recType>({ validationSchema });
`+entity.fields.filter(f => isField(f)).map(field => '      const { value: '+field.name+'V } = useField("'+field.name+'");').join("\n")+`
      const filters = ref({'global': {value: null}});
      const toast = useToast();
      const dtMaster = ref(null);
      const recordDialog = ref(false);
      const deleteRecordDialog = ref(false);
      const deleteRecordsDialog = ref(false);
      const selectedRecords = ref(null);
      const submitted = ref(false);
      const { data: cRecs, execute: cEx, error: cErrors } = useMutation(Create); // Must be defined before first await
      const { data: uRecs, execute: uEx, error: uErrors } = useMutation(Update); // Must be defined before first await
      const { data: dRecs, execute: dEx, error: dErrors } = useMutation(Delete); // Must be defined before first await
      const { data: raRecs, error: raErrors } = await useQuery({query: ReadAll, variables:{condition:Object.fromEntries(query)}});
      if (raErrors.value) throw "ReadAll Errors:"+JSON.stringify(raErrors.value.response.body.errors);
      const records = ref( raRecs.value.all`+entity.meta.plural+`.nodes.map(r => {
        `+entity.fields.filter(f => isField(f) && ['number','currency'].includes(f.meta.format)).map(f =>
         'r.'+f.name+' = r.'+f.name+' && +r.'+f.name+`;
        `).join('')+entity.fields.filter(f => !isField(f) && getType(f)!=null).map(f =>
         'r.'+f.name+'.totalCount = r.'+f.name+'.totalCount && +r.'+f.name+`.totalCount;
        `).join('')+` return r }));

      function recordName(record: `+entity.name+`): string {
        const rn=`+entity.fields.filter(f => isField(f)).map(field => `
          (record.`+field.name+` ? "`+field.meta.label+`: "+`+(
            field.meta.format=="date" ? "formatDate" : 
            field.meta.format=="datetime" ? "formatDateTime" : 
            "")+"(record."+field.name+`)+"  " : "")`).join("+")+`;
        return rn;
      };
      function openNew() {
        resetForm({values: initialValues});
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
      const saveRecord = handleSubmit(async function() {
        submitted.value = true;
        for (const property in recordV) { if (recordV[property] == "" && typeof(recordV[property])!="boolean") recordV[property] = null };
        if (nodeIdV.value) { // it's an update:
//          console.log("Update Pre:"+JSON.stringify(recordV));
          await uEx( recordV );
          if (uErrors.value) throw "Update Errors:"+JSON.stringify(uErrors.value.response.body.errors);
          if (nodeIdV.value) records.value[findIndexById(nodeIdV.value as unknown as string)] = uRecs.value.update`+entity.name+`.`+to1LowerCase(entity.name)+`;
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Record Updated",
            life: 3000,
          });
        } else { // it's a create:
//          console.log("Create Pre:"+JSON.stringify(recordV));
          await cEx( recordV );
          if (cErrors.value) throw "Create Errors:"+JSON.stringify(cErrors.value.response.body.errors);
          records.value.push(cRecs.value.create`+entity.name+`.`+to1LowerCase(entity.name)+`);
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Record Created",
            life: 3000,
          });
        };
        recordDialog.value = false;
        resetForm();
      });
      function editRecord(rec: `+entity.name+`) {
        setValues({`+entity.fields.filter(f => isField(f)).map(field => `
          `+field.name+": "+(
            field.meta.format=="date" ? "formatDate" : 
            field.meta.format=="datetime" ? "formatDateTime" : 
            "")+"(rec."+field.name+")").join()+`
        });
        recordDialog.value = true;
      };
      function confirmDeleteRecord(rec: `+entity.name+`) {
        setValues({`+entity.fields.filter(f => isField(f)).map(field => `
          `+field.name+(
            field.meta.format=="date" ? ": formatDate(rec."+field.name+")" : 
            field.meta.format=="datetime" ? ": formatDateTime(rec."+field.name+")" : 
            field.meta.format=="currency" ? ": formatCurrency(rec."+field.name+")" : 
            ": rec."+field.name)).join()+`
        });
        deleteRecordDialog.value = true;
      };
      async function deleteRecord() {
        deleteRecordDialog.value = false;
//        console.log("Delete Pre:"+JSON.stringify(recordV));
        await dEx( recordV );
        if (dErrors.value) throw "Delete Errors:"+JSON.stringify(dErrors.value.response.body.errors);
        records.value = records.value.filter((val: `+entity.name+`) => val.nodeId !== dRecs.value.delete`+entity.name+`.`+to1LowerCase(entity.name)+`.nodeId);
        resetForm();
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
        selectedRecords.value.forEach(async (rec: `+entity.name+`) => await dEx( rec ));
        records.value = records.value.filter((val: `+entity.name+`) => !selectedRecords.value.includes(val));
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
        title,
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
        selectedRecords,
        submitted,
        records,
        recordV,
        validationSchema,
        errors,
        meta,`+entity.fields.filter(f => isField(f)).map(field => `
        `+field.name+'V').join()+`
      }
    }
  });
</script>
`}