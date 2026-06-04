<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const preview = ref(props.modelValue)
const fileInput = ref<HTMLInputElement | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    preview.value = val
  },
)

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    preview.value = reader.result as string
    emit('update:modelValue', preview.value)
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  preview.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) fileInput.value.value = ''
}

function triggerUpload() {
  fileInput.value?.click()
}
</script>

<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-surface-700">Imagem do produto</label>
    <div class="flex items-start gap-4">
      <div
        class="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-surface-200 bg-surface-50"
      >
        <img v-if="preview" :src="preview" alt="Preview" class="h-full w-full object-cover" />
        <span v-else class="text-3xl text-surface-700/30">🖼️</span>
      </div>
      <div class="flex flex-col gap-2">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
        <button
          type="button"
          class="rounded-xl bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
          @click="triggerUpload"
        >
          Selecionar imagem
        </button>
        <button
          v-if="preview"
          type="button"
          class="rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          @click="removeImage"
        >
          Remover
        </button>
        <p class="text-xs text-surface-700/50">Preview local — sem upload real</p>
      </div>
    </div>
  </div>
</template>
