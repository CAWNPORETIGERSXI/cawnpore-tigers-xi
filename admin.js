import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


alert("admin.js loaded");


// LOGIN FUNCTION
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



// SAVE MATCH FUNCTION
window.saveMatch = async function () {


    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const opponent = document.getElementById("opponent").value;
    const overs = document.getElementById("overs").value;
    const playerOfMatch = document.getElementById("playerOfMatch").value;
    const bestBatter = document.getElementById("bestBatter").value;
    const bestBowler = document.getElementById("bestBowler").value;
    const result = document.getElementById("result").value;


    try {

        await addDoc(collection(db,"matches"),{

            title,
            date,
            opponent,
            overs,
            playerOfMatch,
            bestBatter,
            bestBowler,
            result,
            createdAt:new Date()

        });


        document.getElementById("saveMsg").innerHTML =
        "<span class='success'>Match Saved Successfully 🏏</span>";


    } catch(error){

        document.getElementById("saveMsg").innerHTML =
        "<span class='error'>" + error.message + "</span>";

    }

};




// IMPORT OLD MATCHES FUNCTION
window.importOldMatches = async function () {


const matches = [

{
title:"Match 1",
date:"18/06/2025",
opponent:"DAU XI",
overs:"20",
result:"ABANDONED DUE TO HEAT"
},

{
title:"Match 2",
date:"29/06/2025",
opponent:"DAU XI",
overs:"18",
result:"CAWNPORE TIGERS XI WON BY 50 RUNS"
},

{
title:"Match 3",
date:"12/10/2025",
opponent:"WE XI",
overs:"22",
result:"WE XI WON BY 67 RUNS"
},

{
title:"Match 4",
date:"20/10/2025",
opponent:"TEAM DIAMOND",
overs:"25",
result:"CAWNPORE TIGERS XI WON BY 4 WICKETS"
},

{
title:"Match 5",
date:"02/03/2026",
opponent:"UNNAO PANTHERS",
overs:"25",
result:"CAWNPORE TIGERS XI WON BY 6 WICKETS"
},

{
title:"Match 6",
date:"17/05/2026",
opponent:"KANPUR CRICKET WARRIORS",
overs:"25",
result:"CAWNPORE TIGERS XI WON BY 6 WICKETS"
},

{
title:"Match 7",
date:"03/06/2026",
opponent:"MADHYAMIK LIONS",
overs:"20",
result:"CAWNPORE TIGERS XI WON BY 1 WICKET"
},

{
title:"Match 8",
date:"06/06/2026",
opponent:"STRIKE SQUAD XI",
overs:"20",
result:"CAWNPORE TIGERS XI LOST BY 9 RUNS"
},

{
title:"Match 9",
date:"10/06/2026",
opponent:"COUNTY STARS",
overs:"20",
result:"CAWNPORE TIGERS XI WON BY 7 WICKETS"
},

{
title:"Match 10",
date:"13/06/2026",
opponent:"STRIKE SQUAD XI",
overs:"25",
result:"ABANDONED DUE TO RAIN"
},

{
title:"Match 11",
date:"18/06/2026",
opponent:"MSS YOUTH STAR XI",
overs:"25",
result:"CAWNPORE TIGERS XI WON BY 6 WICKETS"
},

{
title:"Match 12",
date:"20/06/2026",
opponent:"STRIKE SQUAD XI",
overs:"25",
result:"CAWNPORE TIGERS XI LOST BY 4 WICKETS"
},

{
title:"Match 13",
date:"26/06/2026",
opponent:"MSS YOUTH STAR",
overs:"25",
result:"CAWNPORE TIGERS XI LOST BY 7 WICKETS"
},

{
title:"Match 14",
date:"19/07/2026",
opponent:"MADHYAMIK LIONS",
overs:"25",
result:"CAWNPORE TIGERS XI WON BY 2 WICKETS"
}

];


try {

for(const m of matches){

await addDoc(collection(db,"matches"),{

...m,
createdAt:new Date()

});

}


alert("All Matches Imported Successfully ✅");


}
catch(error){

alert(error.message);

}


};