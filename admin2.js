import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

alert("admin2.js loaded");

// ================= LOGIN =================

window.login = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if(email==="" || password===""){
        alert("Enter Email & Password");
        return;
    }

    try{

        await signInWithEmailAndPassword(auth,email,password);

        document.getElementById("loginPage").style.display="none";
        document.getElementById("dashboardPage").style.display="block";

    }

    catch(error){

        alert(error.message);

    }

};

// ================= PAGES =================

const dashboardPage=document.getElementById("dashboardPage");
const tournamentPage=document.getElementById("tournamentPage");
const seriesPage=document.getElementById("seriesPage");
const individualPage=document.getElementById("individualPage");

// Dashboard Buttons

document.getElementById("tournamentBtn").onclick=function(){

    dashboardPage.style.display="none";
    tournamentPage.style.display="block";

};

document.getElementById("seriesBtn").onclick=function(){

    dashboardPage.style.display="none";
    seriesPage.style.display="block";

};

document.getElementById("individualBtn").onclick=function(){

    dashboardPage.style.display="none";
    individualPage.style.display="block";

};

// Back Buttons

document.getElementById("backFromTournament").onclick=function(){

    tournamentPage.style.display="none";
    dashboardPage.style.display="block";

};

document.getElementById("backFromSeries").onclick=function(){

    seriesPage.style.display="none";
    dashboardPage.style.display="block";

};

document.getElementById("backFromIndividual").onclick=function(){

    individualPage.style.display="none";
    dashboardPage.style.display="block";

};