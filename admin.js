import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================================
// CLOUDINARY
// ======================================================

const CLOUDINARY_CLOUD_NAME = "ax0fx3uh";
const CLOUDINARY_UPLOAD_PRESET = "tigers_images";


// ======================================================
// LOGIN
// ======================================================

const loginBtn = document.getElementById("loginBtn");
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const loginMsg = document.getElementById("loginMsg");


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

            if (loginMsg) {

                loginMsg.innerText =
                    "⚠️ Enter Email & Password";

                loginMsg.style.color =
                    "#ff9800";

            }

            return;

        }


        try {

            loginBtn.disabled = true;

            loginBtn.innerText =
                "⏳ LOGGING IN...";


            if (loginMsg) {

                loginMsg.innerText =
                    "Checking login...";

                loginMsg.style.color =
                    "#ff9800";

            }


            // ==========================================
            // FIREBASE AUTHENTICATION
            // ==========================================

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


            if (loginMsg) {

                loginMsg.innerText =
                    "✅ Login successful!";

                loginMsg.style.color =
                    "#00ff88";

            }


            // ==========================================
            // HIDE LOGIN
            // ==========================================

            if (loginBox) {

                loginBox.style.display =
                    "none";

            }


            // ==========================================
            // SHOW ADMIN PANEL
            // ==========================================

            if (adminPanel) {

                adminPanel.style.display =
                    "block";

            }


            // ==========================================
            // LOAD DATA
            // ==========================================

            loadEvents();

            loadPlayerRegistrations();

        }


        catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            console.log(
                "FIREBASE ERROR CODE:",
                error.code
            );


            console.log(
                "FIREBASE ERROR MESSAGE:",
                error.message
            );


            // ==========================================
            // EXACT ERROR POPUP
            // ==========================================

            alert(
                "Firebase Login Error\n\n" +
                "Code: " +
                (error.code || "Unknown") +
                "\n\n" +
                "Message: " +
                (error.message || "Unknown error")
            );


            let message =
                error.message ||
                "Login failed";


            // ==========================================
            // FRIENDLY ERROR MESSAGES
            // ==========================================

            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                message =
                    "Invalid Email or Password.";

            }


            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message =
                    "Invalid Email Address.";

            }


            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                message =
                    "Admin account not found.";

            }


            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                message =
                    "Incorrect Password.";

            }


            else if (
                error.code ===
                "auth/too-many-requests"
            ) {

                message =
                    "Too many login attempts. Please try again later.";

            }


            else if (
                error.code ===
                "auth/network-request-failed"
            ) {

                message =
                    "Network error. Please check your internet connection.";

            }


            else if (
                error.code ===
                "auth/operation-not-allowed"
            ) {

                message =
                    "Email/Password login is disabled in Firebase.";

            }


            else if (
                error.code ===
                "auth/unauthorized-domain"
            ) {

                message =
                    "This website domain is not authorized in Firebase.";

            }


            else if (
                error.code ===
                "auth/api-key-not-valid"
            ) {

                message =
                    "Firebase API Key is not valid.";

            }


            // ==========================================
            // SHOW ERROR ON PAGE
            // ==========================================

            if (loginMsg) {

                loginMsg.innerText =
                    "❌ " + message;

                loginMsg.style.color =
                    "#ff4444";

            }


            loginBtn.disabled =
                false;

            loginBtn.innerText =
                "LOGIN";

        }

    });

}


// ======================================================
// PLAYER REGISTRATIONS
// ======================================================

