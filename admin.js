import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================================
// ELEMENTS
// ======================================================

const loginBtn = document.getElementById("loginBtn");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");

const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");

const loginMsg = document.getElementById("loginMsg");

const menuBtn = document.getElementById("menuBtn");
const adminMenu = document.getElementById("adminMenu");


// ======================================================
// LOGIN
// ======================================================

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        const email =
            document.getElementById("email")?.value.trim();

        const password =
            document.getElementById("password")?.value || "";


        if (!email || !password) {

            loginMsg.innerText =
                "⚠️ Please enter Email and Password.";

            loginMsg.style.color = "#ff9800";

            return;
        }


        loginBtn.disabled = true;
        loginBtn.innerText = "⏳ LOGGING IN...";

        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            console.log(
                "LOGIN SUCCESS:",
                userCredential.user.email
            );


            loginMsg.innerText =
                "✅ Login successful!";

            loginMsg.style.color =
                "#00ff88";


            loginBox.style.display =
                "none";

            adminPanel.style.display =
                "block";


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            let message =
                "❌ Login failed.";


            switch (error.code) {

                case "auth/invalid-credential":
                    message =
                        "❌ Invalid Email or Password.";
                    break;

                case "auth/invalid-email":
                    message =
                        "❌ Invalid Email Address.";
                    break;

                case "auth/user-not-found":
                    message =
                        "❌ Admin account not found.";
                    break;

                case "auth/wrong-password":
                    message =
                        "❌ Incorrect Password.";
                    break;

                case "auth/too-many-requests":
                    message =
                        "❌ Too many attempts. Please try later.";
                    break;

                case "auth/network-request-failed":
                    message =
                        "❌ Network error. Check your internet.";
                    break;

                case "auth/operation-not-allowed":
                    message =
                        "❌ Email/Password login is disabled.";
                    break;

                case "auth/unauthorized-domain":
                    message =
                        "❌ Website domain is not authorized in Firebase.";
                    break;

                default:
                    message =
                        "❌ " +
                        (error.message || "Login failed.");
            }


            loginMsg.innerText =
                message;

            loginMsg.style.color =
                "#ff4444";


        } finally {

            loginBtn.disabled =
                false;

            loginBtn.innerText =
                "LOGIN";
        }

    });

}


// ======================================================
// PASSWORD RESET
// ======================================================

if (resetPasswordBtn) {

    resetPasswordBtn.addEventListener(
        "click",
        async () => {

            const email =
                document.getElementById("email")?.value.trim();


            if (!email) {

                alert(
                    "Please enter your email address first."
                );

                return;
            }


            resetPasswordBtn.disabled =
                true;

            resetPasswordBtn.innerText =
                "⏳ SENDING...";


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                alert(
                    "✅ Password reset email sent!\n\n" +
                    "Please check your Inbox, Spam/Junk and Promotions."
                );


                loginMsg.innerText =
                    "✅ Password reset email sent.";

                loginMsg.style.color =
                    "#00ff88";


            } catch (error) {

                console.error(
                    "PASSWORD RESET ERROR:",
                    error
                );


                alert(
                    "Password Reset Error\n\n" +
                    "Code: " +
                    (error.code || "Unknown") +
                    "\n\n" +
                    "Message: " +
                    (error.message || "Unknown error")
                );


                loginMsg.innerText =
                    "❌ Password reset failed.";

                loginMsg.style.color =
                    "#ff4444";


            } finally {

                resetPasswordBtn.disabled =
                    false;

                resetPasswordBtn.innerText =
                    "🔑 RESET PASSWORD";
            }

        }
    );

}


// ======================================================
// ADMIN MENU
// ======================================================

if (menuBtn && adminMenu) {

    menuBtn.addEventListener("click", () => {

        adminMenu.classList.toggle("show");

    });

}


// ======================================================
// SECTION NAVIGATION
// ======================================================

