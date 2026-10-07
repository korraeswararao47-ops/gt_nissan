javascript
// ==========================================
// MUSICX MUSIC API
// Apple iTunes Search API
// ==========================================


let cart = [];

let total = 0;


// ==========================================
// SEARCH MUSIC USING API
// ==========================================

async function searchMusic() {

    const searchInput =
        document.getElementById("searchInput");

    const musicContainer =
        document.getElementById("musicContainer");

    const status =
        document.getElementById("status");


    const searchTerm =
        searchInput.value.trim();


    // Check empty search

    if (searchTerm === "") {

        alert("Please enter a song or artist.");

        return;
    }


    // Loading message

    musicContainer.innerHTML = `
        <p class="message">
            🔄 Searching music...
        </p>
    `;


    status.innerText =
        "Connecting to Music API...";


    try {

        // ======================================
        // REAL API REQUEST
        // ======================================

        const url =
            `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=20&country=US`;


        const response =
            await fetch(url);


        // Convert response to JSON

        const data =
            await response.json();


        console.log(data);


        // Check results

        if (data.resultCount === 0) {

            musicContainer.innerHTML = `
                <p class="message">
                    ❌ No music found.
                </p>
            `;

            status.innerText =
                "No results found.";

            return;
        }


        status.innerText =
            `${data.resultCount} music results found.`;


        // Display results

        displayMusic(data.results);


    }

    catch (error) {

        console.error(error);

        musicContainer.innerHTML = `
            <p class="message">
                ❌ Something went wrong.
            </p>
        `;

        status.innerText =
            "API request failed.";

    }

}


// ==========================================
// DISPLAY MUSIC
// ==========================================

function displayMusic(songs) {

    const container =
        document.getElementById("musicContainer");


    container.innerHTML = "";


    songs.forEach(function(song) {


        // Song information

        const songName =
            song.trackName || "Unknown Song";


        const artist =
            song.artistName || "Unknown Artist";


        const album =
            song.collectionName || "Unknown Album";


        const artwork =
            song.artworkUrl100 ||
            "https://via.placeholder.com/300";


        const preview =
            song.previewUrl;


        const genre =
            song.primaryGenreName ||
            "Music";


        // Convert USD price to approximate INR
        // This is only a demo calculation.

        const price =
            Math.round(
                (song.trackPrice || 0.99) * 85
            );


        // Create card

        const card =
            document.createElement("div");


        card.className =
            "music-card";


        card.innerHTML = `

            <img
                class="album-image"
                src="${artwork}"
                alt="${songName}"
            >


            <h3>
                ${songName}
            </h3>


            <p class="artist">
                🎤 ${artist}
            </p>


            <p class="artist">
                💿 ${album}
            </p>


            <p class="genre">
                ${genre}
            </p>


            ${
                preview
                ?
                `
                <audio
                    controls
                    src="${preview}">
                </audio>
                `
                :
                `
                <p>
                    Preview unavailable
                </p>
                `
            }


            <div class="card-buttons">

                <span class="price">
                    ₹${price}
                </span>


                <button
                    class="add-button"
                    onclick="addToCart(
                        '${escapeText(songName)}',
                        ${price}
                    )"
                >
                    Add 🛒
                </button>

            </div>


            <a
                class="store-button"
                href="${song.trackViewUrl}"
                target="_blank"
            >
                View in Store ↗
            </a>

        `;


        container.appendChild(card);

    });

}


// ==========================================
// ESCAPE TEXT
// ==========================================

function escapeText(text) {

    return text
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(name, price) {

    cart.push({

        name: name,

        price: price

    });


    total += price;


    displayCart();


    alert(
        name +
        " added to your cart!"
    );

}


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

    }


    cart.forEach(function(item, index) {

        const div =
            document.createElement("div");


        div.className =
            "cart-item";


        div.innerHTML = `

            <span>
                🎵 ${item.name}
            </span>


            <span>
                ₹${item.price}
            </span>


            <button
                class="remove-button"
                onclick="removeFromCart(${index})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(div);

    });


    document.getElementById("total")
        .innerText = total;

}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(index) {

    total -= cart[index].price;

    cart.splice(index, 1);

    displayCart();

}


// ==========================================
// CHECKOUT
// ==========================================

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;
    }


    alert(
        "🎉 Order Successful!\n\n" +
        "Total: ₹" + total +
        "\n\nThis is a demo payment."
    );


    cart = [];

    total = 0;


    displayCart();

}


// ==========================================
// SCROLL TO MUSIC
// ==========================================

function goToMusic() {

    document
        .getElementById("music")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ==========================================
// ENTER KEY SEARCH
// ==========================================

document
    .getElementById("searchInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchMusic();

            }

        }
    );