async function loadPlayerRegistrations() {

    const registrationList =
        document.getElementById(
            "registrationList"
        );


    const registrationMsg =
        document.getElementById(
            "registrationMsg"
        );


    if (!registrationList) {
        return;
    }


    registrationList.innerHTML = "";


    if (registrationMsg) {

        registrationMsg.innerText =
            "⏳ Loading pending registrations...";

    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "playerRegistrations"
                )
            );


        let count = 0;


        snapshot.forEach(
            (registrationDoc) => {

                const player =
                    registrationDoc.data();


                if (
                    player.status !==
                    "Pending"
                ) {

                    return;

                }


                count++;


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "registration-card";


                const title =
                    document.createElement(
                        "h3"
                    );


                title.innerText =
                    player.fullName ||
                    "Unnamed Player";


                card.appendChild(title);


                const idText =
                    document.createElement(
                        "div"
                    );


                idText.className =
                    "registration-info";


                idText.innerHTML =
                    "<strong>Registration ID:</strong> " +
                    escapeHtml(
                        player.registrationId || "-"
                    );


                card.appendChild(idText);


                const details =
                    document.createElement(
                        "div"
                    );


                details.className =
                    "registration-info";


                details.innerHTML = `

                    <strong>Mobile:</strong>
                    ${escapeHtml(player.mobile || "-")}

                    <br>

                    <strong>Date of Birth:</strong>
                    ${escapeHtml(player.dateOfBirth || "-")}

                    <br>

                    <strong>City:</strong>
                    ${escapeHtml(player.city || "-")}

                    <br>

                    <strong>Playing Role:</strong>
                    ${escapeHtml(player.playingRole || "-")}

                    <br>

                    <strong>Batting Style:</strong>
                    ${escapeHtml(player.battingStyle || "-")}

                    <br>

                    <strong>Bowling Style:</strong>
                    ${escapeHtml(player.bowlingStyle || "-")}

                    <br>

                    <strong>Jersey Number:</strong>
                    ${escapeHtml(player.jerseyNumber || "-")}

                    <br>

                    <strong>Experience:</strong>
                    ${escapeHtml(player.experience || "-")}

                    <br>

                    <strong>Profile:</strong>
                    ${escapeHtml(player.profile || "-")}

                `;


                card.appendChild(details);


                const status =
                    document.createElement(
                        "span"
                    );


                status.className =
                    "registration-status status-pending";


                status.innerText =
                    "Status: Pending";


                card.appendChild(status);


                const actions =
                    document.createElement(
                        "div"
                    );


                actions.className =
                    "registration-actions";


                const approveButton =
                    document.createElement(
                        "button"
                    );


                approveButton.type =
                    "button";

                approveButton.className =
                    "approve-btn";

                approveButton.innerText =
                    "✅ APPROVE";


                const rejectButton =
                    document.createElement(
                        "button"
                    );


                rejectButton.type =
                    "button";

                rejectButton.className =
                    "reject-btn";

                rejectButton.innerText =
                    "❌ REJECT";


                approveButton.onclick =
                    function () {

                        updateRegistrationStatus(
                            registrationDoc.id,
                            "Approved",
                            card,
                            approveButton,
                            rejectButton
                        );

                    };


                rejectButton.onclick =
                    function () {

                        updateRegistrationStatus(
                            registrationDoc.id,
                            "Rejected",
                            card,
                            approveButton,
                            rejectButton
                        );

                    };


                actions.appendChild(
                    approveButton
                );


                actions.appendChild(
                    rejectButton
                );


                card.appendChild(actions);


                registrationList.appendChild(
                    card
                );

            }
        );


        updateRegistrationMessage(
            count
        );

    }


    catch (error) {

        console.error(
            "REGISTRATION ERROR:",
            error
        );


        if (registrationMsg) {

            registrationMsg.innerText =
                "❌ Error loading registrations";

            registrationMsg.style.color =
                "#ff4444";

        }

    }

}


// ======================================================
// UPDATE REGISTRATION
// ======================================================

async function updateRegistrationStatus(
    documentId,
    newStatus,
    card,
    approveButton,
    rejectButton
) {

    if (
        !confirm(
            "Change registration status to " +
            newStatus +
            "?"
        )
    ) {

        return;

    }


    try {

        approveButton.disabled =
            true;

        rejectButton.disabled =
            true;


        await updateDoc(

            doc(
                db,
                "playerRegistrations",
                documentId
            ),

            {

                status:
                    newStatus,

                statusUpdatedAt:
                    serverTimestamp()

            }

        );


        if (card) {
            card.remove();
        }


        updateRegistrationMessage();


        alert(
            "Registration " +
            newStatus +
            " successfully!"
        );

    }


    catch (error) {

        console.error(
            "STATUS ERROR:",
            error
        );


        approveButton.disabled =
            false;

        rejectButton.disabled =
            false;


        alert(
            "Error updating status:\n" +
            error.message
        );

    }

}


