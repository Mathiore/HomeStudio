<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

function confirm() {
  ui.confirmDialog?.onConfirm()
  ui.closeConfirm()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="ui.confirmDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 p-4"
      @click.self="ui.closeConfirm()"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-surface-900">{{ ui.confirmDialog.title }}</h3>
        <p class="mt-2 text-sm text-surface-700/70">{{ ui.confirmDialog.message }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-xl px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100"
            @click="ui.closeConfirm()"
          >
            {{ ui.confirmDialog.cancelLabel ?? 'Cancelar' }}
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-2 text-sm font-medium text-white"
            :class="
              ui.confirmDialog.variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-primary-600 hover:bg-primary-700'
            "
            @click="confirm"
          >
            {{ ui.confirmDialog.confirmLabel ?? 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
