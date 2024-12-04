import '/node_modules/primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import components from './components/index';
import ToastService from 'primevue/toastservice';
const app = createApp(App)

components.forEach((component) => {
  if(component) {
    app.component(component.name, component);
  }
})

app.use(PrimeVue, {
  theme: {
      preset: Aura
  }
})
.use(ToastService)
.mount('#app').$nextTick(() => {
  // Use contextBridge
  // window.ipcRenderer.on('main-process-message', (_event, message) => {
  //   console.log(message)
  // })
})