// ======================================================
// REGISTRATION MESSAGE
// ======================================================

function updateRegistrationMessage(
    suppliedCount
) {

    const list =
        document.getElementById(
            "registrationList"
        );


    const msg =
        document.getElementById(
            "registrationMsg"
        );


    if (!list || !msg) {
        return;
    }


    const cards =
        list.querySelectorAll(
            ".registration-card"
        );


    const count =
        typeof suppliedCount === "number"
            ? suppliedCount
            : cards.length;


    if (count === 0) {

        msg.innerText =
            "No pending player registrations.";

    }

    else {

        msg.innerText =
            "Total Pending Registrations: " +
            count;

    }

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ======================================================
// CLOUDINARY UPLOAD
// ======================================================

async function uploadImageToCloudinary(
    file
) {

    const url =
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


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
            url,
            {
                method: "POST",
                body: formData
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.error?.message ||
            "Cloudinary upload failed"
        );

    }


    return data.secure_url;

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


const galleryMsg =
    document.getElementById(
        "galleryMsg"
    );


const uploadGalleryBtn =
    document.getElementById(
        "uploadGalleryBtn"
    );


if (galleryImage) {

    galleryImage.addEventListener(
        "change",
        function () {

            const files =
                Array.from(
                    galleryImage.files
                );


            if (!files.length) {

                galleryPreview.src = "";

                galleryPreview.style.display =
                    "none";

                galleryMsg.innerText = "";

                return;

            }


            for (const file of files) {

                if (
                    file.type !==
                    "image/jpeg"
                ) {

                    alert(
                        "Please select JPG or JPEG images only."
                    );

                    galleryImage.value =
                        "";

                    return;

                }

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
                files[0]
            );


            galleryMsg.innerText =
                "📸 " +
                files.length +
                " photo(s) selected.";

            galleryMsg.style.color =
                "#ff9800";

        }
    );

}


// ======================================================
// GALLERY UPLOAD
// ======================================================

if (uploadGalleryBtn) {

    uploadGalleryBtn.onclick =
    async function () {

        const files =
            Array.from(
                galleryImage.files
            );


        if (!files.length) {

            alert(
                "Please select at least one image."
            );

            return;

        }


        try {

            uploadGalleryBtn.disabled =
                true;

            uploadGalleryBtn.innerText =
                "⏳ UPLOADING...";


            let count = 0;


            for (const file of files) {

                const imageUrl =
                    await uploadImageToCloudinary(
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

                        createdAt:
                            serverTimestamp()

                    }

                );


                count++;

            }


            galleryMsg.innerText =
                "✅ " +
                count +
                " photos uploaded successfully!";


            galleryMsg.style.color =
                "#00ff88";


            galleryImage.value = "";


            galleryPreview.src = "";

            galleryPreview.style.display =
                "none";

        }


        catch (error) {

            console.error(
                "GALLERY ERROR:",
                error
            );


            galleryMsg.innerText =
                "❌ Upload failed: " +
                error.message;

            galleryMsg.style.color =
                "#ff4444";

        }


        finally {

            uploadGalleryBtn.disabled =
                false;

            uploadGalleryBtn.innerText =
                "⬆️ UPLOAD PHOTOS";

        }

    };

}


// ======================================================
// ADD EVENT
// ======================================================

const saveEventBtn =
    document.getElementById(
        "saveEventBtn"
    );


