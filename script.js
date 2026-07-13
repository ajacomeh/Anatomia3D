//====================================================
// PROYECTO ANATOMÍA 3D
//====================================================


const visor = document.getElementById("visor3D");

const info = document.getElementById("info");


//====================================================
// ESCENA
//====================================================

const escena = new THREE.Scene();


//====================================================
// CAMARA
//====================================================

const camara = new THREE.PerspectiveCamera(

45,

visor.clientWidth / visor.clientHeight,

0.1,

1000

);


camara.position.set(-35,150,320);



//====================================================
// RENDER
//====================================================

const renderer = new THREE.WebGLRenderer({

    antialias:true,

    alpha:true

});

renderer.setClearColor(0x000000, 0);


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

controls.target.set(-30,90,0);



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

let modeloInteractivo = false;

const raycaster = new THREE.Raycaster();


const mouse = new THREE.Vector2();


let seleccionado=null;


let colorAnterior=null;

function animarPanel(panel){

    panel.classList.remove("panelEntrada");

    void panel.offsetWidth;

    panel.classList.add("panelEntrada");

}

function animarRegreso(){

    renderer.domElement.classList.remove("visorEntrada");

    void renderer.domElement.offsetWidth;

    renderer.domElement.classList.add("visorEntrada");

}



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

const btnBiomoleculas =
document.getElementById("btnBiomoleculas");

const panelBiomoleculas =
document.getElementById("panelBiomoleculas");

const btnRegresarBiomoleculas =
document.getElementById("btnRegresarBiomoleculas");

//====================================================
// ABRIR BIOMOLÉCULAS
//====================================================

btnBiomoleculas.addEventListener("click",function(){

    if(modelo){

        modelo.visible=false;

    }

    renderer.domElement.style.display="none";

    panelElectronico.style.display="none";

    panelBiomoleculas.style.display="block";

    animarPanel(panelBiomoleculas);

    info.innerHTML=
    "Estudia cómo las biomoléculas forman y mantienen el cuerpo humano.";

});

//====================================================
// REGRESAR DESDE BIOMOLÉCULAS
//====================================================

btnRegresarBiomoleculas.addEventListener("click",function(){

    // Ocultar biomoléculas

    panelBiomoleculas.style.display="none";


    // Mostrar visor 3D

    renderer.domElement.style.display="block";


    // Mostrar modelo

    if(modelo){

        modelo.visible=true;

    }


    // Animación de regreso

    animarRegreso();


    // Restaurar información

    info.innerHTML=
    "Selecciona un hueso para ver su descripción.";

});


//====================================================
// DISTRIBUCIÓN ELECTRÓNICA
//====================================================

const btnElectronica =
document.getElementById("btnElectronica");

const panelElectronico =
document.getElementById("panelElectronico");

const selectorElemento =
document.getElementById("selectorElemento");

const informacionElemento =
document.getElementById("informacionElemento");

const atomo =
document.getElementById("atomo");

const btnRegresar =
document.getElementById("btnRegresar");

//====================================================
// BOTÓN REGRESAR
//====================================================

btnRegresar.addEventListener("click",function(){

    // Ocultar panel electrónico

    panelElectronico.style.display="none";


    // Mostrar visor 3D

    renderer.domElement.style.display="block";


    // Mostrar modelo

    if(modelo){

        modelo.visible=true;

    }


    // Animación de regreso

    animarRegreso();


    // Restaurar información

    info.innerHTML=
    "Selecciona un hueso para ver su descripción.";

});


const elementos={

"H":{

nombre:"Hidrógeno",

numeroAtomico:1,

configuracion:"1s¹",

niveles:[1]

},

"C":{

nombre:"Carbono",

numeroAtomico:6,

configuracion:"1s² 2s² 2p²",

niveles:[2,4]

},

"O":{

nombre:"Oxígeno",

numeroAtomico:8,

configuracion:"1s² 2s² 2p⁴",

niveles:[2,6]

},

"Na":{

nombre:"Sodio",

numeroAtomico:11,

configuracion:"1s² 2s² 2p⁶ 3s¹",

niveles:[2,8,1]

},

"Cl":{

nombre:"Cloro",

numeroAtomico:17,

configuracion:"1s² 2s² 2p⁶ 3s² 3p⁵",

niveles:[2,8,7]

},

"Ca":{

nombre:"Calcio",

numeroAtomico:20,

configuracion:"1s² 2s² 2p⁶ 3s² 3p⁶ 4s²",

niveles:[2,8,8,2]


}

};

