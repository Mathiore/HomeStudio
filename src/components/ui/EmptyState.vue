<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: string
}>()

defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-200 bg-white px-6 py-16 text-center">
    <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-2xl">
      {{ icon ?? '📭' }}
    </div>
    <h3 class="text-base font-semibold text-surface-900">{{ title }}</h3>
    <p v-if="description" class="mt-2 max-w-sm text-sm text-surface-700/60">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
