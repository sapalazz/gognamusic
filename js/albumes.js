const $ = (qs) => document.querySelector(qs);
window.onload = cargaInicial;
let reproductor = document.querySelector("#track");
let cancionesAlbum = [];
let sonando = false;
let cambiado = false;
let actual = null;
let idActual = null;
let idRandom = null;
let isRandom = false;

function cargaInicial() {
    cargarAjax();
}

function cargarAjax() {
    cargar();
    let req = new XMLHttpRequest();
    req.open('GET', 'albumes.json', true);
    req.send();
    req.onreadystatechange = function () {
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
                        for (let i = 0; i < grupo.songs.length; i++) {
                            let li = document.createElement('li');
                            let hidden = crearInputCancion(grupo.songs[i].cancion);
                            li.innerText = grupo.songs[i].titulo;
                            li.appendChild(hidden);
                            li.id = "cancion_" + grupo.songs[i].id;
                            cancionesAlbum[i] = grupo.songs[i];
                            $("#imagen").src = "./assets/" + grupo.imagen;
                            $("#artista").innerHTML = grupo.artista;
                            li.addEventListener('click', (event) => {
                                const tituloCancion = event.target.innerText;
                                $("#tituloCancion").innerHTML = tituloCancion;
                                $("#cancion").innerHTML = tituloCancion;
                                actual = event.target.lastElementChild.value;
                                cargarCancionPorFichero(actual, grupo.songs[i].id);
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

function avanzar() {
    console.log('IDAnterior: ' + idActual);
    if (cancionesAlbum.length > idActual) {
        console.log('Entrando al id nuevo: ' + cancionesAlbum[idActual].id);
        console.log('IdActual despés de sumarla: ' + idActual);
        reproductor.src = cancionesAlbum[idActual].cancion;
        console.log(cancionesAlbum[idActual].cancion);
        const tituloCancion = cancionesAlbum[idActual].titulo;
        $("#tituloCancion").innerHTML = tituloCancion;
        $("#cancion").innerHTML = tituloCancion;
        cambiado = true;
        reproducir();
        ++idActual;
    } else {
        idActual = 0;
        console.log('Entrando al id nuevo cuando el ID es 12: ' + idActual);
        reproductor.src = cancionesAlbum[idActual].cancion;
        console.log(cancionesAlbum[idActual]);
        const tituloCancion = cancionesAlbum[idActual].titulo;
        $("#tituloCancion").innerHTML = tituloCancion;
        $("#cancion").innerHTML = tituloCancion;
        cambiado = true;
        reproducir();
        ++idActual;
    }
}

function anterior() {
    if (idActual == cancionesAlbum.length || (idActual <= cancionesAlbum.length && idActual != 1)) {
        --idActual;
        reproductor.src = cancionesAlbum[idActual - 1].cancion;
        const tituloCancion = cancionesAlbum[idActual - 1].titulo;
        $("#tituloCancion").innerHTML = tituloCancion;
        $("#cancion").innerHTML = tituloCancion;
        cambiado = true;
        reproducir();
    } else {
        idActual = cancionesAlbum.length;
        reproductor.src = cancionesAlbum[idActual - 1].cancion;
        const tituloCancion = cancionesAlbum[idActual - 1].titulo;
        $("#tituloCancion").innerHTML = tituloCancion;
        $("#cancion").innerHTML = tituloCancion;
        cambiado = true;
        reproducir();
        --idActual;
    }
}

function crearInputCancion(cancion) {
    let input = document.createElement('input');
    input.type = 'hidden';
    input.value = cancion;
    return input;
}

function cargarCancionPorFichero(fichero, id) {
    reproductor.src = fichero;
    idActual = id;
    cambiado = true;
    reproducir();
    reproductor.addEventListener("timeupdate", () => {
        document.querySelector("#barra").value = reproductor.currentTime;
        document.querySelector("#barra").max = reproductor.duration;
    });

    if (isRandom) {
        $('#btn-aleatorio').setAttribute('title', 'true');
        reproductor.addEventListener("ended", () => {
            idActual = idRandom;
            console.log(idActual - 1);
            reproductor.src = cancionesAlbum[idActual - 1].cancion;
            console.log(cancionesAlbum[idActual - 1].cancion);
            const tituloCancion = cancionesAlbum[idActual - 1].titulo;
            $("#tituloCancion").innerHTML = tituloCancion;
            $("#cancion").innerHTML = tituloCancion;
            cambiado = true;
            reproducir();
            aleatorio();
        })
    } else {
        $('#btn-aleatorio').setAttribute('title', 'false');
        reproductor.addEventListener("ended", () => {
            var imgPlay = document.getElementById("imgPlay");
            imgPlay.src = "assets/imgs/play.png";
        })
    }

}

function aleatorio() {
    isRandom = !isRandom;
    console.log('Mood aleatorio: ' + isRandom);
    let randIndex = Math.floor((Math.random() * cancionesAlbum.length) + 1); //genereting random index/numb with max range of array length
    do {
        randIndex = Math.floor((Math.random() * cancionesAlbum.length) + 1);
    } while (idActual == randIndex); //this loop run until the next random number won't be the same of current musicIndex
    idRandom = randIndex; //passing randomIndex to musicIndex
    console.log(idRandom);
}

function cargar() {
    document.querySelector("#play").addEventListener("click", reproducir);
    document.querySelector("#avanzar").addEventListener("click", avanzar);
    document.querySelector("#rebobinar").addEventListener("click", anterior);
    document.querySelector("#btn-aleatorio").addEventListener("click", aleatorio);


    document.querySelector('#volumen').addEventListener("change", () => {
        reproductor.volume = document.querySelector('#volumen').value;
        console.log("cambiando");
    });
    document.querySelector('#barra').addEventListener("change", () => {
        reproductor.currentTime = document.querySelector('#barra').value;
    });

}

function reproducir() {
    if (!sonando || cambiado) {
        console.log("sonando");
        reproductor.play();
        sonando = true;
        var imgPlay = document.getElementById("imgPlay");
        imgPlay.src = "assets/imgs/pause.png";
        reproductor.addEventListener('timeupdate', function () {
            document.querySelector('#barra').value = reproductor.currentTime;
        });
        cambiado = false;
    } else if (sonando) {
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