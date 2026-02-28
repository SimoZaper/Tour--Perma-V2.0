// Gestion des modales

function openModal(content, title = '') {
  const overlay = document.getElementById('modalOverlay');
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <span class="modal-title">${escHtml(title)}</span>
        <button class="btn-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">${content}</div>
    </div>`;
  overlay.style.display = 'flex';
  // Remove any previous listener before adding a new one
  if (overlay._backdropHandler) overlay.removeEventListener('click', overlay._backdropHandler);
  overlay._backdropHandler = e => { if (e.target === overlay) closeModal(); };
  overlay.addEventListener('click', overlay._backdropHandler);
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.style.display = 'none';
  overlay.innerHTML = '';
}

function openQuickModal(content, title = '') {
  const overlay = document.getElementById('quickModalOverlay');
  overlay.innerHTML = `
    <div class="modal-box modal-box-sm">
      <div class="modal-header">
        <span class="modal-title">${escHtml(title)}</span>
        <button class="btn-close" onclick="closeQuickModal()">✕</button>
      </div>
      <div class="modal-body">${content}</div>
    </div>`;
  overlay.style.display = 'flex';
}

function closeQuickModal() {
  const overlay = document.getElementById('quickModalOverlay');
  overlay.style.display = 'none';
  overlay.innerHTML = '';
}
