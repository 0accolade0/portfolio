
/* =========================================================
   SCENE EDITOR
   ---------------------------------------------------------
   EDIT MODE:

       index.html?edit=true

   FEATURES:

       - Select object
       - Drag object
       - Mouse wheel = scale
       - Shift + wheel = fine scale
       - Arrow keys = move
       - Shift + arrows = larger movement

       - Z INDEX EDITING
       - Z -1
       - Z +1
       - Send to Back
       - Bring to Front
       - Direct Z index input
       - Keyboard Z shortcuts

       - Add asset
       - Duplicate
       - Delete
       - Copy COMPLETE scene.js

       - DRAGGABLE EDITOR PANEL
       - Editor position persistence
       - Reset editor position

   IMPORTANT:

       This file ONLY edits SceneSystem objects.

       It does NOT control:

       - responsive viewport
       - scene rendering
       - house zoom
       - house pictures
       - click actions
       - visibility logic
========================================================= */


/* =========================================================
   EDIT MODE CHECK
========================================================= */

/* =========================================================
   EDIT MODE CHECK
   ---------------------------------------------------------
   PUBLIC BUILD:
   Editor is temporarily disabled.

   To enable editing again later, change:

       const sceneEditorEnabled = false;

   back to:

       const sceneEditorEnabled =
           new URLSearchParams(
               window.location.search
           ).get("edit") === "true";
========================================================= */

// // EDITOR DISABLED FOR PUBLIC BUILD
// const sceneEditorEnabled = false;

const sceneEditorEnabled =
           new URLSearchParams(
               window.location.search
           ).get("edit") === "true";

/* =========================================================
   EDITOR POSITION STORAGE
========================================================= */

const SCENE_EDITOR_POSITION_KEY =
    "sceneEditorPanelPosition_v1";


/* =========================================================
   SCENE EDITOR
========================================================= */

class SceneEditor {

    constructor(scene) {

        this.scene = scene;

        this.selectedObject = null;

        this.dragging = false;

        this.dragStartMouseX = 0;
        this.dragStartMouseY = 0;

        this.dragStartObjectX = 0;
        this.dragStartObjectY = 0;

        this.panel = null;
        this.fileInput = null;

        /* ---------------------------------------------
           EDITOR PANEL DRAGGING
        --------------------------------------------- */

        this.panelDragging = false;

        this.panelDragStartMouseX = 0;
        this.panelDragStartMouseY = 0;

        this.panelStartLeft = 0;
        this.panelStartTop = 0;

        this.injectStyles();
        this.createUI();

        this.bindObjectEvents();
        this.bindKeyboard();

        this.refreshObjectEvents();
        this.refreshWheelEvents();


        console.log(
            "================================"
        );

        console.log(
            "🛠️ SCENE EDITOR INITIALIZED"
        );

        console.log(
            "================================"
        );

        console.log(
            "🛠️ EDITOR READY — objects:",
            this.scene.objects
                ? this.scene.objects.size
                : 0
        );
    }


    /* =====================================================
       GET SCENE ELEMENT
    ===================================================== */

    getSceneElement() {

        if (
            this.scene &&
            this.scene.sceneElement
        ) {

            return this.scene.sceneElement;
        }


        if (
            this.scene &&
            this.scene.scene
        ) {

            return this.scene.scene;
        }


        if (
            this.scene &&
            this.scene.container
        ) {

            return this.scene.container;
        }


        const selectors = [

            "#scene",
            ".scene",
            "#scene-container",
            ".scene-container",
            "[data-scene]"

        ];


        for (const selector of selectors) {

            const element =
                document.querySelector(selector);


            if (element) {

                return element;
            }
        }


        return null;
    }


    /* =====================================================
       STYLES
    ===================================================== */

