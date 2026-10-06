/* =========================================================
   CYBEROS
   COMPLETE MAIN.JS
   FIREBASE AUTHENTICATION
   NO APP STATE SAVING / PERSISTENCE

   DESKTOP SYSTEM:
   - Choose which apps appear on desktop
   - Smaller configurable desktop icons
   - Desktop folders
   - Apps inside folders
   - All apps remain available from Start Menu

   DESKTOP LAYOUT:
   - Left responsive 3-column rail
   - Right responsive 3-column rail
   - 3 items per row
   - Additional items automatically move downward
   - No JS folder-position calculations
   - CSS Grid controls responsive layout

   FOLDER SYSTEM:
   - Folder windows always clickable
   - Folder apps always clickable
   - Folder close button always works
   - Folder content protected from drag handling
   - Folder gets reliable z-index
   - Grid / List view
   - Sort by Name / Type / Size / Date Created
   - File metadata
========================================================= */


/* =========================================================
   APP DATA
========================================================= */

const appData = {

    craft: {
        name: "CraftPuncher",
        url: "./apps/craftpuncher/CraftPuncher.html",
        icon: "./assets/icons/craft.png",
        type: "app",
        fileType: "Application",
        size: "2.4 MB",
        sizeBytes: 2400000,
        dateCreated: "2026-01-12"
    },

    polaroid: {
        name: "Polaroid",
        url: "./apps/polaroid/index.html",
        icon: "./assets/icons/polaroid.png",
        type: "app",
        fileType: "Application",
        size: "1.8 MB",
        sizeBytes: 1800000,
        dateCreated: "2026-01-18"
    },

    cyberpad: {
        name: "Cyberpad",
        url: "./apps/cyberpad/Dearmail.html",
        icon: "./assets/icons/cyberpad.png",
        type: "widget",
        fileType: "Widget",
        size: "860 KB",
        sizeBytes: 860000,
        dateCreated: "2026-02-03"
    },

    makeup: {
        name: "Makeup",
        url: "./apps/makeup/index.html",
        icon: "./apps/makeup/assets/L1.png",
        type: "app",
        fileType: "Application",
        size: "3.1 MB",
        sizeBytes: 3100000,
        dateCreated: "2026-02-10"
    },

    cookie: {
        name: "Cookie",
        url: "./apps/cookie/index.html",
        icon: "./apps/cookie/assets/Packaging1.png",
        type: "app",
        fileType: "Application",
        size: "2.1 MB",
        sizeBytes: 2100000,
        dateCreated: "2026-02-15"
    },

    friendshipband: {
        name: "friendshipband",
        url: "./apps/friendshipband/index.html",
        icon: "./apps/friendshipband/assets/charms/kitty1.png",
        type: "app",
        fileType: "Application",
        size: "4.7 MB",
        sizeBytes: 4700000,
        dateCreated: "2026-02-22"
    },

    postoffice: {
        name: "postoffice",
        url: "./apps/postoffice/Envelope.html",
        icon: "./apps/postoffice/Envelopeicon.png",
        type: "app",
        fileType: "Application",
        size: "1.5 MB",
        sizeBytes: 1500000,
        dateCreated: "2026-03-01"
    },

    shredder: {
        name: "shredder",
        url: "./apps/shredder/theshartechclub's shredder.html",
        icon: "./apps/shredder/page.png",
        type: "app",
        fileType: "Application",
        size: "980 KB",
        sizeBytes: 980000,
        dateCreated: "2026-03-07"
    },

    gummy: {
        name: "gummybear",
        url: "./apps/gummy/index.html",
        icon: "./apps/gummy/heart1.png",
        type: "app",
        fileType: "Application",
        size: "1.2 MB",
        sizeBytes: 1200000,
        dateCreated: "2026-03-12"
    },

    bubblegum: {
        name: "bubblegum",
        url: "./apps/bubblegum/index.html",
        icon: "./apps/bubblegum/C4.gif",
        type: "app",
        fileType: "Application",
        size: "3.6 MB",
        sizeBytes: 3600000,
        dateCreated: "2026-03-18"
    },

    piano: {
        name: "piano",
        url: "./apps/piano/index.html",
        icon: "./apps/bubblegum/C4.gif",
        type: "app",
        fileType: "Application",
        size: "2.8 MB",
        sizeBytes: 2800000,
        dateCreated: "2026-03-25"
    },

    claw: {
        name: "claw",
        url: "./apps/clawmachine/index.html",
        icon: "./apps/clawmachine/logo.png",
        type: "app",
        fileType: "Application",
        size: "5.2 MB",
        sizeBytes: 5200000,
        dateCreated: "2026-04-02"
    },

    paperfortuneteller: {
        name: "paperfortuneteller",
        url: "./apps/paperfortuneteller/index.html",
        icon: "./apps/paperfortuneteller/logo.png",
        type: "app",
        fileType: "Application",
        size: "5.2 MB",
        sizeBytes: 5200000,
        dateCreated: "2026-10-05"
    },

     beach: {
        name: "beach",
        url: "./apps/beach/index.html",
        icon: "./apps/beach/assets/house1.png",
        type: "app",
        fileType: "Application",
        size: "5.2 MB",
        sizeBytes: 5200000,
        dateCreated: "2026-10-05"
    },

    goalmachine: {
        name: "goalmachine",
        url: "./apps/goalmachine/index.html",
        icon: "./apps/goalmachine/logo.png",
        type: "app",
        fileType: "Application",
        size: "5.2 MB",
        sizeBytes: 5200000,
        dateCreated: "2026-10-05"
    },

    NightKiosk: {
        name: "NightKiosk",
        url: "./apps/Games/NightKiosk/NightKiosk.html",
        icon: "./apps/Games/NightKiosk/logo.png",
        type: "app",
        fileType: "Application",
        size: "80 MB",
        sizeBytes: 5200000,
        dateCreated: "2026-10-06"
    },

    video1: {
        name: "Fruit Loops and Milk",
        url: "./assets/videos/GirlySeries/video1.mp4",
        icon: "./assets/icons/video.png",
        type: "app",
        fileType: "Video",
        size: "59.1 MB",
        sizeBytes: 15000000,
        dateCreated: "2026-09-30"
    },

    video2: {
        name: "Bread & Jam",
        url: "./assets/videos/GirlySeries/video2.mp4",
        icon: "./assets/icons/video.png",
        type: "app",
        fileType: "Video",
        size: "124 MB",
        sizeBytes: 22500000,
        dateCreated: "2026-09-30"
    },

    video3: {
        name: "Dance",
        url: "./assets/videos/GirlySeries/video3.mp4",
        icon: "./assets/icons/video.png",
        type: "app",
        fileType: "Video",
        size: "358 MB",
        sizeBytes: 15000000,
        dateCreated: "2026-09-30"
    },

    video4: {
        name: "A Rainy Day",
        url: "./assets/videos/GirlySeries/video4.mp4",
        icon: "./assets/icons/video.png",
        type: "app",
        fileType: "Video",
        size: "166 MB",
        sizeBytes: 15000000,
        dateCreated: "2026-09-30"
    },

    video5: {
        name: "What's in the mail?",
        url: "./assets/videos/GirlySeries/video5.mp4",
        icon: "./assets/icons/video.png",
        type: "app",
        fileType: "Video",
        size: "208 MB",
        sizeBytes: 15000000,
        dateCreated: "2026-09-30"
    },

    video6: {
        name: "Polaroid or what?",
        url: "./assets/videos/GirlySeries/video6.mp4",
        icon: "./assets/icons/video.png",
        type: "app",
        fileType: "Video",
        size: "15.0 MB",
        sizeBytes: 15000000,
        dateCreated: "2026-09-30"
    },

    video7: {
        name: "Swing and Swing",
        url: "./assets/videos/GirlySeries/video7.mp4",
        icon: "./assets/icons/video.png",
        type: "app",
        fileType: "Video",
        size: "91 MB",
        sizeBytes: 15000000,
        dateCreated: "2026-09-30"
    },

    viewer3d: {
        name: "3D World",
        url: "./apps/3dviewer/index.html",
        icon: "./assets/icons/3dworld.png",
        type: "desktop3d",
        fileType: "3D World",
        size: "153 MB",
        sizeBytes: 3200000,
        dateCreated: "2026-09-30"
    }

};


/* =========================================================
   DESKTOP CONFIGURATION
========================================================= */

const CYBEROS_DESKTOP_CONFIG = {

    iconSize: 90,
    iconGap: 18,

    /*
       Desktop apps.

       These are NOT saved.
       They are simply the apps that appear
       on the desktop after every reload.
    */

    desktopApps: [
        "claw",
        "bubblegum",
        "makeup",
        "paperfortuneteller",
        "viewer3d",
        "beach",
        "goalmachine"
    ],

    folders: {

        "fun-stuff": {
            name: "Fun Stuff",
            icon: "./assets/icons/folder.png",
            apps: [
                "gummy",
                "bubblegum",
                "claw",
                "piano"
            ]
        },

        creative: {
            name: "Creative",
            icon: "./assets/icons/folder.png",
            apps: [
                "craft",
                "polaroid"
            ]
        },

        GirlySeries: {
            name: "GirlySeries",
            icon: "./assets/icons/folder.png",
            apps: [
                "video1",
                "video2",
                "video3",
                "video4",
                "video5",
                "video6",
                "video7"
            ]
        },

        Games: {
            name: "3D Games",
            icon: "./assets/icons/folder.png",
            apps: [
                "NightKiosk",
        
            ]
        }

    }

};


/* =========================================================
   CONFIG
========================================================= */

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 450;

const MAX_OPEN_TABS = 3;

const NORMAL_APP_Z_INDEX = 100;
const FOLDER_Z_INDEX = 4000;
const WIDGET_Z_INDEX = 4500;
const TASKBAR_Z_INDEX = 5000;
const START_MENU_Z_INDEX = 6000;
const MAXIMIZED_Z_INDEX = 2147483647;


/* =========================================================
   FOLDER CONFIGURATION
========================================================= */

const DEFAULT_FOLDER_VIEW = "grid";

const DEFAULT_FOLDER_SORT = "name";


const FOLDER_SORT_OPTIONS = {

    name: {

        label: "Name",

        compare: (a, b) => {

            return a.app.name.localeCompare(
                b.app.name,
                undefined,
                {
                    sensitivity: "base"
                }
            );

        }

    },


    type: {

        label: "Type",

        compare: (a, b) => {

            const typeA =
                a.app.fileType ||
                a.app.type ||
                "";

            const typeB =
                b.app.fileType ||
                b.app.type ||
                "";

            const result =
                typeA.localeCompare(
                    typeB,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                );

            if (result !== 0) {
                return result;
            }

            return a.app.name.localeCompare(
                b.app.name,
                undefined,
                {
                    sensitivity: "base"
                }
            );

        }

    },


    size: {

        label: "Size",

        compare: (a, b) => {

            const sizeA =
                Number(
                    a.app.sizeBytes
                ) || 0;

            const sizeB =
                Number(
                    b.app.sizeBytes
                ) || 0;

            if (sizeA !== sizeB) {

                return (
                    sizeA -
                    sizeB
                );

            }

            return a.app.name.localeCompare(
                b.app.name,
                undefined,
                {
                    sensitivity: "base"
                }
            );

        }

    },


    date: {

        label: "Date Created",

        compare: (a, b) => {

            const dateA =
                new Date(
                    a.app.dateCreated || 0
                ).getTime();

            const dateB =
                new Date(
                    b.app.dateCreated || 0
                ).getTime();

            if (dateA !== dateB) {

                return (
                    dateA -
                    dateB
                );

            }

            return a.app.name.localeCompare(
                b.app.name,
                undefined,
                {
                    sensitivity: "base"
                }
            );

        }

    }

};

const folderStates =
    new Map();


/* =========================================================
   ELEMENTS
========================================================= */

const desktop =
    document.getElementById("desktop");

const desktopArea =
    document.getElementById("desktopArea");

const appLayer =
    document.getElementById("appLayer");

const widgetLayer =
    document.getElementById("widgetLayer");

const startButton =
    document.getElementById("startButton");

const startMenu =
    document.getElementById("startMenu");

const startMenuApps =
    document.getElementById("startMenuApps");

const desktopIcons =
    document.getElementById("desktopIcons");

const taskbarApps =
    document.getElementById("taskbarApps");

const taskbarSearch =
    document.getElementById("taskbarSearch");

const clockTime =
    document.getElementById("clockTime");

const clockDate =
    document.getElementById("clockDate");

const batteryFill =
    document.getElementById("batteryFill");

const batteryText =
    document.getElementById("batteryText");

const chargeButton =
    document.getElementById("chargeButton");

const topStatus =
    document.getElementById("topStatus");


/* =========================================================
   AUTH ELEMENTS
========================================================= */

const loginButton =
    document.getElementById("loginButton");

const logoutButton =
    document.getElementById("logoutButton");

const loginOverlay =
    document.getElementById("loginOverlay");

const loginCloseButton =
    document.getElementById("loginCloseButton");

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const stayLoggedIn =
    document.getElementById("stayLoggedIn");

const loginSubmitButton =
    document.getElementById("loginSubmitButton");

const loginMessage =
    document.getElementById("loginMessage");

const loggedInArea =
    document.getElementById("loggedInArea");

const authUser =
    document.getElementById("authUser");

const authRole =
    document.getElementById("authRole");


/* =========================================================
   STATE
========================================================= */

