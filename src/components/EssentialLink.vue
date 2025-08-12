
<!-- <template>
  <q-item
    :to="to"
    clickable
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  to: {
    type: Object,
    default: () => {}
  },

  icon: {
    type: String,
    default: ''
  }
})
</script> -->
<template>
  <q-item
    clickable
    v-ripple
    @click="handleClick"
    :to="to"
    :href="link"
    target="_blank"
    :exact="true"
  >
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  title: String,
  caption: String,
  icon: String,
  to: String,
  link: String,
  action: String, // action به عنوان نام عملکرد مثل 'logout'
})

const emit = defineEmits(['action'])

function handleClick() {
  if (props.action) {
    emit('action', props.action)
  }
}
</script>
