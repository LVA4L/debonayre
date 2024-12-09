document.addEventListener("DOMContentLoaded", () => {
    const cart = []; // Lista global para almacenar los productos añadidos al carrito

    // "Añadir al carrito" desde el botón existente
    document.body.addEventListener("click", (event) => {
        if (event.target && event.target.classList.contains("buy-now")) {
            const popup = event.target.closest(".popup");
            const title = popup.querySelector("h2")?.textContent || "Producto sin nombre";
            const basePrice = parseFloat(popup.querySelector(".price-table p:first-child").textContent.replace(/\$/, "").replace(/,/g, "")) || 0;
            const discountedPrice = parseFloat(popup.querySelector("#subtotal").textContent.replace(/\$/, "").replace(/,/g, "")) || basePrice;
            const priceWithVAT = parseFloat(popup.querySelector("#total").textContent.replace(/\$/, "").replace(/,/g, "")) || discountedPrice * 1.21;
            const discount = basePrice - discountedPrice;
            const imageSrc = popup.querySelector(".slider img")?.src || "";
            const quantity = parseInt(popup.querySelector("#quantity").textContent, 10) || 1; // Tomar la cantidad seleccionada

            //  si el producto ya existe en el carrito
            const existingProduct = cart.find((item) => item.title === title);

            if (existingProduct) {
                // incrementar la cantidad si ya tenemos un producto en el carrito.
                existingProduct.quantity += quantity;
            } else {
                // Si el producto no está en el carrito, añadirlo
                cart.push({
                    title,
                    basePrice,
                    discountedPrice,
                    priceWithVAT,
                    discount,
                    imageSrc,
                    quantity,
                });
            }
        }
    });

    // Sumario del carrito al hacer clic en el ícono
    document.querySelector(".cart").addEventListener("click", (event) => {
        event.preventDefault();
        renderCartPopup();
    });

    // popup del carrito
    function renderCartPopup() {
        const cartPopup = document.createElement("div");
        cartPopup.classList.add("cart-popup");

        // contenido carrito
        const cartContent = cart.map((item, index) => 
            `<div class="cart-item">
                <img src="${item.imageSrc}" alt="${item.title}" class="cart-thumbnail">
                <div class="cart-details">
                    <p><strong>${item.title}</strong></p>
                    <p>Cantidad: ${item.quantity}</p> <!-- Mostrar la cantidad -->
                </div>
                <div class="cart-price">
                    <p>Precio inicial: $${item.basePrice.toLocaleString()}</p>
                    <p>Descuento: -$${item.discount.toLocaleString()}</p>
                    <p>IVA (21%): $${(item.priceWithVAT - item.discountedPrice).toLocaleString()}</p>
                    <p>Precio final: $${item.priceWithVAT.toLocaleString()}</p>
                </div>
                <button class="remove-item" data-index="${index}">Quitar</button>
            </div>
            <hr>`
        ).join("");

        // Calculo de totales sin considerar cantidades por unidad (eso ya esta calculado)
        const totalInitialPrice = cart.reduce((sum, item) => sum + item.basePrice, 0);
        const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
        const totalVAT = cart.reduce((sum, item) => sum + (item.priceWithVAT - item.discountedPrice), 0);
        const totalFinalPrice = cart.reduce((sum, item) => sum + item.priceWithVAT, 0);

        // Agregar contenido 
        cartPopup.innerHTML = `
            <div class="cart-popup-content">
                <button class="close-cart-popup">&times;</button>
                ${cartContent || "<p>El carrito está vacío, comprá algo.</p>"}
                <div class="cart-summary">
                    <p><strong>Total precio inicial:</strong> $${totalInitialPrice.toLocaleString()}</p>
                    <p><strong>Total descuento:</strong> -$${totalDiscount.toLocaleString()}</p>
                    <p><strong>Total IVA:</strong> $${totalVAT.toLocaleString()}</p>
                    <p><strong>PRECIO FINAL:</strong> $${totalFinalPrice.toLocaleString()}</p>
                    <button class="checkout-button">Proceder al pago</button>
                </div>
            </div>
        `;

        document.body.appendChild(cartPopup);

        // Cerrar popup
        cartPopup.querySelector(".close-cart-popup").addEventListener("click", () => {
            cartPopup.remove();
        });

        // Manejo del botón "Proceder al pago"
        cartPopup.querySelector(".checkout-button").addEventListener("click", () => {
            alert("Muy pronto habilitaremos la sección de pagos.");
        });

        // Eliminar productos individualmente
        cartPopup.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (event) => {
                const index = parseInt(event.target.getAttribute("data-index"), 10);
                if (!isNaN(index)) {
                    cart.splice(index, 1);
                    cartPopup.remove();
                    renderCartPopup();
                }
            });
        });
    }
});
