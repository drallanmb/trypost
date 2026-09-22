<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { Toaster as Sonner } from "vue-sonner"

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    v-bind="props"
    position="bottom-right"
    :style="{
      '--normal-bg': 'var(--card)',
      '--normal-text': 'var(--foreground)',
      '--normal-border': 'var(--border)',
      '--success-bg': 'var(--card)',
      '--success-text': 'var(--foreground)',
      '--success-border': 'var(--border)',
      '--error-bg': 'var(--card)',
      '--error-text': 'var(--foreground)',
      '--error-border': 'var(--border)',
      '--warning-bg': 'var(--card)',
      '--warning-text': 'var(--foreground)',
      '--warning-border': 'var(--border)',
      '--info-bg': 'var(--card)',
      '--info-text': 'var(--foreground)',
      '--info-border': 'var(--border)',
    }"
  />
</template>

<style>
/* Toast surfaces share the application's theme-aware elevation. */
[data-sonner-toast] {
  border-width: 1px !important;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-sm) !important;
  font-weight: 500;
}

[data-sonner-toast] [data-title] {
  font-weight: 600;
}

[data-sonner-toast][data-type="success"] [data-icon] {
  color: var(--success) !important;
}

[data-sonner-toast][data-type="error"] [data-icon] {
  color: var(--destructive) !important;
}

[data-sonner-toast][data-type="warning"] [data-icon] {
  color: var(--warning) !important;
}

[data-sonner-toast][data-type="info"] [data-icon] {
  color: var(--info) !important;
}

/* Keep toast actions legible on either theme. */
[data-sonner-toast] [data-button] {
  border: 1px solid var(--border) !important;
  box-shadow: var(--shadow-2xs) !important;
  font-weight: 600;
}
</style>
