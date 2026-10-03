<?php
declare(strict_types=1);

// Canal de denúncias. Recebe multipart/form-data (campos + anexos), grava uma linha em
// storage/denuncias.csv e os anexos em storage/denuncias-anexos/<protocolo>/.
// Responde com um protocolo.

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/_seguranca.php';

const MAX_ARQUIVOS = 5;
const MAX_BYTES_ARQUIVO = 10 * 1024 * 1024; // 10 MB
const MAX_BYTES_TOTAL = 25 * 1024 * 1024;   // 25 MB
const EXTENSOES_PERMITIDAS = [
    'pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic',
    'doc', 'docx', 'xls', 'xlsx', 'txt',
    'mp3', 'm4a', 'mp4', 'mov',
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, ['success' => false, 'error' => 'method_not_allowed']);
}

// Corpo maior que post_max_size chega vazio: tratar como anexo grande demais.
if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    responder(413, ['success' => false, 'error' => 'file_too_large']);
}

verificar_isca($_POST);
limitar_envios('denuncia');

$anonimo     = ($_POST['anonimo'] ?? '') === 'sim';
$name        = $anonimo ? '' : campo($_POST, 'name', 100);
$email       = $anonimo ? '' : campo($_POST, 'email', 254);
$phone       = $anonimo ? '' : campo($_POST, 'phone', 20);
$category    = campo($_POST, 'category', 100);
$description = campo($_POST, 'description', 3000);

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

$protocolo = gerar_protocolo('DEN');
$salvos = [];

if ($anexos !== []) {
    $pasta = pasta_storage('denuncias-anexos') . '/' . $protocolo;
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
$file = pasta_storage() . '/denuncias.csv';
$isNew = !file_exists($file);

$fp = fopen($file, 'ab');
if ($fp === false) {
    responder(500, ['success' => false, 'error' => 'storage_error']);
}

if (flock($fp, LOCK_EX)) {
    if ($isNew) {
        fputcsv($fp, ['data_hora', 'protocolo', 'anonimo', 'nome', 'email', 'telefone', 'categoria', 'descricao', 'anexos', 'ip'], ',', '"', '');
    }
    fputcsv($fp, $row, ',', '"', '');
    flock($fp, LOCK_UN);
}
fclose($fp);

responder(200, ['success' => true, 'protocolo' => $protocolo]);
