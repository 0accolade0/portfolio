/* =========================================================
   CYBEROS
   COMPLETE MAIN.JS
   FIREBASE AUTHENTICATION
   NO APP STATE SAVING / PERSISTENCE
========================================================= */


/* =========================================================
   APP DATA
========================================================= */

const appData = {

    craft: {
        name: "CraftPuncher",
        url: "./apps/craftpuncher/CraftPuncher.html",
        icon: "./assets/icons/craft.png",
        type: "app"
    },

    polaroid: {
        name: "Polaroid",
        url: "./apps/polaroid/index.html",
        icon: "./assets/icons/polaroid.png",
        type: "app"
    },

    cyberpad: {
        name: "Cyberpad",
        url: "./apps/cyberpad/Dearmail.html",
        icon: "./assets/icons/cyberpad.png",
        type: "widget"
    },

    folder: {
        name: "Folder",
        url: "./apps/folder/index.html",
        icon: "./assets/icons/folder.png",
        type: "app"
    },

    makeup: {
        name: "Makeup",
        url: "./apps/makeup/index.html",
        icon: "./apps/makeup/assets/L1.png",
        type: "app"
    },

    cookie: {
        name: "Cookie",
        url: "./apps/cookie/index.html",
        icon: "./apps/cookie/assets/Packaging1.png",
        type: "app"
    }

};


/* =========================================================
   CONFIG
========================================================= */

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 450;

const MAX_OPEN_TABS = 3;

const NORMAL_APP_Z_INDEX = 100;
const WIDGET_Z_INDEX = 200;
const TASKBAR_Z_INDEX = 5000;
const START_MENU_Z_INDEX = 6000;
const MAXIMIZED_Z_INDEX = 2147483647;


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
    document.getElementById(
        "loginCloseButton"
    );

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const stayLoggedIn =
    document.getElementById("stayLoggedIn");

const loginSubmitButton =
    document.getElementById(
        "loginSubmitButton"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );

const loggedInArea =
    document.getElementById(
        "loggedInArea"
    );

const authUser =
    document.getElementById(
        "authUser"
    );

const authRole =
    document.getElementById(
        "authRole"
    );


/* =========================================================
   STATE
========================================================= */

const openWindows =
    new Map();

const widgetWindows =
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

    console.log(
        "================================"
    );

    console.log(
        "CYBEROS BOOT"
    );

    console.log(
        "================================"
    );


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


    console.log(
        "CYBEROS READY"
    );

}


/* =========================================================
   CYBEROS APP API
   AUTH ONLY
========================================================= */

window.CyberOSApp = {

    /* =====================================================
       GET CURRENT USER
    ===================================================== */

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


    /* =====================================================
       GET CURRENT UID
    ===================================================== */

    getUserId() {

        const user =
            this.getUser();


        return user
            ? user.uid
            : null;

    },


    /* =====================================================
       GET CURRENT ROLE
    ===================================================== */

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


    /* =====================================================
       IS ADMIN
    ===================================================== */

    isAdmin() {

        return (
            this.getRole() ===
            "admin"
        );

    },


    /* =====================================================
       IS MEMBER
    ===================================================== */

    isMember() {

        return (
            this.getRole() ===
            "member"
        );

    }

};

/* =====================================================
   LOGOUT BUTTON
   EVENT DELEGATION
===================================================== */

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


        /*
           Prevent multiple clicks while
           logout is processing.
        */

        if (button.dataset.loggingOut === "true") {
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

            }
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


                setLoginLoading(
                    true
                );


                showLoginMessage(
                    "Signing in...",
                    false
                );


                const result =
                    await window.CyberOSFirebase.login(
                        email,
                        password,
                        stayLoggedIn
                            ? stayLoggedIn.checked
                            : false
                    );


                setLoginLoading(
                    false
                );


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


                loginPassword.value =
                    "";


                setTimeout(
                    () => {

                        closeLogin();

                    },
                    500
                );

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


    /*
       Start with the login screen visible.
    */

    if (loginOverlay) {

        loginOverlay.style.display =
            "flex";

    }

}


/* =========================================================
   OPEN LOGIN
========================================================= */

function openLogin() {

    if (!loginOverlay) {
        return;
    }


    loginOverlay.style.display =
        "flex";


    if (loginMessage) {

        loginMessage.textContent =
            "";

    }

}


/* =========================================================
   CLOSE LOGIN
========================================================= */

