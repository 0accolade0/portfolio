/* =========================================================
   SCENE EXPORTER
   ---------------------------------------------------------
   PURPOSE
   ---------------------------------------------------------

   This script is completely separate from SceneSystem.

   It takes the CURRENT live scene and creates a new
   complete scene.js file with the latest SCENE_CONFIG.

   It does NOT modify SceneSystem.

   FLOW:

       Scene Editor
            ↓
       window.scene
            ↓
       getCleanConfig()
            ↓
       remove runtime/uploaded image data
            ↓
       read original scene.js
            ↓
       replace SCENE_CONFIG
            ↓
       copy COMPLETE file

   IMPORTANT
   ---------------------------------------------------------

   The actual scene file is:

       scene.js

   NOT:

       scene-system.js

   IMAGE ARCHITECTURE
   ---------------------------------------------------------

   Static scene images remain in SCENE_CONFIG:

       image: "assets/house2.png"

   Uploaded / wall pictures do NOT belong in SCENE_CONFIG.

   They are handled by:

       house-interaction.js

   This exporter therefore removes:

       - wallPicture image data
       - uploadedPicture image data
       - data:image/... URLs
       - blob: URLs

   This prevents Base64 / runtime image data from bloating
   the exported scene.js file.
========================================================= */


class SceneExporter {

    constructor() {

        console.log(
            "📦 SceneExporter initialized"
        );
    }


    /* =====================================================
       EXPORT WHOLE FILE
    ===================================================== */

