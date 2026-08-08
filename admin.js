import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

alert("admin2.js loaded");

// ==========================
// LOGIN
// ==========================

window.login = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if(email==="" || password===""){
        alert("Enter Email & Password");
        return;
    }

    try{

        await signInWithEmailAndPassword(auth,email,password);

        document.getElementById("loginBox").style.display="none";
        document.getElementById("adminPanel").style.display="block";

    }

    catch(error){

        alert(error.message);

    }

};
// ==========================
// DASHBOARD BUTTONS
// ==========================

const tournamentBtn = document.getElementById("tournamentBtn");
const seriesBtn = document.getElementById("seriesBtn");
const individualBtn = document.getElementById("individualBtn");

tournamentBtn.onclick = function () {
    alert("Tournament Module - Coming Next");
};

seriesBtn.onclick = function () {
    alert("Series Module - Coming Next");
};

individualBtn.onclick = function () {
    alert("Individual Matches Module - Coming Next");
};