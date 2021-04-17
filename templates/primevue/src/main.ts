import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createClient } from 'villus';
import { config } from '../package.json';
import { defineRule } from 'vee-validate';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import App from './App.vue';
import Switchboard from './Switchboard.vue';
${types.map(types => `\
import ${types.name} from "./components/${types.name.toLowerCase()}.vue";`).join("\n")}

defineRule("required", value => { if (!value || !value.length) { return "This field is required"; } return true; });
defineRule("number", value => { if (value && value.length && isNaN(value)) { return "This field must be a valid number"; } return true; });
defineRule("currency", value => { if (value && value.length && isNaN(value)) { return "This field must be a valid number"; } return true; });
defineRule("date", value => { if (value && value.length && isNaN(Date.parse(value))) { return "This field must be a valid date"; } return true; });
defineRule("datetime", value => { if (value && value.length && isNaN(Date.parse(value))) { return "This field must be a valid date and time"; } return true; });

const url = (config.gql_api.prefix || "")+config.gql_api.hostname+(":"+config.gql_api.port || "")+(config.gql_api.path || "");
const client = createClient({ url });

const routes = [
  // { path: "/", },
  { path: '/switchboard', component: Switchboard },
${types.map(types => `\
  { path: '/${types.name.toLowerCase()}', component: ${types.name} },`).join("\n")}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes, // short for 'routes: routes'
})
  
createApp(App)
.use(router)
.use(PrimeVue, {ripple: true})
.use(ToastService)
.use(client)
.mount('#app');
