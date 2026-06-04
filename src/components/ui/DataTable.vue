<script setup lang="ts">
import type { TableColumn } from '@/types'

defineProps<{
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  emptyMessage?: string
}>()
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-surface-200">
        <thead class="bg-surface-50">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-700/70"
              :class="{
                'text-left': !col.align || col.align === 'left',
                'text-center': col.align === 'center',
                'text-right': col.align === 'right',
              }"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100">
          <tr v-if="!rows.length">
            <td :colspan="columns.length" class="px-4 py-10 text-center text-sm text-surface-700/60">
              {{ emptyMessage ?? 'Nenhum registro encontrado.' }}
            </td>
          </tr>
          <tr
            v-for="(row, index) in rows"
            :key="index"
            class="transition-colors hover:bg-surface-50/80"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-sm text-surface-800"
              :class="{
                'text-left': !col.align || col.align === 'left',
                'text-center': col.align === 'center',
                'text-right': col.align === 'right',
              }"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
