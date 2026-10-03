<?php
declare(strict_types=1);

// Canal de denúncias. Recebe multipart/form-data (campos + anexos), grava uma linha em
// denuncias.csv e guarda os anexos fora do alcance público. Responde com um protocolo.

header('Content-Type: application/json; charset=utf-8');

const MAX_ARQUIVOS = 5;
const MAX_BYTES_ARQUIVO = 10 * 1024 * 1024; // 10 MB
const MAX_BYTES_TOTAL = 25 * 1024 * 1024;   // 25 MB
const EXTENSOES_PERMITIDAS = [
    'pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic',
    'doc', 'docx', 'xls', 'xlsx', 'txt',
    'mp3', 'm4a', 'mp4', 'mov',
];

function responder(int $status, array $corpo): void
{
    http_response_code($status);
    echo json_encode($corpo);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, ['success' => false, 'error' => 'method_not_allowed']);
}

// Corpo maior que post_max_size chega vazio: tratar como anexo grande demais.
if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    responder(413, ['success' => false, 'error' => 'file_too_large']);
}

$anonimo     = ($_POST['anonimo'] ?? '') === 'sim';
$name        = $anonimo ? '' : trim((string) ($_POST['name'] ?? ''));
$email       = $anonimo ? '' : trim((string) ($_POST['email'] ?? ''));
$phone       = $anonimo ? '' : trim((string) ($_POST['phone'] ?? ''));
$category    = trim((string) ($_POST['category'] ?? ''));
$description = trim((string) ($_POST['description'] ?? ''));

if ($category === '' || $description === '') {
    responder(422, ['success' => false, 'error' => 'missing_fields']);
}
if (!$anonimo) {
    if ($name === '' || $email === '' || $phone === '') {
        responder(422, ['success' => false, 'error' => 'missing_fields']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        responder(422, ['success' => false, 'error' => 'invalid_email']);
    }
}

// ---- Anexos -------------------------------------------------------------------------

/** Normaliza $_FILES['files'] (name[], tmp_name[]…) em uma lista de arquivos. */
function listar_anexos(): array
{
    $f = $_FILES['files'] ?? null;
    if (!is_array($f) || !isset($f['name'])) {
        return [];
    }
    $lista = [];
    foreach ((array) $f['name'] as $i => $nome) {
        $erro = (int) ((array) $f['error'])[$i];
        if ($erro === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        $lista[] = [
            'nome'  => (string) $nome,
            'tmp'   => (string) ((array) $f['tmp_name'])[$i],
            'bytes' => (int) ((array) $f['size'])[$i],
            'erro'  => $erro,
        ];
    }
    return $lista;
}

$anexos = listar_anexos();

if (count($anexos) > MAX_ARQUIVOS) {
    responder(422, ['success' => false, 'error' => 'too_many_files']);
}

$total = 0;
foreach ($anexos as $anexo) {
    if (in_array($anexo['erro'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) || $anexo['bytes'] > MAX_BYTES_ARQUIVO) {
        responder(413, ['success' => false, 'error' => 'file_too_large']);
    }
    if ($anexo['erro'] !== UPLOAD_ERR_OK || !is_uploaded_file($anexo['tmp'])) {
        responder(400, ['success' => false, 'error' => 'upload_error']);
    }
    $ext = strtolower(pathinfo($anexo['nome'], PATHINFO_EXTENSION));
    if (!in_array($ext, EXTENSOES_PERMITIDAS, true)) {
        responder(415, ['success' => false, 'error' => 'file_type_not_allowed']);
    }
    $total += $anexo['bytes'];
}
if ($total > MAX_BYTES_TOTAL) {
    responder(413, ['success' => false, 'error' => 'file_too_large']);
}

/**
 * Pasta dos anexos: fora da raiz pública quando possível (um nível acima de public_html);
 * senão, ao lado deste script, bloqueada por .htaccess.
 */
function pasta_anexos(): string
{
    $fora = dirname(__DIR__, 2) . '/denuncias-anexos';
    if ((is_dir($fora) || @mkdir($fora, 0750, true)) && is_writable($fora)) {
        return $fora;
    }
    $dentro = __DIR__ . '/denuncias-anexos';
    if (!is_dir($dentro)) {
        @mkdir($dentro, 0750, true);
    }
    if (!file_exists($dentro . '/.htaccess')) {
        file_put_contents($dentro . '/.htaccess', "Require all denied\nOptions -Indexes\n");
    }
    return $dentro;
}

$protocolo = 'DEN-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
$salvos = [];

if ($anexos !== []) {
    $pasta = pasta_anexos() . '/' . $protocolo;
    if (!@mkdir($pasta, 0750, true)) {
        responder(500, ['success' => false, 'error' => 'storage_error']);
    }
    foreach ($anexos as $i => $anexo) {
        $ext = strtolower(pathinfo($anexo['nome'], PATHINFO_EXTENSION));
        // Nome gerado pelo servidor; o nome original vai só para o CSV.
        $destino = sprintf('%s/%02d.%s', $pasta, $i + 1, $ext);
        if (!move_uploaded_file($anexo['tmp'], $destino)) {
            responder(500, ['success' => false, 'error' => 'storage_error']);
        }
        $salvos[] = basename($destino) . ' (' . basename($anexo['nome']) . ')';
    }
}

// ---- Registro -----------------------------------------------------------------------

// Evita injeção de fórmulas se o CSV for aberto no Excel/Sheets.
function csv_safe(string $value): string
{
    return preg_match('/^[=+\-@]/', $value) === 1 ? "'" . $value : $value;
}

$row = [
    date('Y-m-d H:i:s'),
    $protocolo,
    $anonimo ? 'sim' : 'nao',
    csv_safe($name),
    csv_safe($email),
    csv_safe($phone),
    csv_safe($category),
    csv_safe($description),
    csv_safe(implode('; ', $salvos)),
    $anonimo ? '' : ($_SERVER['REMOTE_ADDR'] ?? ''), // denúncia anônima não guarda IP
];

// denuncias.csv substitui denuncie.csv (que tinha menos colunas e segue guardado).
$file = __DIR__ . '/denuncias.csv';
$isNew = !file_exists($file);

$fp = fopen($file, 'ab');
if ($fp === false) {
    responder(500, ['success' => false, 'error' => 'storage_error']);
}

if (flock($fp, LOCK_EX)) {
    if ($isNew) {
        fputcsv($fp, ['data_hora', 'protocolo', 'anonimo', 'nome', 'email', 'telefone', 'categoria', 'descricao', 'anexos', 'ip']);
    }
    fputcsv($fp, $row);
    flock($fp, LOCK_UN);
}
fclose($fp);

responder(200, ['success' => true, 'protocolo' => $protocolo]);
