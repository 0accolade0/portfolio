/* =========================================================
   CYBEROS HOLO LAB
   3D COLLECTION SYSTEM

   NO LOCAL STORAGE
   NO PERSISTENCE

   FEATURES:
   - Category folders
   - GLB model loading
   - Three.js
   - GLTFLoader
   - OrbitControls
   - Transparent background
   - Pastel hologram lighting
   - Automatic model centering
   - Automatic model scaling
   - Model browsing
   - Mouse orbit
   - Wheel zoom
========================================================= */


/* =========================================================
   THREE.JS IMPORTS
========================================================= */

import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";

import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";


/* =========================================================
   HOLOGRAM LIBRARY
========================================================= */

const HOLO_LIBRARY = {

    characters: {

        id: "characters",

        name: "Characters",

        icon: "👾",

        description:
            "Friends, creatures and little companions.",

        models: [

            {
                id: "teddy",

                name: "Teddy",

                file:
                    "./models/characters/model1.glb"

            },

            {
                id: "robot",

                name: "Little Robot",

                file:
                    "./models/characters/robot.glb"

            },

            {
                id: "cloud",

                name: "Cloud Friend",

                file:
                    "./models/characters/cloud.glb"

            }

        ]

    },


    assets: {

        id: "assets",

        name: "Assets",

        icon: "🧸",

        description:
            "Objects, props and tiny things.",

        models: [

            {
                id: "shell",

                name: "Shell",

                file:
                    "./models/assets/shell.glb"

            },

            {
                id: "flower",

                name: "Flower",

                file:
                    "./models/assets/flower.glb"

            },

            {
                id: "house",

                name: "Tiny House",

                file:
                    "./models/assets/house.glb"

            }

        ]

    },


    nature: {

        id: "nature",

        name: "Nature",

        icon: "🌿",

        description:
            "Plants, rocks and things from outside.",

        models: [

            {
                id: "mushroom",

                name: "Mushroom",

                file:
                    "./models/nature/mushroom.glb"

            },

            {
                id: "tree",

                name: "Tiny Tree",

                file:
                    "./models/nature/tree.glb"

            }

        ]

    },


    cyber: {

        id: "cyber",

        name: "Cyber",

        icon: "💿",

        description:
            "Digital objects from the CyberOS universe.",

        models: [

            {
                id: "crystal",

                name: "Cyber Crystal",

                file:
                    "./models/cyber/crystal.glb"

            },

            {
                id: "core",

                name: "Hologram Core",

                file:
                    "./models/cyber/core.glb"

            }

        ]

    }

};


/* =========================================================
   STATE
========================================================= */

let currentCategory = null;

let currentModelIndex = 0;

let currentModelObject = null;

let animationFrame = null;


/* =========================================================
   THREE.JS STATE
========================================================= */

let scene = null;

let camera = null;

let renderer = null;

let controls = null;

let loader = null;

let modelContainer = null;


/* =========================================================
   DOM
========================================================= */

const categoryView =
    document.getElementById(
        "category-view"
    );


const modelView =
    document.getElementById(
        "model-view"
    );


const categoryGrid =
    document.getElementById(
        "category-grid"
    );


const modelSelector =
    document.getElementById(
        "model-selector"
    );


const modelStage =
    document.getElementById(
        "model-stage"
    );


const currentCategoryLabel =
    document.getElementById(
        "current-category"
    );


const currentModelName =
    document.getElementById(
        "current-model-name"
    );


const currentModelStatus =
    document.getElementById(
        "current-model-status"
    );


const backButton =
    document.getElementById(
        "back-to-categories"
    );


const closeButton =
    document.getElementById(
        "holo-close"
    );


/* =========================================================
   CHECK DOM
========================================================= */

console.log(
    "🔬 HOLO LAB: DOM check"
);

console.log(
    "categoryView:",
    categoryView
);

console.log(
    "modelView:",
    modelView
);

console.log(
    "categoryGrid:",
    categoryGrid
);

console.log(
    "modelStage:",
    modelStage
);


/* =========================================================
   THREE.JS INITIALIZATION
========================================================= */

