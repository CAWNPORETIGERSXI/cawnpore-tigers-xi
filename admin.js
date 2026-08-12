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
// CLOUDINARY SETTINGS
// ======================================================

const CLOUDINARY_CLOUD_NAME = "ax0fx3uh";

const CLOUDINARY_UPLOAD_PRESET = "tigers_images";


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


        document.getElementById("loginBox")
            .style.display = "none";


        document.getElementById("adminPanel")
            .style.display = "block";


        loadEvents();

        loadPlayerRegistrations();


    } catch (error) {

        alert(error.message);

    }

};


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

    registrationMsg.innerText =
        "⏳ Loading pending registrations...";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "playerRegistrations"
                )
            );


        if (snapshot.empty) {

            registrationMsg.innerText =
                "No pending player registrations.";

            return;

        }


        let count = 0;


        snapshot.forEach((registrationDoc) => {

            const player =
                registrationDoc.data();


            // ==================================================
            // ONLY PENDING PLAYERS WILL BE SHOWN
            // ==================================================

            if (
                player.status !== "Pending"
            ) {

                return;

            }


            count++;


            const card =
                document.createElement("div");


            card.className =
                "registration-card";


            // ==================================================
            // TITLE
            // ==================================================

            const title =
                document.createElement("h3");


            title.innerText =
                player.fullName ||
                "Unnamed Player";


            card.appendChild(title);


            // ==================================================
            // REGISTRATION ID
            // ==================================================

            const idText =
                document.createElement("div");


            idText.className =
                "registration-info";


            idText.innerHTML =
                "<strong>Registration ID:</strong> " +
                escapeHtml(
                    player.registrationId || ""
                );


            card.appendChild(idText);


            // ==================================================
            // DETAILS
            // ==================================================

            const details =
                document.createElement("div");


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


            // ==================================================
            // STATUS
            // ==================================================

            const status =
                document.createElement("span");


            status.className =
                "registration-status";


            status.classList.add(
                "status-pending"
            );


            status.innerText =
                "Status: Pending";


            card.appendChild(status);


            // ==================================================
            // ACTION BUTTONS
            // ==================================================

            const actions =
                document.createElement("div");


            actions.className =
                "registration-actions";


            // ==================================================
            // APPROVE
            // ==================================================

            const approveButton =
                document.createElement("button");


            approveButton.className =
                "approve-btn";


            approveButton.innerText =
                "✅ APPROVE";


            approveButton.onclick =
                function () {

                    updateRegistrationStatus(
                        registrationDoc.id,
                        "Approved"
                    );

                };


            // ==================================================
            // REJECT
            // ==================================================

            const rejectButton =
                document.createElement("button");


            rejectButton.className =
                "reject-btn";


            rejectButton.innerText =
                "❌ REJECT";


            rejectButton.onclick =
                function () {

                    updateRegistrationStatus(
                        registrationDoc.id,
                        "Rejected"
                    );

                };


            actions.appendChild(
                approveButton
            );


            actions.appendChild(
                rejectButton
            );


            card.appendChild(actions);


            registrationList.appendChild(card);

        });


        // ==================================================
        // MESSAGE
        // ==================================================

        if (count === 0) {

            registrationMsg.innerText =
                "No pending player registrations.";

        }
        else {

            registrationMsg.innerText =
                "Total Pending Registrations: " +
                count;

        }


    } catch (error) {

        console.error(
            "REGISTRATION LOAD ERROR:",
            error
        );


        registrationMsg.innerText =
            "❌ Error loading registrations: " +
            error.message;

    }

}


// ======================================================
// UPDATE PLAYER REGISTRATION STATUS
// ======================================================

async function updateRegistrationStatus(
    documentId,
    newStatus
) {

    const confirmation =
        confirm(
            "Change registration status to " +
            newStatus +
            "?"
        );


    if (!confirmation) {

        return;

    }


    try {

        // ==================================================
        // UPDATE FIRESTORE
        // ==================================================

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


        // ==================================================
        // SUCCESS
        // ==================================================

        alert(
            "Registration " +
            newStatus +
            " successfully!"
        );


        // ==================================================
        // RELOAD
        //
        // Because only Pending players are loaded,
        // approved/rejected player will disappear.
        // ==================================================

        loadPlayerRegistrations();


    } catch (error) {

        console.error(
            "STATUS UPDATE ERROR:",
            error
        );


        alert(
            "Error updating status:\n" +
            error.message
        );

    }

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ======================================================
// CLOUDINARY IMAGE UPLOAD
// ======================================================

async function uploadImageToCloudinary(file) {

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

        console.error(
            "Cloudinary Error:",
            data
        );


        throw new Error(
            data.error?.message ||
            "Image upload failed"
        );

    }


    return data.secure_url;

}


