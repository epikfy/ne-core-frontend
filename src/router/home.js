import Layout2 from '@/layout/Layout2'

export default [{
  path: '/home',
  component: Layout2,
  children: [{
    name: 'home',
    path: '',
    component: () => import('@/components/home/Home')
  }],
  meta: {
    requiresAuth: true
  }
}]