    async exportWholeFile() {

        console.log(
            "================================"
        );

        console.log(
            "📦 EXPORTING COMPLETE scene.js"
        );

        console.log(
            "================================"
        );


        /* -------------------------------------------------
           Make sure SceneSystem exists
        ------------------------------------------------- */

        if (
            !window.scene ||
            typeof window.scene.getCleanConfig !==
                "function"
        ) {

            console.error(
                "❌ window.scene is not available."
            );

            this.showMessage(
                "Scene is not available."
            );

            return null;
        }


        /* -------------------------------------------------
           Get latest live scene configuration
        ------------------------------------------------- */

        let config =
            window.scene.getCleanConfig();


        if (!config) {

            console.error(
                "❌ Could not get scene config."
            );

            this.showMessage(
                "Could not get scene config."
            );

            return null;
        }


        console.log(
            "✅ Current scene config obtained."
        );


        console.log(
            "Objects:",
            config.objects
                ? config.objects.length
                : 0
        );


        /* -------------------------------------------------
           REMOVE RUNTIME / UPLOADED IMAGE DATA
        -------------------------------------------------

        IMPORTANT:

        This creates a completely separate copy.

        The LIVE scene is NOT modified.

        Static image paths remain.

        Example:

            image: "assets/house2.png"

        stays.

        But:

            image: "data:image/png;base64,..."

        is removed.

        Likewise:

            wallPicture: true
            uploadedPicture: true
            image: "..."

        will not export the image value.

        ------------------------------------------------- */

        config =
            this.cleanConfigForExport(
                config
            );


        console.log(
            "🧹 Runtime image data removed from export."
        );


        /* -------------------------------------------------
           Find scene.js
        ------------------------------------------------- */

        const sceneScript =
            this.findSceneScript();


        if (!sceneScript) {

            console.error(
                "❌ Could not find scene.js."
            );

            this.showMessage(
                "Could not find scene.js."
            );

            return null;
        }


        console.log(
            "📄 Found scene.js:",
            sceneScript.src
        );


        /* -------------------------------------------------
           Read original scene.js
        ------------------------------------------------- */

        let source;


        try {

            const response =
                await fetch(
                    sceneScript.src,
                    {
                        cache:
                            "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );
            }


            source =
                await response.text();

        } catch (error) {

            console.error(
                "❌ Could not read scene.js:",
                error
            );


            this.showMessage(
                "Could not read scene.js."
            );


            return null;
        }


        if (!source) {

            console.error(
                "❌ scene.js is empty."
            );

            this.showMessage(
                "scene.js is empty."
            );

            return null;
        }


        console.log(
            "✅ Original scene.js loaded."
        );


        /* -------------------------------------------------
           Generate new SCENE_CONFIG
        ------------------------------------------------- */

        const configText =
            "const SCENE_CONFIG = " +
            JSON.stringify(
                config,
                null,
                4
            ) +
            ";";


        /* -------------------------------------------------
           Replace SCENE_CONFIG
        ------------------------------------------------- */

        const updatedSource =
            this.replaceSceneConfig(
                source,
                configText
            );


        if (!updatedSource) {

            console.error(
                "❌ Could not replace SCENE_CONFIG."
            );


            this.showMessage(
                "Could not update SCENE_CONFIG."
            );


            return null;
        }


        /* -------------------------------------------------
           Copy complete scene.js
        ------------------------------------------------- */

        const copied =
            await this.copyText(
                updatedSource
            );


        if (!copied) {

            console.error(
                "❌ Complete scene.js could not be copied."
            );


            this.showMessage(
                "Copy failed."
            );


            return null;
        }


        console.log(
            "================================"
        );

        console.log(
            "✅ COMPLETE scene.js COPIED"
        );

        console.log(
            "================================"
        );


        console.log(
            "Objects:",
            config.objects.length
        );


        console.log(
            "Characters:",
            updatedSource.length
        );


        this.showMessage(
            "Complete scene.js copied!"
        );


        return updatedSource;
    }


    /* =====================================================
       CLEAN CONFIG FOR EXPORT
       -----------------------------------------------------

       Removes uploaded/runtime image sources while
       preserving normal static image paths.

       Examples:

       KEEP:

           image: "assets/house2.png"

       REMOVE:

           image: "data:image/png;base64,..."

       REMOVE:

           image: "blob:http://..."

       REMOVE:

           wallPicture image data

       REMOVE:

           uploadedPicture image data
    ===================================================== */

    cleanConfigForExport(
        config
    ) {

        if (
            !config ||
            typeof config !== "object"
        ) {

            return config;
        }


        /* -------------------------------------------------
           Deep clone

           This guarantees that the live scene config is
           never modified during export.
        ------------------------------------------------- */

        let cleanConfig;


        try {

            cleanConfig =
                JSON.parse(
                    JSON.stringify(
                        config
                    )
                );

        } catch (error) {

            console.error(
                "❌ Could not clone scene config:",
                error
            );

            return config;
        }


        /* -------------------------------------------------
           Clean objects
        ------------------------------------------------- */

        if (
            Array.isArray(
                cleanConfig.objects
            )
        ) {

            cleanConfig.objects =
                cleanConfig.objects.map(
                    object => {

                        if (
                            !object ||
                            typeof object !==
                                "object"
                        ) {

                            return object;
                        }


                        /*
                            Uploaded / wall pictures are
                            owned by house-interaction.js.

                            Their actual image source must
                            never be exported into scene.js.
                        */

                        const isUploadedPicture =
                            object.wallPicture === true ||
                            object.uploadedPicture === true;


                        if (
                            isUploadedPicture
                        ) {

                            delete object.image;

                        }


                        /*
                            Extra safety:

                            Even if an uploaded image somehow
                            does not have the metadata flags,
                            don't export Base64 or blob URLs.
                        */

                        if (
                            typeof object.image ===
                                "string"
                        ) {

                            if (
                                this.isRuntimeImageSource(
                                    object.image
                                )
                            ) {

                                delete object.image;

                            }

                        }


                        return object;
                    }
                );
        }


        return cleanConfig;
    }


    /* =====================================================
       DETECT RUNTIME IMAGE SOURCE
       -----------------------------------------------------

       Detects image sources that should NEVER be written
       into scene.js.

       Handles:

           data:image/...
           blob:...
           data:...
    ===================================================== */

    isRuntimeImageSource(
        image
    ) {

        if (
            typeof image !==
            "string"
        ) {

            return false;
        }


        const value =
            image.trim().toLowerCase();


        return (
            value.startsWith(
                "data:image/"
            ) ||

            value.startsWith(
                "blob:"
            )
        );
    }


    /* =====================================================
       FIND SCENE.JS
    ===================================================== */

    findSceneScript() {

        const scripts =
            [
                ...document.querySelectorAll(
                    "script[src]"
                )
            ];


        return scripts.find(
            script => {

                const src =
                    script.src || "";


                if (!src) {

                    return false;
                }


                /*
                    Use the actual URL path so things like:

                        scene.js?v=123

                    still work.
                */

                try {

                    const url =
                        new URL(
                            src,
                            window.location.href
                        );


                    return (
                        url.pathname.endsWith(
                            "/scene.js"
                        ) ||

                        url.pathname ===
                            "/scene.js"
                    );

                } catch (error) {

                    /*
                        Fallback for unusual environments.
                    */

                    return (
                        src.endsWith(
                            "scene.js"
                        ) ||

                        src.includes(
                            "scene.js?"
                        )
                    );
                }
            }
        );
    }


    /* =====================================================
       REPLACE SCENE_CONFIG
    ===================================================== */

    replaceSceneConfig(
        source,
        configText
    ) {

        if (
            typeof source !==
            "string"
        ) {

            console.error(
                "❌ Invalid scene.js source."
            );

            return null;
        }


        const configStart =
            source.indexOf(
                "const SCENE_CONFIG"
            );


        if (
            configStart === -1
        ) {

            console.error(
                "❌ SCENE_CONFIG declaration not found."
            );

            return null;
        }


        /*
            Find the opening {

            belonging to SCENE_CONFIG.
        */

        const objectStart =
            source.indexOf(
                "{",
                configStart
            );


        if (
            objectStart === -1
        ) {

            console.error(
                "❌ SCENE_CONFIG opening { not found."
            );

            return null;
        }


        let depth =
            0;


        let objectEnd =
            -1;


        let insideString =
            false;


        let stringCharacter =
            "";


        let escaped =
            false;


        /*
            Walk through the source and find the
            matching closing }.

            This handles nested objects such as:

                objects: [
                    {
                        clickAction: {
                            type: "toggle"
                        }
                    }
                ]
        */

        for (
            let i = objectStart;
            i < source.length;
            i++
        ) {

            const character =
                source[i];


            /* ---------------------------------------------
               Inside string
            --------------------------------------------- */

            if (
                insideString
            ) {

                if (
                    escaped
                ) {

                    escaped =
                        false;

                    continue;
                }


                if (
                    character === "\\"
                ) {

                    escaped =
                        true;

                    continue;
                }


                if (
                    character ===
                    stringCharacter
                ) {

                    insideString =
                        false;

                    stringCharacter =
                        "";
                }


                continue;
            }


            /* ---------------------------------------------
               Start string
            --------------------------------------------- */

            if (
                character === '"' ||
                character === "'" ||
                character === "`"
            ) {

                insideString =
                    true;

                stringCharacter =
                    character;

                continue;
            }


            /* ---------------------------------------------
               Opening brace
            --------------------------------------------- */

            if (
                character === "{"
            ) {

                depth++;

                continue;
            }


            /* ---------------------------------------------
               Closing brace
            --------------------------------------------- */

            if (
                character === "}"
            ) {

                depth--;


                if (
                    depth === 0
                ) {

                    objectEnd =
                        i;

                    break;
                }
            }
        }


        if (
            objectEnd === -1
        ) {

            console.error(
                "❌ SCENE_CONFIG closing } not found."
            );

            return null;
        }


        /* -------------------------------------------------
           Find semicolon after SCENE_CONFIG
        ------------------------------------------------- */

        let configEnd =
            objectEnd + 1;


        while (
            configEnd <
                source.length &&

            /\s/.test(
                source[configEnd]
            )
        ) {

            configEnd++;
        }


        if (
            source[configEnd] === ";"
        ) {

            configEnd++;
        }


        /* -------------------------------------------------
           Create complete updated scene.js
        ------------------------------------------------- */

        const updatedSource =
            source.slice(
                0,
                configStart
            ) +

            configText +

            source.slice(
                configEnd
            );


        return updatedSource;
    }


    /* =====================================================
       COPY
    ===================================================== */

    async copyText(
        text
    ) {

        if (
            !text
        ) {

            return false;
        }


        /* -------------------------------------------------
           Modern clipboard
        ------------------------------------------------- */

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            try {

                await navigator.clipboard.writeText(
                    text
                );


                console.log(
                    "📋 Clipboard API copy successful."
                );


                return true;

            } catch (error) {

                console.warn(
                    "⚠️ Clipboard API failed.",
                    error
                );
            }
        }


        /* -------------------------------------------------
           Fallback
        ------------------------------------------------- */

        return this.fallbackCopy(
            text
        );
    }