const openWindows =
    new Map();

const widgetWindows =
    new Map();

const openFolders =
    new Map();

let highestZIndex =
    NORMAL_APP_Z_INDEX;

let startMenuOpen =
    false;

let batteryLevel =
    100;

let isCharging =
    false;

let isDead =
    false;


/* =========================================================
   BATTERY
========================================================= */

const baseDrainRate =
    0.03;

const appDrainPenalty =
    0.08;

const chargeRate =
    3.0;


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCyberOS();

    }
);


function initializeCyberOS() {

    console.log("================================");
    console.log("CYBEROS BOOT");
    console.log("================================");

    validateDesktopConfiguration();

    populateStartMenu();

    populateDesktopIcons();

    setupStartButton();

    setupSearch();

    setupCharging();

    setupAuthentication();

    updateClock();

    updateBattery();

    setInterval(
        updateClock,
        1000
    );

    requestAnimationFrame(
        batteryLoop
    );

    moveLogoutIntoStartMenu();

    console.log("CYBEROS READY");

}


/* =========================================================
   VALIDATE DESKTOP CONFIG
========================================================= */

function validateDesktopConfiguration() {

    const config =
        CYBEROS_DESKTOP_CONFIG;

    if (!config) {
        return;
    }

    config.desktopApps =
        Array.isArray(
            config.desktopApps
        )
            ? config.desktopApps
            : [];

    config.desktopApps =
        config.desktopApps.filter(
            appKey => {

                if (!appData[appKey]) {

                    console.warn(
                        "CYBEROS: Desktop app does not exist:",
                        appKey
                    );

                    return false;

                }

                return true;

            }
        );

    if (
        !config.folders ||
        typeof config.folders !== "object"
    ) {

        config.folders = {};

    }

    Object.entries(
        config.folders
    ).forEach(
        ([folderKey, folder]) => {

            if (!folder) {
                return;
            }

            if (
                !Array.isArray(
                    folder.apps
                )
            ) {

                folder.apps = [];

            }

            folder.apps =
                folder.apps.filter(
                    appKey => {

                        if (!appData[appKey]) {

                            console.warn(
                                "CYBEROS: Folder",
                                folderKey,
                                "contains unknown app:",
                                appKey
                            );

                            return false;

                        }

                        return true;

                    }
                );

        }
    );

    console.log(
        "CYBEROS DESKTOP CONFIG:",
        config
    );

}


/* =========================================================
   CYBEROS APP API
========================================================= */

window.CyberOSApp = {

    getUser() {

        if (
            !window.CyberOSFirebase
        ) {

            return null;

        }

        return (
            window.CyberOSFirebase.user ||
            null
        );

    },

    getUserId() {

        const user =
            this.getUser();

        return user
            ? user.uid
            : null;

    },

    getRole() {

        if (
            !window.CyberOSFirebase
        ) {

            return null;

        }

        return (
            window.CyberOSFirebase.role ||
            null
        );

    },

    isAdmin() {

        return (
            this.getRole() ===
            "admin"
        );

    },

    isMember() {

        return (
            this.getRole() ===
            "member"
        );

    }

};


/* =========================================================
   LOGOUT
========================================================= */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "#logoutButton"
            );

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (
            button.dataset.loggingOut ===
            "true"
        ) {

            return;

        }

        button.dataset.loggingOut =
            "true";

        try {

            await logoutCyberOS();

        } finally {

            button.dataset.loggingOut =
                "false";

        }

    },
    true
);


/* =========================================================
   AUTHENTICATION UI
========================================================= */

function setupAuthentication() {

    if (loginButton) {

        loginButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                openLogin();

            }
        );

    }

    if (loginCloseButton) {

        loginCloseButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                closeLogin();

            },
            true
        );

    }

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();
                event.stopPropagation();

                const email =
                    loginEmail.value.trim();

                const password =
                    loginPassword.value;

                if (
                    !email ||
                    !password
                ) {

                    showLoginMessage(
                        "Please enter email and password.",
                        true
                    );

                    return;

                }

                if (
                    !window.CyberOSFirebase ||
                    !window.CyberOSFirebase.login
                ) {

                    showLoginMessage(
                        "Firebase is still loading. Please try again.",
                        true
                    );

                    return;

                }

                setLoginLoading(true);

                showLoginMessage(
                    "Signing in...",
                    false
                );

                try {

                    const result =
                        await window.CyberOSFirebase.login(
                            email,
                            password,
                            stayLoggedIn
                                ? stayLoggedIn.checked
                                : false
                        );

                    setLoginLoading(false);

                    if (
                        !result ||
                        !result.success
                    ) {

                        showLoginMessage(
                            getFirebaseLoginError(
                                result
                                    ? result.error
                                    : null
                            ),
                            true
                        );

                        return;

                    }

                    showLoginMessage(
                        "Login successful.",
                        false
                    );

                    if (loginPassword) {
                        loginPassword.value = "";
                    }

                    setTimeout(
                        () => {

                            closeLogin();

                        },
                        500
                    );

                } catch (error) {

                    console.error(
                        "CYBEROS LOGIN ERROR:",
                        error
                    );

                    setLoginLoading(false);

                    showLoginMessage(
                        "Unable to log in.",
                        true
                    );

                }

            }
        );

    }

    window.addEventListener(
        "cyberos-auth",
        event => {

            handleCyberOSAuth(
                event.detail
            );

        }
    );

    updateAuthUI(
        false,
        null,
        null
    );

    if (loginOverlay) {

        loginOverlay.style.display =
            "flex";

    }

}


/* =========================================================
   LOGIN
========================================================= */

function openLogin() {

    if (!loginOverlay) {
        return;
    }

    loginOverlay.style.display =
        "flex";

    loginOverlay.style.pointerEvents =
        "auto";

    if (loginMessage) {

        loginMessage.textContent =
            "";

    }

}


function closeLogin() {

    if (!loginOverlay) {
        return;
    }

    console.log(
        "🔐 CYBEROS: CLOSING LOGIN"
    );

    loginOverlay.style.display =
        "none";

    loginOverlay.style.pointerEvents =
        "none";

    if (loginMessage) {

        loginMessage.textContent =
            "";

    }

    if (loginPassword) {

        loginPassword.value =
            "";

    }

}


function showLoginMessage(
    message,
    error
) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent =
        message;

    if (error) {

        loginMessage.classList.add(
            "error"
        );

    } else {

        loginMessage.classList.remove(
            "error"
        );

    }

}


function setLoginLoading(
    loading
) {

    if (!loginSubmitButton) {
        return;
    }

    loginSubmitButton.disabled =
        loading;

    loginSubmitButton.textContent =
        loading
            ? "LOGGING IN..."
            : "LOGIN";

}


function getFirebaseLoginError(
    error
) {

    if (!error) {
        return "Login failed.";
    }

    const code =
        error.code || "";

    switch (code) {

        case "auth/invalid-credential":
            return "Incorrect email or password.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/user-disabled":
            return "This account has been disabled.";

        case "auth/too-many-requests":
            return "Too many login attempts. Please try again later.";

        case "auth/network-request-failed":
            return "Network error. Check your internet connection.";

        default:
            return (
                error.message ||
                "Unable to log in."
            );

    }

}


/* =========================================================
   AUTH STATE
========================================================= */

function handleCyberOSAuth(
    detail
) {

    if (!detail) {
        return;
    }

    if (
        !detail.authenticated
    ) {

        updateAuthUI(
            false,
            null,
            null
        );

        if (topStatus) {

            topStatus.textContent =
                detail.error === "NO_ROLE"
                    ? "ACCOUNT HAS NO ROLE"
                    : "SYSTEM READY";

        }

        return;

    }

    updateAuthUI(
        true,
        detail.role,
        detail.user
    );

    if (topStatus) {

        topStatus.textContent =
            detail.role === "admin"
                ? "ADMIN AUTHENTICATED"
                : "MEMBER AUTHENTICATED";

    }

}


function updateAuthUI(
    authenticated,
    role,
    user
) {

    if (
        !loginButton ||
        !loggedInArea
    ) {

        return;

    }

    if (authenticated) {

        loginButton.style.display =
            "none";

        loggedInArea.style.display =
            "flex";

        if (authUser) {

            authUser.textContent =
                user && user.email
                    ? user.email
                    : "USER";

        }

        if (authRole) {

            authRole.textContent =
                role
                    ? role.toUpperCase()
                    : "USER";

            authRole.classList.remove(
                "admin",
                "member"
            );

            if (role === "admin") {

                authRole.classList.add(
                    "admin"
                );

            } else if (
                role === "member"
            ) {

                authRole.classList.add(
                    "member"
                );

            }

        }

    } else {

        loginButton.style.display =
            "inline-flex";

        loggedInArea.style.display =
            "none";

        if (authUser) {
            authUser.textContent = "";
        }

        if (authRole) {
            authRole.textContent = "";
        }

    }

}


/* =========================================================
   LOGOUT
========================================================= */

async function logoutCyberOS() {

    console.log(
        "CYBEROS: LOGOUT BUTTON CLICKED"
    );

    if (
        !window.CyberOSFirebase ||
        !window.CyberOSFirebase.auth
    ) {

        console.error(
            "CyberOS Firebase auth does not exist."
        );

        return;

    }

    try {

        await window.CyberOSFirebase.signOut(
            window.CyberOSFirebase.auth
        );

        closeStartMenu();

        openWindows.forEach(
            (
                windowElement,
                appKey
            ) => {

                if (windowElement) {

                    const iframe =
                        windowElement.querySelector(
                            "iframe"
                        );

                    if (iframe) {

                        iframe.src =
                            "about:blank";

                    }

                    windowElement.remove();

                }

                removeTaskbarButton(
                    appKey
                );

            }
        );

        openWindows.clear();

        widgetWindows.forEach(
            (
                widget,
                appKey
            ) => {

                if (widget) {
                    widget.remove();
                }

                removeTaskbarButton(
                    appKey
                );

            }
        );

        widgetWindows.clear();

        openFolders.forEach(
            folderWindow => {

                if (folderWindow) {
                    folderWindow.remove();
                }

            }
        );

        openFolders.clear();

        openLogin();

        if (topStatus) {

            topStatus.textContent =
                "SIGNED OUT";

        }

    } catch (error) {

        console.error(
            "CYBEROS LOGOUT ERROR:",
            error
        );

        if (topStatus) {

            topStatus.textContent =
                "LOGOUT FAILED";

        }

    }

}


/* =========================================================
   START MENU
========================================================= */

function setupStartButton() {

    if (!startButton) {
        return;
    }

    startButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            toggleStartMenu();

        }
    );

    document.addEventListener(
        "pointerdown",
        event => {

            if (
                startMenu &&
                !startMenu.contains(
                    event.target
                ) &&
                !startButton.contains(
                    event.target
                )
            ) {

                closeStartMenu();

            }

        }
    );

}


function toggleStartMenu() {

    if (startMenuOpen) {

        closeStartMenu();

    } else {

        openStartMenu();

    }

}


function openStartMenu() {

    if (!startMenu) {
        return;
    }

    startMenuOpen = true;

    startMenu.classList.add(
        "open"
    );

    startMenu.style.zIndex =
        START_MENU_Z_INDEX;

}


function closeStartMenu() {

    if (!startMenu) {
        return;
    }

    startMenuOpen = false;

    startMenu.classList.remove(
        "open"
    );

}


/* =========================================================
   START MENU POPULATION
========================================================= */

function populateStartMenu() {

    if (!startMenuApps) {

        console.error(
            "startMenuApps not found"
        );

        return;

    }

    startMenuApps.innerHTML = "";

    const excludedApps = [
        "video1",
        "video2",
        "video3",
        "video4",
        "video5",
        "video6",
        "video7"
    ];

    Object.entries(
        appData
    ).forEach(
        ([appKey, app]) => {

            if (excludedApps.includes(appKey)) {
                return;
            }

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "start-menu-app";

            button.type =
                "button";

            button.dataset.app =
                appKey;

            if (app.icon) {

                const image =
                    document.createElement(
                        "img"
                    );

                image.className =
                    "start-menu-app-icon";

                image.src =
                    app.icon;

                image.alt =
                    app.name;

                image.draggable =
                    false;

                image.onerror =
                    () => {

                        image.remove();

                        button.prepend(
                            createPlaceholderIcon(
                                app
                            )
                        );

                    };

                button.appendChild(
                    image
                );

            } else {

                button.appendChild(
                    createPlaceholderIcon(
                        app
                    )
                );

            }

            const name =
                document.createElement(
                    "div"
                );

            name.className =
                "start-menu-app-name";

            name.textContent =
                app.name;

            button.appendChild(
                name
            );

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    launchApp(
                        appKey
                    );

                    closeStartMenu();

                }
            );

            startMenuApps.appendChild(
                button
            );

        }
    );

}


function createPlaceholderIcon(
    app
) {

    const placeholder =
        document.createElement(
            "div"
        );

    placeholder.className =
        "start-menu-placeholder";

    placeholder.textContent =
        app.type === "widget"
            ? "◈"
            : "▣";

    return placeholder;

}


/* =========================================================
   DESKTOP ICON SYSTEM
========================================================= */

