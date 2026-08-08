import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc, 
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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
// ADD NEW EVENT
// ==========================

const saveEventBtn = document.getElementById("saveEventBtn");

saveEventBtn.onclick = async function () {

    const eventId = document.getElementById("eventId").value.trim();
    const eventType = document.getElementById("eventType").value;
    const eventName = document.getElementById("eventName").value.trim();

    if (eventId === "" || eventType === "" || eventName === "") {
        alert("Please fill all Event details");
        return;
    }

    try {

        await addDoc(collection(db, "events"), {

            eventId: eventId,
            eventType: eventType,
            eventName: eventName,
            status: "Active"

        });

        alert("Event saved successfully!");

        document.getElementById("eventId").value = "";
        document.getElementById("eventType").value = "";
        document.getElementById("eventName").value = "";

    } catch (error) {

        console.error(error);
        alert("Error saving event: " + error.message);

    }

};