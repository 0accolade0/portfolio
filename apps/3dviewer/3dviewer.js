import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import {
    HOLO_LIBRARY,
    MINI_PREVIEW_SCALE,
    MINI_PREVIEW_Y
} from "./holo-library.js";

let currentCategory = null;
let currentModelIndex = 0;
let modelRoot = null;

let scene;
let camera;
let renderer;
let controls;
let loader;

let modelLoadToken = 0;

const modelCache = new Map();

const miniRenderers = [];
const miniScenes = [];
const miniRoots = [];

const categoryView =
    document.getElementById("category-view");

const modelView =
    document.getElementById("model-view");

const categoryGrid =
    document.getElementById("category-grid");

const modelContainer =
    document.getElementById("model-container");


/* =========================================================
   OFFSIDE FONT
========================================================= */

function setupOffsideFont() {
    if (!document.getElementById("offside-font")) {
        const fontLink =
            document.createElement("link");

        fontLink.id = "offside-font";
        fontLink.rel = "stylesheet";
        fontLink.href =
            "https://fonts.googleapis.com/css2?family=Offside&display=swap";

        document.head.appendChild(fontLink);
    }

    if (!document.getElementById("offside-global-style")) {
        const fontStyle =
            document.createElement("style");

        fontStyle.id =
            "offside-global-style";

        fontStyle.textContent = `
            html,
            body,
            button,
            input,
            textarea,
            select,
            #category-view,
            #model-view,
            #category-grid,
            #model-container,
            #model-info-wrapper {
                font-family: "Offside", sans-serif !important;
            }
        `;

        document.head.appendChild(fontStyle);
    }
}


/* =========================================================
   MAIN THREE.JS SCENE
========================================================= */

function initMainScene() {
    scene =
        new THREE.Scene();

    camera =
        new THREE.PerspectiveCamera(
            45,
            window.innerWidth /
            window.innerHeight,
            0.001,
            10000
        );

    camera.position.set(
        0,
        1,
        5
    );

    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.setClearColor(
        0x000000,
        0
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    renderer.domElement.style.display =
        "block";

    renderer.domElement.style.width =
        "100%";

    renderer.domElement.style.height =
        "100%";

    modelContainer.appendChild(
        renderer.domElement
    );


    /* =====================================================
       ORBIT CONTROLS
    ===================================================== */

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );

    controls.enableDamping =
        true;

    controls.dampingFactor =
        0.075;

    controls.enablePan =
        true;

    controls.screenSpacePanning =
        true;

    controls.rotateSpeed =
        0.8;

    controls.zoomSpeed =
        1;

    controls.panSpeed =
        0.8;

    controls.minDistance =
        0.01;

    controls.maxDistance =
        10000;

    controls.mouseButtons = {
        LEFT:
            THREE.MOUSE.ROTATE,

        MIDDLE:
            THREE.MOUSE.DOLLY,

        RIGHT:
            THREE.MOUSE.PAN
    };

    controls.touches = {
        ONE:
            THREE.TOUCH.ROTATE,

        TWO:
            THREE.TOUCH.DOLLY_PAN
    };

    controls.target.set(
        0,
        0,
        0
    );


    /* =====================================================
       LIGHTING
    ===================================================== */

    scene.add(
        new THREE.HemisphereLight(
            0xffffff,
            0x888888,
            2.5
        )
    );

    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            4
        );

    keyLight.position.set(
        5,
        10,
        8
    );

    scene.add(
        keyLight
    );

    const fillLight =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );

    fillLight.position.set(
        -5,
        4,
        -5
    );

    scene.add(
        fillLight
    );

    const rimLight =
        new THREE.DirectionalLight(
            0xffffff,
            1.5
        );

    rimLight.position.set(
        0,
        5,
        -10
    );

    scene.add(
        rimLight
    );


    /* =====================================================
       GLTF + DRACO
    ===================================================== */

    loader =
        new GLTFLoader();

    const dracoLoader =
        new DRACOLoader();

    dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );

    loader.setDRACOLoader(
        dracoLoader
    );


    /* =====================================================
       EVENTS
    ===================================================== */

    window.addEventListener(
        "resize",
        resizeMain
    );

    renderer.domElement.addEventListener(
        "dblclick",
        frameCurrentModel
    );

    animate();
}


/* =========================================================
   RESIZE
========================================================= */

function resizeMain() {
    if (
        !camera ||
        !renderer
    ) {
        return;
    }

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}


/* =========================================================
   ANIMATION LOOP
========================================================= */