document.querySelectorAll(".menu-item")
    .forEach(button => {

        button.addEventListener("click", () => {

            const sectionId =
                button.dataset.section;


            document
                .querySelectorAll(".admin-section")
                .forEach(section => {

                    section.classList.remove("active");

                });


            const section =
                document.getElementById(sectionId);


            if (section) {

                section.classList.add("active");

            }


            if (adminMenu) {

                adminMenu.classList.remove("show");

            }


            if (sectionId === "eventSection") {

                loadEvents();

            }


            if (sectionId === "matchSection") {

                loadEventOptions();

            }


            if (sectionId === "registrationSection") {

                loadRegistrations();

            }

        });

    });


// ======================================================
// EVENTS
// ======================================================

const saveEventBtn =
    document.getElementById("saveEventBtn");


if (saveEventBtn) {

    saveEventBtn.addEventListener(
        "click",
        saveEvent
    );

}


async function saveEvent() {

    const eventId =
        document.getElementById("eventId")?.value.trim();

    const eventType =
        document.getElementById("eventType")?.value;

    const eventName =
        document.getElementById("eventName")?.value.trim();

    const eventStatus =
        document.getElementById("eventStatus")?.value;


    const eventMsg =
        document.getElementById("eventMsg");


    if (!eventId || !eventType || !eventName) {

        eventMsg.innerText =
            "⚠️ Please fill all Event fields.";

        eventMsg.style.color =
            "#ff9800";

        return;
    }


    saveEventBtn.disabled =
        true;

    saveEventBtn.innerText =
        "⏳ SAVING...";


    try {

        await addDoc(
            collection(db, "events"),
            {

                eventId: eventId,

                eventType: eventType,

                eventName: eventName,

                status: eventStatus || "Active",

                imageUrl: "",

                createdAt:
                    serverTimestamp()

            }
        );


        eventMsg.innerText =
            "✅ Event saved successfully.";

        eventMsg.style.color =
            "#00ff88";


        document.getElementById("eventId").value = "";
        document.getElementById("eventType").value = "";
        document.getElementById("eventName").value = "";


        await loadEvents();
        await loadEventOptions();


    } catch (error) {

        console.error(
            "SAVE EVENT ERROR:",
            error
        );


        eventMsg.innerText =
            "❌ Event could not be saved.";

        eventMsg.style.color =
            "#ff4444";

    } finally {

        saveEventBtn.disabled =
            false;

        saveEventBtn.innerText =
            "💾 SAVE EVENT";
    }

}


// ======================================================
// LOAD EVENTS
// ======================================================

async function loadEvents() {

    const eventList =
        document.getElementById("eventList");


    if (!eventList) return;


    eventList.innerHTML =
        "⏳ Loading events...";


    try {

        const snapshot =
            await getDocs(
                collection(db, "events")
            );


        eventList.innerHTML = "";


        if (snapshot.empty) {

            eventList.innerHTML =
                "<p>No events found.</p>";

            return;
        }


        snapshot.forEach(eventDoc => {

            const data =
                eventDoc.data();


            const card =
                document.createElement("div");

            card.className =
                "event-card";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(data.eventName || "Unnamed Event")}
                </h3>

                <p>
                    <strong>Event ID:</strong>
                    ${escapeHTML(data.eventId || "-")}
                </p>

                <p>
                    <strong>Type:</strong>
                    ${escapeHTML(data.eventType || "-")}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(data.status || "-")}
                </p>

            `;


            eventList.appendChild(card);

        });


    } catch (error) {

        console.error(
            "LOAD EVENTS ERROR:",
            error
        );


        eventList.innerHTML =
            "<p>❌ Unable to load events.</p>";
    }

}


// ======================================================
// MATCH FORM
// ======================================================

const addMatchBtn =
    document.getElementById("addMatchBtn");

const matchForm =
    document.getElementById("matchForm");


if (addMatchBtn && matchForm) {

    addMatchBtn.addEventListener(
        "click",
        () => {

            if (
                matchForm.style.display === "none" ||
                !matchForm.style.display
            ) {

                matchForm.style.display =
                    "block";

                loadEventOptions();

            } else {

                matchForm.style.display =
                    "none";

            }

        }
    );

}


// ======================================================
// MATCH EVENT TYPE
// ======================================================

const matchEventType =
    document.getElementById("matchEventType");

const eventSelectBox =
    document.getElementById("eventSelectBox");


if (matchEventType) {

    matchEventType.addEventListener(
        "change",
        () => {

            const type =
                matchEventType.value;


            if (
                type === "Tournament" ||
                type === "Series"
            ) {

                eventSelectBox.style.display =
                    "block";

                loadEventOptions(type);

            } else {

                eventSelectBox.style.display =
                    "none";

            }

        }
    );

}


// ======================================================
// LOAD EVENT OPTIONS
// ======================================================

async function loadEventOptions(filterType = "") {

    const select =
        document.getElementById("eventSelect");


    if (!select) return;


    select.innerHTML = `
        <option value="">
            Select Tournament / Series
        </option>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(db, "events")
            );


        snapshot.forEach(eventDoc => {

            const data =
                eventDoc.data();


            if (
                filterType &&
                data.eventType !== filterType
            ) {
                return;
            }


            if (
                data.eventType !== "Tournament" &&
                data.eventType !== "Series"
            ) {
                return;
            }


            const option =
                document.createElement("option");


            option.value =
                data.eventId || "";


            option.textContent =
                data.eventName ||
                data.eventId ||
                "Unnamed Event";


            select.appendChild(option);

        });


    } catch (error) {

        console.error(
            "LOAD EVENT OPTIONS ERROR:",
            error
        );
    }

}


