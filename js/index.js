let carritoDelUsuario = []
let camisetas;

async function cargarCamisetas() {
  try {
    const response = await fetch('../json/camisetas.json');
    const data = await response.json();
    camisetas = data;
    seccionDeCamisetas(camisetas);
    console.log(camisetas);
  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error);
  }
}
cargarCamisetas();

cargarCarritoDelLocal()

let seccionProductos = document.getElementById('camisetas');

function seccionDeCamisetas(listaDeCamisetas) {
  for (const camiseta of listaDeCamisetas) {
    seccionProductos.innerHTML += `
    <div class="contenedor-productos__border--productos">
    <img src="${camiseta.img}" alt="${camiseta.alt}"/>
    <div>
      <h2>${camiseta.nombre}</h2>
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
      anadirAlCarrito(compraDeCamiseta.id);
      (localStorage.getItem('productosComprados') != null) ? localStorage.setItem('productosComprados', parseInt(localStorage.getItem('productosComprados')) + 1) : localStorage.setItem('productosComprados', 1);

      const camiseta = camisetas.find(camiseta => camiseta.id == compraDeCamiseta.id)
      const productosComprados = (localStorage.getItem('productosComprados') == null) ? "0" : localStorage.getItem('productosComprados');
      const listaDeCamisetas = carritoDelUsuario.map((camiseta) => camiseta.cantidad > 1 ? `${camiseta.camisetanombre} (x${camiseta.cantidad})` : camiseta.camisetanombre).join(", ");
      let precioTotal = carritoDelUsuario.reduce((total, camisetas) => total + camisetas.precio * camisetas.cantidad,0)

      Swal.fire({
        title: `Agregaste a tu carrito ${camiseta.nombre} que sale ${camiseta.precio}$.`,
        html: `Productos en tu carrito: ${productosComprados}<br><br>
        Precio total en el carrito: $${precioTotal}<br><br>
        Lista de camisetas en el carrito: ${listaDeCamisetas}`,        
        imageUrl: `${camiseta.img}`,
        imageWidth: 450,
        imageHeight: 450,
        imageAlt: `${camiseta.alt}`,
      })
    });
  }
}

function buscarCamiseta() {
  const inputBusqueda = document.getElementById('inputBusqueda');
  
    inputBusqueda.addEventListener('input', () => {
      const textoBusqueda = inputBusqueda.value.toLowerCase();
      const camisetas = document.querySelectorAll('.contenedor-productos__border--productos');
  
      camisetas.forEach((camiseta) => {
        const nombreCamiseta = camiseta.querySelector('h2').innerText.toLowerCase();
        
        if (nombreCamiseta.includes(textoBusqueda)) {
          camiseta.style.display = 'block'; 
        } else {
          camiseta.style.display = 'none';
        }
      });
    });
  }
  buscarCamiseta();

function filtradorDePrecios() {
  const inputMinimo = document.getElementById('inputMinimo');
  const inputMaximo = document.getElementById('inputMaximo');

  inputMinimo.addEventListener('input', () => {
    filtrarCamisetasPorPrecio();
  });

  inputMaximo.addEventListener('input', () => {
    filtrarCamisetasPorPrecio();
  });

function filtrarCamisetasPorPrecio() {
    const minimoParaGastar = parseInt(inputMinimo.value) || 0;
    const maximoParaGastar = parseInt(inputMaximo.value) || 40000;

    const camisetas = document.querySelectorAll('.contenedor-productos__border--productos');

    camisetas.forEach((camiseta) => {
      const precioCamiseta = parseInt(camiseta.querySelector('span').innerText);
      
      if (precioCamiseta >= minimoParaGastar && precioCamiseta <= maximoParaGastar) {
        camiseta.style.display = 'block'; 
      } else {
        camiseta.style.display = 'none';
      }
    });
  }
}

filtradorDePrecios();


function anadirAlCarrito(idDeLaCamiseta) {
    const encontrarCamiseta = camisetas.find((camiseta => camiseta.id == idDeLaCamiseta));

    if (encontrarCamiseta) {
      let camisetaExistenteEnCarrito = carritoDelUsuario.find((camiseta => camiseta.id == idDeLaCamiseta));

    if (camisetaExistenteEnCarrito) {

      camisetaExistenteEnCarrito.cantidad++;

      const carritoBody = document.getElementById('carritoBody');
      const filas = carritoBody.getElementsByTagName('tr');

      for(let i = 0; i < filas.length; i++) {
        const dataDeFilas = filas[i].getElementsByTagName('td');
        if (dataDeFilas[0].innerText == idDeLaCamiseta) {
          dataDeFilas[1].innerText = camisetaExistenteEnCarrito.cantidad;
          break;
        }
      }

      guardarCarritoEnElLocal();
      actualizarPrecioTotal();
      actualizarTextoCarrito();
    } else {
      const carrito = {
        id: encontrarCamiseta.id,
        camisetanombre: encontrarCamiseta.nombre,
        precio: encontrarCamiseta.precio,
        cantidad: 1
      }
      carritoDelUsuario.push(carrito)

      const carritoBody = document.getElementById('carritoBody');

      const fila = document.createElement("tr")
      fila.innerHTML += `
      <td>${carrito.id}</td>
      <td>${carrito.cantidad}</td>
      <td>${carrito.camisetanombre}</td>
      <td>${carrito.precio}</td>
      <td><button class="btn btn-danger" onclick="borrarDeCarrito(${carrito.id})">Borrar</button></td>
      `;
      carritoBody.appendChild(fila);
      console.table(carritoDelUsuario)

      guardarCarritoEnElLocal();
      actualizarPrecioTotal();
      actualizarTextoCarrito();
    }

    } else {
      alert(`Esa camiseta no existe!`)
    }
}

function borrarDeCarrito(id) {
  const numeroDeIndex = carritoDelUsuario.findIndex((camiseta) => camiseta.id == id);

  if (numeroDeIndex !== -1) {
    (localStorage.getItem('productosComprados') != null) ? localStorage.setItem('productosComprados', parseInt(localStorage.getItem('productosComprados')) - 1) : localStorage.setItem('productosComprados', 1);
    carritoDelUsuario.splice(numeroDeIndex, 1);

    const carritoBody = document.getElementById('carritoBody');
    const filas = carritoBody.getElementsByTagName('tr');
    
    for (let i = 0; i < filas.length; i++) {
      const dataDeFilas = filas[i].getElementsByTagName('td');
      if (dataDeFilas[0].innerText == id) {
        carritoBody.removeChild(filas[i]);
        break;
      }
    }
    
    console.log(carritoDelUsuario);
    guardarCarritoEnElLocal();
    actualizarPrecioTotal();
    actualizarTextoCarrito();
  }
}

function completarCompra() {
  const precioTotalDeProductos = carritoDelUsuario.reduce((acumulador, camiseta) => acumulador + camiseta.precio * camiseta.cantidad, 0);
  const listaDeCamisetas = carritoDelUsuario.map((camiseta) => `${camiseta.camisetanombre} (x${camiseta.cantidad})`).join(", ");

  Swal.fire({
    icon: 'success',
    title: 'Compra completada',
    html: `Productos comprados: ${listaDeCamisetas}<br><br>
           Precio total: $${precioTotalDeProductos}`,
  });

  const carritoBody = document.getElementById('carritoBody');
  const filas = carritoBody.getElementsByTagName('tr');

  while (filas.length > 0) {
    carritoBody.removeChild(filas[0]);
  }

  carritoDelUsuario = [];
  guardarCarritoEnElLocal();
  actualizarTextoCarrito();
  actualizarPrecioTotal();
  localStorage.setItem('productosComprados', 0);
}

function guardarCarritoEnElLocal() {
  localStorage.setItem("carritoDelUsuario", JSON.stringify(carritoDelUsuario))
}

function cargarCarritoDelLocal() {
  const carritoDelLocalCargado = localStorage.getItem("carritoDelUsuario");
  if (carritoDelLocalCargado) {
    carritoDelUsuario = JSON.parse(carritoDelLocalCargado);

        const carritoBody = document.getElementById('carritoBody');
        carritoDelUsuario.forEach((camiseta) => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${camiseta.id}</td>
            <td>${camiseta.cantidad}</td>
            <td>${camiseta.camisetanombre}</td>
            <td>${camiseta.precio}</td>
            <td><button class="btn btn-danger" onclick="borrarDeCarrito(${camiseta.id})">Borrar</button></td>
          `;
          carritoBody.appendChild(fila);
        });
    
        actualizarPrecioTotal();
  }
}

