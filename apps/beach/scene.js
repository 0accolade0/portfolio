/* =========================================================
   REUSABLE RESPONSIVE 2D SCENE SYSTEM

   FEATURES
   ---------------------------------------------------------
   - Responsive 2D scene
   - States
   - Parent / child support
   - Z ordering
   - Position / scale / rotation
   - Visibility groups
   - Generic click actions
   - Toggle visibility
   - Play animation
   - Add / duplicate / delete
   - Live config export
   - Whole-file export support
   - Editor support

   EDIT MODE
   ---------------------------------------------------------
   index.html?edit=true

   In editor mode:

       - house2 is forced visible
       - wall pictures are forced visible
       - demo pictures are visible
       - normal scene state does NOT hide editor targets

   IMPORTANT
   ---------------------------------------------------------
   WALL PICTURES ARE NOT PART OF SCENE CONFIG.

   Permanent scene images:
       Defined in SCENE_CONFIG.

   Wall / visitor pictures:
       Managed by house-interaction.js.

   Visitor-uploaded pictures are runtime-only
   and must never be exported into SCENE_CONFIG.

   GENERIC CLICK ACTIONS
   ---------------------------------------------------------
   toggleVisibility
   playAnimation
   toggle
   state
   animation

   HOUSE-SPECIFIC BEHAVIOUR
   ---------------------------------------------------------
   Handled by house-interaction.js

   IMPORTANT
   ---------------------------------------------------------
   window.scene = scene
========================================================= */


class SceneSystem {

