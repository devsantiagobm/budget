// variables
const form = document.getElementById('agregar-gasto')
const mensajeEnvio = document.getElementById('mensaje-alerta');
const gastosLista = document.getElementById('lista-gastos');
const submitButton = document.getElementById('submit');
const restanteAgotadoButton = document.querySelector('.restante-agotado');

// eventos

eventos();
function eventos() {
    document.addEventListener('DOMContentLoaded', nuevoPresupuesto)
    form.addEventListener('submit', e => ui.verificarForm(e))
    gastosLista.addEventListener('click', e => { if (e.target.classList.contains('btn')) presupuesto.eliminarGasto(e) })
}

//clases

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

    nuevoGasto(nombre, cantidad) {
        const gasto = { nombre, cantidad, id: Date.now() }  // nombre: nombre, cantidad: cantidad
        this.gastos = [gasto, ...this.gastos]
        ui.insertarGastos(this.gastos)
        this.actualizarRestante()
    }

    actualizarRestante() {
        this.restante = this.gastos.reduce((total, item) => total + item.cantidad, 0)
        ui.mostrarRestante(this.presupuesto, this.restante);
        ui.restanteClases(presupuesto);
        ui.restanteAgotado();
    }

    eliminarGasto(e) {
        const parent = e.target.parentNode.dataset.id;
        this.gastos = this.gastos.filter(item => item.id != parent);
        ui.insertarGastos(this.gastos);
        this.actualizarRestante()

    }

}

let presupuesto;

class UI {
    insertarPresupuesto(presupuesto) {
        const total = document.getElementById('total')
        const restante = document.getElementById('restante')

        total.textContent = presupuesto
        restante.textContent = presupuesto
    }

    verificarForm(e) {
        e.preventDefault();
        const nombre = form.nombre.value;
        const cantidad = Number(form.cantidad.value);
        mensajeEnvio.style.maxHeight = `${mensajeEnvio.scrollHeight + 20}px`;
        mensajeEnvio.style.padding = `12px 20px`;

        const revisarDatosFormulario = nombre == "" || cantidad == "" || isNaN(cantidad) || cantidad <= 0;

        if (revisarDatosFormulario) {
            this.propiedadesMensajeEnvio('alert-danger', "¡Todos los campos deben ser correctos!");
            return;
        }

        form.reset();
        presupuesto.nuevoGasto(nombre, cantidad);
        this.propiedadesMensajeEnvio('alert-success', "Gasto añadido")

    }

    propiedadesMensajeEnvio(classRemove, message) {
        mensajeEnvio.classList.add(`${classRemove}`);
        mensajeEnvio.textContent = message;
        setTimeout(() => {
            mensajeEnvio.style.maxHeight = 0
            mensajeEnvio.style.padding = `0`;
            mensajeEnvio.classList.remove(`${classRemove}`);
        }, 1500);
    }

    insertarGastos(gastos) {
        this.limpiarHTML();
        gastos.forEach(item => {
            this.crearItem(item)
        })
    };

    crearItem(gasto) {
        const { nombre, cantidad, id } = gasto;

        const nuevoGasto = document.createElement('li');
        nuevoGasto.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'item-gastos');
        nuevoGasto.dataset.id = id;
        nuevoGasto.innerText = `${nombre}`;

        const cantidadItem = document.createElement('span')
        cantidadItem.classList.add('badge', 'badge-primary', 'badge-pill');
        cantidadItem.textContent = `$${cantidad}`;
        nuevoGasto.appendChild(cantidadItem);

        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
        btnBorrar.textContent = 'Borrar';
        nuevoGasto.appendChild(btnBorrar);

        gastosLista.appendChild(nuevoGasto);

    }

    restanteClases(presupuestoObjeto) {
        const { presupuesto, restante } = presupuestoObjeto;
        const restanteCantidad = presupuesto - restante
        const restanteDiv = document.querySelector('.restante');

        const alerts = ["alert-success", "alert-danger", "alert-warning"]
        const type = (restanteCantidad <= presupuesto / 4) * 1 || (restanteCantidad <= presupuesto / 2) * 2;

        definirClases(alerts[type]);

        function definirClases(add) {
            alerts.forEach(item => restanteDiv.classList.remove(item))
            restanteDiv.classList.add(add);
        }

    }

    mostrarRestante(total, restante) {
        document.getElementById('restante').textContent = total - restante;
    }
    limpiarHTML() {
        while (gastosLista.firstChild) {
            gastosLista.removeChild(gastosLista.firstChild)
        }
    }

    restanteAgotado() {
        if (presupuesto.restante >= presupuesto.presupuesto) {
            submitButton.disabled = true;
            restanteAgotadoButton.style.maxHeight = `${restanteAgotadoButton.scrollHeight + 24}px`;
            restanteAgotadoButton.style.padding = "12px 20px";
            return;
        }

        submitButton.disabled = false;
        restanteAgotadoButton.style.maxHeight = 0;
        restanteAgotadoButton.style.padding = 0;

    }
}

const ui = new UI();



//funciones

function nuevoPresupuesto() {
    let presupuestoUsuario = Number(prompt('Elige tu Presupuesto: '));
    while (presupuestoUsuario == "" || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        presupuestoUsuario = Number(prompt('Escribe un presupuesto correcto: '))
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuestoUsuario);
}
