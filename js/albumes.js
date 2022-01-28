window.onload = cargarAjax;

let reproductor = document.querySelector("#track");
let musica = [];
let sonando = false;

function cargarAjax() {
    cargar();
    console.log("dentro...");
    let req = new XMLHttpRequest();
    req.open('GET', 'albumes.json', true);
    req.send();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                console.log("dentro*2");
                let datos = req.responseText;
                musica = JSON.parse(datos);
                let imgPortadaID = document.querySelector('.imgPortada').getAttribute('id');
                let imgPortadaSrc = document.querySelector('.imgPortada');
                console.log(imgPortadaSrc);
                musica.forEach(grupo => {
                    let listaCanciones = document.querySelector('.lista-canciones');

                    if (imgPortadaID == grupo.id) {
                        let tituloCancionPortada = document.querySelector('.titulo-album');
                        tituloCancionPortada.innerHTML = grupo.songs[0].titulo;
                        let artistaPortada = document.querySelector('.artista');
                        artistaPortada.innerHTML = grupo.artista;
                        imgPortadaSrc.src = "./assets/" + grupo.imagen;
                        let ol = document.createElement('ol');
                        grupo.songs.forEach(cancion => {
                            let li = document.createElement('li');
                            li.innerText = cancion.titulo;
                            li.addEventListener('click', () => {
                                cargarCancion(grupo.songs[ /*pasar id de la cancion previamente asignado a su li*/ ]);
                            });
                            ol.appendChild(li);
                        });
                        listaCanciones.appendChild(ol);
                    }
                    //     let div = document.createElement('div');
                    //     let a = document.createElement('a');
                    //     let img = document.createElement('img');
                    //     let songs = grupo.songs;
                    //     let artistaElement = document.querySelector('#artista');
                    //     let cancionElement = document.querySelector('#cancion');
                    //     artistaElement.textContent = grupo.artista;
                    //     cancionElement.textContent = grupo.songs[0]['titulo'];
                    //     a.href = 'always.html?id=' + grupo.id;
                    //     img.src = './assets/' + grupo.imagen;
                    //     a.addEventListener("click", () => {
                    //         //document.querySelector('#cancionSeleccionada').innerHTML = cancion.titulo;
                    //         //cargarCancion(cancion.titulo, cancion.cancion);
                    //         console.log(songs);
                    //         cargarCancion(songs['id']);
                    //         console.log(songs['id']);
                    //     });

                    //     a.appendChild(img);
                    //     div.appendChild(a);
                    //     principal.appendChild(div);
                });
            }
        }
    };
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