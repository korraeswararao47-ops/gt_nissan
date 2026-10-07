// ===============================
// MUSICX MUSIC API
// ===============================

const API =
    "https://itunes.apple.com/search";


// ===============================
// VARIABLES
// ===============================

const audio = document.getElementById("audio");

const playerImage =
    document.getElementById("playerImage");

const playerTitle =
    document.getElementById("playerTitle");

const playerArtist =
    document.getElementById("playerArtist");

const playBtn =
    document.getElementById("playBtn");

const progress =
    document.getElementById("progress");

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const volume =
    document.getElementById("volume");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");


let currentSong = null;

let currentList = [];

let currentIndex = 0;

let isPlaying = false;

let shuffle = false;

let repeat = false;


// ===============================
// LOCAL STORAGE
// ===============================

let favorites =
    JSON.parse(
        localStorage.getItem("musicFavorites")
    ) || [];

let playlist =
    JSON.parse(
        localStorage.getItem("musicPlaylist")
    ) || [];

let recent =
    JSON.parse(
        localStorage.getItem("musicRecent")
    ) || [];


// ===============================
// GET MUSIC FROM API
// ===============================

async function getMusic(term) {

    try {

        const url =
            `${API}?term=${encodeURIComponent(term)}&country=IN&media=music&entity=song&limit=30`;

        const response =
            await fetch(url);

        const data =
            await response.json();

        return data.results
            .filter(song => song.previewUrl);

    }

    catch (error) {

        console.log("API Error:", error);

        return [];

    }

}


// ===============================
// TRENDING
// ===============================

async function loadTrending() {

    const songs =
        await getMusic("Taylor Swift");

    currentList = songs;

    displaySongs(
        songs.slice(0, 12),
        "trendingGrid"
    );

    displaySongs(
        songs,
        "fullTrendingGrid"
    );
}


// ===============================
// DISPLAY SONGS
// ===============================

function displaySongs(songs, elementId) {

    const container =
        document.getElementById(elementId);

    if (!container) return;

    container.innerHTML = "";

    if (songs.length === 0) {

        container.innerHTML =
            `<p>No music found.</p>`;

        return;

    }


    songs.forEach((song, index) => {

        const isFav =
            favorites.some(
                item => item.trackId === song.trackId
            );

        const card =
            document.createElement("div");

        card.className =
            "music-card";

        card.innerHTML = `

            <img
                src="${song.artworkUrl100}"
                alt="${song.trackName}"
            >

            <h3>
                ${song.trackName}
            </h3>

            <p>
                ${song.artistName}
            </p>

            <div class="card-buttons">

                <button
                    onclick="playSongFromList(
                        ${index},
                        '${elementId}'
                    )">
                    ▶
                </button>

                <button
                    onclick="toggleFavorite(
                        ${song.trackId}
                    )">
                    ${isFav ? "💖" : "♡"}
                </button>

                <button
                    onclick="addToPlaylist(
                        ${song.trackId}
                    )">
                    +
                </button>

            </div>
        `;

        container.appendChild(card);

    });

}


// ===============================
// SEARCH
// ===============================

async function searchMusic() {

    const term =
        searchInput.value.trim();

    if (!term) return;

    showSection("searchSection");

    document.getElementById("searchText")
        .innerText =
        `Results for "${term}"`;

    const songs =
        await getMusic(term);

    currentList = songs;

    displaySongs(
        songs,
        "searchGrid"
    );
}


searchBtn.addEventListener(
    "click",
    searchMusic
);


searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            searchMusic();
        }

    }
);


// ===============================
// PLAY SONG
// ===============================

function playSong(song) {

    if (!song.previewUrl) {

        alert(
            "This song does not have a preview."
        );

        return;

    }

    currentSong = song;

    audio.src =
        song.previewUrl;

    playerImage.src =
        song.artworkUrl100;

    playerTitle.innerText =
        song.trackName;

    playerArtist.innerText =
        song.artistName;

    audio.play();

    isPlaying = true;

    playBtn.innerText = "⏸";

    addToRecent(song);
}


// ===============================
// PLAY FROM LIST
// ===============================

function playSongFromList(index, elementId) {

    let songs = [];

    if (elementId === "trendingGrid") {

        songs =
            currentList.slice(0, 12);

    }

    else if (
        elementId === "fullTrendingGrid"
    ) {

        songs =
            currentList;

    }

    else if (
        elementId === "searchGrid"
    ) {

        songs =
            currentList;

    }

    else {

        songs =
            currentList;

    }

    if (!songs[index]) return;

    currentList = songs;

    currentIndex = index;

    playSong(songs[index]);
}


// ===============================
// PLAY / PAUSE
// ===============================

playBtn.addEventListener(
    "click",
    function() {

        if (!currentSong) return;

        if (audio.paused) {

            audio.play();

            isPlaying = true;

            playBtn.innerText = "⏸";

        }

        else {

            audio.pause();

            isPlaying = false;

            playBtn.innerText = "▶";

        }

    }
);


// ===============================
// NEXT SONG
// ===============================

document.getElementById("nextBtn")
    .addEventListener(
        "click",
        nextSong
    );


function nextSong() {

    if (!currentList.length) return;

    if (shuffle) {

        currentIndex =
            Math.floor(
                Math.random() *
                currentList.length
            );

    }

    else {

        currentIndex++;

        if (
            currentIndex >=
            currentList.length
        ) {

            currentIndex = 0;

        }

    }

    playSong(
        currentList[currentIndex]
    );
}


// ===============================
// PREVIOUS SONG
// ===============================