function animate() {
    requestAnimationFrame(
        animate
    );

    miniRoots.forEach(
        root => {
            if (root) {
                root.rotation.y += 0.008;
            }
        }
    );

    miniRenderers.forEach(
        (
            miniRenderer,
            index
        ) => {
            if (
                miniRenderer &&
                miniScenes[index]
            ) {
                miniRenderer.render(
                    miniScenes[index],
                    miniRenderer.cameraRef
                );
            }
        }
    );

    if (controls) {
        controls.update();
    }

    if (
        renderer &&
        scene &&
        camera
    ) {
        renderer.render(
            scene,
            camera
        );
    }
}


/* =========================================================
   BUILD CATEGORY CARDS
========================================================= */

function buildCategories() {
    categoryGrid.innerHTML = "";

    miniRenderers.length = 0;
    miniScenes.length = 0;
    miniRoots.length = 0;

    Object.values(
        HOLO_LIBRARY
    ).forEach(
        (
            category,
            index
        ) => {

            const column =
                document.createElement(
                    "div"
                );

            column.className =
                `category-column card-${category.id}-col`;

            column.innerHTML = `
                <div
                    class="category-card"
                    id="card-${index}"
                >
                    <div
                        class="card-canvas-container"
                        id="mini-container-${index}"
                    ></div>
                </div>

                <button
                    class="category-btn-pill"
                    id="pill-${index}"
                    type="button"
                >
                    ${category.name.toUpperCase()}
                </button>
            `;

            column.addEventListener(
                "click",
                () => {
                    openCategory(
                        category.id
                    );
                }
            );

            categoryGrid.appendChild(
                column
            );

            initMiniPreview(
                index,
                category.models[0]
            );
        }
    );
}


/* =========================================================
   MINI PREVIEW
========================================================= */

function initMiniPreview(
    index,
    modelInfo
) {
    const container =
        document.getElementById(
            `mini-container-${index}`
        );

    if (!container) {
        return;
    }

    const width =
        container.clientWidth ||
        window.innerWidth / 3;

    const height =
        container.clientHeight ||
        window.innerHeight;

    const miniScene =
        new THREE.Scene();

    const miniCamera =
        new THREE.PerspectiveCamera(
            35,
            width / height,
            0.01,
            5000
        );

    miniCamera.position.set(
        0,
        0,
        7
    );

    miniCamera.lookAt(
        0,
        0,
        0
    );

    const miniRenderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    miniRenderer.setSize(
        width,
        height
    );

    miniRenderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    miniRenderer.outputColorSpace =
        THREE.SRGBColorSpace;

    container.appendChild(
        miniRenderer.domElement
    );

    miniRenderer.cameraRef =
        miniCamera;


    /* =====================================================
       MINI LIGHTING
    ===================================================== */

    miniScene.add(
        new THREE.HemisphereLight(
            0xffffff,
            0x888888,
            2.5
        )
    );

    const light =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    light.position.set(
        5,
        10,
        8
    );

    miniScene.add(
        light
    );

    miniRenderers.push(
        miniRenderer
    );

    miniScenes.push(
        miniScene
    );

    miniRoots.push(
        null
    );


    /* =====================================================
       LOAD PREVIEW MODEL
    ===================================================== */

    loader.load(
        modelInfo.file,

        gltf => {

            const root =
                gltf.scene;

            const box =
                new THREE.Box3()
                    .setFromObject(
                        root
                    );

            const center =
                box.getCenter(
                    new THREE.Vector3()
                );

            root.position.sub(
                center
            );

            const scale =
                MINI_PREVIEW_SCALE[index] ??
                1;

            const y =
                MINI_PREVIEW_Y[index] ??
                0;

            root.scale.setScalar(
                scale
            );

            root.position.y +=
                y;

            miniScene.add(
                root
            );

            miniRoots[index] =
                root;
        },

        undefined,

        error => {

            console.error(
                "[3D VIEWER] Preview failed:",
                modelInfo.file,
                error
            );

        }
    );
}


/* =========================================================
   CATEGORY VIEW
========================================================= */

function showCategoryView() {
    categoryView.classList.add(
        "active"
    );

    modelView.classList.remove(
        "active"
    );

    if (modelRoot) {
        scene.remove(
            modelRoot
        );
    }

    modelRoot = null;

    if (controls) {

        controls.target.set(
            0,
            0,
            0
        );

        controls.update();

    }
}


/* =========================================================
   MODEL VIEW
========================================================= */

function showModelView() {
    categoryView.classList.remove(
        "active"
    );

    modelView.classList.add(
        "active"
    );

    resizeMain();
}