/*
   IMPORTANT:

   Desktop positions are intentionally NOT persisted.

   There is:
   - no localStorage
   - no Firebase saving
   - no cookies
   - no IndexedDB

   The desktop is rebuilt from scratch after every reload.

   LAYOUT:

       LEFT RAIL                         RIGHT RAIL

       [ 1 ] [ 2 ] [ 3 ]                [ 1 ] [ 2 ] [ 3 ]
       [ 4 ] [ 5 ] [ 6 ]                [ 4 ] [ 5 ] [ 6 ]
       [ 7 ] [ 8 ] [ 9 ]                [ 7 ] [ 8 ] [ 9 ]

   CSS Grid controls the actual positioning.
*/


const DESKTOP_DEFAULT_POSITIONS = {

    /*
       LEFT SIDE
    */

    claw: {
        side: "left",
        order: 0
    },

    bubblegum: {
        side: "left",
        order: 1
    },

    makeup: {
        side: "left",
        order: 2
    },

    paperfortuneteller: {
        side: "left",
        order: 3
    },

    beach: {
        side: "left",
        order: 4
    },

    viewer3d:{
        side: "left",
        order: 5
    },

    goalmachine:{
        side: "left",
        order: 7
    },

    /*
       RIGHT SIDE
    */

    "fun-stuff": {
        side: "right",
        order: 0
    },

    creative: {
        side: "right",
        order: 1
    },

    GirlySeries: {
        side: "right",
        order: 2
    }

};


/* =========================================================
   DESKTOP LAYOUT SETTINGS
========================================================= */

const DESKTOP_LAYOUT = {

    /*
       Number of columns per rail.

       DO NOT change this if you want:
       3 icons per row.
    */

    columns: 3,

    /*
       Minimum rail width.
    */

    minRailWidth: 190,

    /*
       Maximum rail width.
    */

    maxRailWidth: 360,

    /*
       Top position of both rails.
    */

    top: 82,

    /*
       Horizontal screen margin.
    */

    horizontalMargin: 24,

    /*
       Space between grid cells.
    */

    gap: 12,

    /*
       Space between icon rows.
    */

    rowGap: 18

};


/* =========================================================
   CREATE DESKTOP RAIL
========================================================= */

function createDesktopRail(side) {

    const rail =
        document.createElement("div");

    rail.className =
        "cyberos-desktop-rail";

    rail.classList.add(
        side === "left"
            ? "cyberos-left-rail"
            : "cyberos-right-rail"
    );

    rail.dataset.desktopRail =
        side;

    /* =========================================
       ACTUAL GRID SETTINGS
    ========================================= */

    rail.style.gridTemplateColumns =
        "repeat(3, 120px)";

    rail.style.columnGap =
        "4px";

    rail.style.rowGap =
        "18px";

    rail.style.justifyContent =
        "center";


    /* =========================================
       OTHER SETTINGS
    ========================================= */

    rail.style.setProperty(
        "--cyber-desktop-columns",
        String(DESKTOP_LAYOUT.columns)
    );

    rail.style.setProperty(
        "--cyber-desktop-gap",
        DESKTOP_LAYOUT.gap + "px"
    );

    rail.style.setProperty(
        "--cyber-desktop-row-gap",
        DESKTOP_LAYOUT.rowGap + "px"
    );

    rail.style.setProperty(
        "--cyber-icon-size",
        (
            Number(
                CYBEROS_DESKTOP_CONFIG.iconSize
            ) || 48
        ) + "px"
    );

    rail.style.setProperty(
        "--cyber-icon-gap",
        (
            Number(
                CYBEROS_DESKTOP_CONFIG.iconGap
            ) || 18
        ) + "px"
    );

    return rail;
}


/* =========================================================
   POPULATE DESKTOP ICONS
========================================================= */


function populateDesktopIcons() {

    if (!desktopIcons) {

        console.error(
            "❌ desktopIcons NOT FOUND"
        );

        return;

    }


    /*
       Completely rebuild the desktop.
    */

    desktopIcons.innerHTML = "";


    /*
       IMPORTANT:

       desktopIcons itself becomes the full-screen
       positioning surface.

       The actual icon layout happens inside
       the two rails.
    */

    desktopIcons.style.position =
        "absolute";

    desktopIcons.style.left =
        "0px";

    desktopIcons.style.top =
        "0px";

    desktopIcons.style.right =
        "0px";

    desktopIcons.style.bottom =
        "0px";

    desktopIcons.style.width =
        "100%";

    desktopIcons.style.height =
        "100%";


    desktopIcons.style.setProperty(
        "--cyber-icon-size",
        (
            Number(
                CYBEROS_DESKTOP_CONFIG.iconSize
            ) || 48
        ) + "px"
    );


    desktopIcons.style.setProperty(
        "--cyber-icon-gap",
        (
            Number(
                CYBEROS_DESKTOP_CONFIG.iconGap
            ) || 18
        ) + "px"
    );


    /*
       Create the two responsive containers.
    */

    const leftRail =
        createDesktopRail(
            "left"
        );

    const rightRail =
        createDesktopRail(
            "right"
        );


    desktopIcons.appendChild(
        leftRail
    );

    desktopIcons.appendChild(
        rightRail
    );


    /*
       Get the configured desktop apps.

       IMPORTANT:

       The special "desktop3d" type is still
       a desktop-launchable item.

       launchApp() will detect:

           app.type === "desktop3d"

       and open the transparent 3D World
       instead of creating a normal window.
    */

    const desktopApps =
        CYBEROS_DESKTOP_CONFIG.desktopApps || [];


    /* =====================================================
       CREATE DESKTOP APPS
    ===================================================== */

    desktopApps.forEach(
        (
            appKey,
            index
        ) => {

            const app =
                appData[appKey];


            if (!app) {

                console.warn(
                    "⚠️ Desktop app not found:",
                    appKey
                );

                return;

            }


            console.log(
                "🖥️ CYBEROS DESKTOP ITEM:",
                appKey,
                app.name,
                "TYPE:",
                app.type
            );


            const icon =
                createDesktopAppIcon(
                    appKey,
                    app,
                    index
                );


            /*
               Special marker for desktop-level
               applications such as the 3D World.

               This does NOT change how the icon
               launches. launchApp() still handles
               the actual behavior.
            */

            if (
                app.type === "desktop3d"
            ) {

                icon.dataset.desktopType =
                    "desktop3d";


                icon.classList.add(
                    "desktop-3d-icon"
                );


                console.log(
                    "🌎 CYBEROS: 3D World desktop icon created"
                );

            }


            leftRail.appendChild(
                icon
            );


            /*
               Keep the normal desktop positioning
               system.

               The 3D World icon behaves like any
               other desktop icon.
            */

            positionDesktopItem(
                icon,
                appKey,
                "app",
                index
            );


            setupDesktopItemDragging(
                icon
            );

        }
    );


    /* =====================================================
       CREATE DESKTOP FOLDERS
    ===================================================== */

    Object.entries(
        CYBEROS_DESKTOP_CONFIG.folders || {}
    ).forEach(
        (
            [folderKey, folder],
            folderIndex
        ) => {

            const icon =
                createDesktopFolderIcon(
                    folderKey,
                    folder,
                    folderIndex
                );


            rightRail.appendChild(
                icon
            );


            positionDesktopItem(
                icon,
                folderKey,
                "folder",
                folderIndex
            );


            setupDesktopItemDragging(
                icon
            );

        }
    );


    /*
       Apply the initial order.

       CSS Grid still determines the actual
       row/column position.
    */

    sortDesktopRail(
        leftRail
    );

    sortDesktopRail(
        rightRail
    );


    console.log(
        "================================"
    );

    console.log(
        "✅ CYBEROS DESKTOP CREATED"
    );

    console.log(
        "LEFT RAIL:",
        leftRail.children.length,
        "items"
    );

    console.log(
        "RIGHT RAIL:",
        rightRail.children.length,
        "items"
    );

    console.log(
        "================================"
    );

}




/* =========================================================
   POSITION DESKTOP ITEM
========================================================= */

/*
   IMPORTANT:

   This function NO LONGER assigns:

       left
       top
       right
       bottom

   CSS Grid owns the position.

   This prevents browser resize overlap.
*/

function positionDesktopItem(
    element,
    itemKey,
    itemType,
    index
) {

    if (!element) {
        return;
    }


    const position =
        DESKTOP_DEFAULT_POSITIONS[
            itemKey
        ];


    /*
       Fallback side.
    */

    const side =
        position &&
        position.side
            ? position.side
            : itemType === "folder"
                ? "right"
                : "left";


    /*
       Store useful metadata.
    */

    element.dataset.desktopSide =
        side;

    element.dataset.desktopOrder =
        String(
            position &&
            Number.isFinite(
                Number(
                    position.order
                )
            )
                ? Number(
                    position.order
                )
                : index
        );


    /*
       Let CSS Grid control the position.
    */

    element.style.position =
        "relative";

    element.style.left =
        "";

    element.style.right =
        "";

    element.style.top =
        "";

    element.style.bottom =
        "";

    element.style.gridRow =
        "";

    element.style.gridColumn =
        "";

    element.style.transform =
        "";

    element.style.order =
        element.dataset.desktopOrder;


    console.log(
        "📌 DESKTOP ITEM:",
        itemKey,
        {
            side,
            order:
                element.dataset.desktopOrder
        }
    );

}


/* =========================================================
   SORT DESKTOP RAIL
========================================================= */

