function verificarAcceso() {
    const edad = parseInt(document.getElementById("age").value);
    const vipYes = document.getElementById("vip-yes").checked;
    const vipNo = document.getElementById("vip-no").checked;

    // Validar entrada de edad
    if (isNaN(edad) || edad === "") {
        alert("Por favor, ingresa una edad válida.");
        console.log("Edad no válida ingresada.");
        return;
    }

    // Validar edad y membresía
    if (edad >= 18) {
        if (vipYes) {
            console.log("Acceso permitido. Usuario mayor de edad y miembro VIP.");
            mostrarPopupLlaveSantuario(); // Mostrar el segundo popup para la llave de santuario
        } else if (vipNo) {
            console.log("Acceso denegado. Usuario mayor de edad pero no es miembro VIP.");
            mostrarPopup("Debes estar asociado a nuestro santuario para poder ingresar. Por favor, contactanos.");
        } else {
            console.log("Acceso denegado. Usuario mayor de edad sin respuesta clara sobre la membresía.");
            alert("Por favor, selecciona si eres miembro VIP.");
        }
    } else {
        if (vipNo) {
            console.log("Acceso denegado. Usuario menor de edad y no es miembro VIP.");
            mostrarPopup("Para asociarte al santuario, contactanos.");
        } else if (vipYes) {
            console.log("Acceso denegado. Usuario menor de edad pero es miembro VIP.");
            alert("Debes ser mayor de 18 años y ser miembro asociado para poder ingresar.");
        } else {
            console.log("Acceso denegado. Usuario menor de edad y sin respuesta clara sobre la membresía.");
            alert("Debes ser mayor de 18 años y ser miembro asociado para poder ingresar.");
        }
    }
}

// Mostrar el popup de la llave de santuario
function mostrarPopupLlaveSantuario() {
    // Crear el overlay para el segundo popup
    const overlay = document.createElement("div");
    overlay.className = "overlay"; // Asegura que esté encima del contenido
    document.body.appendChild(overlay); // Añadir overlay al cuerpo

    // Crear el popup para ingresar la llave
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
        <p>Ingrese su llave de santuario*</p>
        <input type="text" id="codigo-santuario" placeholder="Ingrese la llave" />
        <button id="btn-verificar-codigo">Verificar</button>
        <p>*La misma fue otorgada en los comentarios de la entrega de Talento Tech.</p>
    `;
    overlay.appendChild(popup); // Añadir el popup al overlay

    // Botón de verificación del código
    document.getElementById("btn-verificar-codigo").addEventListener("click", function () {
        const codigoIngresado = document.getElementById("codigo-santuario").value;

        // Validar el código ingresado
        if (codigoIngresado === "FRONTENDJS" || codigoIngresado === "mauro") {
            console.log("Código correcto. Acceso permitido.");

            // Cerrar ambos popups
            document.querySelectorAll(".overlay").forEach(function (overlay) {
                overlay.style.display = "none";
            });

            // Mostrar la página de acceso (ya visible después de cerrar los popups)
            document.querySelector(".page-content").style.display = "block"; // Asegúrate de que el contenido de la página sea visible

        } else {
            console.log("Código incorrecto.");
            alert("Código incorrecto. Intenta de nuevo.");
        }
    });
}

// Mostrar Popup para todas las condiciones de error
function mostrarPopup(mensaje) {
    const overlay = document.createElement("div");
    overlay.className = "overlay"; // Asegura que esté encima del contenido
    document.body.appendChild(overlay); // Añadir overlay al cuerpo

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
        <p>${mensaje}</p>
        <button id="btn-contacto">Ir a Contacto</button>
    `;
    overlay.appendChild(popup); // Añadir el popup al overlay

    document.getElementById("btn-contacto").addEventListener("click", function () {
        window.location.href = "contacto.html"; // Cambia a la URL de contacto correcta
    });
}
