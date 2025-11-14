import { restringir } from "./herramientas.js";
restringir();

// ===== Funciones auxiliares (Recupera y guarda en localstorage) =====
function leerEspecialidades() {
    try { return JSON.parse(localStorage.getItem("especialidades")) || []; }
    catch { return []; }
}
function guardarEspecialidades(lista) {
    localStorage.setItem("especialidades", JSON.stringify(lista || []));
}

// ===== Asegura que el dom este cargado correctamente =====
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formEspecialidad");
    const inpNombre = document.getElementById("especialidadNombre");
    const cuerpo = document.getElementById("tablaEspecialidades");

    let editandoIndex = null;

// ===== Read del CRUD =====
    function render() {
        const lista = leerEspecialidades();
        cuerpo.innerHTML = lista.length ? "" : `<tr><td colspan="2" class="text-center">No hay especialidades cargadas.</td></tr>`;
        lista.forEach((e, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${e.nombre}</td>
        <td class="text-end">
            <button class="btn btn-warning btn-sm me-1" data-accion="editar" data-index="${i}">Editar</button>
            <button class="btn btn-danger btn-sm" data-accion="eliminar" data-index="${i}">Eliminar</button>
        </td>`;
            cuerpo.appendChild(tr);
        });
    }

// ===== Añadir y Modificar una especialidad =====
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Verificacion de campo
        const nombre = inpNombre.value.trim();
        if (!nombre) {
            alert("Completá un nombre válido.");
            return;
        }
        const lista = leerEspecialidades();
        
        // Modificar especialidad ya cargada - Evita duplicados
        if (editandoIndex !== null) {
            const existe = lista.findIndex((x, i) => i !== editandoIndex && (x.nombre || "").toLowerCase() === nombre.toLowerCase());
            if (existe >= 0) {
                alert("Ya existe una especialidad con ese nombre.");
                return;
            }
            lista[editandoIndex].nombre = nombre;
            editandoIndex = null;
        
        // Agrega una nueva especialidad - Evita duplicados
        } else {
            const existe = lista.findIndex(x => (x.nombre || "").toLowerCase() === nombre.toLowerCase());
            if (existe >= 0) {
                alert("Ya existe una especialidad con ese nombre.");
                return;
            }
        // Genera un ID autoincremental
            const ids = lista.map(x => x.id).filter(n => typeof n === "number" && !isNaN(n));
            const nuevoId = ids.length ? Math.max(...ids) + 1 : 1;
            lista.push({ id: nuevoId, nombre });
        }
        guardarEspecialidades(lista);
        form.reset();
        render();
    });

// ===== Eliminar y Cargar los datos del Form =====
    cuerpo.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-accion]");
        if (!btn) return;
        const idx = Number(btn.dataset.index);
        const lista = leerEspecialidades();
        const accion = btn.dataset.accion;

        // Elimina especialidad
        if (accion === "eliminar") {
            if (confirm("¿Eliminar especialidad?")) {
                lista.splice(idx, 1);
                guardarEspecialidades(lista);
                editandoIndex = null;
                form.reset();
                render();
            }
        // Carga los datos del formulario
        } else if (accion === "editar") {
            const item = lista[idx];
            inpNombre.value = item.nombre;
            editandoIndex = idx;
            window.scrollTo(0, 0);
        }
    });

    render();
});