    /* =====================================================
       FALLBACK COPY
    ===================================================== */

    fallbackCopy(
        text
    ) {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.setAttribute(
            "readonly",
            ""
        );


        textarea.style.position =
            "fixed";


        textarea.style.left =
            "-9999px";


        textarea.style.top =
            "0";


        textarea.style.opacity =
            "0";


        textarea.style.pointerEvents =
            "none";


        document.body.appendChild(
            textarea
        );


        textarea.focus();


        textarea.select();


        textarea.setSelectionRange(
            0,
            textarea.value.length
        );


        let success =
            false;


        try {

            success =
                document.execCommand(
                    "copy"
                );


            if (
                success
            ) {

                console.log(
                    "📋 Fallback copy successful."
                );

            } else {

                console.warn(
                    "⚠️ Fallback copy returned false."
                );
            }

        } catch (error) {

            console.error(
                "❌ Copy failed:",
                error
            );
        }


        textarea.remove();


        return success;
    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    showMessage(
        message
    ) {

        const old =
            document.getElementById(
                "scene-export-message"
            );


        if (
            old
        ) {

            old.remove();
        }


        const element =
            document.createElement(
                "div"
            );


        element.id =
            "scene-export-message";


        element.textContent =
            "✓ " + message;


        element.style.position =
            "fixed";


        element.style.top =
            "20px";


        element.style.left =
            "50%";


        element.style.transform =
            "translateX(-50%)";


        element.style.zIndex =
            "999999";


        element.style.padding =
            "12px 20px";


        element.style.borderRadius =
            "10px";


        element.style.background =
            "#222";


        element.style.color =
            "#fff";


        element.style.fontFamily =
            "Arial, sans-serif";


        element.style.fontSize =
            "14px";


        element.style.fontWeight =
            "600";


        element.style.boxShadow =
            "0 5px 25px rgba(0,0,0,0.25)";


        element.style.pointerEvents =
            "none";


        document.body.appendChild(
            element
        );


        setTimeout(
            () => {

                if (
                    element.parentNode
                ) {

                    element.remove();
                }

            },
            2500
        );
    }
}


/* =========================================================
   GLOBAL EXPORTER
========================================================= */

window.sceneExporter =
    new SceneExporter();


/* =========================================================
   GLOBAL COPY FUNCTION

   You can call:

       sceneExporter.exportWholeFile()

   OR:

       copyWholeSceneFile()

   OR:

       scene.copyConfig()

   when scene.js is using the exporter.
========================================================= */

window.copyWholeSceneFile =
    function () {

        if (
            !window.sceneExporter
        ) {

            console.error(
                "❌ SceneExporter is not available."
            );

            return null;
        }


        return window.sceneExporter
            .exportWholeFile();
    };