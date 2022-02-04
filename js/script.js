window.onload = cargarAjax;


let reproductor = document.querySelector("#track");
let musica = [];
let sonando = false;

function cargarAjax() {
    //cargar();
    console.log("dentro...");
    let req = new XMLHttpRequest();
    req.open('GET', 'albumes.json', true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                console.log("dentro*2");
                let datos = req.responseText;
                musica = JSON.parse(datos);
                let principal = document.querySelector('#principal');
                musica.forEach(grupo => {
                    let div = document.createElement('div');
                    let a = document.createElement('a');
                    let img = document.createElement('img');
                    let songs = grupo.songs;
                    let artistaElement = document.querySelector('#artista');
                    let cancionElement = document.querySelector('#cancion');
                    artistaElement.textContent = grupo.artista;
                    cancionElement.textContent = grupo.songs[0]['titulo'];
                    a.href = 'albumes.php?id=' + grupo.id;
                    img.src = './assets/' + grupo.imagen;
                    a.addEventListener("click", () => {
                        //document.querySelector('#cancionSeleccionada').innerHTML = cancion.titulo;
                        //cargarCancion(cancion.titulo, cancion.cancion);
                        console.log(songs);
                        cargarCancion(songs['id']);
                        console.log(songs['id']);
                    });

                    a.appendChild(img);
                    div.appendChild(a);
                    principal.appendChild(div);
                });
            }
        }
    };
}
