<!Doctype html>
<html lang="es">
<head>
    <meta charset ="UTF-8">
    <meta name= "viewport" content="width=device-width, initial-scale=1.0">
    <title>Bethyra — Desarrollo Web y Agentes IA</title>
    <link rel ="stylesheet" href="public/assets/css/styles.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>

<body>
    <div class="scene-background" aria-hidden="true">
        <svg class="scene-layer scene-sky" viewBox="0 0 1440 900" preserveAspectRatio="none">
            <defs>
                <linearGradient id="skyGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#050816"/>
                    <stop offset="100%" stop-color="#03040a"/>
                </linearGradient>
                <radialGradient id="cloudGlow" cx="50%" cy="45%" r="55%">
                    <stop offset="0%" stop-color="#00fff7" stop-opacity="0.22"/>
                    <stop offset="55%" stop-color="#ff00d0" stop-opacity="0.08"/>
                    <stop offset="100%" stop-color="#050816" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect width="1440" height="900" fill="url(#skyGlow)"/>
            <ellipse cx="1020" cy="210" rx="250" ry="100" fill="url(#cloudGlow)"/>
            <ellipse cx="360" cy="170" rx="190" ry="78" fill="url(#cloudGlow)"/>
            <ellipse cx="700" cy="300" rx="160" ry="62" fill="url(#cloudGlow)"/>
        </svg>

        <svg class="scene-layer scene-mountains scene-mountains-far" viewBox="0 0 1440 900" preserveAspectRatio="none">
            <path d="M0 610L130 548L240 582L370 505L510 558L650 470L790 540L935 455L1080 515L1240 438L1440 520L1440 900L0 900Z" fill="#0b1120"/>
            <path d="M0 610L130 548L240 582L370 505L510 558L650 470L790 540L935 455L1080 515L1240 438L1440 520" fill="none" stroke="#1a2a4b" stroke-width="2" opacity="0.7"/>
        </svg>

        <svg class="scene-layer scene-mountains scene-mountains-near" viewBox="0 0 1440 900" preserveAspectRatio="none">
            <path d="M0 720L160 642L280 690L410 600L560 676L705 560L860 650L1000 560L1160 640L1300 590L1440 650L1440 900L0 900Z" fill="#070c17"/>
            <path d="M0 720L160 642L280 690L410 600L560 676L705 560L860 650L1000 560L1160 640L1300 590L1440 650" fill="none" stroke="#233b67" stroke-width="2.5" opacity="0.9"/>
        </svg>

        <div class="scene-cloud cloud-one"></div>
        <div class="scene-cloud cloud-two"></div>
        <div class="scene-cloud cloud-three"></div>
        <div class="scene-spark-layer" aria-hidden="true"></div>
    </div>

    <header>
        <nav class="menu_principal">
            <ul>
                <li class="menu_item"><a href="">Inicio</a></li>
                <li class= "menu_item"><a href="">Servicios</a></li>
                <li class= "menu_item"><a href="">Contacto</a></li>
            </ul>
        </nav>

    </header>

    <!--Scripts-->
    <script src="public/assets/js/app.js"></script>
    <!--Typed.js-->
    <script src="https://unpkg.com/typed.js@3.0.0/dist/typed.umd.js"></script>
    <!--AOS-->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init();
    </script>


    <main class="story">
        <section class="hero-stage stage-full">
            <div class="hero-copy">
                <div class="hero-kicker">Bethyra · Web + IA</div>
                <h2 id="hero-titulo"></h2>
                <p id="hero-text"></p>
                <div class="hero-actions hidden" id="hero-actions">
                    <a href="#que-podemos-hacer-por-ti-section" id="scroll-to-services-button" class="scroll-down-btn" aria-label="Bajar a la siguiente sección">
                        <span class="chevron"></span>
                    </a>
                </div>
            </div>
        </section>

        <section id="que-podemos-hacer-por-ti-section" class="story-section section-left stage-full" data-aos="fade-up">
            <div class="story-copy">
                <span class="story-label">01 · Desarrollo Web</span>
                <h2>Desarrollo full stack con foco en conversión</h2>
                <p>Construimos productos web desde cero o sobre WordPress, con diseño rápido, escalable y listo para vender, automatizar y medir.</p>
            </div>
            <div class="story-widget-slot">
                <div class="slot-card">
                    <span class="slot-title">Widget de apoyo visual</span>
                    <p>Espacio reservado para una demo de checkout, analytics o panel de producto.</p>
                </div>
            </div>
        </section>

        <section class="story-section section-right stage-full" data-aos="fade-up">
            <div class="story-widget-slot">
                <div class="slot-card">
                    <span class="slot-title">Widget de apoyo visual</span>
                    <p>Espacio reservado para simulación de etiquetas, inventario o automatizaciones.</p>
                </div>
            </div>
            <div class="story-copy">
                <span class="story-label">02 · WordPress</span>
                <h2>Sitios administrables con velocidad y control</h2>
                <p>Si ya dominas WordPress, Bethyra lo convierte en una ventaja: landings, corporativos y tiendas con estructura limpia y soporte técnico real.</p>
            </div>
        </section>

        <section class="story-section section-left stage-full" data-aos="fade-up">
            <div class="story-copy">
                <span class="story-label">03 · Agentes Autónomos</span>
                <h2>Agentes con Open Claw para tareas reales</h2>
                <p>Diseñamos agentes que razonan, ejecutan flujos y se conectan a herramientas externas para atención, ventas, soporte interno y automatización.</p>
            </div>
            <div class="story-widget-slot">
                <div class="slot-card">
                    <span class="slot-title">Widget de apoyo visual</span>
                    <p>Espacio para un flujo de conversación, orquestación de tareas o agente demo.</p>
                </div>
            </div>
        </section>

        <section class="widgets-shell stage-full" data-aos="fade-up">
            <div class="widgets-header">
                <span class="story-label">Widgets</span>
                <h2>Espacio reservado para demos interactivas</h2>
                <p>Este bloque queda maquetado para insertar más adelante pasarela de pago, etiquetas de envío, analytics y otros widgets de soporte visual.</p>
            </div>
            <div class="widgets-grid widgets-grid-placeholder">
                <article class="widget-card placeholder-card"><h3>Pasarela de pago</h3><p>Reservado</p></article>
                <article class="widget-card placeholder-card"><h3>Etiquetas de envío</h3><p>Reservado</p></article>
                <article class="widget-card placeholder-card"><h3>Analytics</h3><p>Reservado</p></article>
                <article class="widget-card audit-card" id="audit-widget">
                    <h3 class="audit-title">Auditoría rápida de sitio web</h3>
                    <p class="audit-desc">Pega cualquier URL y obtén sus métricas reales de velocidad, SEO, accesibilidad y buenas prácticas.</p>
                    <div class="audit-form" id="audit-form">
                        <input
                            type="url"
                            id="audit-url"
                            class="audit-input"
                            placeholder="https://ejemplo.com"
                            autocomplete="off"
                            spellcheck="false"
                        />
                        <button class="btn btn-primary audit-btn" id="audit-btn" type="button">Analizar</button>
                    </div>
                    <div class="audit-loading hidden" id="audit-loading" aria-live="polite">
                        <span class="audit-pulse"></span>
                        <span class="audit-loading-text">Analizando<span class="audit-dots"></span></span>
                    </div>
                    <div class="audit-error hidden" id="audit-error" role="alert"></div>
                    <div class="audit-results hidden" id="audit-results">
                        <div class="audit-score-grid">
                            <div class="audit-score-item" id="score-performance">
                                <span class="audit-score-value">—</span>
                                <span class="audit-score-label">Performance</span>
                            </div>
                            <div class="audit-score-item" id="score-seo">
                                <span class="audit-score-value">—</span>
                                <span class="audit-score-label">SEO</span>
                            </div>
                            <div class="audit-score-item" id="score-accessibility">
                                <span class="audit-score-value">—</span>
                                <span class="audit-score-label">Accesibilidad</span>
                            </div>
                            <div class="audit-score-item" id="score-best-practices">
                                <span class="audit-score-value">—</span>
                                <span class="audit-score-label">Buenas Prácticas</span>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </section>

        <section class="story-section section-right stage-full" data-aos="fade-up">
            <div class="story-widget-slot">
                <div class="slot-card">
                    <span class="slot-title">Widget de apoyo visual</span>
                    <p>Espacio reservado para progreso, pipeline y métricas del proyecto.</p>
                </div>
            </div>
            <div class="story-copy">
                <span class="story-label">04 · Proceso</span>
                <h2>La experiencia avanza por secciones, no por bloques sueltos</h2>
                <p>Cada panel ocupa casi toda la pantalla y se siente como una secuencia. El texto guía la lectura y el widget acompaña como evidencia visual.</p>
            </div>
        </section>
    </main>

</body>