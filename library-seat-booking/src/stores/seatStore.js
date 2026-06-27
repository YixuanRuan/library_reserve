import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSeatStore = defineStore('seat', () => {
  // Reading rooms
  const readingRooms = ref([
    { id: 1, name: '一楼综合阅览室', floor: 1 },
    { id: 2, name: '二楼期刊阅览室', floor: 2 },
    { id: 3, name: '三楼电子阅览室', floor: 3 },
    { id: 4, name: '四楼自习室', floor: 4 }
  ])

  // Current selected reading room
  const selectedRoomId = ref(1)

  // Time slots
  const timeSlots = ref([
    { id: 'morning', name: '上午', startTime: '08:00', endTime: '12:00', available: true },
    { id: 'afternoon', name: '下午', startTime: '12:00', endTime: '18:00', available: false },
    { id: 'evening', name: '晚间', startTime: '18:00', endTime: '22:00', available: true }
  ])

  // Selected time slot
  const selectedTimeSlotId = ref('morning')

  // Current user info
  const currentUser = ref({
    id: 'user-001',
    name: '李明',
    avatar: '李',
    phone: '138****8888'
  })

  // My booked seats
  const myBookings = ref([
    {
      id: 'booking-001',
      seatId: 'C-01',
      roomId: 1,
      roomName: '一楼综合阅览室',
      date: '2026-06-27',
      timeSlot: 'morning',
      timeSlotName: '上午',
      status: 'active',
      bookTime: '2026-06-27 08:30'
    }
  ])

  // Seats data for each room
  const generateSeatsForRoom = (roomId) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F']
    const cols = [1, 2, 3, 4, 5, 6, 7, 8]
    const seats = []

    const reservedSeats = {
      1: ['A-03', 'A-06', 'B-04', 'C-02', 'C-07', 'D-04', 'E-02', 'E-05', 'F-04'],
      2: ['A-02', 'B-05', 'C-03', 'D-06', 'E-01', 'F-03'],
      3: ['A-04', 'B-01', 'C-05', 'D-02', 'E-07', 'F-06'],
      4: ['A-01', 'B-06', 'C-04', 'D-07', 'E-03', 'F-02']
    }

    const occupiedSeats = {
      1: ['A-08', 'B-01', 'B-07', 'C-05', 'D-03', 'D-07', 'E-08', 'F-01', 'F-07'],
      2: ['A-05', 'B-02', 'C-06', 'D-01', 'E-04', 'F-08'],
      3: ['A-07', 'B-03', 'C-01', 'D-05', 'E-02', 'F-05'],
      4: ['A-06', 'B-08', 'C-03', 'D-04', 'E-06', 'F-01']
    }

    const mySeatList = myBookings.value.map(b => b.seatId)

    rows.forEach(row => {
      cols.forEach(col => {
        const seatId = `${row}-${col.toString().padStart(2, '0')}`
        const isReserved = reservedSeats[roomId]?.includes(seatId)
        const isOccupied = occupiedSeats[roomId]?.includes(seatId)
        const isMine = mySeatList.includes(seatId)

        let status = 'available'
        if (isMine) status = 'mine'
        else if (isReserved) status = 'reserved'
        else if (isOccupied) status = 'occupied'

        seats.push({
          id: seatId,
          row,
          col,
          roomId,
          status,
          type: col <= 2 ? 'window' : col >= 7 ? 'aisle' : 'normal',
          hasPower: Math.random() > 0.3,
          position: col <= 2 ? '靠窗' : col >= 7 ? '靠过道' : '中间'
        })
      })
    })

    return seats
  }

  // Get seats for current room
  const seats = computed(() => generateSeatsForRoom(selectedRoomId.value))

  // Selected seat
  const selectedSeat = ref(null)

  // Select a seat
  const selectSeat = (seat) => {
    if (seat.status === 'reserved' || seat.status === 'occupied') {
      selectedSeat.value = seat
      return
    }
    selectedSeat.value = seat
  }

  // Clear selection
  const clearSelection = () => {
    selectedSeat.value = null
    selectedTimeSlotId.value = 'morning'
  }

  // Get current room name
  const currentRoomName = computed(() => {
    const room = readingRooms.value.find(r => r.id === selectedRoomId.value)
    return room ? room.name : ''
  })

  // Book a seat
  const bookSeat = () => {
    if (!selectedSeat.value || selectedSeat.value.status !== 'available') {
      return false
    }

    const timeSlot = timeSlots.value.find(t => t.id === selectedTimeSlotId.value)
    const room = readingRooms.value.find(r => r.id === selectedRoomId.value)

    const booking = {
      id: `booking-${Date.now()}`,
      seatId: selectedSeat.value.id,
      roomId: selectedRoomId.value,
      roomName: room.name,
      date: new Date().toISOString().split('T')[0],
      timeSlot: selectedTimeSlotId.value,
      timeSlotName: timeSlot.name,
      status: 'active',
      bookTime: new Date().toLocaleString('zh-CN')
    }

    myBookings.value.push(booking)
    return true
  }

  // Cancel booking
  const cancelBooking = (bookingId) => {
    const index = myBookings.value.findIndex(b => b.id === bookingId)
    if (index !== -1) {
      myBookings.value.splice(index, 1)
    }
  }

  // Update selected room
  const updateSelectedRoom = (roomId) => {
    selectedRoomId.value = roomId
    selectedSeat.value = null
    selectedTimeSlotId.value = 'morning'
  }

  // Update selected time slot
  const updateSelectedTimeSlot = (slotId) => {
    selectedTimeSlotId.value = slotId
  }

  // Check if time slot is available for a seat
  const isTimeSlotAvailable = (slotId) => {
    const slot = timeSlots.value.find(t => t.id === slotId)
    return slot ? slot.available : false
  }

  return {
    readingRooms,
    selectedRoomId,
    timeSlots,
    selectedTimeSlotId,
    currentUser,
    myBookings,
    seats,
    selectedSeat,
    currentRoomName,
    selectSeat,
    clearSelection,
    bookSeat,
    cancelBooking,
    updateSelectedRoom,
    updateSelectedTimeSlot,
    isTimeSlotAvailable
  }
})
