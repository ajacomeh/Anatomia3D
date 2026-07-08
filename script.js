// ==========================
// CONTENEDOR
// ==========================

const visor = document.getElementById("visor3D");


// ==========================
// BOTONES
// ==========================

const btnHuesos = document.getElementById("btnHuesos");
const btnMusculos = document.getElementById("btnMusculos");


// ==========================
// ESCENA
// ==========================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x202124);


// ==========================
// CÁMARA
// ==========================

const camera = new THREE.PerspectiveCamera(
    45,
    visor.clientWidth / visor.clientHeight,
    0.1,
    1000
);

camera.position.set(0,1.5,6);


// ==========================
// RENDER
// ==========================

const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(
    visor.clientWidth,
    visor.clientHeight
);

renderer.setPixelRatio(
    window.devicePixelRatio
);

visor.appendChild(renderer.domElement);


// ==========================
// CONTROLES DEL MOUSE
// ==========================

const controls = new THREE.OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;


// ==========================
// LUCES
// ==========================

scene.add(
    new THREE.AmbientLight(0xffffff,2)
);


const luz = new THREE.DirectionalLight(
    0xffffff,
    3
);

luz.position.set(5,10,5);

scene.add(luz);


// ==========================
// CARGADOR
// ==========================

const loader = new THREE.GLTFLoader();


let cuerpo = null;
let esqueleto = null;
let musculos = null;


// ==========================
// CUERPO INICIAL
// ==========================

loader.load(

    "modelos/Cuerpo.glb",

    function(gltf){

        cuerpo = gltf.scene;

        cuerpo.scale.set(
            2.7,
            2.7,
            2.7
        );

        cuerpo.position.set(
            0,
            0.2,
            0
        );

        scene.add(cuerpo);

        console.log("Cuerpo cargado");

    }

);


// ==========================
// ESQUELETO
// ==========================

loader.load(

    "modelos/Esqueleto.glb",

    function(gltf){

        esqueleto = gltf.scene;

        esqueleto.scale.set(
            0.07,
            0.07,
            0.07
        );

        esqueleto.position.set(
            0,
            0.65,
            0
        );

        scene.add(esqueleto);

        esqueleto.visible = false;

        console.log("Esqueleto cargado");

    }

);


// ==========================
// MÚSCULOS
// ==========================

loader.load(

    "modelos/Musculos.glb",

    function(gltf){

        musculos = gltf.scene;

        musculos.scale.set(
            0.0265,
            0.0265,
            0.0265
        );

        musculos.position.set(
            0,
            1,
            0
        );

        scene.add(musculos);

        musculos.visible = false;

        console.log("Músculos cargados");

    }

);


// ==========================
// BOTONES
// ==========================

btnHuesos.onclick = function(){

    if(cuerpo) cuerpo.visible = false;

    if(esqueleto) esqueleto.visible = true;

    if(musculos) musculos.visible = false;

};


btnMusculos.onclick = function(){

    if(cuerpo) cuerpo.visible = false;

    if(esqueleto) esqueleto.visible = false;

    if(musculos) musculos.visible = true;

};


// ==========================
// ANIMACIÓN
// ==========================

function animar(){

    requestAnimationFrame(animar);


    controls.update();


    if(cuerpo){

        cuerpo.rotation.y += 0.003;

    }


    if(esqueleto){

        esqueleto.rotation.y += 0.003;

    }


    if(musculos){

        musculos.rotation.y += 0.003;

    }


    renderer.render(
        scene,
        camera
    );

}


animar();


// ==========================
// RESPONSIVE
// ==========================

window.addEventListener(
"resize",
()=>{

    camera.aspect =
    visor.clientWidth /
    visor.clientHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        visor.clientWidth,
        visor.clientHeight
    );

});