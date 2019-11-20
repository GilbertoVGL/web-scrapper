import Vue from 'vue'
import Router from 'vue-router'

import Rubbish from '@/components/Rubbish'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Rubbish',
      component: Rubbish
    }
  ]
})
