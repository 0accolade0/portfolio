/* =========================================================
   CYBEROS FIREBASE
   AUTHENTICATION + ROLE + APP STATE SYSTEM
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyDo9tFJwT-mFvGVPd-nKs5pla5ViJVX2e4",

    authDomain:
        "cyberos-2d089.firebaseapp.com",

    databaseURL:
        "https://cyberos-2d089-default-rtdb.firebaseio.com",

    projectId:
        "cyberos-2d089",

    storageBucket:
        "cyberos-2d089.firebasestorage.app",

    messagingSenderId:
        "115043275981",

    appId:
        "1:115043275981:web:388cc64401beb3e7f24584"

};


/* =========================================================
   INITIALIZE
========================================================= */

const firebaseApp =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(
        firebaseApp
    );


const db =
    getFirestore(
        firebaseApp
    );


/* =========================================================
   GLOBAL CYBEROS FIREBASE OBJECT
========================================================= */

window.CyberOSFirebase = {

    app:
        firebaseApp,

    auth:
        auth,

    db:
        db,

    user:
        null,

    role:
        null,

    ready:
        false,

    login:
        null,

    signIn:
        signInWithEmailAndPassword,

    signOut:
        signOut,

    isAdmin:
        function () {

            return (
                window.CyberOSFirebase.role ===
                "admin"
            );

        },

    isMember:
        function () {

            return (
                window.CyberOSFirebase.role ===
                "member"
            );

        }

};


/* =========================================================
   LOGIN
========================================================= */

async function loginUser(
    email,
    password
) {

    try {

        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        console.log(
            "CyberOS login successful:",
            result.user.email
        );


        return {

            success:
                true,

            user:
                result.user

        };

    } catch (error) {

        console.error(
            "CyberOS login error:",
            error
        );


        return {

            success:
                false,

            error:
                error

        };

    }

}


/* =========================================================
   LOAD USER ROLE
========================================================= */

async function loadUserRole(
    user
) {

    if (!user) {

        return null;

    }


    try {

        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        const userSnapshot =
            await getDoc(
                userRef
            );


        if (!userSnapshot.exists()) {

            console.error(
                "No CyberOS user profile exists for:",
                user.uid
            );

            return null;

        }


        const data =
            userSnapshot.data();


        const role =
            data.role;


        if (
            role !== "admin" &&
            role !== "member"
        ) {

            console.error(
                "Invalid CyberOS role:",
                role
            );

            return null;

        }


        return role;

    } catch (error) {

        console.error(
            "Could not load CyberOS user role:",
            error
        );

        return null;

    }

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        /*
           LOGGED OUT
        */

        if (!user) {

            window.CyberOSFirebase.user =
                null;

            window.CyberOSFirebase.role =
                null;

            window.CyberOSFirebase.ready =
                true;


            window.dispatchEvent(
                new CustomEvent(
                    "cyberos-auth",
                    {

                        detail: {

                            authenticated:
                                false,

                            role:
                                null,

                            user:
                                null

                        }

                    }
                )
            );


            return;

        }


        /*
           USER LOGGED IN
        */

        const role =
            await loadUserRole(
                user
            );


        /*
           NO VALID ROLE
        */

        if (!role) {

            console.error(
                "CyberOS user has no valid role."
            );


            await signOut(
                auth
            );


            window.CyberOSFirebase.user =
                null;

            window.CyberOSFirebase.role =
                null;

            window.CyberOSFirebase.ready =
                true;


            window.dispatchEvent(
                new CustomEvent(
                    "cyberos-auth",
                    {

                        detail: {

                            authenticated:
                                false,

                            role:
                                null,

                            user:
                                null,

                            error:
                                "NO_ROLE"

                        }

                    }
                )
            );


            return;

        }


        /*
           SAVE USER
        */

        window.CyberOSFirebase.user =
            user;


        window.CyberOSFirebase.role =
            role;


        window.CyberOSFirebase.ready =
            true;


        console.log(
            "================================"
        );

        console.log(
            "CYBEROS AUTHENTICATED"
        );

        console.log(
            "EMAIL:",
            user.email
        );

        console.log(
            "UID:",
            user.uid
        );

        console.log(
            "ROLE:",
            role
        );

        console.log(
            "================================"
        );


        window.dispatchEvent(
            new CustomEvent(
                "cyberos-auth",
                {

                    detail: {

                        authenticated:
                            true,

                        role:
                            role,

                        user:
                            user

                    }

                }
            )
        );

    }
);


/* =========================================================
   PUBLIC LOGIN API
========================================================= */

window.CyberOSFirebase.login =
    loginUser;


/* =========================================================
   CYBEROS FIREBASE INITIALIZED
========================================================= */

console.log(
    "CyberOS Firebase initialized."
);