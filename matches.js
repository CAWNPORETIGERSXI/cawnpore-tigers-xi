import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const table = document.getElementById("matchTable");

async function loadMatches() {
  table.innerHTML = "";

  const q = query(collection(db, "matches"), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  let sr = 1;

  snapshot.forEach((doc) => {
    const m = doc.data();

    table.innerHTML += `
      <tr onclick="window.open('https://cricheroes.com/', '_blank')">
        <td>${sr++}</td>
        <td>${m.date || ""}</td>
        <td>${m.opponent || ""}</td>
        <td>${m.overs || ""}</td>
        <td>${m.result || ""}</td>
      </tr>
    `;
  });
}

loadMatches();