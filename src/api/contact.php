<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

$envCandidates = [
    dirname(__DIR__, 2) . '/.env',
    __DIR__ . '/.env'
];

foreach ($envCandidates as $envFile) {
    if (!is_file($envFile)) {
        continue;
    }

    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || str_starts_with($trimmed, '#') || !str_contains($trimmed, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $trimmed, 2);
        $key = trim($key);
        $value = trim($value);
        if ($key !== '') {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
    break;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'error' => 'Metodo no permitido.'
    ]);
    exit;
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody ?? '', true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'Formato JSON invalido.'
    ]);
    exit;
}

$channel = isset($data['channel']) ? strtolower(trim((string)$data['channel'])) : '';
$name = isset($data['name']) ? trim((string)$data['name']) : '';
$contact = isset($data['contact']) ? trim((string)$data['contact']) : '';
$needs = isset($data['needs']) ? trim((string)$data['needs']) : '';

if (!in_array($channel, ['whatsapp', 'email'], true)) {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'error' => 'Canal de contacto invalido.'
    ]);
    exit;
}

if ($name === '' || mb_strlen($name) < 2) {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'error' => 'Nombre invalido.'
    ]);
    exit;
}

if ($needs === '' || mb_strlen($needs) < 10) {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'error' => 'Describe mejor lo que necesitas (minimo 10 caracteres).'
    ]);
    exit;
}

if ($channel === 'email') {
    if (!filter_var($contact, FILTER_VALIDATE_EMAIL)) {
        http_response_code(422);
        echo json_encode([
            'ok' => false,
            'error' => 'Correo electronico invalido.'
        ]);
        exit;
    }
} else {
    if (!preg_match('/^\+?[0-9\s()\-]{8,20}$/', $contact)) {
        http_response_code(422);
        echo json_encode([
            'ok' => false,
            'error' => 'Numero de WhatsApp invalido.'
        ]);
        exit;
    }
}

$recipient = trim((string) (getenv('MAIL_TO') ?: 'unionfacid@gmail.com'));
$siteName = 'Bethyra';
$submittedAt = date('Y-m-d H:i:s');

$subject = '[' . $siteName . '] Nuevo contacto por ' . ($channel === 'whatsapp' ? 'WhatsApp' : 'Correo');

$messageLines = [
    'Nuevo mensaje de contacto',
    '-------------------------',
    'Fecha: ' . $submittedAt,
    'Canal: ' . ($channel === 'whatsapp' ? 'WhatsApp' : 'Correo electronico'),
    'Nombre: ' . $name,
    'Contacto: ' . $contact,
    '',
    'Necesidad del cliente:',
    $needs,
    '',
    'Enviado desde el formulario de contacto de Bethyra.'
];

$message = implode(PHP_EOL, $messageLines);

$cleanReplyTo = str_replace(["\r", "\n"], '', $contact);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Bethyra Web <no-reply@bethyra.local>'
];

if ($channel === 'email') {
    $headers[] = 'Reply-To: ' . $cleanReplyTo;
}

$headersText = implode("\r\n", $headers);

$sent = @mail($recipient, $subject, $message, $headersText);

if (!$sent) {
    $fallbackPath = __DIR__ . '/contact_fallback.log';
    $fallbackLine = json_encode([
        'submitted_at' => $submittedAt,
        'channel' => $channel,
        'name' => $name,
        'contact' => $contact,
        'needs' => $needs
    ], JSON_UNESCAPED_UNICODE);

    if ($fallbackLine !== false) {
        @file_put_contents($fallbackPath, $fallbackLine . PHP_EOL, FILE_APPEND | LOCK_EX);
    }

    $smtpHost = trim((string) ini_get('SMTP'));
    $smtpPort = trim((string) ini_get('smtp_port'));
    $sendFrom = trim((string) ini_get('sendmail_from'));

    $smtpSummary = $smtpHost !== ''
        ? ('SMTP actual: ' . $smtpHost . ($smtpPort !== '' ? ':' . $smtpPort : ''))
        : 'SMTP actual: no configurado en php.ini';

    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'No se pudo enviar el correo. Revisa la configuracion SMTP del servidor.',
        'details' => $smtpSummary . ($sendFrom !== '' ? (' | sendmail_from: ' . $sendFrom) : ''),
        'fallback' => 'Contacto guardado en src/api/contact_fallback.log'
    ]);
    exit;
}

echo json_encode([
    'ok' => true,
    'message' => 'Solicitud enviada correctamente.'
]);
