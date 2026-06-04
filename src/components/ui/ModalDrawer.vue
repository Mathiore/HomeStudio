<script setup lang="ts">
defineProps<{
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()

defineEmits<{ close: [] }>()

const sizeClass = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end justify-center bg-surface-900/50 p-4 sm:items-center" @click.self="$emit('close')">
      <div
        class="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        :class="sizeClass[size ?? 'lg']"
      >
        <div class="flex items-center justify-between border-b border-surface-200 px-6 py-4">
          <h2 class="text-lg font-semibold text-surface-900">{{ title }}</h2>
          <button
            type="button"
            class="rounded-lg p-2 text-surface-700 hover:bg-surface-100"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>
        <div class="overflow-y-auto p-6">
          <slot />
        </div>
        <div v-if="$slots.footer" class="border-t border-surface-200 px-6 py-4">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
