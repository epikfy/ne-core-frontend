import Layout2 from '@/layout/Layout2'

export default [{
  path: '/invoices',
  component: Layout2,
  meta: {
    requiresAuth: true
  },
  children: [
    {
      name: 'invoices-list',
      path: 'list',
      component: () => import('@/components/invoices/InvoicesList')
    },
    {
      name: 'invoices-create',
      path: 'create',
      component: () => import('@/components/invoices/InvoicesCreate')
    },
    {
      name: 'invoices-view',
      path: 'view/:id?',
      component: () => import('@/components/invoices/InvoicesView')
    },
    {
      name: 'invoices-import',
      path: 'import',
      component: () => import('@/components/invoices/InvoicesImport')
    }
  ]
}]
