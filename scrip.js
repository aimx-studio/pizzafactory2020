// ===== DATOS TOPPINGS =====
// precios: [personal, mediana, familiar]  (también aplica para porción = mismo que personal)
const TOPPINGS = [
  { nombre: 'Camarones',          precios: [8000, 21000, 40000] },
  { nombre: 'Carne Desmechada',   precios: [7000, 13000, 22000] },
  { nombre: 'Carne Molida',       precios: [5000, 9000, 17000] },
  { nombre: 'Pollo',              precios: [9000, 13000, 17000] },
  { nombre: 'Pepperoni',          precios: [3000, 7000, 9000] },
  { nombre: 'Jamón',              precios: [2000, 4000, 6000] },
  { nombre: 'Tocineta',           precios: [3000, 5000, 9000] },
  { nombre: 'Chicharrón',         precios: [3000, 5000, 9000] },
  { nombre: 'Piña',               precios: [4000, 6000, 9000] },
  { nombre: 'Plátano',            precios: [1000, 2000, 4000] },
  { nombre: 'Aguacate',           precios: [1000, 2000, 3000] },
  { nombre: 'Tomate',             precios: [2000, 4000, 4000] },
  { nombre: 'Cebolla',            precios: [1000, 2000, 3000] },
  { nombre: 'Cebolla Caramelizada', precios: [2000, 3000, 5000] },
  { nombre: 'Chocolate',          precios: [6000, 12000, 22000] },
  { nombre: 'Ciruela',            precios: [2000, 4000, 10000] },
  { nombre: 'Papas Trituradas',   precios: [3000, 4000, 5000] },
  { nombre: 'Champiñón',          precios: [4000, 5000, 9000] },
  { nombre: 'Maíz',               precios: [2000, 4000, 7000] },
  { nombre: 'Uvas Pasas',         precios: [2000, 3000, 6000] },
  { nombre: 'Cereza',             precios: [5000, 8000, 13000] },
  { nombre: 'Costilla',           precios: [5000, 10000, 20000] },
  { nombre: 'Pico de Gallo',      precios: [2000, 3000, 4000] },
  { nombre: 'Tostacos',           precios: [3000, 10000, 18000] },
  { nombre: 'Pimentón',           precios: [1000, 2000, 3000] },
  { nombre: 'Cilantro',           precios: [1000, 2000, 3000] },
  { nombre: 'Perejil',            precios: [1000, 2000, 3000] },
  { nombre: 'Queso',              precios: [6000, 15000, 29000] },
  { nombre: 'Papas Francesas',    precios: [7000, 13000, 26000] },
  { nombre: 'Borde de Bocadillo', precios: [2000, 3000, 4000] },
  { nombre: 'Borde de Arequipe',  precios: [2000, 4000, 7000] },
  { nombre: 'Cebolla Morada',        precios: [1000, 2000, 3000] },
  { nombre: 'H. Codorniz (x10 und)', precios: [6000, 6000, 6000] },
  { nombre: 'H. Frito Americana',    precios: [2000, 2000, 2000] },
  { nombre: 'Chorizo',               precios: [5000, 5000, 5000] },
];

// Estado de toppings por lineaId
let toppingState = {};

// Mapeo de valor del select de tamaño → índice de precio de topping
// porción (idx 0 en clásicas/populares/especiales) → mismo precio que personal
function getToppingIdx(precio) {
  // pizza queso: 9000=0, 25000=1, 45000=2
  // clásicas: 9000=0(porción≈personal), 15000=0, 30000=1, 58000=2
  // populares: 10000=0, 17000=0, 37000=1, 68000=2
  // especiales: 11000=0, 21000=0, 47000=1, 78000=2
  // camarones: 26000=0, 55000=1, 102000=2
  const p = parseInt(precio);
  if ([9000, 10000, 11000, 15000, 16000, 17000, 21000, 26000].includes(p)) return 0;
  if ([25000, 30000, 37000, 47000, 55000].includes(p)) return 1;
  if ([45000, 58000, 68000, 78000, 102000].includes(p)) return 2;
  return 0;
}

function formatCOP(n) {
  return '$' + n.toLocaleString('es-CO');
}

