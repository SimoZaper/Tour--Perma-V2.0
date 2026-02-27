// Notifications toast

function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
  if (toast && toast.parentNode) {
    toast.classList.add('toast-hide');
    setTimeout(() => toast.parentNode && toast.parentNode.removeChild(toast), 300);
  }
}
