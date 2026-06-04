import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  onConfirm: () => void
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const sidebarOpen = ref(false)
  const confirmDialog = ref<ConfirmOptions | null>(null)

  function showToast(message: string, type: Toast['type'] = 'success') {
    const id = crypto.randomUUID()
    toasts.value.push({ id, message, type })
    setTimeout(() => removeToast(id), 3500)
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function openConfirm(options: ConfirmOptions) {
    confirmDialog.value = options
  }

  function closeConfirm() {
    confirmDialog.value = null
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    toasts,
    sidebarOpen,
    confirmDialog,
    showToast,
    removeToast,
    openConfirm,
    closeConfirm,
    toggleSidebar,
  }
})
