import Layout2 from '@/layout/Layout2'

export default [{
  name: 'login',
  path: '/login',
  component: Layout2,
  children: [{
    path: '',
    component: () => import('@/components/login')
  }]
}]
