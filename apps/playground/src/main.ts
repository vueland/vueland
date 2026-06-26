import { createApp } from 'vue'

import App from './App.vue'
import { ui } from './plugin'

import './styles/index.scss'
import 'virtual:utils-jit.css'

const app = createApp(App)

app.use(ui)
app.mount('body')