// ======================================================
// SAVE MATCH
// ======================================================

const saveMatchBtn =
    document.getElementById("saveMatchBtn");


if (saveMatchBtn) {

    saveMatchBtn.addEventListener(
        "click",
        saveMatch
    );

}


async function saveMatch() {

    const matchId =
        document.getElementById("matchId")?.value.trim();

    const matchEventType =
        document.getElementById("matchEventType")?.value;

    const eventSelect =
        document.getElementById("eventSelect")?.value;

    const matchDate =
        document.getElementById("matchDate")?.value;

    const matchPlace =
        document.getElementById("matchPlace")?.value.trim();

    const opponent =
        document.getElementById("opponent")?.value.trim();

    const overs =
        document.getElementById("overs")?.value.trim();

    const result =
        document.getElementById("result")?.value.trim();

    const playerOfMatch =
        document.getElementById("playerOfMatch")?.value.trim();

    const bestBowler =
        document.getElementById("bestBowler")?.value.trim();

    const bestBatter =
        document.getElementById("bestBatter")?.value.trim();

    const fighterOfMatch =
        document.getElementById("fighterOfMatch")?.value.trim();

    const cricHeroesLink =
        document.getElementById("cricHeroesLink")?.value.trim();


    if (
        !matchId ||
        !matchEventType ||
        !matchDate ||
        !opponent
    ) {

        alert(
            "Please fill Match ID, Event Type, Date and Opponent."
        );

        return;
    }


    if (
        (
            matchEventType === "Tournament" ||
            matchEventType === "Series"
        ) &&
        !eventSelect
    ) {

        alert(
            "Please select Tournament / Series."
        );

        return;
    }


    saveMatchBtn.disabled =
        true;

    saveMatchBtn.innerText =
        "⏳ SAVING...";


    try {

        await addDoc(
            collection(db, "matches"),
            {

                matchId: matchId,

                eventType: matchEventType,

                eventId:
                    (
                        matchEventType === "Tournament" ||
                        matchEventType === "Series"
                    )
                        ? eventSelect
                        : "",

                date: matchDate,

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
                    cricHeroesLink,

                createdAt:
                    serverTimestamp()

            }
        );


        alert(
            "✅ Match saved successfully!"
        );


        document.getElementById("matchId").value = "";
        document.getElementById("matchEventType").value = "";
        document.getElementById("eventSelect").value = "";
        document.getElementById("matchDate").value = "";
        document.getElementById("matchPlace").value = "";
        document.getElementById("opponent").value = "";
        document.getElementById("overs").value = "";
        document.getElementById("result").value = "";
        document.getElementById("playerOfMatch").value = "";
        document.getElementById("bestBowler").value = "";
        document.getElementById("bestBatter").value = "";
        document.getElementById("fighterOfMatch").value = "";
        document.getElementById("cricHeroesLink").value = "";


    } catch (error) {

        console.error(
            "SAVE MATCH ERROR:",
            error
        );


        alert(
            "❌ Match could not be saved.\n\n" +
            error.message
        );


    } finally {

        saveMatchBtn.disabled =
            false;

        saveMatchBtn.innerText =
            "💾 SAVE MATCH";
    }

}


