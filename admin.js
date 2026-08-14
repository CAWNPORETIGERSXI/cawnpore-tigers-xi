import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ======================================================
// LOGIN ELEMENTS
// ======================================================

const loginBtn = document.getElementById("loginBtn");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");

const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");

const loginMsg = document.getElementById("loginMsg");


// ======================================================
// LOGIN
// ======================================================

loginBtn.addEventListener("click", async function () {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    // Empty fields
    if (!email || !password) {

        loginMsg.innerText =
            "⚠️ Please enter Email and Password.";

        loginMsg.style.color =
            "#ff9800";

        return;
    }


    // Loading
    loginBtn.disabled = true;

    loginBtn.innerText =
        "⏳ LOGGING IN...";

    loginMsg.innerText =
        "Checking login...";

    loginMsg.style.color =
        "#ff9800";


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


        // Hide login
        loginBox.style.display =
            "none";


        // Show admin panel
        adminPanel.style.display =
            "block";


    }

    catch (error) {

        console.error(
            "FIREBASE LOGIN ERROR:",
            error
        );


        console.log(
            "ERROR CODE:",
            error.code
        );


        console.log(
            "ERROR MESSAGE:",
            error.message
        );


        let message =
            "Login failed.";


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


        loginMsg.innerText =
            message;

        loginMsg.style.color =
            "#ff4444";


        alert(
            "Firebase Login Error\n\n" +
            "Code: " +
            (error.code || "Unknown") +
            "\n\n" +
            "Message: " +
            (error.message || "Unknown error")
        );


        loginBtn.disabled =
            false;

        loginBtn.innerText =
            "LOGIN";

    }

});


// ======================================================
// PASSWORD RESET
// ======================================================

resetPasswordBtn.addEventListener(
    "click",
    async function () {

        const email =
            document.getElementById("email")
                .value
                .trim();


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

        }


        catch (error) {

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

        }


        finally {

            resetPasswordBtn.disabled =
                false;

            resetPasswordBtn.innerText =
                "🔑 RESET PASSWORD";

        }

    }
);