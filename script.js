/* =========================
   INITIAL SETUP
========================= */

lucide.createIcons();


// DATE

const dateElement = document.getElementById("currentDate");

const today = new Date();

dateElement.innerText = today.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
});



/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId, button = null) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active-page");
    }


    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });


    if (button) {
        button.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



/* =========================
   MOOD + STRESS
========================= */

function selectMood(mood, emoji, stress) {

    localStorage.setItem("mood", mood);
    localStorage.setItem("stress", stress);

    document.querySelectorAll(".mood-card").forEach(card => {
        card.style.borderColor = "transparent";
    });

    event.currentTarget.style.borderColor = "#4c9a7a";


    document.getElementById("stressScore").innerText = stress;

    document.getElementById("stressPercent").innerText =
        stress + "%";


    const status = document.getElementById("stressStatus");

    if (stress < 40) {

        status.innerText = "● Low stress";

    } else if (stress < 70) {

        status.innerText = "● Moderate stress";

    } else {

        status.innerText = "● High stress";

    }


    localStorage.setItem(
        "moodDate",
        new Date().toLocaleDateString()
    );
}



/* =========================
   SPOTIFY
========================= */

function openSpotify(query) {

    const search = encodeURIComponent(query);

    const url =
        `https://open.spotify.com/search/${search}`;

    window.open(url, "_blank");
}



/* =========================
   BREATHING
========================= */

let breathingRunning = false;
let breathingInterval;
let breathingSeconds = 60;


function startBreathing() {

    if (breathingRunning) {

        stopBreathing();

        return;
    }


    breathingRunning = true;

    breathingSeconds = 60;

    const circle =
        document.getElementById("breathingCircle");

    const text =
        document.getElementById("breathingText");

    const instruction =
        document.getElementById("breathingInstruction");

    const button =
        document.getElementById("breathingButton");


    circle.classList.add("running");

    button.innerText = "⏸ Pause";


    let phase = 0;

    const phases = [
        ["Breathe in", "Inhale slowly"],
        ["Hold", "Keep your breath"],
        ["Breathe out", "Slowly release"]
    ];


    function updatePhase() {

        const current = phases[phase];

        text.innerText = current[0];

        instruction.innerText = current[1];

        phase = (phase + 1) % phases.length;
    }


    updatePhase();

    breathingInterval = setInterval(() => {

        breathingSeconds--;

        document.getElementById("breathingTimer")
            .innerText = breathingSeconds + " sec";


        if (breathingSeconds % 4 === 0) {
            updatePhase();
        }


        if (breathingSeconds <= 0) {

            stopBreathing();

            text.innerText = "Well done!";

            instruction.innerText =
                "You gave yourself a moment.";

            document.getElementById("breathingTimer")
                .innerText = "Complete ❤️";
        }

    }, 1000);
}


function stopBreathing() {

    breathingRunning = false;

    clearInterval(breathingInterval);

    document.getElementById("breathingCircle")
        .classList.remove("running");

    document.getElementById("breathingButton")
        .innerText = "▶ Start Breathing";
}



/* =========================
   JOURNAL
========================= */

const journalInput =
    document.getElementById("journalInput");

journalInput.addEventListener("input", () => {

    const words =
        journalInput.value
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

    document.getElementById("wordCount")
        .innerText = words + " words";
});


function saveJournal() {

    const text =
        document.getElementById("journalInput").value.trim();


    if (!text) {

        alert("Write something first ❤️");

        return;
    }


    const entries =
        JSON.parse(
            localStorage.getItem("journalEntries") || "[]"
        );


    entries.unshift({
        text: text,
        date: new Date().toLocaleString()
    });


    localStorage.setItem(
        "journalEntries",
        JSON.stringify(entries)
    );


    document.getElementById("journalInput").value = "";

    document.getElementById("wordCount")
        .innerText = "0 words";


    loadJournal();

    alert("Your journal entry is saved ❤️");
}


function loadJournal() {

    const container =
        document.getElementById("journalEntries");


    const entries =
        JSON.parse(
            localStorage.getItem("journalEntries") || "[]"
        );


    container.innerHTML = "";


    entries.slice(0, 5).forEach(entry => {

        const div =
            document.createElement("div");

        div.className = "saved-entry";

        div.innerHTML = `
            <small>${entry.date}</small>
            <p>${escapeHTML(entry.text)}</p>
        `;

        container.appendChild(div);
    });
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


loadJournal();



/* =========================
   CALM MODE
========================= */

let calmRunning = false;
let calmInterval;
let calmSeconds = 60;


function startCalmMode() {

    document
        .getElementById("calmOverlay")
        .classList.add("show");
}


function closeCalmMode() {

    document
        .getElementById("calmOverlay")
        .classList.remove("show");

    stopCalmMode();
}


function runCalmMode() {

    if (calmRunning) {

        stopCalmMode();

        return;
    }


    calmRunning = true;

    calmSeconds = 60;


    const circle =
        document.getElementById("calmCircle");

    const text =
        document.getElementById("calmText");

    const timer =
        document.getElementById("calmTimer");

    const button =
        document.getElementById("calmStartButton");


    circle.classList.add("running");

    button.innerText = "⏸ Pause";


    let phase = 0;


    const phases = [
        "Breathe in",
        "Hold",
        "Breathe out"
    ];


    text.innerText = phases[0];


    calmInterval = setInterval(() => {

        calmSeconds--;

        timer.innerText = calmSeconds;


        if (calmSeconds % 5 === 0) {

            phase =
                (phase + 1) % phases.length;

            text.innerText =
                phases[phase];
        }


        if (calmSeconds <= 0) {

            stopCalmMode();

            text.innerText = "You did it ❤️";

            document.getElementById("calmTitle")
                .innerText = "You're doing great.";

            document.getElementById("calmDescription")
                .innerText =
                "Take this calm feeling with you.";
        }

    }, 1000);
}


function stopCalmMode() {

    calmRunning = false;

    clearInterval(calmInterval);

    const circle =
        document.getElementById("calmCircle");

    if (circle) {
        circle.classList.remove("running");
    }

    const button =
        document.getElementById("calmStartButton");

    if (button) {
        button.innerText = "Start Calm Mode";
    }
}



/* =========================
   DARK MODE
========================= */

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        dark ? "true" : "false"
    );
}


if (
    localStorage.getItem("darkMode") === "true"
) {
    document.body.classList.add("dark");
}



/* =========================
   LOAD SAVED MOOD
========================= */

const savedStress =
    localStorage.getItem("stress");


if (savedStress) {

    document.getElementById("stressScore")
        .innerText = savedStress;

    document.getElementById("stressPercent")
        .innerText = savedStress + "%";
}



/* =========================
   DAILY TIPS
========================= */

const tips = [
    "You are allowed to take a break.",
    "Your feelings are temporary, not permanent.",
    "Small steps still move you forward.",
    "Drink some water and take a deep breath.",
    "You don't need to solve everything today.",
    "Be kind to yourself today.",
    "Rest is part of progress."
];


const randomTip =
    tips[Math.floor(Math.random() * tips.length)];


document.getElementById("dailyTip")
    .innerText = randomTip;