<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/_csv_writer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'method_not_allowed']);
    exit;
}

$data = json_decode((string) file_get_contents('php://input'), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'invalid_body']);
    exit;
}

verificar_isca($data);
limitar_envios('parceria');

$name  = campo($data, 'name', 100);
$phone = campo($data, 'phone', 20);
$email = campo($data, 'email', 254);
$city  = campo($data, 'city', 100);
$state = campo($data, 'state', 2);

if ($name === '' || $phone === '' || $email === '' || $city === '' || $state === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'missing_fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'invalid_email']);
    exit;
}

// O formulário só envia com o consentimento marcado; o servidor confere de novo.
if (($data['consent'] ?? false) !== true) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'missing_consent']);
    exit;
}

if (!append_lead('hero', $name, $phone, $email, $city, $state, '', '', true)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'storage_error']);
    exit;
}

echo json_encode(['success' => true]);
