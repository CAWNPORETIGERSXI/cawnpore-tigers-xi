import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const table = document.getElementById("matchesTable");

async function loadTournamentMatches() {

  table.innerHTML = "";

  const q = query(
    collection(db, "matches"),
    where("eventId", "==", "TOURNAMENT")
  );

  const snapshot = await getDocs(q);

  let no = 1;

  snapshot.forEach((doc) => {

    const match = doc.data();

    table.innerHTML += `
      <tr onclick="window.location.href='https://chshare.link/team/oACfCf'">
        <td>${no++}</td>
        <td>${match.date || ""}</td>
        <td>${match.opponent || ""}</td>
        <td>${match.venue || ""}</td>
        <td>${match.result || ""}</td>
      </tr>
    `;

  });

}

loadTournamentMatches();