<template>
  <div class="test" v-for="record in positionData">
    <p>test: {{ record }}</p>
  </div>
</template>

<script>

import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'TestComponent',
  setup() {
    const store = useStore()
    const positionData = ref(store.state.positionData)

    return {store, positionData}
  }

})
</script>

<style>
  .test {
    color: red;
  }
</style>
