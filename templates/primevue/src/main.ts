import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createClient } from 'villus';
import { gql_api } from '../package.json';
import App from './App.vue';
import Switchboard from './Switchboard.vue';
${types.map(types => `\
import ${types.name} from "./components/${types.name.toLowerCase()}.vue";`).join("\n")}
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const url = (gql_api.prefix || "")+gql_api.hostname+(":"+gql_api.port || "")+(gql_api.path || "");
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
