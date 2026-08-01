const seriesMatches = [

{
    match: "Match 1",
    date: "18 June 2026",
    teams: "CAWNPORE TIGERS XI vs MSS YOUTH STARS",
    result: "View Match Summary",
    summary: "match-summary.html?id=11"
},

{
    match: "Match 2",
    date: "26 June 2026",
    teams: "CAWNPORE TIGERS XI vs MSS YOUTH STARS",
    result: "View Match Summary",
    summary: "match-summary.html?id=13"
},

{
    match: "Match 3",
    date: "Coming Soon",
    teams: "CAWNPORE TIGERS XI vs MSS YOUTH STARS",
    result: "Match Yet To Be Played",
    summary: "#"
}

];

const container = document.getElementById("seriesMatches");

seriesMatches.forEach(match=>{

container.innerHTML += `

<div class="match-card">

<h3>${match.match}</h3>

<p><strong>Date:</strong> ${match.date}</p>

<p><strong>Fixture:</strong> ${match.teams}</p>

<p>${match.result}</p>

${
match.summary=="#"
?

`<a href="#">Coming Soon</a>`

:

`<a href="${match.summary}">View Summary</a>`

}

</div>

`;

});
const matches = [

{
match:"Match 1",
date:"18 June 2026",
result:"Won by 6 Wickets",
link:"match-summary.html?id=11"
},

{
match:"Match 2",
date:"26 June 2026",
result:"Lost by 7 Wickets",
link:"match-summary.html?id=13"
},

{
match:"Match 3",
date:"Coming Soon",
result:"Upcoming",
link:"#"
}

];

let html="";

matches.forEach(m=>{

html+=`

<div class="match-card">

<h3>${m.match}</h3>

<p><b>Date :</b> ${m.date}</p>

<p><b>Result :</b> ${m.result}</p>

<a class="match-btn" href="${m.link}">
${m.link=="#"?"Coming Soon":"View Match"}
</a>

</div>

`;

});

document.getElementById("seriesMatches").innerHTML=html;