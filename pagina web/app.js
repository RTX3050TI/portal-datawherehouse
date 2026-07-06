// --- VARIABLES GLOBALES Y CONTROL DE INTERFAZ ---
let miGrafico;
const rootElement = document.documentElement;

// --- VALIDACIÓN DE ACCESO (LOGIN) ---
function validarAcceso() {
    const user = document.getElementById('userInput').value;
    const pass = document.getElementById('passInput').value;
    
    // Credenciales seguras para la presentación académica
    if (user === "admin" && pass === "unasam2026") {
        document.getElementById('loginOverlay').style.opacity = "0";
        setTimeout(() => {
            document.getElementById('loginOverlay').style.display = "none";
            document.getElementById('appContainer').style.display = "flex";
            actualizarContenidoConsulta(); // Carga la primera consulta automáticamente
        }, 500);
    } else {
        document.getElementById('loginError').style.display = "block";
    }
}

function logout() {
    location.reload();
}

// --- CONTROL DE CAMBIO DE TEMA (MODO OSCURO) ---
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
    if (rootElement.getAttribute('data-theme') === 'dark') {
        rootElement.removeAttribute('data-theme');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i> Modo Oscuro';
        ajustarColoresGrafico('#64748b');
    } else {
        rootElement.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
        ajustarColoresGrafico('#94a3b8');
    }
});

// --- BANCO DE CONFIGURACIONES VISUALES FIJAS (DICCIONARIO DE CONSULTAS) ---
const diccionarioConsultas = {
    "1": { tipo: "line", interpretacion: "Muestra el comportamiento temporal del gasto mensual por programa. Permite identificar estacionalidades y picos de ejecución de presupuesto a lo largo del año." },
    "2": { tipo: "bar", interpretacion: "Compara los niveles consolidados de ejecución económica asignados a las diferentes unidades ejecutoras segmentadas de forma anual." },
    "3": { tipo: "bar", interpretacion: "Analiza el comportamiento simultáneo de los montos Certificados, Devengados y Pagados, correlacionados de acuerdo a la Fuente de Financiamiento." },
    "4": { tipo: "pie", interpretacion: "Ilustra la distribución porcentual de los recursos financieros públicos distribuidos por cada categoría de gasto específica." },
    "5": { tipo: "line", interpretacion: "Gráfico analítico de balance que contrasta el dinero reconocido administrativamente (Devengado) frente a lo efectivamente desembolsado (Pagado)." },
    "6": { tipo: "bar", interpretacion: "Identifica los cuellos de botella institucionales, ordenando de mayor a menor las entidades con mayor presupuesto certificado retenido sin devengar." },
    "7": { tipo: "bar", interpretacion: "Muestra las 10 estrategias programáticas con mayores saldos o brechas, exponiendo ineficiencias en la gestión de las metas físicas." },
    "8": { tipo: "bar", interpretacion: "Mapeo geopolítico que resalta las regiones del territorio con menores índices de capacidad de gasto público acumulado." },
    "9": { tipo: "bar", interpretacion: "Exposición evolutiva anual de la eficiencia de captación, comparando la reserva de recursos autorizados frente a su devengo final." },
    "10": { tipo: "doughnut", interpretacion: "Métrica macro-estructural que evalúa el porcentaje de recursos reservados en fase de certificación que pasaron exitosamente a compromiso formal." },
    "11": { tipo: "doughnut", interpretacion: "Analiza la fluidez del gasto público midiendo qué volumen del presupuesto comprometido cuenta con la conformidad de entrega del bien." },
    "12": { tipo: "doughnut", interpretacion: "Muestra la velocidad de tesorería para honrar las obligaciones de pago de las planillas de obligaciones ya devengadas." },
    "13": { tipo: "bar", interpretacion: "Gráfico de brechas puras que calcula los saldos retenidos en las transiciones de las fases administrativas de la ejecución financiera." },
    "14": { tipo: "bar", interpretacion: "Clasificación descentralizada que mide la asignación de recursos públicos inyectados en los diferentes departamentos." },
    "15": { tipo: "bar", interpretacion: "Filtro de visualización optimizado para concentrar el análisis exclusivamente en las 10 regiones con mayor densidad de inversión estatal." },
    "16": { tipo: "bar", interpretacion: "Desglose territorial a nivel provincial que permite identificar focos específicos de concentración de capital y obras públicas." },
    "17": { tipo: "bar", interpretacion: "Alerta de control interno que enumera las 10 municipalidades distritales con deficiencias críticas para ejecutar sus presupuestos." },
    "18": { tipo: "bar", interpretacion: "Evaluación integral de la eficiencia presupuestaria ordenada de forma descendente por la nomenclatura de los programas." },
    "19": { tipo: "bar", interpretacion: "Clasificación de impacto que audita los 10 proyectos de inversión pública u obras de infraestructura que demandaron el mayor presupuesto." },
    "20": { tipo: "pie", interpretacion: "Agrupación final de los gastos de acuerdo a los propósitos socioeconómicos y funciones específicas del Estado (Salud, Educación, Orden Público)." }
};

