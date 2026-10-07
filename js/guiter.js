javascript
// ============================================
// MUSICX PREMIUM JAVASCRIPT
// Real Music API + Premium Effects
// ============================================


// ============================================
// CART
// ============================================

let cart = [];

let total = 0;


// ============================================
// REAL MUSIC API
// ============================================

async function searchMusic() {

    const input =
        document.getElementById("searchInput");

    const container =
        document.getElementById("musicContainer");

    const status =
        document.getElementById("status");


    const searchTerm =
        input.value.trim();


    if (searchTerm === "") {

        alert("Please enter a song or artist.");

        return;

    }


    // Loading animation

    container.innerHTML = `
        <div class="empty-state">

            <div>♫</div>

            <h3>
                Searching...
            </h3>

            <p>
                Discovering music for you.
            </p>

        </div>
    `;


    status.innerText =
        "Connecting to Music API...";


    try {

        // ========================================
        // API URL
        // ========================================

        const apiURL =
            `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=20&country=US`;


        // ========================================
        // FETCH API
        // ========================================

        const response =
            await fetch(apiURL);


        // Convert API response to JSON

        const data =
            await response.json();


        console.log("API DATA:", data);


        if (data.resultCount === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <div>♪</div>

                    <h3>
                        No music found
                    </h3>

                    <p>
                        Try another artist or song.
                    </p>

                </div>
            `;

            status.innerText =
                "No results found.";

            return;

        }


        status.innerText =
            `${data.resultCount} songs discovered`;


        displayMusic(data.results);


    }

    catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-state">

                <div>⚠</div>

                <h3>
                    Something went wrong
                </h3>

                <p>
                    Please try again.
                </p>

            </div>
        `;

        status.innerText =
            "API connection failed.";

    }

}


// ============================================
// DISPLAY API RESULTS
// ============================================

function displayMusic(songs) {

    const container =
        document.getElementById(
            "musicContainer"
        );


    container.innerHTML = "";


    songs.forEach(function(song) {


        const songName =
            song.trackName ||
            "Unknown Song";


        const artist =
            song.artistName ||
            "Unknown Artist";


        const album =
            song.collectionName ||
            "Unknown Album";


        const image =
            song.artworkUrl100
            ?.replace(
                "100x100",
                "600x600"
            )
            ||
            "https://via.placeholder.com/600";


        const preview =
            song.previewUrl;


        const genre =
            song.primaryGenreName ||
            "Music";


        // API price

        const usdPrice =
            song.trackPrice || 0.99;


        // Demo conversion to INR

        const price =
            Math.round(
                usdPrice * 85
            );


        // =====================================
        // CREATE CARD
        // =====================================

        const card =
            document.createElement("div");


        card.className =
            "music-card";


        card.innerHTML = `

            <img
                class="album-image"
                src="${image}"
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


            <span class="genre">
                ${genre}
            </span>


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
                <p class="artist">
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
                        '${escapeSongName(songName)}',
                        ${price}
                    )"
                >

                    + Add

                </button>

            </div>


            <a
                class="store-button"
                href="${song.trackViewUrl}"
                target="_blank"
            >

                View in Apple Music ↗

            </a>

        `;


        container.appendChild(card);

    });

}


// ============================================
// PROTECT SONG NAME
// ============================================

function escapeSongName(name) {

    return name
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


// ============================================
// ADD TO CART
// ============================================

function addToCart(name, price) {

    cart.push({

        name: name,

        price: price

    });


    total += price;


    displayCart();


    // Premium notification

    showNotification(
        "Added to your collection ♪"
    );

}


// ============================================
// CART DISPLAY
// ============================================

function displayCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                Your cart is currently empty.
            </div>
        `;

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
                onclick="removeItem(${index})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(div);

    });


    document.getElementById(
        "total"
    ).innerText = total;

}


// ============================================
// REMOVE CART ITEM
// ============================================

function removeItem(index) {

    total -= cart[index].price;

    cart.splice(index, 1);

    displayCart();

}


// ============================================
// CHECKOUT
// ============================================

function checkout() {

    if (cart.length === 0) {

        showNotification(
            "Your collection is empty."
        );

        return;

    }


    showNotification(
        "Payment successful! 🎉"
    );


    cart = [];

    total = 0;


    displayCart();

}


// ============================================
// PREMIUM NOTIFICATION
// ============================================

function showNotification(message) {

    const notification =
        document.createElement("div");


    notification.innerText =
        message;


    notification.style.position =
        "fixed";


    notification.style.bottom =
        "30px";


    notification.style.right =
        "30px";


    notification.style.padding =
        "15px 22px";


    notification.style.borderRadius =
        "14px";


    notification.style.background =
        "rgba(10,20,25,0.9)";


    notification.style.border =
        "1px solid #00ff99";


    notification.style.color =
        "#00ff99";


    notification.style.backdropFilter =
        "blur(15px)";


    notification.style.zIndex =
        "9999";


    notification.style.boxShadow =
        "0 10px 40px rgba(0,0,0,0.4)";


    document.body.appendChild(
        notification
    );


    setTimeout(function() {

        notification.remove();

    }, 2500);

}


// ============================================
// HERO SCROLL
// ============================================

function goToMusic() {

    document
        .getElementById("music")
        .scrollIntoView({

            behavior: "smooth"

        });

}


// ============================================
// FEATURED BUTTON
// ============================================

function showFeatured() {

    document
        .getElementById("searchInput")
        .value =
        "Taylor Swift";


    searchMusic();


    document
        .getElementById("music")
        .scrollIntoView({

            behavior: "smooth"

        });

}


// ============================================
// ENTER KEY SEARCH
// ============================================

document
    .getElementById("searchInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                searchMusic();

            }

        }
    );


// ============================================
// FLOATING MUSIC PARTICLES
// ============================================

function createParticles() {

    const particleContainer =
        document.getElementById(
            "particles"
        );


    const symbols = [
        "♪",
        "♫",
        "♬",
        "♩",
        "•"
    ];


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "particle";


        particle.innerText =
            symbols[
                Math.floor(
                    Math.random()
                    * symbols.length
                )
            ];


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.fontSize =
            (10 + Math.random() * 20)
            + "px";


        particle.style.animationDuration =
            (8 + Math.random() * 15)
            + "s";


        particle.style.animationDelay =
            Math.random() * 10
            + "s";


        particleContainer.appendChild(
            particle
        );

    }

}


// Start background particles

createParticles();


// ============================================
// MOUSE PARALLAX EFFECT
// ============================================

document.addEventListener(
    "mousemove",
    function(event) {

        const vinyl =
            document.querySelector(
                ".vinyl"
            );


        if (!vinyl) return;


        const x =
            (window.innerWidth / 2
            - event.clientX) / 60;


        const y =
            (window.innerHeight / 2
            - event.clientY) / 60;


        vinyl.style.boxShadow =
            `${x}px ${y}px 80px rgba(0,255,153,0.2)`;

    }
);
