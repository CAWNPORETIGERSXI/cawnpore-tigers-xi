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
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================================
// ELEMENTS
// ======================================================

const $ = (id) => document.getElementById(id);

const loginBtn = $("loginBtn");
const resetPasswordBtn = $("resetPasswordBtn");

const loginBox = $("loginBox");
const adminPanel = $("adminPanel");
const loginMsg = $("loginMsg");

const menuBtn = $("menuBtn");
const adminMenu = $("adminMenu");


// ======================================================
// LOGIN
// ======================================================

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        const email = $("email")?.value.trim();
        const password = $("password")?.value || "";

        if (!email || !password) {

            if (loginMsg) {
                loginMsg.innerText =
                    "⚠️ Please enter Email and Password.";

                loginMsg.style.color =
                    "#ff9800";
            }

            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerText = "⏳ LOGGING IN...";

        if (loginMsg) {
            loginMsg.innerText = "Checking login...";
            loginMsg.style.color = "#ff9800";
        }

        try {

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            console.log(
                "LOGIN SUCCESS:",
                result.user.email
            );

            if (loginMsg) {
                loginMsg.innerText =
                    "✅ Login successful!";

                loginMsg.style.color =
                    "#00ff88";
            }

            if (loginBox) {
                loginBox.style.display = "none";
            }

            if (adminPanel) {
                adminPanel.style.display = "block";
            }

        } catch (error) {

            console.error(
                "FIREBASE LOGIN ERROR:",
                error
            );

            let message = "❌ Login failed.";

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
                        "❌ This website domain is not authorized in Firebase.";
                    break;

                default:
                    message =
                        "❌ " +
                        (error.message || "Login failed.");
            }

            if (loginMsg) {
                loginMsg.innerText = message;
                loginMsg.style.color = "#ff4444";
            }

        } finally {

            loginBtn.disabled = false;
            loginBtn.innerText = "LOGIN";
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
                $("email")?.value.trim();

            if (!email) {

                alert(
                    "Please enter your email address first."
                );

                return;
            }

            resetPasswordBtn.disabled = true;
            resetPasswordBtn.innerText = "⏳ SENDING...";

            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );

                alert(
                    "✅ Password reset email sent!\n\n" +
                    "Please check Inbox, Spam/Junk and Promotions."
                );

                if (loginMsg) {

                    loginMsg.innerText =
                        "✅ Password reset email sent.";

                    loginMsg.style.color =
                        "#00ff88";
                }

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

                if (loginMsg) {

                    loginMsg.innerText =
                        "❌ Password reset failed.";

                    loginMsg.style.color =
                        "#ff4444";
                }

            } finally {

                resetPasswordBtn.disabled = false;

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

document
    .querySelectorAll(".menu-item")
    .forEach(button => {

        button.addEventListener("click", async () => {

            const sectionId =
                button.dataset.section;

            document
                .querySelectorAll(".admin-section")
                .forEach(section => {

                    section.classList.remove("active");

                });

            const section =
                $(sectionId);

            if (section) {

                section.classList.add("active");

            }

            if (adminMenu) {

                adminMenu.classList.remove("show");

            }

            if (sectionId === "eventSection") {

                await loadEvents();

            }

            if (sectionId === "matchSection") {

                await loadEventOptions();

            }

            if (sectionId === "registrationSection") {

                await loadRegistrations();

            }

        });

    });


// ======================================================
// EVENTS
// ======================================================

const saveEventBtn =
    $("saveEventBtn");

if (saveEventBtn) {

    saveEventBtn.addEventListener(
        "click",
        saveEvent
    );

}


async function saveEvent() {

    const eventId =
        $("eventId")?.value.trim();

    const eventType =
        $("eventType")?.value;

    const eventName =
        $("eventName")?.value.trim();

    const eventStatus =
        $("eventStatus")?.value || "Active";

    const eventMsg =
        $("eventMsg");

    if (!eventId || !eventType || !eventName) {

        if (eventMsg) {

            eventMsg.innerText =
                "⚠️ Please fill all Event fields.";

            eventMsg.style.color =
                "#ff9800";
        }

        return;
    }

    saveEventBtn.disabled = true;
    saveEventBtn.innerText = "⏳ SAVING...";

    try {

        await addDoc(
            collection(db, "events"),
            {
                eventId,
                eventType,
                eventName,
                status: eventStatus,
                imageUrl: "",
                createdAt: serverTimestamp()
            }
        );

        if (eventMsg) {

            eventMsg.innerText =
                "✅ Event saved successfully.";

            eventMsg.style.color =
                "#00ff88";
        }

        $("eventId").value = "";
        $("eventType").value = "";
        $("eventName").value = "";

        await loadEvents();
        await loadEventOptions();

    } catch (error) {

        console.error(
            "SAVE EVENT ERROR:",
            error
        );

        if (eventMsg) {

            eventMsg.innerText =
                "❌ Event could not be saved.";

            eventMsg.style.color =
                "#ff4444";
        }

    } finally {

        saveEventBtn.disabled = false;
        saveEventBtn.innerText = "💾 SAVE EVENT";
    }
}


// ======================================================
// LOAD EVENTS
// ======================================================

async function loadEvents() {

    const eventList =
        $("eventList");

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
                    ${escapeHTML(
                        data.eventName ||
                        "Unnamed Event"
                    )}
                </h3>

                <p>
                    <strong>Event ID:</strong>
                    ${escapeHTML(
                        data.eventId || "-"
                    )}
                </p>

                <p>
                    <strong>Type:</strong>
                    ${escapeHTML(
                        data.eventType || "-"
                    )}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(
                        data.status || "-"
                    )}
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
    $("addMatchBtn");

const matchForm =
    $("matchForm");

if (addMatchBtn && matchForm) {

    addMatchBtn.addEventListener(
        "click",
        async () => {

            const hidden =
                matchForm.style.display === "none" ||
                !matchForm.style.display;

            if (hidden) {

                matchForm.style.display =
                    "block";

                await loadEventOptions();

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
    $("matchEventType");

const eventSelectBox =
    $("eventSelectBox");

if (matchEventType) {

    matchEventType.addEventListener(
        "change",
        async () => {

            const type =
                matchEventType.value;

            if (
                type === "Tournament" ||
                type === "Series"
            ) {

                if (eventSelectBox) {

                    eventSelectBox.style.display =
                        "block";
                }

                await loadEventOptions(type);

            } else {

                if (eventSelectBox) {

                    eventSelectBox.style.display =
                        "none";
                }

                const eventSelect =
                    $("eventSelect");

                if (eventSelect) {

                    eventSelect.value = "";
                }
            }
        }
    );
}


// ======================================================
// LOAD EVENT OPTIONS
// ======================================================

async function loadEventOptions(
    filterType = ""
) {

    const select =
        $("eventSelect");

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
    $("saveMatchBtn");

if (saveMatchBtn) {

    saveMatchBtn.addEventListener(
        "click",
        saveMatch
    );
}


async function saveMatch() {

    const matchId =
        $("matchId")?.value.trim();

    const eventType =
        $("matchEventType")?.value;

    const eventId =
        $("eventSelect")?.value || "";

    const matchDate =
        $("matchDate")?.value;

    const matchPlace =
        $("matchPlace")?.value.trim();

    const opponent =
        $("opponent")?.value.trim();

    const overs =
        $("overs")?.value.trim();

    const result =
        $("result")?.value.trim();

    const playerOfMatch =
        $("playerOfMatch")?.value.trim();

    const bestBowler =
        $("bestBowler")?.value.trim();

    const bestBatter =
        $("bestBatter")?.value.trim();

    const fighterOfMatch =
        $("fighterOfMatch")?.value.trim();

    const cricHeroesLink =
        $("cricHeroesLink")?.value.trim();


    if (
        !matchId ||
        !eventType ||
        !matchDate ||
        !opponent
    ) {

        alert(
            "⚠️ Please fill Match ID, Event Type, Date and Opponent."
        );

        return;
    }


    if (
        (
            eventType === "Tournament" ||
            eventType === "Series"
        ) &&
        !eventId
    ) {

        alert(
            "⚠️ Please select Tournament / Series."
        );

        return;
    }


    saveMatchBtn.disabled = true;
    saveMatchBtn.innerText = "⏳ SAVING...";


    try {

        await addDoc(
            collection(db, "matches"),
            {

                matchId: matchId,

                eventType: eventType,

                eventId:
                    (
                        eventType === "Tournament" ||
                        eventType === "Series"
                    )
                        ? eventId
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


        clearMatchForm();


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

        saveMatchBtn.disabled = false;
        saveMatchBtn.innerText =
            "💾 SAVE MATCH";
    }
}


// ======================================================
// CLEAR MATCH FORM
// ======================================================

function clearMatchForm() {

    const ids = [

        "matchId",
        "matchEventType",
        "eventSelect",
        "matchDate",
        "matchPlace",
        "opponent",
        "overs",
        "result",
        "playerOfMatch",
        "bestBowler",
        "bestBatter",
        "fighterOfMatch",
        "cricHeroesLink"

    ];

    ids.forEach(id => {

        const element =
            $(id);

        if (element) {

            element.value = "";
        }
    });


    if (eventSelectBox) {

        eventSelectBox.style.display =
            "none";
    }
}


// ======================================================
// PLAYER REGISTRATIONS
// ======================================================

async function loadRegistrations() {

    const list =
        $("registrationList");

    const msg =
        $("registrationMsg");

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

            msg.innerText = "";
        }

        snapshot.forEach(regDoc => {

            const data =
                regDoc.data();

            const card =
                document.createElement("div");

            card.className =
                "registration-card";

            const status =
                data.status || "Pending";

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


        list
            .querySelectorAll(".approve-btn")
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


        list
            .querySelectorAll(".reject-btn")
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

                status: status,

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
// GALLERY PREVIEW
// ======================================================

const galleryImage =
    $("galleryImage");

const galleryPreview =
    $("galleryPreview");

if (galleryImage && galleryPreview) {

    galleryImage.addEventListener(
        "change",
        () => {

            const file =
                galleryImage.files?.[0];

            if (!file) {

                galleryPreview.style.display =
                    "none";

                galleryPreview.src = "";

                return;
            }

            if (!file.type.startsWith("image/")) {

                alert(
                    "⚠️ Please select an image file."
                );

                galleryImage.value = "";

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
// FINAL
// ======================================================

console.log(
    "✅ CAWNPORE TIGERS XI ADMIN.JS LOADED SUCCESSFULLY"
);