document.addEventListener("DOMContentLoaded", () => {
    const products = document.querySelectorAll(".product");
    const IVA_RATE = 0.21;

    const discountedProducts = []; // Lista para productos con descuento
    const nonDiscountedProducts = []; // Lista para productos sin descuento

    products.forEach((product, index) => {
        const priceElement = product.querySelector(".buy p");
        const discountElement = product.querySelector(".discount p.discountprice");
        const button = product.querySelector(".buy a");

        const productName = product.querySelector("h3")?.textContent || `Producto ${index + 1}`;
        const productDescription = product.getAttribute("data-detail") || "Descripción no disponible.";

        if (priceElement) {
            let rawPriceText = priceElement.textContent.match(/\$([\d.]+)/);
            if (rawPriceText) {
                let basePrice = parseFloat(rawPriceText[1].replace(/\./g, "")); // Extraccion Precio base
                let discountedPrice = basePrice;
                let discountAmount = 0;

                if (discountElement) {
                    let discountMatch = discountElement.textContent.match(/(\d+)%\s?OFF/i);
                    if (discountMatch) {
                        let discountRate = parseFloat(discountMatch[1]) / 100;
                        discountAmount = basePrice * discountRate;
                        discountedPrice = basePrice - discountAmount;

                        discountedProducts.push({
                            id: index + 1,
                            name: productName,
                            description: productDescription,
                            amount: `$${discountedPrice.toLocaleString()}`,
                            discount: `-$${discountAmount.toLocaleString()}`,
                            IVA: `+$${(discountedPrice * IVA_RATE).toLocaleString()}`,
                            finalPrice: `$${(discountedPrice + discountedPrice * IVA_RATE).toLocaleString()}`
                        });
                    }
                } else {
                    nonDiscountedProducts.push({
                        id: index + 1,
                        name: productName,
                        description: productDescription,
                        amount: `$${basePrice.toLocaleString()}`,
                        discount: "-",
                        IVA: `+$${(basePrice * IVA_RATE).toLocaleString()}`,
                        finalPrice: `$${(basePrice + basePrice * IVA_RATE).toLocaleString()}`
                    });
                }

                let ivaAmount = discountedPrice * IVA_RATE;
                let finalPrice = discountedPrice + ivaAmount;

                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    showPopup(product, basePrice, discountedPrice, discountAmount, ivaAmount, finalPrice);
                });
            }
        }
    });

    // Mostrar en consola los productos en formato tabla
    console.log("Productos con descuento:");
    console.table(discountedProducts);

    console.log("Productos sin descuento:");
    console.table(nonDiscountedProducts);

    // Función popup
    function showPopup(product, basePrice, discountedPrice, discountAmount, ivaAmount, finalPrice) {
        const popup = document.createElement("div");
        popup.classList.add("popup");

        const title = product.querySelector("h3")?.textContent || "Producto sin nombre";
        const detailedDescription = product.getAttribute("data-detail") || "No hay detalles adicionales disponibles.";
        const imageSrc = product.querySelector("img")?.src || "";
        const hasDiscount = discountedPrice !== basePrice;

        let quantity = 1;

        const updatePriceTable = () => {
            const subtotal = discountedPrice * quantity; // Precio subtotal según cantidad
            const totalIVA = subtotal * IVA_RATE; // IVA calculado sobre el subtotal
            const totalFinal = subtotal + totalIVA; // Precio final con IVA

            // Actualizar los precios en el popup
            popup.querySelector("#subtotal").textContent = `$${subtotal.toLocaleString()}`;
            popup.querySelector("#iva").textContent = `$${totalIVA.toLocaleString()}`;
            popup.querySelector("#total").textContent = `$${totalFinal.toLocaleString()}`;

            // Actualizar el precio inicial y el descuento según la cantidad
            popup.querySelector(".price-table p:first-child").textContent = `Precio Inicial: $${(basePrice * quantity).toLocaleString()}`;
            if (hasDiscount) {
                popup.querySelector(".price-table p:nth-child(2)").textContent = `Descuento: -$${(discountAmount * quantity).toLocaleString()}`;
            }
        };

        popup.innerHTML = `
            <div class="popup-content">
                <button class="close-popup">&times;</button>
                <div class="slider">
                    ${imageSrc ? `<img src="${imageSrc}" alt="${title}" />` : ""}
                </div>
                <h2>${title}</h2>
                <p>${detailedDescription}</p>
                <div class="price-table">
                    <p>Precio Inicial: $${basePrice.toLocaleString()}</p>
                    ${hasDiscount ? `<p>Descuento: -$${discountAmount.toLocaleString()}</p>` : ""}
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

        popup.querySelector(".buy-now").addEventListener("click", () => {
            cartMessage.style.display = "block";
            setTimeout(() => {
                cartMessage.style.display = "none";
            }, 3000);
        });

        closeButton.addEventListener("click", () => {
            popup.remove();
        });
    }
});
