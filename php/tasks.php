<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'get_all') {
            getAllTasks();
        } elseif ($action === 'get_one') {
            getTask($_GET['id'] ?? null);
        } else {
            respond(false, 'Unknown action');
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if ($action === 'create') {
            createTask($data);
        } elseif ($action === 'update') {
            updateTask($data);
        } elseif ($action === 'delete') {
            deleteTask($data['id'] ?? null);
        } else {
            respond(false, 'Unknown action');
        }
        break;

    default:
        respond(false, 'Method not allowed');
}

// ── GET ALL TASKS ──────────────────────────────────────────
function getAllTasks() {
    $conn = getConnection();
    $result = $conn->query("SELECT * FROM tasks ORDER BY created_at DESC");
    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
    $conn->close();
    respond(true, 'Tasks fetched', $tasks);
}

// ── GET ONE TASK ───────────────────────────────────────────
function getTask($id) {
    if (!$id) { respond(false, 'ID required'); return; }
    $conn = getConnection();
    $stmt = $conn->prepare("SELECT * FROM tasks WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $conn->close();
    respond(true, 'Task fetched', $result);
}

// ── CREATE TASK ────────────────────────────────────────────
function createTask($data) {
    if (empty($data['title'])) { respond(false, 'Title is required'); return; }
    $conn = getConnection();
    $stmt = $conn->prepare(
        "INSERT INTO tasks (title, description, subject, due_date, priority, status)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        'ssssss',
        $data['title'],
        $data['description'],
        $data['subject'],
        $data['due_date'],
        $data['priority'],
        $data['status']
    );
    if ($stmt->execute()) {
        respond(true, 'Task created', ['id' => $conn->insert_id]);
    } else {
        respond(false, 'Failed to create task');
    }
    $stmt->close();
    $conn->close();
}

// ── UPDATE TASK ────────────────────────────────────────────
function updateTask($data) {
    if (empty($data['id'])) { respond(false, 'ID required'); return; }
    $conn = getConnection();
    $stmt = $conn->prepare(
        "UPDATE tasks SET title=?, description=?, subject=?, due_date=?, priority=?, status=?
         WHERE id=?"
    );
    $stmt->bind_param(
        'ssssssi',
        $data['title'],
        $data['description'],
        $data['subject'],
        $data['due_date'],
        $data['priority'],
        $data['status'],
        $data['id']
    );
    if ($stmt->execute()) {
        respond(true, 'Task updated');
    } else {
        respond(false, 'Failed to update task');
    }
    $stmt->close();
    $conn->close();
}

// ── DELETE TASK ────────────────────────────────────────────
function deleteTask($id) {
    if (!$id) { respond(false, 'ID required'); return; }
    $conn = getConnection();
    $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        respond(true, 'Task deleted');
    } else {
        respond(false, 'Failed to delete task');
    }
    $stmt->close();
    $conn->close();
}

// ── HELPER ─────────────────────────────────────────────────
function respond($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data'    => $data
    ]);
    exit;
}
?>
