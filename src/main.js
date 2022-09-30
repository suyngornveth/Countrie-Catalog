import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import axios from 'axios'
import VueAxios from 'vue-axios'

import './assets/main.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue3-easy-data-table/dist/style.css';

const app = createApp(App)
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(router)
app.use(VueAxios, axios)

app.mount('#app')