function sortDesktopRail(
    rail
) {

    if (!rail) {
        return;
    }


    const items = [
        ...rail.children
    ];


    items.sort(
        (
            a,
            b
        ) => {

            const orderA =
                Number(
                    a.dataset.desktopOrder
                ) || 0;

            const orderB =
                Number(
                    b.dataset.desktopOrder
                ) || 0;

            return (
                orderA -
                orderB
            );

        }
    );


    items.forEach(
        item => {

            rail.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   DESKTOP APP ICON
========================================================= */

function createDesktopAppIcon(
    appKey,
    app,
    index
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "desktop-icon";


    button.dataset.app =
        appKey;


    button.dataset.index =
        String(index);


    button.dataset.cyberApp =
        appKey;


    button.dataset.desktopItem =
        "app";


    button.draggable =
        false;


    /*
       Required for Pointer Events dragging,
       especially on touch devices.
    */

    button.style.touchAction =
        "none";


    const image =
        document.createElement(
            "img"
        );


    image.className =
        "desktop-icon-image";


    image.src =
        app.icon || "";


    image.alt =
        app.name;


    image.draggable =
        false;


    image.style.pointerEvents =
        "none";


    image.style.userSelect =
        "none";


    const size =
        (
            Number(
                CYBEROS_DESKTOP_CONFIG.iconSize
            ) || 48
        ) + "px";


    image.style.width =
        size;


    image.style.height =
        size;


    image.style.objectFit =
        "contain";


    image.onerror =
        () => {

            image.replaceWith(
                createDesktopPlaceholder(
                    app
                )
            );

        };


    button.appendChild(
        image
    );


    /* =====================================================
       LABEL
    ===================================================== */

    const label =
        document.createElement(
            "div"
        );


    label.className =
        "desktop-icon-label";


    label.textContent =
        app.name;


    label.style.pointerEvents =
        "none";


    label.style.userSelect =
        "none";


    button.appendChild(
        label
    );


    /* =====================================================
       CLICK
    ===================================================== */

    button.addEventListener(
        "click",
        event => {

            /*
               If the icon was dragged,
               don't launch the app.
            */

            if (
                button.dataset.dragged ===
                "true"
            ) {

                button.dataset.dragged =
                    "false";

                event.preventDefault();
                event.stopPropagation();

                return;

            }


            event.preventDefault();
            event.stopPropagation();


            console.log(
                "🖱️ DESKTOP APP:",
                appKey
            );


            launchApp(
                appKey
            );

        }
    );


    /* =====================================================
       CONTEXT MENU
    ===================================================== */

    button.addEventListener(
        "contextmenu",
        event => {

            event.preventDefault();
            event.stopPropagation();

        }
    );


    return button;

}


/* =========================================================
   DESKTOP FOLDER ICON
========================================================= */

function createDesktopFolderIcon(
    folderKey,
    folder,
    index
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "desktop-icon desktop-folder-icon";


    button.dataset.folder =
        folderKey;


    button.dataset.index =
        String(index);


    button.dataset.desktopItem =
        "folder";


    button.draggable =
        false;


    button.style.touchAction =
        "none";


    /* =====================================================
       FOLDER IMAGE
    ===================================================== */

    const image =
        document.createElement(
            "img"
        );


    image.className =
        "desktop-icon-image desktop-folder-image";


    image.src =
        folder.icon ||
        "./assets/icons/folder.png";


    image.alt =
        folder.name ||
        folderKey;


    image.draggable =
        false;


    image.style.pointerEvents =
        "none";


    image.style.userSelect =
        "none";


    const size =
        (
            Number(
                CYBEROS_DESKTOP_CONFIG.iconSize
            ) || 48
        ) + "px";


    image.style.width =
        size;


    image.style.height =
        size;


    image.style.objectFit =
        "contain";


    /* =====================================================
       FOLDER IMAGE FALLBACK
    ===================================================== */

    image.onerror =
        () => {

            image.src =
                "data:image/svg+xml," +
                encodeURIComponent(
                    `
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="96"
                        height="96"
                        viewBox="0 0 96 96"
                    >

                        <rect
                            x="8"
                            y="20"
                            width="80"
                            height="60"
                            rx="8"
                            fill="#F0D1A9"
                        />

                        <rect
                            x="8"
                            y="14"
                            width="38"
                            height="18"
                            rx="6"
                            fill="#F0D1A9"
                        />

                    </svg>
                    `
                );

        };


    button.appendChild(
        image
    );


    /* =====================================================
       FOLDER LABEL
    ===================================================== */

    const label =
        document.createElement(
            "div"
        );


    label.className =
        "desktop-icon-label";


    label.textContent =
        folder.name ||
        folderKey;


    label.style.pointerEvents =
        "none";


    label.style.userSelect =
        "none";


    button.appendChild(
        label
    );


    /* =====================================================
       CLICK
    ===================================================== */

    button.addEventListener(
        "click",
        event => {

            if (
                button.dataset.dragged ===
                "true"
            ) {

                button.dataset.dragged =
                    "false";

                event.preventDefault();
                event.stopPropagation();

                return;

            }


            event.preventDefault();
            event.stopPropagation();


            console.log(
                "📁 FOLDER CLICK:",
                folderKey
            );


            openDesktopFolder(
                folderKey
            );

        }
    );


    /* =====================================================
       CONTEXT MENU
    ===================================================== */

    button.addEventListener(
        "contextmenu",
        event => {

            event.preventDefault();
            event.stopPropagation();

        }
    );


    return button;

}


/* =========================================================
   DESKTOP ITEM DRAGGING
========================================================= */

/*
   GRID-SAFE DRAGGING

   Old system:
       left += deltaX
       top += deltaY

   That does NOT work with CSS Grid because
   it removes the item from the responsive layout.

   New system:

       1. CSS Grid controls normal layout.
       2. While dragging, transform moves the icon visually.
       3. On release, the nearest grid position is calculated.
       4. The item receives a new CSS order.
       5. The grid automatically rearranges.

   This means resizing the browser can never create
   the old folder overlap problem.
*/

function setupDesktopItemDragging(
    element
) {

    if (
        !element ||
        element.dataset.dragReady ===
        "true"
    ) {

        return;

    }


    element.dataset.dragReady =
        "true";


    let pointerDown =
        false;

    let dragging =
        false;

    let pointerId =
        null;


    let startPointerX =
        0;

    let startPointerY =
        0;


    let currentDeltaX =
        0;

    let currentDeltaY =
        0;


    const DRAG_THRESHOLD =
        5;


    /* =====================================================
       POINTER DOWN
    ===================================================== */

    element.addEventListener(
        "pointerdown",
        event => {

            if (
                event.button !== undefined &&
                event.button !== 0
            ) {

                return;

            }


            event.preventDefault();
            event.stopPropagation();


            pointerDown =
                true;

            dragging =
                false;

            pointerId =
                event.pointerId;


            startPointerX =
                event.clientX;

            startPointerY =
                event.clientY;


            currentDeltaX =
                0;

            currentDeltaY =
                0;


            element.dataset.dragged =
                "false";


            element.classList.remove(
                "is-dragging"
            );


            try {

                element.setPointerCapture(
                    event.pointerId
                );

            } catch {}


        },
        true
    );


    /* =====================================================
       POINTER MOVE
    ===================================================== */

    element.addEventListener(
        "pointermove",
        event => {

            if (
                !pointerDown ||
                event.pointerId !==
                pointerId
            ) {

                return;

            }


            const deltaX =
                event.clientX -
                startPointerX;


            const deltaY =
                event.clientY -
                startPointerY;


            const distance =
                Math.sqrt(
                    (
                        deltaX *
                        deltaX
                    ) +
                    (
                        deltaY *
                        deltaY
                    )
                );


            if (
                !dragging &&
                distance <
                DRAG_THRESHOLD
            ) {

                return;

            }


            if (!dragging) {

                dragging =
                    true;


                element.dataset.dragged =
                    "true";


                element.classList.add(
                    "is-dragging"
                );


                console.log(
                    "🖱️ DESKTOP ITEM DRAG START:",
                    {
                        type:
                            element.dataset.desktopItem,

                        app:
                            element.dataset.app ||
                            null,

                        folder:
                            element.dataset.folder ||
                            null,

                        side:
                            element.dataset.desktopSide ||
                            null
                    }
                );

            }


            currentDeltaX =
                deltaX;

            currentDeltaY =
                deltaY;


            /*
               Move visually using transform.

               IMPORTANT:

               We are NOT changing left/top.
               Therefore CSS Grid remains intact.
            */

            element.style.transform =
                `translate3d(${deltaX}px, ${deltaY}px, 0)`;


        },
        true
    );


    /* =====================================================
       POINTER UP
    ===================================================== */

    element.addEventListener(
        "pointerup",
        event => {

            if (
                event.pointerId !==
                pointerId
            ) {

                return;

            }


            const wasDragging =
                dragging;


            pointerDown =
                false;

            dragging =
                false;

            pointerId =
                null;


            element.classList.remove(
                "is-dragging"
            );


            try {

                element.releasePointerCapture(
                    event.pointerId
                );

            } catch {}


            /*
               If it was not a drag,
               simply let the click handler work.
            */

            if (!wasDragging) {

                element.style.transform =
                    "";

                return;

            }


            /*
               Keep the synthetic click from
               opening the item.
            */

            element.dataset.dragged =
                "true";


            element.dataset.userMoved =
                "true";


            /*
               Determine the new grid position.
            */

            const rail =
                element.closest(
                    ".cyberos-desktop-rail"
                );


            if (rail) {

                const newOrder =
                    calculateGridDropOrder(
                        element,
                        rail,
                        event.clientX,
                        event.clientY
                    );


                if (
                    Number.isFinite(
                        newOrder
                    )
                ) {

                    element.dataset.desktopOrder =
                        String(
                            newOrder
                        );

                    element.style.order =
                        String(
                            newOrder
                        );


                    sortDesktopRail(
                        rail
                    );


                    console.log(
                        "📍 DESKTOP ITEM MOVED:",
                        {
                            type:
                                element.dataset.desktopItem,

                            app:
                                element.dataset.app ||
                                null,

                            folder:
                                element.dataset.folder ||
                                null,

                            side:
                                element.dataset.desktopSide ||
                                null,

                            order:
                                newOrder
                        }
                    );

                }

            }


            /*
               Remove visual drag transform.
            */

            element.style.transform =
                "";


        },
        true
    );


    /* =====================================================
       POINTER CANCEL
    ===================================================== */

    element.addEventListener(
        "pointercancel",
        event => {

            pointerDown =
                false;

            dragging =
                false;

            pointerId =
                null;


            element.classList.remove(
                "is-dragging"
            );


            element.style.transform =
                "";


            try {

                element.releasePointerCapture(
                    event.pointerId
                );

            } catch {}

        },
        true
    );

}


/* =========================================================
   CALCULATE GRID DROP ORDER
========================================================= */

function calculateGridDropOrder(
    element,
    rail,
    pointerX,
    pointerY
) {

    if (!rail) {
        return 0;
    }


    const items = [
        ...rail.children
    ].filter(
        child =>
            child !== element
    );


    if (
        items.length === 0
    ) {

        return 0;

    }


    /*
       Get the center of every grid item.
    */

    const positions =
        items.map(
            item => {

                const rect =
                    item.getBoundingClientRect();

                return {

                    item,

                    x:
                        rect.left +
                        (
                            rect.width /
                            2
                        ),

                    y:
                        rect.top +
                        (
                            rect.height /
                            2
                        )

                };

            }
        );


    /*
       Find the closest item center.
    */

    let closestIndex =
        0;

    let closestDistance =
        Infinity;


    positions.forEach(
        (
            position,
            index
        ) => {

            const dx =
                pointerX -
                position.x;

            const dy =
                pointerY -
                position.y;


            const distance =
                (
                    dx * dx
                ) +
                (
                    dy * dy
                );


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closestIndex =
                    index;

            }

        }
    );


    /*
       Calculate where the pointer lies
       relative to the closest item.

       This makes dragging across the row
       feel more natural.
    */

    const closest =
        positions[
            closestIndex
        ];


    const insertBefore =
        pointerX <
        closest.x;


    let newIndex =
        insertBefore
            ? closestIndex
            : closestIndex + 1;


    /*
       Clamp.
    */

    newIndex =
        Math.max(
            0,
            Math.min(
                newIndex,
                items.length
            )
        );


    return newIndex;

}


/* =========================================================
   DESKTOP PLACEHOLDER
========================================================= */

function createDesktopPlaceholder(
    app
) {

    const placeholder =
        document.createElement(
            "div"
        );


    placeholder.className =
        "desktop-icon-placeholder";


    placeholder.textContent =
        app.type === "widget"
            ? "◈"
            : "▣";


    const size =
        (
            Number(
                CYBEROS_DESKTOP_CONFIG.iconSize
            ) || 48
        ) + "px";


    placeholder.style.width =
        size;

    placeholder.style.height =
        size;


    placeholder.style.pointerEvents =
        "none";


    return placeholder;

}


/* =========================================================
   FORMAT FOLDER DATE
========================================================= */

function formatFolderDate(
    dateValue
) {

    if (!dateValue) {
        return "—";
    }

    const date =
        new Date(
            dateValue
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            dateValue
        );

    }

    return date.toLocaleDateString(
        undefined,
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   GET FOLDER STATE
========================================================= */

function getFolderState(
    folderKey
) {

    if (
        !folderStates.has(
            folderKey
        )
    ) {

        folderStates.set(
            folderKey,
            {
                view: DEFAULT_FOLDER_VIEW,
                sort: DEFAULT_FOLDER_SORT
            }
        );

    }

    return folderStates.get(
        folderKey
    );

}


/* =========================================================
   OPEN DESKTOP FOLDER
========================================================= */

function openDesktopFolder(
    folderKey
) {

    const folder =
        CYBEROS_DESKTOP_CONFIG.folders[
            folderKey
        ];

    if (!folder) {

        console.error(
            "CYBEROS: Folder not found:",
            folderKey
        );

        return;

    }


    /* =====================================================
       EXISTING FOLDER
    ===================================================== */

    if (
        openFolders.has(
            folderKey
        )
    ) {

        const existing =
            openFolders.get(
                folderKey
            );

        if (
            existing &&
            document.body.contains(
                existing
            )
        ) {

            existing.style.display =
                "flex";

            existing.style.pointerEvents =
                "auto";

            bringToFront(
                existing
            );

            return;

        }

        openFolders.delete(
            folderKey
        );

    }


    /* =====================================================
       FOLDER STATE
    ===================================================== */

    const state =
        getFolderState(
            folderKey
        );


    /* =====================================================
       CREATE FOLDER WINDOW
    ===================================================== */

    const folderWindow =
        document.createElement(
            "div"
        );

    folderWindow.className =
        "cyber-folder-window";

    folderWindow.dataset.folder =
        folderKey;

    folderWindow.dataset.view =
        state.view;

    folderWindow.dataset.sort =
        state.sort;


    /*
       Interaction protection.
    */

    folderWindow.style.position =
        "absolute";

    folderWindow.style.width =
        "560px";

    folderWindow.style.height =
        "390px";

    folderWindow.style.zIndex =
        String(
            FOLDER_Z_INDEX
        );

    folderWindow.style.pointerEvents =
        "auto";

    folderWindow.style.userSelect =
        "none";


    /* =====================================================
       HEADER
    ===================================================== */

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "folder-window-header";

    header.style.pointerEvents =
        "auto";

    header.style.touchAction =
        "none";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "folder-window-title";

    title.textContent =
        folder.name ||
        folderKey;

    title.style.pointerEvents =
        "none";


    const close =
        document.createElement(
            "button"
        );

    close.type =
        "button";

    close.className =
        "folder-window-close";

    close.textContent =
        "×";

    close.title =
        "Close folder";

    close.setAttribute(
        "aria-label",
        "Close folder"
    );

    close.style.pointerEvents =
        "auto";

    close.style.position =
        "relative";

    close.style.zIndex =
        "10";


    header.appendChild(
        title
    );

    header.appendChild(
        close
    );

    folderWindow.appendChild(
        header
    );


    /* =====================================================
       FOLDER TOOLBAR
    ===================================================== */

    const toolbar =
        document.createElement(
            "div"
        );

    toolbar.className =
        "folder-window-toolbar";

    toolbar.style.pointerEvents =
        "auto";


    /* =====================================================
       TOOLBAR LEFT
    ===================================================== */

    const toolbarLeft =
        document.createElement(
            "div"
        );

    toolbarLeft.className =
        "folder-toolbar-left";


    /* =====================================================
       VIEW TOGGLE
    ===================================================== */

    const viewToggle =
        document.createElement(
            "div"
        );

    viewToggle.className =
        "folder-view-toggle";

    viewToggle.setAttribute(
        "role",
        "group"
    );

    viewToggle.setAttribute(
        "aria-label",
        "Folder view"
    );


    const gridButton =
        document.createElement(
            "button"
        );

    gridButton.type =
        "button";

    gridButton.className =
        "folder-toolbar-button folder-view-button";

    gridButton.dataset.view =
        "grid";

    gridButton.textContent =
        "▦";

    gridButton.title =
        "Grid view";

    gridButton.setAttribute(
        "aria-label",
        "Grid view"
    );


    const listButton =
        document.createElement(
            "button"
        );

    listButton.type =
        "button";

    listButton.className =
        "folder-toolbar-button folder-view-button";

    listButton.dataset.view =
        "list";

    listButton.textContent =
        "☷";

    listButton.title =
        "List view";

    listButton.setAttribute(
        "aria-label",
        "List view"
    );


    viewToggle.appendChild(
        gridButton
    );

    viewToggle.appendChild(
        listButton
    );

    toolbarLeft.appendChild(
        viewToggle
    );


    /* =====================================================
       SORT
    ===================================================== */

    const sortWrapper =
        document.createElement(
            "div"
        );

    sortWrapper.className =
        "folder-sort-wrapper";


    const sortLabel =
        document.createElement(
            "span"
        );

    sortLabel.className =
        "folder-sort-label";

    sortLabel.textContent =
        "Sort:";


    const sortSelect =
        document.createElement(
            "select"
        );

    sortSelect.className =
        "folder-sort-select";

    sortSelect.title =
        "Sort folder";


    Object.entries(
        FOLDER_SORT_OPTIONS
    ).forEach(
        ([sortKey, option]) => {

            const optionElement =
                document.createElement(
                    "option"
                );

            optionElement.value =
                sortKey;

            optionElement.textContent =
                option.label;

            sortSelect.appendChild(
                optionElement
            );

        }
    );

    sortSelect.value =
        state.sort;


    sortWrapper.appendChild(
        sortLabel
    );

    sortWrapper.appendChild(
        sortSelect
    );

    toolbarLeft.appendChild(
        sortWrapper
    );


    /* =====================================================
       TOOLBAR RIGHT
    ===================================================== */

    const toolbarRight =
        document.createElement(
            "div"
        );

    toolbarRight.className =
        "folder-toolbar-right";


    const itemCount =
        document.createElement(
            "span"
        );

    itemCount.className =
        "folder-item-count";


    toolbarRight.appendChild(
        itemCount
    );


    toolbar.appendChild(
        toolbarLeft
    );

    toolbar.appendChild(
        toolbarRight
    );

    folderWindow.appendChild(
        toolbar
    );


    /* =====================================================
       CONTENT
    ===================================================== */

    const content =
        document.createElement(
            "div"
        );

    content.className =
        "folder-window-content";

    content.style.pointerEvents =
        "auto";

    content.style.userSelect =
        "none";

    content.style.touchAction =
        "auto";

    content.dataset.view =
        state.view;


    const apps =
        Array.isArray(
            folder.apps
        )
            ? folder.apps
            : [];


    const folderItems =
        apps
            .map(
                appKey => {

                    const app =
                        appData[appKey];

                    if (!app) {
                        return null;
                    }

                    return {
                        key: appKey,
                        app: app
                    };

                }
            )
            .filter(
                item => item !== null
            );


    /* =====================================================
       RENDER FOLDER
    ===================================================== */


function renderFolder() {

    content.innerHTML = "";

    content.dataset.view =
        state.view;

    folderWindow.dataset.view =
        state.view;

    folderWindow.dataset.sort =
        state.sort;


    /* ---------------------------------------------
    UPDATE ACTIVE VIEW BUTTON
    --------------------------------------------- */

    gridButton.classList.toggle(
        "active",
        state.view === "grid"
    );

    listButton.classList.toggle(
        "active",
        state.view === "list"
    );


    /* ---------------------------------------------
    SORT
    --------------------------------------------- */

    const sortConfig =
        FOLDER_SORT_OPTIONS[
            state.sort
        ] ||
        FOLDER_SORT_OPTIONS.name;

    const sortedItems =
        [...folderItems].sort(
            sortConfig.compare
        );


    /* ---------------------------------------------
    ITEM COUNT
    --------------------------------------------- */

    const count =
        sortedItems.length;

    itemCount.textContent =
        count === 1
            ? "1 item"
            : `${count} items`;


    /* ---------------------------------------------
    EMPTY
    --------------------------------------------- */

    if (!sortedItems.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "folder-empty";

        empty.textContent =
            "This folder is empty.";

        content.appendChild(
            empty
        );

        return;

    }


    /* =================================================
    LIST HEADER
    ================================================= */

    if (state.view === "list") {

        const listHeader =
            document.createElement(
                "div"
            );

        listHeader.className =
            "folder-list-header";


        /* NAME */

        const nameHeader =
            document.createElement(
                "span"
            );

        nameHeader.className =
            "folder-list-header-name";

        nameHeader.textContent =
            "Name";


        /* TYPE */

        const typeHeader =
            document.createElement(
                "span"
            );

        typeHeader.className =
            "folder-list-header-type";

        typeHeader.textContent =
            "Type";


        /* SIZE */

        const sizeHeader =
            document.createElement(
                "span"
            );

        sizeHeader.className =
            "folder-list-header-size";

        sizeHeader.textContent =
            "Size";


        /* DATE */

        const dateHeader =
            document.createElement(
                "span"
            );

        dateHeader.className =
            "folder-list-header-date";

        dateHeader.textContent =
            "Date Created";


        listHeader.appendChild(
            nameHeader
        );

        listHeader.appendChild(
            typeHeader
        );

        listHeader.appendChild(
            sizeHeader
        );

        listHeader.appendChild(
            dateHeader
        );

        content.appendChild(
            listHeader
        );

    }


    /* =================================================
    APP ITEMS
    ================================================= */

    sortedItems.forEach(
        item => {

            const appKey =
                item.key;

            const app =
                item.app;


            const appButton =
                document.createElement(
                    "button"
                );

            appButton.type =
                "button";

            appButton.className =
                "folder-app";

            appButton.dataset.app =
                appKey;

            appButton.dataset.folderApp =
                "true";


            /* -----------------------------------------
            INTERACTION
            ----------------------------------------- */

            appButton.style.pointerEvents =
                "auto";

            appButton.style.position =
                "relative";

            appButton.style.zIndex =
                "5";

            appButton.style.cursor =
                "pointer";

            appButton.style.touchAction =
                "manipulation";


            /* -----------------------------------------
            ICON
            ----------------------------------------- */

            const image =
                document.createElement(
                    "img"
                );

            image.alt =
                app.name;

            image.draggable =
                false;

            image.className =
                "folder-app-icon";

            image.style.pointerEvents =
                "none";

            image.style.userSelect =
                "none";

            // Remove any background styling from icon image
            image.style.background =
                "none";

            image.style.backgroundColor =
                "transparent";

            // Check if file is a video
            const isVideo =
                app.fileType === "Video" ||
                (app.url && app.url.endsWith(".mp4"));

                appButton.dataset.fileType = app.fileType || "";

            if (isVideo) {

                image.src =
                    app.icon ||
                    "./assets/icons/default_video.png";

                generateVideoThumbnail(app.url)
                    .then(thumbnailUrl => {
                        image.src = thumbnailUrl;
                        image.style.display = "";
                    })
                    .catch(() => {
                        image.src =
                            app.icon ||
                            "./assets/icons/default_video.png";
                    });

            } else {

                image.src =
                    app.icon || "";

            }

            image.onerror = () => {

                if (!isVideo) {

                    image.style.display =
                        "none";

                }

            };


            /* -----------------------------------------
            NAME
            ----------------------------------------- */

            const name =
                document.createElement(
                    "span"
                );

            name.className =
                "folder-app-name";

            name.textContent =
                app.name;

            name.style.pointerEvents =
                "none";


            /* =================================================
            LIST VIEW
            ================================================= */

            if (state.view === "list") {

                const nameWrapper =
                    document.createElement(
                        "div"
                    );

                nameWrapper.className =
                    "folder-list-name-wrapper";

                nameWrapper.appendChild(
                    image
                );

                nameWrapper.appendChild(
                    name
                );


                /* TYPE */

                const type =
                    document.createElement(
                        "span"
                    );

                type.className =
                    "folder-list-type";

                type.textContent =
                    app.fileType ||
                    app.type ||
                    "Application";

                type.style.pointerEvents =
                    "none";


                /* SIZE */

                const size =
                    document.createElement(
                        "span"
                    );

                size.className =
                    "folder-list-size";

                size.textContent =
                    app.size ||
                    "—";

                size.style.pointerEvents =
                    "none";


                /* DATE */

                const date =
                    document.createElement(
                        "span"
                    );

                date.className =
                    "folder-list-date";

                date.textContent =
                    formatFolderDate(
                        app.dateCreated
                    );

                date.style.pointerEvents =
                    "none";


                appButton.appendChild(
                    nameWrapper
                );

                appButton.appendChild(
                    type
                );

                appButton.appendChild(
                    size
                );

                appButton.appendChild(
                    date
                );

            }


            /* =================================================
            GRID VIEW
            ================================================= */

            else {

                appButton.appendChild(
                    image
                );

                appButton.appendChild(
                    name
                );

            }


            /* ---------------------------------------------
            TOOLTIP / METADATA
            --------------------------------------------- */

            appButton.title =
                [
                    app.name,
                    app.fileType ||
                        app.type ||
                        "Application",
                    app.size ||
                        "Size unavailable",
                    formatFolderDate(
                        app.dateCreated
                    )
                ].join(
                    " • "
                );


            /* =================================================
            POINTERDOWN
            ================================================= */

            appButton.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    bringToFront(
                        folderWindow
                    );

                },
                true
            );


            /* =================================================
            CLICK
            ================================================= */

            appButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "📂 FOLDER APP CLICK:",
                        folderKey,
                        appKey
                    );

                    launchApp(
                        appKey
                    );

                },
                true
            );


            content.appendChild(
                appButton
            );

        }
    );

}


    folderWindow.appendChild(
        content
    );


    /* =====================================================
       ADD TO APP LAYER
    ===================================================== */

    const targetLayer =
        appLayer ||
        desktop;

    if (!targetLayer) {

        console.error(
            "CYBEROS: No layer available for folder."
        );

        return;

    }


    folderWindow.style.pointerEvents =
        "auto";


    targetLayer.appendChild(
        folderWindow
    );


    openFolders.set(
        folderKey,
        folderWindow
    );


    /* =====================================================
       VIEW BUTTONS
    ===================================================== */

    gridButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            state.view =
                "grid";

            folderStates.set(
                folderKey,
                state
            );

            renderFolder();

            bringToFront(
                folderWindow
            );

        }
    );


    listButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            state.view =
                "list";

            folderStates.set(
                folderKey,
                state
            );

            renderFolder();

            bringToFront(
                folderWindow
            );

        }
    );


    /* =====================================================
       SORT SELECT
    ===================================================== */

    sortSelect.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    sortSelect.addEventListener(
        "pointerdown",
        event => {

            event.stopPropagation();

            bringToFront(
                folderWindow
            );

        }
    );


    sortSelect.addEventListener(
        "change",
        event => {

            event.preventDefault();
            event.stopPropagation();

            const newSort =
                sortSelect.value;

            if (
                FOLDER_SORT_OPTIONS[
                    newSort
                ]
            ) {

                state.sort =
                    newSort;

            } else {

                state.sort =
                    DEFAULT_FOLDER_SORT;

            }

            folderStates.set(
                folderKey,
                state
            );

            renderFolder();

            sortSelect.value =
                state.sort;

            bringToFront(
                folderWindow
            );

        }
    );


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    const closeFolder =
        event => {

            event.preventDefault();
            event.stopPropagation();

            console.log(
                "📁 CLOSING FOLDER:",
                folderKey
            );

            openFolders.delete(
                folderKey
            );

            folderWindow.style.display =
                "none";

            folderWindow.remove();

        };


    close.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();
            event.stopPropagation();

            bringToFront(
                folderWindow
            );

        },
        true
    );


    close.addEventListener(
        "click",
        closeFolder,
        true
    );


    close.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();
                event.stopPropagation();

                closeFolder(
                    event
                );

            }

        },
        true
    );


    /* =====================================================
       FOLDER FOCUS
    ===================================================== */

    folderWindow.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    ".folder-app"
                )
            ) {

                bringToFront(
                    folderWindow
                );

                return;

            }

            if (
                event.target.closest(
                    ".folder-window-close"
                )
            ) {

                bringToFront(
                    folderWindow
                );

                return;

            }

            if (
                event.target.closest(
                    ".folder-window-toolbar"
                )
            ) {

                bringToFront(
                    folderWindow
                );

                return;

            }

            bringToFront(
                folderWindow
            );

        },
        false
    );


    /* =====================================================
       DRAG
    ===================================================== */

    setupFolderDragging(
        folderWindow,
        header
    );


    /* =====================================================
       INITIAL RENDER
    ===================================================== */

    renderFolder();


    /* =====================================================
       CENTER
    ===================================================== */

    requestAnimationFrame(
        () => {

            const layer =
                appLayer ||
                desktop;

            if (!layer) {
                return;
            }

            const layerWidth =
                layer.clientWidth;

            const layerHeight =
                layer.clientHeight;

            const width =
                folderWindow.offsetWidth;

            const height =
                folderWindow.offsetHeight;

            folderWindow.style.left =
                Math.max(
                    0,
                    (
                        layerWidth -
                        width
                    ) / 2
                ) + "px";

            folderWindow.style.top =
                Math.max(
                    0,
                    (
                        layerHeight -
                        height
                    ) / 2
                ) + "px";

            bringToFront(
                folderWindow
            );

        }
    );


    console.log(
        "📁 OPENED FOLDER:",
        folderKey,
        {
            apps,
            view: state.view,
            sort: state.sort
        }
    );

}


