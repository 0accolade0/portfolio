/* =========================================================
   HOUSE INTERACTION SYSTEM
   ---------------------------------------------------------

   Handles:

       - House 2 zoom
       - Camera centering on House 2
       - House UI
       - ADD PICTURE
       - Browser image upload
       - Wall picture dragging
       - Wall picture scaling
       - Wall picture click-to-zoom
       - Wall picture delete
       - Wall picture reset
       - DEMO PICTURE CONFIG
       - DEMO PICTURE EDITOR
       - COPY DEMO CONFIG
       - RESET DEMO POSITIONS
       - Temporary user picture changes
       - EDITOR FRAME COLOR
       - DEMO IMAGE PRELOADING

   FRAME SYSTEM:

       Every wall picture has a real frame.

       object.data.width
       object.data.height

       represent the OUTER FRAME size.

       The actual image is fitted INSIDE
       that frame using:

           object-fit: contain

       Frame color is stored in:

           object.data.frameColor

       In editor mode:

           - Select picture
           - Choose frame color
           - Color updates immediately
           - Demo config includes frameColor
           - Selection highlight does not replace
             the selected frame color

   PRELOAD SYSTEM:

       All demo images begin loading immediately
       when this system starts.

       This keeps the existing createDemoPictures()
       behavior unchanged while giving the browser
       a head start downloading the images.

========================================================= */


/* =========================================================
   DEMO PICTURE CONFIGURATION
========================================================= */

const DEMO_PICTURES = [

    {
        "id": "demo_picture_1",
        "image": "assets/demo/photo1.jpg",
        "x": 225.4,
        "y": 172.09,
        "width": 80,
        "height": 100,
        "scale": 0.5,
        "frameColor": "#D8C3A5"
    },

    {
        "id": "demo_picture_2",
        "image": "assets/demo/photo2.jpg",
        "x": 373.74,
        "y": 143.83,
        "width": 80,
        "height": 100,
        "scale": 0.5,
        "frameColor": "#D8C3A5"
    },

    {
        "id": "demo_picture_3",
        "image": "assets/demo/photo3.jpg",
        "x": 317.78,
        "y": 389.98,
        "width": 80,
        "height": 100,
        "scale": 0.5,
        "frameColor": "#D8C3A5"
    },

    {
        "id": "demo_picture_4",
        "image": "assets/demo/photo4.jpg",
        "x": 246.05,
        "y": 259.57,
        "width": 80,
        "height": 100,
        "scale": 0.5,
        "frameColor": "#D8C3A5"
    },

    {
        "id": "demo_picture_5",
        "image": "assets/demo/photo5.jpg",
        "x": 241.16,
        "y": 355.2,
        "width": 80,
        "height": 100,
        "scale": 0.5,
        "frameColor": "#D8C3A5"
    },

    {
        "id": "demo_picture_6",
        "image": "assets/demo/photo6.jpg",
        "x": 322.78,
        "y": 295.82,
        "width": 80,
        "height": 100,
        "scale": 0.5,
        "frameColor": "#D8C3A5"
    },

    {
        "id": "demo_picture_7",
        "image": "assets/demo/photo7.jpg",
        "x": 299.63,
        "y": 186.72,
        "width": 80,
        "height": 100,
        "scale": 0.5,
        "frameColor": "#D8C3A5"
    },

    {
        "id": "demo_picture_8",
        "image": "assets/demo/photo8.jpg",
        "x": 380.27,
        "y": 235.72,
        "width": 80,
        "height": 100,
        "scale": 0.5,
        "frameColor": "#D8C3A5"
    }

];


/* =========================================================
   HOUSE INTERACTION SYSTEM
========================================================= */

class HouseInteractionSystem {

    constructor(scene) {

        this.scene =
            scene;

        this.houseId =
            "house2";

        this.house =
            null;

        this.isOpen =
            false;


        /* -------------------------------------------------
           DEFAULT FRAME COLOR
        ------------------------------------------------- */

        this.defaultFrameColor =
            "#6F523F";


        /* -------------------------------------------------
           EDITOR MODE
        ------------------------------------------------- */

/* =========================================================
   EDITOR MODE
   ---------------------------------------------------------
   PUBLIC BUILD — temporarily disabled.

   Original:

   this.editorMode =
       new URLSearchParams(
           window.location.search
       ).get("edit") === "true";
========================================================= */

// EDITOR DISABLED FOR PUBLIC BUILD
this.editorMode = false;


this.demoConfig =
    DEMO_PICTURES;


        /* -------------------------------------------------
           DEMO IMAGE PRELOAD CACHE
        ------------------------------------------------- */

        this.preloadedDemoImages =
            new Map();


        /*
            Start downloading the demo images
            immediately.

            IMPORTANT:

            This does NOT wait for the images.
            createDemoPictures() still runs normally.
        */

        this.preloadDemoImages();


        /* -------------------------------------------------
           ZOOM
        ------------------------------------------------- */

        this.zoomLevel =
            1.65;


        /* -------------------------------------------------
           DRAGGING
        ------------------------------------------------- */

        this.draggingPicture =
            null;

        this.picturePointerStart =
            null;

        this.dragMoveHandler =
            this.onPictureDragMove.bind(
                this
            );

        this.dragEndHandler =
            this.onPictureDragEnd.bind(
                this
            );


        /* -------------------------------------------------
           SELECTION
        ------------------------------------------------- */

        this.selectedPicture =
            null;


        /* -------------------------------------------------
           POPUP
        ------------------------------------------------- */

        this.pictureZoom =
            null;

        this.pictureZoomKeyHandler =
            null;


        /* -------------------------------------------------
           UI
        ------------------------------------------------- */

        this.createUI();


        if (this.editorMode) {

            this.createEditorUI();

        }


        /* -------------------------------------------------
           DEMO PICTURES
        ------------------------------------------------- */

        this.createDemoPictures();


        /* -------------------------------------------------
           RESIZE
        ------------------------------------------------- */

        window.addEventListener(
            "resize",
            () => {

                if (!this.isOpen) {

                    return;

                }

                requestAnimationFrame(
                    () => {

                        this.applyZoom();

                    }
                );

            }
        );


        /* -------------------------------------------------
           ESC
        ------------------------------------------------- */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Escape"
                ) {

                    return;

                }


                if (
                    this.pictureZoom
                ) {

                    this.closePictureZoom();

                    return;

                }


