window.onload = cargarAjax;
let reproductor = document.querySelector("#track");
let canciones = [];

function cargarAjax() {
    cargar();
    console.log("dentro...");
    let req = new XMLHttpRequest();
    req.open('GET', 'album_alphaville.json', true);
    req.send();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                let datos = req.responseText;
                canciones = JSON.parse(datos);
                //console.log(canciones);
                canciones.forEach(cancion => {
                    //console.log(cancion);
                    let titulo = document.createElement('h3');
                    titulo.innerText = cancion.titulo;
                    document.querySelector('#lista-canciones').appendChild(titulo);
                    titulo.addEventListener("click", () => {
                        //document.querySelector('#cancionSeleccionada').innerHTML = cancion.titulo;
                        //cargarCancion(cancion.titulo, cancion.cancion);
                        cargarCancion(cancion.id);
                        console.log(cancion.id);
                    });
                });
            }
        }
    };
}



function cargarCancion(id) { //(titulo, cancion)
    //al declarar canciones fuera ya la podemos usar en esta función
    //canciones es un array de canción ccon su id, titulo y cancion

    let titulo = canciones[id]["titulo"];
    let cancion = canciones[id]["cancion"];

    document.querySelector("#cancionSeleccionada").innerHTML = titulo;
    reproductor.src = "./audio/" + cancion;
    reproducir();

    reproductor.addEventListener("timeupdate", () => {
        document.querySelector("#barra").value = reproductor.currentTime;
        document.querySelector("#barra").max = reproductor.duration;
        console.log(reproductor.duration);
    });

    reproductor.addEventListener("ended", () => {
        console.log("cargar siguiente");
        //cargarCancion(titulo, cancion);
        //console.log(canciones.length);

        if (id == canciones.length - 1) {
            id = 0;
            cargarCancion(id);
        } else {
            cargarCancion(++id);
        }

    });

}

function cargar() {
    document.querySelector("#play").addEventListener("click", reproducir);
    document.querySelector("#pause").addEventListener("click", pausar);
    document.querySelector("#stop").addEventListener("click", parar);
    //document.querySelector('#barra').value = 0;

    document.querySelector('#volumen').addEventListener("change", () => {

        reproductor.volume = document.querySelector('#volumen').value;
        console.log("cambiando");
    });

    document.querySelector('#barra').addEventListener("change", () => {

        reproductor.currentTime = document.querySelector('#barra').value;

    });

}

function reproducir() {
    console.log("sonando");
    reproductor.play();
    reproductor.addEventListener('timeupdate', function() {
        document.querySelector('#barra').value = reproductor.currentTime;
    });
}

function pausar() {
    console.log("pausando");
    reproductor.pause();
}

function parar() {
    console.log("parando");
    reproductor.pause();
    reproductor.currentTime = 0;

}