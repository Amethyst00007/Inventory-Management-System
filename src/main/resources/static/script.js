const API_URL = "/api/products";


// =====================================
// PAGE LOAD
// =====================================

window.onload = function () {
    loadProducts();
};


// =====================================
// LOAD ALL PRODUCTS
// =====================================

function loadProducts() {

    fetch(API_URL)

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load products");
            }

            return response.json();

        })

        .then(products => {

            displayProducts(products);

            updateDashboard(products);

        })

        .catch(error => {

            console.error(error);

            showMessage(
                "Unable to load products.",
                "error"
            );

        });
}


// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts(products) {

    const table = document.getElementById("productTable");

    table.innerHTML = "";


    if (products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    No products found.
                </td>
            </tr>
        `;

        return;
    }


	products.forEach((product, index) => {

	const row = document.createElement("tr");


        // Highlight low stock
        if (product.quantity <= 5) {

            row.classList.add("low-stock-row");

        }


        row.innerHTML = `

           <td>${index + 1}</td>

            <td>
                <strong>${product.name}</strong>
            </td>

            <td>${product.category}</td>

            <td>

                <strong>
                    ${product.quantity}
                </strong>

                ${
                    product.quantity <= 5
                        ? '<span class="low-stock-badge">LOW STOCK</span>'
                        : ''
                }

            </td>

            <td>
                ₹${product.price.toLocaleString("en-IN")}
            </td>

            <td>
                ${product.supplier}
            </td>

            <td>

                <div class="table-actions">

                    <button
                        class="stock-btn"
                        onclick="updateStock(${product.id})"
                    >
                        📦 Stock
                    </button>

                    <button
                        class="edit-btn"
                        onclick="editProduct(${product.id})"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="danger-btn"
                        onclick="deleteProduct(${product.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </td>
        `;


        table.appendChild(row);

    });
}


// =====================================
// DASHBOARD
// =====================================

function updateDashboard(products) {


    // Total products

    document.getElementById("totalProducts").innerText =
        products.length;


    // Low stock

    const lowStockProducts =
        products.filter(product => product.quantity <= 5);


    document.getElementById("lowStock").innerText =
        lowStockProducts.length;


    // Inventory value

    const totalValue =
        products.reduce(
            (total, product) =>
                total + (product.quantity * product.price),
            0
        );


    document.getElementById("inventoryValue").innerText =
        "₹" + totalValue.toLocaleString("en-IN");
}


// =====================================
// SEARCH
// =====================================

function searchProducts() {

    const name =
        document.getElementById("searchInput").value.trim();


    if (name === "") {

        loadProducts();

        return;
    }


    fetch(
        `${API_URL}/search?name=${encodeURIComponent(name)}`
    )

        .then(response => {

            if (!response.ok) {
                throw new Error("Search failed");
            }

            return response.json();

        })

        .then(products => {

            displayProducts(products);

        })

        .catch(error => {

            console.error(error);

            showMessage(
                "Unable to search products.",
                "error"
            );

        });
}


// =====================================
// LOW STOCK
// =====================================

function loadLowStock() {

    fetch(`${API_URL}/low-stock`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load low stock");
            }

            return response.json();

        })

        .then(products => {

            displayProducts(products);

        })

        .catch(error => {

            console.error(error);

            showMessage(
                "Unable to load low-stock products.",
                "error"
            );

        });
}


// =====================================
// SHOW ADD PRODUCT FORM
// =====================================

function showAddProductForm() {

    document
        .getElementById("productForm")
        .classList.remove("hidden");

}


// =====================================
// HIDE ADD PRODUCT FORM
// =====================================

function hideAddProductForm() {

    document
        .getElementById("productForm")
        .classList.add("hidden");

}


// =====================================
// ADD PRODUCT
// =====================================

function addProduct() {


    const product = {

        name:
            document.getElementById("name").value.trim(),

        category:
            document.getElementById("category").value.trim(),

        quantity:
            Number(
                document.getElementById("quantity").value
            ),

        price:
            Number(
                document.getElementById("price").value
            ),

        supplier:
            document.getElementById("supplier").value.trim()
    };


    // Basic frontend validation

    if (
        product.name === "" ||
        product.category === "" ||
        product.supplier === ""
    ) {

        showMessage(
            "Please fill in all product fields.",
            "error"
        );

        return;
    }


    if (
        product.quantity < 0 ||
        product.price <= 0
    ) {

        showMessage(
            "Quantity cannot be negative and price must be greater than 0.",
            "error"
        );

        return;
    }


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)

    })

        .then(response => {

            if (!response.ok) {

                return response.json()
                    .then(error => {

                        throw new Error(
                            Object.values(error).join(", ")
                        );

                    });

            }

            return response.json();

        })

        .then(() => {

            showMessage(
                "Product added successfully.",
                "success"
            );

            clearForm();

            hideAddProductForm();

            loadProducts();

        })

        .catch(error => {

            console.error(error);

            showMessage(
                error.message || "Unable to add product.",
                "error"
            );

        });
}


// =====================================
// CLEAR FORM
// =====================================

function clearForm() {

    document.getElementById("name").value = "";

    document.getElementById("category").value = "";

    document.getElementById("quantity").value = "";

    document.getElementById("price").value = "";

    document.getElementById("supplier").value = "";
}


// =====================================
// EDIT PRODUCT
// =====================================

function editProduct(id) {


    fetch(`${API_URL}/${id}`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Product not found");
            }

            return response.json();

        })

        .then(product => {


            const name =
                prompt(
                    "Product Name:",
                    product.name
                );


            if (name === null) return;


            const category =
                prompt(
                    "Category:",
                    product.category
                );


            if (category === null) return;


            const quantity =
                prompt(
                    "Quantity:",
                    product.quantity
                );


            if (quantity === null) return;


            const price =
                prompt(
                    "Price:",
                    product.price
                );


            if (price === null) return;


            const supplier =
                prompt(
                    "Supplier:",
                    product.supplier
                );


            if (supplier === null) return;


            const updatedProduct = {

                name: name.trim(),

                category: category.trim(),

                quantity: Number(quantity),

                price: Number(price),

                supplier: supplier.trim()
            };


            if (
                updatedProduct.name === "" ||
                updatedProduct.category === "" ||
                updatedProduct.supplier === "" ||
                updatedProduct.quantity < 0 ||
                updatedProduct.price <= 0
            ) {

                showMessage(
                    "Invalid product information.",
                    "error"
                );

                return;
            }


            return fetch(`${API_URL}/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedProduct)

            });

        })

        .then(response => {

            if (!response) return;

            if (!response.ok) {

                return response.json()
                    .then(error => {

                        throw new Error(
                            Object.values(error).join(", ")
                        );

                    });

            }

            return response.json();

        })

        .then(product => {

            if (!product) return;

            showMessage(
                "Product updated successfully.",
                "success"
            );

            loadProducts();

        })

        .catch(error => {

            console.error(error);

            showMessage(
                error.message || "Unable to update product.",
                "error"
            );

        });
}


