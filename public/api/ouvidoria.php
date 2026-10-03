<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/_seguranca.php';

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
limitar_envios('ouvidoria');

// Tipos aceitos: espelham ouvidoriaTipos em src/utils/schemas.ts.
const TIPOS = ['Reclamação', 'Solicitação', 'Sugestão', 'Elogio'];

$name    = campo($data, 'name', 100);
$email   = campo($data, 'email', 254);
$phone   = campo($data, 'phone', 20);
$tipo    = campo($data, 'tipo', 30);
$banco   = campo($data, 'banco', 120); // opcional
$message = campo($data, 'message', 2000);

if ($name === '' || $email === '' || $phone === '' || $tipo === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'missing_fields']);
    exit;
}

if (!in_array($tipo, TIPOS, true)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'invalid_type']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'invalid_email']);
    exit;
}

// Protocolo devolvido à pessoa e registrado na planilha.
$protocolo = 'OUV-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

$row = [
    date('Y-m-d H:i:s'),
    $protocolo,
    csv_safe($tipo),
    csv_safe($banco),
    csv_safe($name),
    csv_safe($email),
    csv_safe($phone),
    csv_safe($message),
    $_SERVER['REMOTE_ADDR'] ?? '',
];

// ouvidoria-manifestacoes.csv substitui ouvidoria.csv (que tinha outras colunas e segue guardado).
$file = __DIR__ . '/ouvidoria-manifestacoes.csv';
$isNew = !file_exists($file);

$fp = fopen($file, 'ab');
if ($fp === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'storage_error']);
    exit;
}

if (flock($fp, LOCK_EX)) {
    if ($isNew) {
        fputcsv($fp, ['data_hora', 'protocolo', 'tipo', 'banco', 'nome', 'email', 'telefone', 'mensagem', 'ip']);
    }
    fputcsv($fp, $row);
    flock($fp, LOCK_UN);
}
fclose($fp);

echo json_encode(['success' => true, 'protocolo' => $protocolo]);