/* =========================================================
   FOLDER DRAGGING
========================================================= */

function setupFolderDragging(
    folderWindow,
    header
) {

    if (
        !folderWindow ||
        !header
    ) {

        return;

    }


    let dragging =
        false;

    let startX =
        0;

    let startY =
        0;

    let startLeft =
        0;

    let startTop =
        0;


    header.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    ".folder-window-close"
                )
            ) {

                return;

            }


            /*
               Only the header is draggable.
            */

            if (
                event.target.closest(
                    ".folder-window-content"
                )
            ) {

                return;

            }

            if (
                event.target.closest(
                    ".folder-window-toolbar"
                )
            ) {

                return;

            }


            dragging =
                true;

            startX =
                event.clientX;

            startY =
                event.clientY;

            startLeft =
                folderWindow.offsetLeft;

            startTop =
                folderWindow.offsetTop;


            bringToFront(
                folderWindow
            );


            try {

                header.setPointerCapture(
                    event.pointerId
                );

            } catch {}


            event.preventDefault();
            event.stopPropagation();

        }
    );


    header.addEventListener(
        "pointermove",
        event => {

            if (!dragging) {
                return;
            }


            const deltaX =
                event.clientX -
                startX;

            const deltaY =
                event.clientY -
                startY;


            let newLeft =
                startLeft +
                deltaX;

            let newTop =
                startTop +
                deltaY;


            const visible =
                40;

            const layer =
                appLayer ||
                desktop;

            if (layer) {

                const maxLeft =
                    layer.clientWidth -
                    visible;

                const maxTop =
                    layer.clientHeight -
                    visible;

                newLeft =
                    Math.max(
                        -folderWindow.offsetWidth +
                        visible,
                        Math.min(
                            newLeft,
                            maxLeft
                        )
                    );

                newTop =
                    Math.max(
                        0,
                        Math.min(
                            newTop,
                            maxTop
                        )
                    );

            }


            folderWindow.style.left =
                newLeft + "px";

            folderWindow.style.top =
                newTop + "px";

        }
    );


    header.addEventListener(
        "pointerup",
        event => {

            if (!dragging) {
                return;
            }

            dragging =
                false;

            try {

                header.releasePointerCapture(
                    event.pointerId
                );

            } catch {}

        }
    );


    header.addEventListener(
        "pointercancel",
        () => {

            dragging =
                false;

        }
    );

}