// --- PROCESADOR UNIVERSAL DE PETICIONES Y CONEXIÓN CON AZURE ---
async function actualizarContenidoConsulta() {
    const idSeleccionado = document.getElementById('selectorConsultas').value;
    const selectorElement = document.getElementById('selectorConsultas');
    const textoOpcion = selectorElement.options[selectorElement.selectedIndex].text;
    
    // Configuración visual por defecto
    const datosFijos = diccionarioConsultas[idSeleccionado] || { tipo: "bar", interpretacion: "Análisis dimensional genérico." };

    document.getElementById('tituloDinamico').innerText = textoOpcion;
    document.getElementById('interpretacionDinamica').innerText = datosFijos.interpretacion;

    try {
        // Petición dinámica a tu servidor web de Java en Azure
        const urlApi = `https://covid-data-unasam-gwb2g3akcea5a0en.brazilsouth-01.azurewebsites.net/api/casos?id=${idSeleccionado}`;
        const respuesta = await fetch(urlApi);
        const datosServidor = await respuesta.json();

        // Manejo de errores SQL devueltos por el backend
        if (datosServidor[0] && datosServidor[0].error) {
            console.error("Error de Base de Datos:", datosServidor[0].error);
            document.getElementById('interpretacionDinamica').innerHTML = `<span style="color:#ef4444; font-weight:bold;"><i class="fas fa-exclamation-triangle"></i> Error en Azure SQL: ${datosServidor[0].error}</span>`;
            return;
        }

        if (datosServidor.length === 0) {
            document.getElementById('interpretacionDinamica').innerHTML = "<span style='color:#f59e0b;'><i class='fas fa-info-circle'></i> Consulta ejecutada con éxito pero sin registros de datos disponibles en esta dimensión.</span>";
            return;
        }

        // --- MAPEADOR INTELIGENTE POR METADATOS ---
        const columnas = Object.keys(datosServidor[0]);
        const columnaEtiqueta = columnas[0]; // La primera columna siempre será el Eje X (Texto)
        const columnasMetricas = columnas.slice(1); // Las columnas siguientes serán el Eje Y (Números)

        // Extraer etiquetas del eje X
        const etiquetasEjeX = datosServidor.map(item => item[columnaEtiqueta]);

        // Paleta de colores institucionales desaturados
        const paletaColores = [
            { bg: 'rgba(59, 130, 246, 0.7)', border: '#3b82f6' }, // Azul
            { bg: 'rgba(16, 185, 129, 0.7)', border: '#10b981' }, // Verde
            { bg: 'rgba(239, 68, 68, 0.7)', border: '#ef4444' },  // Rojo
            { bg: 'rgba(245, 158, 11, 0.7)', border: '#f59e0b' }   // Ámbar
        ];

        // Crear dinámicamente un dataset por cada métrica numérica que devuelva el SQL
        const listaDatasets = columnasMetricas.map((columna, idx) => {
            const color = paletaColores[idx % paletaColores.length];
            return {
                label: columna.toUpperCase(),
                data: datosServidor.map(item => item[columna]),
                backgroundColor: (datosFijos.tipo === 'doughnut' || datosFijos.tipo === 'pie')
                    ? ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6']
                    : color.bg,
                borderColor: color.border,
                borderWidth: 1,
                fill: datosFijos.tipo === 'line',
                tension: 0.3
            };
        });

        // Destruir el gráfico anterior para evitar la superposición visual
        if (miGrafico) miGrafico.destroy();

        // Construir el nuevo gráfico de Chart.js con la estructura procesada
        const ctx = document.getElementById('graficoDinamico').getContext('2d');
        miGrafico = new Chart(ctx, {
            type: datosFijos.tipo,
            data: {
                labels: etiquetasEjeX,
                datasets: listaDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: true,
                        labels: { color: rootElement.getAttribute('data-theme') === 'dark' ? '#94a3b8' : '#64748b' } 
                    }
                },
                scales: (datosFijos.tipo !== 'doughnut' && datosFijos.tipo !== 'pie') ? {
                    x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.03)' } },
                    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.03)' } }
                } : {}
            }
        });

    } catch (error) {
        console.error("Error de Red:", error);
        document.getElementById('interpretacionDinamica').innerHTML = "<span style='color:#ef4444;'><i class='fas fa-wifi'></i> Error crítico de comunicación con la API de Azure App Service. Verifique que el servidor esté activo.</span>";
    }
}

// Función auxiliar para re-adaptar los colores si se cambia el tema
function ajustarColoresGrafico(colorTexto) {
    if (!miGrafico) return;
    miGrafico.options.plugins.legend.labels.color = colorTexto;
    miGrafico.update();
}