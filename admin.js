// ======================================================
// CAWNPORE TIGERS XI
// ADMIN PANEL - COMPLETE JAVASCRIPT
// ======================================================

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
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================================
// CLOUDINARY SETTINGS
// ======================================================
// अगर Cloudinary इस्तेमाल करना है तो यहाँ अपनी details डालें.
//
// Example:
//
// const CLOUDINARY_CLOUD_NAME = "abcd1234";
// const CLOUDINARY_UPLOAD_PRESET = "my_preset";
//
// अभी खाली रहने पर image upload skip होगा.
// ======================================================

const CLOUDINARY_CLOUD_NAME = "";
const CLOUDINARY_UPLOAD_PRESET = "";


// ======================================================
// ELEMENTS
// ======================================================

const loginBtn =
    document.getElementById("loginBtn");

const resetPasswordBtn =
    document.getElementById("resetPasswordBtn");

const loginBox =
    document.getElementById("loginBox");

const adminPanel =
    document.getElementById("adminPanel");

const loginMsg =
    document.getElementById("loginMsg");

const menuBtn =
    document.getElementById("menuBtn");

const adminMenu =
    document.getElementById("adminMenu");


// ======================================================
// FIREBASE CHECK
// ======================================================

console.log("====================================");
console.log("CAWNPORE TIGERS XI ADMIN");
console.log("Firebase Auth:", auth);
console.log("Firestore:", db);
console.log("====================================");


// ======================================================
// HELPER
// ======================================================

function showMessage(element, message, color = "#fff") {

    if (!element) return;

    element.innerText = message;
    element.style.color = color;
}


// ======================================================
// LOGIN
// ======================================================