/* =========================================================
   DESKTOP 3D WORLD
========================================================= */

/*
   The 3D World is NOT opened inside a normal
   CyberOS application window.

   Instead, it gets its own transparent layer
   directly on the desktop.

   IMPORTANT:

   The iframe is intentionally interactive.

   This allows the Three.js OrbitControls inside
   the 3D viewer to receive:

   - mouse drag
   - middle mouse
   - right mouse
   - mouse wheel
   - touch gestures
*/


let desktop3DWorld =
    null;


/* =========================================================
   3D WORLD OPEN STATE
========================================================= */

function is3DWorldOpen() {

    return (
        desktop3DWorld &&
        document.body.contains(
            desktop3DWorld
        ) &&
        desktop3DWorld.style.display !== "none"
    );

}


/* =========================================================
   CLOSE 3D WORLD
========================================================= */

function close3DWorld() {

    if (
        !desktop3DWorld
    ) {

        return;

    }


    if (
        !document.body.contains(
            desktop3DWorld
        )
    ) {

        return;

    }


    console.log(
        "🌎 CYBEROS: Closing 3D World"
    );


    desktop3DWorld.style.display =
        "none";


    desktop3DWorld.style.pointerEvents =
        "none";


    /*
       Return keyboard focus to the main
       CyberOS document.

       This is important because the iframe
       may have captured keyboard focus.
    */

    try {

        window.focus();

    } catch {}


}


/* =========================================================
   OPEN 3D WORLD
========================================================= */

function open3DWorld() {

    console.log(
        "🌎 CYBEROS: Opening desktop 3D World"
    );


    /* =====================================================
       EXISTING 3D WORLD
    ===================================================== */

    if (
        desktop3DWorld &&
        document.body.contains(
            desktop3DWorld
        )
    ) {

        desktop3DWorld.style.display =
            "block";


        desktop3DWorld.style.pointerEvents =
            "auto";


        /*
           Make sure the iframe itself is
           still interactive.
        */

        const existingFrame =
            desktop3DWorld.querySelector(
                "iframe"
            );


        if (existingFrame) {

            existingFrame.style.pointerEvents =
                "auto";


            existingFrame.style.touchAction =
                "none";

        }


        console.log(
            "🌎 CYBEROS: Existing 3D World restored"
        );


        return;

    }


    /* =====================================================
       CREATE DESKTOP LAYER
    ===================================================== */

    desktop3DWorld =
        document.createElement(
            "div"
        );


    desktop3DWorld.id =
        "cyberos-desktop-3d";


    /* =====================================================
       DESKTOP LAYER STYLE
    ===================================================== */

    desktop3DWorld.style.position =
        "fixed";


    desktop3DWorld.style.left =
        "0px";


    desktop3DWorld.style.top =
        "0px";


    desktop3DWorld.style.width =
        "100vw";


    desktop3DWorld.style.height =
        "100vh";


    desktop3DWorld.style.margin =
        "0";


    desktop3DWorld.style.padding =
        "0";


    desktop3DWorld.style.background =
        "transparent";


    desktop3DWorld.style.backgroundColor =
        "transparent";


    desktop3DWorld.style.border =
        "0";


    desktop3DWorld.style.outline =
        "none";


    desktop3DWorld.style.overflow =
        "hidden";


    /*
       VERY IMPORTANT:

       The parent must allow pointer interaction
       so the iframe can receive OrbitControls input.
    */

    desktop3DWorld.style.pointerEvents =
        "auto";


    /*
       Keep the 3D World above the desktop
       but below higher-level CyberOS windows.
    */

    desktop3DWorld.style.zIndex =
        "20";


    desktop3DWorld.style.userSelect =
        "none";


    desktop3DWorld.style.touchAction =
        "none";


    /* =====================================================
       CREATE IFRAME
    ===================================================== */

    const frame =
        document.createElement(
            "iframe"
        );


    frame.src =
        "./apps/3dviewer/index.html";


    frame.title =
        "CyberOS 3D World";


    frame.frameBorder =
        "0";


    frame.allow =
        "fullscreen";


    frame.setAttribute(
        "allowtransparency",
        "true"
    );


    /*
       Position the viewer across the entire
       CyberOS desktop.
    */

    frame.style.position =
        "absolute";


    frame.style.left =
        "0px";


    frame.style.top =
        "0px";


    frame.style.width =
        "100%";


    frame.style.height =
        "100%";


    frame.style.margin =
        "0";


    frame.style.padding =
        "0";


    frame.style.border =
        "0";


    frame.style.outline =
        "none";


    frame.style.background =
        "transparent";


    frame.style.backgroundColor =
        "transparent";


    /*
       CRITICAL:

       The iframe MUST receive pointer input.

       Without this OrbitControls cannot receive
       drag / wheel / mouse input.
    */

    frame.style.pointerEvents =
        "auto";


    frame.style.userSelect =
        "none";


    frame.style.touchAction =
        "none";


    /*
       Make sure the iframe sits above
       the transparent parent layer.
    */

    frame.style.zIndex =
        "1";


    /*
       Allow browser fullscreen APIs if needed.
    */

    frame.setAttribute(
        "allowfullscreen",
        "true"
    );


    /* =====================================================
       IFRAME LOAD
    ===================================================== */

    frame.addEventListener(
        "load",
        () => {

            console.log(
                "🌎 CYBEROS: 3D viewer iframe loaded"
            );


            /*
               Re-apply interaction properties
               after the iframe loads.
            */

            frame.style.pointerEvents =
                "auto";


            frame.style.touchAction =
                "none";


            /* =================================================
               CONNECT ESC INSIDE THE IFRAME
            ================================================= */

            try {

                const iframeDocument =
                    frame.contentDocument;


                if (
                    iframeDocument
                ) {

                    iframeDocument.addEventListener(
                        "keydown",
                        event => {

                            if (
                                event.key === "Escape" ||
                                event.code === "Escape"
                            ) {

                                console.log(
                                    "🌎 CYBEROS: ESC received inside 3D viewer"
                                );


                                event.preventDefault();
                                event.stopPropagation();


                                close3DWorld();

                            }

                        },
                        true
                    );

                }

            } catch (
                error
            ) {

                console.warn(
                    "🌎 CYBEROS: Could not install iframe ESC handler:",
                    error
                );

            }


            /* =================================================
               CONNECT CYBEROS APP REFERENCES
            ================================================= */

            try {

                frame.contentWindow.CyberOSAppKey = "viewer3d"; frame.contentWindow.CyberOSApp = window.CyberOSApp; frame.contentWindow.close3DWorld = close3DWorld;

            } catch (
                error
            ) {

                console.warn(
                    "🌎 CYBEROS: iframe initialization warning:",
                    error
                );

            }

        }
    );


    /* =====================================================
       IFRAME POINTER FOCUS
    ===================================================== */

    /*
       When the user starts interacting with the
       3D World, make sure the iframe receives focus.

       This is especially important for:

       - ESC
       - keyboard controls
       - OrbitControls
       - touch interaction
    */

    frame.addEventListener(
        "pointerdown",
        event => {

            console.log(
                "🌎 CYBEROS: 3D World pointer interaction"
            );


            try {

                frame.focus();

            } catch {}


            /*
               Do NOT preventDefault here.

               Three.js needs the original pointer
               event to reach its canvas.
            */

        },
        false
    );


    /* =====================================================
       ADD IFRAME TO DESKTOP LAYER
    ===================================================== */

    desktop3DWorld.appendChild(
        frame
    );


    /* =====================================================
       ADD DESKTOP 3D LAYER TO PAGE
    ===================================================== */

    document.body.appendChild(
        desktop3DWorld
    );


    console.log(
        "✨ CYBEROS: Transparent 3D World added to desktop"
    );

}


/* =========================================================
   ESC — CLOSE DESKTOP 3D WORLD
========================================================= */

/*
   This listener handles ESC when the focus is
   on the normal CyberOS page.

   A second ESC handler was installed inside
   the iframe above for when the 3D viewer
   itself has keyboard focus.
*/

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape" &&
            event.code !== "Escape"
        ) {

            return;

        }


        /*
           Only handle ESC if the 3D World
           is currently visible.
        */

        if (
            !is3DWorldOpen()
        ) {

            return;

        }


        console.log(
            "🌎 CYBEROS: ESC pressed — closing 3D World"
        );


        event.preventDefault();
        event.stopPropagation();


        close3DWorld();

    },
    true
);




/* =========================================================
   LAUNCH APP
========================================================= */

function launchApp(
    appKey
) {

    const app =
        appData[appKey];


    if (!app) {

        console.warn(
            "CYBEROS: App does not exist:",
            appKey
        );

        return;

    }


    console.log(
        "🚀 LAUNCHING:",
        appKey,
        app.name
    );


    /* =====================================================
       SPECIAL DESKTOP 3D APP
    ===================================================== */

    if (
        app.type === "desktop3d"
    ) {

        console.log(
            "🌎 CYBEROS: Opening 3D World directly on desktop"
        );


        open3DWorld();


        return;

    }


    /* =====================================================
       WIDGET
    ===================================================== */

    if (
        app.type === "widget"
    ) {

        createWidget(
            appKey
        );

        return;

    }


    /* =====================================================
       EXISTING WINDOW
    ===================================================== */

    if (
        openWindows.has(
            appKey
        )
    ) {

        const existing =
            openWindows.get(
                appKey
            );


        if (
            existing &&
            document.body.contains(
                existing
            )
        ) {

            existing.style.display =
                "flex";

            existing.style.pointerEvents =
                "auto";


            bringToFront(
                existing
            );


            return;

        }


        openWindows.delete(
            appKey
        );

    }


    /* =====================================================
       MAXIMUM OPEN WINDOWS
    ===================================================== */

    if (
        openWindows.size >=
        MAX_OPEN_TABS
    ) {

        if (topStatus) {

            topStatus.textContent =
                "MAXIMUM 3 APPS OPEN";


            setTimeout(
                () => {

                    topStatus.textContent =
                        "SYSTEM READY";

                },
                2000
            );

        }


        return;

    }


    /* =====================================================
       NORMAL APP WINDOW
    ===================================================== */

    createAppWindow(
        appKey
    );

}




/* =========================================================
   CREATE APP WINDOW
========================================================= */

