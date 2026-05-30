// app.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("App.js conectado correctamente");
});

document.addEventListener("DOMContentLoaded", () => {
    new Typed("#hero-text", {
        strings: [
            "En Bethyra adaptamos la tecnologia a tus necesidades y presupuesto, siempre pensando en que las herramientas se adapten a ti y a tus necesidades."
        ],
        typeSpeed: 20,
        backSpeed: 25,
        loop: false
    });
});