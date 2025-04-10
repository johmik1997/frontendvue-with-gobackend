import { createApp} from 'vue'
import { createPinia } from 'pinia'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'
import App from './App.vue'
import router from './router'
import Toast from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'


// Apollo Client setup
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
  headers: {
    Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
  }
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient
})

const app = createApp(App)
app.use(Toast)
app.use(createPinia())
app.use(router)
app.use(apolloProvider)
app.mount('#app')