function createAppWindow(appKey) {
    const app = appData[appKey];
    if (!app || !appLayer) {
        return;
    }

    // Check if app is a video based on fileType or URL extension
    const isVideo = app.fileType === "Video" || (app.url && app.url.toLowerCase().endsWith(".mp4"));

    const windowElement = document.createElement("div");
    windowElement.className = "cyber-window";
    windowElement.dataset.app = appKey;

    windowElement.innerHTML = `
        <div class="window-header">
            <div class="window-title">
                ${escapeHTML(app.name)}
            </div>
            <div class="window-controls">
                <button
                    class="maximize"
                    type="button"
                    title="Maximize"
                >
                    □
                </button>
                <button
                    class="close"
                    type="button"
                    title="Close"
                >
                    ×
                </button>
            </div>
        </div>
        <div class="window-content">
            ${
                isVideo
                    ? `<video
                        src="${escapeAttribute(app.url)}"
                        controls
                        autoplay
                        style="width: 100%; height: 100%; object-fit: cover; background: #000;"
                    ></video>`
                    : `<iframe
                        src="${escapeAttribute(app.url)}"
                        title="${escapeAttribute(app.name)}"
                        frameborder="0"
                        allow="fullscreen"
                    ></iframe>`
            }
        </div>
    `;

    windowElement.style.pointerEvents = "auto";
    appLayer.appendChild(windowElement);
    openWindows.set(appKey, windowElement);

    const header = windowElement.querySelector(".window-header");
    const iframe = windowElement.querySelector("iframe");
    const maximizeButton = windowElement.querySelector(".maximize");
    const closeButton = windowElement.querySelector(".close");

    windowElement.style.width = DEFAULT_WIDTH + "px";
    windowElement.style.height = DEFAULT_HEIGHT + "px";
    windowElement.style.position = "absolute";

    requestAnimationFrame(() => {
        centerWindow(windowElement);
    });

    // Safeguard iframe listeners so non-iframe elements don't cause errors
    if (iframe) {
        iframe.addEventListener("load", () => {
            try {
                iframe.contentWindow.CyberOSAppKey = appKey;
                iframe.contentWindow.CyberOSApp = window.CyberOSApp;
            } catch (error) {
                console.warn(
                    "CyberOS iframe initialization error:",
                    error
                );
            }

            installIframeEscapeHandler(
                iframe,
                windowElement
            );
        });
    }

    windowElement.addEventListener("pointerdown", () => {
        bringToFront(windowElement);
    });

    maximizeButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        if (
            windowElement.classList.contains(
                "maximized"
            )
        ) {
            restoreWindow(windowElement);
        } else {
            maximizeWindow(windowElement);
        }
    });

    closeButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        closeWindow(
            appKey,
            windowElement
        );
    });

    setupWindowDragging(
        windowElement,
        header
    );

    addTaskbarButton(appKey);

    bringToFront(windowElement);
}


/* =========================================================
   IFRAME ESC
========================================================= */

function installIframeEscapeHandler(
    iframe,
    windowElement
) {

    try {

        const iframeDocument =
            iframe.contentDocument;

        if (!iframeDocument) {
            return;
        }

        iframeDocument.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Escape" &&
                    event.code !== "Escape"
                ) {

                    return;

                }

                if (
                    windowElement.classList.contains(
                        "maximized"
                    )
                ) {

                    event.preventDefault();
                    event.stopPropagation();

                    restoreWindow(
                        windowElement
                    );

                }

            },
            true
        );

    } catch (error) {

        console.warn(
            "Iframe ESC unavailable:",
            error
        );

    }

}


/* =========================================================
   CLOSE WINDOW
========================================================= */

function closeWindow(
    appKey,
    windowElement
) {

    if (!windowElement) {
        return;
    }

    console.log(
        "❌ CLOSING APP:",
        appKey
    );

    const iframe =
        windowElement.querySelector(
            "iframe"
        );

    if (iframe) {

        iframe.src =
            "about:blank";

    }

    openWindows.delete(
        appKey
    );

    windowElement.remove();

    removeTaskbarButton(
        appKey
    );

}


/* =========================================================
   MAXIMIZE
========================================================= */

function maximizeWindow(
    windowElement
) {

    if (
        !windowElement.dataset.restoreWidth
    ) {

        windowElement.dataset.restoreLeft =
            windowElement.style.left;

        windowElement.dataset.restoreTop =
            windowElement.style.top;

        windowElement.dataset.restoreWidth =
            windowElement.offsetWidth;

        windowElement.dataset.restoreHeight =
            windowElement.offsetHeight;

    }

    if (
        windowElement.parentElement !==
        desktop
    ) {

        desktop.appendChild(
            windowElement
        );

    }

    windowElement.classList.add(
        "maximized"
    );

    const maximizeButton =
        windowElement.querySelector(
            ".maximize"
        );

    if (maximizeButton) {

        maximizeButton.textContent =
            "❐";

        maximizeButton.title =
            "Restore";

    }

    windowElement.style.position =
        "fixed";

    windowElement.style.left =
        "0px";

    windowElement.style.top =
        "0px";

    windowElement.style.right =
        "0px";

    windowElement.style.bottom =
        "0px";

    windowElement.style.width =
        "100vw";

    windowElement.style.height =
        "100vh";

    windowElement.style.zIndex =
        MAXIMIZED_Z_INDEX;

    windowElement.style.pointerEvents =
        "auto";

    bringToFront(
        windowElement
    );

}


/* =========================================================
   RESTORE
========================================================= */

function restoreWindow(
    windowElement
) {

    if (
        !windowElement.classList.contains(
            "maximized"
        )
    ) {

        return;

    }

    const savedLeft =
        windowElement.dataset.restoreLeft;

    const savedTop =
        windowElement.dataset.restoreTop;

    const savedWidth =
        Number(
            windowElement.dataset.restoreWidth
        ) || DEFAULT_WIDTH;

    const savedHeight =
        Number(
            windowElement.dataset.restoreHeight
        ) || DEFAULT_HEIGHT;

    windowElement.classList.remove(
        "maximized"
    );

    if (
        windowElement.parentElement !==
        appLayer
    ) {

        appLayer.appendChild(
            windowElement
        );

    }

    windowElement.style.position =
        "absolute";

    windowElement.style.left =
        "";

    windowElement.style.top =
        "";

    windowElement.style.right =
        "";

    windowElement.style.bottom =
        "";

    windowElement.style.width =
        savedWidth + "px";

    windowElement.style.height =
        savedHeight + "px";

    windowElement.style.zIndex =
        "";

    windowElement.style.pointerEvents =
        "auto";

    const maximizeButton =
        windowElement.querySelector(
            ".maximize"
        );

    if (maximizeButton) {

        maximizeButton.textContent =
            "□";

        maximizeButton.title =
            "Maximize";

    }

    requestAnimationFrame(
        () => {

            if (
                savedLeft !== undefined &&
                savedLeft !== ""
            ) {

                windowElement.style.left =
                    savedLeft;

            } else {

                centerWindow(
                    windowElement
                );

            }

            if (
                savedTop !== undefined &&
                savedTop !== ""
            ) {

                windowElement.style.top =
                    savedTop;

            }

            delete windowElement.dataset.restoreLeft;
            delete windowElement.dataset.restoreTop;
            delete windowElement.dataset.restoreWidth;
            delete windowElement.dataset.restoreHeight;

        }
    );

    bringToFront(
        windowElement
    );

}


/* =========================================================
   GLOBAL ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape" &&
            event.code !== "Escape"
        ) {

            return;

        }

        for (
            const windowElement
            of openWindows.values()
        ) {

            if (
                windowElement &&
                windowElement.classList.contains(
                    "maximized"
                )
            ) {

                event.preventDefault();
                event.stopPropagation();

                restoreWindow(
                    windowElement
                );

                return;

            }

        }

    },
    true
);


/* =========================================================
   CENTER
========================================================= */

function centerWindow(
    windowElement
) {

    if (!appLayer) {
        return;
    }

    const layerWidth =
        appLayer.clientWidth;

    const layerHeight =
        appLayer.clientHeight;

    const width =
        windowElement.offsetWidth;

    const height =
        windowElement.offsetHeight;

    const left =
        (layerWidth - width) / 2;

    const top =
        (layerHeight - height) / 2;

    windowElement.style.left =
        Math.max(
            0,
            left
        ) + "px";

    windowElement.style.top =
        Math.max(
            0,
            top
        ) + "px";

}


/* =========================================================
   BRING TO FRONT
========================================================= */

function bringToFront(
    windowElement
) {

    if (!windowElement) {
        return;
    }

    if (
        windowElement.classList.contains(
            "maximized"
        )
    ) {

        windowElement.style.zIndex =
            MAXIMIZED_Z_INDEX;

    } else if (
        windowElement.classList.contains(
            "cyber-folder-window"
        )
    ) {

        highestZIndex =
            Math.max(
                highestZIndex + 1,
                FOLDER_Z_INDEX
            );

        windowElement.style.zIndex =
            highestZIndex;

    } else {

        highestZIndex =
            Math.max(
                highestZIndex + 1,
                NORMAL_APP_Z_INDEX + 1
            );

        windowElement.style.zIndex =
            highestZIndex;

    }

    windowElement.style.pointerEvents =
        "auto";

    updateTaskbarState(
        windowElement.dataset.app
    );

}


/* =========================================================
   DRAGGING APP WINDOWS
========================================================= */

function setupWindowDragging(
    windowElement,
    header
) {

    if (!header) {
        return;
    }

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;

    header.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    ".window-controls"
                )
            ) {

                return;

            }

            if (
                windowElement.classList.contains(
                    "maximized"
                )
            ) {

                return;

            }

            dragging = true;

            startX =
                event.clientX;

            startY =
                event.clientY;

            startLeft =
                windowElement.offsetLeft;

            startTop =
                windowElement.offsetTop;

            try {

                header.setPointerCapture(
                    event.pointerId
                );

            } catch {}

            bringToFront(
                windowElement
            );

        }
    );

    header.addEventListener(
        "pointermove",
        event => {

            if (!dragging) {
                return;
            }

            const deltaX =
                event.clientX -
                startX;

            const deltaY =
                event.clientY -
                startY;

            let newLeft =
                startLeft +
                deltaX;

            let newTop =
                startTop +
                deltaY;

            const visibleAmount =
                40;

            const minLeft =
                -windowElement.offsetWidth +
                visibleAmount;

            const maxLeft =
                appLayer.clientWidth -
                visibleAmount;

            const minTop =
                0;

            const taskbar =
                document.getElementById(
                    "taskbar"
                );

            const taskbarHeight =
                taskbar
                    ? taskbar.offsetHeight
                    : 64;

            const maxTop =
                appLayer.clientHeight -
                taskbarHeight -
                40;

            newLeft =
                Math.max(
                    minLeft,
                    Math.min(
                        newLeft,
                        maxLeft
                    )
                );

            newTop =
                Math.max(
                    minTop,
                    Math.min(
                        newTop,
                        Math.max(
                            minTop,
                            maxTop
                        )
                    )
                );

            windowElement.style.left =
                newLeft + "px";

            windowElement.style.top =
                newTop + "px";

        }
    );

    header.addEventListener(
        "pointerup",
        event => {

            dragging = false;

            try {

                header.releasePointerCapture(
                    event.pointerId
                );

            } catch {}

        }
    );

    header.addEventListener(
        "pointercancel",
        () => {

            dragging = false;

        }
    );

}


/* =========================================================
   TASKBAR
========================================================= */

function addTaskbarButton(
    appKey
) {

    if (!taskbarApps) {
        return;
    }

    if (
        document.getElementById(
            "taskbar-" + appKey
        )
    ) {

        return;

    }

    const app =
        appData[appKey];

    if (!app) {
        return;
    }

    const button =
        document.createElement(
            "button"
        );

    button.id =
        "taskbar-" + appKey;

    button.className =
        "taskbar-app";

    button.type =
        "button";

    button.dataset.app =
        appKey;

    if (app.icon) {

        const image =
            document.createElement(
                "img"
            );

        image.className =
            "taskbar-app-icon";

        image.src =
            app.icon;

        image.alt =
            "";

        image.draggable =
            false;

        image.onerror =
            () => {

                image.remove();

            };

        button.appendChild(
            image
        );

    }

    const name =
        document.createElement(
            "span"
        );

    name.className =
        "taskbar-app-name";

    name.textContent =
        app.name;

    button.appendChild(
        name
    );

    button.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            const windowElement =
                openWindows.get(
                    appKey
                );

            if (windowElement) {

                bringToFront(
                    windowElement
                );

                return;

            }

            const widget =
                widgetWindows.get(
                    appKey
                );

            if (widget) {

                bringToFront(
                    widget
                );

                return;

            }

            launchApp(
                appKey
            );

        }
    );

    taskbarApps.appendChild(
        button
    );

}


function removeTaskbarButton(
    appKey
) {

    const button =
        document.getElementById(
            "taskbar-" + appKey
        );

    if (button) {

        button.remove();

    }

}


function updateTaskbarState(
    activeAppKey
) {

    document
        .querySelectorAll(
            ".taskbar-app"
        )
        .forEach(
            button => {

                const key =
                    button.dataset.app;

                const windowElement =
                    openWindows.get(
                        key
                    );

                const widget =
                    widgetWindows.get(
                        key
                    );

                if (
                    key === activeAppKey &&
                    (
                        windowElement ||
                        widget
                    )
                ) {

                    button.classList.add(
                        "active"
                    );

                } else {

                    button.classList.remove(
                        "active"
                    );

                }

            }
        );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    if (!taskbarSearch) {
        return;
    }

    taskbarSearch.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) {

                return;

            }

            const query =
                taskbarSearch.value
                    .trim()
                    .toLowerCase();

            if (!query) {
                return;
            }

            let result =
                null;

            Object.entries(
                appData
            ).forEach(
                ([key, app]) => {

                    if (
                        !result &&
                        (
                            key
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||
                            app.name
                                .toLowerCase()
                                .includes(
                                    query
                                )
                        )
                    ) {

                        result =
                            key;

                    }

                }
            );

            if (result) {

                launchApp(
                    result
                );

                taskbarSearch.value =
                    "";

            }

        }
    );

}


/* =========================================================
   WIDGET
========================================================= */

