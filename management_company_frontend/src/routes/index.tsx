import { createBrowserRouter } from 'react-router-dom'
import GeneralError from '../pages/errors/general-error'
import MaintenanceError from '../pages/errors/maintenance-error'
import NotFoundError from '../pages/errors/not-found-error'

const router = createBrowserRouter([
  {
    path: '/login',
    lazy: async () => ({
      Component: (await import('../pages/auth/login')).default
    })
  },
  {
    path: '/signup',
    lazy: async () => ({
      Component: (await import('../pages/auth/signup')).default
    })
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('../pages/auth/forgot-password')).default
    })
  },
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('../components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('../pages/dashboard')).default
        })
      }
    ]
  },
  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  
  // Fallback 404 route
  { path: '*', Component: NotFoundError }
])

export default router