                if (
                    this.isOpen
                ) {

                    this.closeHouse();

                }

            }
        );


        console.log(
            "🏠 HouseInteractionSystem ready"
        );

        console.log(
            "🏠 House ID:",
            this.houseId
        );

        console.log(
            "🏠 Editor mode:",
            this.editorMode
        );

        console.log(
            "🏠 Demo pictures:",
            this.demoConfig.length
        );

    }


    /* =====================================================
       PRELOAD DEMO IMAGES

       All demo images begin loading immediately.

       This does NOT wait for them.

       The browser starts fetching them while the rest
       of the scene is being initialized.

    ===================================================== */

    preloadDemoImages() {

        if (
            !Array.isArray(
                this.demoConfig
            )
        ) {

            return;

        }


        this.demoConfig.forEach(
            config => {

                if (
                    !config ||
                    !config.image
                ) {

                    return;

                }


                /*
                    Prevent duplicate preload.
                */

                if (
                    this.preloadedDemoImages.has(
                        config.image
                    )
                ) {

                    return;

                }


                const image =
                    new Image();


                /*
                    Decode the image asynchronously
                    when possible.
                */

                image.decoding =
                    "async";


                /*
                    Tell the browser these images
                    are important for the scene.
                */

                try {

                    image.fetchPriority =
                        "high";

                } catch (error) {}


                /*
                    THIS STARTS THE DOWNLOAD
                    IMMEDIATELY.
                */

                image.src =
                    config.image;


                /*
                    Keep the Image object alive in
                    memory so the browser can retain
                    the decoded/cached resource.
                */

                this.preloadedDemoImages.set(
                    config.image,
                    image
                );


                image.onload =
                    () => {

                        console.log(
                            "🖼 Demo image preloaded:",
                            config.image
                        );

                    };


                image.onerror =
                    () => {

                        console.warn(
                            "⚠️ Demo image preload failed:",
                            config.image
                        );

                    };

            }
        );


        console.log(
            "🚀 Demo image preload started:",
            this.demoConfig.length,
            "images"
        );

    }


    /* =====================================================
       NORMAL HOUSE UI
    ===================================================== */

    createUI() {

        if (
            document.getElementById(
                "house-interaction-ui"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "house-interaction-style";


        style.textContent = `

            #house-interaction-ui {

                position: fixed;

                left: 50%;

                bottom: 28px;

                transform:
                    translateX(-50%);

                display: none;

                align-items: center;

                gap: 12px;

                z-index: 999999;

                font-family:
                    Arial,
                    sans-serif;

                pointer-events:
                    auto;

                user-select:
                    none;

            }


            #house-interaction-ui.visible {

                display: flex;

            }


            .house-ui-button {

                border: none;

                outline: none;

                padding:
                    13px 22px;

                border-radius:
                    999px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.94
                    );

                color:
                    #7d5d70;

                font-size:
                    14px;

                font-weight:
                    600;

                cursor:
                    pointer;

                box-shadow:
                    0 6px 20px
                    rgba(
                        0,
                        0,
                        0,
                        0.16
                    );

            }


            .house-ui-button:hover {

                background:
                    #ffffff;

            }


            #house-delete-picture {

                color:
                    #a45f6f;

            }


            #house-picture-input {

                display:
                    none;

            }

        `;


        document.head.appendChild(
            style
        );


        const ui =
            document.createElement(
                "div"
            );


        ui.id =
            "house-interaction-ui";


        /* -------------------------------------------------
           ADD
        ------------------------------------------------- */

        const addButton =
            document.createElement(
                "button"
            );

        addButton.className =
            "house-ui-button";

        addButton.type =
            "button";

        addButton.textContent =
            "+ ADD PICTURE";


        /* -------------------------------------------------
           DELETE
        ------------------------------------------------- */

        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.className =
            "house-ui-button";

        deleteButton.id =
            "house-delete-picture";

        deleteButton.type =
            "button";

        deleteButton.textContent =
            "✕ DELETE";

        deleteButton.style.display =
            "none";


        /* -------------------------------------------------
           BACK
        ------------------------------------------------- */

        const backButton =
            document.createElement(
                "button"
            );

        backButton.className =
            "house-ui-button";

        backButton.type =
            "button";

        backButton.textContent =
            "← BACK";


        /* -------------------------------------------------
           FILE INPUT
        ------------------------------------------------- */

        const input =
            document.createElement(
                "input"
            );

        input.id =
            "house-picture-input";

        input.type =
            "file";

        input.accept =
            "image/*";

        input.multiple =
            true;


        /* -------------------------------------------------
           EVENTS
        ------------------------------------------------- */

        addButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                this.openFilePicker();

            }
        );


        deleteButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                if (
                    this.selectedPicture
                ) {

                    this.deletePicture(
                        this.selectedPicture
                    );

                }

            }
        );


        backButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                this.closeHouse();

            }
        );


        input.addEventListener(
            "change",
            event => {

                this.handleFiles(
                    event.target.files
                );

                input.value =
                    "";

            }
        );


        /* -------------------------------------------------
           BUILD UI
        ------------------------------------------------- */

        ui.appendChild(
            addButton
        );

        ui.appendChild(
            deleteButton
        );

        ui.appendChild(
            backButton
        );


        document.body.appendChild(
            ui
        );

        document.body.appendChild(
            input
        );


        this.ui =
            ui;

        this.fileInput =
            input;

        this.addButton =
            addButton;

        this.deleteButton =
            deleteButton;

        this.backButton =
            backButton;

    }


    /* =====================================================
       DEMO EDITOR UI
    ===================================================== */

    createEditorUI() {

        if (
            document.getElementById(
                "house-demo-editor"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "house-demo-editor-style";


        style.textContent = `

            #house-demo-editor {

                position: fixed;

                top: 20px;

                right: 270px;

                width: 280px;

                z-index: 10000000;

                padding: 18px;

                box-sizing: border-box;

                border-radius: 18px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.97
                    );

                box-shadow:
                    0 15px 50px
                    rgba(
                        0,
                        0,
                        0,
                        0.20
                    );

                font-family:
                    Arial,
                    sans-serif;

                color:
                    #5f4b58;

                user-select:
                    none;

            }


            #house-demo-editor h3 {

                margin:
                    0 0 8px 0;

                font-size:
                    16px;

            }

            /* -------------------------------------------------
   DRAGGABLE EDITOR HEADER
------------------------------------------------- */

.house-editor-drag-handle {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        10px;

    margin:
        0 0 8px 0;

    font-size:
        16px;

    cursor:
        grab;

    user-select:
        none;

    touch-action:
        none;

}

.house-editor-drag-handle:active {

    cursor:
        grabbing;

}

.house-editor-drag-icon {

    font-size:
        15px;

    line-height:
        1;

    opacity:
        0.35;

    letter-spacing:
        -2px;

}


            #house-demo-editor p {

                margin:
                    0 0 14px 0;

                font-size:
                    12px;

                line-height:
                    1.5;

                opacity:
                    0.72;

            }


            .house-editor-button {

                width:
                    100%;

                border:
                    none;

                padding:
                    11px 14px;

                margin-top:
                    8px;

                border-radius:
                    10px;

                background:
                    #f5edf2;

                color:
                    #6d5263;

                font-weight:
                    600;

                cursor:
                    pointer;

            }


            .house-editor-button:hover {

                background:
                    #eee1e9;

            }


            .house-editor-selected {

                margin-top:
                    12px;

                padding:
                    10px;

                border-radius:
                    10px;

                background:
                    #faf7f9;

                font-size:
                    12px;

                line-height:
                    1.5;

            }


            .house-editor-warning {

                margin-top:
                    12px;

                font-size:
                    11px;

                line-height:
                    1.45;

                opacity:
                    0.65;

            }


            /* -------------------------------------------------
               FRAME COLOR CONTROL
            ------------------------------------------------- */

            .house-frame-color-row {

                display:
                    flex;

                align-items:
                    center;

                gap:
                    8px;

                margin-top:
                    12px;

                padding:
                    10px;

                border-radius:
                    10px;

                background:
                    #faf7f9;

            }


            .house-frame-color-label {

                flex:
                    1;

                font-size:
                    12px;

                font-weight:
                    600;

            }


            #house-frame-color-select {

                width:
                    125px;

                padding:
                    7px 8px;

                border:
                    1px solid #ddd2d9;

                border-radius:
                    8px;

                background:
                    #ffffff;

                color:
                    #5f4b58;

                font-size:
                    12px;

                cursor:
                    pointer;

                outline:
                    none;

            }


            #house-frame-color-select:disabled {

                opacity:
                    0.45;

                cursor:
                    not-allowed;

            }

        `;


        document.head.appendChild(
            style
        );


        const panel =
            document.createElement(
                "div"
            );


        panel.id =
            "house-demo-editor";


        panel.innerHTML = `

            <h3
                id="house-editor-drag-handle"
                class="house-editor-drag-handle"
            >
                <span>🛠 Demo Picture Editor</span>
                <span class="house-editor-drag-icon">⋮⋮</span>
            </h3>

            <p>
                Demo pictures are editable
                directly on the scene.
                Click a picture, drag it,
                or use the mouse wheel.
            </p>

            <button
                id="house-editor-copy"
                class="house-editor-button"
                type="button"
            >
                📋 COPY DEMO CONFIG
            </button>

            <button
                id="house-editor-reset"
                class="house-editor-button"
                type="button"
            >
                ↩ RESET DEMO POSITIONS
            </button>

            <div
                class="house-frame-color-row"
            >

                <span
                    class="house-frame-color-label"
                >
                    🖼 Frame Color
                </span>

                <select
                    id="house-frame-color-select"
                >

                    <option value="">
                        Select...
                    </option>

                    <option value="#6F523F">
                        Dark Brown
                    </option>

                    <option value="#7B4F2C">
                        Walnut
                    </option>

                    <option value="#C69C6D">
                        Light Oak
                    </option>

                    <option value="#B08D57">
                        Antique Gold
                    </option>

                    <option value="#D8C3A5">
                        Cream
                    </option>

                    <option value="#222222">
                        Matte Black
                    </option>

                    <option value="#444444">
                        Charcoal
                    </option>

                    <option value="#F5F5F5">
                        White
                    </option>

                    <option value="#A8A8A8">
                        Silver
                    </option>

                    <option value="#3F5B4B">
                        Deep Green
                    </option>

                    <option value="#304A6E">
                        Navy Blue
                    </option>

                    <option value="#6E2639">
                        Burgundy
                    </option>

                </select>

            </div>

            <div
                id="house-editor-selected"
                class="house-editor-selected"
            >
                Nothing selected.
            </div>

            <div
                class="house-editor-warning"
            >
                Changes are temporary while editing.
                Copy the config and replace
                DEMO_PICTURES in your code.
            </div>

        `;


        document.body.appendChild(
            panel
        );


        this.editorPanel =
            panel;


        this.editorSelected =
            panel.querySelector(
                "#house-editor-selected"
            );


        this.frameColorSelect =
            panel.querySelector(
                "#house-frame-color-select"
            );


        /* -------------------------------------------------
           COPY
        ------------------------------------------------- */

        panel.querySelector(
            "#house-editor-copy"
        ).addEventListener(
            "click",
            () => {

                this.copyDemoConfig();

            }
        );


        /* -------------------------------------------------
           RESET
        ------------------------------------------------- */

        panel.querySelector(
            "#house-editor-reset"
        ).addEventListener(
            "click",
            () => {

                this.resetDemoPictures();

            }
        );


        /* -------------------------------------------------
           FRAME COLOR
        ------------------------------------------------- */

        this.frameColorSelect.addEventListener(
            "change",
            event => {

                const color =
                    event.target.value;


                if (!color) {
                    return;
                }


                this.changeSelectedFrameColor(
                    color
                );

            }
        );


        /* -------------------------------------------------
           PREVENT SCENE INTERACTION
        ------------------------------------------------- */

        panel.addEventListener(
            "pointerdown",
            event => {

                event.stopPropagation();

            }
        );

        /* =================================================
   DRAGGABLE EDITOR PANEL
================================================= */

const dragHandle =
    panel.querySelector(
        "#house-editor-drag-handle"
    );


let editorDragging =
    false;

let editorDragPointerId =
    null;

let editorDragOffsetX =
    0;

let editorDragOffsetY =
    0;


if (dragHandle) {

    dragHandle.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();
            event.stopPropagation();


            const rect =
                panel.getBoundingClientRect();


            /*
                Convert the panel from:

                    top + right

                into:

                    top + left

                This allows free dragging anywhere.
            */

            panel.style.left =
                rect.left + "px";

            panel.style.top =
                rect.top + "px";

            panel.style.right =
                "auto";


            editorDragging =
                true;

            editorDragPointerId =
                event.pointerId;


            editorDragOffsetX =
                event.clientX -
                rect.left;

            editorDragOffsetY =
                event.clientY -
                rect.top;


            dragHandle.style.cursor =
                "grabbing";


            try {

                dragHandle.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {}


        }
    );


    dragHandle.addEventListener(
        "pointermove",
        event => {

            if (
                !editorDragging ||
                event.pointerId !==
                editorDragPointerId
            ) {

                return;

            }


            event.preventDefault();
            event.stopPropagation();


            let left =
                event.clientX -
                editorDragOffsetX;

            let top =
                event.clientY -
                editorDragOffsetY;


            /*
                Keep the editor partially on-screen.
            */

            const panelWidth =
                panel.offsetWidth;

            const panelHeight =
                panel.offsetHeight;


            const minVisible =
                40;


            left =
                Math.max(
                    minVisible -
                    panelWidth,
                    Math.min(
                        window.innerWidth -
                        minVisible,
                        left
                    )
                );


            top =
                Math.max(
                    0,
                    Math.min(
                        window.innerHeight -
                        minVisible,
                        top
                    )
                );


            panel.style.left =
                left + "px";

            panel.style.top =
                top + "px";

        }
    );


    const stopEditorDrag =
        event => {

            if (
                !editorDragging ||
                event.pointerId !==
                editorDragPointerId
            ) {

                return;

            }


            editorDragging =
                false;

            editorDragPointerId =
                null;


            dragHandle.style.cursor =
                "grab";

        };


    dragHandle.addEventListener(
        "pointerup",
        stopEditorDrag
    );


    dragHandle.addEventListener(
        "pointercancel",
        stopEditorDrag
    );

}

    }


    /* =====================================================
       CHANGE SELECTED FRAME COLOR
    ===================================================== */

    changeSelectedFrameColor(color) {

        if (
            !this.editorMode ||
            !this.selectedPicture
        ) {

            return;

        }


        const object =
            this.selectedPicture;


        if (
            !object.data ||
            !object.element
        ) {

            return;

        }


        if (
            !this.isValidFrameColor(color)
        ) {

            return;

        }


        /* -------------------------------------------------
           SAVE COLOR TO OBJECT DATA
        ------------------------------------------------- */

        object.data.frameColor =
            color;


        /* -------------------------------------------------
           APPLY COLOR
        ------------------------------------------------- */

        this.applyFrameColor(
            object
        );


        /* -------------------------------------------------
           KEEP SELECTION EFFECT
        ------------------------------------------------- */

        this.updateEditorSelection(
            object
        );


        console.log(
            "🖼 Frame color changed:",
            object.id,
            color
        );

    }


    /* =====================================================
       APPLY FRAME COLOR
    ===================================================== */

    applyFrameColor(object) {

        if (
            !object ||
            !object.element
        ) {

            return;

        }


        const color =
            this.getFrameColor(
                object
            );


        object.element.style.border =
            `4px solid ${color}`;


        /*
            Keep the inside of the frame
            matched to the frame color.
        */

        object.element.style.backgroundColor =
            color;

    }


    /* =====================================================
       GET FRAME COLOR
    ===================================================== */

    getFrameColor(object) {

        if (
            object &&
            object.data &&
            this.isValidFrameColor(
                object.data.frameColor
            )
        ) {

            return object.data.frameColor;

        }


        return this.defaultFrameColor;

    }


    /* =====================================================
       VALIDATE FRAME COLOR
    ===================================================== */

    isValidFrameColor(color) {

        if (
            typeof color !==
            "string"
        ) {

            return false;

        }


        return /^#[0-9A-Fa-f]{6}$/.test(
            color
        );

    }


    /* =====================================================
       UPDATE FRAME COLOR SELECTOR
    ===================================================== */

    updateFrameColorSelector(object) {

        if (
            !this.frameColorSelect
        ) {

            return;

        }


        if (!object) {

            this.frameColorSelect.value =
                "";

            this.frameColorSelect.disabled =
                true;

            return;

        }


        const color =
            this.getFrameColor(
                object
            );


        this.frameColorSelect.disabled =
            false;


        const optionExists =
            Array.from(
                this.frameColorSelect.options
            ).some(
                option =>
                    option.value ===
                    color
            );


        if (optionExists) {

            this.frameColorSelect.value =
                color;

        } else {

            this.frameColorSelect.value =
                "";

        }

    }


    /* =====================================================
       CREATE DEMO PICTURES
    ===================================================== */

    createDemoPictures() {

        const attempt =
            () => {

                if (
                    !this.scene ||
                    typeof this.scene.get !==
                    "function"
                ) {

                    setTimeout(
                        attempt,
                        100
                    );

                    return;

                }


                const house =
                    this.scene.get(
                        this.houseId
                    );


                if (!house) {

                    setTimeout(
                        attempt,
                        100
                    );

                    return;

                }


                this.demoConfig.forEach(
                    config => {

                        this.createDemoPicture(
                            config
                        );

                    }
                );


                if (
                    window.sceneEditor &&
                    typeof window.sceneEditor
                        .refreshObjectEvents ===
                    "function"
                ) {

                    window.sceneEditor
                        .refreshObjectEvents();

                }


                console.log(
                    "🖼 Demo pictures ready:",
                    this.demoConfig.length
                );

            };


        attempt();

    }


    /* =====================================================
       CREATE DEMO PICTURE
    ===================================================== */

    createDemoPicture(config) {

        if (!config) {
            return null;
        }


        const house =
            this.scene.get(
                this.houseId
            );


        if (!house) {
            return null;
        }


        const existing =
            this.scene.get(
                config.id
            );


        if (existing) {

            /*
                Make sure old demo objects also
                receive the configured frame color.
            */

            existing.data.frameColor =
                config.frameColor ||
                existing.data.frameColor ||
                this.defaultFrameColor;


            this.preparePicture(
                existing
            );


            return existing;

        }


        const data = {

            id:
                config.id,

            image:
                config.image,

            states:
                [
                    "outside"
                ],

            x:
                Number(config.x) || 0,

            y:
                Number(config.y) || 0,

            width:
                Number(config.width) || 80,

            height:
                Number(config.height) || 80,

            scale:
                Number.isFinite(
                    Number(config.scale)
                )
                    ? Number(config.scale)
                    : 1,

            rotation:
                0,

            opacity:
                1,

            z:
                1000,

            parent:
                this.houseId,

            wallPicture:
                true,

            demoPicture:
                true,

            uploadedPicture:
                false,

            demoImage:
                config.image,

            originalName:
                config.id,

            frameColor:
                this.isValidFrameColor(
                    config.frameColor
                )
                    ? config.frameColor
                    : this.defaultFrameColor

        };


        const object =
            this.scene.createObject(
                data
            );


        if (!object) {

            console.error(
                "❌ Failed to create demo picture:",
                config.id
            );

            return null;

        }


        this.scene.attachChild(
            object,
            house
        );


        this.preparePicture(
            object
        );


        if (
            typeof this.scene.refreshObjectVisibility ===
            "function"
        ) {

            this.scene.refreshObjectVisibility(
                object
            );

        }


        if (
            this.editorMode &&
            object.element
        ) {

            object.element.style.display =
                "";

            object.element.style.visibility =
                "visible";

        }


        return object;

    }


    /* =====================================================
       OPEN HOUSE
    ===================================================== */

    openHouse(object = null) {

        const house =
            object ||
            this.scene.get(
                this.houseId
            );


        if (!house) {
            return;
        }


        this.house =
            house;

        this.isOpen =
            true;


        if (
            typeof this.scene.setState ===
            "function"
        ) {

            this.scene.setState(
                "outside"
            );

        }


        if (this.ui) {

            this.ui.classList.add(
                "visible"
            );

        }


        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        this.applyZoom();

                    }
                );

            }
        );

    }


    /* =====================================================
       HOUSE 2 SELECTED
    ===================================================== */

    onHouse2Selected(object) {

        this.openHouse(
            object ||
            this.scene.get(
                this.houseId
            )
        );

    }


    /* =====================================================
       HOUSE 1 SELECTED
    ===================================================== */

    onHouse1Selected() {

        if (this.isOpen) {

            this.closeHouse();

        }

    }


    /* =====================================================
       ZOOM
    ===================================================== */

    applyZoom() {

        if (!this.isOpen) {
            return;
        }

        if (!this.house) {
            return;
        }


        const sceneElement =
            this.scene.sceneElement;

        const container =
            this.scene.container;


        if (
            !sceneElement ||
            !container
        ) {

            return;

        }


        const containerWidth =
            container.clientWidth;

        const containerHeight =
            container.clientHeight;


        if (
            !containerWidth ||
            !containerHeight
        ) {

            return;

        }


        const baseScale =
            this.scene.viewportScale ||
            1;


        const finalScale =
            baseScale *
            this.zoomLevel;


        const houseX =
            Number(
                this.house.data.x
            ) || 0;

        const houseY =
            Number(
                this.house.data.y
            ) || 0;


        const screenCenterX =
            containerWidth / 2;

        const screenCenterY =
            containerHeight / 2;


        sceneElement.style.left =
            (
                screenCenterX -
                (
                    houseX *
                    finalScale
                )
            ) + "px";


        sceneElement.style.top =
            (
                screenCenterY -
                (
                    houseY *
                    finalScale
                )
            ) + "px";


        sceneElement.style.width =
            this.scene.config.width +
            "px";

        sceneElement.style.height =
            this.scene.config.height +
            "px";


        sceneElement.style.transform =
            `scale(${finalScale})`;

        sceneElement.style.transformOrigin =
            "top left";

    }


    /* =====================================================
       CLOSE HOUSE
    ===================================================== */

    closeHouse() {

        if (!this.isOpen) {
            return;
        }


        this.closePictureZoom();

        this.isOpen =
            false;

        this.stopPictureDrag();

        this.selectedPicture =
            null;


        if (this.deleteButton) {

            this.deleteButton.style.display =
                "none";

        }


        if (this.frameColorSelect) {

            this.frameColorSelect.value =
                "";

            this.frameColorSelect.disabled =
                true;

        }


        if (this.ui) {

            this.ui.classList.remove(
                "visible"
            );

        }


        if (
            typeof this.scene.updateViewport ===
            "function"
        ) {

            this.scene.updateViewport();

        }


        if (
            typeof this.scene.setState ===
            "function"
        ) {

            this.scene.setState(
                "outside"
            );

        }


        this.house =
            null;

    }


    /* =====================================================
       FILE PICKER
    ===================================================== */

    openFilePicker() {

        if (!this.isOpen) {
            return;
        }

        if (!this.fileInput) {
            return;
        }


        try {

            if (
                typeof this.fileInput.showPicker ===
                "function"
            ) {

                this.fileInput.showPicker();

            } else {

                this.fileInput.click();

            }

        } catch (error) {

            this.fileInput.click();

        }

    }


    /* =====================================================
       HANDLE FILES
    ===================================================== */

    handleFiles(fileList) {

        if (!fileList) {
            return;
        }


        Array.from(fileList)
            .forEach(
                file => {

                    if (
                        !file.type ||
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        return;

                    }


                    this.readImage(
                        file
                    );

                }
            );

    }


    /* =====================================================
       READ IMAGE
    ===================================================== */

    readImage(file) {

        const reader =
            new FileReader();


        reader.onload =
            event => {

                const imageData =
                    event.target.result;


                const preview =
                    new Image();


                preview.onload =
                    () => {

                        this.createPicture(
                            file,
                            imageData,
                            preview.naturalWidth,
                            preview.naturalHeight
                        );

                    };


                preview.onerror =
                    () => {

                        console.error(
                            "❌ Could not load image:",
                            file.name
                        );

                    };


                preview.src =
                    imageData;

            };


        reader.onerror =
            () => {

                console.error(
                    "❌ Could not read:",
                    file.name
                );

            };


        reader.readAsDataURL(
            file
        );

    }


    /* =====================================================
       CREATE USER PICTURE
    ===================================================== */

    createPicture(
        file,
        imageData,
        naturalWidth,
        naturalHeight
    ) {

        const house =
            this.scene.get(
                this.houseId
            );


        if (!house) {
            return;
        }


        /*
            IMPORTANT:

            The initial frame is limited to 90px.

            The image is fitted INSIDE this frame.
        */

        const maxSize =
            90;


        const ratio =
            Math.min(
                1,
                maxSize /
                Math.max(
                    naturalWidth,
                    naturalHeight
                )
            );


        const width =
            naturalWidth *
            ratio;


        const height =
            naturalHeight *
            ratio;


        const id =
            this.makePictureId();


        const data = {

            id:
                id,

            image:
                imageData,

            states:
                [
                    "outside"
                ],

            x:
                house.data.width / 2,

            y:
                house.data.height / 2,

            width:
                width,

            height:
                height,

            scale:
                1,

            rotation:
                0,

            opacity:
                1,

            z:
                1000,

            parent:
                this.houseId,

            wallPicture:
                true,

            demoPicture:
                false,

            uploadedPicture:
                true,

            originalName:
                file.name,

            frameColor:
                this.defaultFrameColor

        };


        const object =
            this.scene.createObject(
                data
            );


        if (!object) {
            return;
        }


        this.scene.attachChild(
            object,
            house
        );


        this.preparePicture(
            object
        );


        if (
            typeof this.scene.refreshObjectVisibility ===
            "function"
        ) {

            this.scene.refreshObjectVisibility(
                object
            );

        }


        if (
            object.element &&
            this.isOpen
        ) {

            object.element.style.display =
                "";

            object.element.style.visibility =
                "visible";

        }


        this.selectPicture(
            object
        );


        console.log(
            "📸 Temporary user picture created:",
            object.id
        );

    }


    /* =====================================================
       PREPARE PICTURE

       FRAME SYSTEM:

       The element itself becomes the FRAME.

       width  = outer frame width
       height = outer frame height

       Image is fitted inside using:

           object-fit: contain

       Frame color comes from:

           object.data.frameColor

    ===================================================== */

    preparePicture(object) {

        if (
            !object ||
            !object.element
        ) {

            return;

        }


        const element =
            object.element;


        /* -------------------------------------------------
           MAKE SURE FRAME COLOR EXISTS
        ------------------------------------------------- */

        if (
            !this.isValidFrameColor(
                object.data.frameColor
            )
        ) {

            object.data.frameColor =
                this.defaultFrameColor;

        }


        /* -------------------------------------------------
           INTERACTION
        ------------------------------------------------- */

        element.style.pointerEvents =
            "auto";

        element.style.cursor =
            "grab";

        element.style.touchAction =
            "none";

        element.style.userSelect =
            "none";


        /* -------------------------------------------------
           FRAME
        ------------------------------------------------- */

        element.style.boxSizing =
            "border-box";

        element.style.padding =
            "4px";

        element.style.margin =
            "0";


        this.applyFrameColor(
            object
        );


        element.style.outline =
            "none";

        element.style.outlineOffset =
            "0";


        element.style.boxShadow =
            "0 3px 10px rgba(0,0,0,0.25)";


        element.style.overflow =
            "hidden";


        /* -------------------------------------------------
           IMAGE FIT
        ------------------------------------------------- */

        element.style.objectFit =
            "contain";

        element.style.objectPosition =
            "center center";


        element.style.backgroundClip =
            "padding-box";


        /* -------------------------------------------------
           DATA MARKERS
        ------------------------------------------------- */

        element.dataset.housePicture =
            "true";


        element.dataset.wallPicture =
            "true";


        element.style.zIndex =
            String(
                object.data.z || 1000
            );


        if (
            element.dataset.pictureReady ===
            "true"
        ) {

            return;

        }


        element.dataset.pictureReady =
            "true";


        /* -------------------------------------------------
           POINTER DOWN
        ------------------------------------------------- */

        element.addEventListener(
            "pointerdown",
            event => {

                this.picturePointerStart = {

                    x:
                        event.clientX,

                    y:
                        event.clientY

                };


                this.startPictureDrag(
                    event,
                    object
                );

            }
        );


        /* -------------------------------------------------
           WHEEL
        ------------------------------------------------- */

        element.addEventListener(
            "wheel",
            event => {

                this.onPictureWheel(
                    event,
                    object
                );

            },
            {
                passive: false
            }
        );


        /* -------------------------------------------------
           DOUBLE CLICK
        ------------------------------------------------- */

        element.addEventListener(
            "dblclick",
            event => {

                this.onPictureDoubleClick(
                    event,
                    object
                );

            }
        );

    }


    /* =====================================================
       START PICTURE DRAG
    ===================================================== */

    startPictureDrag(
        event,
        object
    ) {

        const canEdit =
            this.isOpen ||
            (
                this.editorMode &&
                object &&
                object.data &&
                object.data.demoPicture
            );


        if (!canEdit) {
            return;
        }


        event.preventDefault();
        event.stopPropagation();


        const house =
            this.scene.get(
                this.houseId
            );


        if (!house) {
            return;
        }


        const point =
            this.screenToHouse(
                event.clientX,
                event.clientY
            );


        this.draggingPicture = {

            object:
                object,

            pointerId:
                event.pointerId,

            offsetX:
                point.x -
                object.data.x,

            offsetY:
                point.y -
                object.data.y

        };


        this.selectPicture(
            object
        );


        object.element.style.cursor =
            "grabbing";


        try {

            object.element.setPointerCapture(
                event.pointerId
            );

        } catch (error) {}


        window.addEventListener(
            "pointermove",
            this.dragMoveHandler
        );


        window.addEventListener(
            "pointerup",
            this.dragEndHandler
        );


        window.addEventListener(
            "pointercancel",
            this.dragEndHandler
        );

    }


    /* =====================================================
       DRAG MOVE
    ===================================================== */

    onPictureDragMove(event) {

        if (!this.draggingPicture) {
            return;
        }


        if (
            event.pointerId !==
            this.draggingPicture.pointerId
        ) {

            return;

        }


        event.preventDefault();


        const object =
            this.draggingPicture.object;


        const house =
            this.scene.get(
                this.houseId
            );


        if (!house) {
            return;
        }


        const point =
            this.screenToHouse(
                event.clientX,
                event.clientY
            );


        let x =
            point.x -
            this.draggingPicture.offsetX;


        let y =
            point.y -
            this.draggingPicture.offsetY;


        const halfWidth =
            (
                object.data.width *
                object.data.scale
            ) / 2;


        const halfHeight =
            (
                object.data.height *
                object.data.scale
            ) / 2;


        x =
            Math.max(
                halfWidth,
                Math.min(
                    house.data.width -
                    halfWidth,
                    x
                )
            );


        y =
            Math.max(
                halfHeight,
                Math.min(
                    house.data.height -
                    halfHeight,
                    y
                )
            );


        this.scene.move(
            object.id,
            x,
            y
        );


        this.updateEditorSelection(
            object
        );

    }


    /* =====================================================
       DRAG END
    ===================================================== */

    onPictureDragEnd(event) {

        if (!this.draggingPicture) {
            return;
        }


        if (
            event.pointerId !==
            this.draggingPicture.pointerId
        ) {

            return;

        }


        const object =
            this.draggingPicture.object;


        if (
            object &&
            object.element
        ) {

            object.element.style.cursor =
                "grab";

        }


        let wasClick =
            false;


        if (
            this.picturePointerStart
        ) {

            const dx =
                event.clientX -
                this.picturePointerStart.x;


            const dy =
                event.clientY -
                this.picturePointerStart.y;


            wasClick =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                ) < 8;

        }


        this.draggingPicture =
            null;

        this.picturePointerStart =
            null;


        this.removeDragListeners();


        this.updateEditorSelection(
            object
        );


        if (
            wasClick &&
            !this.editorMode
        ) {

            this.openPictureZoom(
                object
            );

        }

    }


    /* =====================================================
       STOP DRAG
    ===================================================== */

    stopPictureDrag() {

        if (
            this.draggingPicture &&
            this.draggingPicture.object &&
            this.draggingPicture.object.element
        ) {

            this.draggingPicture.object.element.style.cursor =
                "grab";

        }


        this.draggingPicture =
            null;

        this.picturePointerStart =
            null;


        this.removeDragListeners();

    }


    /* =====================================================
       REMOVE DRAG LISTENERS
    ===================================================== */

    removeDragListeners() {

        window.removeEventListener(
            "pointermove",
            this.dragMoveHandler
        );

        window.removeEventListener(
            "pointerup",
            this.dragEndHandler
        );

        window.removeEventListener(
            "pointercancel",
            this.dragEndHandler
        );

    }


    /* =====================================================
       SELECT PICTURE
    ===================================================== */

    selectPicture(object) {

        if (!object) {
            return;
        }


        this.selectedPicture =
            object;


        if (this.deleteButton) {

            if (
                this.editorMode &&
                object.data.demoPicture
            ) {

                this.deleteButton.style.display =
                    "none";

            } else {

                this.deleteButton.style.display =
                    "block";

            }

        }


        this.updateEditorSelection(
            object
        );

    }


    /* =====================================================
       EDITOR SELECTION
    ===================================================== */

    updateEditorSelection(object) {

        if (
            !this.editorMode ||
            !this.editorSelected
        ) {

            return;

        }


        if (!object) {

            this.editorSelected.textContent =
                "Nothing selected.";


            this.updateFrameColorSelector(
                null
            );


            return;

        }


        const isDemo =
            !!object.data.demoPicture;


        /* -------------------------------------------------
           UPDATE COLOR SELECTOR
        ------------------------------------------------- */

        this.updateFrameColorSelector(
            object
        );


        if (!isDemo) {

            this.editorSelected.innerHTML =
                `
                    <strong>User picture</strong><br>
                    Temporary upload<br>
                    ID: ${this.escapeHTML(
                        object.id
                    )}
                `;


            this.clearPictureSelectionOutline();


            if (
                object.element
            ) {

                object.element.style.outline =
                    "3px solid rgba(255,80,150,0.55)";

                object.element.style.outlineOffset =
                    "2px";

                object.element.style.boxShadow =
                    "0 0 0 3px rgba(255,80,150,0.18), 0 4px 14px rgba(0,0,0,0.28)";

            }

            return;

        }


        this.editorSelected.innerHTML =
            `
                <strong>Selected demo</strong><br>
                ID: ${this.escapeHTML(
                    object.id
                )}<br>
                x: ${this.roundNumber(
                    object.data.x
                )}<br>
                y: ${this.roundNumber(
                    object.data.y
                )}<br>
                width: ${this.roundNumber(
                    object.data.width
                )}<br>
                height: ${this.roundNumber(
                    object.data.height
                )}<br>
                scale: ${this.roundNumber(
                    object.data.scale
                )}<br>
                frame: ${this.escapeHTML(
                    this.getFrameColor(object)
                )}
            `;


        this.clearPictureSelectionOutline();


        if (
            object.element
        ) {

            /*
                IMPORTANT:

                Do NOT replace the actual frame
                color with pink.

                The real frame remains the selected
                color.

                Pink is only an OUTLINE around it.
            */

            object.element.style.outline =
                "3px solid rgba(255,80,150,0.65)";

            object.element.style.outlineOffset =
                "2px";

            object.element.style.boxShadow =
                "0 0 0 3px rgba(255,80,150,0.18), 0 4px 14px rgba(0,0,0,0.28)";

        }

    }


    /* =====================================================
       CLEAR SELECTION OUTLINES
    ===================================================== */

    clearPictureSelectionOutline() {

        if (
            !this.scene ||
            !this.scene.objects
        ) {

            return;

        }


        for (
            const object
            of this.scene.objects.values()
        ) {

            if (
                object.data &&
                object.data.wallPicture &&
                object.element
            ) {

                /* -----------------------------------------
                   Remove selection outline
                ----------------------------------------- */

                object.element.style.outline =
                    "none";

                object.element.style.outlineOffset =
                    "0";


                /* -----------------------------------------
                   Restore actual frame color
                ----------------------------------------- */

                this.applyFrameColor(
                    object
                );


                object.element.style.boxShadow =
                    "0 3px 10px rgba(0,0,0,0.25)";

            }

        }

    }


    /* =====================================================
       PICTURE SCALE
    ===================================================== */

    onPictureWheel(
        event,
        object
    ) {

        const canEdit =
            this.isOpen ||
            (
                this.editorMode &&
                object &&
                object.data &&
                object.data.demoPicture
            );


        if (!canEdit) {
            return;
        }


        if (!object) {
            return;
        }


        event.preventDefault();
        event.stopPropagation();


        const scaleStep =
            event.shiftKey
                ? 0.01
                : 0.05;


        const direction =
            event.deltaY > 0
                ? -1
                : 1;


        const currentScale =
            Number(
                object.data.scale
            ) || 1;


        let newScale =
            currentScale +
            (
                direction *
                scaleStep
            );


        newScale =
            Math.max(
                0.10,
                Math.min(
                    5,
                    newScale
                )
            );


        this.scene.scaleObject(
            object.id,
            newScale
        );


        this.selectPicture(
            object
        );


        this.updateEditorSelection(
            object
        );

    }


    /* =====================================================
       DOUBLE CLICK RESET
    ===================================================== */

    onPictureDoubleClick(
        event,
        object
    ) {

        const canEdit =
            this.isOpen ||
            (
                this.editorMode &&
                object &&
                object.data &&
                object.data.demoPicture
            );


        if (!canEdit) {
            return;
        }


        event.preventDefault();
        event.stopPropagation();


        this.scene.scaleObject(
            object.id,
            1
        );


        this.selectPicture(
            object
        );


        this.updateEditorSelection(
            object
        );

    }


    /* =====================================================
       OPEN PICTURE ZOOM
    ===================================================== */

    openPictureZoom(object) {

        if (
            !object ||
            !object.data.image
        ) {

            return;

        }


        this.closePictureZoom();


        const overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "house-picture-zoom";


        overlay.innerHTML = `

            <div
                class="picture-zoom-backdrop"
            ></div>

            <div
                class="picture-zoom-card"
            >

                <button
                    class="picture-zoom-close"
                    type="button"
                >
                    ×
                </button>

                <img
                    class="picture-zoom-image"
                    src="${this.escapeAttribute(
                        object.data.image
                    )}"
                    alt="${this.escapeHTML(
                        object.data.originalName ||
                        "Wall picture"
                    )}"
                >

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        let style =
            document.getElementById(
                "house-picture-zoom-style"
            );


        if (!style) {

            style =
                document.createElement(
                    "style"
                );


            style.id =
                "house-picture-zoom-style";


            style.textContent = `

                #house-picture-zoom {

                    position: fixed;

                    inset: 0;

                    z-index: 9999999;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    padding: 30px;

                    box-sizing: border-box;

                }


                .picture-zoom-backdrop {

                    position: absolute;

                    inset: 0;

                    background:
                        rgba(
                            0,
                            0,
                            0,
                            0.72
                        );

                }


                .picture-zoom-card {

                    position: relative;

                    z-index: 2;

                    max-width:
                        90vw;

                    max-height:
                        90vh;

                }


                .picture-zoom-image {

                    display: block;

                    max-width:
                        88vw;

                    max-height:
                        86vh;

                    width:
                        auto;

                    height:
                        auto;

                    object-fit:
                        contain;

                    border:
                        none;

                    padding:
                        0;

                    margin:
                        0;

                    background:
                        transparent;

                    border-radius:
                        12px;

                    box-shadow:
                        0 25px 80px
                        rgba(
                            0,
                            0,
                            0,
                            0.45
                        );

                }


                .picture-zoom-close {

                    position: absolute;

                    top:
                        -18px;

                    right:
                        -18px;

                    width:
                        42px;

                    height:
                        42px;

                    border:
                        none;

                    border-radius:
                        50%;

                    background:
                        white;

                    color:
                        #7d5d70;

                    font-size:
                        28px;

                    cursor:
                        pointer;

                    z-index:
                        5;

                }

            `;


            document.head.appendChild(
                style
            );

        }


        overlay.querySelector(
            ".picture-zoom-close"
        ).addEventListener(
            "click",
            () => {

                this.closePictureZoom();

            }
        );


        overlay.querySelector(
            ".picture-zoom-backdrop"
        ).addEventListener(
            "click",
            () => {

                this.closePictureZoom();

            }
        );


        this.pictureZoom =
            overlay;

    }


    /* =====================================================
       CLOSE PICTURE ZOOM
    ===================================================== */

    closePictureZoom() {

        if (this.pictureZoom) {

            this.pictureZoom.remove();

            this.pictureZoom =
                null;

        }


        if (
            this.pictureZoomKeyHandler
        ) {

            document.removeEventListener(
                "keydown",
                this.pictureZoomKeyHandler
            );

            this.pictureZoomKeyHandler =
                null;

        }

    }


    /* =====================================================
       DELETE
    ===================================================== */

    deletePicture(object) {

        if (!object) {
            return;
        }


        this.closePictureZoom();


        const pictureName =
            object.data.originalName ||
            "this picture";


        const confirmed =
            window.confirm(
                `Delete ${pictureName}?`
            );


        if (!confirmed) {
            return;
        }


        if (object.element) {

            object.element.remove();

        }


        if (
            this.scene.objects &&
            typeof this.scene.objects.delete ===
            "function"
        ) {

            this.scene.objects.delete(
                object.id
            );

        }


        const house =
            this.scene.get(
                this.houseId
            );


        if (
            house &&
            Array.isArray(
                house.children
            )
        ) {

            house.children =
                house.children.filter(
                    child => {

                        const id =
                            typeof child ===
                            "string"
                                ? child
                                : child &&
                                  child.id;

                        return id !==
                            object.id;

                    }
                );

        }


        if (
            this.selectedPicture &&
            this.selectedPicture.id ===
            object.id
        ) {

            this.selectedPicture =
                null;

        }


        this.clearPictureSelectionOutline();


        if (this.deleteButton) {

            this.deleteButton.style.display =
                "none";

        }


        if (this.editorSelected) {

            this.editorSelected.textContent =
                "Nothing selected.";

        }


        this.updateFrameColorSelector(
            null
        );


        console.log(
            "🗑️ Picture removed for current session:",
            object.id
        );

    }


    /* =====================================================
       SCREEN → HOUSE
    ===================================================== */

    screenToHouse(
        clientX,
        clientY
    ) {

        const house =
            this.scene.get(
                this.houseId
            );


        if (
            !house ||
            !house.element
        ) {

            return {
                x: 0,
                y: 0
            };

        }


        const rect =
            house.element
                .getBoundingClientRect();


        const scaleX =
            rect.width /
            house.data.width;


        const scaleY =
            rect.height /
            house.data.height;


        return {

            x:
                (
                    clientX -
                    rect.left
                ) /
                scaleX,

            y:
                (
                    clientY -
                    rect.top
                ) /
                scaleY

        };

    }


    /* =====================================================
       COPY DEMO CONFIG
    ===================================================== */

    copyDemoConfig() {

        const demoObjects =
            Array.from(
                this.scene.objects.values()
            )
            .filter(
                object =>
                    object.data &&
                    object.data.demoPicture
            );


        const config =
            demoObjects.map(
                object => ({

                    id:
                        object.data.id,

                    image:
                        object.data.demoImage ||
                        object.data.image,

                    x:
                        this.roundNumber(
                            object.data.x
                        ),

                    y:
                        this.roundNumber(
                            object.data.y
                        ),

                    width:
                        this.roundNumber(
                            object.data.width
                        ),

                    height:
                        this.roundNumber(
                            object.data.height
                        ),

                    scale:
                        this.roundNumber(
                            object.data.scale
                        ),

                    frameColor:
                        this.getFrameColor(
                            object
                        )

                })
            );


        const output =
            JSON.stringify(
                config,
                null,
                4
            );


        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText ===
            "function"
        ) {

            navigator.clipboard
                .writeText(
                    output
                )
                .then(
                    () => {

                        this.showEditorMessage(
                            "Demo config copied!"
                        );

                    }
                )
                .catch(
                    () => {

                        this.showConfigFallback(
                            output
                        );

                    }
                );

        } else {

            this.showConfigFallback(
                output
            );

        }


        console.log(
            "📋 DEMO CONFIG:"
        );

        console.log(
            output
        );


        return output;

    }


    /* =====================================================
       CONFIG FALLBACK
    ===================================================== */

    showConfigFallback(output) {

        window.prompt(
            "Copy your DEMO_PICTURES config:",
            output
        );

    }


    /* =====================================================
       EDITOR MESSAGE
    ===================================================== */

    showEditorMessage(message) {

        if (!this.editorSelected) {
            return;
        }


        const oldHTML =
            this.editorSelected.innerHTML;


        this.editorSelected.innerHTML =
            `<strong>${this.escapeHTML(
                message
            )}</strong>`;


        setTimeout(
            () => {

                if (
                    this.editorSelected &&
                    document.body.contains(
                        this.editorSelected
                    )
                ) {

                    if (
                        this.selectedPicture
                    ) {

                        this.updateEditorSelection(
                            this.selectedPicture
                        );

                    } else {

                        this.editorSelected.innerHTML =
                            oldHTML;

                    }

                }

            },
            1400
        );

    }


    /* =====================================================
       RESET DEMO PICTURES
    ===================================================== */

    resetDemoPictures() {

        const demoObjects =
            Array.from(
                this.scene.objects.values()
            )
            .filter(
                object =>
                    object.data &&
                    object.data.demoPicture
            );


        demoObjects.forEach(
            object => {

                if (
                    object.element
                ) {

                    object.element.remove();

                }


                if (
                    this.scene.objects &&
                    typeof this.scene.objects.delete ===
                    "function"
                ) {

                    this.scene.objects.delete(
                        object.id
                    );

                }

            }
        );


        const house =
            this.scene.get(
                this.houseId
            );


        if (
            house &&
            Array.isArray(
                house.children
            )
        ) {

            house.children =
                house.children.filter(
                    child => {

                        const id =
                            typeof child ===
                            "string"
                                ? child
                                : child &&
                                  child.id;


                        return !this.demoConfig.some(
                            config =>
                                config.id ===
                                id
                        );

                    }
                );

        }


        this.selectedPicture =
            null;


        this.clearPictureSelectionOutline();


        this.updateFrameColorSelector(
            null
        );


        if (this.deleteButton) {

            this.deleteButton.style.display =
                "none";

        }


        this.createDemoPictures();


        this.showEditorMessage(
            "Demo pictures reset."
        );

    }


    /* =====================================================
       ROUND NUMBER
    ===================================================== */

    roundNumber(value) {

        const number =
            Number(value);


        if (
            !Number.isFinite(
                number
            )
        ) {

            return 0;

        }


        return Math.round(
            number * 100
        ) / 100;

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    escapeHTML(value) {

        return String(value)
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


    /* =====================================================
       ESCAPE ATTRIBUTE
    ===================================================== */

    escapeAttribute(value) {

        return this.escapeHTML(
            value
        );

    }


    /* =====================================================
       MAKE ID
    ===================================================== */

    makePictureId() {

        let id;


        do {

            id =
                "wallPicture_" +
                Date.now() +
                "_" +
                Math.floor(
                    Math.random() *
                    100000
                );


        } while (
            this.scene.objects.has(
                id
            )
        );


        return id;

    }

}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeHouseInteraction() {

    if (!window.scene) {

        console.error(
            "🏠 HouseInteractionSystem: window.scene does not exist."
        );

        return;

    }


    if (window.houseInteraction) {

        return;

    }


    window.houseInteraction =
        new HouseInteractionSystem(
            window.scene
        );


    console.log(
        "🏠 window.houseInteraction READY"
    );

}


initializeHouseInteraction();


window.addEventListener(
    "load",
    () => {

        initializeHouseInteraction();

    },
    {
        once: true
    }
);