function closeLogin() {

    if (!loginOverlay) {
        return;
    }


    loginOverlay.style.display =
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


/* =========================================================
   LOGIN MESSAGE
========================================================= */

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


/* =========================================================
   LOGIN LOADING
========================================================= */

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


/* =========================================================
   FIREBASE ERROR TRANSLATION
========================================================= */

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
   AUTH STATE HANDLER
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


/* =========================================================
   UPDATE AUTH UI
========================================================= */

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

            authUser.textContent =
                "";

        }


        if (authRole) {

            authRole.textContent =
                "";

        }

    }

}


/* =========================================================
   LOGOUT
========================================================= */

/* =========================================================
   LOGOUT
========================================================= */

async function logoutCyberOS() {

    console.log(
        "CYBEROS: LOGOUT BUTTON CLICKED"
    );


    if (
        !window.CyberOSFirebase
    ) {

        console.error(
            "CyberOSFirebase does not exist."
        );

        return;

    }


    if (
        !window.CyberOSFirebase.auth
    ) {

        console.error(
            "CyberOS Firebase auth does not exist."
        );

        return;

    }


    try {

        console.log(
            "CYBEROS: Signing out from Firebase..."
        );


        await window.CyberOSFirebase.signOut(
            window.CyberOSFirebase.auth
        );


        console.log(
            "CYBEROS: Firebase sign-out successful."
        );


        /*
           Close Start Menu.
        */

        closeStartMenu();


        /*
           Close all normal applications.
        */

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


        /*
           Close widgets.
        */

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


        /*
           Show login screen.
        */

        openLogin();


        /*
           Update status.
        */

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


    startMenuOpen =
        true;


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


    startMenuOpen =
        false;


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


    startMenuApps.innerHTML =
        "";


    Object.entries(
        appData
    ).forEach(
        ([appKey, app]) => {

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
   DESKTOP ICONS
========================================================= */

function populateDesktopIcons() {

    if (!desktopIcons) {
        return;
    }


    desktopIcons.innerHTML =
        "";


    Object.entries(
        appData
    ).forEach(
        ([appKey, app]) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "desktop-icon";


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
                    "desktop-icon-image";


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
                            createDesktopPlaceholder(
                                app
                            )
                        );

                    };


                button.appendChild(
                    image
                );

            } else {

                button.appendChild(
                    createDesktopPlaceholder(
                        app
                    )
                );

            }


            const label =
                document.createElement(
                    "div"
                );


            label.className =
                "desktop-icon-label";


            label.textContent =
                app.name;


            button.appendChild(
                label
            );


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    launchApp(
                        appKey
                    );

                }
            );


            desktopIcons.appendChild(
                button
            );

        }
    );

}


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


    return placeholder;

}


/* =========================================================
   LAUNCH APP
========================================================= */

function launchApp(
    appKey
) {

    const app =
        appData[appKey];


    if (!app) {
        return;
    }


    if (
        app.type === "widget"
    ) {

        createWidget(
            appKey
        );

        return;

    }


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


            bringToFront(
                existing
            );


            return;

        }


        openWindows.delete(
            appKey
        );

    }


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


    createAppWindow(
        appKey
    );

}


/* =========================================================
   CREATE APP WINDOW
========================================================= */

