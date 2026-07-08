<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'error' => 'Metodo no permitido.'
    ]);
    exit;
}

$envCandidates = [
    dirname(__DIR__, 2) . '/.env',
    __DIR__ . '/.env'
];

foreach ($envCandidates as $envFile) {
    if (!is_file($envFile)) {
        continue;
    }

    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        continue;
    }

    foreach ($lines as $line) {
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

$apiKey = trim((string) getenv('PERPLEXITY_API_KEY'));
$model = trim((string) getenv('PERPLEXITY_MODEL'));
if ($model === '') {
    $model = 'sonar';
}

if ($apiKey === '') {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Configura PERPLEXITY_API_KEY en .env para habilitar respuestas dinamicas.'
    ]);
    exit;
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?? '', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'JSON invalido.'
    ]);
    exit;
}

$message = isset($payload['message']) ? trim((string) $payload['message']) : '';
$history = $payload['history'] ?? [];

if ($message === '') {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'error' => 'El mensaje esta vacio.'
    ]);
    exit;
}

$messages = [[
    'role' => 'system',
    'content' => 'Eres un asistente comercial de Bethyra. Responde en espanol, directo y claro. Explica servicios de desarrollo web, WordPress, agentes autonomos, Stripe y procesos. No inventes precios exactos. Si falta contexto, sugiere usar formulario de contacto.'
]];

if (is_array($history)) {
    $tail = array_slice($history, -8);
    foreach ($tail as $item) {
        if (!is_array($item)) {
            continue;
        }

        $role = isset($item['role']) ? strtolower(trim((string) $item['role'])) : '';
        $content = isset($item['content']) ? trim((string) $item['content']) : '';

        if (!in_array($role, ['user', 'assistant'], true) || $content === '') {
            continue;
        }

        $messages[] = [
            'role' => $role,
            'content' => $content
        ];
    }
}

$messages[] = [
    'role' => 'user',
    'content' => $message
];

$requestBody = [
    'model' => $model,
    'messages' => $messages,
    'temperature' => 0.2,
    'max_tokens' => 450
];

$ch = curl_init('https://api.perplexity.ai/chat/completions');
if ($ch === false) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'No se pudo inicializar cURL.'
    ]);
    exit;
}

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($requestBody, JSON_UNESCAPED_UNICODE),
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ],
    CURLOPT_TIMEOUT => 30
]);

$responseRaw = curl_exec($ch);
$curlError = curl_error($ch);
$httpStatus = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($responseRaw === false) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'No se pudo conectar con Perplexity: ' . ($curlError !== '' ? $curlError : 'error desconocido')
    ]);
    exit;
}

$response = json_decode($responseRaw, true);
if (!is_array($response)) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'Respuesta invalida de Perplexity.'
    ]);
    exit;
}

if ($httpStatus < 200 || $httpStatus >= 300) {
    $errorMessage = $response['error']['message'] ?? 'Perplexity devolvio un error.';
    http_response_code($httpStatus >= 400 ? $httpStatus : 502);
    echo json_encode([
        'ok' => false,
        'error' => $errorMessage
    ]);
    exit;
}

$reply = trim((string) ($response['choices'][0]['message']['content'] ?? ''));
if ($reply === '') {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'Perplexity no devolvio contenido util.'
    ]);
    exit;
}

$usage = $response['usage'] ?? null;

echo json_encode([
    'ok' => true,
    'reply' => $reply,
    'model' => $model,
    'usage' => $usage
], JSON_UNESCAPED_UNICODE);
