<template>
  <div class="app-container">
    <!-- Hero Background -->
    <div class="hero-background"></div>

    <!-- Main Content -->
    <div class="main-container">
      <div v-if="!selectedActivity">
        <!-- Connection Status Banner -->
        <div v-if="connectionStatus === 'connecting'" class="connection-banner connecting">
          <div class="banner-content">
            <div class="banner-icon-text">
              <div class="loading-spinner">
                <svg class="spinner-icon" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div class="banner-text">
                <p class="banner-title">Connecting to database...</p>
                <p class="banner-subtitle">Please wait while we establish connection</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="connectionStatus === 'failed'" class="connection-banner failed">
          <div class="banner-content">
            <div class="banner-icon-text">
              <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <div class="banner-text">
                <p class="banner-title">Failed to connect to database</p>
                <p class="banner-subtitle">Please check your Supabase configuration and try again</p>
              </div>
            </div>
            <button @click="retryConnection" class="retry-btn">
              <svg class="retry-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Retry
            </button>
          </div>
        </div>

        <!-- Header -->
        <header class="hero-header">
          <div class="hero-content">
            <h1 class="hero-title">Sports Activity Management</h1>
            <p class="hero-subtitle">
              Organize, track, and manage your team's sports events and player registrations with our comprehensive platform
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number">🏆 {{ totalActivities }}</div>
                <div class="stat-label">Sports Events</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-number">👟 {{ totalRegistrations }}</div>
                <div class="stat-label">Players Registered</div>
              </div>
            </div>
          </div>
        </header>
      </div>

      <!-- Main Content -->
      <main class="main-content">
        <div v-if="connectionStatus === 'connected' && !selectedActivity" class="activities-view">
          <ActivityManager @activity-selected="handleActivitySelected" />
        </div>

        <div v-else-if="selectedActivity" class="registration-view">
          <RegistrationManager :selected-activity="selectedActivity" />
        </div>

        <div v-else class="loading-screen">
          <div class="loading-content">
            <div class="spinner"></div>
            <p>Loading activities...</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { testConnection } from './config/supabase.js';
import ActivityManager from './components/ActivityManager.vue';
import RegistrationManager from './components/RegistrationManager.vue';

export default {
  name: 'App',
  components: {
    ActivityManager,
    RegistrationManager
  },
  setup() {
    const currentTab = ref('activities');
    const selectedActivity = ref(null);
    const connectionStatus = ref('connecting');
    const totalActivities = ref(0);
    const totalRegistrations = ref(0);

    const switchTab = (tab) => {
      currentTab.value = tab;
    };

    const handleActivitySelected = (activity) => {
      selectedActivity.value = activity;
      currentTab.value = 'registrations';
    };

    const retryConnection = async () => {
      connectionStatus.value = 'connecting';
      await initializeApp();
    };

    const initializeApp = async () => {
      try {
        const connected = await testConnection();
        connectionStatus.value = connected ? 'connected' : 'failed';

        if (connected) {
          totalActivities.value = 12;
          totalRegistrations.value = 48;
        }
      } catch (error) {
        connectionStatus.value = 'failed';
        console.error('App initialization failed:', error);
      }
    };

    onMounted(() => {
      initializeApp();
    });

    return {
      currentTab,
      selectedActivity,
      connectionStatus,
      totalActivities,
      totalRegistrations,
      switchTab,
      handleActivitySelected,
      retryConnection
    };
  }
};
</script>

<style scoped>
/* ============================================
   全屏覆盖设计
============================================ */

.app-container {
  min-height: 100vh;
  width: 100vw; /* 使用视口宽度 */
  position: relative;
  overflow-x: hidden; /* 防止水平滚动 */
}

/* 页面背景 - 全屏覆盖 */
.hero-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  z-index: -1;
}

/* 主容器 - 全宽度设计 */
.main-container {
  width: 100%; /* 完全占满宽度 */
  max-width: none; /* 移除最大宽度限制 */
  margin: 0; /* 移除居中边距 */
  padding: 2rem 5vw; /* 使用视口单位的内边距 */
  min-height: 100vh;
  box-sizing: border-box;
}

.main-content {
  margin-top: 2rem;
  width: 100%;
}

.activities-view,
.registration-view {
  animation: fadeIn 0.3s ease-in-out;
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  width: 100%;
}

.loading-content {
  text-align: center;
}