// ===== CONSTRUIR GRIDS DE TOPPINGS =====
function buildToppingGrids() {
  document.querySelectorAll('[id^="grid-"]').forEach(grid => {
    const pizzaId = grid.id.replace('grid-', '');
    grid.innerHTML = TOPPINGS.map((t, i) => `
      <div class="topping-item" id="topping-wrap-${pizzaId}-${i}" onclick="toggleToppingItem(this)">
        <input type="checkbox" class="check-topping" data-pizza="${pizzaId}" data-idx="${i}" onchange="calcularTotal()">
        <span class="topping-label">${t.nombre}</span>
        <span class="topping-precio" id="tp-${pizzaId}-${i}">${formatCOP(t.precios[0])}</span>
      </div>
    `).join('');
  });
}

function toggleToppingItem(wrap) {
  const cb = wrap.querySelector('input[type="checkbox"]');
  cb.checked = !cb.checked;
  wrap.classList.toggle('activo', cb.checked);
  calcularTotal();
}

// Actualizar precios de toppings cuando cambia el tamaño
function actualizarPreciosToppings(pizzaId) {
  const tamanoSel = document.getElementById('tamano-' + pizzaId);
  if (!tamanoSel) return;
  const idx = getToppingIdx(tamanoSel.value);
  TOPPINGS.forEach((t, i) => {
    const el = document.getElementById('tp-' + pizzaId + '-' + i);
    if (el) el.textContent = formatCOP(t.precios[idx]);
  });
}

// ===== TOGGLE FUNCTIONS =====
function toggleMenu(titulo) {
  const seccion = titulo.nextElementSibling;
  if (!seccion) return;
  const isOpen = seccion.style.display === 'block';
  seccion.style.display = isOpen ? 'none' : 'block';
  titulo.classList.toggle('abierto', !isOpen);
}

function toggleCantidad(checkbox) {
  const item = checkbox.closest('.item');
  if (!item) return;
  const cantidad = item.querySelector('.cantidad');
  if (!cantidad) return;
  if (checkbox.checked) {
    cantidad.disabled = false;
    if (Number(cantidad.value) === 0) cantidad.value = 1;
  } else {
    cantidad.value = 0;
    cantidad.disabled = true;
  }
  item.classList.toggle('seleccionado', checkbox.checked);
  calcularTotal();
}

function toggleDescripcion(checkbox) {
  const item = checkbox.closest('.item');
  if (!item) return;
  const desc = item.querySelector('.descripcion');
  if (!desc) return;
  desc.style.display = checkbox.checked ? 'block' : 'none';
}

function toggleToppings(checkbox, itemId, pizzaId) {
  const item = document.getElementById(itemId);
  if (!item) { calcularTotal(); return; }

  const nombreProducto = item.querySelector('label')?.textContent || 'producto';

  if (!checkbox.checked) {
    // Limpiar estado al desmarcar
    if (toppingState[pizzaId]) delete toppingState[pizzaId];
    item.querySelectorAll('.tarjeta-extra').forEach(t => t.remove());
    // Ocultar chips y botón toppings de la pizza principal
    const chipsEl = document.getElementById('chips-main-' + pizzaId);
    if (chipsEl) chipsEl.innerHTML = '';
    const btnTop = item.querySelector('.btn-toppings-main');
    if (btnTop) btnTop.remove();
    const btnAgregar = item.querySelector('.btn-agregar-tarjeta');
    if (btnAgregar) btnAgregar.classList.remove('visible');
    calcularTotal();
    return;
  }

  // Al marcar: inicializar estado y crear botón toppings + chips para pizza principal
  if (!toppingState[pizzaId]) toppingState[pizzaId] = new Set();

  // Botón toppings pizza principal (Pizza 1)
  let btnTop = item.querySelector('.btn-toppings-main');
  if (!btnTop) {
    btnTop = document.createElement('button');
    btnTop.type = 'button';
    btnTop.className = 'btn-toppings-extra btn-toppings-main';
    btnTop.innerHTML = '🍕 Toppings Pizza 1';
    btnTop.onclick = () => abrirModal(pizzaId);
    // Chips de pizza principal
    const chipsDiv = document.createElement('div');
    chipsDiv.className = 'tarjeta-extra-chips';
    chipsDiv.id = 'chips-main-' + pizzaId;
    // Insertar DESPUÉS de .descripcion (o al final del item si no hay descripción)
    const descRef = item.querySelector('.descripcion');
    if (descRef) {
      descRef.insertAdjacentElement('afterend', chipsDiv);
      descRef.insertAdjacentElement('afterend', btnTop);
    } else {
      item.appendChild(btnTop);
      item.appendChild(chipsDiv);
    }
  }

  // Botón agregar otra pizza
  let btnAgregar = item.querySelector('.btn-agregar-tarjeta');
  if (!btnAgregar) {
    btnAgregar = document.createElement('button');
    btnAgregar.type = 'button';
    btnAgregar.className = 'btn-agregar-tarjeta';
    btnAgregar.innerHTML = `＋ Agregar otra ${nombreProducto}`;
    btnAgregar.onclick = () => agregarTarjetaExtra(item, pizzaId, nombreProducto);
    const panelRef = item.querySelector('.toppings-panel');
    if (panelRef) item.insertBefore(btnAgregar, panelRef);
    else item.appendChild(btnAgregar);
  }
  btnAgregar.classList.add('visible');

  calcularTotal();
}