function createWidget(
    widgetKey
) {

    const app =
        appData[widgetKey];

    if (!app) {
        return;
    }

    if (
        widgetWindows.has(
            widgetKey
        )
    ) {

        const existingWidget =
            widgetWindows.get(
                widgetKey
            );

        if (
            existingWidget &&
            document.body.contains(
                existingWidget
            )
        ) {

            existingWidget.style.display =
                existingWidget.style.display ===
                "none"
                    ? "block"
                    : "none";

            bringToFront(
                existingWidget
            );

        }

        return;

    }

    const widget =
        document.createElement(
            "div"
        );

    widget.className =
        "cyber-window";

    widget.dataset.app =
        widgetKey;

    widget.style.position =
        "absolute";

    widget.style.width =
        "500px";

    widget.style.height =
        "390px";

    widget.innerHTML = `

        <div class="window-header">

            <div class="window-title">
                ${escapeHTML(app.name)}
            </div>

            <div class="window-controls">

                <button
                    class="close"
                    type="button"
                >
                    ×
                </button>

            </div>

        </div>

        <div class="window-content">

            <iframe
                src="${escapeAttribute(app.url)}"
                title="${escapeAttribute(app.name)}"
                frameborder="0"
            ></iframe>

        </div>

    `;

    widgetLayer.appendChild(
        widget
    );

    widgetWindows.set(
        widgetKey,
        widget
    );

    const closeButton =
        widget.querySelector(
            ".close"
        );

    closeButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            widgetWindows.delete(
                widgetKey
            );

            widget.remove();

            removeTaskbarButton(
                widgetKey
            );

        }
    );

    widget.addEventListener(
        "pointerdown",
        () => {

            bringToFront(
                widget
            );

        }
    );

    requestAnimationFrame(
        () => {

            const layerWidth =
                widgetLayer.clientWidth;

            const layerHeight =
                widgetLayer.clientHeight;

            const widgetWidth =
                widget.offsetWidth;

            const widgetHeight =
                widget.offsetHeight;

            widget.style.left =
                Math.max(
                    0,
                    (
                        layerWidth -
                        widgetWidth
                    ) / 2
                ) + "px";

            widget.style.top =
                Math.max(
                    0,
                    (
                        layerHeight -
                        widgetHeight
                    ) / 2
                ) + "px";

            bringToFront(
                widget
            );

        }
    );

    addTaskbarButton(
        widgetKey
    );

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    if (
        !clockTime ||
        !clockDate
    ) {

        return;

    }

    const now =
        new Date();

    let hours =
        now.getHours();

    const minutes =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );

    const seconds =
        String(
            now.getSeconds()
        ).padStart(
            2,
            "0"
        );

    const ampm =
        hours >= 12
            ? "PM"
            : "AM";

    hours =
        hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    clockTime.textContent =
        `${hours}:${minutes}:${seconds} ${ampm}`;

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const year =
        now.getFullYear();

    clockDate.textContent =
        `${day}/${month}/${year}`;

}


/* =========================================================
   CHARGING
========================================================= */

function setupCharging() {

    if (!chargeButton) {
        return;
    }

    chargeButton.addEventListener(
        "click",
        toggleCharging
    );

}


function toggleCharging() {

    isCharging =
        !isCharging;

    if (isCharging) {

        chargeButton.textContent =
            "🔌 Unplug";

        if (batteryFill) {

            batteryFill.style.background =
                "#5cff7a";

        }

    } else {

        chargeButton.textContent =
            "🔌 Plug In";

        if (batteryFill) {

            batteryFill.style.background =
                "#fff";

        }

    }

}


/* =========================================================
   BATTERY LOOP
========================================================= */

let previousBatteryTime =
    performance.now();


function batteryLoop(
    currentTime
) {

    const delta =
        Math.min(
            (
                currentTime -
                previousBatteryTime
            ) / 1000,
            0.1
        );

    previousBatteryTime =
        currentTime;

    if (isCharging) {

        batteryLevel +=
            chargeRate *
            delta;

    } else {

        let activeApps =
            0;

        openWindows.forEach(
            windowElement => {

                if (
                    windowElement &&
                    windowElement.style.display !==
                    "none"
                ) {

                    activeApps++;

                }

            }
        );

        const drain =
            baseDrainRate +
            (
                appDrainPenalty *
                activeApps
            );

        batteryLevel -=
            drain *
            delta;

    }

    batteryLevel =
        Math.max(
            0,
            Math.min(
                100,
                batteryLevel
            )
        );

    updateBattery();

    if (
        batteryLevel <= 0 &&
        !isDead
    ) {

        triggerShutdown();

    }

    requestAnimationFrame(
        batteryLoop
    );

}


/* =========================================================
   BATTERY DISPLAY
========================================================= */

function updateBattery() {

    if (
        !batteryFill ||
        !batteryText
    ) {

        return;

    }

    batteryFill.style.width =
        batteryLevel + "%";

    batteryText.textContent =
        Math.round(
            batteryLevel
        ) + "%";

}


/* =========================================================
   SHUTDOWN
========================================================= */

function triggerShutdown() {

    isDead = true;

    openWindows.forEach(
        (
            windowElement,
            appKey
        ) => {

            if (windowElement) {

                const iframe =
                    windowElement.querySelector(
                        "iframe"
                    );

                if (iframe) {

                    iframe.src =
                        "about:blank";

                }

                windowElement.remove();

            }

            removeTaskbarButton(
                appKey
            );

        }
    );

    openWindows.clear();

    widgetWindows.forEach(
        (
            widget,
            key
        ) => {

            widget.remove();

            removeTaskbarButton(
                key
            );

        }
    );

    widgetWindows.clear();

    openFolders.forEach(
        folderWindow => {

            if (folderWindow) {
                folderWindow.remove();
            }

        }
    );

    openFolders.clear();

    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "shutdown-overlay";

    overlay.innerHTML = `

        <div class="shutdown-popup">

            <h2>
                CyberOS Power Saving
            </h2>

            <p>
                Your battery has reached 0%.
                Please plug in CyberOS to continue.
            </p>

            <button
                id="shutdownPlugButton"
                type="button"
            >
                🔌 Plug In
            </button>

        </div>

    `;

    desktopArea.appendChild(
        overlay
    );

    const shutdownButton =
        document.getElementById(
            "shutdownPlugButton"
        );

    if (shutdownButton) {

        shutdownButton.addEventListener(
            "click",
            () => {

                overlay.remove();

                batteryLevel =
                    1;

                isCharging =
                    true;

                isDead =
                    false;

                if (chargeButton) {

                    chargeButton.textContent =
                        "🔌 Unplug";

                }

                updateBattery();

            }
        );

    }

}


/* =========================================================
   ESCAPE HELPERS
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   MOVE LOGOUT INTO START MENU
========================================================= */

function moveLogoutIntoStartMenu() {

    const logout =
        document.getElementById(
            "logoutButton"
        );

    const menu =
        document.getElementById(
            "startMenu"
        );

    if (
        !logout ||
        !menu
    ) {

        console.warn(
            "CyberOS: Logout button or Start Menu not found."
        );

        return;

    }

    const startFooter =
        menu.querySelector(
            ".start-menu-footer"
        );

    if (startFooter) {

        startFooter.appendChild(
            logout
        );

    } else {

        menu.appendChild(
            logout
        );

    }

    logout.type =
        "button";

    logout.style.pointerEvents =
        "auto";

    logout.disabled =
        false;

}


/* =========================================================
   WIDGET DRAGGING
========================================================= */

function enableWidgetDragging() {

    const layer =
        document.getElementById(
            "widgetLayer"
        );

    if (!layer) {
        return;
    }

    const widgets =
        layer.querySelectorAll(
            ".cyber-window"
        );

    widgets.forEach(
        widget => {

            if (
                widget.dataset.widgetDragEnabled ===
                "true"
            ) {

                return;

            }

            widget.dataset.widgetDragEnabled =
                "true";

            let dragging = false;

            let startX = 0;
            let startY = 0;

            let startLeft = 0;
            let startTop = 0;

            widget.addEventListener(
                "pointerdown",
                event => {

                    const rect =
                        widget.getBoundingClientRect();

                    const relativeY =
                        event.clientY -
                        rect.top;

                    if (
                        relativeY > 22
                    ) {

                        return;

                    }

                    if (
                        event.target.closest(
                            "button"
                        ) ||
                        event.target.closest(
                            "input"
                        ) ||
                        event.target.closest(
                            "textarea"
                        ) ||
                        event.target.closest(
                            "select"
                        )
                    ) {

                        return;

                    }

                    dragging = true;

                    startX =
                        event.clientX;

                    startY =
                        event.clientY;

                    startLeft =
                        widget.offsetLeft;

                    startTop =
                        widget.offsetTop;

                    widget.classList.add(
                        "widget-dragging"
                    );

                    try {

                        widget.setPointerCapture(
                            event.pointerId
                        );

                    } catch {}

                    bringToFront(
                        widget
                    );

                    event.preventDefault();
                    event.stopPropagation();

                },
                true
            );

            widget.addEventListener(
                "pointermove",
                event => {

                    if (!dragging) {
                        return;
                    }

                    const deltaX =
                        event.clientX -
                        startX;

                    const deltaY =
                        event.clientY -
                        startY;

                    widget.style.left =
                        (
                            startLeft +
                            deltaX
                        ) + "px";

                    widget.style.top =
                        (
                            startTop +
                            deltaY
                        ) + "px";

                },
                true
            );

            widget.addEventListener(
                "pointerup",
                event => {

                    if (!dragging) {
                        return;
                    }

                    dragging = false;

                    widget.classList.remove(
                        "widget-dragging"
                    );

                    try {

                        widget.releasePointerCapture(
                            event.pointerId
                        );

                    } catch {}

                },
                true
            );

            widget.addEventListener(
                "pointercancel",
                () => {

                    dragging = false;

                    widget.classList.remove(
                        "widget-dragging"
                    );

                },
                true
            );

        }
    );

}

/* =========================================================
   RESPONSIVE DESKTOP ICON POSITIONING
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (!desktopIcons) {
            return;
        }


        /*
           Only folders need their right-side
           startup position recalculated.

           IMPORTANT:
           We do NOT reset manually dragged
           positions during resize.
        */

        desktopIcons
            .querySelectorAll(
                ".desktop-folder-icon"
            )
            .forEach(
                folderIcon => {

                    /*
                       If the user has already moved it,
                       don't reposition it.
                    */

                    if (
                        folderIcon.dataset.userMoved ===
                        "true"
                    ) {

                        return;

                    }


                    const folderKey =
                        folderIcon.dataset.folder;


                    const position =
                        DESKTOP_DEFAULT_POSITIONS[
                            folderKey
                        ];


                    if (
                        !position ||
                        position.side !==
                        "right"
                    ) {

                        return;

                    }


                    positionDesktopItem(
                        folderIcon,
                        folderKey,
                        "folder",
                        Number(
                            folderIcon.dataset.index
                        ) || 0
                    );

                }
            );

    }
);


/* =========================================================
   WIDGET DRAG INITIALIZATION
========================================================= */

enableWidgetDragging();


/* =========================================================
   WATCH FOR NEW WIDGETS
========================================================= */

const widgetObserver =
    new MutationObserver(
        () => {

            enableWidgetDragging();

        }
    );


const widgetLayerForObserver =
    document.getElementById(
        "widgetLayer"
    );


if (widgetLayerForObserver) {

    widgetObserver.observe(
        widgetLayerForObserver,
        {
            childList: true,
            subtree: true
        }
    );

}


function generateVideoThumbnail(videoUrl, seekTo = 1.0) {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");

        video.src = videoUrl;
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";

        video.addEventListener("loadedmetadata", () => {
            // Make sure the requested frame exists
            if (seekTo >= video.duration) {
                video.currentTime = Math.max(0, video.duration - 0.1);
            } else {
                video.currentTime = seekTo;
            }
        });

        video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");

            const maxSize = 128;

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            if (!videoWidth || !videoHeight) {
                reject(new Error("Could not determine video dimensions."));
                return;
            }

            // Preserve the original video's aspect ratio
            const scale = Math.min(
                maxSize / videoWidth,
                maxSize / videoHeight
            );

            const width = Math.round(videoWidth * scale);
            const height = Math.round(videoHeight * scale);

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Could not create canvas context."));
                return;
            }

            ctx.drawImage(
                video,
                0,
                0,
                width,
                height
            );

            resolve(canvas.toDataURL("image/png"));
        });

        video.addEventListener("error", (err) => {
            reject(err);
        });
    });
}

/* =========================================================
   FPS COUNTER
========================================================= */

(function setupFPSCounter() {

    const fpsCounter = document.createElement("div");

    fpsCounter.id = "fpsCounter";

    fpsCounter.style.cssText = `
        position: fixed;
        top: 8px;
        left: 8px;
        z-index: 999999;
        padding: 5px 9px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.65);
        color: #ffffff;
        font-family: monospace;
        font-size: 13px;
        font-weight: bold;
        pointer-events: none;
        user-select: none;
        backdrop-filter: blur(4px);
    `;

    fpsCounter.textContent = "FPS: --";

    document.body.appendChild(fpsCounter);


    let frames = 0;
    let lastTime = performance.now();

    function measureFPS(currentTime) {

        frames++;

        const elapsed = currentTime - lastTime;

        if (elapsed >= 500) {

            const fps =
                Math.round(
                    frames * 1000 / elapsed
                );

            fpsCounter.textContent =
                "FPS: " + fps;

            frames = 0;
            lastTime = currentTime;
        }

        requestAnimationFrame(measureFPS);
    }

    requestAnimationFrame(measureFPS);

})();