function initializeThree() {

    console.log(
        "🌎 HOLO LAB: Initializing Three.js"
    );


    if (!modelStage) {

        console.error(
            "❌ HOLO LAB: #model-stage not found"
        );

        return;

    }


    modelContainer =
        document.getElementById(
            "model-container"
        );


    if (!modelContainer) {

        console.error(
            "❌ HOLO LAB: #model-container not found"
        );

        return;

    }


    /* =====================================================
       SCENE
    ===================================================== */

    scene =
        new THREE.Scene();


    /*
       IMPORTANT:

       No scene.background.

       This keeps the 3D viewer transparent.
    */


    /* =====================================================
       CAMERA
    ===================================================== */

    camera =
        new THREE.PerspectiveCamera(
            35,
            1,
            0.01,
            1000
        );


    camera.position.set(
        0,
        0,
        5
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    renderer =
        new THREE.WebGLRenderer({

            antialias: true,

            alpha: true,

            powerPreference:
                "high-performance"

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.setClearColor(
        0x000000,
        0
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        0.9;


    renderer.shadowMap.enabled =
        true;


    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;


    renderer.domElement.style.display =
        "block";


    renderer.domElement.style.width =
        "100%";


    renderer.domElement.style.height =
        "100%";


    renderer.domElement.style.background =
        "transparent";


    renderer.domElement.style.backgroundColor =
        "transparent";


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
        0.08;


    controls.enablePan =
        false;


    controls.enableZoom =
        true;


    controls.zoomSpeed =
        0.8;


    controls.rotateSpeed =
        0.8;


    controls.minDistance =
        0.5;


    controls.maxDistance =
        20;


    controls.target.set(
        0,
        0,
        0
    );


    /* =====================================================
       LIGHTING
    ===================================================== */

    createHologramLighting();


    /* =====================================================
       GLTF LOADER
    ===================================================== */

    loader =
        new GLTFLoader();


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        resizeThree
    );


    resizeThree();


    /* =====================================================
       START RENDER LOOP
    ===================================================== */

    animateThree();


    console.log(
        "✨ HOLO LAB: Three.js ready"
    );

}


/* =========================================================
   HOLOGRAM LIGHTING
========================================================= */

function createHologramLighting() {

    console.log(
        "💡 HOLO LAB: Creating hologram lighting"
    );


    /* -----------------------------------------------------
       SOFT PINK HEMISPHERE
    ----------------------------------------------------- */

    const hemisphere =
        new THREE.HemisphereLight(
            0xD39DB6,
            0xDECABF,
            1.8
        );


    scene.add(
        hemisphere
    );


    /* -----------------------------------------------------
       PEACH KEY
    ----------------------------------------------------- */

    const keyLight =
        new THREE.DirectionalLight(
            0xF0D1A9,
            2.0
        );


    keyLight.position.set(
        4,
        6,
        5
    );


    keyLight.castShadow =
        true;


    keyLight.shadow.mapSize.width =
        1024;


    keyLight.shadow.mapSize.height =
        1024;


    scene.add(
        keyLight
    );


    /* -----------------------------------------------------
       LAVENDER FILL
    ----------------------------------------------------- */

    const fillLight =
        new THREE.DirectionalLight(
            0xA18EC8,
            0.65
        );


    fillLight.position.set(
        -5,
        2,
        3
    );


    scene.add(
        fillLight
    );


    /* -----------------------------------------------------
       CORAL RIM
    ----------------------------------------------------- */

    const rimLight =
        new THREE.DirectionalLight(
            0xF88B88,
            0.35
        );


    rimLight.position.set(
        -3,
        4,
        -5
    );


    scene.add(
        rimLight
    );


    /* -----------------------------------------------------
       FRONT PALE PINK
    ----------------------------------------------------- */

    const frontLight =
        new THREE.DirectionalLight(
            0xF6DDE6,
            0.45
        );


    frontLight.position.set(
        0,
        1,
        6
    );


    scene.add(
        frontLight
    );

}


/* =========================================================
   RESIZE THREE.JS
========================================================= */

function resizeThree() {

    if (
        !renderer ||
        !camera ||
        !modelContainer
    ) {

        return;

    }


    const width =
        modelContainer.clientWidth;


    const height =
        modelContainer.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return;

    }


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height,
        false
    );

}


/* =========================================================
   THREE.JS ANIMATION LOOP
========================================================= */

function animateThree() {

    animationFrame =
        requestAnimationFrame(
            animateThree
        );


    if (controls) {

        controls.update();

    }


    if (
        currentModelObject &&
        currentModelObject.userData &&
        currentModelObject.userData.autoRotate
    ) {

        currentModelObject.rotation.y +=
            0.003;

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
   CLEAR CURRENT MODEL
========================================================= */

function clearCurrentModel() {

    if (
        !currentModelObject ||
        !scene
    ) {

        return;

    }


    console.log(
        "🧹 HOLO LAB: Removing previous model"
    );


    scene.remove(
        currentModelObject
    );


    currentModelObject.traverse(
        object => {

            if (
                object.geometry
            ) {

                object.geometry.dispose();

            }


            if (
                object.material
            ) {

                if (
                    Array.isArray(
                        object.material
                    )
                ) {

                    object.material.forEach(
                        material => {

                            disposeMaterial(
                                material
                            );

                        }
                    );

                } else {

                    disposeMaterial(
                        object.material
                    );

                }

            }

        }
    );


    currentModelObject =
        null;

}


/* =========================================================
   DISPOSE MATERIAL
========================================================= */

function disposeMaterial(
    material
) {

    if (!material) {
        return;
    }


    Object.keys(
        material
    ).forEach(
        key => {

            const value =
                material[key];


            if (
                value &&
                value.isTexture
            ) {

                value.dispose();

            }

        }
    );


    material.dispose();

}


/* =========================================================
   LOAD GLB MODEL
========================================================= */

function loadModel(
    model
) {

    if (!model) {

        console.warn(
            "⚠️ HOLO LAB: No model supplied"
        );

        return;

    }


    if (!loader) {

        console.error(
            "❌ HOLO LAB: GLTFLoader not initialized"
        );

        return;

    }


    console.log(
        "📦 HOLO LAB: Loading model:",
        model.name
    );


    console.log(
        "📍 HOLO LAB: Model path:",
        model.file
    );


    currentModelStatus.textContent =
        "SCANNING...";


    clearCurrentModel();


    /*
       Small delay makes the
       scanning state visible.
    */

    setTimeout(
        () => {

            loader.load(

                model.file,


                /* =========================================
                   SUCCESS
                ========================================== */

                gltf => {

                    console.log(
                        "✅ HOLO LAB: GLB loaded:",
                        model.name
                    );


                    const object =
                        gltf.scene;


                    currentModelObject =
                        object;


                    prepareModel(
                        object
                    );


                    scene.add(
                        object
                    );


                    currentModelStatus.textContent =
                        "HOLOGRAM READY";


                    console.log(
                        "✨ HOLO LAB: Model displayed:",
                        model.name
                    );

                },


                /* =========================================
                   PROGRESS
                ========================================== */

                xhr => {

                    if (
                        xhr.total
                    ) {

                        const percent =
                            (
                                xhr.loaded /
                                xhr.total
                            ) * 100;


                        currentModelStatus.textContent =
                            `SCANNING ${Math.round(percent)}%`;


                        console.log(
                            `🔬 HOLO LAB: ${model.name} ${Math.round(percent)}%`
                        );

                    } else {

                        currentModelStatus.textContent =
                            "SCANNING...";

                    }

                },


                /* =========================================
                   ERROR
                ========================================== */

                error => {

                    console.error(
                        "❌ HOLO LAB: Failed to load GLB:",
                        model.file
                    );


                    console.error(
                        error
                    );


                    currentModelStatus.textContent =
                        "MODEL NOT FOUND";

                }

            );

        },

        250
    );

}


/* =========================================================
   PREPARE MODEL
========================================================= */

function prepareModel(
    object
) {

    console.log(
        "🧊 HOLO LAB: Preparing model"
    );


    /* -----------------------------------------------------
       ENABLE SHADOWS
    ----------------------------------------------------- */

    object.traverse(
        child => {

            if (
                child.isMesh
            ) {

                child.castShadow =
                    true;


                child.receiveShadow =
                    true;


                /*
                   Make sure textures display
                   correctly with modern Three.js.
                */

                if (
                    child.material
                ) {

                    if (
                        Array.isArray(
                            child.material
                        )
                    ) {

                        child.material.forEach(
                            material => {

                                if (
                                    material.map
                                ) {

                                    material.map.colorSpace =
                                        THREE.SRGBColorSpace;

                                }

                            }
                        );

                    } else {

                        if (
                            child.material.map
                        ) {

                            child.material.map.colorSpace =
                                THREE.SRGBColorSpace;

                        }

                    }

                }

            }

        }
    );


    /* -----------------------------------------------------
       FIND BOUNDING BOX
    ----------------------------------------------------- */

    const box =
        new THREE.Box3().setFromObject(
            object
        );


    const size =
        box.getSize(
            new THREE.Vector3()
        );


    const center =
        box.getCenter(
            new THREE.Vector3()
        );


    console.log(
        "📐 HOLO LAB: Model size:",
        size
    );


    console.log(
        "📍 HOLO LAB: Model center:",
        center
    );


    /* -----------------------------------------------------
       CENTER MODEL
    ----------------------------------------------------- */

    object.position.x -=
        center.x;


    object.position.y -=
        center.y;


    object.position.z -=
        center.z;


    /* -----------------------------------------------------
       SCALE MODEL
    ----------------------------------------------------- */

    const maxDimension =
        Math.max(
            size.x,
            size.y,
            size.z
        );


    if (
        maxDimension > 0
    ) {

        const targetSize =
            3;


        const scale =
            targetSize /
            maxDimension;


        object.scale.setScalar(
            scale
        );


        console.log(
            "📏 HOLO LAB: Model scale:",
            scale
        );

    }


    /* -----------------------------------------------------
       RESET ROTATION
    ----------------------------------------------------- */

    object.rotation.set(
        0,
        0,
        0
    );


    /*
       Enable the tiny automatic rotation.

       This can be disabled later if
       you want completely manual OrbitControls.
    */

    object.userData.autoRotate =
        false;


    /* -----------------------------------------------------
       RESET CAMERA
    ----------------------------------------------------- */

    camera.position.set(
        0,
        0,
        5
    );


    controls.target.set(
        0,
        0,
        0
    );


    controls.update();


    resizeThree();

}


/* =========================================================
   VIEW SWITCHING
========================================================= */

function showCategoryView() {

    console.log(
        "🗂️ HOLO LAB: Showing category view"
    );


    categoryView.classList.add(
        "active"
    );


    modelView.classList.remove(
        "active"
    );


    if (currentModelStatus) {

        currentModelStatus.textContent =
            "READY";

    }

}


function showModelView() {

    console.log(
        "🧊 HOLO LAB: Showing model view"
    );


    categoryView.classList.remove(
        "active"
    );


    modelView.classList.add(
        "active"
    );


    /*
       The model container can have
       zero dimensions while hidden.

       Resize after displaying it.
    */

    requestAnimationFrame(
        () => {

            resizeThree();

        }
    );

}


/* =========================================================
   BUILD CATEGORY CARDS
========================================================= */

function buildCategoryCards() {

    console.log(
        "📁 HOLO LAB: Building category folders"
    );


    categoryGrid.innerHTML = "";


    Object.values(
        HOLO_LIBRARY
    ).forEach(
        category => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "category-card";


            card.innerHTML = `

                <div class="category-icon">
                    ${category.icon}
                </div>

                <div class="category-name">
                    ${category.name}
                </div>

                <div class="category-description">
                    ${category.description}
                </div>

                <div class="category-count">
                    ${category.models.length} HOLOGRAMS
                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    console.log(
                        "📁 HOLO LAB: Category selected:",
                        category.name
                    );


                    openCategory(
                        category.id
                    );

                }
            );


            categoryGrid.appendChild(
                card
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

    const category =
        HOLO_LIBRARY[
            categoryId
        ];


    if (!category) {

        console.warn(
            "⚠️ HOLO LAB: Category not found:",
            categoryId
        );

        return;

    }


    currentCategory =
        category;


    currentModelIndex =
        0;


    console.log(
        "📂 HOLO LAB: Opened category:",
        category.name
    );


    buildModelSelector();


    showModelView();


    updateModelInfo();


    /*
       IMPORTANT:

       Actually load the selected
       GLB model.
    */

    loadSelectedModel();

}


/* =========================================================
   BUILD MODEL SELECTOR
========================================================= */

function buildModelSelector() {

    modelSelector.innerHTML = "";


    if (!currentCategory) {

        return;

    }


    currentCategory.models.forEach(
        (model, index) => {

            const dot =
                document.createElement(
                    "button"
                );


            dot.type =
                "button";


            dot.className =
                "model-dot";


            if (
                index ===
                currentModelIndex
            ) {

                dot.classList.add(
                    "active"
                );

            }


            dot.title =
                model.name;


            dot.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    currentModelIndex =
                        index;


                    updateModelInfo();


                    loadSelectedModel();

                }
            );


            modelSelector.appendChild(
                dot
            );

        }
    );

}


/* =========================================================
   LOAD SELECTED MODEL
========================================================= */

function loadSelectedModel() {

    if (!currentCategory) {

        return;

    }


    const model =
        currentCategory.models[
            currentModelIndex
        ];


    if (!model) {

        return;

    }


    loadModel(
        model
    );

}


/* =========================================================
   UPDATE MODEL INFORMATION
========================================================= */

function updateModelInfo() {

    if (!currentCategory) {

        return;

    }


    const model =
        currentCategory.models[
            currentModelIndex
        ];


    if (!model) {

        return;

    }


    currentCategoryLabel.textContent =
        currentCategory.name.toUpperCase();


    currentModelName.textContent =
        model.name.toUpperCase();


    currentModelStatus.textContent =
        "SCANNING...";


    document
        .querySelectorAll(
            ".model-dot"
        )
        .forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "active",
                    index ===
                    currentModelIndex
                );

            }
        );


    console.log(
        "🔬 HOLO LAB: Selected model:",
        model.name
    );


    console.log(
        "📦 HOLO LAB: File:",
        model.file
    );

}


/* =========================================================
   MODEL BROWSING
========================================================= */

function nextModel() {

    if (!currentCategory) {

        return;

    }


    const count =
        currentCategory.models.length;


    if (!count) {

        return;

    }


    currentModelIndex =
        (
            currentModelIndex + 1
        ) % count;


    updateModelInfo();


    loadSelectedModel();

}


function previousModel() {

    if (!currentCategory) {

        return;

    }


    const count =
        currentCategory.models.length;


    if (!count) {

        return;

    }


    currentModelIndex =
        (
            currentModelIndex - 1 + count
        ) % count;


    updateModelInfo();


    loadSelectedModel();

}


/* =========================================================
   MOUSE WHEEL MODEL BROWSING
========================================================= */

modelView.addEventListener(
    "wheel",
    event => {

        if (
            !modelView.classList.contains(
                "active"
            )
        ) {

            return;

        }


        /*
           IMPORTANT:

           If the pointer is directly over
           the Three.js canvas, let OrbitControls
           handle the wheel for ZOOM.

           Only use wheel browsing outside
           the model container.
        */

        if (
            modelContainer &&
            modelContainer.contains(
                event.target
            )
        ) {

            return;

        }


        if (
            Math.abs(
                event.deltaY
            ) < 8
        ) {

            return;

        }


        event.preventDefault();


        if (
            event.deltaY > 0
        ) {

            nextModel();

        } else {

            previousModel();

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   KEYBOARD MODEL BROWSING
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !modelView.classList.contains(
                "active"
            )
        ) {

            return;

        }


        if (
            event.key === "ArrowRight"
        ) {

            nextModel();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            previousModel();

        }

    }
);


/* =========================================================
   BACK TO HOLO LAB
========================================================= */

backButton.addEventListener(
    "click",
    () => {

        console.log(
            "↩️ HOLO LAB: Returning to categories"
        );


        clearCurrentModel();


        currentCategory =
            null;


        showCategoryView();

    }
);


/* =========================================================
   CLOSE HOLO LAB
========================================================= */

closeButton.addEventListener(
    "click",
    () => {

        console.log(
            "✕ HOLO LAB: Close requested"
        );


        try {

            if (
                window.parent &&
                window.parent !== window &&
                typeof
                window.parent.close3DWorld ===
                "function"
            ) {

                window.parent.close3DWorld();

            }

        } catch (
            error
        ) {

            console.warn(
                "⚠️ HOLO LAB: Could not close through CyberOS:",
                error
            );

        }

    }
);


/* =========================================================
   ESCAPE
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


        /*
           If viewing a model:

           ESC → categories
        */

        if (
            modelView.classList.contains(
                "active"
            )
        ) {

            event.preventDefault();


            event.stopPropagation();


            console.log(
                "↩️ HOLO LAB: ESC → categories"
            );


            clearCurrentModel();


            currentCategory =
                null;


            showCategoryView();


            return;

        }

    },
    true
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeHoloLab() {

    console.log(
        "✨ CYBEROS HOLO LAB INITIALIZING"
    );


    initializeThree();


    buildCategoryCards();


    showCategoryView();


    console.log(
        "✨ CYBEROS HOLO LAB READY"
    );

}


initializeHoloLab();