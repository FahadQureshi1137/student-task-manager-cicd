// ═══════════════════════════════════════════════════════════
//  Student Task Manager — app.js
// ═══════════════════════════════════════════════════════════

const API = 'php/tasks.php';

let allTasks = [];
let editingId = null;

// ── DOM REFS ─────────────────────────────────────────────
const grid        = document.getElementById('tasks-grid');
const modal       = document.getElementById('modal');
const modalTitle  = document.getElementById('modal-title');
const form        = document.getElementById('task-form');
const toast       = document.getElementById('toast');

const filterStatus   = document.getElementById('filter-status');
const filterPriority = document.getElementById('filter-priority');
const searchInput    = document.getElementById('search');

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', fetchTasks);

// ── API CALLS ─────────────────────────────────────────────
async function fetchTasks() {
  try {
    const res  = await fetch(`${API}?action=get_all`);
    const json = await res.json();
    if (json.success) {
      allTasks = json.data;
      renderAll();
      updateStats();
    }
  } catch (err) {
    showToast('Could not connect to server', true);
  }
}

async function saveTask(data) {
  const action = editingId ? 'update' : 'create';
  if (editingId) data.id = editingId;

  const res  = await fetch(`${API}?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (json.success) {
    showToast(editingId ? 'Task updated!' : 'Task created!');
    closeModal();
    fetchTasks();
  } else {
    showToast(json.message, true);
  }
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  const res  = await fetch(`${API}?action=delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const json = await res.json();
  if (json.success) {
    showToast('Task deleted');
    fetchTasks();
  }
}

async function updateStatus(id, status) {
  const task = allTasks.find(t => t.id == id);
  if (!task) return;
  await fetch(`${API}?action=update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, status })
  });
  fetchTasks();
}

// ── RENDER ────────────────────────────────────────────────
function renderAll() {
  let tasks = [...allTasks];

  const status   = filterStatus.value;
  const priority = filterPriority.value;
  const search   = searchInput.value.toLowerCase();

  if (status)   tasks = tasks.filter(t => t.status   === status);
  if (priority) tasks = tasks.filter(t => t.priority === priority);
  if (search)   tasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search) ||
    (t.subject || '').toLowerCase().includes(search)
  );

  if (tasks.length === 0) {
    grid.innerHTML = `
      <div class="empty">
        <div class="icon">📭</div>
        <p>No tasks found. Add one above!</p>
      </div>`;
    return;
  }

  grid.innerHTML = tasks.map(renderCard).join('');
}

function renderCard(t) {
  const dueLabel = t.due_date
    ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No due date';

  return `
    <div class="task-card ${t.priority}" data-id="${t.id}">
      <h3>${escHtml(t.title)}</h3>
      <p class="desc">${escHtml(t.description || 'No description')}</p>
      <div class="task-meta">
        ${t.subject ? `<span class="badge subject">📚 ${escHtml(t.subject)}</span>` : ''}
        <span class="badge due">📅 ${dueLabel}</span>
        <span class="badge priority-${t.priority}">${t.priority.toUpperCase()}</span>
      </div>
      <select class="status-select" onchange="updateStatus(${t.id}, this.value)">
        <option value="pending"     ${t.status==='pending'     ? 'selected':''}>⏳ Pending</option>
        <option value="in_progress" ${t.status==='in_progress' ? 'selected':''}>🔄 In Progress</option>
        <option value="completed"   ${t.status==='completed'   ? 'selected':''}>✅ Completed</option>
      </select>
      <div class="card-actions">
        <button class="edit-btn" onclick="openEdit(${t.id})">✏️ Edit</button>
        <button class="del-btn"  onclick="deleteTask(${t.id})">🗑️ Delete</button>
      </div>
    </div>`;
}

// ── STATS ────────────────────────────────────────────────
function updateStats() {
  document.getElementById('stat-total').textContent     = allTasks.length;
  document.getElementById('stat-pending').textContent   = allTasks.filter(t => t.status === 'pending').length;
  document.getElementById('stat-progress').textContent  = allTasks.filter(t => t.status === 'in_progress').length;
  document.getElementById('stat-done').textContent      = allTasks.filter(t => t.status === 'completed').length;
}

// ── MODAL ─────────────────────────────────────────────────
function openAdd() {
  editingId = null;
  form.reset();
  modalTitle.textContent = 'Add New Task';
  modal.classList.add('open');
}

function openEdit(id) {
  const task = allTasks.find(t => t.id == id);
  if (!task) return;
  editingId = id;
  modalTitle.textContent = 'Edit Task';

  document.getElementById('f-title').value       = task.title;
  document.getElementById('f-description').value = task.description || '';
  document.getElementById('f-subject').value     = task.subject || '';
  document.getElementById('f-due-date').value    = task.due_date || '';
  document.getElementById('f-priority').value    = task.priority;
  document.getElementById('f-status').value      = task.status;

  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
  editingId = null;
}

// ── FORM SUBMIT ───────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    title:       document.getElementById('f-title').value.trim(),
    description: document.getElementById('f-description').value.trim(),
    subject:     document.getElementById('f-subject').value.trim(),
    due_date:    document.getElementById('f-due-date').value,
    priority:    document.getElementById('f-priority').value,
    status:      document.getElementById('f-status').value,
  };
  if (!data.title) { showToast('Title is required', true); return; }
  await saveTask(data);
});

// ── FILTERS ───────────────────────────────────────────────
filterStatus.addEventListener('change', renderAll);
filterPriority.addEventListener('change', renderAll);
searchInput.addEventListener('input', renderAll);

// ── HELPERS ───────────────────────────────────────────────
function showToast(msg, isError = false) {
  toast.textContent = msg;
  toast.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => toast.className = 'toast', 3000);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
