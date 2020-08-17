import Layout2 from '@/layout/Layout2'

export default [{
  path: '/reports',
  component: Layout2,
  meta: {
    requiresAuth: true
  },
  children: [{
    name: 'byClient',
    path: 'by-client',
    component: () => import('@/components/reports/ReportByClient')
  },
  {
    name: 'nextToCall',
    path: 'next-to-call',
    component: () => import('@/components/reports/ReportNextToCall')
  },
  {
    name: 'bestClients',
    path: 'best-clients',
    component: () => import('@/components/reports/ReportBestClients')
  },
  {
    name: 'worstClients',
    path: 'worst-clients',
    component: () => import('@/components/reports/ReportWorstClients')
  },
  {
    name: 'toBeRemoved',
    path: 'to-be-removed',
    component: () => import('@/components/reports/ReportToRemove')
  }]
}]
