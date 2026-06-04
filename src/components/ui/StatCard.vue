<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  trend?: string
  variant?: 'default' | 'warning' | 'success' | 'danger'
}>()
</script>

<template>
  <div class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-surface-700/70">{{ title }}</p>
        <p class="mt-2 text-2xl font-bold tracking-tight text-surface-900">{{ value }}</p>
        <p v-if="subtitle" class="mt-1 text-xs text-surface-700/60">{{ subtitle }}</p>
        <p v-if="trend" class="mt-2 text-xs font-medium text-emerald-600">{{ trend }}</p>
      </div>
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
        :class="{
          'bg-primary-50 text-primary-600': variant === 'default' || !variant,
          'bg-amber-50 text-amber-600': variant === 'warning',
          'bg-emerald-50 text-emerald-600': variant === 'success',
          'bg-red-50 text-red-600': variant === 'danger',
        }"
      >
        {{ icon ?? '📊' }}
      </div>
    </div>
  </div>
</template>
