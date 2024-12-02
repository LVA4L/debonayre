document.addEventListener("DOMContentLoaded", () => {
    const products = document.querySelectorAll(".product");
    const IVA_RATE = 0.21;

    products.forEach((product) => {
        const priceElement = product.querySelector(".buy p");
        const discountElement = product.querySelector(".buy p.discount");
        const button = product.querySelector(".buy a");

        if (priceElement) {
            // Extraer el precio inicial
            let rawPriceText = priceElement.textContent.match(/\$([\d.]+)/);
            if (rawPriceText) {
                let basePrice = parseFloat(rawPriceText[1].replace(/\./g, '')); // Eliminar puntos y convertir a número
                let discountedPrice = basePrice;
                let ivaAmount;
                let finalPrice;

                if (discountElement) {
                    let discountMatch = discountElement.textContent.match(/(\d+)% off/);
                    if (discountMatch) {
                        let discountRate = parseFloat(discountMatch[1]) / 100;
                        discountedPrice = basePrice * (1 - discountRate);
                    }
                }

                // Calcular IVA y precio final
                ivaAmount = discountedPrice * IVA_RATE;
                finalPrice = discountedPrice + ivaAmount;

                // Mostrar en consola el detalle de precios
                if (discountElement) {
                    const discountAmount = basePrice - discountedPrice;
                    console.log(`Producto con descuento:
                        Precio inicial: $${basePrice.toLocaleString()}
                        Descuento: -$${discountAmount.toLocaleString()}
                        IVA (21%): $${ivaAmount.toLocaleString()}
                        Total: $${finalPrice.toLocaleString()}`);
                } else {
                    console.log(`Producto sin descuento:
                        Precio inicial: $${basePrice.toLocaleString()}
                        IVA (21%): $${ivaAmount.toLocaleString()}
                        Total: $${finalPrice.toLocaleString()}`);
                }

                // Agregar funcionalidad al botón "Ver Más"
                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    showPopup(product, basePrice, discountedPrice, ivaAmount, finalPrice);
                });
            }
        }
    });

    function showPopup(product, basePrice, discountedPrice, ivaAmount, finalPrice) {
        // Crear el popup
        const popup = document.createElement("div");
        popup.classList.add("popup");

        // Extraer información del producto
        const title = product.querySelector("h3").textContent;
        const description = product.querySelector("p").textContent;
        const imageSrc = product.querySelector("img").src;
        const hasDiscount = discountedPrice !== basePrice;

        // Estado inicial de cantidad
        let quantity = 1;

        // Función para actualizar la planilla de precios
        const updatePriceTable = () => {
            const subtotal = discountedPrice * quantity;
            const totalIVA = subtotal * IVA_RATE;
            const totalFinal = subtotal + totalIVA;

            popup.querySelector("#subtotal").textContent = `$${subtotal.toLocaleString()}`;
            popup.querySelector("#iva").textContent = `$${totalIVA.toLocaleString()}`;
            popup.querySelector("#total").textContent = `$${totalFinal.toLocaleString()}`;
            popup.querySelector("#final-price").textContent = `$${totalFinal.toLocaleString()}`;
        };

        // Estructura del popup
        popup.innerHTML = `
            <div class="popup-content">
                <button class="close-popup">&times;</button>
                <div class="slider">
                    <img src="${imageSrc}" alt="${title}" />
                </div>
                <h2>${title}</h2>
                <p>${description}</p>
                <div class="price-table">
                    <p>Precio Inicial: $${basePrice.toLocaleString()}</p>
                    ${hasDiscount ? `<p>Descuento: -$${(basePrice - discountedPrice).toLocaleString()}</p>` : ''}
                    <p>Subtotal: <span id="subtotal">$${discountedPrice.toLocaleString()}</span></p>
                    <p>IVA (21%): <span id="iva">$${ivaAmount.toLocaleString()}</span></p>
                    <p><strong>TOTAL: <span id="total">$${finalPrice.toLocaleString()}</span></strong></p>
                </div>
                <div class="quantity">
                    <button id="decrease">-</button>
                    <span id="quantity">1</span>
                    <button id="increase">+</button>
                </div>
                <p>Precio Total: $<span id="final-price">${finalPrice.toLocaleString()}</span></p>
                <button class="buy-now">Comprar</button>
            </div>
        `;

        // Añadir funcionalidad a los botones
        document.body.appendChild(popup);
        const closeButton = popup.querySelector(".close-popup");
        const increaseButton = popup.querySelector("#increase");
        const decreaseButton = popup.querySelector("#decrease");
        const quantityDisplay = popup.querySelector("#quantity");

        increaseButton.addEventListener("click", () => {
            quantity++;
            quantityDisplay.textContent = quantity;
            updatePriceTable();
        });

        decreaseButton.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantityDisplay.textContent = quantity;
                updatePriceTable();
            }
        });

        closeButton.addEventListener("click", () => {
            popup.remove();
        });
    }
});
