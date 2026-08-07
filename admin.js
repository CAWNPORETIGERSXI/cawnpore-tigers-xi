import { auth } from "./firebase.js";

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