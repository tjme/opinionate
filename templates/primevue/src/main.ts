import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createClient } from 'villus';
import { gql_n, gql_p, gql_q } from '../package.json';
import App from './App.vue';
import Switchboard from './Switchboard.vue';
${types.map(types => `\
import ${types.name} from "./components/${types.name.toLowerCase()}.vue";`).join("\n")}

// import 'primevue/resources/themes/saga-blue/theme.css';
// import 'primevue/resources/themes/md-light-indigo/theme.css';
// import 'primevue/resources/themes/mdc-light-indigo/theme.css';
// import 'primevue/resources/themes/mdc-dark-indigo/theme.css';
// import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';
// import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const client = createClient({ url: "http://"+gql_n+":"+gql_p+gql_q });

const routes = [
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
