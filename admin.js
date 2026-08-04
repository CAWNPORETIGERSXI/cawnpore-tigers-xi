import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Login
window.login = async function () {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(auth, email, password);

        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";

        document.getElementById("loginMsg").innerHTML =
        "<span class='success'>Login Successful ✅</span>";

    } catch (error) {

        document.getElementById("loginMsg").innerHTML =
        "<span class='error'>" + error.message + "</span>";

    }

};

// Save Match
window.saveMatch = async function () {

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
   const opponent = document.getElementById("opponent").value;
const playerOfMatch = document.getElementById("playerOfMatch").value;
const bestBatter = document.getElementById("bestBatter").value;
const bestBowler = document.getElementById("bestBowler").value;
const result = document.getElementById("result").value;

    try {

       await addDoc(collection(db, "matches"), {

    title,
    date,
    opponent,
    playerOfMatch,
    bestBatter,
    bestBowler,
    result,
    createdAt: new Date()

});

        document.getElementById("saveMsg").innerHTML =
        "<span class='success'>Match Saved Successfully 🏏</span>";

    } catch (error) {

        document.getElementById("saveMsg").innerHTML =
        "<span class='error'>" + error.message + "</span>";

    }

};