function agregarTarjetaExtra(item, pizzaId, nombreProducto) {
  const tamanoOrig = item.querySelector('.tamano');
  if (!tamanoOrig) return;

  const opciones = Array.from(tamanoOrig.options).map(o =>
    `<option value="${o.value}">${o.text}</option>`
  ).join('');

  const lineaId = 'extra-' + pizzaId + '-' + Date.now();
  if (!toppingState) window.toppingState = {};
  toppingState[lineaId] = new Set();

  // Contar cuántas tarjetas extra ya existen para numerar (Pizza 2, Pizza 3...)
  const numExistentes = item.querySelectorAll('.tarjeta-extra').length;
  const numPizza = numExistentes + 2; // +2 porque Pizza 1 es la principal

  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta-extra';
  tarjeta.dataset.lineaId = lineaId;
  tarjeta.dataset.pizzaId = pizzaId;
  tarjeta.innerHTML = `
    <div class="tarjeta-extra-header">
      <span class="tarjeta-extra-num">🍕 Pizza ${numPizza}</span>
      <select class="tamano" onchange="calcularTotal()">${opciones}</select>
      <input type="number" class="cantidad" value="1" min="1" onchange="calcularTotal()">
      <button type="button" class="btn-toppings-extra" onclick="abrirModalExtra('${lineaId}', '${nombreProducto}', this)">🍕 Toppings</button>
      <button type="button" class="btn-eliminar-linea" onclick="eliminarTarjetaExtra(this)">✕</button>
    </div>
    <div class="tarjeta-extra-chips" id="chips-extra-${lineaId}"></div>
  `;

  // Insertar ANTES del botón agregar
  const btnAgregar = item.querySelector('.btn-agregar-tarjeta');
  item.insertBefore(tarjeta, btnAgregar);
  calcularTotal();
}

function eliminarTarjetaExtra(btn) {
  const tarjeta = btn.closest('.tarjeta-extra');
  const lineaId = tarjeta?.dataset.lineaId;
  if (lineaId && toppingState) delete toppingState[lineaId];
  tarjeta?.remove();
  calcularTotal();
}

  function abrirModalExtra(lineaId, nombreProducto, btnEl) {
  modalLineaActual = lineaId;
  if (!toppingState[lineaId]) toppingState[lineaId] = new Set();

  const tarjeta = btnEl.closest('.tarjeta-extra');
  const tamanoSel = tarjeta?.querySelector('.tamano');
  const idx = tamanoSel ? getToppingIdx(tamanoSel.value) : 0;
  const tamanoLabel = tamanoSel ? tamanoSel.options[tamanoSel.selectedIndex].text : '';

  document.getElementById('modalPizzaNombre').textContent =
    nombreProducto + (tamanoLabel ? ' · ' + tamanoLabel : '') + ' (Extra)';

  const grid = document.getElementById('modalGrid');
  grid.innerHTML = TOPPINGS.map((t, i) => {
    const activo = toppingState[lineaId].has(i) ? 'activo' : '';
    return `
      <div class="topping-item ${activo}" onclick="toggleModalTopping(${i}, this, event)">
        <input type="checkbox" ${activo ? 'checked' : ''}>
        <span class="topping-label">${t.nombre}</span>
        <span class="topping-precio">${formatCOP(t.precios[idx])}</span>
      </div>`;
  }).join('');

  actualizarSubtotalModal(lineaId, idx);
  document.getElementById('modalToppings').classList.add('abierto');
  document.body.style.overflow = 'hidden';
}

