const camisetas = [
    {id: 1, camiseta: "Camiseta del Ajax", descripcion: "Camiseta de la temporada actual", img: "../images/actuales/ajaxalternativa.webp", alt: "Camiseta del Ajax", precio: 20000},
    {id: 2, camiseta: "Camiseta del Bayern", descripcion: "Camiseta de la temporada actual", img: "../images/actuales/bayern23.webp", alt: "Camiseta del Bayern", precio: 25000},
    {id: 3, camiseta: "Camiseta de Belgrano Alternativa", descripcion: "Camiseta de la temporada actual", img: "../images/actuales/belgranoalternativa.webp", alt: "Camiseta de Belgrano Alternativa", precio: 17000},
    {id: 4, camiseta: "Camiseta de la Juventus", descripcion: "Camiseta de la temporada actual", img: "../images/actuales/juventus23.webp", alt: "Camiseta de la Juventus", precio: 25000},
    {id: 5, camiseta: "Camiseta del Liverpool", descripcion: "Camiseta de la temporada actual", img: "../images/actuales/liverpool.webp", alt: "Camiseta del Liverpool", precio: 30000},
    {id: 6, camiseta: "Camiseta del Madrid Alternativa", descripcion: "Camiseta de la temporada anterior", img: "../images/actuales/madridalternativa.webp", alt: "Camiseta del Madrid Alternativa", precio: 20000},
    {id: 7, camiseta: "Camiseta de Manchester United", descripcion: "Camiseta de la temporada actual", img: "../images/actuales/manchester23.webp", alt: "Camiseta de Manchester United", precio: 25000},
    {id: 8, camiseta: "Camiseta de Belgrano", descripcion: "Camiseta de la temporada anterior", img: "../images/actuales/remerabelgrano.webp", alt: "Camiseta de Belgrano", precio: 15000},
    {id: 9, camiseta: "Camiseta de Suecia", descripcion: "Camiseta del mundial", img: "../images/actuales/suecia.webp", alt: "Camiseta de Suecia", precio: 20000},
    {id: 10, camiseta: "Camiseta de River", descripcion: "Camiseta de River Titular", img: "../images/actuales/river.webp", alt: "Camiseta de River", precio: 25000},
    {id: 11, camiseta: "Camiseta de Boca", descripcion: "Camiseta de Boca", img: "../images/actuales/boca.webp", alt: "Camiseta de Boca", precio: 25000}
  ];

const carritoDelUsuario = []

let seccionProductos = document.getElementById('camisetas');

function seccionDeCamisetas(listaDeCamisetas) {
  for (const camiseta of listaDeCamisetas) {
    seccionProductos.innerHTML += `
    <div class="contenedor-productos__border--productos">
    <img src="${camiseta.img}" alt="${camiseta.alt}"/>
    <div>
      <h2>${camiseta.camiseta}</h2>
      <p>${camiseta.descripcion}</p>
      <span>${camiseta.precio}$</span>
      <button id="${camiseta.id}" class="contenedor-productos__boton--productos comprarCamiseta">Comprar</button>
    </div>
  </div>
    `;
  }
  let verClaseComprar = document.getElementsByClassName('comprarCamiseta');
  for (const compraDeCamiseta of verClaseComprar) {
    compraDeCamiseta.addEventListener('click', () => {
      anadirAlCarrito(compraDeCamiseta.id)
    });
  }
}
seccionDeCamisetas(camisetas);

function buscarCamiseta() {
  let listadeCamisetas = ""
  camisetas.forEach(camiseta => {
    listadeCamisetas += camiseta.camiseta + ", ";
  })
  let buscarLaCamiseta = prompt(`Busca un nombre de camiseta y te diremos si la tenemos :)\n\nLista de camisetas: ${listadeCamisetas}`)

   let camisetaDisponible = null
   camisetas.forEach(camiseta => {
    if (camiseta.camiseta.toLowerCase().includes(buscarLaCamiseta.toLowerCase()))
    camisetaDisponible = camiseta.camiseta
   })

   if (camisetaDisponible) {
     alert(`La camiseta ${camisetaDisponible} si esta disponible.`)
     console.log(camisetaDisponible)
   }
   else {
     alert("La camiseta no está disponible.")
     buscarCamiseta();
   }
 }
buscarCamiseta();

function filtradorDePrecios() {
  let minimoParaGastar = parseInt(prompt("Minimo para gastar que tienes"));
  let maximoParaGastar = parseInt(prompt("Maximo para gastar que tienes"));

  let filtrarPrecio = camisetas.filter((camiseta) => camiseta.precio <= maximoParaGastar && camiseta.precio >= minimoParaGastar)

  let camisetasQuePuedeComprar = []
  filtrarPrecio.forEach(camiseta => {
    camisetasQuePuedeComprar.push(camiseta.camiseta)
  });
  console.log(camisetasQuePuedeComprar)

  if (camisetasQuePuedeComprar.length > 0) {
  alert(`Tu minimo para gastar fue $${minimoParaGastar} y tu maximo fue $${maximoParaGastar}\n\nY te puedes comprar esta camiseta/s: ${camisetasQuePuedeComprar}`)
} else {
  alert(`Tu minimo para gastar fue $${minimoParaGastar} y tu maximo fue $${maximoParaGastar}\n\nY no te puedes comprar ninguna camiseta.`)
}
  console.log(filtrarPrecio)
 }

filtradorDePrecios();

function anadirAlCarrito(idDeLaCamiseta) {
    const encontrarCamiseta = camisetas.find((camiseta => camiseta.id == idDeLaCamiseta) );

    if (encontrarCamiseta) {
      const Carrito = {
        id: encontrarCamiseta.id,
        camisetanombre: encontrarCamiseta.camiseta,
        precio: encontrarCamiseta.precio
      }
      carritoDelUsuario.push(Carrito)


      const listaDeCamisetas = carritoDelUsuario.map((camiseta) => camiseta.camisetanombre).join(", ")
      console.log(listaDeCamisetas)
      let precioTotal = carritoDelUsuario.reduce((total, camisetas) => total + camisetas.precio,0)
      alert(`Añadiste a tu carrito ${encontrarCamiseta.camiseta} (${idDeLaCamiseta}) que sale $${encontrarCamiseta.precio}.\n\nTienes ${carritoDelUsuario.length} camisetas en tu carrito.\nTu lista de camisetas en el carrito: ${listaDeCamisetas}\n\nTu precio total es: $${precioTotal}`)
      console.table(carritoDelUsuario)
    } else {
      alert(`Esa camiseta no existe!`)
    }
}