document.getElementById("prevBtn")
    .addEventListener(
        "click",
        function() {

            if (!currentList.length)
                return;

            currentIndex--;

            if (currentIndex < 0) {

                currentIndex =
                    currentList.length - 1;

            }

            playSong(
                currentList[currentIndex]
            );

        }
    );


// ===============================
// AUDIO ENDED
// ===============================

audio.addEventListener(
    "ended",
    function() {

        if (repeat) {

            audio.currentTime = 0;

            audio.play();

        }

        else {

            nextSong();

        }

    }
);


// ===============================
// PROGRESS
// ===============================

audio.addEventListener(
    "timeupdate",
    function() {

        if (!audio.duration)
            return;

        const percent =
            (audio.currentTime /
                audio.duration) * 100;

        progress.value =
            percent;

        currentTime.innerText =
            formatTime(
                audio.currentTime
            );

        duration.innerText =
            formatTime(
                audio.duration
            );

    }
);


progress.addEventListener(
    "input",
    function() {

        if (!audio.duration)
            return;

        audio.currentTime =
            (progress.value / 100) *
            audio.duration;

    }
);


// ===============================
// VOLUME
// ===============================

volume.addEventListener(
    "input",
    function() {

        audio.volume =
            volume.value;

    }
);

audio.volume = 0.7;


// ===============================
// FORMAT TIME
// ===============================

function formatTime(seconds) {

    if (isNaN(seconds))
        return "0:00";

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return `${minutes}:${secs
        .toString()
        .padStart(2, "0")}`;

}


// ===============================
// FAVORITES
// ===============================

function toggleFavorite(trackId) {

    const song =
        currentList.find(
            item => item.trackId === trackId
        );

    if (!song) return;


    const exists =
        favorites.some(
            item => item.trackId === trackId
        );


    if (exists) {

        favorites =
            favorites.filter(
                item =>
                    item.trackId !== trackId
            );

    }

    else {

        favorites.push(song);

    }


    localStorage.setItem(
        "musicFavorites",
        JSON.stringify(favorites)
    );


    displaySongs(
        favorites,
        "favoriteGrid"
    );

}


// ===============================
// PLAYLIST
// ===============================

function addToPlaylist(trackId) {

    const song =
        currentList.find(
            item => item.trackId === trackId
        );

    if (!song) return;


    const exists =
        playlist.some(
            item => item.trackId === trackId
        );


    if (exists) {

        alert("Already in playlist!");

        return;

    }


    playlist.push(song);


    localStorage.setItem(
        "musicPlaylist",
        JSON.stringify(playlist)
    );


    displaySongs(
        playlist,
        "playlistGrid"
    );


    alert("Added to playlist 🎵");

}


// ===============================
// RECENT
// ===============================

function addToRecent(song) {

    recent =
        recent.filter(
            item =>
                item.trackId !== song.trackId
        );

    recent.unshift(song);

    recent =
        recent.slice(0, 20);

    localStorage.setItem(
        "musicRecent",
        JSON.stringify(recent)
    );

}


// ===============================
// SHUFFLE
// ===============================

document.getElementById("shuffleBtn")
    .addEventListener(
        "click",
        function() {

            shuffle =
                !shuffle;

            this.style.color =
                shuffle
                    ? "#00f5d4"
                    : "white";

        }
    );


// ===============================
// REPEAT
// ===============================

document.getElementById("repeatBtn")
    .addEventListener(
        "click",
        function() {

            repeat =
                !repeat;

            this.style.color =
                repeat
                    ? "#00f5d4"
                    : "white";

        }
    );


// ===============================
// NAVIGATION
// ===============================

document.querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const section =
                    this.dataset.section;

                showSection(section);

                document
                    .querySelectorAll(
                        ".nav-btn"
                    )
                    .forEach(btn =>
                        btn.classList
                            .remove("active")
                    );

                this.classList
                    .add("active");

            }
        );

    });


function showSection(id) {

    document
        .querySelectorAll(".section")
        .forEach(section => {

            section.classList
                .remove(
                    "active-section"
                );

        });


    const target =
        document.getElementById(id);

    if (target) {

        target.classList
            .add("active-section");

    }

}


// ===============================
// GENRE SEARCH
// ===============================

async function searchGenre(genre) {

    searchInput.value = genre;

    await searchMusic();

}


// ===============================
// DISCOVER
// ===============================

document.getElementById("discoverBtn")
    .addEventListener(
        "click",
        function() {

            showSection("trending");

            document
                .querySelectorAll(
                    ".nav-btn"
                )[1]
                .click();

        }
    );


// ===============================
// VIEW TRENDING
// ===============================

document.getElementById("viewTrending")
    .addEventListener(
        "click",
        function() {

            document
                .querySelectorAll(
                    ".nav-btn"
                )[1]
                .click();

        }
    );


// ===============================
// KEYBOARD CONTROLS
// ===============================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space" &&
            event.target.tagName !== "INPUT"
        ) {

            event.preventDefault();

            playBtn.click();

        }


        if (event.code === "ArrowRight") {

            nextSong();

        }


        if (event.code === "ArrowLeft") {

            document
                .getElementById(
                    "prevBtn"
                )
                .click();

        }

    }
);


// ===============================
// INITIAL LOAD
// ===============================

async function startMusicX() {

    await loadTrending();

    displaySongs(
        favorites,
        "favoriteGrid"
    );

    displaySongs(
        playlist,
        "playlistGrid"
    );

    displaySongs(
        recent,
        "recentGrid"
    );

}


startMusicX();