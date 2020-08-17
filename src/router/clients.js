import Layout2 from '@/layout/Layout2'

export default [{
  path: '/clients',
  component: Layout2,
  meta: {
    requiresAuth: true
  },
  children: [
    {
      name: 'clients-list',
      path: 'list',
      component: () => import('@/components/clients/ClientsList')
    },
    {
      name: 'clients-create',
      path: 'create',
      component: () => import('@/components/clients/ClientsCreate')
    },
    {
      name: 'clients-view',
      path: 'view/:id?',
      component: () => import('@/components/clients/ClientsView')
    },
    {
      name: 'clients-import',
      path: 'import',
      component: () => import('@/components/clients/ClientsImport')
    }
  ]
}]
