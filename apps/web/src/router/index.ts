import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import GuestLayout from '../layouts/GuestLayout.vue'
import Dashboard from '../pages/Dashboard.vue'
import Bugs from '../pages/Bugs.vue'
import TestCases from '../pages/TestCases.vue'
import Reports from '../pages/Reports.vue'
import Login from '../pages/Login.vue'
import Projects from '../pages/Projects.vue'
import Requirements from '../pages/Requirements.vue'
import TestExecutions from '../pages/TestExecutions.vue'
import Automation from '../pages/Automation.vue'
import TestScenarios from '../pages/TestScenarios.vue'
import RTM from '../pages/RTM.vue'
import Settings from '../pages/Settings.vue'
import AllureReport from '../pages/AllureReport.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: GuestLayout,
      children: [
        {
          path: '',
          name: 'Login',
          component: Login
        }
      ]
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'projects',
          name: 'Projects',
          component: Projects
        },
        {
          path: 'requirements',
          name: 'Requirements',
          component: Requirements
        },
        {
          path: 'bugs',
          name: 'Bugs',
          component: Bugs
        },
        {
          path: 'test-cases',
          name: 'TestCases',
          component: TestCases
        },
        {
          path: 'reports',
          name: 'Reports',
          component: Reports
        },
        {
          path: 'test-executions',
          name: 'TestExecutions',
          component: TestExecutions
        },
        {
          path: 'automation',
          name: 'Automation',
          component: Automation
        },
        {
          path: 'test-scenarios',
          name: 'TestScenarios',
          component: TestScenarios
        },
        {
          path: 'rtm',
          name: 'RTM',
          component: RTM
        },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings
        },
        {
          path: 'allure-report',
          name: 'AllureReport',
          component: AllureReport
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
