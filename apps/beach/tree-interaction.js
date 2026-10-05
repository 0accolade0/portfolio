
/* =========================================================
   TREE INTERACTION
   ---------------------------------------------------------
   tree1_1 → tree1.gif

   BEHAVIOUR:

       - GIF is paused initially
       - First frame is shown
       - Click tree → GIF plays once
       - After playback → returns to first frame
       - Clicking again → plays again

   IMPORTANT:
       GIFs cannot be directly paused/resumed by JavaScript.
       This system uses a static first-frame copy while
       the tree is idle, then temporarily shows the GIF
       when clicked.

   Separate from:
       scene.js
       house-interaction.js
========================================================= */


/* =========================================================
   TREE GIF CONFIG
========================================================= */

class TreeInteraction {

    constructor() {

        console.log(
            "🌳 TREE INTERACTION INITIALIZING"
        );


        /*
            IMPORTANT:

            Your SCENE_CONFIG currently contains:

                id: tree1_1
                image: assets/tree1.gif

            So this is the object we control.
        */

        this.treeId =
            "tree1_1";


        this.gifPath =
            "assets/tree1.gif";


        this.playing =
            false;


        this.playTimer =
            null;


        this.gifDuration =
            1500;


        /*
            If tree1.gif is longer/shorter,
            change gifDuration above.

            Example:

                1000 = 1 second
                1500 = 1.5 seconds
                2000 = 2 seconds
        */


        this.bindTree();


        console.log(
            "🌳 TREE INTERACTION READY"
        );
    }


    /* =====================================================
       BIND TREE
    ===================================================== */

    bindTree() {

        if (
            !window.scene
        ) {

            console.warn(
                "⚠️ Scene not ready — retrying..."
            );


            setTimeout(
                () => {

                    this.bindTree();

                },
                100
            );


            return;
        }


        const tree =
            window.scene.get(
                this.treeId
            );


        if (!tree) {

            console.warn(
                "⚠️ Tree not found:",
                this.treeId
            );


            setTimeout(
                () => {

                    this.bindTree();

                },
                100
            );


            return;
        }


        if (
            !tree.image
        ) {

            console.warn(
                "⚠️ Tree has no image:",
                this.treeId
            );


            return;
        }


        console.log(
            "🌳 Tree found:",
            tree
        );


        /*
            Prepare the tree BEFORE attaching
            the click interaction.
        */

        this.preparePausedTree(
            tree
        );


        /*
            Make the tree clickable.

            We intentionally use the SceneSystem
            click-action system so the normal scene
            architecture remains intact.
        */

        window.scene.setClickAction(
            this.treeId,
            {
                type:
                    "playTreeGif"
            }
        );


        /*
            Override the normal SceneSystem
            click handler behaviour for this special
            action.

            The SceneSystem already receives the click,
            so we patch handleObjectClick safely.
        */

        this.attachSpecialHandler();


        console.log(
            "🌳 Tree click interaction attached:",
            this.treeId
        );
    }


    /* =====================================================
       PREPARE PAUSED TREE
    ===================================================== */

