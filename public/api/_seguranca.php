<?php
declare(strict_types=1);

// Proteções comuns aos endpoints dos formulários (leads, contato, ouvidoria, denúncia).
// Bloqueado para acesso direto em .htaccess (só é incluído pelos scripts).

// Datas das planilhas e dos protocolos no horário de Brasília (o padrão do PHP é UTC).
date_default_timezone_set('America/Sao_Paulo');

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
 * Pasta privada onde os formulários gravam tudo (planilhas, anexos, contadores).
 * Preferida: um nível acima da raiz pública (em dev, lp-unica/storage; na Hostgator,
 * ~/storage, fora de public_html). Se não der para criar ou escrever, cai para
 * public/api/storage, bloqueada por .htaccess. `$sub` cria e devolve uma subpasta.
 */
function pasta_storage(string $sub = ''): string
{
    $base = dirname(__DIR__, 2) . '/storage';
    if (!((is_dir($base) || @mkdir($base, 0750, true)) && is_writable($base))) {
        $base = __DIR__ . '/storage';
        if (!is_dir($base)) {
            @mkdir($base, 0750, true);
        }
        if (!file_exists($base . '/.htaccess')) {
            file_put_contents($base . '/.htaccess', "Require all denied\nOptions -Indexes\n");
        }
    }
    if ($sub === '') {
        return $base;
    }
    $pasta = $base . '/' . $sub;
    if (!is_dir($pasta)) {
        @mkdir($pasta, 0750, true);
    }
    return $pasta;
}

/**
 * Protocolo de cada registro gravado: PREFIXO-AAAAMMDDHHMMSS (ex.: OUV-20261003143205).
 * Sem contador: a data e hora até o segundo já identificam o envio. Para dois envios do
 * mesmo tipo no mesmo segundo não saírem com o mesmo número, guarda-se só o último
 * protocolo emitido por prefixo e, se repetir, espera-se o segundo seguinte.
 */
function gerar_protocolo(string $prefixo): string
{
    $fp = @fopen(pasta_storage('protocolos') . '/' . $prefixo . '.ultimo', 'c+');
    if ($fp === false) {
        return $prefixo . '-' . date('YmdHis');
    }
    flock($fp, LOCK_EX);
    $ultimo = trim((string) stream_get_contents($fp));
    while (($protocolo = $prefixo . '-' . date('YmdHis')) === $ultimo) {
        usleep(100000);
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, $protocolo);
    flock($fp, LOCK_UN);
    fclose($fp);
    return $protocolo;
}

/**
 * Segredo do servidor para os hashes de IP: gerado no primeiro uso e guardado em
 * storage/.segredo (fora do repositório). Sem ele, um SHA-256 simples do IP seria
 * revertido por força bruta (são só ~4 bilhões de IPv4).
 */
function segredo_servidor(): string
{
    $arquivo = pasta_storage() . '/.segredo';
    $segredo = is_file($arquivo) ? trim((string) file_get_contents($arquivo)) : '';
    if (strlen($segredo) < 64) {
        $segredo = bin2hex(random_bytes(32));
        if (@file_put_contents($arquivo, $segredo, LOCK_EX) !== false) {
            @chmod($arquivo, 0600);
        }
    }
    return $segredo;
}

/**
 * Limite de envios por IP e por formulário: no máximo $max envios a cada $janela segundos.
 * Contadores em storage/formularios-limites/. O IP é guardado só como HMAC com o segredo
 * do servidor; só a janela atual é mantida, e contadores sem envio recente são apagados.
 */
function limitar_envios(string $formulario, int $max = 5, int $janela = 600): void
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'desconhecido';
    $pasta = pasta_storage('formularios-limites');
    $arquivo = $pasta . '/' . $formulario . '-' . hash_hmac('sha256', $ip, segredo_servidor()) . '.json';
    $agora = time();

    foreach (glob($pasta . '/*.json') ?: [] as $antigo) {
        if ($antigo !== $arquivo && @filemtime($antigo) < $agora - $janela) {
            @unlink($antigo);
        }
    }

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
