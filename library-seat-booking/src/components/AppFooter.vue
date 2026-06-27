<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <p class="footer-text">图书馆座位预约系统</p>
        <p class="footer-copyright">Copyright 2025 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  background: var(--color-bg-elevated);
  border-top: 1px solid var(--color-border-light);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

@media (min-width: 640px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.footer-copyright {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
