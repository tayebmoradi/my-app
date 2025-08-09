<template>
  <q-layout view="lHh Lpr lFf">
    <!-- پس‌زمینه -->
    <div class="login-bg">
      <q-page-container>
        <router-view />
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup>
</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #0d0d0d, #1e1e2f);
  background-image:
    linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)),
    url('https://images.unsplash.com/photo-1555066931-4365d14bab8c'); /* بک‌گراند کدنویسی */
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  direction: rtl; /* راست‌چین کردن کل صفحه */
}
</style>
