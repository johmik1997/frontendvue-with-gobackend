<template>
    <div class="home-view">
      <Navbar />
      <!-- Other home page content -->
      <HeroSection />
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/Navbar.vue'
  import HeroSection from '@/components/HeroSection.vue'
  
  export default {
    name: 'HomeView',  // Changed from 'Home' to 'HomeView'
    components: {
      Navbar,
      HeroSection
    }
  }
  </script>
  
  <style scoped>
  .home-view {
    /* Add any home-specific styles here */
    width: 100%;
  }
  </style>