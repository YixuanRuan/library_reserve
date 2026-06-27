<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">图书馆座位预约系统</h1>
          <p class="hero-subtitle">便捷预约座位，合理利用时间，让学习更高效</p>
          <div class="hero-actions">
            <router-link to="/seat-map" class="btn btn-primary">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
              </svg>
              立即预约
            </router-link>
            <router-link to="/profile" class="btn btn-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              我的预约
            </router-link>
          </div>
        </div>
        <div class="hero-illustration">
          <div class="illustration-card">
            <div class="card-header">
              <div class="card-dot"></div>
              <div class="card-dot"></div>
              <div class="card-dot"></div>
            </div>
            <div class="card-content">
              <div class="mini-seat-grid">
                <div v-for="i in 6" :key="i" class="mini-seat-row">
                  <div v-for="j in 4" :key="j" class="mini-seat" :class="getSeatClass(i, j)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats-container">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <div class="stat-icon" :style="{ background: stat.bgColor }">
            <svg :viewBox="stat.iconViewBox" fill="none" stroke="currentColor" stroke-width="2" :style="{ color: stat.color }">
              <path :d="stat.iconPath"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-container">
        <h2 class="section-title">功能特点</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon" :style="{ background: feature.bgColor }">
              <svg :viewBox="feature.iconViewBox" fill="none" stroke="currentColor" stroke-width="2" :style="{ color: feature.color }">
                <path :d="feature.iconPath"/>
              </svg>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Access Section -->
    <section class="quick-access">
      <div class="quick-access-container">
        <h2 class="section-title">快速入口</h2>
        <div class="rooms-grid">
          <div
            class="room-card"
            v-for="room in seatStore.readingRooms"
            :key="room.id"
            @click="goToSeatMap(room.id)"
          >
            <div class="room-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h18v18H3zM3 9h18M9 21V9"/>
              </svg>
            </div>
            <div class="room-info">
              <h3 class="room-name">{{ room.name }}</h3>
              <p class="room-floor">楼层：{{ room.floor }}楼</p>
            </div>
            <svg class="room-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useSeatStore } from '../stores/seatStore'
import { useRouter } from 'vue-router'

const seatStore = useSeatStore()
const router = useRouter()

const stats = [
  { label: '总座位数', value: '320', color: '#1B7A6E', bgColor: '#E8F5F3', iconViewBox: '0 0 24 24', iconPath: 'M3 3h18v18H3zM3 9h18M9 21V9' },
  { label: '空闲座位', value: '86', color: '#22A06B', bgColor: '#E8F9EF', iconViewBox: '0 0 24 24', iconPath: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3' },
  { label: '已预约', value: '198', color: '#DE350B', bgColor: '#FFEBE6', iconViewBox: '0 0 24 24', iconPath: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm12 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { label: '临时占用', value: '36', color: '#D4940A', bgColor: '#FFF8E0', iconViewBox: '0 0 24 24', iconPath: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2' }
]

const features = [
  { title: '实时座位状态', desc: '查看所有座位的实时预约状态，灵活选择空闲座位', color: '#1B7A6E', bgColor: '#E8F5F3', iconViewBox: '0 0 24 24', iconPath: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  { title: '时段预约', desc: '支持上午、下午、晚间三个时段灵活预约', color: '#22A06B', bgColor: '#E8F9EF', iconViewBox: '0 0 24 24', iconPath: 'M6 2a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2H6zM4 8h16v2H4V8zm0 4h16v6H4v-6z' },
  { title: '快速签到', desc: '到达座位后快速签到，确认使用座位', color: '#0065FF', bgColor: '#E6F0FF', iconViewBox: '0 0 24 24', iconPath: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
  { title: '取消预约', desc: '临时有事可随时取消预约，释放座位资源', color: '#D4940A', bgColor: '#FFF8E0', iconViewBox: '0 0 24 24', iconPath: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }
]

const getSeatClass = (row, col) => {
  const states = ['available', 'reserved', 'occupied']
  const index = (row * col) % states.length
  return `mini-seat-${states[index]}`
}

const goToSeatMap = (roomId) => {
  seatStore.updateSelectedRoom(roomId)
  router.push('/seat-map')
}
</script>

<style scoped>
.home {
  padding-top: 64px;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--color-primary-subtle) 0%, var(--color-bg) 100%);
  padding: 80px 24px;
}

.hero-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 64px;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all 0.15s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--color-bg-elevated);
  color: var(--color-text);
  border: 1px solid var(--color-border-light);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.hero-illustration {
  flex-shrink: 0;
}

.illustration-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 16px;
  width: 280px;
}

.card-header {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.card-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border-light);
}

.card-content {
  padding: 16px;
  background: var(--color-bg-muted);
  border-radius: var(--radius-md);
}

.mini-seat-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-seat-row {
  display: flex;
  gap: 4px;
}

.mini-seat {
  width: 48px;
  height: 32px;
  border-radius: 4px;
}

.mini-seat-available {
  background: var(--state-success-bg);
  border: 2px solid var(--state-success);
}

.mini-seat-reserved {
  background: var(--state-error-bg);
  border: 2px solid var(--state-error);
}

.mini-seat-occupied {
  background: var(--state-warning-bg);
  border: 2px solid var(--state-warning);
}

/* Stats Section */
.stats {
  padding: 48px 24px;
  background: var(--color-bg-elevated);
}

.stats-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
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

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Features Section */
.features {
  padding: 80px 24px;
}

.features-container {
  max-width: 1280px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 24px;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Quick Access Section */
.quick-access {
  padding: 80px 24px;
  background: var(--color-bg-sunken);
}

.quick-access-container {
  max-width: 1280px;
  margin: 0 auto;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.room-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: all 0.15s ease;
}

.room-card:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-subtle);
}

.room-icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.room-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.room-info {
  flex: 1;
}

.room-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.room-floor {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.room-arrow {
  width: 20px;
  height: 20px;
  color: var(--color-text-muted);
  transition: transform 0.15s ease;
}

.room-card:hover .room-arrow {
  transform: translateX(4px);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
    text-align: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-title {
    font-size: 1.875rem;
  }

  .hero-illustration {
    display: none;
  }
}
</style>