// ======================================================
// PLAYER REGISTRATIONS
// ======================================================

async function loadRegistrations() {

    const list =
        document.getElementById("registrationList");

    const msg =
        document.getElementById("registrationMsg");


    if (!list) return;


    list.innerHTML = "";

    if (msg) {

        msg.innerText =
            "⏳ Loading registrations...";

    }


    try {

        const snapshot =
            await getDocs(
                collection(db, "registrations")
            );


        if (snapshot.empty) {

            if (msg) {

                msg.innerText =
                    "No registrations found.";

            }

            return;
        }


        if (msg) {

            msg.innerText =
                "";
        }


        snapshot.forEach(regDoc => {

            const data =
                regDoc.data();


            const card =
                document.createElement("div");

            card.className =
                "registration-card";


            const status =
                data.status ||
                "Pending";


            card.innerHTML = `

                <div class="registration-info">

                    <strong>
                        ${escapeHTML(
                            data.name ||
                            data.playerName ||
                            "Player"
                        )}
                    </strong>

                    <br>

                    Email:
                    ${escapeHTML(
                        data.email || "-"
                    )}

                    <br>

                    Phone:
                    ${escapeHTML(
                        data.phone || "-"
                    )}

                    <br>

                    Status:
                    <span class="registration-status
                        ${
                            status === "Approved"
                                ? "status-approved"
                                : status === "Rejected"
                                    ? "status-rejected"
                                    : "status-pending"
                        }">

                        ${escapeHTML(status)}

                    </span>

                </div>


                <div class="registration-actions">

                    <button
                        type="button"
                        class="approve-btn"
                        data-id="${regDoc.id}"
                    >
                        ✅ APPROVE
                    </button>


                    <button
                        type="button"
                        class="reject-btn"
                        data-id="${regDoc.id}"
                    >
                        ❌ REJECT
                    </button>

                </div>

            `;


            list.appendChild(card);

        });


        list.querySelectorAll(".approve-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () =>
                        updateRegistration(
                            button.dataset.id,
                            "Approved"
                        )
                );

            });


        list.querySelectorAll(".reject-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () =>
                        updateRegistration(
                            button.dataset.id,
                            "Rejected"
                        )
                );

            });


    } catch (error) {

        console.error(
            "REGISTRATION ERROR:",
            error
        );


        if (msg) {

            msg.innerText =
                "❌ Unable to load registrations.";

        }

    }

}


// ======================================================
// UPDATE REGISTRATION
// ======================================================

async function updateRegistration(
    id,
    status
) {

    try {

        await updateDoc(
            doc(
                db,
                "registrations",
                id
            ),
            {

                status:
                    status,

                updatedAt:
                    serverTimestamp()

            }
        );


        await loadRegistrations();


    } catch (error) {

        console.error(
            "UPDATE REGISTRATION ERROR:",
            error
        );


        alert(
            "❌ Could not update registration.\n\n" +
            error.message
        );

    }

}


// ======================================================
// GALLERY
// ======================================================

const galleryImage =
    document.getElementById("galleryImage");


const galleryPreview =
    document.getElementById("galleryPreview");


const galleryMsg =
    document.getElementById("galleryMsg");


if (galleryImage && galleryPreview) {

    galleryImage.addEventListener(
        "change",
        () => {

            const file =
                galleryImage.files?.[0];


            if (!file) {

                galleryPreview.style.display =
                    "none";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    galleryPreview.src =
                        event.target.result;

                    galleryPreview.style.display =
                        "block";

                };


            reader.readAsDataURL(file);

        }
    );

}


// ======================================================
// HTML ESCAPE
// ======================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ======================================================
// INITIAL STATE
// ======================================================

console.log(
    "✅ CAWNPORE TIGERS XI Admin JS Loaded"
);