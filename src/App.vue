<template>

  <router-view />

</template>


<script setup>
import { i18n } from 'boot/i18n' // اطمینان حاصل کن که i18n در boot تعریف شده
const savedLang = localStorage.getItem('lang') || 'fa'
i18n.global.locale = savedLang
document.documentElement.setAttribute('dir', savedLang === 'fa' ? 'rtl' : 'ltr')
</script>