// ===== MODAL TOPPINGS =====
let modalLineaActual = null;

function toggleModalTopping(idx, wrap, event) {
  if (!modalLineaActual) return;
  if (!toppingState[modalLineaActual]) toppingState[modalLineaActual] = new Set();
  const set = toppingState[modalLineaActual];
  const cb = wrap.querySelector('input[type="checkbox"]');
  // Si el click vino del checkbox, ya cambió solo; si vino de otro hijo (label/span), invertir manualmente
  const clickEnCheckbox = event && event.target === cb;
  if (!clickEnCheckbox) {
    cb.checked = !cb.checked;
  }
  const nuevoEstado = cb.checked;
  if (nuevoEstado) {
    set.add(idx);
    wrap.classList.add('activo');
  } else {
    set.delete(idx);
    wrap.classList.remove('activo');
  }
  // Calcular idx de precio según contexto
  let precioIdx = 0;
  if (modalLineaActual.startsWith('extra-')) {
    const tarjeta = document.querySelector(`[data-linea-id="${modalLineaActual}"]`);
    const tamanoSel = tarjeta?.querySelector('.tamano');
    precioIdx = tamanoSel ? getToppingIdx(tamanoSel.value) : 0;
  } else {
    const tamanoSel = document.getElementById('tamano-' + modalLineaActual);
    precioIdx = tamanoSel ? getToppingIdx(tamanoSel.value) : 0;
  }
  actualizarSubtotalModal(modalLineaActual, precioIdx);
}

function actualizarSubtotalModal(lineaId, idx) {
  const set = toppingState[lineaId] || new Set();
  let total = 0;
  set.forEach(tIdx => { total += TOPPINGS[tIdx].precios[idx]; });
  const el = document.getElementById('modalSubtotal');
  if (el) el.textContent = formatCOP(total);
}

function cerrarModal() {
  document.getElementById('modalToppings').classList.remove('abierto');
  document.body.style.overflow = '';
  modalLineaActual = null;
}

function confirmarToppings() {
  if (!modalLineaActual) { cerrarModal(); return; }
  if (modalLineaActual.startsWith('extra-')) {
    actualizarChipsExtra(modalLineaActual);
  } else {
    actualizarChips(modalLineaActual);
  }
  cerrarModal();
  calcularTotal();
}

function actualizarChips(pizzaId) {
  const chips = document.getElementById('chips-main-' + pizzaId);
  if (!chips) return;
  const set = toppingState[pizzaId] || new Set();
  const tamanoSel = document.getElementById('tamano-' + pizzaId);
  const idx = tamanoSel ? getToppingIdx(tamanoSel.value) : 0;
  chips.innerHTML = [...set].map(tIdx => `
    <span class="chip">
      ${TOPPINGS[tIdx].nombre} <span style="color:var(--dorado);font-size:10px;">(+${formatCOP(TOPPINGS[tIdx].precios[idx])})</span>
      <span class="chip-x" onclick="quitarChipMain('${pizzaId}', ${tIdx})">×</span>
    </span>
  `).join('');
}

function quitarChipMain(pizzaId, tIdx) {
  if (toppingState[pizzaId]) toppingState[pizzaId].delete(tIdx);
  actualizarChips(pizzaId);
  calcularTotal();
}

function abrirModal(pizzaId) {
  modalLineaActual = pizzaId;
  if (!toppingState) window.toppingState = {};
  if (!toppingState[pizzaId]) toppingState[pizzaId] = new Set();
  const tamanoSel = document.getElementById('tamano-' + pizzaId);
  const idx = tamanoSel ? getToppingIdx(tamanoSel.value) : 0;
  const tamanoLabel = tamanoSel ? tamanoSel.options[tamanoSel.selectedIndex].text : '';
  const nombreLabel = document.querySelector(`#item-${pizzaId} label`)?.textContent || pizzaId;
  document.getElementById('modalPizzaNombre').textContent =
    nombreLabel + (tamanoLabel ? ' · ' + tamanoLabel : '');
  const grid = document.getElementById('modalGrid');
  grid.innerHTML = TOPPINGS.map((t, i) => {
    const activo = toppingState[pizzaId].has(i) ? 'activo' : '';
    return `
      <div class="topping-item ${activo}" onclick="toggleModalTopping(${i}, this, event)">
        <input type="checkbox" ${activo ? 'checked' : ''}>
        <span class="topping-label">${t.nombre}</span>
        <span class="topping-precio">${formatCOP(t.precios[idx])}</span>
      </div>`;
  }).join('');
  actualizarSubtotalModal(pizzaId, idx);
  document.getElementById('modalToppings').classList.add('abierto');
  document.body.style.overflow = 'hidden';
}

