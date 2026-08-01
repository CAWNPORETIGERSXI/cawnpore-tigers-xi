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