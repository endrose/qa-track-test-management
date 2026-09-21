<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Delete'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Delete'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-on-surface/20 backdrop-blur-sm transition-opacity"
      @click="emit('cancel')"
    />

    <!-- Modal Content -->
    <div class="relative bg-surface border-[3px] border-outline shadow-[8px_8px_0px_#000000] w-full max-w-md flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b-[3px] border-outline bg-surface-container">
        <h2 class="font-bold text-lg font-heading text-on-surface">{{ title }}</h2>
        <button 
          @click="emit('cancel')"
          class="p-1 hover:bg-surface-dim transition-colors rounded-sm"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto">
        <p class="text-body text-on-surface-variant font-body whitespace-pre-line">{{ message }}</p>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-4 border-t-[3px] border-outline bg-surface-container mt-auto">
        <button 
          @click="emit('cancel')"
          class="px-4 py-2 font-bold font-label uppercase text-on-surface bg-surface border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="emit('confirm')"
          class="px-4 py-2 font-bold font-label uppercase text-on-error bg-error border-[2px] border-outline shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">delete</span>
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
