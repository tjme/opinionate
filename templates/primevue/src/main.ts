import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createClient } from 'villus';
import App from './App.vue';

// import 'primevue/resources/themes/saga-blue/theme.css';
// import 'primevue/resources/themes/md-light-indigo/theme.css';
// import 'primevue/resources/themes/mdc-light-indigo/theme.css';
// import 'primevue/resources/themes/mdc-dark-indigo/theme.css';
// import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';
// import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const client = createClient({
    url: 'http://localhost:5000/graphql',
  });
  
createApp(App)
.use(PrimeVue, {ripple: true})
.use(ToastService)
.use(client)
.mount('#app');
