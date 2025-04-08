import './assets/css/main.css';

import Icon from '@/components/ui/Icon.vue';
import { vMaska } from "maska/vue";
import { createPinia } from 'pinia';
import money from 'v-money3';
import { createApp } from 'vue';
import VueFeather from 'vue-feather';
import PageHeaderVue from './components/ui/PageHeader.vue';

import App from './App.vue';
import router from './router';

const app = createApp(App)

app.component(VueFeather.name, VueFeather);
app.component('PageHeader', PageHeaderVue);
app.directive("maska", vMaska)
app.component('Icon', Icon);
app.use(money)
app.use(createPinia())
app.use(router)

app.mount('#app')
