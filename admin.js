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
// CHECK FIREBASE
// ======================================================

console.log("====================================");
console.log("CAWNPORE TIGERS XI ADMIN");
console.log("Firebase Auth:", auth);
console.log("Firestore:", db);
console.log("====================================");


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


        // ----------------------------------------------
        // EMPTY FIELD CHECK
        // ----------------------------------------------

        if (!email || !password) {

            loginMsg.innerText =
                "⚠️ Please enter Email and Password.";

            loginMsg.style.color =
                "#ff9800";

            return;
        }


        // ----------------------------------------------
        // START LOGIN
        // ----------------------------------------------

        loginBtn.disabled =
            true;

        loginBtn.innerText =
            "⏳ LOGGING IN...";


        loginMsg.innerText =
            "Checking login...";

        loginMsg.style.color =
            "#ff9800";


        console.log(
            "LOGIN ATTEMPT:",
            email
        );


        try {

            // ------------------------------------------
            // FIREBASE LOGIN
            // ------------------------------------------

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


            // ------------------------------------------
            // SUCCESS MESSAGE
            // ------------------------------------------

            loginMsg.innerText =
                "✅ Login successful!";

            loginMsg.style.color =
                "#00ff88";


            // ------------------------------------------
            // HIDE LOGIN
            // ------------------------------------------

            if (loginBox) {

                loginBox.style.display =
                    "none";

            }


            // ------------------------------------------
            // SHOW ADMIN PANEL
            // ------------------------------------------

            if (adminPanel) {

                adminPanel.style.display =
                    "block";

            }


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


            // ------------------------------------------
            // FIREBASE ERROR CODES
            // ------------------------------------------

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


            // ------------------------------------------
            // SHOW ERROR
            // ------------------------------------------

            if (loginMsg) {

                loginMsg.innerText =
                    message;

                loginMsg.style.color =
                    "#ff4444";

            }

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

                console.log(
                    "PASSWORD RESET:",
                    email
                );


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

            }

            catch (error) {

                console.error(
                    "PASSWORD RESET ERROR:",
                    error
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


                if (loginMsg) {

                    loginMsg.innerText =
                        "❌ Password reset failed.";

                    loginMsg.style.color =
                        "#ff4444";

                }

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
            function () {

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


                if (
                    sectionId ===
                    "eventSection"
                ) {

                    loadEvents();

                }


                if (
                    sectionId ===
                    "matchSection"
                ) {

                    loadEventOptions();

                }


                if (
                    sectionId ===
                    "registrationSection"
                ) {

                    loadRegistrations();

                }

            }
        );

    });


// ======================================================
// SAVE EVENT BUTTON
// ======================================================

const saveEventBtn =
    document.getElementById(
        "save