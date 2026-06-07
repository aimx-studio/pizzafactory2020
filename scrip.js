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
];

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
  const panel = document.getElementById('toppings-' + pizzaId);
  if (!panel) return;
  panel.style.display = checkbox.checked ? 'block' : 'none';
  if (!checkbox.checked) {
    // desmarcar todos los toppings de esta pizza
    panel.querySelectorAll('.check-topping').forEach(cb => {
      cb.checked = false;
      cb.closest('.topping-item').classList.remove('activo');
    });
  }
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

    // Toppings seleccionados para esta pizza
    let precioToppings = 0;
    if (tamanoSel) {
      const pizzaId = tamanoSel.id.replace('tamano-', '');
      const idx = getToppingIdx(tamanoSel.value);
      item.querySelectorAll('.check-topping').forEach(tcb => {
        if (tcb.checked) {
          const tIdx = parseInt(tcb.dataset.idx);
          precioToppings += TOPPINGS[tIdx].precios[idx];
        }
      });
    }

    subtotal += (precioBase + precioToppings) * cantidad;
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

    // Toppings
    const toppingsSeleccionados = [];
    if (tamanoSel) {
      const pizzaId = tamanoSel.id.replace('tamano-', '');
      const idx = getToppingIdx(tamanoSel.value);
      item.querySelectorAll('.check-topping').forEach(tcb => {
        if (tcb.checked) {
          const tIdx = parseInt(tcb.dataset.idx);
          toppingsSeleccionados.push(`${TOPPINGS[tIdx].nombre} (+${formatCOP(TOPPINGS[tIdx].precios[idx])})`);
        }
      });
    }
    if (toppingsSeleccionados.length > 0) {
      detalle += `\n   ➕ Toppings: ${toppingsSeleccionados.join(', ')}`;
    }

    platos.push(detalle);
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
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👤 *Cliente:* ${nombre}\n`;
  msg += `📞 *WhatsApp:* ${telefono}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🛒 *PRODUCTOS:*\n`;
  platos.forEach(p => msg += `• ${p}\n`);
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 *Entrega:* ${entrega}\n`;
  if (entrega === 'A domicilio' && direccion) msg += `📍 *Dirección:* ${direccion}\n`;
  if (entrega === 'Comer dentro del local' && mesa) msg += `🔢 *Mesa:* ${mesa}\n`;
  msg += `💰 *Pago:* ${pago}\n`;
  if (pago === 'Efectivo' && efectivo) msg += `💵 *Paga con:* $${efectivo}\n`;
  if (especificaciones) msg += `📒 *Especificaciones:* ${especificaciones}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💸 *TOTAL: ${total}*\n`;
  msg += `\n_Pedido enviado desde el menú digital_ 📱`;

  // Bloquear botón
  const btn = document.getElementById('btnEnviar');
  btn.disabled = true;
  btn.textContent = '⏳ Enviando...';
  ultimoEnvio = Date.now();
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = '📲 Enviar Pedido por WhatsApp';
  }, 5000);

  // Enviar a WhatsApp
  window.location.href = 'https://wa.me/573123332244?text=' + encodeURIComponent(msg);

  // Enviar a Supabase si está configurado
  const SUPABASE_URL = document.getElementById('supabaseUrl').value.trim();
  const SUPABASE_KEY = document.getElementById('supabaseKey').value.trim();
  if (SUPABASE_URL && SUPABASE_KEY) {
    const payload = {
      Fecha: new Date().toISOString(),
      Nombre: nombre,
      Telefono: telefono,
      Platos: platos.join(' | '),
      Entrega: entrega,
      Direccion: entrega === 'A domicilio' ? direccion : '',
      Pago: pago,
      Total: document.getElementById('totalPedido').value
    };
    fetch(SUPABASE_URL + '/rest/v1/pedidos', {
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

  // Enviar a Google Apps Script si está configurado
  const APPS_URL = document.getElementById('appsScriptUrl').value.trim();
  if (APPS_URL) {
    fetch(APPS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ nombre, telefono, platos: platos.join(' | '), entrega, direccion, pago, total })
    }).catch(err => console.warn('Apps Script error:', err));
  }
}

// ===== GUARDAR CONFIG =====
function guardarConfig() {
  // Los valores se leen en tiempo real desde los inputs, no hace falta persistir
  alert('✅ Configuración lista. Se usará en el próximo pedido.');
}

// ===== INIT =====
buildToppingGrids();
calcularTotal();

// Observer para recalcular cuando cambia tamaño en pizza con toppings
document.querySelectorAll('.tamano').forEach(sel => {
  sel.addEventListener('change', function() {
    const pizzaId = this.id.replace('tamano-', '');
    actualizarPreciosToppings(pizzaId);
    calcularTotal();
  });
});