import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createClient } from "villus";
import { config } from "../package.json";
import { defineRule } from "vee-validate";
import PrimeVue from "primevue/config";
import Material from "@primevue/themes/material";
import { all } from "primelocale";
import ToastService from "primevue/toastservice";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import DatePicker from "primevue/datepicker";
import Checkbox from "primevue/checkbox";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Menubar from "primevue/menubar";
import Toast from "primevue/toast";
import "primeicons/primeicons.css";
import "./style.css";
import App from "./App.vue";
import Switchboard from "./Switchboard.vue";
${entities.map(entity => `\
import ${entity.name} from "./components/${entity.name.toLowerCase()}.vue";`).join("\n")}

defineRule("required", (value: any) => { if (!value) { return "This field is required"; } return true; });
defineRule("number", (value: any) => { if (value && value.length && isNaN(value)) { return "This field must be a valid number"; } return true; });
defineRule("currency", (value: any) => { if (value && value.length && isNaN(value)) { return "This field must be a valid number"; } return true; });
defineRule("date", (value: any) => { if (value && value.length && isNaN(Date.parse(value))) { return "This field must be a valid date"; } return true; });
defineRule("datetime", (value: any) => { if (value && value.length && isNaN(Date.parse(value))) { return "This field must be a valid date and time"; } return true; });
defineRule("array", () => { if (false) { return "This field must be an array"; } return true; });
defineRule("string", () => { return true; });
defineRule("text", () => { return true; });
defineRule("boolean", () => { return true; });

const url = (config.gql_api.prefix || "")+config.gql_api.hostname+(":"+config.gql_api.port || "")+(config.gql_api.path || "");
const client = createClient({ url });

export const language = config.language || navigator.languages?.[0] || navigator.language || new Intl.DateTimeFormat().resolvedOptions().locale || "en";
export const currency = config.currency || "";
export function formatCurrency(value: string): string | undefined {
  if (value) { const v = +value; return v.toLocaleString(language, {style: "currency", currency: currency}); } };
export function formatDate(value: string): string | undefined {
  if (value) { const v = new Date(value); return v.toLocaleString(language, {dateStyle: "medium"}); } };
export function formatDateTime(value: string): string | undefined {
  // Formatted partially for acceptability by PrimeVue DatePicker
  if (value) { const v = new Date(value); return v.toLocaleString(language, {dateStyle: "medium", timeStyle: "short"})?.replace(/, (\\d\\d:\\d\\d)$/," $1"); } };
export const allLanguages = all;

const routes = [
  { path: '/', component: Switchboard, props: true },
${entities.map(entity => `\
  { path: '/${entity.name.toLowerCase()}', component: ${entity.name}, props: true },`).join("\n")}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

createApp(App)
.use(router)
.use(PrimeVue, {
    ripple: true,
    locale: all[language],
    theme: {
        preset: Material,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
 })
.use(ToastService)
.component('DataTable', DataTable)
.component('Column', Column)
.component('FloatLabel', FloatLabel)
.component('InputText', InputText)
.component('InputNumber', InputNumber)
.component('DatePicker', DatePicker)
.component('Checkbox', Checkbox)
.component('Textarea', Textarea)
.component('Select', Select)
.component('Button', Button)
.component('Dialog', Dialog)
.component('Menubar', Menubar)
.component('Toast', Toast)
.use(client)
.mount('#app');