    injectStyles() {

        if (
            document.getElementById(
                "scene-editor-styles"
            )
        ) {

            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "scene-editor-styles";


        style.textContent = `

            /* =================================================
               EDITOR PANEL
            ================================================= */

            #scene-editor-panel {

                position: fixed;

                top: 20px;

                right: 20px;

                left: auto;

                z-index: 1000000;

                width: 250px;

                max-height:
                    calc(100vh - 40px);

                overflow-y:
                    auto;

                padding: 14px;

                box-sizing: border-box;

                border-radius: 14px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.94
                    );

                box-shadow:
                    0 10px 35px
                    rgba(
                        0,
                        0,
                        0,
                        0.18
                    );

                font-family:
                    Arial,
                    sans-serif;

                color:
                    #333;

                user-select:
                    none;
            }


            /* =================================================
               DRAG HEADER
            ================================================= */

            #scene-editor-drag-handle {

                display:
                    flex;

                align-items:
                    center;

                justify-content:
                    space-between;

                gap:
                    8px;

                margin:
                    -14px -14px 12px -14px;

                padding:
                    11px 12px;

                border-radius:
                    14px 14px 0 0;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.055
                    );

                cursor:
                    grab;

                user-select:
                    none;

                touch-action:
                    none;
            }


            #scene-editor-drag-handle:active {

                cursor:
                    grabbing;
            }


            #scene-editor-drag-title {

                display:
                    flex;

                align-items:
                    center;

                gap:
                    6px;

                font-size:
                    14px;

                font-weight:
                    700;
            }


            #scene-editor-drag-handle-icon {

                font-size:
                    15px;

                opacity:
                    0.65;
            }


            #scene-editor-drag-handle-text {

                white-space:
                    nowrap;
            }


            #scene-editor-reset-position {

                border:
                    none;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.75
                    );

                color:
                    #555;

                border-radius:
                    6px;

                padding:
                    4px 7px;

                font-size:
                    10px;

                font-weight:
                    600;

                cursor:
                    pointer;

                flex-shrink:
                    0;
            }


            #scene-editor-reset-position:hover {

                background:
                    #ffffff;
            }


            #scene-editor-panel h3 {

                display:
                    none;

                margin:
                    0 0 10px 0;

                font-size:
                    15px;
            }


            #scene-editor-selected {

                margin-bottom:
                    10px;

                padding:
                    8px;

                border-radius:
                    8px;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.05
                    );

                font-size:
                    12px;

                overflow:
                    hidden;

                text-overflow:
                    ellipsis;

                white-space:
                    nowrap;
            }


            .scene-editor-button {

                width:
                    100%;

                border:
                    none;

                border-radius:
                    8px;

                padding:
                    9px 10px;

                margin:
                    4px 0;

                background:
                    #f1f1f1;

                color:
                    #333;

                font-size:
                    12px;

                font-weight:
                    600;

                cursor:
                    pointer;
            }


            .scene-editor-button:hover {

                background:
                    #e4e4e4;
            }


            .scene-editor-button.danger {

                background:
                    #f5dede;
            }


            .scene-editor-button.danger:hover {

                background:
                    #edcccc;
            }


            /* =================================================
               Z INDEX CONTROLS
            ================================================= */

            #scene-editor-z-section {

                margin:
                    10px 0;

                padding:
                    10px;

                border-radius:
                    10px;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.035
                    );
            }


            #scene-editor-z-title {

                font-size:
                    12px;

                font-weight:
                    700;

                margin-bottom:
                    7px;
            }


            #scene-editor-z-row {

                display:
                    flex;

                align-items:
                    center;

                gap:
                    5px;

                margin-bottom:
                    6px;
            }


            #scene-editor-z-input {

                flex:
                    1;

                min-width:
                    0;

                box-sizing:
                    border-box;

                border:
                    1px solid
                    #d5d5d5;

                border-radius:
                    7px;

                padding:
                    8px;

                background:
                    #fff;

                color:
                    #333;

                font-size:
                    12px;

                text-align:
                    center;

                outline:
                    none;
            }


            #scene-editor-z-input:focus {

                border-color:
                    #999;
            }


            .scene-editor-z-small {

                flex:
                    1;

                width:
                    auto;

                margin:
                    0;
            }


            .scene-editor-z-wide {

                width:
                    100%;

                margin:
                    3px 0;
            }


            #scene-editor-info {

                margin-top:
                    10px;

                font-size:
                    11px;

                line-height:
                    1.5;

                opacity:
                    0.7;
            }


            .scene-editor-selected {

                outline:
                    2px dashed
                    rgba(
                        255,
                        80,
                        150,
                        0.9
                    );

                outline-offset:
                    3px;
            }


            #scene-editor-file {

                display:
                    none;
            }


            .scene-object.scene-editor-touch {

                touch-action:
                    none;
            }

        `;


        document.head.appendChild(style);
    }


    /* =====================================================
       CREATE UI
    ===================================================== */

    createUI() {

        const existing =
            document.getElementById(
                "scene-editor-panel"
            );


        if (existing) {

            existing.remove();
        }


        this.panel =
            document.createElement("div");


        this.panel.id =
            "scene-editor-panel";


        this.panel.innerHTML = `

            <!-- =============================================
                 DRAGGABLE EDITOR HEADER
            ============================================== -->

            <div
                id="scene-editor-drag-handle"
                title="Drag editor"
            >

                <div id="scene-editor-drag-title">

                    <span id="scene-editor-drag-handle-icon">
                        ⠿
                    </span>

                    <span id="scene-editor-drag-handle-text">
                        🛠️ Scene Editor
                    </span>

                </div>


                <button
                    id="scene-editor-reset-position"
                    type="button"
                    title="Reset editor position"
                >
                    Reset
                </button>

            </div>


            <div id="scene-editor-selected">
                Nothing selected
            </div>


            <!-- =============================================
                 Z INDEX CONTROLS
            ============================================== -->

            <div id="scene-editor-z-section">

                <div id="scene-editor-z-title">
                    Layer / Z Index
                </div>

                <div id="scene-editor-z-row">

                    <button
                        id="scene-editor-z-down"
                        class="scene-editor-button scene-editor-z-small"
                    >
                        −1
                    </button>

                    <input
                        id="scene-editor-z-input"
                        type="number"
                        step="1"
                        value="0"
                    >

                    <button
                        id="scene-editor-z-up"
                        class="scene-editor-button scene-editor-z-small"
                    >
                        +1
                    </button>

                </div>


                <button
                    id="scene-editor-z-back"
                    class="scene-editor-button scene-editor-z-wide"
                >
                    Send to Back
                </button>


                <button
                    id="scene-editor-z-front"
                    class="scene-editor-button scene-editor-z-wide"
                >
                    Bring to Front
                </button>

            </div>


            <button
                id="scene-editor-add"
                class="scene-editor-button"
            >
                + Add Asset
            </button>


            <button
                id="scene-editor-duplicate"
                class="scene-editor-button"
            >
                Duplicate
            </button>


            <button
                id="scene-editor-delete"
                class="scene-editor-button danger"
            >
                Delete
            </button>


            <button
                id="scene-editor-copy"
                class="scene-editor-button"
            >
                📋 Copy Full scene.js
            </button>


            <div id="scene-editor-info">

                Drag = Move<br>
                Wheel = Scale<br>
                Shift + Wheel = Fine Scale<br>
                Arrow Keys = Move<br>
                Shift + Arrow = Large Move<br>
                [ = Z −1<br>
                ] = Z +1<br>
                Shift + [ = Send Back<br>
                Shift + ] = Bring Front<br>
                Click empty space = Deselect<br>
                <br>
                🖐️ Drag the editor header to move it

            </div>
        `;


        document.body.appendChild(
            this.panel
        );


        /*
            Prevent clicks inside the editor
            from reaching the scene.
        */

        this.panel.addEventListener(
            "pointerdown",
            event => {

                event.stopPropagation();
            }
        );


        /* =================================================
           BIND EDITOR PANEL DRAGGING
        ================================================= */

        this.bindPanelDragging();


        /* =================================================
           FILE INPUT
        ================================================= */

        this.fileInput =
            document.createElement("input");


        this.fileInput.type =
            "file";


        this.fileInput.accept =
            "image/*";


        this.fileInput.id =
            "scene-editor-file";


        document.body.appendChild(
            this.fileInput
        );


        /* =================================================
           BUTTON REFERENCES
        ================================================= */

        const addButton =
            this.panel.querySelector(
                "#scene-editor-add"
            );


        const duplicateButton =
            this.panel.querySelector(
                "#scene-editor-duplicate"
            );


        const deleteButton =
            this.panel.querySelector(
                "#scene-editor-delete"
            );


        const copyButton =
            this.panel.querySelector(
                "#scene-editor-copy"
            );


        const zDownButton =
            this.panel.querySelector(
                "#scene-editor-z-down"
            );


        const zUpButton =
            this.panel.querySelector(
                "#scene-editor-z-up"
            );


        const zBackButton =
            this.panel.querySelector(
                "#scene-editor-z-back"
            );


        const zFrontButton =
            this.panel.querySelector(
                "#scene-editor-z-front"
            );


        const zInput =
            this.panel.querySelector(
                "#scene-editor-z-input"
            );


        const resetPositionButton =
            this.panel.querySelector(
                "#scene-editor-reset-position"
            );


        /* =================================================
           BUTTON EVENTS
        ================================================= */

        addButton.addEventListener(
            "click",
            () => {

                this.fileInput.click();
            }
        );


        duplicateButton.addEventListener(
            "click",
            () => {

                this.duplicateSelected();
            }
        );


        deleteButton.addEventListener(
            "click",
            () => {

                this.deleteSelected();
            }
        );


        copyButton.addEventListener(
            "click",
            () => {

                this.copyConfig();
            }
        );


        /* ---------------------------------------------
           Z -1
        --------------------------------------------- */

        zDownButton.addEventListener(
            "click",
            () => {

                this.changeZ(
                    -1
                );
            }
        );


        /* ---------------------------------------------
           Z +1
        --------------------------------------------- */

        zUpButton.addEventListener(
            "click",
            () => {

                this.changeZ(
                    1
                );
            }
        );


        /* ---------------------------------------------
           SEND TO BACK
        --------------------------------------------- */

        zBackButton.addEventListener(
            "click",
            () => {

                this.sendToBack();
            }
        );


        /* ---------------------------------------------
           BRING TO FRONT
        --------------------------------------------- */

        zFrontButton.addEventListener(
            "click",
            () => {

                this.bringToFront();
            }
        );


        /* ---------------------------------------------
           DIRECT Z INPUT
        --------------------------------------------- */

        zInput.addEventListener(
            "change",
            () => {

                this.setZ(
                    zInput.value
                );
            }
        );


        zInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    this.setZ(
                        zInput.value
                    );

                    zInput.blur();
                }
            }
        );


        /* ---------------------------------------------
           RESET PANEL POSITION
        --------------------------------------------- */

        resetPositionButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                this.resetPanelPosition();
            }
        );


        /* =================================================
           FILE INPUT
        ================================================= */

        this.fileInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files &&
                    event.target.files[0];


                if (!file) {

                    return;
                }


                this.addAsset(file);


                this.fileInput.value = "";
            }
        );


        /* =================================================
           RESTORE SAVED PANEL POSITION
        ================================================= */

        this.restorePanelPosition();
    }


    /* =====================================================
       BIND PANEL DRAGGING
       -----------------------------------------------------
       Only the header drags the editor.

       This means:

       - Buttons remain clickable
       - Inputs remain usable
       - Scene objects remain untouched
       - Panel can be moved anywhere
    ===================================================== */

    bindPanelDragging() {

        if (!this.panel) {

            return;
        }


        const handle =
            this.panel.querySelector(
                "#scene-editor-drag-handle"
            );


        if (!handle) {

            return;
        }


        handle.addEventListener(
            "pointerdown",
            event => {

                /*
                    Do NOT start dragging when the
                    Reset button is clicked.
                */

                if (
                    event.target &&
                    event.target.closest &&
                    event.target.closest(
                        "#scene-editor-reset-position"
                    )
                ) {

                    return;
                }


                event.preventDefault();

                event.stopPropagation();


                this.panelDragging = true;


                this.panelDragStartMouseX =
                    event.clientX;


                this.panelDragStartMouseY =
                    event.clientY;


                const rect =
                    this.panel.getBoundingClientRect();


                this.panelStartLeft =
                    rect.left;


                this.panelStartTop =
                    rect.top;


                /*
                    Switch from right positioning
                    to explicit left/top positioning.
                */

                this.panel.style.right =
                    "auto";


                this.panel.style.left =
                    `${rect.left}px`;


                this.panel.style.top =
                    `${rect.top}px`;


                try {

                    handle.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                    /* Ignore */
                }
            }
        );


        handle.addEventListener(
            "pointermove",
            event => {

                if (!this.panelDragging) {

                    return;
                }


                event.preventDefault();

                event.stopPropagation();


                const deltaX =
                    event.clientX -
                    this.panelDragStartMouseX;


                const deltaY =
                    event.clientY -
                    this.panelDragStartMouseY;


                let newLeft =
                    this.panelStartLeft +
                    deltaX;


                let newTop =
                    this.panelStartTop +
                    deltaY;


                /*
                    Keep at least a small part of
                    the editor inside the screen.
                */

                const rect =
                    this.panel.getBoundingClientRect();


                const minimumVisible =
                    40;


                const maxLeft =
                    window.innerWidth -
                    minimumVisible;


                const maxTop =
                    window.innerHeight -
                    minimumVisible;


                newLeft =
                    Math.max(
                        -rect.width + minimumVisible,
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


                this.panel.style.left =
                    `${newLeft}px`;


                this.panel.style.top =
                    `${newTop}px`;
            }
        );


        const stopDragging =
            event => {

                if (!this.panelDragging) {

                    return;
                }


                this.panelDragging = false;


                try {

                    handle.releasePointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                    /* Ignore */
                }


                this.savePanelPosition();


                console.log(
                    "🖐️ Editor panel moved:",
                    this.panel.style.left,
                    this.panel.style.top
                );
            };


        handle.addEventListener(
            "pointerup",
            stopDragging
        );


        handle.addEventListener(
            "pointercancel",
            stopDragging
        );
    }


    /* =====================================================
       SAVE PANEL POSITION
    ===================================================== */

    savePanelPosition() {

        if (!this.panel) {

            return;
        }


        const left =
            parseFloat(
                this.panel.style.left
            );


        const top =
            parseFloat(
                this.panel.style.top
            );


        if (
            !Number.isFinite(left) ||
            !Number.isFinite(top)
        ) {

            return;
        }


        try {

            localStorage.setItem(
                SCENE_EDITOR_POSITION_KEY,
                JSON.stringify({
                    left: left,
                    top: top
                })
            );

        } catch (error) {

            console.warn(
                "⚠️ Could not save editor position:",
                error
            );
        }
    }


    /* =====================================================
       RESTORE PANEL POSITION
    ===================================================== */

    restorePanelPosition() {

        if (!this.panel) {

            return;
        }


        let saved = null;


        try {

            const raw =
                localStorage.getItem(
                    SCENE_EDITOR_POSITION_KEY
                );


            if (raw) {

                saved =
                    JSON.parse(raw);
            }

        } catch (error) {

            console.warn(
                "⚠️ Could not restore editor position:",
                error
            );
        }


        if (
            !saved ||
            !Number.isFinite(
                Number(saved.left)
            ) ||
            !Number.isFinite(
                Number(saved.top)
            )
        ) {

            return;
        }


        const panelWidth =
            this.panel.offsetWidth || 250;


        const panelHeight =
            this.panel.offsetHeight || 400;


        let left =
            Number(saved.left);


        let top =
            Number(saved.top);


        /*
            Keep the restored panel on screen
            if the browser window changed size.
        */

        const minimumVisible =
            40;


        const maxLeft =
            window.innerWidth -
            minimumVisible;


        const maxTop =
            window.innerHeight -
            minimumVisible;


        left =
            Math.max(
                -panelWidth + minimumVisible,
                Math.min(
                    left,
                    maxLeft
                )
            );


        top =
            Math.max(
                0,
                Math.min(
                    top,
                    Math.max(
                        0,
                        maxTop
                    )
                )
            );


        this.panel.style.right =
            "auto";


        this.panel.style.left =
            `${left}px`;


        this.panel.style.top =
            `${top}px`;
    }


    /* =====================================================
       RESET PANEL POSITION
    ===================================================== */

    resetPanelPosition() {

        if (!this.panel) {

            return;
        }


        try {

            localStorage.removeItem(
                SCENE_EDITOR_POSITION_KEY
            );

        } catch (error) {

            /* Ignore */
        }


        this.panel.style.left =
            "auto";


        this.panel.style.top =
            "20px";


        this.panel.style.right =
            "20px";


        console.log(
            "↩️ Editor panel position reset"
        );
    }


    /* =====================================================
       OBJECT EVENTS
    ===================================================== */

    bindObjectEvents() {

        const sceneElement =
            this.getSceneElement();


        if (!sceneElement) {

            console.warn(
                "⚠️ SceneEditor: scene element not found yet."
            );

            return;
        }


        if (
            sceneElement.dataset.sceneEditorBound ===
            "true"
        ) {

            return;
        }


        sceneElement.dataset.sceneEditorBound =
            "true";


        sceneElement.addEventListener(
            "pointerdown",
            event => {

                if (
                    event.target ===
                    sceneElement
                ) {

                    this.selectObject(null);
                }
            }
        );
    }


    /* =====================================================
       REFRESH OBJECT EVENTS
    ===================================================== */

    refreshObjectEvents() {

        if (
            !this.scene ||
            !this.scene.objects
        ) {

            return;
        }


        this.bindObjectEvents();


        for (
            const object
            of this.scene.objects.values()
        ) {

            /*
               WALL PICTURES BELONG TO
               HouseInteractionSystem.

               Do NOT attach SceneEditor
               drag / wheel listeners to them.
            */

            if (
                object.data &&
                object.data.wallPicture
            ) {

                continue;
            }


            this.bindObjectToEditor(
                object
            );
        }
    }


    /* =====================================================
       BIND OBJECT
    ===================================================== */

    bindObjectToEditor(object) {

        if (
            !object ||
            !object.element
        ) {

            return;
        }


        object.element.classList.add(
            "scene-editor-touch"
        );


        if (
            object.element.dataset.editorBound ===
            "true"
        ) {

            this.bindWheel(object);

            return;
        }


        object.element.dataset.editorBound =
            "true";


        object.element.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                event.stopPropagation();


                this.selectObject(object);


                this.startDrag(
                    object,
                    event
                );
            }
        );


        this.bindWheel(object);
    }


    /* =====================================================
       SELECT OBJECT
    ===================================================== */

    selectObject(object) {

        if (
            this.selectedObject &&
            this.selectedObject.element
        ) {

            this.selectedObject.element.classList.remove(
                "scene-editor-selected"
            );
        }


        this.selectedObject =
            object || null;


        if (
            this.selectedObject &&
            this.selectedObject.element
        ) {

            this.selectedObject.element.classList.add(
                "scene-editor-selected"
            );
        }


        this.updateSelectedLabel();


        this.updateZInput();


        console.log(
            "🎯 Editor selection:",
            object
                ? object.id
                : "none"
        );
    }


    /* =====================================================
       SELECTED LABEL
    ===================================================== */

    updateSelectedLabel() {

        if (!this.panel) {

            return;
        }


        const label =
            this.panel.querySelector(
                "#scene-editor-selected"
            );


        if (!label) {

            return;
        }


        if (!this.selectedObject) {

            label.textContent =
                "Nothing selected";

            return;
        }


        const z =
            Number(
                this.selectedObject.data?.z || 0
            );


        label.textContent =
            `${this.selectedObject.id}  •  Z ${z}`;
    }


    /* =====================================================
       UPDATE Z INPUT
    ===================================================== */

    updateZInput() {

        if (!this.panel) {

            return;
        }


        const input =
            this.panel.querySelector(
                "#scene-editor-z-input"
            );


        if (!input) {

            return;
        }


        if (!this.selectedObject) {

            input.value = "0";

            return;
        }


        const z =
            Number(
                this.selectedObject.data?.z || 0
            );


        input.value =
            Number.isFinite(z)
                ? z
                : 0;
    }


    /* =====================================================
       SET Z
    ===================================================== */

    setZ(z) {

        if (!this.selectedObject) {

            console.warn(
                "⚠️ Nothing selected for Z change"
            );

            return;
        }


        z =
            Number(z);


        if (!Number.isFinite(z)) {

            z = 0;
        }


        z =
            Math.round(z);


        const object =
            this.selectedObject;


        if (object.data) {

            object.data.z =
                z;
        }


        if (object.element) {

            object.element.style.zIndex =
                String(z);
        }


        const possibleMethods = [

            "setZ",
            "setZIndex",
            "setLayer",
            "setDepth"

        ];


        for (
            const method
            of possibleMethods
        ) {

            if (
                typeof this.scene?.[method] ===
                "function"
            ) {

                try {

                    this.scene[method](
                        object.id,
                        z
                    );

                    break;

                } catch (error) {

                    try {

                        this.scene[method](
                            object,
                            z
                        );

                        break;

                    } catch (secondError) {

                        console.warn(
                            `⚠️ SceneSystem.${method} failed:`,
                            secondError
                        );
                    }
                }
            }
        }


        if (object.element) {

            object.element.style.zIndex =
                String(z);
        }


        this.syncObjectData(
            object
        );


        this.updateSelectedLabel();

        this.updateZInput();


        console.log(
            "📚 Z changed:",
            object.id,
            "→",
            z
        );
    }


    /* =====================================================
       CHANGE Z
    ===================================================== */

    changeZ(amount) {

        if (!this.selectedObject) {

            console.warn(
                "⚠️ Nothing selected for Z change"
            );

            return;
        }


        const currentZ =
            Number(
                this.selectedObject.data?.z || 0
            );


        const newZ =
            currentZ +
            Number(amount || 0);


        this.setZ(
            newZ
        );
    }


    /* =====================================================
       SEND TO BACK
    ===================================================== */

    sendToBack() {

        if (!this.selectedObject) {

            console.warn(
                "⚠️ Nothing selected"
            );

            return;
        }


        let lowest =
            this.getLowestZ();


        lowest =
            lowest - 1;


        this.setZ(
            lowest
        );


        console.log(
            "⬇️ Sent to back:",
            this.selectedObject.id,
            "→ Z",
            lowest
        );
    }


    /* =====================================================
       BRING TO FRONT
    ===================================================== */

    bringToFront() {

        if (!this.selectedObject) {

            console.warn(
                "⚠️ Nothing selected"
            );

            return;
        }


        const highest =
            this.getHighestZ();


        const newZ =
            highest + 1;


        this.setZ(
            newZ
        );
    }


    /* =====================================================
       LOWEST Z
    ===================================================== */

    getLowestZ() {

        let lowest = 0;


        if (
            !this.scene ||
            !this.scene.objects
        ) {

            return lowest;
        }


        let found =
            false;


        for (
            const object
            of this.scene.objects.values()
        ) {

            if (
                !object ||
                !object.data
            ) {

                continue;
            }


            const z =
                Number(
                    object.data.z
                );


            if (
                !Number.isFinite(z)
            ) {

                continue;
            }


            if (
                !found ||
                z < lowest
            ) {

                lowest =
                    z;

                found =
                    true;
            }
        }


        return found
            ? lowest
            : 0;
    }


    /* =====================================================
       START DRAG OBJECT
    ===================================================== */

    startDrag(
        object,
        event
    ) {

        if (!object) {

            return;
        }


        this.dragging = true;


        this.dragStartMouseX =
            event.clientX;


        this.dragStartMouseY =
            event.clientY;


        this.dragStartObjectX =
            Number(
                object.data?.x || 0
            );


        this.dragStartObjectY =
            Number(
                object.data?.y || 0
            );


        try {

            object.element.setPointerCapture(
                event.pointerId
            );

        } catch (error) {

            /* Ignore */
        }


        const moveHandler =
            moveEvent => {

                if (!this.dragging) {

                    return;
                }


                this.dragObject(
                    object,
                    moveEvent
                );
            };


        const upHandler =
            upEvent => {

                this.dragging = false;


                try {

                    object.element.releasePointerCapture(
                        upEvent.pointerId
                    );

                } catch (error) {

                    /* Ignore */
                }


                object.element.removeEventListener(
                    "pointermove",
                    moveHandler
                );


                object.element.removeEventListener(
                    "pointerup",
                    upHandler
                );


                object.element.removeEventListener(
                    "pointercancel",
                    upHandler
                );


                this.syncObjectData(object);


                console.log(
                    "📍 Moved:",
                    object.id,
                    object.data.x,
                    object.data.y
                );
            };


        object.element.addEventListener(
            "pointermove",
            moveHandler
        );


        object.element.addEventListener(
            "pointerup",
            upHandler
        );


        object.element.addEventListener(
            "pointercancel",
            upHandler
        );
    }


    /* =====================================================
       DRAG OBJECT
    ===================================================== */

    dragObject(
        object,
        event
    ) {

        if (!object) {

            return;
        }


        const scale =
            Number(
                this.scene.viewportScale || 1
            );


        const safeScale =
            scale > 0
                ? scale
                : 1;


        const deltaX =
            (
                event.clientX -
                this.dragStartMouseX
            ) / safeScale;


        const deltaY =
            (
                event.clientY -
                this.dragStartMouseY
            ) / safeScale;


        const newX =
            this.dragStartObjectX +
            deltaX;


        const newY =
            this.dragStartObjectY +
            deltaY;


        this.moveObject(
            object,
            newX,
            newY
        );
    }


    /* =====================================================
       MOVE OBJECT
    ===================================================== */

    moveObject(
        object,
        x,
        y
    ) {

        if (!object) {

            return;
        }


        x = Number(x) || 0;
        y = Number(y) || 0;


        if (
            typeof this.scene.move ===
            "function"
        ) {

            try {

                this.scene.move(
                    object.id,
                    x,
                    y
                );

            } catch (error) {

                try {

                    this.scene.move(
                        object,
                        x,
                        y
                    );

                } catch (secondError) {

                    console.warn(
                        "⚠️ SceneSystem.move failed:",
                        secondError
                    );
                }
            }
        }


        if (object.data) {

            object.data.x = x;
            object.data.y = y;
        }
    }


    /* =====================================================
       WHEEL SCALE
    ===================================================== */

    bindWheel(object) {

        if (
            !object ||
            !object.element
        ) {

            return;
        }


        if (
            object.element.dataset.editorWheelBound ===
            "true"
        ) {

            return;
        }


        object.element.dataset.editorWheelBound =
            "true";


        object.element.addEventListener(
            "wheel",
            event => {

                event.preventDefault();

                event.stopPropagation();


                this.selectObject(object);


                let currentScale =
                    Number(
                        object.data?.scale || 1
                    );


                if (!Number.isFinite(currentScale)) {

                    currentScale = 1;
                }


                let amount =
                    event.deltaY < 0
                        ? 0.05
                        : -0.05;


                if (event.shiftKey) {

                    amount =
                        event.deltaY < 0
                            ? 0.01
                            : -0.01;
                }


                currentScale += amount;


                currentScale =
                    Math.max(
                        0.05,
                        currentScale
                    );


                this.scaleObject(
                    object,
                    currentScale
                );


                console.log(
                    "🔎 Scale:",
                    object.id,
                    currentScale
                );
            },
            {
                passive: false
            }
        );
    }


    /* =====================================================
       SCALE OBJECT
    ===================================================== */

    scaleObject(
        object,
        scale
    ) {

        if (!object) {

            return;
        }


        scale =
            Math.max(
                0.05,
                Number(scale) || 1
            );


        if (
            typeof this.scene.scaleObject ===
            "function"
        ) {

            try {

                this.scene.scaleObject(
                    object.id,
                    scale
                );

            } catch (error) {

                try {

                    this.scene.scaleObject(
                        object,
                        scale
                    );

                } catch (secondError) {

                    console.warn(
                        "⚠️ SceneSystem.scaleObject failed:",
                        secondError
                    );
                }
            }
        }


        if (object.data) {

            object.data.scale =
                scale;
        }
    }


    /* =====================================================
       REFRESH WHEEL EVENTS
    ===================================================== */

    refreshWheelEvents() {

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

            this.bindWheel(object);
        }
    }


    /* =====================================================
       KEYBOARD
    ===================================================== */

    bindKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                if (!this.selectedObject) {

                    return;
                }


                const target =
                    event.target;


                const tag =
                    target &&
                    target.tagName
                        ? target.tagName.toLowerCase()
                        : "";


                if (
                    tag === "input" ||
                    tag === "textarea" ||
                    tag === "select" ||
                    tag === "button" ||
                    target?.isContentEditable
                ) {

                    return;
                }


                const object =
                    this.selectedObject;


                /* =========================================
                   Z INDEX SHORTCUTS
                ========================================== */

                if (
                    event.key === "[" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    this.changeZ(
                        -1
                    );

                    return;
                }


                if (
                    event.key === "]" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    this.changeZ(
                        1
                    );

                    return;
                }


                if (
                    event.key === "[" &&
                    event.shiftKey
                ) {

                    event.preventDefault();

                    this.sendToBack();

                    return;
                }


                if (
                    event.key === "]" &&
                    event.shiftKey
                ) {

                    event.preventDefault();

                    this.bringToFront();

                    return;
                }


                /* =========================================
                   POSITION
                ========================================== */

                let amount =
                    event.shiftKey
                        ? 10
                        : 1;


                let x =
                    Number(
                        object.data?.x || 0
                    );


                let y =
                    Number(
                        object.data?.y || 0
                    );


                let changed =
                    false;


                switch (event.key) {

                    case "ArrowLeft":

                        x -= amount;
                        changed = true;

                        break;


                    case "ArrowRight":

                        x += amount;
                        changed = true;

                        break;


                    case "ArrowUp":

                        y -= amount;
                        changed = true;

                        break;


                    case "ArrowDown":

                        y += amount;
                        changed = true;

                        break;


                    default:

                        return;
                }


                if (!changed) {

                    return;
                }


                event.preventDefault();


                this.moveObject(
                    object,
                    x,
                    y
                );
            }
        );
    }


    /* =====================================================
       ADD ASSET
    ===================================================== */

    addAsset(file) {

        if (!file) {

            return;
        }


        if (
            !file.type.startsWith("image/")
        ) {

            console.warn(
                "⚠️ File is not an image"
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                const image =
                    event.target.result;


                const id =
                    this.generateAssetId(
                        file.name
                    );


                const sceneWidth =
                    this.scene.config &&
                    this.scene.config.width
                        ? this.scene.config.width
                        : 1920;


                const sceneHeight =
                    this.scene.config &&
                    this.scene.config.height
                        ? this.scene.config.height
                        : 1080;


                const data = {

                    id: id,

                    image: image,

                    x:
                        sceneWidth / 2,

                    y:
                        sceneHeight / 2,

                    width:
                        300,

                    height:
                        300,

                    scale:
                        1,

                    rotation:
                        0,

                    opacity:
                        1,

                    z:
                        this.getHighestZ() + 1,

                    states: [
                        "outside",
                        "inside"
                    ]
                };


                let object = null;


                if (
                    typeof this.scene.addObject ===
                    "function"
                ) {

                    object =
                        this.scene.addObject(data);

                } else if (
                    typeof this.scene.createObject ===
                    "function"
                ) {

                    object =
                        this.scene.createObject(data);
                }


                if (!object) {

                    console.error(
                        "❌ Could not create asset"
                    );

                    return;
                }


                if (
                    this.scene.objects &&
                    object.id
                ) {

                    if (
                        typeof this.scene.objects.has ===
                        "function" &&
                        !this.scene.objects.has(
                            object.id
                        )
                    ) {

                        this.scene.objects.set(
                            object.id,
                            object
                        );
                    }
                }


                this.syncObjectData(object);

                this.bindObjectToEditor(object);

                this.bindWheel(object);

                this.selectObject(object);


                console.log(
                    "➕ Added asset:",
                    id
                );


                console.log(
                    "📦 Total objects:",
                    this.scene.objects
                        ? this.scene.objects.size
                        : "unknown"
                );
            };


        reader.readAsDataURL(file);
    }


    /* =====================================================
       DUPLICATE
    ===================================================== */

    duplicateSelected() {

        if (!this.selectedObject) {

            console.warn(
                "⚠️ Nothing selected to duplicate"
            );

            return;
        }


        const source =
            this.selectedObject;


        this.syncObjectData(source);


        const copy =
            JSON.parse(
                JSON.stringify(
                    source.data
                )
            );


        copy.id =
            this.generateDuplicateId(
                source.id
            );


        copy.x =
            Number(copy.x || 0) + 40;


        copy.y =
            Number(copy.y || 0) + 40;


        copy.z =
            Number(copy.z || 0) + 1;


        let duplicate = null;


        if (
            typeof this.scene.addObject ===
            "function"
        ) {

            duplicate =
                this.scene.addObject(copy);

        } else if (
            typeof this.scene.createObject ===
            "function"
        ) {

            duplicate =
                this.scene.createObject(copy);
        }


        if (!duplicate) {

            console.error(
                "❌ Could not duplicate object"
            );

            return;
        }


        if (
            this.scene.objects &&
            duplicate.id
        ) {

            if (
                typeof this.scene.objects.has ===
                "function" &&
                !this.scene.objects.has(
                    duplicate.id
                )
            ) {

                this.scene.objects.set(
                    duplicate.id,
                    duplicate
                );
            }
        }


        if (
            copy.parent &&
            typeof this.scene.get ===
            "function"
        ) {

            const parent =
                this.scene.get(
                    copy.parent
                );


            if (
                parent &&
                typeof this.scene.attachChild ===
                "function"
            ) {

                this.scene.attachChild(
                    duplicate,
                    parent
                );
            }
        }


        if (
            source.manualVisible !== null &&
            source.manualVisible !== undefined
        ) {

            duplicate.manualVisible =
                source.manualVisible;


            if (
                typeof this.scene
                    .refreshObjectVisibility ===
                "function"
            ) {

                this.scene.refreshObjectVisibility(
                    duplicate
                );
            }
        }


        this.syncObjectData(
            duplicate
        );

        this.bindObjectToEditor(
            duplicate
        );

        this.bindWheel(
            duplicate
        );

        this.selectObject(
            duplicate
        );


        console.log(
            "📑 Duplicated:",
            source.id,
            "→",
            duplicate.id,
            "Z:",
            duplicate.data?.z
        );


        console.log(
            "📦 Total objects:",
            this.scene.objects
                ? this.scene.objects.size
                : "unknown"
        );
    }


    /* =====================================================
       DELETE
    ===================================================== */

    deleteSelected() {

        if (!this.selectedObject) {

            console.warn(
                "⚠️ Nothing selected to delete"
            );

            return;
        }


        const object =
            this.selectedObject;


        console.log(
            "🗑️ Delete:",
            object.id
        );


        if (
            typeof this.scene.deleteObject ===
            "function"
        ) {

            try {

                this.scene.deleteObject(
                    object.id
                );

            } catch (error) {

                try {

                    this.scene.deleteObject(
                        object
                    );

                } catch (secondError) {

                    console.error(
                        "❌ Could not delete object:",
                        secondError
                    );

                    return;
                }
            }

        } else if (
            this.scene.objects &&
            typeof this.scene.objects.delete ===
            "function"
        ) {

            if (object.element) {

                object.element.remove();
            }


            this.scene.objects.delete(
                object.id
            );
        }


        if (
            object.element &&
            object.element.isConnected
        ) {

            object.element.remove();
        }


        this.selectObject(null);


        console.log(
            "📦 Remaining objects:",
            this.scene.objects
                ? this.scene.objects.size
                : "unknown"
        );
    }


    /* =====================================================
       SYNC OBJECT DATA
    ===================================================== */

    syncObjectData(object) {

        if (
            !object ||
            !object.data
        ) {

            return;
        }


        if (object.element) {

            const left =
                parseFloat(
                    object.element.style.left
                );


            const top =
                parseFloat(
                    object.element.style.top
                );


            if (
                Number.isFinite(left)
            ) {

                object.data.x = left;
            }


            if (
                Number.isFinite(top)
            ) {

                object.data.y = top;
            }


            const width =
                parseFloat(
                    object.element.style.width
                );


            if (
                Number.isFinite(width)
            ) {

                object.data.width = width;
            }


            const height =
                parseFloat(
                    object.element.style.height
                );


            if (
                Number.isFinite(height)
            ) {

                object.data.height = height;
            }


            const opacity =
                parseFloat(
                    object.element.style.opacity
                );


            if (
                Number.isFinite(opacity)
            ) {

                object.data.opacity = opacity;
            }


            const zIndex =
                parseInt(
                    object.element.style.zIndex,
                    10
                );


            if (
                Number.isFinite(zIndex)
            ) {

                object.data.z =
                    zIndex;
            }


            const transform =
                object.element.style.transform || "";


            const scaleMatch =
                transform.match(
                    /scale\(\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*\)/i
                );


            if (scaleMatch) {

                const scale =
                    parseFloat(
                        scaleMatch[1]
                    );


                if (
                    Number.isFinite(scale)
                ) {

                    object.data.scale =
                        scale;
                }
            }


            const rotateMatch =
                transform.match(
                    /rotate\(\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+))deg\s*\)/i
                );


            if (rotateMatch) {

                const rotation =
                    parseFloat(
                        rotateMatch[1]
                    );


                if (
                    Number.isFinite(rotation)
                ) {

                    object.data.rotation =
                        rotation;
                }
            }
        }


        if (
            object.data.x === undefined
        ) {

            object.data.x = 0;
        }


        if (
            object.data.y === undefined
        ) {

            object.data.y = 0;
        }


        if (
            object.data.scale === undefined
        ) {

            object.data.scale = 1;
        }


        if (
            object.data.rotation === undefined
        ) {

            object.data.rotation = 0;
        }


        if (
            object.data.opacity === undefined
        ) {

            object.data.opacity = 1;
        }


        if (
            object.data.z === undefined
        ) {

            object.data.z = 0;
        }
    }


    /* =====================================================
       SYNC ALL OBJECTS
    ===================================================== */

    syncAllObjects() {

        if (
            !this.scene ||
            !this.scene.objects
        ) {

            return;
        }


        console.log(
            "🔄 Synchronizing live scene..."
        );


        for (
            const object
            of this.scene.objects.values()
        ) {

            this.syncObjectData(
                object
            );
        }


        console.log(
            "✅ Live scene synchronized:",
            this.scene.objects.size,
            "objects"
        );
    }


    /* =====================================================
       COPY FULL SCENE.JS
    ===================================================== */

    async copyConfig() {

        this.syncAllObjects();


        if (
            window.sceneExporter &&
            typeof window.sceneExporter.exportWholeFile ===
            "function"
        ) {

            console.log(
                "📦 Sending export request to SceneExporter..."
            );


            try {

                return await window.sceneExporter
                    .exportWholeFile();

            } catch (error) {

                console.error(
                    "❌ SceneExporter failed:",
                    error
                );

                this.showEditorMessage(
                    "Export failed."
                );

                return null;
            }
        }


        console.warn(
            "⚠️ SceneExporter not found."
        );


        if (
            !this.scene ||
            typeof this.scene.getCleanConfig !==
            "function"
        ) {

            console.error(
                "❌ SceneSystem.getCleanConfig() missing"
            );

            return null;
        }


        const config =
            this.scene.getCleanConfig();


        const text =
            JSON.stringify(
                config,
                null,
                4
            );


        const copied =
            await this.copyText(
                text
            );


        if (copied) {

            console.log(
                "📋 LIVE CONFIG COPIED AS FALLBACK"
            );
        }


        return text;
    }


    /* =====================================================
       COPY TEXT FALLBACK
    ===================================================== */

    async copyText(text) {

        if (!text) {

            return false;
        }


        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {

            try {

                await navigator.clipboard.writeText(
                    text
                );


                return true;

            } catch (error) {

                console.warn(
                    "⚠️ Clipboard API failed:",
                    error
                );
            }
        }


        return this.fallbackCopy(text);
    }


    /* =====================================================
       FALLBACK COPY
    ===================================================== */

    fallbackCopy(text) {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";


        textarea.style.left =
            "-99999px";


        textarea.style.top =
            "0";


        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

        textarea.select();


        let successful =
            false;


        try {

            successful =
                document.execCommand(
                    "copy"
                );

        } catch (error) {

            console.error(
                "❌ Copy failed:",
                error
            );
        }


        textarea.remove();


        if (successful) {

            console.log(
                "📋 COPY SUCCESSFUL"
            );

        } else {

            console.error(
                "❌ Browser refused clipboard copy"
            );
        }


        return successful;
    }


    /* =====================================================
       EDITOR MESSAGE
    ===================================================== */

    showEditorMessage(message) {

        const old =
            document.getElementById(
                "scene-editor-message"
            );


        if (old) {

            old.remove();
        }


        const element =
            document.createElement(
                "div"
            );


        element.id =
            "scene-editor-message";


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
            "9999999";


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


    /* =====================================================
       HIGHEST Z
    ===================================================== */

    getHighestZ() {

        let highest = 0;


        if (
            !this.scene ||
            !this.scene.objects
        ) {

            return highest;
        }


        for (
            const object
            of this.scene.objects.values()
        ) {

            const z =
                Number(
                    object.data?.z || 0
                );


            if (z > highest) {

                highest = z;
            }
        }


        return highest;
    }


    /* =====================================================
       GENERATE ASSET ID
    ===================================================== */

    generateAssetId(filename) {

        const base =
            filename
                .replace(
                    /\.[^/.]+$/,
                    ""
                )
                .replace(
                    /[^a-zA-Z0-9_-]/g,
                    "_"
                )
                .toLowerCase();


        let id =
            base ||
            "asset";


        let counter =
            1;


        while (
            this.scene.get &&
            this.scene.get(id)
        ) {

            id =
                `${base}_${counter}`;

            counter++;
        }


        return id;
    }


    /* =====================================================
       GENERATE DUPLICATE ID
    ===================================================== */

    generateDuplicateId(
        originalId
    ) {

        let counter =
            1;


        let id =
            `${originalId}_copy`;


        while (
            this.scene.get &&
            this.scene.get(id)
        ) {

            counter++;


            id =
                `${originalId}_copy_${counter}`;
        }


        return id;
    }
}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeSceneEditor() {

    if (!sceneEditorEnabled) {

        return;
    }


    if (window.sceneEditor) {

        return;
    }


    if (!window.scene) {

        console.log(
            "⏳ SceneEditor waiting for window.scene..."
        );

        return;
    }


    console.log(
        "🔎 SceneEditor found window.scene"
    );


    try {

        window.sceneEditor =
            new SceneEditor(
                window.scene
            );


        console.log(
            "✅ SceneEditor successfully started"
        );

    } catch (error) {

        console.error(
            "❌ SceneEditor initialization failed:",
            error
        );
    }
}


/* =========================================================
   TRY IMMEDIATELY
========================================================= */

initializeSceneEditor();


/* =========================================================
   WAIT FOR SCENE SYSTEM
========================================================= */

if (sceneEditorEnabled) {

    let attempts = 0;

    const maxAttempts = 200;


    const waitForScene =
        setInterval(
            () => {

                attempts++;


                if (
                    window.scene &&
                    !window.sceneEditor
                ) {

                    clearInterval(
                        waitForScene
                    );


                    initializeSceneEditor();


                    return;
                }


                if (
                    window.sceneEditor ||
                    attempts >= maxAttempts
                ) {

                    clearInterval(
                        waitForScene
                    );


                    if (
                        !window.sceneEditor
                    ) {

                        console.error(
                            "❌ SceneEditor could not find window.scene."
                        );
                    }
                }

            },
            50
        );
}