if (loginBtn) {

    loginBtn.addEventListener("click", async function () {

        const emailElement =
            document.getElementById("email");

        const passwordElement =
            document.getElementById("password");

        const email =
            emailElement
                ? emailElement.value.trim()
                : "";

        const password =
            passwordElement
                ? passwordElement.value
                : "";


        // EMPTY CHECK
        if (!email || !password) {

            showMessage(
                loginMsg,
                "⚠️ Please enter Email and Password.",
                "#ff9800"
            );

            return;
        }


        loginBtn.disabled = true;

        loginBtn.innerText =
            "⏳ LOGGING IN...";

        showMessage(
            loginMsg,
            "Checking login...",
            "#ff9800"
        );


        console.log(
            "LOGIN ATTEMPT:",
            email
        );


        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            console.log(
                "===================================="
            );

            console.log(
                "✅ LOGIN SUCCESS"
            );

            console.log(
                "Email:",
                user.email
            );

            console.log(
                "UID:",
                user.uid
            );

            console.log(
                "===================================="
            );


            showMessage(
                loginMsg,
                "✅ Login successful!",
                "#00ff88"
            );


            // HIDE LOGIN
            if (loginBox) {

                loginBox.style.display =
                    "none";
            }


            // SHOW ADMIN
            if (adminPanel) {

                adminPanel.style.display =
                    "block";
            }


            // LOAD DASHBOARD DATA
            loadEvents();

        }

        catch (error) {

            console.error(
                "===================================="
            );

            console.error(
                "🔥 FIREBASE LOGIN ERROR"
            );

            console.error(
                "ERROR CODE:",
                error.code
            );

            console.error(
                "ERROR MESSAGE:",
                error.message
            );

            console.error(
                "FULL ERROR:",
                error
            );

            console.error(
                "===================================="
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
                        "❌ Admin account not found in Firebase.";

                    break;


                case "auth/wrong-password":

                    message =
                        "❌ Incorrect Password.";

                    break;


                case "auth/too-many-requests":

                    message =
                        "❌ Too many login attempts. Please try later.";

                    break;


                case "auth/network-request-failed":

                    message =
                        "❌ Network error. Please check your internet.";

                    break;


                case "auth/operation-not-allowed":

                    message =
                        "❌ Email/Password login is disabled in Firebase.";

                    break;


                case "auth/unauthorized-domain":

                    message =
                        "❌ This website domain is not authorized in Firebase.";

                    break;


                case "auth/invalid-api-key":

                    message =
                        "❌ Firebase API Key is invalid.";

                    break;


                case "auth/app-not-authorized":

                    message =
                        "❌ This app is not authorized in Firebase.";

                    break;


                default:

                    message =
                        "❌ " +
                        (
                            error.message ||
                            "Firebase login failed."
                        );

                    break;
            }


            showMessage(
                loginMsg,
                message,
                "#ff4444"
            );

        }

        finally {

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
        async function () {

            const emailElement =
                document.getElementById("email");

            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";


            if (!email) {

                showMessage(
                    loginMsg,
                    "⚠️ पहले Email डालिए।",
                    "#ff9800"
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


                showMessage(
                    loginMsg,
                    "✅ Password reset email sent. Inbox, Spam/Junk और Promotions check करें।",
                    "#00ff88"
                );


                alert(
                    "✅ Password reset email sent!\n\n" +
                    "Please check Inbox, Spam/Junk and Promotions."
                );

            }

            catch (error) {

                console.error(
                    "PASSWORD RESET ERROR:",
                    error
                );


                showMessage(
                    loginMsg,
                    "❌ " +
                    (
                        error.message ||
                        "Password reset failed."
                    ),
                    "#ff4444"
                );


                alert(
                    "Password Reset Error\n\n" +
                    "Code: " +
                    (
                        error.code ||
                        "Unknown"
                    ) +
                    "\n\n" +
                    "Message: " +
                    (
                        error.message ||
                        "Unknown error"
                    )
                );

            }

            finally {

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

    menuBtn.addEventListener(
        "click",
        function () {

            adminMenu.classList.toggle(
                "show"
            );

        }
    );

}


// ======================================================
// SECTION NAVIGATION
// ======================================================

document
    .querySelectorAll(".menu-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            async function () {

                const sectionId =
                    button.dataset.section;


                document
                    .querySelectorAll(".admin-section")
                    .forEach(section => {

                        section.classList.remove(
                            "active"
                        );

                    });


                const section =
                    document.getElementById(
                        sectionId
                    );


                if (section) {

                    section.classList.add(
                        "active"
                    );

                }


                if (adminMenu) {

                    adminMenu.classList.remove(
                        "show"
                    );

                }


                // EVENTS
                if (
                    sectionId ===
                    "eventSection"
                ) {

                    await loadEvents();

                }


                // MATCHES
                if (
                    sectionId ===
                    "matchSection"
                ) {

                    await loadEventOptions();

                }


                // REGISTRATIONS
                if (
                    sectionId ===
                    "registrationSection"
                ) {

                    await loadRegistrations();

                }

            }
        );

    });


// ======================================================
// EVENTS
// ======================================================

const saveEventBtn =
    document.getElementById(
        "saveEventBtn"
    );


if (saveEventBtn) {

    saveEventBtn.addEventListener(
        "click",
        saveEvent
    );

}


async function saveEvent() {

    const eventId =
        document
            .getElementById("eventId")
            ?.value
            .trim();


    const eventType =
        document
            .getElementById("eventType")
            ?.value
            .trim();


    const eventName =
        document
            .getElementById("eventName")
            ?.value
            .trim();


    const eventStatus =
        document
            .getElementById("eventStatus")
            ?.value
            .trim();


    const eventImage =
        document
            .getElementById("eventImage");


    const eventMsg =
        document
            .getElementById("eventMsg");


    if (!eventId ||
        !eventType ||
        !eventName) {

        showMessage(
            eventMsg,
            "⚠️ Event ID, Type और Name जरूरी हैं।",
            "#ff9800"
        );

        return;
    }


    saveEventBtn.disabled =
        true;

    saveEventBtn.innerText =
        "⏳ SAVING...";


    try {

        let imageUrl = "";


        // OPTIONAL CLOUDINARY UPLOAD
        if (
            eventImage &&
            eventImage.files &&
            eventImage.files.length > 0
        ) {

            if (
                CLOUDINARY_CLOUD_NAME &&
                CLOUDINARY_UPLOAD_PRESET
            ) {

                imageUrl =
                    await uploadToCloudinary(
                        eventImage.files[0]
                    );

            }

        }


        await addDoc(
            collection(
                db,
                "events"
            ),
            {

                eventId:
                    eventId,

                eventType:
                    eventType,

                eventName:
                    eventName,

                status:
                    eventStatus || "Active",

                imageUrl:
                    imageUrl,

                createdAt:
                    serverTimestamp()

            }
        );


        showMessage(
            eventMsg,
            "✅ Event successfully saved!",
            "#00ff88"
        );


        // CLEAR FORM
        document.getElementById(
            "eventId"
        ).value = "";

        document.getElementById(
            "eventName"
        ).value = "";

        document.getElementById(
            "eventType"
        ).value = "";

        if (eventImage) {

            eventImage.value = "";

        }


        await loadEvents();

    }

    catch (error) {

        console.error(
            "SAVE EVENT ERROR:",
            error
        );


        showMessage(
            eventMsg,
            "❌ Event save failed: " +
            (
                error.message ||
                "Unknown error"
            ),
            "#ff4444"
        );

    }

    finally {

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
        document.getElementById(
            "eventList"
        );


    if (!eventList) return;


    eventList.innerHTML =
        "⏳ Loading events...";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "events"
                )
            );


        if (snapshot.empty) {

            eventList.innerHTML =
                "<p style='text-align:center;color:#aaa;'>No events found.</p>";

            return;
        }


        eventList.innerHTML = "";


        snapshot.forEach(
            eventDoc => {

                const data =
                    eventDoc.data();


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "event-card";


                const status =
                    data.status ||
                    "Active";


                const statusColor =
                    status === "Completed"
                        ? "#ff4444"
                        : "#00c853";


                card.innerHTML = `

                    ${
                        data.imageUrl
                            ? `
                            <img
                                src="${escapeHtml(data.imageUrl)}"
                                alt="Event Image"
                            >
                            `
                            : ""
                    }

                    <h3>
                        ${escapeHtml(
                            data.eventName ||
                            "Unnamed Event"
                        )}
                    </h3>

                    <p>
                        <strong>Event ID:</strong>
                        ${escapeHtml(
                            data.eventId || ""
                        )}
                    </p>

                    <p>
                        <strong>Type:</strong>
                        ${escapeHtml(
                            data.eventType || ""
                        )}
                    </p>

                    <p>
                        <strong>Status:</strong>

                        <span
                            style="
                                color:${statusColor};
                                font-weight:bold;
                            "
                        >
                            ● ${escapeHtml(status)}
                        </span>
                    </p>

                `;


                eventList.appendChild(
                    card
                );

            }
        );

    }

    catch (error) {

        console.error(
            "LOAD EVENTS ERROR:",
            error
        );


        eventList.innerHTML =
            "<p style='color:#ff4444;text-align:center;'>❌ Events load failed.</p>";

    }

}


