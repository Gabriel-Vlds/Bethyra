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
        <div class="scene-image" aria-hidden="true"></div>
        <div class="scene-tint" aria-hidden="true"></div>
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
                <h2>Desarrollo a la medida</h2>
                <p>Landing Page, Tiendas E-coomerce, Plataformas de metricas, Streaming de cursos y la herramienta que necesites para no detener tu crecimiento.</p>
            </div>
            <div class="story-widget-slot">
                <div class="slot-card">
                    <span class="slot-title">Nuestro Enfoque</span>
                    <p>Porque sabemos que no todos necesitan lo mismo, nuestro enfoque es primero entender tus necesidades para luego crear las herramientas que necesitas y que se adapten a ti, no al reves.</p>
                </div>
            </div>
        </section>

        <section class="story-section section-right stage-full" data-aos="fade-up">
            <div class="story-widget-slot">
                <div class="slot-card">
                    <span class="slot-title">Blogs, Tiendas E-coomerce, Landing-Page y mas...</span>
                    <p>Wordpress es una gran base para crear tu pagina web e incluso tu tienda en linea, A pesar de que tiene limites tecnicos, es una gran primera opcion si lo que necesitas es una pagina o tienda en linea que cumpla un proposito sencillo y que tu puedas administrar.</p>
                </div>
            </div>
            <div class="story-copy">
                <span class="story-label">02 · WordPress</span>
                <h2>Sitios administrables con velocidad y control</h2>
                <p>Para los emprendedores que necesitan algo rapido, funcional y sencillo.</p>
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
                    <span class="slot-title">!No mas tareas repetitivas que nadie quiere hacer!.</span>
                    <p> Con tu nuevo agente envias una solicitud, el agente interpreta el objetivo, ejecuta tareas conectadas (CRM, correo, soporte o ventas) y devuelve resultados claros para que tu equipo se enfoque en decisiones de mayor y trabajo de mayor valor.</p>
                </div>
            </div>
        </section>

        <section class="story-section section-right stage-full" data-aos="fade-up">
            <div class="story-widget-slot">
                <div class="slot-card">
                    <span class="slot-title">La herramienta exacta para un trabajo bien hecho.</span>
                    <p>Ya sea que necesitas poner orden tus pedidos, una plataforma para dar cursos via streaming, o quizas una herramienta para tener y entender los datos precisos de tu negocio, tu nos das el problema y nosotros te damos la solucion. .</p>
                </div>
            </div>
            <div class="story-copy">
                <span class="story-label">04 · Desarrollo Full Stack</span>
                <h2>Para quien necesita una herramienta en serio y a la medida.</h2>
                <p>El crecimiento es inevitable, las ordenes se acumulan, hay nuevas necesidades y retos...Ahi es cuando una herramienta como esta sobresale.</p>
            </div>
        </section>
    </main>

</body>