/* =========================================================
   MODEL UI CONTROLS
========================================================= */

function buildUIControls() {

    let infoWrapper =
        document.getElementById(
            "model-info-wrapper"
        );

    if (!infoWrapper) {

        infoWrapper =
            document.createElement(
                "div"
            );

        infoWrapper.id =
            "model-info-wrapper";

        infoWrapper.className =
            "model-info-wrapper";

        modelView.appendChild(
            infoWrapper
        );
    }

    const currentModel =
        currentCategory.models[
            currentModelIndex
        ];

    infoWrapper.innerHTML = `
        <button
            class="model-nav-btn"
            id="prev-model-btn"
            type="button"
            aria-label="Previous model"
        >
            &lt;
        </button>

        <div class="model-info-card">
            <div
                class="model-name-pill"
                id="current-model-name"
            >
                ${currentModel.name.toUpperCase()}
            </div>

            <div
                class="model-status"
                id="current-model-status"
            >
                LOADING...
            </div>
        </div>

        <button
            class="model-nav-btn"
            id="next-model-btn"
            type="button"
            aria-label="Next model"
        >
            &gt;
        </button>
    `;


    /* =====================================================
       PREVIOUS
    ===================================================== */

    const previousButton =
        document.getElementById(
            "prev-model-btn"
        );

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                currentModelIndex =
                    (
                        currentModelIndex -
                        1 +
                        currentCategory.models.length
                    ) %
                    currentCategory.models.length;

                buildUIControls();

                loadModel();

            }
        );
    }


    /* =====================================================
       NEXT
    ===================================================== */

    const nextButton =
        document.getElementById(
            "next-model-btn"
        );

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                currentModelIndex =
                    (
                        currentModelIndex +
                        1
                    ) %
                    currentCategory.models.length;

                buildUIControls();

                loadModel();

            }
        );
    }
}


/* =========================================================
   STATUS UPDATE — FORCE ALL STATUS ELEMENTS
========================================================= */

function setModelStatus(
    text,
    token
) {
    if (
        token !== undefined &&
        token !== modelLoadToken
    ) {
        console.warn(
            "[3D VIEWER STATUS] Ignored stale status:",
            text
        );

        return;
    }

    const statuses =
        document.querySelectorAll(
            ".model-status"
        );

    console.log(
        "[3D VIEWER STATUS] Updating elements:",
        statuses.length,
        "->",
        text
    );

    if (!statuses.length) {

        console.warn(
            "[3D VIEWER STATUS] ❌ No .model-status elements found"
        );

        return;
    }

    statuses.forEach(
        (status, index) => {

            status.textContent =
                text;

            status.innerText =
                text;

            status.innerHTML =
                text;

            status.setAttribute(
                "data-status",
                text
            );

            status.style.setProperty(
                "display",
                "block",
                "important"
            );

            status.style.setProperty(
                "visibility",
                "visible",
                "important"
            );

            status.style.setProperty(
                "opacity",
                "1",
                "important"
            );

            console.log(
                `[3D VIEWER STATUS] Element ${index}:`,
                {
                    textContent:
                        status.textContent,

                    innerText:
                        status.innerText,

                    html:
                        status.innerHTML,

                    dataStatus:
                        status.dataset.status,

                    element:
                        status
                }
            );
        }
    );

    /* =====================================================
       EXTRA CHECK
       Verify what the browser sees after the DOM update.
    ===================================================== */

    requestAnimationFrame(
        () => {

            document
                .querySelectorAll(
                    ".model-status"
                )
                .forEach(
                    (
                        status,
                        index
                    ) => {

                        console.log(
                            `[3D VIEWER STATUS] DOM CHECK ${index}:`,
                            status.textContent
                        );

                    }
                );

        }
    );
}


/* =========================================================
   FORCE FINAL LOADED STATE
========================================================= */

function forceLoadedStatus(token) {

    if (
        token !== modelLoadToken
    ) {
        return;
    }

    console.log(
        "[3D VIEWER] 🔐 FORCE FINAL STATUS -> LOADED"
    );

    setModelStatus(
        "LOADED",
        token
    );

    /*
     * One more pass on the next frame.
     * This catches any UI refresh that may have
     * recreated/replaced the status element.
     */
    requestAnimationFrame(
        () => {

            if (
                token !== modelLoadToken
            ) {
                return;
            }

            const statuses =
                document.querySelectorAll(
                    ".model-status"
                );

            statuses.forEach(
                status => {

                    status.textContent =
                        "LOADED";

                    status.innerText =
                        "LOADED";

                    status.setAttribute(
                        "data-status",
                        "LOADED"
                    );

                }
            );

            console.log(
                "[3D VIEWER] ✅ FINAL DOM STATUS:",
                Array.from(
                    statuses
                ).map(
                    status =>
                        status.textContent
                )
            );

        }
    );
}