function createAppWindow(
    appKey
) {

    const app =
        appData[appKey];


    if (
        !app ||
        !appLayer
    ) {

        return;

    }


    /* =====================================================
       WINDOW
    ===================================================== */

    const windowElement =
        document.createElement(
            "div"
        );


    windowElement.className =
        "cyber-window";


    windowElement.dataset.app =
        appKey;


    /* =====================================================
       WINDOW HTML
    ===================================================== */

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

            <iframe
                src="${escapeAttribute(app.url)}"
                title="${escapeAttribute(app.name)}"
                frameborder="0"
                allow="fullscreen"
            ></iframe>

        </div>

    `;


    appLayer.appendChild(
        windowElement
    );


    openWindows.set(
        appKey,
        windowElement
    );


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const header =
        windowElement.querySelector(
            ".window-header"
        );


    const iframe =
        windowElement.querySelector(
            "iframe"
        );


    const maximizeButton =
        windowElement.querySelector(
            ".maximize"
        );


    const closeButton =
        windowElement.querySelector(
            ".close"
        );


    /* =====================================================
       DEFAULT SIZE
    ===================================================== */

    windowElement.style.width =
        DEFAULT_WIDTH + "px";


    windowElement.style.height =
        DEFAULT_HEIGHT + "px";


    windowElement.style.position =
        "absolute";


    requestAnimationFrame(
        () => {

            centerWindow(
                windowElement
            );

        }
    );


    /* =====================================================
       IFRAME LOAD
    ===================================================== */

    iframe.addEventListener(
        "load",
        () => {

            /*
               Tell the iframe which
               CyberOS application it belongs to.

               No state loading or saving.
            */

            try {

                iframe.contentWindow.CyberOSAppKey =
                    appKey;


                /*
                   Keep access to the auth API.
                */

                iframe.contentWindow.CyberOSApp =
                    window.CyberOSApp;

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

        }
    );


    /* =====================================================
       WINDOW FOCUS
    ===================================================== */

    windowElement.addEventListener(
        "pointerdown",
        () => {

            bringToFront(
                windowElement
            );

        }
    );


    /* =====================================================
       MAXIMIZE
    ===================================================== */

    maximizeButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();


            if (
                windowElement.classList.contains(
                    "maximized"
                )
            ) {

                restoreWindow(
                    windowElement
                );

            } else {

                maximizeWindow(
                    windowElement
                );

            }

        }
    );


    /* =====================================================
       CLOSE
    ===================================================== */

    closeButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();


            closeWindow(
                appKey,
                windowElement
            );

        }
    );


    /* =====================================================
       DRAG
    ===================================================== */

    setupWindowDragging(
        windowElement,
        header
    );


    /* =====================================================
       TASKBAR
    ===================================================== */

    addTaskbarButton(
        appKey
    );


    /* =====================================================
       FRONT
    ===================================================== */

    bringToFront(
        windowElement
    );

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

    } else {

        highestZIndex =
            Math.max(
                highestZIndex + 1,
                NORMAL_APP_Z_INDEX + 1
            );


        windowElement.style.zIndex =
            highestZIndex;

    }


    updateTaskbarState(
        windowElement.dataset.app
    );

}


/* =========================================================
   DRAGGING
========================================================= */

function setupWindowDragging(
    windowElement,
    header
) {

    if (!header) {
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


            dragging =
                true;


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

            } catch {

            }


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

            dragging =
                false;


            try {

                header.releasePointerCapture(
                    event.pointerId
                );

            } catch {

            }

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


/* =========================================================
   REMOVE TASKBAR
========================================================= */

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


/* =========================================================
   TASKBAR STATE
========================================================= */

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
                            key.toLowerCase()
                                .includes(
                                    query
                                ) ||
                            app.name.toLowerCase()
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

/* =========================================================
   WIDGET
   CENTRED + INVISIBLE DRAG HANDLE
========================================================= */

function createWidget(widgetKey) {

    const app =
        appData[widgetKey];


    if (!app) {
        return;
    }


    /* =====================================================
       ALREADY OPEN
    ===================================================== */

    if (
        widgetWindows.has(widgetKey)
    ) {

        const existingWidget =
            widgetWindows.get(widgetKey);


        if (
            existingWidget &&
            document.body.contains(existingWidget)
        ) {

            existingWidget.style.display =
                existingWidget.style.display === "none"
                    ? "block"
                    : "none";


            bringToFront(
                existingWidget
            );

        }


        return;

    }


    /* =====================================================
       CREATE WIDGET
    ===================================================== */

    const widget =
        document.createElement("div");


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


    /* =====================================================
       WIDGET HTML
    ===================================================== */

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


    /* =====================================================
       ADD TO WIDGET LAYER
    ===================================================== */

    widgetLayer.appendChild(
        widget
    );


    widgetWindows.set(
        widgetKey,
        widget
    );


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    const closeButton =
        widget.querySelector(".close");


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


    /* =====================================================
       FOCUS
    ===================================================== */

    widget.addEventListener(
        "pointerdown",
        () => {

            bringToFront(
                widget
            );

        }
    );


    /* =====================================================
       CENTRE WIDGET
       -----------------------------------------------
       IMPORTANT:
       Use widgetLayer, NOT appLayer.
    ===================================================== */

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


            const left =
                (layerWidth - widgetWidth) / 2;


            const top =
                (layerHeight - widgetHeight) / 2;


            widget.style.left =
                Math.max(
                    0,
                    left
                ) + "px";


            widget.style.top =
                Math.max(
                    0,
                    top
                ) + "px";


            bringToFront(
                widget
            );

        }
    );


    /* =====================================================
       TASKBAR
    ===================================================== */

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


    if (
        hours === 0
    ) {

        hours =
            12;

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

    isDead =
        true;


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

/* =========================================================
   MOVE LOGOUT INTO START MENU
========================================================= */

function moveLogoutIntoStartMenu() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    const startMenu =
        document.getElementById(
            "startMenu"
        );


    if (
        !logoutButton ||
        !startMenu
    ) {

        console.warn(
            "CyberOS: Logout button or Start Menu not found."
        );

        return;

    }


    const startFooter =
        startMenu.querySelector(
            ".start-menu-footer"
        );


    if (startFooter) {

        startFooter.appendChild(
            logoutButton
        );

    } else {

        startMenu.appendChild(
            logoutButton
        );

    }


    /*
       Make absolutely sure it behaves
       like a button and is clickable.
    */

    logoutButton.type =
        "button";


    logoutButton.style.pointerEvents =
        "auto";


    logoutButton.disabled =
        false;


    console.log(
        "CyberOS: Logout button moved into Start Menu."
    );

}


/* =========================================================
   INITIALIZE LOGOUT LOCATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        moveLogoutIntoStartMenu();

    }
);

/* =========================================================
   CYBEROS — INVISIBLE WIDGET DRAGGING
   ---------------------------------------------------------
   Widgets have no visible header.
   Dragging happens through an invisible strip at the top.
========================================================= */

/* =========================================================
   CYBEROS — WIDGET DRAGGING
   ---------------------------------------------------------
   Invisible top strip
   Freely draggable over the desktop
========================================================= */

function enableWidgetDragging() {

    const widgetLayer =
        document.getElementById("widgetLayer");

    if (!widgetLayer) {
        return;
    }


    const widgets =
        widgetLayer.querySelectorAll(
            ".cyber-window"
        );


    widgets.forEach(widget => {

        if (
            widget.dataset.widgetDragEnabled === "true"
        ) {
            return;
        }


        widget.dataset.widgetDragEnabled =
            "true";


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


        /* =================================================
           DRAG START
        ================================================= */

        widget.addEventListener(
            "pointerdown",
            event => {

                const rect =
                    widget.getBoundingClientRect();


                const relativeY =
                    event.clientY -
                    rect.top;


                /*
                   Only the invisible top 22px
                   acts as the drag area.
                */

                if (
                    relativeY > 22
                ) {
                    return;
                }


                /*
                   Don't drag through buttons.
                */

                if (
                    event.target.closest("button") ||
                    event.target.closest("input") ||
                    event.target.closest("textarea") ||
                    event.target.closest("select")
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

                } catch {

                }


                bringToFront(
                    widget
                );


                event.preventDefault();
                event.stopPropagation();

            },
            true
        );


        /* =================================================
           DRAG MOVE
        ================================================= */

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


                /*
                   NO BOUNDARY CLAMPING.

                   The widget can move freely
                   across the desktop.
                */

                const newLeft =
                    startLeft +
                    deltaX;


                const newTop =
                    startTop +
                    deltaY;


                widget.style.left =
                    newLeft + "px";


                widget.style.top =
                    newTop + "px";

            },
            true
        );


        /* =================================================
           DRAG END
        ================================================= */

        widget.addEventListener(
            "pointerup",
            event => {

                if (!dragging) {
                    return;
                }


                dragging =
                    false;


                widget.classList.remove(
                    "widget-dragging"
                );


                try {

                    widget.releasePointerCapture(
                        event.pointerId
                    );

                } catch {

                }

            },
            true
        );


        widget.addEventListener(
            "pointercancel",
            () => {

                dragging =
                    false;


                widget.classList.remove(
                    "widget-dragging"
                );

            },
            true
        );

    });

}


/* =========================================================
   INITIALIZE
========================================================= */

enableWidgetDragging();


/* =========================================================
   WATCH FOR NEW WIDGETS
   ---------------------------------------------------------
   If widgets are dynamically created later, automatically
   enable dragging on them.
========================================================= */

const widgetObserver = new MutationObserver(() => {
    enableWidgetDragging();
});


const widgetLayerForObserver =
    document.getElementById("widgetLayer");


if (widgetLayerForObserver) {

    widgetObserver.observe(widgetLayerForObserver, {
        childList: true,
        subtree: true
    });

}