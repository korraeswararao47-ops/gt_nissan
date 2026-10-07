javascript
// Futuristic Digital World

const messages = [
    "Welcome to the Digital World! 🚀",
    "Technology is the future! 🤖",
    "JavaScript is working perfectly! ⚡",
    "Welcome to the Future! 🌐"
];

let index = 0;

// Change message
function changeMessage() {

    index++;

    if (index >= messages.length) {
        index = 0;
    }

    document.getElementById("message").innerHTML =
        messages[index];

    // Change futuristic background
    document.body.style.background =
        `radial-gradient(circle at ${20 + index * 20}% 30%,
        #00ffff 0%,
        #071b2d 25%,
        #020617 70%,
        #000000 100%)`;
}


// Create digital particles
function createParticle() {

    const particle = document.createElement("div");

    particle.className = "particle";

    particle.style.left =
        Math.random() * 100 + "vw";

    particle.style.top =
        Math.random() * 100 + "vh";

    particle.style.animationDuration =
        (2 + Math.random() * 5) + "s";

    document.body.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, 7000);
}


// Create particles continuously
setInterval(createParticle, 200);


// Digital clock
function digitalClock() {

    const now = new Date();

    const time =
        now.toLocaleTimeString();

    let clock =
        document.getElementById("clock");

    if (!clock) {

        clock =
            document.createElement("div");

        clock.id = "clock";

        document.body.appendChild(clock);
    }

    clock.innerHTML =
        "SYSTEM TIME : " + time;
}

setInterval(digitalClock, 1000);


// Futuristic mouse effect
document.addEventListener("mousemove", function(event) {

    const x =
        (event.clientX / window.innerWidth) * 100;

    const y =
        (event.clientY / window.innerHeight) * 100;

    document.body.style.background =
        `radial-gradient(
            circle at ${x}% ${y}%,
            #00ffff,
            #071b2d 25%,
            #020617 70%,
            #000000
        )`;
});