/* =========================================================
   OPEN CATEGORY
========================================================= */

function openCategory(
    categoryId
) {
    currentCategory =
        HOLO_LIBRARY[
            categoryId
        ];

    currentModelIndex =
        0;

    buildUIControls();

    showModelView();

    loadModel();
}


/* =========================================================
   MODEL ALIGNMENT
========================================================= */

function applyModelAlignment(
    root,
    model
) {
    const a =
        model.alignment || {};

    const modelGroup =
        new THREE.Group();

    const pivotX =
        a.pivotX ?? 0;

    const pivotY =
        a.pivotY ?? 0;

    const pivotZ =
        a.pivotZ ?? 0;

    modelGroup.position.set(
        a.x ?? 0,
        a.y ?? 0,
        a.z ?? 0
    );

    root.position.set(
        -pivotX,
        -pivotY,
        -pivotZ
    );

    root.rotation.set(
        THREE.MathUtils.degToRad(
            a.rotationX ?? 0
        ),

        THREE.MathUtils.degToRad(
            a.rotationY ?? 0
        ),

        THREE.MathUtils.degToRad(
            a.rotationZ ?? 0
        )
    );

    root.scale.setScalar(
        a.scale ?? 1
    );

    modelGroup.add(
        root
    );

    return modelGroup;
}


/* =========================================================
   FRAME CURRENT MODEL
========================================================= */

function frameCurrentModel() {

    if (!modelRoot) {
        return;
    }

    frameModel(
        modelRoot,
        1.25
    );
}


/* =========================================================
   FRAME MODEL
========================================================= */

function frameModel(
    object,
    padding = 1.25
) {
    const box =
        new THREE.Box3()
            .setFromObject(
                object
            );

    if (box.isEmpty()) {

        console.warn(
            "Cannot frame empty model"
        );

        return;
    }

    const sphere =
        box.getBoundingSphere(
            new THREE.Sphere()
        );

    const center =
        sphere.center;

    const radius =
        Math.max(
            sphere.radius,
            0.01
        );

    const fov =
        THREE.MathUtils.degToRad(
            camera.fov
        );

    const distance =
        (
            radius *
            padding
        ) /
        Math.sin(
            fov / 2
        );

    const direction =
        new THREE.Vector3(
            0,
            0.35,
            1
        ).normalize();

    const newPosition =
        center.clone().add(
            direction.multiplyScalar(
                distance
            )
        );

    camera.position.copy(
        newPosition
    );

    controls.target.copy(
        center
    );

    camera.near =
        Math.max(
            radius / 1000,
            0.001
        );

    camera.far =
        Math.max(
            radius * 100,
            1000
        );

    camera.updateProjectionMatrix();

    controls.minDistance =
        Math.max(
            radius * 0.05,
            0.001
        );

    controls.maxDistance =
        Math.max(
            radius * 100,
            1000
        );

    controls.update();
}


/* =========================================================
   LOAD MODEL
========================================================= */

