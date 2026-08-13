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
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================================
// CLOUDINARY
// ======================================================

const CLOUDINARY_CLOUD_NAME = "ax0fx3uh";
const CLOUDINARY_UPLOAD_PRESET = "tigers_images";


// ======================================================
// LOGIN ELEMENTS
// ======================================================

const loginBtn =
    document.getElementById("loginBtn");

const loginBox =
    document.getElementById("loginBox");

const adminPanel =
    document.getElementById("adminPanel");

const loginMsg =
    document.getElementById("loginMsg");


// ======================================================
// LOGIN
// ======================================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        async function () {

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


                if (loginBox) {

                    loginBox.style.display =
                        "none";
                }


                if (adminPanel) {

                    adminPanel.style.display =
                        "block";
                }


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


                let message =
                    error.message ||
                    "Login failed";


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


                alert(
                    "Firebase Login Error\n\n" +
                    "Code: " +
                    (error.code || "Unknown") +
                    "\n\n" +
                    "Message: " +
                    (error.message || "Unknown error")
                );


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

        }
    );

}


// ======================================================
// PASSWORD RESET
// ======================================================

const resetPasswordBtn =
    document.getElementById(
        "resetPasswordBtn"
    );


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

                alert(
                    "Please enter your email address first."
                );

                return;
            }


            try {

                resetPasswordBtn.disabled =
                    true;

                resetPasswordBtn.innerText =
                    "⏳ SENDING...";


                await sendPasswordResetEmail(
                    auth,
                    email
                );


                alert(
                    "✅ Password reset email sent successfully!\n\n" +
                    "Please check:\n" +
                    "• Inbox\n" +
                    "• Spam / Junk\n" +
                    "• Promotions"
                );


                if (loginMsg) {

                    loginMsg.innerText =
                        "✅ Password reset email sent.";

                    loginMsg.style.color =
                        "#00ff88";
                }

            }


            catch (error) {

                console.error(
                    "PASSWORD RESET ERROR:",
                    error
                );


                let message =
                    error.message ||
                    "Password reset failed";


                if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    message =
                        "No Firebase account found with this email.";

                }


                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Invalid email address.";

                }


                else if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    message =
                        "Too many requests. Please wait and try again later.";

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
                    "auth/unauthorized-continue-uri"
                ) {

                    message =
                        "Firebase password reset domain configuration needs to be checked.";

                }


                alert(
                    "❌ Password Reset Error\n\n" +
                    "Code: " +
                    (error.code || "Unknown") +
                    "\n\n" +
                    message
                );

            }


            finally {

                resetPasswordBtn.disabled =
                    false;

                resetPasswordBtn.innerText =
                    "RESET PASSWORD";

            }

        }
    );

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

               