// ======================================================
// MATCH FORM
// ======================================================

const addMatchBtn =
    document.getElementById(
        "addMatchBtn"
    );


const matchForm =
    document.getElementById(
        "matchForm"
    );


if (addMatchBtn && matchForm) {

    addMatchBtn.addEventListener(
        "click",
        function () {

            if (
                matchForm.style.display ===
                "block"
            ) {

                matchForm.style.display =
                    "none";

            }

            else {

                matchForm.style.display =
                    "block";

            }

        }
    );

}


// ======================================================
// MATCH EVENT TYPE
// ======================================================

const matchEventType =
    document.getElementById(
        "matchEventType"
    );


const eventSelectBox =
    document.getElementById(
        "eventSelectBox"
    );


if (matchEventType) {

    matchEventType.addEventListener(
        "change",
        async function () {

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

                await loadEventOptions(
                    type
                );

            }

            else {

                if (eventSelectBox) {

                    eventSelectBox.style.display =
                        "none";

                }

            }

        }
    );

}


// ======================================================
// LOAD EVENT OPTIONS
// ======================================================

async function loadEventOptions(
    selectedType = ""
) {

    const eventSelect =
        document.getElementById(
            "eventSelect"
        );


    if (!eventSelect) return;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "events"
                )
            );


        eventSelect.innerHTML =
            `
            <option value="">
                Select Tournament / Series
            </option>
            `;


        snapshot.forEach(
            eventDoc => {

                const data =
                    eventDoc.data();


                if (
                    selectedType &&
                    data.eventType !==
                    selectedType
                ) {

                    return;

                }


                if (
                    data.eventType ===
                    "Tournament" ||
                    data.eventType ===
                    "Series"
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        data.eventId || "";


                    option.textContent =
                        (
                            data.eventName ||
                            data.eventId ||
                            "Unnamed Event"
                        );


                    eventSelect.appendChild(
                        option
                    );

                }

            }
        );

    }

    catch (error) {

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
    document.getElementById(
        "saveMatchBtn"
    );


if (saveMatchBtn) {

    saveMatchBtn.addEventListener(
        "click",
        saveMatch
    );

}


async function saveMatch() {

    const matchId =
        getValue("matchId");


    const matchEventTypeValue =
        getValue("matchEventType");


    const eventId =
        getValue("eventSelect");


    const matchDate =
        getValue("matchDate");


    const matchPlace =
        getValue("matchPlace");


    const opponent =
        getValue("opponent");


    const overs =
        getValue("overs");


    const result =
        getValue("result");


    const playerOfMatch =
        getValue("playerOfMatch");


    const bestBowler =
        getValue("bestBowler");


    const bestBatter =
        getValue("bestBatter");


    const fighterOfMatch =
        getValue("fighterOfMatch");


    const cricHeroesLink =
        getValue("cricHeroesLink");


    if (
        !matchId ||
        !matchEventTypeValue ||
        !matchDate ||
        !opponent
    ) {

        alert(
            "⚠️ Match ID, Event Type, Date और Opponent जरूरी हैं।"
        );

        return;
    }


    if (
        (
            matchEventTypeValue ===
            "Tournament" ||
            matchEventTypeValue ===
            "Series"
        ) &&
        !eventId
    ) {

        alert(
            "⚠️ कृपया Tournament / Series select करें।"
        );

        return;
    }


    saveMatchBtn.disabled =
        true;

    saveMatchBtn.innerText =
        "⏳ SAVING...";


    try {

        await addDoc(
            collection(
                db,
                "matches"
            ),
            {

                matchId:
                    matchId,

                eventType:
                    matchEventTypeValue,

                eventId:
                    (
                        matchEventTypeValue ===
                        "Individual Matches"
                    )
                        ? ""
                        : eventId,

                date:
                    formatDate(
                        matchDate
                    ),

                dateISO:
                    matchDate,

                place:
                    matchPlace,

                opponent:
                    opponent,

                overs:
                    overs,

                result:
                    result,

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
            "✅ Match successfully saved!"
        );


        clearMatchForm();


    }

    catch (error) {

        console.error(
            "SAVE MATCH ERROR:",
            error
        );


        alert(
            "❌ Match save failed.\n\n" +
            (
                error.message ||
                "Unknown error"
            )
        );

    }

    finally {

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
        document.getElementById(
            "registrationList"
        );


    const msg =
        document.getElementById(
            "registrationMsg"
        );


    if (!list) return;


    showMessage(
        msg,
        "⏳ Loading registrations...",
        "#ff9800"
    );


    list.innerHTML = "";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "registrations"
                )
            );


        if (snapshot.empty) {

            showMessage(
                msg,
                "No registrations found.",
                "#aaa"
            );

            return;
        }


        showMessage(
            msg,
            `${snapshot.size} registration(s) found.`,
            "#00ff88"
        );


        snapshot.forEach(
            registrationDoc => {

                const data =
                    registrationDoc.data();


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "registration-card";


                const status =
                    data.status ||
                    "Pending";


                let statusClass =
                    "status-pending";


                if (
                    status.toLowerCase() ===
                    "approved"
                ) {

                    statusClass =
                        "status-approved";

                }

                else if (
                    status.toLowerCase() ===
                    "rejected"
                ) {

                    statusClass =
                        "status-rejected";

                }


                card.innerHTML = `

                    <div class="registration-info">

                        <p>
                            <strong>Name:</strong>
                            ${escapeHtml(
                                data.name ||
                                data.fullName ||
                                "-"
                            )}
                        </p>

                        <p>
                            <strong>Phone:</strong>
                            ${escapeHtml(
                                data.phone ||
                                data.mobile ||
                                "-"
                            )}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${escapeHtml(
                                data.email ||
                                "-"
                            )}
                        </p>

                        <p>
                            <strong>Role:</strong>
                            ${escapeHtml(
                                data.role ||
                                "-"
                            )}
                        </p>

                        <span
                            class="registration-status ${statusClass}"
                        >
                            ${escapeHtml(status)}
                        </span>

                    </div>

                    <div class="registration-actions">

                        <button
                            type="button"
                            class="approve-btn"
                            data-id="${registrationDoc.id}"
                        >
                            ✅ APPROVE
                        </button>

                        <button
                            type="button"
                            class="reject-btn"
                            data-id="${registrationDoc.id}"
                        >
                            ❌ REJECT
                        </button>

                    </div>

                `;


                const approveBtn =
                    card.querySelector(
                        ".approve-btn"
                    );


                const rejectBtn =
                    card.querySelector(
                        ".reject-btn"
                    );


                if (approveBtn) {

                    approveBtn.addEventListener(
                        "click",
                        () =>
                            updateRegistrationStatus(
                                registrationDoc.id,
                                "Approved"
                            )
                    );

                }


                if (rejectBtn) {

                    rejectBtn.addEventListener(
                        "click",
                        () =>
                            updateRegistrationStatus(
                                registrationDoc.id,
                                "Rejected"
                            )
                    );

                }


                list.appendChild(
                    card
                );

            }
        );

    }

    catch (error) {

        console.error(
            "LOAD REGISTRATIONS ERROR:",
            error
        );


        showMessage(
            msg,
            "❌ Registrations load failed: " +
            (
                error.message ||
                ""
            ),
            "#ff4444"
        );

    }

}


