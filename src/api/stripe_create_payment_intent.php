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

$stripeSecretKey = trim((string) getenv('STRIPE_SECRET_KEY'));

if ($stripeSecretKey === '') {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Configura STRIPE_SECRET_KEY en .env para crear pagos de prueba.'
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

$amount = isset($payload['amount']) ? (int) $payload['amount'] : 0;
$currency = isset($payload['currency']) ? strtolower(trim((string) $payload['currency'])) : 'mxn';
$name = isset($payload['name']) ? trim((string) $payload['name']) : '';
$email = isset($payload['email']) ? trim((string) $payload['email']) : '';

if ($amount < 1) {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'error' => 'Monto invalido.'
    ]);
    exit;
}

if ($currency === '') {
    $currency = 'mxn';
}

if ($name === '' || strlen($name) < 2) {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'error' => 'Nombre invalido.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'error' => 'Correo electronico invalido.'
    ]);
    exit;
}

$postFields = [
    'amount' => (string) ($amount * 100),
    'currency' => $currency,
    'description' => 'Demo de pago de prueba - Bethyra',
    'automatic_payment_methods[enabled]' => 'true',
    'metadata[source]' => 'bethyra_demos',
    'metadata[customer_name]' => $name,
    'metadata[customer_email]' => $email
];

$ch = curl_init('https://api.stripe.com/v1/payment_intents');
if ($ch === false) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'No se pudo inicializar cURL para Stripe.'
    ]);
    exit;
}

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($postFields),
    CURLOPT_USERPWD => $stripeSecretKey . ':',
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded'
    ],
    CURLOPT_TIMEOUT => 20
]);

$responseRaw = curl_exec($ch);
$curlError = curl_error($ch);
$httpStatus = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($responseRaw === false) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'No se pudo conectar con Stripe: ' . ($curlError !== '' ? $curlError : 'error desconocido')
    ]);
    exit;
}

$response = json_decode($responseRaw, true);
if (!is_array($response)) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'Respuesta invalida de Stripe.'
    ]);
    exit;
}

if ($httpStatus < 200 || $httpStatus >= 300) {
    $stripeMessage = $response['error']['message'] ?? 'Stripe rechazo la solicitud.';
    http_response_code($httpStatus >= 400 ? $httpStatus : 502);
    echo json_encode([
        'ok' => false,
        'error' => $stripeMessage
    ]);
    exit;
}

$clientSecret = isset($response['client_secret']) ? (string) $response['client_secret'] : '';
$intentId = isset($response['id']) ? (string) $response['id'] : '';

if ($clientSecret === '') {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'Stripe no devolvio client_secret.'
    ]);
    exit;
}

echo json_encode([
    'ok' => true,
    'clientSecret' => $clientSecret,
    'paymentIntentId' => $intentId
]);
