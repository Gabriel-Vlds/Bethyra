<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$url  = trim($body['url'] ?? '');

if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL inválida. Asegúrate de incluir https://']);
    exit;
}

$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}

$apiKey = getenv('PAGESPEED_API_KEY');
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'API key no configurada en el servidor.']);
    exit;
}

$categories = ['performance', 'seo', 'accessibility', 'best-practices'];
$baseParams = http_build_query([
    'url' => $url,
    'key' => $apiKey,
], '', '&', PHP_QUERY_RFC3986);

$categoryParams = '';
foreach ($categories as $cat) {
    $categoryParams .= '&category=' . urlencode($cat);
}

$apiEndpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' . $baseParams . $categoryParams;

$ctx = stream_context_create([
    'http' => [
        'timeout' => 25,
        'ignore_errors' => true,
    ]
]);

$raw = @file_get_contents($apiEndpoint, false, $ctx);

if ($raw === false) {
    http_response_code(504);
    echo json_encode(['error' => 'No se pudo conectar con la API de Google. Intenta de nuevo.']);
    exit;
}

$data = json_decode($raw, true);

if (isset($data['error'])) {
    $code    = $data['error']['code'] ?? 500;
    $message = $data['error']['message'] ?? 'Error desconocido de la API.';
    http_response_code((int) $code >= 400 && (int) $code < 600 ? (int) $code : 500);
    echo json_encode(['error' => $message]);
    exit;
}

$cats   = $data['lighthouseResult']['categories'] ?? [];
$scores = [];

foreach ($categories as $cat) {
    $raw_score     = $cats[$cat]['score'] ?? null;
    $scores[$cat]  = $raw_score !== null ? (int) round($raw_score * 100) : null;
}

echo json_encode(['scores' => $scores]);
