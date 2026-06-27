<template>
  <div class="profile-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-container">
        <nav class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">首页</router-link>
          <svg class="breadcrumb-separator" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span class="breadcrumb-current">个人中心</span>
        </nav>
        <h1 class="page-title">个人中心</h1>
        <p class="page-desc">管理您的预约记录和个人信息</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="profile-content">
      <div class="content-container">
        <!-- User Info Card -->
        <div class="user-card">
          <div class="user-avatar">
            {{ seatStore.currentUser.avatar }}
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ seatStore.currentUser.name }}</h2>
            <p class="user-phone">{{ seatStore.currentUser.phone }}</p>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--color-primary-light);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary);">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ seatStore.myBookings.length }}</div>
              <div class="stat-label">我的预约</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--state-success-bg);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--state-success);">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ activeBookings }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--state-warning-bg);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--state-warning);">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ historyBookings }}</div>
              <div class="stat-label">历史记录</div>
            </div>
          </div>
        </div>

        <!-- Booking List -->
        <div class="booking-section">
          <div class="section-header">
            <h3 class="section-title">我的预约</h3>
          </div>

          <div class="booking-list" v-if="seatStore.myBookings.length > 0">
            <div
              class="booking-card"
              v-for="booking in seatStore.myBookings"
              :key="booking.id"
            >
              <div class="booking-info">
                <div class="booking-seat">
                  <span class="seat-number">{{ booking.seatId }}</span>
                  <span class="booking-status" :class="booking.status">{{ getStatusText(booking.status) }}</span>
                </div>
                <div class="booking-details">
                  <div class="booking-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 3h18v18H3zM3 9h18M9 21V9"/>
                    </svg>
                    <span>{{ booking.roomName }}</span>
                  </div>
                  <div class="booking-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span>{{ booking.date }}</span>
                  </div>
                  <div class="booking-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{{ booking.timeSlotName }} ({{ getTimeRange(booking.timeSlot) }})</span>
                  </div>
                </div>
              </div>
              <div class="booking-actions">
                <button class="action-btn cancel" @click="handleCancel(booking.id)">
                  取消预约
                </button>
              </div>
            </div>
          </div>

          <div class="empty-state" v-else>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
            </svg>
            <p>暂无预约记录</p>
            <router-link to="/seat-map" class="empty-action">
              去预约座位
            </router-link>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions-section">
          <h3 class="section-title">常用功能</h3>
          <div class="actions-grid">
            <router-link to="/seat-map" class="action-card">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18"/>
                  <path d="M9 21V9"/>
                </svg>
              </div>
              <span>座位地图</span>
            </router-link>
            <button class="action-card" @click="handleRefresh">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 4v6h-6"/>
                  <path d="M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
                  <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/>
                </svg>
              </div>
              <span>刷新状态</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSeatStore } from '../stores/seatStore'

const seatStore = useSeatStore()

const toast = ref({ show: false, message: '', type: 'success' })

const activeBookings = computed(() => {
  return seatStore.myBookings.filter(b => b.status === 'active').length
})

const historyBookings = computed(() => {
  return seatStore.myBookings.filter(b => b.status === 'completed').length
})

const getStatusText = (status) => {
  const map = {
    active: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getTimeRange = (timeSlot) => {
  const map = {
    morning: '8:00-12:00',
    afternoon: '12:00-18:00',
    evening: '18:00-22:00'
  }
  return map[timeSlot] || ''
}

const handleCancel = (bookingId) => {
  seatStore.cancelBooking(bookingId)
  showToast('预约已取消', 'success')
}

const handleRefresh = () => {
  showToast('状态已刷新', 'success')
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>

<style scoped>
.profile-page {
  padding-top: 64px;
}

/* Page Header */
.page-header {
  padding: 24px 24px 0;
}

.page-header-container {
  max-width: 960px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: var(--color-text-secondary);
  transition: color 0.15s ease;
}

.breadcrumb-link:hover {
  color: var(--color-primary);
}

.breadcrumb-separator {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

.breadcrumb-current {
  color: var(--color-text);
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-top: 12px;
  line-height: 1.25;
}

.page-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

/* Profile Content */
.profile-content {
  padding: 24px;
}

.content-container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* User Card */
.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-md);
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.user-phone {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Booking Section */
.booking-section {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

.section-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.booking-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  gap: 16px;
}

.booking-info {
  flex: 1;
}

.booking-seat {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.seat-number {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.booking-status {
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}

.booking-status.active {
  background: var(--state-success-bg);
  color: var(--state-success);
}

.booking-status.completed {
  background: var(--color-bg-muted);
  color: var(--color-text-muted);
}

.booking-status.cancelled {
  background: var(--state-error-bg);
  color: var(--state-error);
}

.booking-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.booking-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.booking-detail svg {
  width: 14px;
  height: 14px;
  color: var(--color-text-muted);
}

.booking-actions {
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all 0.15s ease;
}

.action-btn.cancel {
  background: var(--color-bg-elevated);
  color: var(--state-error);
  border: 1px solid var(--color-border-light);
}

.action-btn.cancel:hover {
  background: var(--state-error-bg);
  border-color: var(--state-error);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  color: var(--color-text-muted);
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.empty-action {
  padding: 8px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-md);
  transition: all 0.15s ease;
}

.empty-action:hover {
  background: var(--color-primary-hover);
}

/* Actions Section */
.actions-section {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  padding: 20px;
}

.actions-section .section-title {
  margin-bottom: 16px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  transition: all 0.15s ease;
  cursor: pointer;
}

.action-card:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-subtle);
}

.action-icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.action-card span {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.toast.success {
  background: var(--state-success);
  color: white;
}

.toast.error {
  background: var(--state-error);
  color: white;
}

.toast svg {
  width: 18px;
  height: 18px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Responsive */
@media (max-width: 640px) {
  .page-header {
    padding: 16px 16px 0;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .profile-content {
    padding: 16px;
  }

  .user-card {
    flex-direction: column;
    text-align: center;
  }

  .booking-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .booking-actions {
    width: 100%;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