if (saveEventBtn) {

    saveEventBtn.onclick =
    async function () {

        const eventId =
            document.getElementById(
                "eventId"
            ).value.trim();


        const eventType =
            document.getElementById(
                "eventType"
            ).value;


        const eventName =
            document.getElementById(
                "eventName"
            ).value.trim();


        const eventImage =
            document.getElementById(
                "eventImage"
            ).files[0];


        const eventStatus =
            document.getElementById(
                "eventStatus"
            ).value;


        if (
            !eventId ||
            !eventType ||
            !eventName
        ) {

            alert(
                "Please fill all Event details."
            );

            return;

        }


        try {

            const eventMsg =
                document.getElementById(
                    "eventMsg"
                );


            eventMsg.innerText =
                "⏳ Saving Event...";


            let imageUrl = "";


            if (eventImage) {

                eventMsg.innerText =
                    "⏳ Uploading image...";


                imageUrl =
                    await uploadImageToCloudinary(
                        eventImage
                    );

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

                    imageUrl:
                        imageUrl,

                    status:
                        eventStatus

                }

            );


            eventMsg.innerText =
                "✅ Event saved successfully!";

            eventMsg.style.color =
                "#00ff88";


            document.getElementById(
                "eventId"
            ).value = "";

            document.getElementById(
                "eventType"
            ).value = "";

            document.getElementById(
                "eventName"
            ).value = "";

            document.getElementById(
                "eventImage"
            ).value = "";

            document.getElementById(
                "eventStatus"
            ).value =
                "Active";


            loadEvents();

        }


        catch (error) {

            console.error(
                "EVENT ERROR:",
                error
            );


            const eventMsg =
                document.getElementById(
                    "eventMsg"
                );


            eventMsg.innerText =
                "❌ ERROR: " +
                error.message;

            eventMsg.style.color =
                "#ff4444";

        }

    };

}


// ======================================================
// LOAD EVENTS
// ======================================================

