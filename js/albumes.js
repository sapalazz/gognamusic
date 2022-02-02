window.onload = cargarAjax;

let reproductor = document.querySelector("#track");
let musica = [];
let sonando = false;

function cargarAjax() {
    cargar();
    let req = new XMLHttpRequest();
    req.open('GET', 'albumes.json', true);
    req.send();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                let datos = req.responseText;
                let musica = JSON.parse(datos);
                let imgPortadaID = document.querySelector('.imgPortada').getAttribute('id');
                let imgPortadaSrc = document.querySelector('.imgPortada');
                musica.forEach(grupo => {
                    let listaCanciones = document.querySelector('.lista-canciones');

                    if (imgPortadaID == grupo.id) {
                        let artistaPortada = document.querySelector('.artista');
                        artistaPortada.innerHTML = grupo.artista;
                        imgPortadaSrc.src = "./assets/" + grupo.imagen;
                        let ol = document.createElement('ol');
                        grupo.songs.forEach(cancion => {
                            let li = document.createElement('li');
                            let hidden = crearInputCancion(cancion.cancion);
                            li.innerText = cancion.titulo;
                            li.appendChild(hidden);
                            li.addEventListener('click', (event) => {
                                const tituloCancion = event.target.innerText;
                                document.getElementById("tituloCancion").innerHTML = tituloCancion;
                                document.getElementById("cancion").innerHTML = tituloCancion;
                                document.getElementById("artista").innerHTML = grupo.artista;
                                document.getElementById("imagen").src = "./assets/" + grupo.imagen;
                                const nombreFichero = event.target.lastElementChild.value;
                                cargarCancionPorFichero(nombreFichero, reproductor);
                            });
                            ol.appendChild(li);
                        });
                        listaCanciones.appendChild(ol);
                    }
                });
            }
        }
    };
}


function crearInputCancion(cancion) {
    let input = document.createElement('input');
    input.type = 'hidden';
    input.value = cancion;
    return input;
}

function cargarCancionPorFichero(fichero, reproductor) {

    reproductor.src = fichero;
}




function cargarCancion(id) { //(titulo, cancion)
    //al declarar canciones fuera ya la podemos usar en esta función
    //canciones es un array de canción ccon su id, titulo y cancion

    let titulo = musica[id]["titulo"];
    let cancion = musica[id]["cancion"];

    document.querySelector("#cancionSeleccionada").innerHTML = titulo;
    reproductor.src = "./audio/" + cancion;
    reproducir_pausar();

    reproductor.addEventListener("timeupdate", () => {
        document.querySelector("#barra").value = reproductor.currentTime;
        document.querySelector("#barra").max = reproductor.duration;
        console.log(reproductor.duration);
    });

    reproductor.addEventListener("ended", () => {
        console.log("cargar siguiente");
        //cargarCancion(titulo, cancion);
        //console.log(canciones.length);

        if (id == musica.length) {
            id = 1;
            cargarCancion(id);
        } else {
            cargarCancion(++id);
        }

    });

}

function cargar() {
    document.querySelector("#play").addEventListener("click", reproducir_pausar);
    // document.querySelector("#stop").addEventListener("click", parar);
    //document.querySelector('#barra').value = 0;

    document.querySelector('#volumen').addEventListener("change", () => {

        reproductor.volume = document.querySelector('#volumen').value;
        console.log("cambiando");
    });

    document.querySelector('#barra').addEventListener("change", () => {

        reproductor.currentTime = document.querySelector('#barra').value;

    });

}

function reproducir_pausar() {
    if (!sonando) {
        console.log("sonando");
        reproductor.play();
        sonando = true;
        reproductor.addEventListener('timeupdate', function() {
            document.querySelector('#barra').value = reproductor.currentTime;
        });
    } else {
        console.log("pausando");
        reproductor.pause();
        sonando = false;
    }
}

function parar() {
    console.log("parando");
    reproductor.pause();
    reproductor.currentTime = 0;
}