<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
</script>

<template>
  <div class="flex min-h-screen bg-surface-50">
    <Sidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <Header />
      <main class="flex-1 p-4 lg:p-8">
        <RouterView />
      </main>
    </div>
    <ToastContainer />
    <ConfirmDialog />
  </div>
</template>
