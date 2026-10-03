<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

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

// Tipos aceitos: espelham ouvidoriaTipos em src/utils/schemas.ts.
const TIPOS = ['Reclamação', 'Solicitação', 'Sugestão', 'Elogio'];

$name    = trim((string) ($data['name'] ?? ''));
$email   = trim((string) ($data['email'] ?? ''));
$phone   = trim((string) ($data['phone'] ?? ''));
$tipo    = trim((string) ($data['tipo'] ?? ''));
$banco   = trim((string) ($data['banco'] ?? '')); // opcional
$message = trim((string) ($data['message'] ?? ''));

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

// Evita injeção de fórmulas se o CSV for aberto no Excel/Sheets.
function csv_safe(string $value): string
{
    return preg_match('/^[=+\-@]/', $value) === 1 ? "'" . $value : $value;
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
