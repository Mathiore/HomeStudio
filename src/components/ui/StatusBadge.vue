<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
  type?: 'product' | 'stock' | 'budget' | 'invoice' | 'generic'
}>()

const label = computed(() => {
  const map: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    normal: 'Normal',
    low: 'Baixo',
    empty: 'Zerado',
    draft: 'Rascunho',
    sent: 'Enviado',
    approved: 'Aprovado',
    rejected: 'Recusado',
    entrada: 'Entrada',
    emitida: 'Emitida',
    cancelada: 'Cancelada',
    entry: 'Entrada',
    exit: 'Saída',
  }
  return map[props.status] ?? props.status
})

const classes = computed(() => {
  const status = props.status
  if (['active', 'normal', 'approved', 'entrada', 'entry', 'emitida'].includes(status)) {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
  }
  if (['inactive', 'draft', 'sent'].includes(status)) {
    return 'bg-surface-100 text-surface-700 ring-surface-600/10'
  }
  if (['low', 'warning'].includes(status)) {
    return 'bg-amber-50 text-amber-700 ring-amber-600/20'
  }
  if (['empty', 'rejected', 'cancelada', 'exit'].includes(status)) {
    return 'bg-red-50 text-red-700 ring-red-600/20'
  }
  return 'bg-primary-50 text-primary-700 ring-primary-600/20'
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
    :class="classes"
  >
    {{ label }}
  </span>
</template>
