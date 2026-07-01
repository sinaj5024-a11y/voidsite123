<?php
header('Content-Type: application/json');

// Получаем данные от клиента
$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Заполните поля']);
    exit;
}

// Путь к файлу с паролями ВНЕ публичной папки (если возможно)
// Но для простоты положим в папку __data (создай её)
$usersFile = __DIR__ . '/__data/users.json';

// Если файла нет, создаём с тестовым пользователем
if (!file_exists($usersFile)) {
    if (!file_exists(__DIR__ . '/__data')) {
        mkdir(__DIR__ . '/__data', 0755, true);
    }
    // Создаём хеш для пароля "admin123" (просто пример, потом удалишь)
    $defaultPasswordHash = password_hash('admin123', PASSWORD_BCRYPT);
    $users = [
        'admin' => $defaultPasswordHash
    ];
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT), LOCK_EX);
}

// Читаем пользователей
$users = json_decode(file_get_contents($usersFile), true);
if (!is_array($users)) {
    echo json_encode(['success' => false, 'message' => 'Ошибка сервера']);
    exit;
}

// Проверяем существование пользователя и пароль
if (!isset($users[$username]) || !password_verify($password, $users[$username])) {
    // Одинаковый ответ при любом несовпадении (не говорим, что именно не так)
    echo json_encode(['success' => false, 'message' => 'Неверный логин или пароль']);
    exit;
}

// Успех
echo json_encode(['success' => true]);
