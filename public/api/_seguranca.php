<?php
declare(strict_types=1);

// Proteções comuns aos endpoints dos formulários (leads, contato, ouvidoria, denúncia).
// Bloqueado para acesso direto em .htaccess (só é incluído pelos scripts).

function responder(int $status, array $corpo): void
{
    http_response_code($status);
    echo json_encode($corpo);
    exit;
}

/**
 * Evita injeção de fórmulas quando o CSV é aberto no Excel/Sheets: valores que começam
 * com = + - @, tab ou retorno ganham um apóstrofo na frente.
 */
function csv_safe(string $value): string
{
    return preg_match('/^[=+\-@\t\r]/', $value) === 1 ? "'" . $value : $value;
}

/**
 * Lê um campo de texto do corpo da requisição, sem espaços nas pontas, e recusa valores
 * maiores que o limite (o front-end já limita; aqui é a garantia contra envio direto).
 */
function campo(array $dados, string $chave, int $max): string
{
    $valor = trim((string) ($dados[$chave] ?? ''));
    $tamanho = function_exists('mb_strlen') ? mb_strlen($valor, 'UTF-8') : (int) preg_match_all('/./us', $valor);
    if ($tamanho > $max) {
        responder(422, ['success' => false, 'error' => 'too_long']);
    }
    return $valor;
}

/**
 * Campo-isca invisível ("website"): pessoas não o preenchem, robôs costumam preencher.
 * Respondemos sucesso para o robô não insistir, sem gravar nada.
 */
function verificar_isca(array $dados): void
{
    if (trim((string) ($dados['website'] ?? '')) !== '') {
        responder(200, ['success' => true]);
    }
}

/**
 * Pasta de dados internos (contadores de envio): fora da raiz pública quando possível;
 * senão, ao lado dos scripts, bloqueada por .htaccess.
 */
function pasta_privada(string $nome): string
{
    $fora = dirname(__DIR__, 2) . '/' . $nome;
    if ((is_dir($fora) || @mkdir($fora, 0750, true)) && is_writable($fora)) {
        return $fora;
    }
    $dentro = __DIR__ . '/' . $nome;
    if (!is_dir($dentro)) {
        @mkdir($dentro, 0750, true);
    }
    if (!file_exists($dentro . '/.htaccess')) {
        file_put_contents($dentro . '/.htaccess', "Require all denied\nOptions -Indexes\n");
    }
    return $dentro;
}

/**
 * Limite de envios por IP e por formulário: no máximo $max envios a cada $janela segundos.
 * O IP é guardado só como hash, e os registros antigos são descartados a cada envio.
 */
function limitar_envios(string $formulario, int $max = 5, int $janela = 600): void
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'desconhecido';
    $arquivo = pasta_privada('formularios-limites') . '/' . $formulario . '-' . hash('sha256', $ip) . '.json';
    $agora = time();

    $fp = @fopen($arquivo, 'c+');
    if ($fp === false) {
        return; // sem como contar, não bloqueia o envio legítimo
    }
    flock($fp, LOCK_EX);
    $envios = json_decode((string) stream_get_contents($fp), true);
    $envios = array_values(array_filter(is_array($envios) ? $envios : [], fn ($t) => is_int($t) && $t > $agora - $janela));

    if (count($envios) >= $max) {
        flock($fp, LOCK_UN);
        fclose($fp);
        responder(429, ['success' => false, 'error' => 'too_many_requests']);
    }

    $envios[] = $agora;
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($envios));
    flock($fp, LOCK_UN);
    fclose($fp);
}
