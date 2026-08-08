import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================================
// LOGIN
// ======================================================

window.login = async function () {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Enter Email & Password");
        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        document.getElementById("loginBox").style.display = "none";

        document.getElementById("adminPanel").style.display = "block";

        loadEvents();

    } catch (error) {

        alert(error.message);

    }
};


// ======================================================
// ADD NEW EVENT
// ======================================================

const saveEventBtn =
    document.getElementById("saveEventBtn");


saveEventBtn.onclick = async function () {

    const eventId =
        document.getElementById("eventId").value.trim();

    const eventType =
        document.getElementById("eventType").value;

    const eventName =
        document.getElementById("eventName").value.trim();


    if (
        eventId === "" ||
        eventType === "" ||
        eventName === ""
    ) {

        alert("Please fill all Event details");
        return;

    }


    try {

        await addDoc(
            collection(db, "events"),
            {

                eventId: eventId,

                eventType: eventType,

                eventName: eventName,

                status: "Active"

            }
        );


        alert("Event saved successfully!");


        document.getElementById("eventId").value = "";

        document.getElementById("eventType").value = "";

        document.getElementById("eventName").value = "";


        loadEvents();


    } catch (error) {

        console.error(error);

        alert(
            "Error saving event: " +
            error.message
        );

    }

};


// ======================================================
// LOAD EXISTING EVENTS
// ======================================================

async function loadEvents() {

    const eventList =
        document.getElementById("eventList");


    if (!eventList) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(db, "events")
            );


        eventList.innerHTML = "";


        snapshot.forEach((doc) => {

            const event =
                doc.data();


            const div =
                document.createElement("div");


            div.className = "event-card";


            div.innerHTML = `

                <strong>
                    ${event.eventName || ""}
                </strong>

                <br>

                Event ID:
                ${event.eventId || ""}

                <br>

                Type:
                ${event.eventType || ""}

                <br>

                Status:
                ${event.status || ""}

            `;


            eventList.appendChild(div);

        });


    } catch (error) {

        console.error(error);

        eventList.innerHTML =
            "Error loading events.";

    }

}


// ======================================================
// ADD NEW MATCH - OPEN / CLOSE
// ======================================================

const addMatchBtn =
    document.getElementById("addMatchBtn");

const matchForm =
    document.getElementById("matchForm");


addMatchBtn.onclick = function () {

    if (matchForm.style.display === "none") {

        matchForm.style.display = "block";

        addMatchBtn.innerText =
            "➖ CLOSE MATCH FORM";

    } else {

        matchForm.style.display = "none";

        addMatchBtn.innerText =
            "➕ ADD NEW MATCH";

    }

};


// ======================================================
// MATCH EVENT TYPE
// ======================================================

const matchEventType =
    document.getElementById("matchEventType");

const eventSelectBox =
    document.getElementById("eventSelectBox");

const eventSelect =
    document.getElementById("eventSelect");


matchEventType.onchange = async function () {

    const selectedType =
        matchEventType.value;


    // ------------------------------------------
    // INDIVIDUAL MATCH
    // ------------------------------------------

    if (
        selectedType ===
        "Individual Matches"
    ) {

        eventSelectBox.style.display =
            "none";

        eventSelect.innerHTML =
            `<option value="">
                Select Tournament / Series
            </option>`;

        return;

    }


    // ------------------------------------------
    // NOTHING SELECTED
    // ------------------------------------------

    if (
        selectedType !== "Tournament" &&
        selectedType !== "Series"
    ) {

        eventSelectBox.style.display =
            "none";

        eventSelect.innerHTML =
            `<option value="">
                Select Tournament / Series
            </option>`;

        return;

    }


    // ------------------------------------------
    // TOURNAMENT / SERIES
    // ------------------------------------------

    eventSelectBox.style.display =
        "block";


    eventSelect.innerHTML =
        `<option value="">
            Loading...
        </option>`;


    try {

        const snapshot =
            await getDocs(
                collection(db, "events")
            );


        eventSelect.innerHTML = `

            <option value="">
                Select ${selectedType}
            </option>

        `;


        let found = false;


        snapshot.forEach((doc) => {

            const event =
                doc.data();


            if (
                event.eventType ===
                selectedType
            ) {

                found = true;


                const option =
                    document.createElement("option");


                option.value =
                    doc.id;


                option.textContent =
                    event.eventName;


                option.dataset.eventId =
                    event.eventId;


                eventSelect.appendChild(
                    option
                );

            }

        });


        if (!found) {

            eventSelect.innerHTML = `

                <option value="">
                    No ${selectedType} found
                </option>

            `;

        }


    } catch (error) {

        console.error(error);


        eventSelect.innerHTML = `

            <option value="">
                Error loading events
            </option>

        `;

    }

};


