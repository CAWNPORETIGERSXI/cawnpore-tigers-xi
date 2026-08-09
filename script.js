/* =========================================
   CAWNPORE TIGERS XI
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   SIDE MENU
========================================= */

const menuBtn = document.getElementById("menuBtnRight");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");
const menuOverlay = document.getElementById("menuOverlay");


/* OPEN MENU */

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        sideMenu.classList.add("active");

        menuOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    });

}


/* CLOSE MENU */

if (closeMenu) {

    closeMenu.addEventListener("click", () => {

        sideMenu.classList.remove("active");

        menuOverlay.classList.remove("active");

        document.body.style.overflow = "";

    });

}


/* CLOSE BY CLICKING OVERLAY */

if (menuOverlay) {

    menuOverlay.addEventListener("click", () => {

        sideMenu.classList.remove("active");

        menuOverlay.classList.remove("active");

        document.body.style.overflow = "";

    });

}


/* CLOSE WITH ESC KEY */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        sideMenu?.classList.remove("active");

        menuOverlay?.classList.remove("active");

        document.body.style.overflow = "";

    }

});