function actualizarPrecioTotal() {
  const precioTotal = document.getElementById("precioTotal")
  const precioTotalDeProductos = carritoDelUsuario.reduce((acumulador, camiseta) => acumulador + camiseta.precio * camiseta.cantidad, 0)
  precioTotal.innerText = `Precio Total: $${precioTotalDeProductos}`
}

const contenedor = document.getElementById('modoDeLuz');
const iconContainer = document.getElementById('iconoContenedor');
const modoIcono = document.getElementById('modoIcono');
modoIcono.innerText = " Light Mode"
localStorage.setItem('mode', 'light');

iconContainer.onclick = () => {
  if (localStorage.getItem('mode') === 'light') {
    DarkMode();
  } else {
    LightMode();
  }
}

function DarkMode() {
  contenedor.classList.replace('light', 'dark');
  modoIcono.classList.remove('fa-sun');
  modoIcono.classList.add('fa-moon');
  modoIcono.innerText = " Dark Mode"
  localStorage.setItem('mode', 'dark');
}

function LightMode() {
  contenedor.classList.replace('dark', 'light');
  modoIcono.classList.remove('fa-moon');
  modoIcono.classList.add('fa-sun');
  modoIcono.innerText = " Light Mode"
  localStorage.setItem('mode', 'light');
}

const completarCompraBtn = document.getElementById('completarCompraBtn');

function actualizarVisibilidadBoton() {
  if (carritoDelUsuario.length > 0) {
    completarCompraBtn.style.display = 'block'; 
  } else {
    completarCompraBtn.style.display = 'none';
  }
}

const abrirCarrito = document.getElementById('abrirCarrito');
const carritoContenedor = document.getElementById('carritoContenedor');

let cantidadItems = 0;

function actualizarTextoCarrito() {
  cantidadItems = carritoDelUsuario ? carritoDelUsuario.length : 0;
  abrirCarrito.innerHTML = `<i class="fas fa-shopping-cart"> Ver carrito (${cantidadItems})</i>`;
  actualizarVisibilidadBoton();
}
actualizarTextoCarrito();

abrirCarrito.addEventListener('click', () => {
  const carritoVisible = carritoContenedor.style.display !== 'none';

  if (carritoVisible) {
    carritoContenedor.style.display = 'none';
    abrirCarrito.innerHTML = `<i class="fas fa-shopping-cart"> Ver carrito (${cantidadItems})</i>`;
  } else {
    carritoContenedor.style.display = 'block';
    abrirCarrito.innerHTML = '<i class="fas fa-times"></i>';
  }
});