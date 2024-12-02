// Función para activar/desactivar el menú
function toggleMenu() {
    const menu = document.querySelector('.menu'); // Selecciona el menú
    const hamburger = document.querySelector('.hamburger'); // Selecciona el ícono de hamburguesa

    menu.classList.toggle('active'); // Alterna la clase 'active' en el menú
    hamburger.classList.toggle('active'); // Alterna la clase 'active' en el ícono hamburguesa

    // Si quieres que el ícono de hamburguesa se transforme en "X" al hacer clic
    hamburger.innerHTML = hamburger.classList.contains('active') ? '&#10006;' : '&#9776;';
}
