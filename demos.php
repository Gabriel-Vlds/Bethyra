<?php
declare(strict_types=1);

$envPath = __DIR__ . '/.env';
$envVars = [];

if (is_file($envPath)) {
	$lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	if ($lines !== false) {
		foreach ($lines as $line) {
			$trimmed = trim($line);
			if ($trimmed === '' || str_starts_with($trimmed, '#') || !str_contains($trimmed, '=')) {
				continue;
			}

			[$key, $value] = explode('=', $trimmed, 2);
			$envVars[trim($key)] = trim($value);
		}
	}
}

$stripePublishableKey = $envVars['STRIPE_PUBLISHABLE_KEY'] ?? '';
?>
<!doctype html>
<html lang="es">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Demos Funcionales | Bethyra</title>
	<link rel="stylesheet" href="public/assets/css/styles.css" />
	<link rel="stylesheet" href="public/assets/css/demos.css" />
</head>
<body>
	<div class="scene-background" aria-hidden="true">
		<div class="scene-image" aria-hidden="true"></div>
		<div class="scene-tint" aria-hidden="true"></div>
		<div class="scene-spark-layer" aria-hidden="true"></div>
	</div>

	<header>
		<nav class="menu_principal">
			<ul>
				<li class="menu_item"><a href="index.php">Inicio</a></li>
				<li class="menu_item"><a href="demos.php">Demos</a></li>
				<li class="menu_item"><a href="index.php#contacto-section">Contacto</a></li>
			</ul>
		</nav>
	</header>

	<main class="demo-shell">
		<div class="demo-hero">
			<p class="demo-kicker">Bethyra Lab</p>
			<h1>Demos Funcionales</h1>
			<p>Pruebas en vivo para mostrar integraciones reales: Stripe, graficas interactivas con amCharts y un chatbot de asistencia.</p>
		</div>

		<section class="demo-grid">
			<article class="demo-card" id="stripe-demo">
				<h2>Pasarela de pago con Stripe</h2>
				<p>Demo de pago en modo prueba: crea un Payment Intent y confirma el cobro con tarjeta de testing.</p>

				<form id="stripe-demo-form" class="demo-form" novalidate>
					<label>
						<span>Nombre del cliente</span>
						<input type="text" id="stripe-name" placeholder="Ana Rivera" required />
					</label>

					<label>
						<span>Correo del cliente</span>
						<input type="email" id="stripe-email" placeholder="ana@correo.com" required />
					</label>

					<label>
						<span>Monto de referencia (MXN)</span>
						<input type="number" id="stripe-amount" min="1" step="1" value="499" required />
					</label>

					<div class="stripe-card-element-wrap">
						<span>Tarjeta de prueba</span>
						<div id="stripe-card-element"></div>
						<small>Usa 4242 4242 4242 4242, fecha futura y CVC cualquiera.</small>
					</div>

					<button type="submit" class="demo-btn">Pagar en modo prueba</button>
				</form>

				<div id="stripe-status" class="demo-status" aria-live="polite"></div>
				<pre id="stripe-response" class="demo-code hidden"></pre>
			</article>

			<article class="demo-card" id="chart-demo">
				<h2>Grafica funcional con amCharts</h2>
				<p>Agrega tus propios datos para ver la grafica actualizarse en tiempo real.</p>

				<form id="chart-data-form" class="demo-form" novalidate>
					<label>
						<span>Categoria</span>
						<input type="text" id="chart-label" placeholder="Semana 1" required />
					</label>

					<label>
						<span>Valor</span>
						<input type="number" id="chart-value" placeholder="120" step="1" required />
					</label>

					<div class="chart-actions">
						<button type="submit" class="demo-btn">Agregar dato</button>
						<button type="button" id="chart-clear" class="demo-btn ghost">Limpiar datos</button>
					</div>
				</form>

				<div id="chart-surface"></div>
				<ul id="chart-data-list" class="chart-data-list"></ul>
			</article>

			<article class="demo-card" id="chatbot-demo">
				<h2>Chatbot de demostracion</h2>
				<p>Asistente basico para resolver preguntas de servicios, precios y tiempos.</p>

				<div class="chatbot-window" id="chatbot-window" aria-live="polite"></div>

				<div class="chatbot-quick-actions">
					<button type="button" class="chip" data-chat-message="Que servicios ofrecen?">Servicios</button>
					<button type="button" class="chip" data-chat-message="Como trabajan proyectos web?">Proceso</button>
					<button type="button" class="chip" data-chat-message="Cuales son los precios?">Precios</button>
				</div>

				<form id="chatbot-form" class="chatbot-form" novalidate>
					<input type="text" id="chatbot-input" placeholder="Escribe tu pregunta..." required />
					<button type="submit" class="demo-btn">Enviar</button>
				</form>
			</article>
		</section>
	</main>

	<script>
		window.DEMO_CONFIG = {
			stripePublishableKey: <?= json_encode($stripePublishableKey, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>
		};
	</script>
	<script src="public/assets/js/app.js"></script>
	<script src="https://js.stripe.com/v3/"></script>
	<script src="https://cdn.amcharts.com/lib/5/index.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
	<script src="public/assets/js/demos.js"></script>
</body>
</html>