function actualizarChipsExtra(lineaId) {
  const chips = document.getElementById('chips-extra-' + lineaId);
  if (!chips) return;
  const set = toppingState[lineaId] || new Set();
  const tarjeta = document.querySelector(`[data-linea-id="${lineaId}"]`);
  const tamanoSel = tarjeta?.querySelector('.tamano');
  const idx = tamanoSel ? getToppingIdx(tamanoSel.value) : 0;
  chips.innerHTML = [...set].map(tIdx => `
    <span class="chip">
      ${TOPPINGS[tIdx].nombre}
      <span class="chip-x" onclick="quitarChipExtra('${lineaId}', ${tIdx})">×</span>
    </span>
  `).join('');
}

function quitarChipExtra(lineaId, tIdx) {
  if (toppingState[lineaId]) toppingState[lineaId].delete(tIdx);
  actualizarChipsExtra(lineaId);
  calcularTotal();
}

// ===== CALCULAR TOTAL =====
function calcularTotal() {
  let subtotal = 0;

  document.querySelectorAll('.check-plato').forEach(cb => {
    if (!cb.checked) return;
    const item = cb.closest('.item');
    if (!item) return;
    const cantidad = Number(item.querySelector('.cantidad')?.value) || 0;
    if (cantidad <= 0) return;

    // Precio base
    const tamanoSel = item.querySelector('.tamano');
    let precioBase = 0;
    if (tamanoSel) {
      precioBase = Number(tamanoSel.value) || 0;
      // Actualizar precios de toppings en tiempo real
      const pizzaId = tamanoSel.id.replace('tamano-', '');
      actualizarPreciosToppings(pizzaId);
    } else {
      const spanPrecio = item.querySelector('.item-linea > span');
      if (spanPrecio) {
        precioBase = parseInt(spanPrecio.textContent.replace(/\D/g, '')) || 0;
      }
    }

    // Toppings seleccionados para esta pizza (desde toppingState)
    let precioToppings = 0;
    if (tamanoSel) {
      const pizzaId = tamanoSel.id.replace('tamano-', '');
      const idx = getToppingIdx(tamanoSel.value);
      const setMain = toppingState[pizzaId];
      if (setMain) {
        setMain.forEach(tIdx => {
          precioToppings += TOPPINGS[tIdx].precios[idx];
        });
      }
    }

    subtotal += (precioBase + precioToppings) * cantidad;

    // Sumar tarjetas extra del mismo producto (con sus toppings)
    item.querySelectorAll('.tarjeta-extra').forEach(tarjeta => {
      const selExtra = tarjeta.querySelector('.tamano');
      const cantExtra = Number(tarjeta.querySelector('.cantidad')?.value) || 0;
      if (!selExtra || cantExtra <= 0) return;
      const lineaId = tarjeta.dataset.lineaId;
      const idxExtra = getToppingIdx(selExtra.value);
      let precioExtra = Number(selExtra.value) || 0;
      if (lineaId && toppingState && toppingState[lineaId]) {
        toppingState[lineaId].forEach(tIdx => {
          precioExtra += TOPPINGS[tIdx].precios[idxExtra];
        });
      }
      subtotal += precioExtra * cantExtra;
    });
  });

  document.getElementById('total').innerText = formatCOP(subtotal);
  document.getElementById('totalPedido').value = subtotal;
}

// ===== MANEJO ENTREGA =====
function manejarEntrega() {
  const val = document.getElementById('tipoEntrega').value;
  const dirField = document.getElementById('direccionField');
  const mesaField = document.getElementById('mesaField');
  const costoDom = document.getElementById('costoDomicilio');

  dirField.style.display = val === 'A domicilio' ? 'block' : 'none';
  mesaField.style.display = val === 'Comer dentro del local' ? 'block' : 'none';
  if (costoDom) costoDom.style.display = val === 'A domicilio' ? 'block' : 'none';
  calcularTotal();
}

