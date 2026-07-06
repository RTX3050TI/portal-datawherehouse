// --- VARIABLES GLOBALES Y CONTROL DE INTERFAZ ---
let miGrafico;
const rootElement = document.documentElement;

// --- VALIDACIÓN DE ACCESO (LOGIN) ---
function validarAcceso() {
    const user = document.getElementById('userInput').value;
    const pass = document.getElementById('passInput').value;
    
    if (user === "admin" && pass === "unasam2026") {
        document.getElementById('loginOverlay').style.opacity = "0";
        setTimeout(() => {
            document.getElementById('loginOverlay').style.display = "none";
            document.getElementById('appContainer').style.display = "flex";
            actualizarContenidoConsulta(); 
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

// --- DICCIONARIO DE CONFIGURACIONES VISUALES ---
const diccionarioConsultas = {
    "1": { tipo: "bar", interpretacion: "Muestra el comportamiento temporal del gasto mensual por programa. Permite identificar estacionalidades y picos de ejecución de presupuesto a lo largo del año." },
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

// --- PROCESADOR ADAPTATIVO INTELIGENTE DE DATOS ---
async function actualizarContenidoConsulta() {
    const idSeleccionado = document.getElementById('selectorConsultas').value;
    const selectorElement = document.getElementById('selectorConsultas');
    const textoOpcion = selectorElement.options[selectorElement.selectedIndex].text;
    
    const datosFijos = diccionarioConsultas[idSeleccionado] || { tipo: "bar", interpretacion: "Análisis dimensional." };

    document.getElementById('tituloDinamico').innerText = textoOpcion;
    document.getElementById('interpretacionDinamica').innerText = datosFijos.interpretacion;

    try {
        const urlApi = `https://covid-data-unasam-gwb2g3akcea5a0en.brazilsouth-01.azurewebsites.net/api/casos?id=${idSeleccionado}`;
        const respuesta = await fetch(urlApi);
        const datosServidor = await respuesta.json();

        if (datosServidor[0] && datosServidor[0].error) {
            console.error("Error BD:", datosServidor[0].error);
            document.getElementById('interpretacionDinamica').innerHTML = `<span style="color:#ef4444; font-weight:bold;"><i class="fas fa-exclamation-triangle"></i> Error en Azure SQL: ${datosServidor[0].error}</span>`;
            return;
        }

        if (datosServidor.length === 0) {
            document.getElementById('interpretacionDinamica').innerHTML = "<span style='color:#f59e0b;'><i class='fas fa-info-circle'></i> Consulta sin registros de datos disponibles.</span>";
            return;
        }

        // --- MOTOR DE DETECCIÓN Y ARREGLO DE DIMENSIONES ---
        const columnas = Object.keys(datosServidor[0]);
        let etiquetasEjeX = [];
        let listaDatasets = [];

        const paletaColores = [
            { bg: 'rgba(59, 130, 246, 0.7)', border: '#3b82f6' }, // Azul
            { bg: 'rgba(16, 185, 129, 0.7)', border: '#10b981' }, // Verde
            { bg: 'rgba(239, 68, 68, 0.7)', border: '#ef4444' },  // Rojo
            { bg: 'rgba(245, 158, 11, 0.7)', border: '#f59e0b' }   // Ámbar
        ];

        // CASO A: Consultas de transición o agregación sin texto (10, 11, 12, 13)
        if (["10", "11", "12", "13"].includes(idSeleccionado)) {
            etiquetasEjeX = columnas.map(col => col.toUpperCase());
            const valores = columnas.map(col => datosServidor[0][col]);

            listaDatasets = [{
                label: "Monto Ejecutado S/.",
                data: valores,
                backgroundColor: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'],
                borderWidth: 1
            }];
        }
    // CASO B: Consultas complejas con doble texto (1 y 2)
        else if (["1", "2"].includes(idSeleccionado)) {
            // Escudo anti-crash: Verifica si el servidor realmente mandó 3 columnas o más
            if (columnas.length >= 3) {
                etiquetasEjeX = datosServidor.map(item => `${item[columnas[0]]} (${item[columnas[1]]})`);
                const valores = datosServidor.map(item => item[columnas[2]]);

                listaDatasets = [{
                    label: columnas[2].toUpperCase(),
                    data: valores,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }];
            } else {
                // Si Java manda menos columnas por error, dibuja de forma simple sin colapsar
                etiquetasEjeX = datosServidor.map(item => item[columnas[0]]);
                const valores = datosServidor.map(item => item[columnas[1]]);

                listaDatasets = [{
                    label: (columnas[1] ? columnas[1].toUpperCase() : "TOTAL"),
                    data: valores,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }];
            }
        }
        // CASO C: Estructura Estándar (Un texto de categoría y una o varias métricas numéricas)
        else {
            const columnaEtiqueta = columnas[0];
            // Filtrar solo las columnas que contengan valores verdaderamente numéricos
            const columnasMetricas = columnas.filter((col, idx) => idx > 0 && typeof datosServidor[0][col] === 'number');

            etiquetasEjeX = datosServidor.map(item => item[columnaEtiqueta]);

            listaDatasets = columnasMetricas.map((columna, idx) => {
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
        }

        // --- RENDERIZADO EN CHART.JS ---
        if (miGrafico) miGrafico.destroy();

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
        console.error("Error Red:", error);
        document.getElementById('interpretacionDinamica').innerHTML = "<span style='color:#ef4444;'><i class='fas fa-wifi'></i> Error de comunicación con la API de Azure App Service.</span>";
    }
}

function ajustarColoresGrafico(colorTexto) {
    if (!miGrafico) return;
    miGrafico.options.plugins.legend.labels.color = colorTexto;
    miGrafico.update();
}

// --- FUNCIONALIDADES FUTURAS (roadmap para la sustentación) ---

function exportarReportePDF() {
    alert("Módulo de Impresión Activo:\nGenerando estructura vectorial del reporte...\n\nEstado: Funcionalidad de exportación automatizada programada para la siguiente fase de entrega (Librería iText/OpenPDF).");
}

function activarModuloIA() {
    // Oculta las consultas estándar y muestra el entorno de IA para la demostración técnica
    document.getElementById('moduloConsultas').style.display = 'none';
    document.getElementById('panelGraficos').style.display = 'none';
    document.getElementById('panelIA').style.display = 'block';
    
    // Activa la clase active en los menús de la barra lateral
    const links = document.querySelectorAll('.nav-link');
    links[0].classList.remove('active');
    links[1].classList.add('active');
}

// Permitir regresar al panel principal si hace clic en Panel de Consultas
document.querySelectorAll('.nav-link')[0].addEventListener('click', () => {
    document.getElementById('moduloConsultas').style.display = 'block';
    document.getElementById('panelGraficos').style.display = 'block';
    document.getElementById('panelIA').style.display = 'none';
    
    const links = document.querySelectorAll('.nav-link');
    links[1].classList.remove('active');
    links[0].classList.add('active');
    actualizarContenidoConsulta();
});
/*
function ejecutarConsultaIA() {
    alert("Procesando consulta en lenguaje natural...\nGenerando token sintáctico de base de datos...\n\nEstado: Conexión con el modelo Text-to-SQL en desarrollo.");
}*/

async function ejecutarConsultaIA() {
    const pregunta = document.getElementById('preguntaIA').value;
    if (!pregunta) {
        alert("Por favor, escriba una consulta analítica.");
        return;
    }

    const estadoDiv = document.getElementById('estadoIA');
    estadoDiv.innerText = "Procesando lenguaje natural en Google Gemini y consultando Azure SQL...";
    
    try {
        const urlIA = `https://covid-data-unasam-gwb2g3akcea5a0en.brazilsouth-01.azurewebsites.net/api/ia?q=${encodeURIComponent(pregunta)}`;
        const respuesta = await fetch(urlIA);
        const datosServidor = await respuesta.json();

        if (datosServidor[0] && datosServidor[0].error) {
            estadoDiv.innerHTML = `<span style="color:#ef4444;"><i class="fas fa-times"></i> ${datosServidor[0].error}</span>`;
            return;
        }

        // Si hay éxito, mostramos los datos crudos devueltos por la IA
        let htmlTabla = "<table border='1' style='width:100%; border-collapse: collapse; margin-top: 15px; color: var(--text-main);'>";
        
        // Cabeceras automáticas
        const columnas = Object.keys(datosServidor[0]);
        htmlTabla += "<tr style='background: var(--accent-color); color: white;'>";
        columnas.forEach(col => htmlTabla += `<th style='padding: 8px;'>${col.toUpperCase()}</th>`);
        htmlTabla += "</tr>";

        // Filas automáticas
        datosServidor.forEach(fila => {
            htmlTabla += "<tr>";
            columnas.forEach(col => htmlTabla += `<td style='padding: 8px; border: 1px solid var(--border-color);'>${fila[col]}</td>`);
            htmlTabla += "</tr>";
        });
        htmlTabla += "</table>";

        estadoDiv.innerHTML = `<span style="color:#10b981;"><i class="fas fa-check"></i> Consulta interpretada y ejecutada exitosamente.</span>` + htmlTabla;

    } catch (error) {
        estadoDiv.innerHTML = `<span style="color:#ef4444;"><i class="fas fa-wifi"></i> Error al conectar con el motor de Inteligencia Artificial en el servidor.</span>`;
    }
}