<?php
declare(strict_types=1);
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
			<p>Pruebas en vivo para mostrar integraciones reales: graficas interactivas con amCharts y un chatbot de asistencia.</p>
		</div>

		<section class="demo-sections">
			<article class="demo-section" id="chart-demo">
				<h2>Grafica funcional con amCharts</h2>
				<p>Agrega tus propios datos para ver la grafica actualizarse en tiempo real.</p>

				<div class="chart-layout">
					<div class="chart-controls">
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

						<ul id="chart-data-list" class="chart-data-list"></ul>
					</div>

					<div class="chart-visual">
						<div id="chart-surface"></div>
					</div>
				</div>
			</article>

			<article class="demo-section" id="chatbot-demo">
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

	<script src="public/assets/js/app.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/index.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
	<script src="public/assets/js/demos.js"></script>
</body>
</html>