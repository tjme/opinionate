<template>
  <slot v-if="error" :error="error" name="error"></slot>
  <Suspense v-else>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #fallback>
      <slot name="fallback"></slot>
    </template>
  </Suspense>
</template>

<script>
import { ref, onErrorCaptured } from 'vue'

export default {
  name: 'SuspenseWithError',
  setup() {
    const error = ref(null);
    onErrorCaptured((err) => { error.value = err
      return true;
    });
    return { error };
  }
}
</script>