// ======================================================
// ADD NEW EVENT
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
            eventId === "" ||
            eventType === "" ||
            eventName === ""
        ) {

            alert(
                "Please fill all Event details"
            );

            return;

        }


        if (
            (
                eventType === "Tournament" ||
                eventType === "Series"
            ) &&
            !eventImage
        ) {

            alert(
                "Please select Tournament / Series Logo"
            );

            return;

        }


        if (eventImage) {

            if (
                eventImage.type !==
                "image/jpeg"
            ) {

                alert(
                    "Please upload JPG or JPEG image only."
                );

                return;

            }

        }


        try {

            const eventMsg =
                document.getElementById(
                    "eventMsg"
                );


            eventMsg.innerHTML =
                "⏳ Saving Event...";


            eventMsg.style.display =
                "block";


            eventMsg.style.color =
                "#ff9800";


            let imageUrl = "";


            if (eventImage) {

                eventMsg.innerHTML =
                    "⏳ Uploading image...";


                imageUrl =
                    await uploadImageToCloudinary(
                        eventImage
                    );

            }


            eventMsg.innerHTML =
                "⏳ Saving Event to Firebase...";


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


            eventMsg.innerHTML =
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
            ).value = "Active";


            loadEvents();


        } catch (error) {

            console.error(
                "EVENT SAVE ERROR:",
                error
            );


            const eventMsg =
                document.getElementById(
                    "eventMsg"
                );


            eventMsg.style.display =
                "block";


            eventMsg.style.color =
                "#ff4444";


            eventMsg.innerHTML =
                "❌ ERROR:<br>" +
                error.message;

        }

    };

}


// ======================================================
// LOAD EXISTING EVENTS
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


        snapshot.forEach((docSnapshot) => {

            const event =
                docSnapshot.data();


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
                        style="
                            width:100%;
                            max-height:180px;
                            object-fit:contain;
                            border-radius:10px;
                            margin-bottom:10px;
                        "
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
                    event.status === "Completed"
                    ? "🔴 Completed"
                    : "🟢 Going On"
                }

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
    document.getElementById(
        "addMatchBtn"
    );


const matchForm =
    document.getElementById(
        "matchForm"
    );


if (addMatchBtn && matchForm) {

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


            eventSelect.innerHTML =
                `<option value="">
                    Select Tournament / Series
                </option>`;


            return;

        }


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


        eventSelectBox.style.display =
            "block";


        eventSelect.innerHTML =
            `<option value="">
                Loading...
            </option>`;


        try {

            const snapshot =
                await getDocs(
                    collection(
                        db,
                        "events"
                    )
                );


            eventSelect.innerHTML = `

                <option value="">
                    Select ${selectedType}
                </option>

            `;


            let found = false;


            snapshot.forEach(
                (eventDoc) => {

                    const event =
                        eventDoc.data();


                    if (
                        event.eventType ===
                        selectedType
                    ) {

                        found = true;


                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            eventDoc.id;


                        option.textContent =
                            event.eventName;


                        option.dataset.eventId =
                            event.eventId;


                        eventSelect.appendChild(
                            option
                        );

                    }

                }
            );


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

}


// ======================================================
// SAVE MATCH TO FIRESTORE
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


        if (matchId === "") {

            alert(
                "Please enter Match ID"
            );

            return;

        }


        if (eventType === "") {

            alert(
                "Please select Event Type"
            );

            return;

        }


        if (matchDate === "") {

            alert(
                "Please select Match Date"
            );

            return;

        }


        if (matchPlace === "") {

            alert(
                "Please enter Place"
            );

            return;

        }


        if (opponent === "") {

            alert(
                "Please enter Opponent"
            );

            return;

        }


        if (result === "") {

            alert(
                "Please enter Result"
            );

            return;

        }


        if (cricHeroesLink === "") {

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
                "Match saved successfully!"
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

}