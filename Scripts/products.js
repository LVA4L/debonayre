document.addEventListener("DOMContentLoaded", () => {
    const products = document.querySelectorAll(".product");
    const IVA_RATE = 0.21;

    const discountedProducts = []; // Lista para productos con descuento
    const nonDiscountedProducts = []; // Lista para productos sin descuento

    products.forEach((product) => {
        const priceElement = product.querySelector(".buy p");
        const discountElement = product.querySelector(".discount p.discountprice");
        const button = product.querySelector(".buy a");

        // Mostrar el nombre del producto en la consola
        const productName = product.querySelector("h3")?.textContent || "Nombre no encontrado";

        if (priceElement) {
            // Extraer el precio inicial
            let rawPriceText = priceElement.textContent.match(/\$([\d.]+)/);
            if (rawPriceText) {
                let basePrice = parseFloat(rawPriceText[1].replace(/\./g, ''));
                let discountedPrice = basePrice;
                let ivaAmount;
                let finalPrice;

                if (discountElement) {
                    let discountMatch = discountElement.textContent.match(/(\d+)%\s?OFF/i);
                    if (discountMatch) {
                        let discountRate = parseFloat(discountMatch[1]) / 100;
                        discountedPrice = basePrice * (1 - discountRate);
                        discountedProducts.push({ productName, basePrice, discountedPrice });
                    }
                } else {
                    nonDiscountedProducts.push({ productName, basePrice });
                }

                ivaAmount = discountedPrice * IVA_RATE;
                finalPrice = discountedPrice + ivaAmount;

                // Mostrar en consola el detalle de precios
                console.log(`Producto: ${productName}`);
                console.log(`Detalles del precio:
                    Base: $${basePrice.toLocaleString()}
                    Descuento: -$${(basePrice - discountedPrice).toLocaleString()}
                    IVA: $${ivaAmount.toLocaleString()}
                    Total: $${finalPrice.toLocaleString()}`);

                // Agregar funcionalidad al botón "Ver Más"
                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    showPopup(product, basePrice, discountedPrice, ivaAmount, finalPrice);
                });
            }
        }
    });

    console.log("Productos con descuento:", discountedProducts);
    console.log("Productos sin descuento:", nonDiscountedProducts);

    function showPopup(product, basePrice, discountedPrice, ivaAmount, finalPrice) {
        const popup = document.createElement("div");
        popup.classList.add("popup");

        // Extraer información del producto
        const title = product.querySelector("h3")?.textContent || "Producto sin nombre";
        const briefDescription = product.querySelector("p")?.textContent || "Descripción no disponible.";
        const detailedDescription = product.getAttribute("data-detail") || "No hay detalles adicionales disponibles.";
        const imageSrc = product.querySelector("img")?.src || "";
        const hasDiscount = discountedPrice !== basePrice;

        let quantity = 1;

        const updatePriceTable = () => {
            const subtotal = discountedPrice * quantity;
            const totalIVA = subtotal * IVA_RATE;
            const totalFinal = subtotal + totalIVA;

            popup.querySelector("#subtotal").textContent = `$${subtotal.toLocaleString()}`;
            popup.querySelector("#iva").textContent = `$${totalIVA.toLocaleString()}`;
            popup.querySelector("#total").textContent = `$${totalFinal.toLocaleString()}`;
        };

        popup.innerHTML = `
            <div class="popup-content">
                <button class="close-popup">&times;</button>
                <div class="slider">
                    ${imageSrc ? `<img src="${imageSrc}" alt="${title}" />` : ''}
                </div>
                <h2>${title}</h2>
                <p>${briefDescription}</p>
                <p> ${detailedDescription}</p>
                <div class="price-table">
                    <p>Precio Inicial: $${basePrice.toLocaleString()}</p>
                    ${hasDiscount ? `<p>Descuento: -$${(basePrice - discountedPrice).toLocaleString()}</p>` : ''}
                    <p>Subtotal: <span id="subtotal">$${discountedPrice.toLocaleString()}</span></p>
                    <p>IVA (21%): <span id="iva">$${ivaAmount.toLocaleString()}</span></p>
                    <p><strong>PRECIO FINAL: <span id="total">$${finalPrice.toLocaleString()}</span></strong></p>
                </div>
                <div class="quantity">
                    <button id="decrease">-</button>
                    <span id="quantity">1</span>
                    <button id="increase">+</button>
                </div>
                <button class="buy-now">Añadir al carrito</button>
                <div id="cart-message" style="color: green; display: none;">¡Producto(s) añadidos al carrito!</div>
            </div>
        `;

        document.body.appendChild(popup);
        const closeButton = popup.querySelector(".close-popup");
        const increaseButton = popup.querySelector("#increase");
        const decreaseButton = popup.querySelector("#decrease");
        const quantityDisplay = popup.querySelector("#quantity");
        const addToCartButton = popup.querySelector(".buy-now");
        const cartMessage = popup.querySelector("#cart-message");

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

        addToCartButton.addEventListener("click", () => {
            cartMessage.style.display = "block";
            setTimeout(() => {
                cartMessage.style.display = "none";
            }, 5000);
        });

        closeButton.addEventListener("click", () => {
            popup.remove();
        });
    }
});
