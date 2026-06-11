<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  open: boolean
  src: string
  type: 'image' | 'video'
  alt: string
}>()

const emit = defineEmits<{ close: [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <button
          type="button"
          class="absolute right-6 top-6 text-[11px] uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-white"
          @click="emit('close')"
        >
          Fechar
        </button>

        <img
          v-if="type === 'image'"
          :src="src"
          :alt="alt"
          class="max-h-[90vh] max-w-[90vw] object-contain"
        />
        <video
          v-else
          :src="src"
          controls
          autoplay
          class="max-h-[90vh] max-w-[90vw]"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
