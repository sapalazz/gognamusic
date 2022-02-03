window.onload = cargaInicial;

let reproductor = document.querySelector("#track");
let cancionesAlbum = [];
let sonando = false;

function cargaInicial() {
    cargarAjax();
    crearListenerAvanzar();
    crearListenerPasarCancionCuandoAcaba();
}
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
                        for(let indice = 0; indice < grupo.songs.length; indice++) {
                            let li = document.createElement('li');
                            let hidden = crearInputCancion(grupo.songs[indice].cancion);
                            li.innerText = grupo.songs[indice].titulo;
                            li.appendChild(hidden);
                            li.id = "cancion_"+indice;
                            li.addEventListener('click', (event) => {
                                const tituloCancion = event.target.innerText;
                                document.getElementById("tituloCancion").innerHTML = tituloCancion;
                                document.getElementById("cancion").innerHTML = tituloCancion;
                                document.getElementById("artista").innerHTML = grupo.artista;
                                document.getElementById("imagen").src = "./assets/" + grupo.imagen;
                                document.getElementById("avanzar").value = indice + 1;
                                const nombreFichero = event.target.lastElementChild.value;
                                cargarCancionPorFichero(nombreFichero, reproductor);
                            });
                            ol.appendChild(li);
                        }
                        listaCanciones.appendChild(ol);
                    }
                });
            }
        }
    };
}

function crearListenerAvanzar() {
    document.getElementById("avanzar")
        .addEventListener("click", event => {
            const siguienteCancion = event.target.value;
            reproducir_pausar();
            let siguiente = document.getElementById("cancion_" +siguienteCancion);
            if(siguiente != null) {
                siguiente.click();
            }
    });
}

function crearListenerPasarCancionCuandoAcaba() {
    reproductor.addEventListener("ended", event => {
        document.getElementById("avanzar").click();
    });
}

function crearInputCancion(cancion) {
    let input = document.createElement('input');
    input.type = 'hidden';
    input.value = cancion;
    return input;
}

function cargarCancionPorFichero(fichero, reproductor) {
    reproductor.src = fichero;

    reproductor.addEventListener("timeupdate", () => {
        document.querySelector("#barra").value = reproductor.currentTime;
        document.querySelector("#barra").max = reproductor.duration;
    });

    reproductor.addEventListener("ended", () => {
        var imgPlay = document.getElementById("imgPlay");
        imgPlay.src = "assets/imgs/play.png";
    })
}


function cargar() {
    document.querySelector("#play").addEventListener("click", reproducir_pausar);
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
        var imgPlay = document.getElementById("imgPlay");
        imgPlay.src = "assets/imgs/pause.png";
        reproductor.addEventListener('timeupdate', function() {
            document.querySelector('#barra').value = reproductor.currentTime;
        });
    } else {
        console.log("pausando");
        reproductor.pause();
        sonando = false;
        var imgPlay = document.getElementById("imgPlay");
        imgPlay.src = "assets/imgs/play.png";
    }
}

function parar() {
    console.log("parando");
    reproductor.pause();
    reproductor.currentTime = 0;
}