async function loadModel() {

    if (!currentCategory) {
        return;
    }

    const model =
        currentCategory.models[
            currentModelIndex
        ];

    const token =
        ++modelLoadToken;

    console.log(
        "=============================================="
    );

    console.log(
        "[3D VIEWER] START LOAD:",
        model.file
    );

    console.log(
        "[3D VIEWER] TOKEN:",
        token
    );

    console.log(
        "=============================================="
    );


    /* =====================================================
       REMOVE PREVIOUS MODEL
    ===================================================== */

    if (modelRoot) {

        scene.remove(
            modelRoot
        );

        modelRoot = null;

    }


    /* =====================================================
       INITIAL STATUS
    ===================================================== */

    setModelStatus(
        "LOADING...",
        token
    );


    /* =====================================================
       MODEL SETUP
    ===================================================== */

    const setupModel =
        root => {

            if (
                token !== modelLoadToken
            ) {

                console.log(
                    "[3D VIEWER] Ignoring old model:",
                    model.file
                );

                return false;
            }

            modelRoot =
                applyModelAlignment(
                    root,
                    model
                );

            scene.add(
                modelRoot
            );

            return true;
        };


    /* =====================================================
       CACHE
    ===================================================== */

    if (
        modelCache.has(
            model.file
        )
    ) {

        console.log(
            "[3D VIEWER] Using cached model:",
            model.file
        );

        const cached =
            modelCache.get(
                model.file
            );

        /*
         * Cached means already loaded.
         */
        forceLoadedStatus(
            token
        );

        const success =
            setupModel(
                cached.clone(true)
            );

        if (!success) {
            return;
        }

        try {

            frameModel(
                modelRoot,
                1.3
            );

        } catch (error) {

            console.error(
                "[3D VIEWER] Frame error:",
                error
            );

        }

        return;
    }


    /* =====================================================
       REAL MODEL LOAD
    ===================================================== */

    try {

        const gltf =
            await loader.loadAsync(
                model.file,

                xhr => {

                    if (
                        token !== modelLoadToken
                    ) {
                        return;
                    }

                    if (
                        xhr &&
                        xhr.lengthComputable &&
                        xhr.total > 0
                    ) {

                        const percent =
                            Math.round(
                                (
                                    xhr.loaded /
                                    xhr.total
                                ) *
                                100
                            );

                        if (
                            percent < 100
                        ) {

                            setModelStatus(
                                `LOADING ${percent}%`,
                                token
                            );

                        }

                    }

                }
            );


        /* =================================================
           MODEL LOAD COMPLETED
        ================================================= */

        if (
            token !== modelLoadToken
        ) {

            console.log(
                "[3D VIEWER] Loaded old model ignored:",
                model.file
            );

            return;
        }

        console.log(
            "=============================================="
        );

        console.log(
            "[3D VIEWER] GLTF LOAD COMPLETE:",
            model.file
        );

        console.log(
            "[3D VIEWER] LOAD TOKEN:",
            token
        );

        console.log(
            "[3D VIEWER] SCENE:",
            gltf.scene
        );

        console.log(
            "=============================================="
        );


        /* =================================================
           *** FINAL STATUS ***
        ================================================= */

        forceLoadedStatus(
            token
        );


        /* =================================================
           CACHE
        ================================================= */

        try {

            modelCache.set(
                model.file,
                gltf.scene.clone(true)
            );

            console.log(
                "[3D VIEWER] Model cached successfully"
            );

        } catch (error) {

            console.error(
                "[3D VIEWER] Cache error:",
                error
            );

        }


        /* =================================================
           ADD MODEL
        ================================================= */

        try {

            const success =
                setupModel(
                    gltf.scene.clone(true)
                );

            if (!success) {
                return;
            }

            console.log(
                "[3D VIEWER] Model added to scene"
            );

        } catch (error) {

            console.error(
                "[3D VIEWER] Model setup error:",
                error
            );

        }


        /* =================================================
           FRAME MODEL
        ================================================= */

        try {

            if (modelRoot) {

                frameModel(
                    modelRoot,
                    1.3
                );

                console.log(
                    "[3D VIEWER] Model framed"
                );

            }

        } catch (error) {

            console.error(
                "[3D VIEWER] Frame error:",
                error
            );

        }

        /*
         * Absolute final safety pass.
         */
        forceLoadedStatus(
            token
        );

    } catch (error) {

        if (
            token !== modelLoadToken
        ) {
            return;
        }

        console.error(
            "=============================================="
        );

        console.error(
            "[3D VIEWER] MODEL LOAD ERROR:",
            model.file,
            error
        );

        console.error(
            "=============================================="
        );

        setModelStatus(
            "ERROR",
            token
        );

    }
}


/* =========================================================
   MODEL BACK BUTTON
========================================================= */

const backToCategories =
    document.getElementById(
        "back-to-categories"
    );

if (backToCategories) {

    backToCategories.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            showCategoryView();

        }
    );
}


/* =========================================================
   HOME BACK BUTTON
========================================================= */

const backToCyber =
    document.getElementById(
        "back-to-cyber"
    );

if (backToCyber) {

    backToCyber.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            window.location.href =
                "./index.html";

        }
    );
}


/* =========================================================
   CLOSE BUTTON
========================================================= */

const closeButton =
    document.getElementById(
        "holo-close"
    );

if (closeButton) {

    closeButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            try {

                if (
                    window.parent &&
                    window.parent !== window &&
                    typeof window.parent
                        .close3DWorld ===
                        "function"
                ) {

                    window.parent.close3DWorld();

                    return;
                }

            } catch (error) {

                console.warn(
                    "Could not close parent viewer:",
                    error
                );

            }

            window.location.href =
                "./index.html";

        }
    );
}


/* =========================================================
   INIT
========================================================= */

setupOffsideFont();

initMainScene();

buildCategories();

showCategoryView();