// ======================================================
// SAVE MATCH TO FIREBASE
// ======================================================

const saveMatchBtn =
    document.getElementById("saveMatchBtn");


saveMatchBtn.onclick = async function () {

    // ------------------------------------------
    // BASIC MATCH DETAILS
    // ------------------------------------------

    const matchId =
        document.getElementById("matchId")
        .value
        .trim();


    const eventType =
        document.getElementById("matchEventType")
        .value;


    const matchDate =
        document.getElementById("matchDate")
        .value;


    const matchPlace =
        document.getElementById("matchPlace")
        .value
        .trim();


    const opponent =
        document.getElementById("opponent")
        .value
        .trim();


    const overs =
        document.getElementById("overs")
        .value
        .trim();


    const result =
        document.getElementById("result")
        .value
        .trim();


    const playerOfMatch =
        document.getElementById("playerOfMatch")
        .value
        .trim();


    const bestBowler =
        document.getElementById("bestBowler")
        .value
        .trim();


    const bestBatter =
        document.getElementById("bestBatter")
        .value
        .trim();


    const fighterOfMatch =
        document.getElementById("fighterOfMatch")
        .value
        .trim();


    const cricHeroesLink =
        document.getElementById("cricHeroesLink")
        .value
        .trim();


    // ------------------------------------------
    // EVENT INFORMATION
    // ------------------------------------------

    let eventId = "";

    let eventName = "";


    if (
        eventType === "Tournament" ||
        eventType === "Series"
    ) {

        const selectedOption =
            eventSelect.options[
                eventSelect.selectedIndex
            ];


        if (
            !selectedOption ||
            selectedOption.value === ""
        ) {

            alert(
                "Please select " +
                eventType
            );

            return;

        }


        eventId =
            selectedOption.dataset.eventId ||
            "";


        eventName =
            selectedOption.textContent.trim();

    }


    // ------------------------------------------
    // REQUIRED FIELDS
    // ------------------------------------------

    if (matchId === "") {

        alert("Please enter Match ID");
        return;

    }


    if (eventType === "") {

        alert("Please select Event Type");
        return;

    }


    if (matchDate === "") {

        alert("Please select Match Date");
        return;

    }


    if (matchPlace === "") {

        alert("Please enter Place");
        return;

    }


    if (opponent === "") {

        alert("Please enter Opponent");
        return;

    }


    if (result === "") {

        alert("Please enter Result");
        return;

    }


    if (cricHeroesLink === "") {

        alert("Please enter CricHeroes Link");
        return;

    }


    // ------------------------------------------
    // SAVE TO FIRESTORE
    // ------------------------------------------

    try {

        await addDoc(
            collection(db, "matches"),
            {

                matchId: matchId,

                eventId: eventId,

                eventType: eventType,

                eventName: eventName,

                matchDate: matchDate,

                place: matchPlace,

                opponent: opponent,

                overs: overs,

                result: result,

                playerOfMatch:
                    playerOfMatch,

                bestBowler:
                    bestBowler,

                bestBatter:
                    bestBatter,

                fighterOfMatch:
                    fighterOfMatch,

                cricHeroesLink:
                    cricHeroesLink

            }
        );


        alert(
            "Match saved successfully!"
        );


        // --------------------------------------
        // CLEAR FORM
        // --------------------------------------

        document.getElementById("matchId")
            .value = "";

        document.getElementById("matchEventType")
            .value = "";

        document.getElementById("matchDate")
            .value = "";

        document.getElementById("matchPlace")
            .value = "";

        document.getElementById("opponent")
            .value = "";

        document.getElementById("overs")
            .value = "";

        document.getElementById("result")
            .value = "";

        document.getElementById("playerOfMatch")
            .value = "";

        document.getElementById("bestBowler")
            .value = "";

        document.getElementById("bestBatter")
            .value = "";

        document.getElementById("fighterOfMatch")
            .value = "";

        document.getElementById("cricHeroesLink")
            .value = "";


        eventSelectBox.style.display =
            "none";


        eventSelect.innerHTML = `
            <option value="">
                Select Tournament / Series
            </option>
        `;


    } catch (error) {

        console.error(error);


        alert(
            "Error saving match: " +
            error.message
        );

    }

};