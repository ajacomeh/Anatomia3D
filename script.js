//====================================================
// PROYECTO ANATOMÍA 3D
//====================================================


const visor = document.getElementById("visor3D");

const info = document.getElementById("info");


//====================================================
// ESCENA
//====================================================

const escena = new THREE.Scene();

escena.background = new THREE.Color(0x202124);



//====================================================
// CAMARA
//====================================================

const camara = new THREE.PerspectiveCamera(

45,

visor.clientWidth / visor.clientHeight,

0.1,

1000

);


camara.position.set(0,150,300);



//====================================================
// RENDER
//====================================================

const renderer = new THREE.WebGLRenderer({

antialias:true

});


renderer.setPixelRatio(
window.devicePixelRatio
);


renderer.setSize(

visor.clientWidth,

visor.clientHeight

);


visor.appendChild(
renderer.domElement
);



//====================================================
// CONTROLES
//====================================================

const controls = new THREE.OrbitControls(

camara,

renderer.domElement

);


controls.enableDamping=true;

controls.dampingFactor=.05;

controls.target.set(0,90,0);



//====================================================
// LUCES
//====================================================

const ambiental = new THREE.AmbientLight(

0x212121,

2.5

);


escena.add(
ambiental
);



const direccional = new THREE.DirectionalLight(

0x212121,

3

);


direccional.position.set(

200,

300,

200

);


escena.add(
direccional
);



//====================================================
// VARIABLES
//====================================================

const loader = new THREE.GLTFLoader();


let modelo=null;


const raycaster = new THREE.Raycaster();


const mouse = new THREE.Vector2();


let seleccionado=null;


let colorAnterior=null;



//====================================================
// INFORMACION HUESOS
//====================================================

const informacion={


"Cranium__0":{

nombre:"Cráneo",

descripcion:"Protege el encéfalo y forma la estructura de la cabeza."

},


"Mandible__0":{

nombre:"Mandíbula",

descripcion:"Único hueso móvil del cráneo."

},


"l_humerus__0":{

nombre:"Húmero izquierdo",

descripcion:"Hueso del brazo."

},


"r_humerus__0":{

nombre:"Húmero derecho",

descripcion:"Hueso del brazo."

},


"l_femur__0":{

nombre:"Fémur izquierdo",

descripcion:"Hueso más largo del cuerpo."

},


"r_femur__0":{

nombre:"Fémur derecho",

descripcion:"Hueso más largo del cuerpo."

}


};



//====================================================
// BOTONES
//====================================================

const btnCompleto =
document.getElementById("btnCompleto");


const btnHuesos =
document.getElementById("btnHuesos");


const btnMusculos =
document.getElementById("btnMusculos");


const btnSkeleton =
document.getElementById("btnSkeleton");



//====================================================
// CARGAR MODELOS
//====================================================

function cargarModelo(ruta){


if(modelo){

escena.remove(modelo);

modelo=null;

}



loader.load(


ruta,


function(gltf){


modelo=gltf.scene;


escena.add(modelo);



const caja = new THREE.Box3()
.setFromObject(modelo);



const centro = caja.getCenter(

new THREE.Vector3()

);



modelo.position.sub(
centro
);



const tamaño = caja.getSize(

new THREE.Vector3()

);



const mayor=Math.max(

tamaño.x,

tamaño.y,

tamaño.z

);



const escala=180/mayor;

modelo.scale.setScalar(
escala
);

if(ruta === "modelos/human_skeleton.glb"){


    // ponerlo parado

    modelo.rotation.x = 0;

    modelo.rotation.y = 0;

    modelo.rotation.z = Math.PI;



    // posición

    modelo.position.set(

        0,

        0,

        0

    );


    // tamaño

    modelo.scale.multiplyScalar(1.5);



    // cámara enfocada al cuerpo

    camara.position.set(

        0,

        500,

        10

    );


    controls.target.set(

        0,

        100,

        0

    );


}

// CAMBIAR POSICION DEL MODELO

modelo.position.set(

0,

100,

30

);


console.log(
"Modelo cargado:",
ruta
);


},


undefined,


function(error){


console.error(

"Error cargando:",

ruta,

error

);


}


);


}//====================================================
// EVENTOS BOTONES
//====================================================


btnCompleto.addEventListener(

"click",

function(){

cargarModelo(

"modelos/Cuerpo.glb"

);

}

);



btnHuesos.addEventListener(

"click",

function(){

cargarModelo(

"modelos/Esqueleto.glb"

);

}

);



btnMusculos.addEventListener(

"click",

function(){

cargarModelo(

"modelos/Musculos.glb"

);

}

);



btnSkeleton.addEventListener(

"click",

function(){

cargarModelo(

"modelos/human_skeleton.glb"

);

}

);





//====================================================
// CLICK SOBRE HUESOS
//====================================================

window.addEventListener(

"click",

function(event){


const rect =
renderer.domElement.getBoundingClientRect();



mouse.x =

((event.clientX - rect.left) /

rect.width) * 2 - 1;



mouse.y =

-((event.clientY - rect.top) /

rect.height) * 2 + 1;



raycaster.setFromCamera(

mouse,

camara

);



if(!modelo)return;



const objetos=[];



modelo.traverse(

function(obj){


if(obj.isMesh){

objetos.push(obj);

}


}

);



const inter = raycaster.intersectObjects(

objetos

);



if(inter.length===0)return;



const objeto=inter[0].object;

console.log("Hueso seleccionado:", objeto.name);



if(seleccionado){


if(colorAnterior){

seleccionado.material.color.copy(

colorAnterior

);

}


}



seleccionado=objeto;



if(objeto.material && objeto.material.color){


colorAnterior=

objeto.material.color.clone();



objeto.material.color.set(
0x00ffff
);


}



const nombre=objeto.name;



let titulo = nombre;


if(informacion[nombre]){

titulo = informacion[nombre].nombre;

}


let texto =

"<h2>"+titulo+"</h2>";



if(informacion[nombre]){


texto +=

"<p><b>"+

informacion[nombre].nombre+

"</b></p>";



texto +=

"<p>"+

informacion[nombre].descripcion+

"</p>";


}

else{


texto +=

"<p>No hay información registrada para este hueso.</p>";

}


info.innerHTML=texto;



}

);





//====================================================
// ANIMACION
//====================================================

function animar(){


requestAnimationFrame(
animar
);


controls.update();


renderer.render(

escena,

camara

);


}


animar();

//====================================================
// CARGAR MODELO INICIAL
//====================================================

cargarModelo(
"modelos/Cuerpo.glb"
);



//====================================================
// RESPONSIVE
//====================================================

window.addEventListener(

"resize",

function(){


camara.aspect=

visor.clientWidth /

visor.clientHeight;



camara.updateProjectionMatrix();



renderer.setSize(

visor.clientWidth,

visor.clientHeight

);



}

);