// ======================================================
// UPDATE REGISTRATION
// ======================================================

async function updateRegistrationStatus(
    registrationId,
    status
) {

    if (!registrationId) return;


    try {

        await updateDoc(
            doc(
                db,
                "registrations",
                registrationId
            ),
            {

                status:
                    status,

                updatedAt:
                    serverTimestamp()

            }
        );


        alert(
            "✅ Registration " +
            status.toLowerCase() +
            "."
        );


        await loadRegistrations();

    }

    catch (error) {

        console.error(
            "UPDATE REGISTRATION ERROR:",
            error
        );


        alert(
            "❌ Status update failed.\n\n" +
            (
                error.message ||
                "Unknown error"
            )
        );

    }

}


// ======================================================
// GALLERY
// ======================================================

const galleryImage =
    document.getElementById(
        "galleryImage"
    );


const galleryPreview =
    document.getElementById(
        "galleryPreview"
    );


if (galleryImage && galleryPreview) {

    galleryImage.addEventListener(
        "change",
        function () {

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
                function (event) {

                    galleryPreview.src =
                        event.target.result;

                    galleryPreview.style.display =
                        "block";

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ======================================================
// GALLERY UPLOAD BUTTON
// ======================================================

const uploadGalleryBtn =
    document.getElementById(
        "uploadGalleryBtn"
    );


if (uploadGalleryBtn) {

    uploadGalleryBtn.addEventListener(
        "click",
        uploadGallery
    );

}


async function uploadGallery() {

    const galleryMsg =
        document.getElementById(
            "galleryMsg"
        );


    if (
        !galleryImage ||
        !galleryImage.files ||
        galleryImage.files.length === 0
    ) {

        showMessage(
            galleryMsg,
            "⚠️ पहले photo select करें।",
            "#ff9800"
        );

        return;
    }


    if (
        !CLOUDINARY_CLOUD_NAME ||
        !CLOUDINARY_UPLOAD_PRESET
    ) {

        showMessage(
            galleryMsg,
            "⚠️ Cloudinary settings अभी admin.js में डालनी बाकी हैं।",
            "#ff9800"
        );

        return;
    }


    uploadGalleryBtn.disabled =
        true;

    uploadGalleryBtn.innerText =
        "⏳ UPLOADING...";


    try {

        let uploaded =
            0;


        const files =
            Array.from(
                galleryImage.files
            );


        for (
            const file of files
        ) {

            const imageUrl =
                await uploadToCloudinary(
                    file
                );


            await addDoc(
                collection(
                    db,
                    "gallery"
                ),
                {

                    imageUrl:
                        imageUrl,

                    fileName:
                        file.name,

                    createdAt:
                        serverTimestamp()

                }
            );


            uploaded++;

        }


        showMessage(
            galleryMsg,
            `✅ ${uploaded} photo(s) uploaded successfully!`,
            "#00ff88"
        );


        galleryImage.value = "";


        if (galleryPreview) {

            galleryPreview.style.display =
                "none";

        }

    }

    catch (error) {

        console.error(
            "GALLERY UPLOAD ERROR:",
            error
        );


        showMessage(
            galleryMsg,
            "❌ Gallery upload failed: " +
            (
                error.message ||
                "Unknown error"
            ),
            "#ff4444"
        );

    }

    finally {

        uploadGalleryBtn.disabled =
            false;

        uploadGalleryBtn.innerText =
            "📤 UPLOAD PHOTOS";

    }

}


// ======================================================
// CLOUDINARY UPLOAD
// ======================================================

async function uploadToCloudinary(
    file
) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );


    const response =
        await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {

                method:
                    "POST",

                body:
                    formData

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.error?.message ||
            "Cloudinary upload failed."
        );

    }


    return data.secure_url;

}


// ======================================================
// UTILITY - GET VALUE
// ======================================================

function getValue(id) {

    const element =
        document.getElementById(id);


    return element
        ? element.value.trim()
        : "";

}


// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(
    dateString
) {

    if (!dateString) return "";


    const parts =
        dateString.split("-");


    if (parts.length !== 3) {

        return dateString;

    }


    const year =
        parts[0];

    const month =
        parts[1];

    const day =
        parts[2];


    return (
        day +
        "-" +
        month +
        "-" +
        year
    );

}


// ======================================================
// CLEAR MATCH FORM
// ======================================================

function clearMatchForm() {

    const ids = [

        "matchId",
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


    ids.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value =
                    "";

            }

        }
    );


    const matchEventType =
        document.getElementById(
            "matchEventType"
        );


    if (matchEventType) {

        matchEventType.value =
            "";

    }


    const eventSelect =
        document.getElementById(
            "eventSelect"
        );


    if (eventSelect) {

        eventSelect.value =
            "";

    }


    const eventSelectBox =
        document.getElementById(
            "eventSelectBox"
        );


    if (eventSelectBox) {

        eventSelectBox.style.display =
            "none";

    }

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================================
// INITIAL MESSAGE
// ======================================================

console.log(
    "✅ Complete admin.js loaded successfully."
);