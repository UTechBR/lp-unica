<?php
declare(strict_types=1);

// Evita injeção de fórmulas se o CSV for aberto no Excel/Sheets.
function csv_safe(string $value): string
{
    return preg_match('/^[=+\-@]/', $value) === 1 ? "'" . $value : $value;
}

// LeadForm (Hero) e ContatoForm (página Contato) capturam o mesmo tipo de
// contato de cliente, então gravam na mesma planilha leads.csv — a coluna
// "origem" distingue de onde veio cada linha.
function append_lead(
    string $origin,
    string $name,
    string $phone,
    string $email,
    string $city,
    string $state,
    string $subject,
    string $message,
    bool $consent
): bool {
    $row = [
        date('Y-m-d H:i:s'),
        csv_safe($origin),
        csv_safe($name),
        csv_safe($phone),
        csv_safe($email),
        csv_safe($city),
        csv_safe($state),
        csv_safe($subject),
        csv_safe($message),
        $_SERVER['REMOTE_ADDR'] ?? '',
        // Registro do consentimento LGPD dado no formulário (coluna adicionada depois:
        // em leads.csv criados antes, o cabeçalho não tem o nome desta coluna).
        $consent ? 'sim' : 'nao',
    ];

    $file = __DIR__ . '/leads.csv';
    $isNew = !file_exists($file);

    $fp = fopen($file, 'ab');
    if ($fp === false) {
        return false;
    }

    $ok = true;
    if (flock($fp, LOCK_EX)) {
        if ($isNew) {
            fputcsv($fp, ['data_hora', 'origem', 'nome', 'telefone', 'email', 'cidade', 'estado', 'assunto', 'mensagem', 'ip', 'consentimento']);
        }
        fputcsv($fp, $row);
        flock($fp, LOCK_UN);
    } else {
        $ok = false;
    }
    fclose($fp);

    return $ok;
}