    preparePausedTree(
        tree
    ) {

        if (
            !tree.image
        ) {

            return;
        }


        /*
            The original GIF automatically animates.

            We need a static representation of its
            first frame.

            Create a hidden temporary image that loads
            the GIF first.
        */

        const gifImage =
            tree.image;


        /*
            Keep reference to the real GIF.
        */

        tree._treeGifSource =
            gifImage;


        /*
            Hide the GIF visually while idle.
        */

        tree.image.style.visibility =
            "hidden";


        /*
            Create a canvas to capture the first frame.
        */

        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            tree.image.naturalWidth ||
            tree.data.width ||
            100;


        canvas.height =
            tree.image.naturalHeight ||
            tree.data.height ||
            100;


        const ctx =
            canvas.getContext(
                "2d"
            );


        /*
            We need a temporary image because
            drawing a GIF onto canvas gives us
            the current rendered frame.
        */

        const firstFrameImage =
            new Image();


        firstFrameImage.onload =
            () => {

                /*
                    Draw the first frame.
                */

                canvas.width =
                    firstFrameImage.naturalWidth;


                canvas.height =
                    firstFrameImage.naturalHeight;


                ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                ctx.drawImage(
                    firstFrameImage,
                    0,
                    0
                );


                /*
                    Convert the first frame
                    into a static PNG.
                */

                tree._treeFirstFrame =
                    canvas.toDataURL(
                        "image/png"
                    );


                /*
                    Use the static image while
                    the tree is idle.
                */

                tree.image.src =
                    tree._treeFirstFrame;


                tree.image.style.visibility =
                    "visible";


                console.log(
                    "🌳 Tree GIF paused on first frame:",
                    this.treeId
                );
            };


        firstFrameImage.onerror =
            error => {

                console.error(
                    "❌ Could not prepare tree GIF:",
                    error
                );


                /*
                    Fallback:
                    leave the normal GIF visible.
                */

                tree.image.style.visibility =
                    "visible";
            };


        /*
            Load the original GIF.
        */

        firstFrameImage.src =
            gifImage.src;
    }


    /* =====================================================
       ATTACH SPECIAL HANDLER
    ===================================================== */

    attachSpecialHandler() {

        if (
            this._originalHandleObjectClick
        ) {

            return;
        }


        /*
            Save the original SceneSystem method.
        */

        this._originalHandleObjectClick =
            window.scene.handleObjectClick.bind(
                window.scene
            );


        const self =
            this;


        window.scene.handleObjectClick =
            function (
                object
            ) {

                if (
                    object &&
                    object.id ===
                    self.treeId
                ) {

                    console.log(
                        "🌳 TREE CLICKED → PLAY GIF"
                    );


                    self.playTree(
                        object
                    );


                    return;
                }


                /*
                    Everything else continues to
                    use the normal SceneSystem.
                */

                self._originalHandleObjectClick(
                    object
                );
            };
    }


    /* =====================================================
       PLAY TREE
    ===================================================== */

    playTree(
        tree
    ) {

        if (
            this.playing
        ) {

            console.log(
                "🌳 Tree animation already playing"
            );


            return;
        }


        if (
            !tree ||
            !tree.image
        ) {

            return;
        }


        if (
            !tree._treeGifSource
        ) {

            console.warn(
                "⚠️ Tree GIF source missing"
            );


            return;
        }


        this.playing =
            true;


        console.log(
            "🌳 ▶ PLAYING:",
            this.treeId
        );


        /*
            Clear any previous timer.
        */

        if (
            this.playTimer
        ) {

            clearTimeout(
                this.playTimer
            );
        }


        /*
            IMPORTANT:

            Create a fresh GIF URL by adding a
            cache-busting query parameter.

            This forces the browser to start
            the GIF from frame 1 again.
        */

        const separator =
            this.gifPath.includes("?")
                ? "&"
                : "?";


        const freshGif =
            `${this.gifPath}${separator}treePlay=${Date.now()}`;


        /*
            Show the animated GIF.
        */

        tree.image.style.visibility =
            "visible";


        tree.image.src =
            freshGif;


        /*
            Wait for the animation to finish,
            then restore the static first frame.
        */

        this.playTimer =
            setTimeout(
                () => {

                    this.stopTree(
                        tree
                    );

                },
                this.gifDuration
            );
    }


    /* =====================================================
       STOP TREE
    ===================================================== */

    stopTree(
        tree
    ) {

        if (
            !tree ||
            !tree.image
        ) {

            return;
        }


        console.log(
            "🌳 ⏸ TREE GIF FINISHED"
        );


        /*
            Stop the GIF by replacing it with
            the captured first frame.
        */

        if (
            tree._treeFirstFrame
        ) {

            tree.image.src =
                tree._treeFirstFrame;
        }


        this.playing =
            false;


        this.playTimer =
            null;


        console.log(
            "🌳 Tree returned to first frame"
        );
    }
}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeTreeInteraction() {

    if (
        window.treeInteraction
    ) {

        return;
    }


    window.treeInteraction =
        new TreeInteraction();
}


initializeTreeInteraction();

