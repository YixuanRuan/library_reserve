<template>
  <nav class="nav">
    <div class="nav-container">
      <div class="nav-left">
        <router-link to="/" class="nav-logo">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <span>座位预约</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link" :class="{ active: $route.name === 'home' }">首页</router-link>
          <router-link to="/seat-map" class="nav-link" :class="{ active: $route.name === 'seat-map' }">座位地图</router-link>
          <router-link to="/profile" class="nav-link" :class="{ active: $route.name === 'profile' }">个人中心</router-link>
        </div>
      </div>
      <div class="nav-right">
        <button class="user-menu" aria-label="用户菜单">
          <div class="user-avatar">{{ userStore.currentUser.avatar }}</div>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useSeatStore } from '../stores/seatStore'

const userStore = useSeatStore()
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-light);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-primary);
  transition: opacity 0.15s ease;
}

.nav-logo:hover {
  opacity: 0.8;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.15s ease;
}

.nav-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.nav-link.active {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  transition: all 0.15s ease;
}

.user-menu:hover {
  border-color: var(--color-primary);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
}

.chevron {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .nav-container {
    padding: 0 16px;
  }

  .nav-left {
    gap: 16px;
  }

  .nav-links {
    display: none;
  }

  .nav-logo span {
    display: none;
  }
}
</style>
