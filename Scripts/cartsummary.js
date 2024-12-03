document.addEventListener("DOMContentLoaded", () => {
    const cart = []; // Lista global para almacenar los productos añadidos al carrito

    // Escuchar el evento "Añadir al carrito" desde el botón existente
    document.body.addEventListener("click", (event) => {
        if (event.target && event.target.classList.contains("buy-now")) {
            const popup = event.target.closest(".popup");
            const title = popup.querySelector("h2")?.textContent || "Producto sin nombre";
            const quantity = parseInt(popup.querySelector("#quantity")?.textContent || 1, 10);
            const basePrice = parseFloat(popup.querySelector(".price-table p:first-child").textContent.replace(/\$/, "").replace(/,/g, "")) || 0;
            const discountedPrice = parseFloat(popup.querySelector("#subtotal").textContent.replace(/\$/, "").replace(/,/g, "")) || basePrice;
            const priceWithVAT = parseFloat(popup.querySelector("#total").textContent.replace(/\$/, "").replace(/,/g, "")) || discountedPrice * 1.21;
            const discount = basePrice - discountedPrice;
            const imageSrc = popup.querySelector(".slider img")?.src || "";

            // Buscar si el producto ya está en el carrito
            const existingProduct = cart.find(item => item.title === title);
            if (existingProduct) {
                existingProduct.quantity += quantity;
                existingProduct.basePrice += basePrice * quantity;
                existingProduct.discountedPrice += discountedPrice * quantity;
                existingProduct.priceWithVAT += priceWithVAT * quantity;
                existingProduct.totalDiscount += discount * quantity;
            } else {
                cart.push({ 
                    title, 
                    quantity, 
                    basePrice: basePrice * quantity, 
                    discountedPrice: discountedPrice * quantity, 
                    priceWithVAT: priceWithVAT * quantity, 
                    totalDiscount: discount * quantity,
                    imageSrc 
                });
            }
        }
    });

    // Generar el resumen del carrito al hacer clic en el ícono
    document.querySelector(".cart").addEventListener("click", (event) => {
        event.preventDefault();
        renderCartPopup();
    });

    // Función para renderizar el popup del carrito
    function renderCartPopup() {
        const cartPopup = document.createElement("div");
        cartPopup.classList.add("cart-popup");

        const cartContent = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.imageSrc}" alt="${item.title}" class="cart-thumbnail">
                <div class="cart-details">
                    <p><strong>${item.title}</strong></p>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <div class="cart-price">
                    <p>Precio inicial: $${(item.basePrice / item.quantity).toLocaleString()}</p>
                    <p>Descuento aplicado: -$${(item.totalDiscount / item.quantity).toLocaleString()}</p>
                    <p>IVA (21%): $${((item.priceWithVAT / item.quantity) - (item.discountedPrice / item.quantity)).toLocaleString()}</p>
                    <p>Precio final: $${(item.priceWithVAT / item.quantity).toLocaleString()}</p>
                </div>
                <button class="remove-item" data-index="${index}">-</button>
            </div>
            <hr>
        `).join("");

        const totalInitialPrice = cart.reduce((sum, item) => sum + item.basePrice, 0);
        const totalDiscount = cart.reduce((sum, item) => sum + item.totalDiscount, 0);
        const totalVAT = cart.reduce((sum, item) => sum + (item.priceWithVAT - item.discountedPrice), 0);
        const totalFinalPrice = cart.reduce((sum, item) => sum + item.priceWithVAT, 0);

        cartPopup.innerHTML = `
            <div class="cart-popup-content">
                <button class="close-cart-popup">&times;</button>
                ${cartContent || "<p>El carrito está vacío, comprá algo.</p>"}
                <div class="cart-summary">
                    <p><strong>Total precio inicial:</strong> $${totalInitialPrice.toLocaleString()}</p>
                    <p><strong>Total descuento:</strong> -$${totalDiscount.toLocaleString()}</p>
                    <p><strong>Total IVA:</strong> $${totalVAT.toLocaleString()}</p>
                    <p><strong>PRECIO FINAL:</strong> $${totalFinalPrice.toLocaleString()}</p>
                    <button class="checkout-button">Ir a Pagar</button>
                </div>
            </div>
        `;

        document.body.appendChild(cartPopup);

        // Cerrar el popup
        cartPopup.querySelector(".close-cart-popup").addEventListener("click", () => {
            cartPopup.remove();
        });

        // Vaciar carrito al comprar
        cartPopup.querySelector(".checkout-button")?.addEventListener("click", () => {
            alert("Muy pronto habilitaremos la seccion de pagos.");
            cart.length = 0;
            cartPopup.remove();
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