async function loadEvents() {

    const eventList =
        document.getElementById(
            "eventList"
        );


    if (!eventList) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "events"
                )
            );


        eventList.innerHTML = "";


        if (snapshot.empty) {

            eventList.innerHTML =
                `
                <p style="
                    text-align:center;
                    color:#aaa;
                ">
                    No events found.
                </p>
                `;

            return;

        }


        snapshot.forEach(
            (eventDoc) => {

                const event =
                    eventDoc.data();


                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "event-card";


                div.innerHTML = `

                    ${
                        event.imageUrl
                        ?
                        `
                        <img
                            src="${escapeHtml(event.imageUrl)}"
                            alt="Event Image"
                        >
                        `
                        :
                        ""
                    }

                    <strong>
                        ${escapeHtml(
                            event.eventName || ""
                        )}
                    </strong>

                    <br>

                    Event ID:
                    ${escapeHtml(
                        event.eventId || ""
                    )}

                    <br>

                    Type:
                    ${escapeHtml(
                        event.eventType || ""
                    )}

                    <br>

                    Status:
                    ${
                        event.status ===
                        "Completed"
                        ?
                        "🔴 Completed"
                        :
                        "🟢 Going On"
                    }

                `;


                eventList.appendChild(
                    div
                );

            }
        );

    }


    catch (error) {

        console.error(
            "EVENT LOAD ERROR:",
            error
        );


        eventList.innerHTML =
            `
            <p style="color:#ff4444;">
                ❌ Error loading events.
            </p>
            `;

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


if (
    addMatchBtn &&
    matchForm
) {

    addMatchBtn.onclick =
    function () {

        if (
            matchForm.style.display ===
            "none"
        ) {

            matchForm.style.display =
                "block";

            addMatchBtn.innerText =
                "➖ CLOSE MATCH FORM";

        }

        else {

            matchForm.style.display =
                "none";

            addMatchBtn.innerText =
                "➕ ADD NEW MATCH";

        }

    };

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


const eventSelect =
    document.getElementById(
        "eventSelect"
    );


if (
    matchEventType &&
    eventSelectBox &&
    eventSelect
) {

    matchEventType.onchange =
    async function () {

        const selectedType =
            matchEventType.value;


        if (
            selectedType ===
            "Individual Matches"
        ) {

            eventSelectBox.style.display =
                "none";

            return;

        }


        if (
            selectedType !== "Tournament" &&
            selectedType !== "Series"
        ) {

            eventSelectBox.style.display =
                "none";

            return;

        }


        eventSelectBox.style.display =
            "block";


        eventSelect.innerHTML =
            `
            <option value="">
                Loading...
            </option>
            `;


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
                    Select ${selectedType}
                </option>
                `;


            snapshot.forEach(
                (eventDoc) => {

                    const event =
                        eventDoc.data();


                    if (
                        event.eventType ===
                        selectedType
                    ) {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            eventDoc.id;


                        option.textContent =
                            event.eventName ||
                            event.eventId ||
                            "Unnamed Event";


                        option.dataset.eventId =
                            event.eventId || "";


                        eventSelect.appendChild(
                            option
                        );

                    }

                }
            );

        }


        catch (error) {

            console.error(
                "EVENT SELECT ERROR:",
                error
            );


            eventSelect.innerHTML =
                `
                <option value="">
                    Error loading events
                </option>
                `;

        }

    };

}


// ======================================================
// SAVE MATCH
// ======================================================

const saveMatchBtn =
    document.getElementById(
        "saveMatchBtn"
    );


if (saveMatchBtn) {

    saveMatchBtn.onclick =
    async function () {

        const matchId =
            document.getElementById(
                "matchId"
            ).value.trim();


        const eventType =
            document.getElementById(
                "matchEventType"
            ).value;


        const matchDate =
            document.getElementById(
                "matchDate"
            ).value;


        const matchPlace =
            document.getElementById(
                "matchPlace"
            ).value.trim();


        const opponent =
            document.getElementById(
                "opponent"
            ).value.trim();


        const overs =
            document.getElementById(
                "overs"
            ).value.trim();


        const result =
            document.getElementById(
                "result"
            ).value.trim();


        const playerOfMatch =
            document.getElementById(
                "playerOfMatch"
            ).value.trim();


        const bestBowler =
            document.getElementById(
                "bestBowler"
            ).value.trim();


        const bestBatter =
            document.getElementById(
                "bestBatter"
            ).value.trim();


        const fighterOfMatch =
            document.getElementById(
                "fighterOfMatch"
            ).value.trim();


        const cricHeroesLink =
            document.getElementById(
                "cricHeroesLink"
            ).value.trim();


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


        if (!matchId) {

            alert(
                "Please enter Match ID"
            );

            return;

        }


        if (!eventType) {

            alert(
                "Please select Event Type"
            );

            return;

        }


        if (!matchDate) {

            alert(
                "Please select Match Date"
            );

            return;

        }


        if (!matchPlace) {

            alert(
                "Please enter Place"
            );

            return;

        }


        if (!opponent) {

            alert(
                "Please enter Opponent"
            );

            return;

        }


        if (!result) {

            alert(
                "Please enter Result"
            );

            return;

        }


        if (!cricHeroesLink) {

            alert(
                "Please enter CricHeroes Link"
            );

            return;

        }


        try {

            await addDoc(

                collection(
                    db,
                    "matches"
                ),

                {

                    matchId:
                        matchId,

                    eventId:
                        eventId,

                    eventType:
                        eventType,

                    eventName:
                        eventName,

                    matchDate:
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
                        cricHeroesLink

                }

            );


            alert(
                "✅ Match saved successfully!"
            );


            document.getElementById(
                "matchId"
            ).value = "";

            document.getElementById(
                "matchEventType"
            ).value = "";

            document.getElementById(
                "matchDate"
            ).value = "";

            document.getElementById(
                "matchPlace"
            ).value = "";

            document.getElementById(
                "opponent"
            ).value = "";

            document.getElementById(
                "overs"
            ).value = "";

            document.getElementById(
                "result"
            ).value = "";

            document.getElementById(
                "playerOfMatch"
            ).value = "";

            document.getElementById(
                "bestBowler"
            ).value = "";

            document.getElementById(
                "bestBatter"
            ).value = "";

            document.getElementById(
                "fighterOfMatch"
            ).value = "";

            document.getElementById(
                "cricHeroesLink"
            ).value = "";


            eventSelectBox.style.display =
                "none";


            eventSelect.innerHTML =
                `
                <option value="">
                    Select Tournament / Series
                </option>
                `;

        }


        catch (error) {

            console.error(
                "MATCH SAVE ERROR:",
                error
            );


            alert(
                "Error saving match:\n" +
                error.message
            );

        }

    };

}