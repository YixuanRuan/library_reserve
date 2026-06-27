<template>
  <div class="seat-map-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-container">
        <nav class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">首页</router-link>
          <svg class="breadcrumb-separator" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span class="breadcrumb-current">座位地图</span>
        </nav>
        <h1 class="page-title">座位地图</h1>
        <p class="page-desc">阅览室座位俯视图，点击座位查看详情并预约</p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-container">
        <div class="filter-group">
          <label class="filter-label">阅览室</label>
          <select
            class="filter-select"
            :value="seatStore.selectedRoomId"
            @change="handleRoomChange"
          >
            <option
              v-for="room in seatStore.readingRooms"
              :key="room.id"
              :value="room.id"
            >
              {{ room.name }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">时段</label>
          <select class="filter-select">
            <option>全部时段</option>
            <option>上午 (8-12)</option>
            <option>下午 (12-18)</option>
            <option>晚间 (18-22)</option>
          </select>
        </div>
        <button class="filter-btn" @click="handleSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span>查询</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="content-container">
        <div class="content-layout">
          <!-- Seat Map Area -->
          <div class="seat-map-section">
            <div class="seat-map-card">
              <!-- Room Title -->
              <div class="room-header">
                <div class="room-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                  <h2>{{ seatStore.currentRoomName }}</h2>
                </div>
                <span class="room-badge">平面图</span>
              </div>

              <!-- Floor Plan -->
              <div class="floor-plan">
                <!-- Stage / Entrance -->
                <div class="entrance-area">
                  <span>讲台 / 入口</span>
                </div>

                <!-- Seat Grid -->
                <div class="seat-grid-container">
                  <div
                    v-for="row in seatRows"
                    :key="row"
                    class="seat-row"
                  >
                    <span class="row-label">{{ row }}</span>
                    <div class="seat-row-seats">
                      <div
                        v-for="seat in getSeatsByRow(row)"
                        :key="seat.id"
                        class="seat"
                        :class="getSeatClass(seat)"
                        @click="handleSeatClick(seat)"
                      >
                        <span>{{ seat.id }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Column numbers -->
                <div class="column-labels">
                  <span class="col-spacer"></span>
                  <span
                    v-for="col in 8"
                    :key="col"
                    class="col-label"
                  >
                    {{ String(col).padStart(2, '0') }}
                  </span>
                </div>
              </div>

              <!-- Legend -->
              <div class="legend">
                <div class="legend-item">
                  <div class="legend-dot available"></div>
                  <span>空闲座位</span>
                </div>
                <div class="legend-item">
                  <div class="legend-dot reserved"></div>
                  <span>已预约</span>
                </div>
                <div class="legend-item">
                  <div class="legend-dot occupied"></div>
                  <span>临时占用</span>
                </div>
                <div class="legend-item">
                  <div class="legend-dot mine"></div>
                  <span>我的座位</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Detail Panel -->
          <div class="detail-section">
            <div class="detail-panel">
              <template v-if="seatStore.selectedSeat">
                <!-- Panel Header -->
                <div class="panel-header">
                  <h2>座位详情</h2>
                </div>

                <!-- Seat Info Card -->
                <div class="seat-info-card">
                  <div class="seat-badge" :class="seatStore.selectedSeat.status">
                    {{ seatStore.selectedSeat.id }}
                  </div>
                  <div class="seat-info">
                    <p class="seat-room">{{ seatStore.currentRoomName }}</p>
                    <span class="seat-status-badge" :class="seatStore.selectedSeat.status">
                      {{ getStatusText(seatStore.selectedSeat.status) }}
                    </span>
                  </div>
                </div>

                <!-- Seat Properties -->
                <div class="seat-properties">
                  <div class="property-row">
                    <span class="property-label">座位类型</span>
                    <span class="property-value">{{ seatStore.selectedSeat.type === 'window' ? '靠窗座位' : seatStore.selectedSeat.type === 'aisle' ? '靠过道座位' : '普通座位' }}</span>
                  </div>
                  <div class="property-row">
                    <span class="property-label">电源插座</span>
                    <span class="property-value" :class="{ available: seatStore.selectedSeat.hasPower }">
                      {{ seatStore.selectedSeat.hasPower ? '有' : '无' }}
                    </span>
                  </div>
                  <div class="property-row">
                    <span class="property-label">位置描述</span>
                    <span class="property-value">第{{ getRowNumber(seatStore.selectedSeat.row) }}排，{{ seatStore.selectedSeat.position }}</span>
                  </div>
                </div>

                <!-- Time Slots -->
                <div class="time-slots-section">
                  <h3>今日时段预约</h3>
                  <!-- Time axis -->
                  <div class="time-axis">
                    <div class="time-labels">
                      <span>08:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                      <span>22:00</span>
                    </div>
                    <div class="time-blocks">
                      <div class="time-block available" style="left: 0; width: 33.3%;"></div>
                      <div class="time-block reserved" style="left: 33.3%; width: 33.3%;"></div>
                      <div class="time-block available" style="left: 66.6%; width: 33.4%;"></div>
                      <div class="time-marker" :style="{ left: currentTimePosition + '%' }"></div>
                    </div>
                  </div>
                  <div class="time-slot-labels">
                    <span>上午 (8-12)</span>
                    <span>下午 (12-18)</span>
                    <span>晚间 (18-22)</span>
                  </div>
                </div>

                <!-- Booking Action -->
                <div class="booking-section">
                  <h3>选择时段</h3>
                  <div class="time-slot-buttons">
                    <button
                      v-for="slot in seatStore.timeSlots"
                      :key="slot.id"
                      class="slot-btn"
                      :class="{
                        active: seatStore.selectedTimeSlotId === slot.id,
                        disabled: !slot.available
                      }"
                      :disabled="!slot.available"
                      @click="handleSlotSelect(slot.id)"
                    >
                      {{ slot.name }}
                    </button>
                  </div>
                  <button
                    class="book-btn"
                    :disabled="!canBook"
                    @click="handleBook"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span>{{ canBook ? '立即预约' : '请选择空闲座位' }}</span>
                  </button>
                </div>
              </template>

              <template v-else>
                <!-- Empty State -->
                <div class="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                  <p>请选择一个空闲座位</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSeatStore } from '../stores/seatStore'

const seatStore = useSeatStore()

const seatRows = ['A', 'B', 'C', 'D', 'E', 'F']
const toast = ref({ show: false, message: '', type: 'success' })
const currentTimePosition = ref(25)

const getSeatsByRow = (row) => {
  return seatStore.seats.filter(seat => seat.row === row)
}

const getSeatClass = (seat) => {
  if (seatStore.selectedSeat?.id === seat.id) {
    if (seat.status === 'available') return 'seat-selected'
    return `seat-${seat.status}`
  }
  return `seat-${seat.status}`
}

const getStatusText = (status) => {
  const map = {
    available: '空闲',
    reserved: '已预约',
    occupied: '临时占用',
    mine: '我的座位'
  }
  return map[status] || status
}

const getRowNumber = (row) => {
  return seatRows.indexOf(row) + 1
}

const handleSeatClick = (seat) => {
  seatStore.selectSeat(seat)
}

const handleRoomChange = (e) => {
  seatStore.updateSelectedRoom(parseInt(e.target.value))
}

const handleSlotSelect = (slotId) => {
  const slot = seatStore.timeSlots.find(s => s.id === slotId)
  if (slot?.available) {
    seatStore.updateSelectedTimeSlot(slotId)
  }
}

const canBook = computed(() => {
  return seatStore.selectedSeat?.status === 'available'
})

const handleBook = () => {
  if (!canBook.value) return

  const success = seatStore.bookSeat()
  if (success) {
    showToast('预约成功！', 'success')
    setTimeout(() => {
      seatStore.clearSelection()
    }, 1500)
  } else {
    showToast('预约失败，请重试', 'error')
  }
}

const handleSearch = () => {
  showToast('已刷新座位状态', 'success')
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Update current time marker
let timeInterval = null
onMounted(() => {
  updateTimePosition()
  timeInterval = setInterval(updateTimePosition, 60000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

const updateTimePosition = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  if (hours < 8) {
    currentTimePosition.value = 0
  } else if (hours >= 22) {
    currentTimePosition.value = 100
  } else {
    const totalMinutes = (hours - 8) * 60 + minutes
    const totalAvailable = 14 * 60 // 8:00 to 22:00
    currentTimePosition.value = Math.min(100, (totalMinutes / totalAvailable) * 100)
  }
}
</script>

<style scoped>
.seat-map-page {
  padding-top: 64px;
}

/* Page Header */
.page-header {
  padding: 24px 24px 0;
}

.page-header-container {
  max-width: 1280px;
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

/* Filter Bar */
.filter-bar {
  padding: 24px;
}

.filter-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  font-size: 0.875rem;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  color: var(--color-text);
  height: 40px;
  min-width: 160px;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-md);
  height: 40px;
  transition: all 0.15s ease;
}

.filter-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.filter-btn svg {
  width: 16px;
  height: 16px;
}

/* Main Content */
.main-content {
  padding: 0 24px 24px;
}

.content-container {
  max-width: 1280px;
  margin: 0 auto;
}

.content-layout {
  display: flex;
  gap: 24px;
}

/* Seat Map Section */
.seat-map-section {
  flex: 1;
  min-width: 0;
}

.seat-map-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.room-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.room-title svg {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
}

.room-title h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.room-badge {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* Floor Plan */
.floor-plan {
  padding: 24px 20px 16px;
}

.entrance-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  background: var(--color-bg-sunken);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  margin-bottom: 20px;
}

.entrance-area span {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.seat-grid-container {
  max-width: 720px;
  margin: 0 auto;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.row-label {
  width: 20px;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.seat-row-seats {
  display: flex;
  gap: 4px;
}

/* Seat Styles */
.seat {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 44px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  user-select: none;
}

.seat span {
  pointer-events: none;
  line-height: 1;
}

.seat-available {
  background: var(--state-success-bg);
  border-color: var(--state-success);
  color: var(--state-success);
}

.seat-available:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 160, 107, 0.15);
}

.seat-reserved {
  background: var(--state-error-bg);
  border-color: var(--state-error);
  color: var(--state-error);
  cursor: not-allowed;
  opacity: 0.85;
}

.seat-reserved::after {
  content: '已预约';
  position: absolute;
  top: -6px;
  right: -2px;
  font-size: 9px;
  font-weight: 600;
  background: var(--state-error);
  color: white;
  padding: 1px 4px;
  border-radius: 3px;
  line-height: 1.3;
}

.seat-reserved:hover {
  transform: none;
  box-shadow: none;
}

.seat-occupied {
  background: var(--state-warning-bg);
  border-color: var(--state-warning);
  color: var(--state-warning);
  cursor: not-allowed;
  opacity: 0.85;
}

.seat-occupied:hover {
  transform: none;
  box-shadow: none;
}

.seat-mine {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.seat-mine:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(27, 122, 110, 0.2);
}

.seat-selected {
  background: var(--state-success-bg);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(27, 122, 110, 0.18);
  font-weight: 600;
}

.seat-selected:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(27, 122, 110, 0.22);
}

.column-labels {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.col-spacer {
  width: 20px;
}

.col-label {
  width: 72px;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Legend */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  border-top: 1px solid var(--color-border-light);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-dot.available {
  background: var(--state-success-bg);
  border: 2px solid var(--state-success);
}

.legend-dot.reserved {
  background: var(--state-error-bg);
  border: 2px solid var(--state-error);
}

.legend-dot.occupied {
  background: var(--state-warning-bg);
  border: 2px solid var(--state-warning);
}

.legend-dot.mine {
  background: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.legend-item span {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

/* Detail Section */
.detail-section {
  width: 384px;
  flex-shrink: 0;
}

.detail-panel {
  position: sticky;
  top: 88px;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.panel-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

/* Seat Info Card */
.seat-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.seat-badge {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  border-radius: var(--radius-md);
  background: var(--color-primary);
}

.seat-badge.available {
  background: var(--state-success);
}

.seat-badge.reserved {
  background: var(--state-error);
}

.seat-badge.occupied {
  background: var(--state-warning);
}

.seat-badge.mine {
  background: var(--color-primary);
}

.seat-info {
  flex: 1;
}

.seat-room {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 4px;
}

.seat-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}

.seat-status-badge.available {
  background: var(--state-success-bg);
  color: var(--state-success);
}

.seat-status-badge.reserved {
  background: var(--state-error-bg);
  color: var(--state-error);
}

.seat-status-badge.occupied {
  background: var(--state-warning-bg);
  color: var(--state-warning);
}

.seat-status-badge.mine {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* Seat Properties */
.seat-properties {
  padding: 20px;
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.property-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.property-value {
  font-size: 0.875rem;
  color: var(--color-text);
}

.property-value.available {
  color: var(--state-success);
}

/* Time Slots Section */
.time-slots-section {
  padding: 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.time-slots-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
}

.time-axis {
  position: relative;
  height: 32px;
  background: var(--color-bg-muted);
  border-radius: var(--radius-sm);
}

.time-labels {
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 4px;
  bottom: -20px;
}

.time-labels span {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.time-blocks {
  position: relative;
  height: 100%;
  padding: 4px 0;
}

.time-block {
  position: absolute;
  top: 4px;
  height: calc(100% - 8px);
  border-radius: 4px;
  border: 1px solid;
}

.time-block.available {
  background: var(--state-success-bg);
  border-color: var(--state-success);
  opacity: 0.5;
}

.time-block.reserved {
  background: var(--state-error-bg);
  border-color: var(--state-error);
  opacity: 0.7;
}

.time-marker {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background: var(--color-primary);
  border-radius: 1px;
}

.time-marker::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -3px;
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
}

.time-slot-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}

.time-slot-labels span {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Booking Section */
.booking-section {
  padding: 20px;
}

.booking-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
}

.time-slot-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.slot-btn {
  flex: 1;
  padding: 10px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  background: var(--color-bg-muted);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-light);
  height: 40px;
  transition: all 0.15s ease;
  cursor: not-allowed;
  opacity: 0.6;
}

.slot-btn.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
  cursor: pointer;
  opacity: 1;
}

.slot-btn:not(.disabled):hover {
  background: var(--color-primary);
  color: white;
}

.book-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-md);
  height: 48px;
  transition: all 0.15s ease;
}

.book-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.book-btn:disabled {
  background: var(--color-border-light);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.book-btn svg {
  width: 16px;
  height: 16px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
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
@media (max-width: 1024px) {
  .content-layout {
    flex-direction: column;
  }

  .detail-section {
    width: 100%;
  }

  .detail-panel {
    position: static;
  }
}

@media (max-width: 640px) {
  .page-header {
    padding: 16px 16px 0;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .filter-bar {
    padding: 16px;
  }

  .filter-container {
    gap: 12px;
  }

  .filter-select {
    min-width: 120px;
  }

  .main-content {
    padding: 0 16px 16px;
  }

  .seat {
    width: 40px;
    height: 32px;
    font-size: 9px;
    border-radius: 4px;
  }

  .seat-row-seats {
    gap: 2px;
  }

  .col-label {
    width: 42px;
  }

  .seat-reserved::after {
    display: none;
  }

  .floor-plan {
    padding: 16px 10px 12px;
  }
}
</style>