// ===== MANEJO PAGO =====
function manejarPago() {
  const val = document.getElementById('tipoPago').value;
  document.getElementById('efectivoField').style.display = val === 'Efectivo' ? 'block' : 'none';
  document.getElementById('infoPago').style.display = (val === 'Nequi' || val === 'Bre-B / QR') ? 'block' : 'none';
  document.getElementById('infoNequi').style.display = val === 'Nequi' ? 'block' : 'none';
  document.getElementById('infoBanco').style.display = val === 'Bre-B / QR' ? 'block' : 'none';
}

// ===== ENVIAR PEDIDO =====
let ultimoEnvio = 0;

function enviarPedido(e) {
  e.preventDefault();
  const ahora = Date.now();
  if (ahora - ultimoEnvio < 5000) {
    alert('Espera unos segundos antes de enviar de nuevo.');
    return;
  }

  // Construir lista de platos
  const platos = [];
  document.querySelectorAll('.check-plato').forEach(cb => {
    if (!cb.checked) return;
    const item = cb.closest('.item');
    if (!item) return;
    const cantidad = Number(item.querySelector('.cantidad')?.value) || 0;
    if (cantidad <= 0) return;

    const nombre = cb.value;
    const tamanoSel = item.querySelector('.tamano');
    const saborSel = item.querySelector('.sabor');
    let detalle = nombre;
    if (tamanoSel) detalle += ` (${tamanoSel.options[tamanoSel.selectedIndex].text})`;
    if (saborSel) detalle += ` (${saborSel.options[saborSel.selectedIndex].text})`;
    detalle += ` x${cantidad}`;

    // Toppings (desde toppingState)
    const toppingsSeleccionados = [];
    if (tamanoSel) {
      const pizzaId = tamanoSel.id.replace('tamano-', '');
      const idx = getToppingIdx(tamanoSel.value);
      const setMain = toppingState[pizzaId];
      if (setMain && setMain.size > 0) {
        setMain.forEach(tIdx => {
          toppingsSeleccionados.push(`${TOPPINGS[tIdx].nombre} (+${formatCOP(TOPPINGS[tIdx].precios[idx])})`);
        });
      }
    }
    if (toppingsSeleccionados.length > 0) {
      detalle += `\n   ➕ Toppings: ${toppingsSeleccionados.join(', ')}`;
    }

    platos.push(detalle);

    // Tarjetas extra del mismo producto (con sus toppings)
    item.querySelectorAll('.tarjeta-extra').forEach(tarjeta => {
      const selExtra = tarjeta.querySelector('.tamano');
      const cantExtra = Number(tarjeta.querySelector('.cantidad')?.value) || 0;
      if (!selExtra || cantExtra <= 0) return;
      const lineaId = tarjeta.dataset.lineaId;
      const idxExtra = getToppingIdx(selExtra.value);
      let detalleExtra = `${cb.value} (${selExtra.options[selExtra.selectedIndex].text}) x${cantExtra}`;
      if (lineaId && toppingState && toppingState[lineaId] && toppingState[lineaId].size > 0) {
        const tops = [...toppingState[lineaId]].map(tIdx =>
          `${TOPPINGS[tIdx].nombre} (+${formatCOP(TOPPINGS[tIdx].precios[idxExtra])})`
        );
        detalleExtra += `\n   ➕ Toppings: ${tops.join(', ')}`;
      }
      platos.push(detalleExtra);
    });
  });

  if (platos.length === 0) {
    alert('Por favor selecciona al menos un producto.');
    return;
  }

  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const entrega = document.getElementById('tipoEntrega').value;
  const direccion = document.getElementById('direccion').value;
  const mesa = document.getElementById('numeroMesa').value;
  const pago = document.getElementById('tipoPago').value;
  const efectivo = document.getElementById('efectivoCliente').value;
  const especificaciones = document.getElementById('especificaciones').value;
  const total = document.getElementById('total').innerText;

  let msg = `🍕 *PEDIDO - Pizza Factory 2020*\n`;
  msg += `👤 *Cliente:* ${nombre}\n`;
  msg += `📞 *WhatsApp:* ${telefono}\n\n`;
  msg += `🛒 *PRODUCTOS:*\n`;
  platos.forEach(p => msg += `• ${p}\n`);
  msg += `\n📦 *Entrega:* ${entrega}\n`;
  if (entrega === 'A domicilio' && direccion) msg += `📍 *Dirección:* ${direccion}\n`;
  if (entrega === 'Comer dentro del local' && mesa) msg += `🔢 *Mesa:* ${mesa}\n`;
  msg += `💰 *Pago:* ${pago}\n`;
  if (pago === 'Efectivo' && efectivo) msg += `💵 *Paga con:* $${efectivo}\n`;
  if (especificaciones) msg += `📒 *Especificaciones:* ${especificaciones}\n`;
  msg += `\n💸 *TOTAL: ${total}*`;

  // Bloquear botón
  const btn = document.getElementById('btnEnviar');
  btn.disabled = true;
  btn.textContent = '⏳ Enviando...';
  ultimoEnvio = Date.now();
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = '📲 Enviar Pedido por WhatsApp';
  }, 5000);

  // Enviar a WhatsApp PRIMERO (sin bloquear)
  setTimeout(() => {
    window.location.href = 'https://wa.me/573123332244?text=' + encodeURIComponent(msg);
  }, 0);

  // Enviar a Supabase si está configurado
  const SUPABASE_URL = 'https://hotryxyvbdbizfivgfft.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdHJ5eHl2YmRiaXpmaXZnZmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MDk1MDMsImV4cCI6MjA5MjM4NTUwM30.e_8rXHLVKl8gGH7r65LzCbXpLVygnHJf3lSvYXqosfw';
  if (SUPABASE_URL && SUPABASE_KEY) {
    const payload = {
      Fecha: new Date().toISOString(),
      Nombre: nombre,
      Telefono: telefono,
      Platos: platos.join(' | '),
      Entrega: entrega,
      Direccion: entrega === 'A domicilio' ? direccion : '',
      Pago: pago,
      Efectivo: pago === 'Efectivo' ? efectivo : '',
      Extras: especificaciones || '',
      Total: document.getElementById('totalPedido').value
    };
    fetch(SUPABASE_URL + '/rest/v1/pizzafactory', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Supabase error:', err));
  }

  // Enviar a Google Forms (registro en Sheets)
  const gfData = new FormData();
  gfData.append('entry.161230881', new Date().toLocaleString('es-CO'));
  gfData.append('entry.904305260', nombre);
  gfData.append('entry.87573575', telefono);
  gfData.append('entry.1776389004', platos.join(' | '));
  gfData.append('entry.1002626749', entrega);
  gfData.append('entry.961984748', entrega === 'A domicilio' ? direccion : '');
  gfData.append('entry.280880733', pago);
  gfData.append('entry.766371234', pago === 'Efectivo' ? efectivo : '');
  gfData.append('entry.428776409', especificaciones || '');
  gfData.append('entry.1073773668', document.getElementById('totalPedido').value);
  fetch('https://docs.google.com/forms/d/e/1FAIpQLScxcosw60mqb_SwgR3DPcYJeeKimfDCLmopMsQx__-EyI9x6Q/formResponse', {
    method: 'POST',
    mode: 'no-cors',
    body: gfData
  }).catch(err => console.warn('Google Forms error:', err));
}

// ===== GUARDAR CONFIG =====
function guardarConfig() {
  // Los valores se leen en tiempo real desde los inputs, no hace falta persistir
  alert('✅ Configuración lista. Se usará en el próximo pedido.');
}

// ===== INIT =====
buildToppingGrids();
calcularTotal();

// Conectar labels con checkboxes automáticamente
document.querySelectorAll('.item-linea').forEach((linea, i) => {
  const cb = linea.querySelector('.check-plato');
  const label = linea.querySelector('label');
  if (!cb || !label) return;
  const uid = 'plato-' + i;
  cb.id = uid;
  label.htmlFor = uid;
});

// Observer para recalcular cuando cambia tamaño en pizza con toppings
document.querySelectorAll('.tamano').forEach(sel => {
  sel.addEventListener('change', function() {
    const pizzaId = this.id.replace('tamano-', '');
    actualizarPreciosToppings(pizzaId);
    calcularTotal();
  });
});