function dibujarAtomo(simbolo){

    const elemento=elementos[simbolo];

    atomo.innerHTML="";

    const nucleo=document.createElement("div");

    nucleo.className="nucleo";

    nucleo.textContent=simbolo;

    atomo.appendChild(nucleo);


    elemento.niveles.forEach(function(cantidad,nivelIndice){

        const diametro=130+(nivelIndice*65);

        const nivel=document.createElement("div");

        nivel.className="nivel";

        nivel.style.width=diametro+"px";

        nivel.style.height=diametro+"px";

        atomo.appendChild(nivel);


        for(let i=0;i<cantidad;i++){

            const angulo=(360/cantidad)*i;

            const radio=diametro/2;

            const radianes=angulo*Math.PI/180;

            const electron=document.createElement("div");

            electron.className="electron";

            electron.style.left=
            175+(Math.cos(radianes)*radio)+"px";

            electron.style.top=
            175+(Math.sin(radianes)*radio)+"px";

            atomo.appendChild(electron);

        }

    });

}

function mostrarElemento(){

    const simbolo=selectorElemento.value;

    const elemento=elementos[simbolo];

    informacionElemento.innerHTML=

    "<h3>"+elemento.nombre+"</h3>"+

    "<p><b>Símbolo:</b> "+simbolo+"</p>"+

    "<p><b>Número atómico:</b> "+
    elemento.numeroAtomico+"</p>"+

    "<p><b>Configuración electrónica:</b> "+
    elemento.configuracion+"</p>"+

    "<p><b>Electrones por nivel:</b> "+
    elemento.niveles.join(" - ")+"</p>";

    dibujarAtomo(simbolo);

atomo.classList.remove("panelEntrada");

void atomo.offsetWidth;

atomo.classList.add("panelEntrada");

}

btnElectronica.addEventListener("click",function(){

    if(modelo){

        modelo.visible=false;

    }

    renderer.domElement.style.display="none";

    panelBiomoleculas.style.display="none";

    panelElectronico.style.display="block";

    animarPanel(panelElectronico);

    info.innerHTML=
    "Selecciona un elemento para estudiar su distribución electrónica.";

    mostrarElemento();

});
selectorElemento.addEventListener(
"change",
mostrarElemento
);



//====================================================
// CARGAR MODELOS
//====================================================

function cargarModelo(ruta){

    if(panelBiomoleculas){

    panelBiomoleculas.style.display="none";

}

panelElectronico.style.display="none";

renderer.domElement.style.display="block";

if(modelo){

escena.remove(modelo);

modelo=null;

modeloInteractivo = false;

}



loader.load(


ruta,


function(gltf){


modelo=gltf.scene;

//====================================================
// MATERIAL INDIVIDUAL PARA CADA HUESO
//====================================================

if(ruta === "modelos/human_skeleton.glb"){

    modelo.traverse(function(obj){

        if(obj.isMesh){

            // Crear una copia independiente del material
            obj.material = obj.material.clone();

        }

    });

}

escena.add(modelo);

let lista = [];

modelo.traverse(function(obj){

    if(obj.isMesh){

        lista.push(obj.name);

    }

});

console.log(lista.join("\n"));

if(ruta === "modelos/human_skeleton.glb"){

    modeloInteractivo = true;

}

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



if(!modelo || !modeloInteractivo)return;



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

//====================================================
// CICLO DE KREBS INTERACTIVO
//====================================================

const botonesKrebs =
document.querySelectorAll(".btnPasoKrebs");

const contenidoKrebs =
document.getElementById("contenidoKrebs");


const pasosKrebs={

entrada:{

titulo:"Entrada al ciclo",

texto:
"Los carbohidratos, lípidos y proteínas se degradan hasta formar acetil-CoA, que entra en la mitocondria.",

conexion:
"🧬 Biomoléculas → Acetil-CoA"

},

ciclo:{

titulo:"Reacciones del ciclo",

texto:
"El acetil-CoA se combina con oxaloacetato. Durante las reacciones se producen NADH, FADH₂ y dióxido de carbono.",

conexion:
"⚛️ Enlaces químicos → Reacciones metabólicas"

},

energia:{

titulo:"Producción de energía",

texto:
"El NADH y el FADH₂ transportan electrones hacia la cadena respiratoria, donde se produce ATP.",

conexion:
"⚡ ATP → Energía celular"

},

anatomia:{

titulo:"Relación con la anatomía",

texto:
"Los músculos usan ATP para contraerse, las células óseas para reparar tejido y los órganos para mantener sus funciones.",

conexion:
"💪 Músculos · 🦴 Huesos · 🫀 Órganos"

}

};

botonesKrebs.forEach(function(boton){

    boton.addEventListener("click",function(){

        botonesKrebs.forEach(function(btn){

            btn.classList.remove("activo");

        });

        boton.classList.add("activo");

        const paso=boton.dataset.paso;

        const datos=pasosKrebs[paso];

        contenidoKrebs.classList.remove("animando");

        void contenidoKrebs.offsetWidth;

        contenidoKrebs.innerHTML=

        "<h3>"+datos.titulo+"</h3>"+

        "<p>"+datos.texto+"</p>"+

        "<div class='conexionAnatomica'>"+

        datos.conexion+

        "</div>";

        contenidoKrebs.classList.add("animando");

    });

});