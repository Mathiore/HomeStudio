import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        { path: '', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
        { path: 'produtos', name: 'products', component: () => import('@/views/ProductsView.vue') },
        {
          path: 'produtos/:id',
          name: 'product-detail',
          component: () => import('@/views/ProductDetailView.vue'),
        },
        { path: 'estoque', name: 'stock', component: () => import('@/views/StockView.vue') },
        { path: 'orcamentos', name: 'budgets', component: () => import('@/views/BudgetsView.vue') },
        {
          path: 'orcamentos/:id',
          name: 'budget-detail',
          component: () => import('@/views/BudgetDetailView.vue'),
        },
        { path: 'notas-fiscais', name: 'invoices', component: () => import('@/views/InvoicesView.vue') },
        {
          path: 'notas-fiscais/:id',
          name: 'invoice-detail',
          component: () => import('@/views/InvoiceDetailView.vue'),
        },
        { path: 'configuracoes', name: 'settings', component: () => import('@/views/SettingsView.vue') },
      ],
    },
  ],
})

export default router