    constructor(config) {

        this.config = config;

        this.container =
            document.getElementById(
                "scene-container"
            );

        this.sceneElement =
            document.getElementById(
                "scene"
            );


        if (!this.container) {

            console.error(
                "❌ #scene-container not found"
            );

            return;
        }


        if (!this.sceneElement) {

            console.error(
                "❌ #scene not found"
            );

            return;
        }


        this.objects =
            new Map();


        this.currentState =
            config.startingState ||
            "outside";


        this.viewportScale =
            1;

        this.baseViewportScale =
            1;


        this.dragging =
            false;


        /*
            -------------------------------------------------
            EDITOR MODE
            -------------------------------------------------

            This is intentionally separate from the actual
            scene state.

            It does NOT change:
                startingState
                currentState
                SCENE_CONFIG

            It only changes visibility for objects that
            need to be visible while editing.
        */

        this.editMode =
            new URLSearchParams(
                window.location.search
            ).get("edit") === "true";

        // EDITOR DISABLED FOR PUBLIC BUILD
        // this.editMode = false;

        window.scene =
            this;


        this.initialize();
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    initialize() {

        console.log(
            "================================"
        );

        console.log(
            "🌎 SCENE SYSTEM INITIALIZING"
        );

        console.log(
            "================================"
        );


        if (this.editMode) {

            console.log(
                "🛠️ EDITOR VISIBILITY MODE ENABLED"
            );
        }


        this.sceneElement.style.background =
            this.config.background ||
            "#87CEEB";


        this.injectStyles();


        /*
            Create every permanent scene object
            from SCENE_CONFIG.
        */

        this.createObjects();


        this.initializeVisibilityGroups();


        this.applyState();


        /*
            After normal visibility has been applied,
            apply the editor-only visibility override.

            This is IMPORTANT because:
                house2 has initialVisible: false
                house2 may be affected by state logic

            Editor mode must still be able to see it.
        */

        this.applyEditorVisibility();


        this.updateViewport();


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.houseInteraction &&
                    window.houseInteraction.isZoomed &&
                    typeof window.houseInteraction.updateHouseZoomViewport ===
                        "function"
                ) {

                    window.houseInteraction
                        .updateHouseZoomViewport();

                } else {

                    this.updateViewport();
                }
            }
        );


        console.log(
            "================================"
        );

        console.log(
            "✅ SCENE INITIALIZED"
        );

        console.log(
            "Objects:",
            this.objects.size
        );

        console.log(
            "State:",
            this.currentState
        );

        console.log(
            "Editor:",
            this.editMode
        );

        console.log(
            "================================"
        );


        this.initializeEditorIfReady();
    }


    /* =====================================================
       EDITOR INITIALIZATION
    ===================================================== */

    initializeEditorIfReady() {

        if (!this.editMode) {

            return;
        }


        console.log(
            "🛠️ EDIT MODE ENABLED"
        );


        if (
            typeof SceneEditor !==
            "undefined"
        ) {

            if (
                !window.sceneEditor
            ) {

                console.log(
                    "🛠️ Creating SceneEditor from SceneSystem..."
                );


                window.sceneEditor =
                    new SceneEditor(
                        this
                    );

            } else {

                console.log(
                    "🛠️ SceneEditor already exists — refreshing..."
                );


                window.sceneEditor.scene =
                    this;


                if (
                    typeof window.sceneEditor.refreshObjectEvents ===
                    "function"
                ) {

                    window.sceneEditor
                        .refreshObjectEvents();
                }


                if (
                    typeof window.sceneEditor.refreshWheelEvents ===
                    "function"
                ) {

                    window.sceneEditor
                        .refreshWheelEvents();
                }
            }


            return;
        }


        console.log(
            "⏳ SceneEditor class not loaded yet..."
        );


        let attempts =
            0;


        const timer =
            setInterval(
                () => {

                    attempts++;


                    if (
                        typeof SceneEditor !==
                        "undefined"
                    ) {

                        clearInterval(
                            timer
                        );


                        if (
                            !window.sceneEditor
                        ) {

                            console.log(
                                "🛠️ SceneEditor loaded — starting..."
                            );


                            window.sceneEditor =
                                new SceneEditor(
                                    this
                                );

                        } else {

                            window.sceneEditor.scene =
                                this;


                            if (
                                typeof window.sceneEditor.refreshObjectEvents ===
                                "function"
                            ) {

                                window.sceneEditor
                                    .refreshObjectEvents();
                            }


                            if (
                                typeof window.sceneEditor.refreshWheelEvents ===
                                "function"
                            ) {

                                window.sceneEditor
                                    .refreshWheelEvents();
                            }
                        }


                        /*
                            SceneEditor may have refreshed
                            object visibility/events.

                            Re-apply editor visibility after
                            it initializes.
                        */

                        this.applyEditorVisibility();


                        return;
                    }


                    if (
                        attempts >= 200
                    ) {

                        clearInterval(
                            timer
                        );


                        console.warn(
                            "⚠️ SceneEditor did not load."
                        );
                    }

                },
                50
            );
    }


    /* =====================================================
       STYLES
    ===================================================== */

    injectStyles() {

        if (
            document.getElementById(
                "scene-system-styles"
            )
        ) {

            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "scene-system-styles";


        style.textContent = `

            #scene-container {

                position: relative;

                overflow: hidden;

                width: 100vw;

                height: 100vh;

                margin: 0;

                padding: 0;
            }


            #scene {

                position: absolute;

                left: 0;

                top: 0;

                width:
                    ${this.config.width}px;

                height:
                    ${this.config.height}px;

                transform-origin:
                    top left;

                overflow:
                    visible;
            }


            .scene-object {

                position: absolute;

                transform-origin:
                    center center;

                user-select:
                    none;

                pointer-events:
                    none;

                will-change:
                    transform,
                    left,
                    top,
                    opacity;

                -webkit-user-drag:
                    none;
            }


            .scene-object img {

                display:
                    block;

                width:
                    100%;

                height:
                    100%;

                max-width:
                    none;

                max-height:
                    none;

                object-fit:
                    contain;

                pointer-events:
                    none;

                user-select:
                    none;

                -webkit-user-drag:
                    none;
            }


            .scene-object.scene-interactive {

                pointer-events:
                    auto;

                cursor:
                    pointer;
            }


            .scene-object.scene-hidden {

                display:
                    none !important;
            }


            @keyframes scene-bounce {

                0% {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(
                            var(--scene-rotation)
                        )
                        scale(
                            var(--scene-scale)
                        );
                }


                40% {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(
                            var(--scene-rotation)
                        )
                        scale(
                            calc(
                                var(--scene-scale)
                                * 1.08
                            )
                        );
                }


                70% {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(
                            var(--scene-rotation)
                        )
                        scale(
                            calc(
                                var(--scene-scale)
                                * 0.96
                            )
                        );
                }


                100% {

                    transform:
                        translate(
                            -50%,
                            -50%
                        )
                        rotate(
                            var(--scene-rotation)
                        )
                        scale(
                            var(--scene-scale)
                        );
                }
            }


            .scene-animation-bounce {

                animation:
                    scene-bounce
                    0.35s
                    ease;
            }

        `;


        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       CREATE ALL OBJECTS
    ===================================================== */

    createObjects() {

        const objects =
            [
                ...(this.config.objects || [])
            ];


        objects.sort(
            (a, b) => {

                return (
                    (a.z || 0) -
                    (b.z || 0)
                );
            }
        );


        console.log(
            "🧱 Creating objects:",
            objects.length
        );


        for (
            const data
            of objects
        ) {

            this.createObject(
                data
            );
        }


        for (
            const data
            of objects
        ) {

            if (!data.parent) {

                continue;
            }


            const child =
                this.objects.get(
                    data.id
                );


            const parent =
                this.objects.get(
                    data.parent
                );


            if (
                child &&
                parent
            ) {

                this.attachChild(
                    child,
                    parent
                );
            }
        }
    }


    /* =====================================================
       CREATE OBJECT
    ===================================================== */

    createObject(data) {

        if (
            !data ||
            !data.id
        ) {

            console.warn(
                "⚠️ Invalid object data:",
                data
            );

            return null;
        }


        if (
            this.objects.has(
                data.id
            )
        ) {

            console.warn(
                "⚠️ Object already exists:",
                data.id
            );

            return this.objects.get(
                data.id
            );
        }


        const element =
            document.createElement(
                "div"
            );


        element.className =
            "scene-object";


        element.dataset.id =
            data.id;


        const object = {

            id:
                data.id,

            data:
                data,

            element:
                element,

            image:
                null,

            isChild:
                false,

            parentId:
                data.parent ||
                null,

            manualVisible:
                data.initialVisible !==
                undefined

                    ? !!data.initialVisible

                    : null
        };


        /* -------------------------------------------------
           IMAGE
        ------------------------------------------------- */

        if (data.image) {

            const img =
                document.createElement(
                    "img"
                );


            img.src =
                data.image;


            img.draggable =
                false;


            element.appendChild(
                img
            );


            object.image =
                img;
        }


        /* -------------------------------------------------
           SIZE
        ------------------------------------------------- */

        element.style.width =
            `${data.width || 100}px`;


        element.style.height =
            `${data.height || 100}px`;


        /* -------------------------------------------------
           POSITION
        ------------------------------------------------- */

        element.style.left =
            `${data.x || 0}px`;


        element.style.top =
            `${data.y || 0}px`;


        /* -------------------------------------------------
           OPACITY
        ------------------------------------------------- */

        element.style.opacity =
            data.opacity !==
            undefined

                ? data.opacity

                : 1;


        /* -------------------------------------------------
           Z INDEX
        ------------------------------------------------- */

        element.style.zIndex =
            data.z !==
            undefined

                ? data.z

                : 0;


        /* -------------------------------------------------
           TRANSFORM
        ------------------------------------------------- */

        this.updateTransform(
            object
        );


        /* -------------------------------------------------
           INTERACTIVITY
        ------------------------------------------------- */

        this.updateObjectInteractivity(
            object
        );


        /* -------------------------------------------------
           CLICK
        ------------------------------------------------- */

        element.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                if (
                    window.sceneEditor
                ) {

                    return;
                }


                const action =
                    object.data.clickAction;


                if (!action) {

                    console.log(
                        "🖱️ Clicked object with no action:",
                        object.id
                    );

                    return;
                }


                console.log(
                    "🖱️ CLICK:",
                    object.id,
                    action
                );


                this.handleObjectClick(
                    object
                );
            }
        );


        /* -------------------------------------------------
           APPEND
        ------------------------------------------------- */

        this.sceneElement.appendChild(
            element
        );


        this.objects.set(
            data.id,
            object
        );


        /*
            If the object is created AFTER the initial
            editor setup, immediately apply editor
            visibility to it.
        */

        if (this.editMode) {

            this.applyEditorVisibilityToObject(
                object
            );
        }


        return object;
    }


    /* =====================================================
       EDITOR VISIBILITY
       -----------------------------------------------------
       IMPORTANT

       Normal website:

           Scene states control visibility.

       Editor mode:

           Certain objects are forced visible so the
           designer can actually edit them.

       Currently forced visible:

           house2
           wall pictures

       This does NOT modify:

           object.data.states
           object.data.initialVisible
           this.currentState
           SCENE_CONFIG
    ===================================================== */

    isEditorVisibilityTarget(
        object
    ) {

        if (
            !object ||
            !object.data
        ) {

            return false;
        }


        /*
            House 2 must always be visible while editing.
        */

        if (
            object.id ===
            "house2"
        ) {

            return true;
        }


        /*
            Wall pictures are managed by
            house-interaction.js.

            This catches:

                demo pictures
                visitor pictures
                runtime wall pictures

            without putting them into SCENE_CONFIG.
        */

        if (
            object.data.wallPicture ===
            true
        ) {

            return true;
        }


        return false;
    }


    applyEditorVisibilityToObject(
        object
    ) {

        if (
            !this.editMode ||
            !this.isEditorVisibilityTarget(
                object
            )
        ) {

            return;
        }


        if (
            !object.element
        ) {

            return;
        }


        /*
            Force the object visible.

            We deliberately do NOT modify
            manualVisible.

            Therefore:
                initialVisible stays false
                normal state remains unchanged
        */

        object.element.classList.remove(
            "scene-hidden"
        );


        object.element.style.display =
            "";


        /*
            Wall pictures and house2 must remain
            available to the editor.
        */

        this.updateObjectInteractivity(
            object
        );
    }


    applyEditorVisibility() {

        if (
            !this.editMode
        ) {

            return;
        }


        for (
            const object
            of this.objects.values()
        ) {

            this.applyEditorVisibilityToObject(
                object
            );
        }


        console.log(
            "🛠️ Editor visibility applied"
        );
    }


    /* =====================================================
       CLICK ACTION HANDLER
    ===================================================== */

    handleObjectClick(object) {

        if (
            !object ||
            !object.data
        ) {

            return;
        }


        const action =
            object.data.clickAction;


        if (!action) {

            return;
        }


        console.log(
            "🎯 Handling click action:",
            object.id,
            action.type
        );


        if (
            action.animation
        ) {

            this.playAnimation(
                object,
                action.animation
            );
        }


        if (
            action.type ===
                "toggleVisibility" ||

            action.type ===
                "toggleVisibilityGroup"
        ) {

            this.toggleVisibilityGroup(
                action.group
            );

            return;
        }


        if (
            action.type ===
            "toggle"
        ) {

            this.toggleObject(
                object
            );

            return;
        }


        if (
            action.type ===
            "state"
        ) {

            if (
                action.state
            ) {

                this.setState(
                    action.state
                );
            }


            return;
        }


        if (
            action.type ===
            "playAnimation"
        ) {

            this.playAnimation(
                object,
                action.animation ||
                    "bounce"
            );


            return;
        }


        if (
            action.type ===
            "animation"
        ) {

            this.playAnimation(
                object,
                action.animation ||
                    "bounce"
            );


            return;
        }


        console.warn(
            "⚠️ Unknown click action:",
            action.type
        );
    }


    /* =====================================================
       PLAY ANIMATION
    ===================================================== */

    playAnimation(
        object,
        animationName = "bounce"
    ) {

        if (
            typeof object ===
            "string"
        ) {

            object =
                this.objects.get(
                    object
                );
        }


        if (
            !object ||
            !object.element
        ) {

            console.error(
                "❌ playAnimation: object not found",
                object
            );

            return;
        }


        const element =
            object.element;


        console.log(
            "✨ Animation:",
            object.id,
            animationName
        );


        if (
            animationName ===
            "bounce"
        ) {

            element.classList.remove(
                "scene-animation-bounce"
            );


            void element.offsetWidth;


            element.classList.add(
                "scene-animation-bounce"
            );


            element.addEventListener(
                "animationend",
                () => {

                    element.classList.remove(
                        "scene-animation-bounce"
                    );

                },
                {
                    once:
                        true
                }
            );


            return;
        }


        element.classList.remove(
            `scene-animation-${animationName}`
        );


        void element.offsetWidth;


        element.classList.add(
            `scene-animation-${animationName}`
        );
    }


    /* =====================================================
       TOGGLE SINGLE OBJECT
    ===================================================== */

    toggleObject(object) {

        if (!object) {

            return;
        }


        const currentlyVisible =
            this.isEffectivelyVisible(
                object
            );


        object.manualVisible =
            !currentlyVisible;


        console.log(
            "👁️ Toggle:",
            object.id,
            "→",
            object.manualVisible
        );


        this.refreshObjectVisibility(
            object
        );
    }


    /* =====================================================
       VISIBILITY GROUP
    ===================================================== */

    toggleVisibilityGroup(
        groupName
    ) {

        if (!groupName) {

            console.warn(
                "⚠️ toggleVisibilityGroup called without group"
            );

            return;
        }


        const members =
            [
                ...this.objects.values()
            ]
            .filter(
                object =>
                    object.data.visibilityGroup ===
                    groupName
            );


        if (
            members.length ===
            0
        ) {

            console.warn(
                "⚠️ No visibility group members:",
                groupName
            );

            return;
        }


        console.log(
            "🔄 Toggling visibility group:",
            groupName,
            members.map(
                m => m.id
            )
        );


        let currentIndex =
            members.findIndex(
                object =>
                    this.isEffectivelyVisible(
                        object
                    )
            );


        if (
            currentIndex ===
            -1
        ) {

            currentIndex =
                -1;
        }


        const nextIndex =
            (
                currentIndex +
                1
            ) %
            members.length;


        const nextObject =
            members[
                nextIndex
            ];


        for (
            const object
            of members
        ) {

            object.manualVisible =
                false;


            this.refreshObjectVisibility(
                object
            );
        }


        nextObject.manualVisible =
            true;


        this.refreshObjectVisibility(
            nextObject
        );


        console.log(
            "👁️ Group result:",
            groupName,
            "→",
            nextObject.id
        );


        if (
            groupName ===
                "houses" &&

            nextObject.id ===
                "house2"
        ) {

            if (
                window.houseInteraction &&

                typeof
                    window.houseInteraction
                        .onHouse2Selected ===
                    "function"
            ) {

                console.log(
                    "🏠 House2 selected → opening house interaction"
                );


                window.houseInteraction
                    .onHouse2Selected(
                        nextObject
                    );
            }
        }


        if (
            groupName ===
                "houses" &&

            nextObject.id ===
                "house1"
        ) {

            if (
                window.houseInteraction &&

                typeof
                    window.houseInteraction
                        .onHouse1Selected ===
                    "function"
            ) {

                console.log(
                    "🏠 House1 selected → closing house interaction"
                );


                window.houseInteraction
                    .onHouse1Selected(
                        nextObject
                    );
            }
        }
    }


    /* =====================================================
       LEGACY TARGET TOGGLE
    ===================================================== */

    toggleVisibilityTargets(
        targetIds = []
    ) {

        if (
            !Array.isArray(
                targetIds
            ) ||

            !targetIds.length
        ) {

            return;
        }


        const targets =
            targetIds
                .map(
                    id =>
                        this.objects.get(
                            id
                        )
                )
                .filter(Boolean);


        if (
            !targets.length
        ) {

            return;
        }


        let currentIndex =
            targets.findIndex(
                object =>
                    this.isEffectivelyVisible(
                        object
                    )
            );


        if (
            currentIndex <
            0
        ) {

            currentIndex =
                -1;
        }


        const nextIndex =
            (
                currentIndex +
                1
            ) %
            targets.length;


        for (
            const object
            of targets
        ) {

            object.manualVisible =
                false;


            this.refreshObjectVisibility(
                object
            );
        }


        targets[
            nextIndex
        ].manualVisible =
            true;


        this.refreshObjectVisibility(
            targets[
                nextIndex
            ]
        );
    }


    /* =====================================================
       INITIALIZE VISIBILITY GROUPS
    ===================================================== */

    initializeVisibilityGroups() {

        const groups =
            new Map();


        for (
            const object
            of this.objects.values()
        ) {

            const group =
                object.data.visibilityGroup;


            if (!group) {

                continue;
            }


            if (
                !groups.has(
                    group
                )
            ) {

                groups.set(
                    group,
                    []
                );
            }


            groups.get(
                group
            ).push(
                object
            );
        }


        for (
            const [
                groupName,
                members
            ]
            of groups
        ) {

            console.log(
                "👁️ Initializing group:",
                groupName,
                members.map(
                    m => m.id
                )
            );


            const hasExplicit =
                members.some(
                    object =>
                        object.data.initialVisible !==
                        undefined
                );


            if (
                hasExplicit
            ) {

                for (
                    const object
                    of members
                ) {

                    object.manualVisible =
                        object.data.initialVisible !==
                        undefined

                            ? !!object.data.initialVisible

                            : false;
                }

            } else {

                members.forEach(
                    (
                        object,
                        index
                    ) => {

                        object.manualVisible =
                            index === 0;
                    }
                );
            }


            for (
                const object
                of members
            ) {

                this.refreshObjectVisibility(
                    object
                );
            }
        }
    }


    /* =====================================================
       INTERACTIVITY
    ===================================================== */

    updateObjectInteractivity(
        object
    ) {

        if (
            !object ||
            !object.element
        ) {

            return;
        }


        const hasAction =
            !!object.data.clickAction;


        object.element.classList.toggle(
            "scene-interactive",
            hasAction
        );
    }


    /* =====================================================
       SET CLICK ACTION
    ===================================================== */

    setClickAction(
        id,
        action
    ) {

        const object =
            this.objects.get(
                id
            );


        if (!object) {

            return;
        }


        object.data.clickAction =
            action ||
            null;


        this.updateObjectInteractivity(
            object
        );
    }


    /* =====================================================
       REMOVE CLICK ACTION
    ===================================================== */

    removeClickAction(
        id
    ) {

        const object =
            this.objects.get(
                id
            );


        if (!object) {

            return;
        }


        delete object.data.clickAction;


        this.updateObjectInteractivity(
            object
        );
    }


    /* =====================================================
       SET IMAGE
    ===================================================== */

    setObjectImage(
        id,
        image
    ) {

        const object =
            this.objects.get(
                id
            );


        if (!object) {

            return;
        }


        object.data.image =
            image;


        if (
            object.image
        ) {

            object.image.src =
                image;
        }
    }


    /* =====================================================
       STATE
    ===================================================== */

    setState(
        state
    ) {

        if (!state) {

            return;
        }


        console.log(
            "🔀 Scene state:",
            this.currentState,
            "→",
            state
        );


        this.currentState =
            state;


        this.applyState();
    }


    getState() {

        return this.currentState;
    }


    applyState() {

        for (
            const object
            of this.objects.values()
        ) {

            this.updateObjectVisibility(
                object
            );
        }


        /*
            State visibility has now been applied.

            Re-apply editor overrides afterward.
        */

        this.applyEditorVisibility();
    }


    updateObjectVisibility(
        object
    ) {

        if (!object) {

            return;
        }


        this.refreshObjectVisibility(
            object
        );
    }


    /* =====================================================
       STATE CHECK
    ===================================================== */

    isStateAllowed(
        object
    ) {

        const states =
            object.data.states;


        if (
            !states ||
            !states.length
        ) {

            return true;
        }


        return states.includes(
            this.currentState
        );
    }


    /* =====================================================
       EFFECTIVE VISIBILITY
    ===================================================== */

    isEffectivelyVisible(
        object
    ) {

        if (
            !object ||
            !object.element
        ) {

            return false;
        }


        return !object.element.classList.contains(
            "scene-hidden"
        );
    }


    /* =====================================================
       REFRESH VISIBILITY
    ===================================================== */

    refreshObjectVisibility(
        object
    ) {

        if (
            !object ||
            !object.element
        ) {

            return;
        }


        const stateAllowed =
            this.isStateAllowed(
                object
            );


        const manualAllowed =
            object.manualVisible !==
            false;


        const visible =
            stateAllowed &&
            manualAllowed;


        object.element.classList.toggle(
            "scene-hidden",
            !visible
        );


        object.element.style.display =
            visible
                ? ""
                : "none";


        this.updateObjectInteractivity(
            object
        );


        /*
            IMPORTANT:

            Normal visibility has been calculated.

            Now override only the objects that the
            editor needs to see.
        */

        if (
            this.editMode
        ) {

            this.applyEditorVisibilityToObject(
                object
            );
        }
    }


    /* =====================================================
       MOVE
    ===================================================== */

    move(
        id,
        x,
        y
    ) {

        const object =
            typeof id === "string"

                ? this.objects.get(
                    id
                )

                : id;


        if (!object) {

            return;
        }


        object.data.x =
            Number(x) || 0;


        object.data.y =
            Number(y) || 0;


        object.element.style.left =
            `${object.data.x}px`;


        object.element.style.top =
            `${object.data.y}px`;
    }


    /* =====================================================
       SCALE
    ===================================================== */

    scaleObject(
        id,
        scale
    ) {

        const object =
            typeof id === "string"

                ? this.objects.get(
                    id
                )

                : id;


        if (!object) {

            return;
        }


        object.data.scale =
            Math.max(
                0.05,
                Number(scale) || 1
            );


        this.updateTransform(
            object
        );
    }


    /* =====================================================
       ROTATE
    ===================================================== */

    rotate(
        id,
        rotation
    ) {

        const object =
            typeof id === "string"

                ? this.objects.get(
                    id
                )

                : id;


        if (!object) {

            return;
        }


        object.data.rotation =
            Number(rotation) || 0;


        this.updateTransform(
            object
        );
    }


    /* =====================================================
       UPDATE TRANSFORM
    ===================================================== */

    updateTransform(
        object
    ) {

        if (
            !object ||
            !object.element
        ) {

            return;
        }


        const scale =
            object.data.scale !==
            undefined

                ? object.data.scale

                : 1;


        const rotation =
            object.data.rotation !==
            undefined

                ? object.data.rotation

                : 0;


        object.element.style.setProperty(
            "--scene-scale",
            scale
        );


        object.element.style.setProperty(
            "--scene-rotation",
            `${rotation}deg`
        );


        object.element.style.transform =
            `
                translate(
                    -50%,
                    -50%
                )
                rotate(
                    ${rotation}deg
                )
                scale(
                    ${scale}
                )
            `;
    }


    /* =====================================================
       SHOW
    ===================================================== */

    show(
        id
    ) {

        const object =
            typeof id === "string"

                ? this.objects.get(
                    id
                )

                : id;


        if (!object) {

            return;
        }


        object.manualVisible =
            true;


        this.refreshObjectVisibility(
            object
        );
    }


    /* =====================================================
       HIDE
    ===================================================== */

    hide(
        id
    ) {

        const object =
            typeof id === "string"

                ? this.objects.get(
                    id
                )

                : id;


        if (!object) {

            return;
        }


        object.manualVisible =
            false;


        this.refreshObjectVisibility(
            object
        );
    }


    /* =====================================================
       OPACITY
    ===================================================== */

    setOpacity(
        id,
        opacity
    ) {

        const object =
            typeof id === "string"

                ? this.objects.get(
                    id
                )

                : id;


        if (!object) {

            return;
        }


        object.data.opacity =
            Number(opacity);


        object.element.style.opacity =
            object.data.opacity;
    }


    /* =====================================================
       VIEWPORT
    ===================================================== */

    updateViewport() {

        if (
            !this.container ||
            !this.sceneElement
        ) {

            return;
        }


        const containerWidth =
            this.container.clientWidth;


        const containerHeight =
            this.container.clientHeight;


        if (
            !containerWidth ||
            !containerHeight
        ) {

            return;
        }


        const scaleX =
            containerWidth /
            this.config.width;


        const scaleY =
            containerHeight /
            this.config.height;


        const scale =
            Math.max(
                scaleX,
                scaleY
            );


        this.viewportScale =
            scale;


        this.baseViewportScale =
            scale;


        const finalWidth =
            this.config.width *
            scale;


        const finalHeight =
            this.config.height *
            scale;


        const left =
            (
                containerWidth -
                finalWidth
            ) / 2;


        const top =
            (
                containerHeight -
                finalHeight
            ) / 2;


        this.sceneElement.style.left =
            `${left}px`;


        this.sceneElement.style.top =
            `${top}px`;


        this.sceneElement.style.transform =
            `scale(${scale})`;


        console.log(
            "📐 Viewport:",
            containerWidth,
            "x",
            containerHeight,
            "scale:",
            scale
        );
    }


    /* =====================================================
       DELETE OBJECT
       -----------------------------------------------------
       Generic scene deletion only.

       Wall-picture persistence is NOT handled here.
       house-interaction.js owns wall pictures.
    ===================================================== */

    deleteObject(
        id
    ) {

        const object =
            typeof id === "string"

                ? this.objects.get(
                    id
                )

                : id;


        if (!object) {

            return;
        }


        console.log(
            "🗑️ Deleting:",
            object.id
        );


        object.element.remove();


        this.objects.delete(
            object.id
        );
    }


    /* =====================================================
       GET
    ===================================================== */

    get(
        id
    ) {

        return this.objects.get(
            id
        );
    }


    /* =====================================================
       ATTACH CHILD
    ===================================================== */

    attachChild(
        child,
        parent
    ) {

        if (
            typeof child ===
            "string"
        ) {

            child =
                this.objects.get(
                    child
                );
        }


        if (
            typeof parent ===
            "string"
        ) {

            parent =
                this.objects.get(
                    parent
                );
        }


        if (
            !child ||
            !parent
        ) {

            console.warn(
                "⚠️ Cannot attach child",
                child,
                parent
            );

            return;
        }


        if (
            child.element.parentElement
        ) {

            child.element.parentElement.removeChild(
                child.element
            );
        }


        parent.element.appendChild(
            child.element
        );


        child.isChild =
            true;


        child.parentId =
            parent.id;


        child.data.parent =
            parent.id;
    }


    /* =====================================================
       DETACH CHILD
    ===================================================== */

    detachChild(
        child
    ) {

        if (
            typeof child ===
            "string"
        ) {

            child =
                this.objects.get(
                    child
                );
        }


        if (!child) {

            return;
        }


        this.sceneElement.appendChild(
            child.element
        );


        child.isChild =
            false;


        child.parentId =
            null;


        delete child.data.parent;
    }


    /* =====================================================
       ADD OBJECT
    ===================================================== */

    addObject(
        data
    ) {

        const object =
            this.createObject(
                data
            );


        if (
            object &&
            window.sceneEditor
        ) {

            if (
                typeof
                    window.sceneEditor
                        .bindObjectToEditor ===
                    "function"
            ) {

                window.sceneEditor
                    .bindObjectToEditor(
                        object
                    );
            }


            if (
                typeof
                    window.sceneEditor
                        .bindWheel ===
                    "function"
            ) {

                window.sceneEditor
                    .bindWheel(
                        object
                    );
            }
        }


        return object;
    }


    /* =====================================================
       DUPLICATE OBJECT
    ===================================================== */

    duplicateObject(
        id
    ) {

        const source =
            this.objects.get(
                id
            );


        if (!source) {

            return null;
        }


        const copy = {

            ...JSON.parse(
                JSON.stringify(
                    source.data
                )
            ),


            id:
                `${source.id}_copy_${Date.now()}`,


            x:
                (source.data.x || 0) +
                40,


            y:
                (source.data.y || 0) +
                40
        };


        const object =
            this.createObject(
                copy
            );


        if (
            copy.parent &&
            this.objects.has(
                copy.parent
            )
        ) {

            this.attachChild(
                object,
                this.objects.get(
                    copy.parent
                )
            );
        }


        if (
            object &&
            window.sceneEditor
        ) {

            if (
                typeof
                    window.sceneEditor
                        .bindObjectToEditor ===
                    "function"
            ) {

                window.sceneEditor
                    .bindObjectToEditor(
                        object
                    );
            }


            if (
                typeof
                    window.sceneEditor
                        .bindWheel ===
                    "function"
            ) {

                window.sceneEditor
                    .bindWheel(
                        object
                    );
            }
        }


        return object;
    }


    /* =====================================================
       EXPORT CLEAN CONFIG
       -----------------------------------------------------
       IMPORTANT:

       Runtime wall pictures are NEVER exported.

       We identify them using:
           wallPicture
           uploadedPicture
    ===================================================== */

    getCleanConfig() {

        const objects =
            [];


        for (
            const object
            of this.objects.values()
        ) {

            const data =
                object.data;


            /*
                NEVER export runtime wall pictures.
            */

            if (
                data.wallPicture ||
                data.uploadedPicture
            ) {

                continue;
            }


            const clean = {

                id:
                    data.id,

                image:
                    data.image,

                x:
                    data.x,

                y:
                    data.y,

                width:
                    data.width,

                height:
                    data.height,

                scale:
                    data.scale !==
                    undefined

                        ? data.scale

                        : 1,

                rotation:
                    data.rotation !==
                    undefined

                        ? data.rotation

                        : 0,

                opacity:
                    data.opacity !==
                    undefined

                        ? data.opacity

                        : 1,

                z:
                    data.z !==
                    undefined

                        ? data.z

                        : 0,

                states:
                    data.states
                        ? [
                            ...data.states
                        ]
                        : undefined
            };


            if (
                data.parent
            ) {

                clean.parent =
                    data.parent;
            }


            if (
                data.clickAction
            ) {

                clean.clickAction =
                    JSON.parse(
                        JSON.stringify(
                            data.clickAction
                        )
                    );
            }


            if (
                data.visibilityGroup
            ) {

                clean.visibilityGroup =
                    data.visibilityGroup;
            }


            if (
                object.manualVisible !==
                null
            ) {

                clean.initialVisible =
                    object.manualVisible;
            }


            objects.push(
                clean
            );
        }


        return {

            width:
                this.config.width,

            height:
                this.config.height,

            background:
                this.config.background,

            startingState:
                this.config.startingState,

            objects:
                objects
        };
    }


    /* =====================================================
       COPY CONFIG / WHOLE FILE
    ===================================================== */

    copyConfig() {

        if (
            window.sceneExporter &&
            typeof window.sceneExporter.exportWholeFile ===
                "function"
        ) {

            console.log(
                "📦 Exporter detected → copying complete scene.js..."
            );


            window.sceneExporter
                .exportWholeFile();


            return this.getCleanConfig();
        }


        console.warn(
            "⚠️ scene-export.js not found."
        );


        console.warn(
            "⚠️ Falling back to copying clean config only."
        );


        const config =
            this.getCleanConfig();


        const text =
            JSON.stringify(
                config,
                null,
                4
            );


        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {

            navigator.clipboard
                .writeText(
                    text
                )
                .then(
                    () => {

                        console.log(
                            "📋 CONFIG COPIED"
                        );
                    }
                )
                .catch(
                    error => {

                        console.error(
                            "❌ Clipboard failed:",
                            error
                        );


                        this.fallbackCopy(
                            text
                        );
                    }
                );

        } else {

            this.fallbackCopy(
                text
            );
        }


        return text;
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


        textarea.style.position =
            "fixed";


        textarea.style.left =
            "-9999px";


        textarea.style.top =
            "0";


        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

        textarea.select();


        let success =
            false;


        try {

            success =
                document.execCommand(
                    "copy"
                );


            if (success) {

                console.log(
                    "📋 CONFIG COPIED"
                );

            } else {

                console.warn(
                    "⚠️ Copy command returned false."
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
}


/* =========================================================
   CURRENT SCENE CONFIG
========================================================= */

const SCENE_CONFIG = {
    "width": 1920,
    "height": 1080,
    "background": "#87CEEB",
    "startingState": "outside",
    "objects": [
        {
            "id": "beach",
            "image": "assets/beach.gif",
            "x": 692.607,
            "y": 681.739,
            "width": 1920,
            "height": 1080,
            "scale": 0.85,
            "rotation": 0,
            "opacity": 1,
            "z": 0,
            "states": [
                "outside"
            ]
        },
        {
            "id": "tree2",
            "image": "assets/tree2.gif",
            "x": 903.681,
            "y": 507.495,
            "width": 260,
            "height": 430,
            "scale": 2.3,
            "rotation": 0,
            "opacity": 1,
            "z": 17,
            "states": [
                "outside"
            ]
        },
        {
            "id": "tree1",
            "image": "assets/tree.gif",
            "x": 538.504,
            "y": 491.531,
            "width": 300,
            "height": 500,
            "scale": 2.1,
            "rotation": 0,
            "opacity": 1,
            "z": 18,
            "states": [
                "outside"
            ]
        },
        {
            "id": "house1",
            "image": "assets/house1.png",
            "x": 749.3,
            "y": 587.5,
            "width": 600,
            "height": 600,
            "scale": 0.9,
            "rotation": 0,
            "opacity": 1,
            "z": 20,
            "states": [
                "outside",
                "inside"
            ],
            "clickAction": {
                "type": "toggleVisibility",
                "group": "houses",
                "animation": "bounce"
            },
            "visibilityGroup": "houses",
            "initialVisible": true
        },
        {
            "id": "house2",
            "image": "assets/house2.png",
            "x": 749.3,
            "y": 587.5,
            "width": 600,
            "height": 600,
            "scale": 0.9,
            "rotation": 0,
            "opacity": 1,
            "z": 20,
            "states": [
                "outside",
                "inside"
            ],
            "clickAction": {
                "type": "toggleVisibility",
                "group": "houses",
                "animation": "bounce"
            },
            "visibilityGroup": "houses",
            "initialVisible": false
        },
        {
            "id": "cloud1",
            "image": "assets/cloud1.gif",
            "x": 4.72,
            "y": 242.75,
            "width": 350,
            "height": 180,
            "scale": 2.55,
            "rotation": 0,
            "opacity": 1,
            "z": 40,
            "states": [
                "outside"
            ]
        },
        {
            "id": "cloud2",
            "image": "assets/cloud2.gif",
            "x": 1385.97,
            "y": 116.188,
            "width": 400,
            "height": 200,
            "scale": 3.65,
            "rotation": 0,
            "opacity": 0.9,
            "z": 40,
            "states": [
                "outside"
            ]
        },
        {
            "id": "tree1_1",
            "image": "assets/tree1.gif",
            "x": 1288.09,
            "y": 773.215,
            "width": 1019,
            "height": 1054,
            "scale": 0.53,
            "rotation": 0,
            "opacity": 1,
            "z": 41,
            "states": [
                "outside"
            ],
            "clickAction": {
                "type": "playTreeGif"
            }
        }
    ]
};


/* =========================================================
   CREATE SCENE
========================================================= */

const scene =
    new SceneSystem(
        SCENE_CONFIG
    );


/*
    SceneSystem constructor already does:

        window.scene = this

    so we intentionally do NOT create a second
    scene assignment here.
*/


/* =========================================================
   GLOBAL HOUSE HELPERS
========================================================= */

window.enterHouse =
    function () {

        console.log(
            "🏠 enterHouse()"
        );


        if (
            window.houseInteraction &&

            typeof
                window.houseInteraction
                    .openHouse ===
                "function"
        ) {

            window.houseInteraction
                .openHouse(
                    scene.get(
                        "house2"
                    )
                );

        } else {

            scene.setState(
                "inside"
            );
        }
    };


window.leaveHouse =
    function () {

        console.log(
            "🚪 leaveHouse()"
        );


        if (
            window.houseInteraction &&

            typeof
                window.houseInteraction
                    .closeHouse ===
                "function"
        ) {

            window.houseInteraction
                .closeHouse();

        } else {

            scene.setState(
                "outside"
            );
        }
    };