// =====================================
// UPDATE STOCK
// =====================================

function updateStock(id) {


    const quantity =
        prompt(
            "Enter new stock quantity:"
        );


    if (quantity === null) {
        return;
    }


    const stock = Number(quantity);


    if (
        isNaN(stock) ||
        stock < 0
    ) {

        showMessage(
            "Please enter a valid quantity.",
            "error"
        );

        return;
    }


    fetch(
        `${API_URL}/${id}/stock?quantity=${stock}`,
        {
            method: "PUT"
        }
    )

        .then(response => {

            if (!response.ok) {

                return response.json()
                    .then(error => {

                        throw new Error(
                            error.message ||
                            "Unable to update stock."
                        );

                    });

            }

            return response.json();

        })

        .then(() => {

            showMessage(
                "Stock updated successfully.",
                "success"
            );

            loadProducts();

        })

        .catch(error => {

            console.error(error);

            showMessage(
                error.message ||
                "Unable to update stock.",
                "error"
            );

        });
}


// =====================================
// DELETE PRODUCT
// =====================================

function deleteProduct(id) {


    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {
        return;
    }


    fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to delete product."
                );

            }

            return response.text();

        })

        .then(() => {

            showMessage(
                "Product deleted successfully.",
                "success"
            );

            loadProducts();

        })

        .catch(error => {

            console.error(error);

            showMessage(
                error.message ||
                "Unable to delete product.",
                "error"
            );

        });
}


// =====================================
// MESSAGE
// =====================================

function showMessage(message, type) {

    const messageBox =
        document.getElementById("message");


    messageBox.innerHTML = `

        <div class="
            ${type === "success"
                ? "message-success"
                : "message-error"}
        ">
            ${message}
        </div>

    `;


    setTimeout(() => {

        messageBox.innerHTML = "";

    }, 4000);
}