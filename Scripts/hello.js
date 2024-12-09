document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
  
    // popup
    const popupHTML = `
      <div id="popup" class="popup-container">
        <div class="popup-content">
          <h2>¡HOLA!</h2>
          <p>
            Sabemos que te gustan los animales tanto como a nosotros. Así que asumimos que no solo estás aquí para mirarlos. 
            Te recomendamos visitar nuestra tienda.
          </p>
          <p>
            Con tus compras, ayudas a los animales del santuario a seguir generando visitas monetizadas en internet!
          </p>
          <div class="popup-buttons">
            <a href="./Pages/productos.html" class="popup-button">
            <img src="../Assets/images/cart.svg" alt="carrito" class="cart">
            ¡Vamos a la tienda!
            </a>
            <button id="closePopup" class="popup-button secondary">Nah, seguir aquí.</button>
          </div>
        </div>
      </div>
    `;
  
    // Insertar el popup en el body
    body.insertAdjacentHTML("beforeend", popupHTML);
  
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
  
    // Mostrar el popup al cargar la página
    setTimeout(() => {
      popup.classList.add("active");
    }, 3000); // 500ms de delay para aparecer
  
    // Cerrar el popup al hacer clic en "No"
    closePopup.addEventListener("click", () => {
      popup.classList.remove("active");
    });
  });
  