.loading-content p {
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: #666;
  margin-top: 1rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: clamp(40px, 5vw, 80px);
  height: clamp(40px, 5vw, 80px);
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Connection Status Banners - 全宽度 */
.connection-banner {
  width: calc(100% + 10vw); /* 超出容器边界 */
  margin: 0 -5vw 2rem -5vw; /* 负边距扩展到屏幕边缘 */
  padding: clamp(1rem, 3vw, 2.5rem) 5vw;
  backdrop-filter: blur(10px);
  border: none; /* 移除边框 */
  animation: slideInFromTop 0.5s ease-out;
  font-size: clamp(0.9rem, 2vw, 1.3rem);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.connection-banner.connecting {
  background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);
  color: #e0f2fe;
}

.connection-banner.failed {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.banner-icon-text {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.loading-spinner,
.error-icon {
  width: clamp(20px, 3vw, 32px);
  height: clamp(20px, 3vw, 32px);
  flex-shrink: 0;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.banner-subtitle {
  font-size: clamp(0.85rem, 2vw, 1.1rem);
  opacity: 0.9;
  line-height: 1.4;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: clamp(0.75rem, 2vw, 1.25rem) clamp(1.5rem, 3vw, 2.5rem);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 500;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.retry-icon {
  width: clamp(16px, 2.5vw, 24px);
  height: clamp(16px, 2.5vw, 24px);
}

@keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Hero Section - 全宽度设计 */
.hero-header {
  width: 100%;
  margin: 0;
}

.hero-content {
  text-align: center;
  padding: clamp(3rem, 8vw, 8rem) 0;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-title {

  font-size: clamp(2.5rem, 8vw, 8rem); /* 响应式字体大小 */
  font-weight: 900;
  margin-bottom: clamp(1.5rem, 4vw, 3rem);
  background: linear-gradient(135deg, #121a1d, #0f0f0f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  text-shadow: 0 0 30px rgba(14, 165, 233, 0.3);
  letter-spacing: -0.02em;
  width: 100%;
}

.hero-subtitle {
  font-size: clamp(1rem, 3vw, 2rem); /* 响应式字体大小 */
  color: #374151;
  margin-bottom: clamp(2rem, 5vw, 4rem);
  max-width: 90%; /* 使用百分比而不是固定值 */
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 400;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(2rem, 6vw, 6rem); /* 响应式间距 */
  flex-wrap: wrap;
  margin-top: 2rem;
  width: 100%;
}

.stat-item {
  text-align: center;
  padding: clamp(0.75rem, 2vw, 1.5rem);
  transition: transform 0.3s ease;
  flex: 0 1 auto;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: clamp(1.5rem, 5vw, 4rem); /* 响应式字体大小 */
  font-weight: 800;
  color: #fb923c;
  margin-bottom: clamp(0.5rem, 1vw, 1rem);
  text-shadow: 0 0 15px currentColor;
  display: block;
  line-height: 1.2;
}

.stat-label {
  font-size: clamp(0.8rem, 2vw, 1.3rem); /* 响应式字体大小 */
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  line-height: 1.3;
}

.stat-divider {
  width: 1px;
  height: clamp(40px, 8vw, 100px); /* 响应式高度 */
  background: linear-gradient(to bottom, transparent, #475569, transparent);
  flex-shrink: 0;
}

/* ============================================
   响应式设计优化
============================================ */

/* 超大屏 */
@media (min-width: 1920px) {
  .main-container {
    padding: 3rem 8vw;
  }

  .hero-content {
    max-width: 1600px;
  }
}

/* 大屏桌面 */
@media (min-width: 1200px) {
  .main-container {
    padding: 2.5rem 6vw;
  }
}

/* 平板 */
@media (min-width: 768px) and (max-width: 1199px) {
  .main-container {
    padding: 2rem 4vw;
  }

  .hero-stats {
    gap: clamp(1.5rem, 4vw, 3rem);
  }

  .stat-divider {
    display: none; /* 在平板上隐藏分隔线 */
  }
}

/* 手机 */
@media (max-width: 767px) {
  .main-container {
    padding: 1.5rem 3vw;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .stat-item {
    width: 100%;
    max-width: 300px;
  }

  .stat-divider {
    width: 60%;
    height: 1px;
    margin: 0.75rem auto;
    background: linear-gradient(to right, transparent, #475569, transparent);
  }

  .connection-banner {
    margin: 0 -3vw 1.5rem -3vw;
    padding: 1.5rem 3vw;
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .banner-icon-text {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .main-container {
    padding: 1rem 4vw;
  }

  .hero-stats {
    gap: 1rem;
  }

  .connection-banner {
    margin: 0 -4vw 1rem -4vw;
    padding: 1rem 4vw;
  }
}

/* 横屏优化 */
@media (max-height: 600px) and (orientation: landscape) {
  .hero-content {
    padding: clamp(2rem, 5vh, 4rem) 0;
  }

  .hero-stats {
    margin-top: 1rem;
  }

  .main-container {
    padding: 1rem 5vw;
  }
}
</style>

<style>
/* 全局重置 - 确保没有默认边距影响全屏显示 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* 防止水平滚动条 */
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  background-color: #f8f9fa;
  color: #333;
  font-size: clamp(14px, 2vw, 18px); /* 响应式基础字体 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* 移除Vue应用的默认边距 */
#app {
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

/* CSS变量保持不变 */
:root {
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;

  --accent-50: #fff7ed;
  --accent-100: #ffedd5;
  --accent-200: #fed7aa;
  --accent-300: #fdba74;
  --accent-400: #fb923c;
  --accent-500: #f97316;
  --accent-600: #ea580c;
  --accent-700: #c2410c;

  --success-400: #4ade80;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --warning-400: #facc15;
  --warning-500: #eab308;
  --error-400: #f87171;
  --error-500: #ef4444;
  --error-600: #dc2626;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  --transition-fast: 0.15s ease-out;
  --transition-normal: 0.25s ease-out;
}

html {
  scroll-behavior: smooth;
}

h1, h2, h3, h4, h5, h6 {
  color: #1f2937;
  font-weight: 700;
  line-height: 1.2;
}

p {
  color: #374151;
  line-height: 1.6;
}

/* 确保所有容器都可以使用全宽 */
.container, .wrapper, .main {
  width: 100%;
  max-width: none;
}
</style>
