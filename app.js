// --- DICCIONARIO INTERNACIONAL ---
const LANGUAGES = {
    es: {
        "login-subtitle": "Inteligencia de Negocios", "login-btn": "Ingresar al Sistema", "login-remember": "Recordar mis credenciales",
        "login-loading": "Autenticando en Azure...", "status-online": "En línea - Azure SQL Server",
        "nav-bi": "Dashboard BI", "nav-ia": "Asistente IA", "config-title": "Configuración",
        "bi-title": "Inteligencia de Negocios Corporativa", "bi-desc": "Visualización de reportes estructurales a través de Power BI.",
        "ia-btn": "Consultar", "ia-loading-text": "AURA está procesando los datos...", "ia-pdf": "Exportar Auditoría",
        "config-logout": "Cerrar Sesión", "config-theme": "Temas de Entorno", "config-perf": "Efectos Visuales"
    },
    qu: {
        "login-subtitle": "Runa Yachay Kachay", "login-btn": "Yaykuy Llikaman", "login-remember": "Kikinpa sutiyta yuyay",
        "login-loading": "Azure llikapi qatichkan...", "status-online": "Kachkan",
        "nav-bi": "Tukuypaq Mastari", "nav-ia": "IA Yanapakuq", "config-title": "Allichaykuna",
        "bi-title": "Hatun Ruraykunapa Mastarinin", "bi-desc": "Power BI nisqapi qatipay ruraykuna khaway.",
        "ia-btn": "Tapuy", "ia-loading-text": "AURA SQL Serverpi rurachkan...", "ia-pdf": "Qatipayta PDFman Hurquy",
        "config-logout": "Lluqsiy", "config-theme": "Llimphi Hawakuna", "config-perf": "Kuyuqkuna Rikchay"
    },
    en: {
        "login-subtitle": "Business Intelligence", "login-btn": "Sign In to System", "login-remember": "Remember my credentials",
        "login-loading": "Authenticating on Azure...", "status-online": "Online - Azure SQL Server",
        "nav-bi": "BI Dashboard", "nav-ia": "AI Assistant", "config-title": "Settings",
        "bi-title": "Corporate Business Intelligence", "bi-desc": "Visualization of structural reports through Power BI.",
        "ia-btn": "Query", "ia-loading-text": "AURA is processing database...", "ia-pdf": "Export Audit",
        "config-logout": "Log Out", "config-theme": "Environment Themes", "config-perf": "Visual Effects"
    }
};

let historialConversacion = []; // LA MEMORIA DE AURA

document.addEventListener("DOMContentLoaded", () => {
    
    const loginScreen = document.getElementById("login-screen");
    const mainSystem = document.getElementById("main-system");
    const loginForm = document.getElementById("login-form");
    const btnLogin = document.getElementById("btn-login");
    const loginSpinner = document.getElementById("login-spinner");
    const loginUser = document.getElementById("login-user");
    const loginPass = document.getElementById("login-pass");
    const rememberCheck = document.getElementById("remember-check");

    // 1. CARGA DE MEMORIA: SESIÓN, TEMA E IDIOMA
    if (localStorage.getItem("segep_session") === "activa") {
        loginScreen.classList.add("hidden");
        mainSystem.classList.remove("hidden");
        aplicarSaludoPersonalizado();
    }
    if (localStorage.getItem("segep_saved_user")) {
        loginUser.value = localStorage.getItem("segep_saved_user");
        loginPass.value = localStorage.getItem("segep_saved_pass");
        rememberCheck.checked = true;
    }
    const savedTheme = localStorage.getItem("segep_theme");
    if (savedTheme && savedTheme !== "azure-blue") {
        document.body.classList.add(savedTheme);
    }
    const savedLang = localStorage.getItem("segep_lang");
    if (savedLang) {
        document.getElementById("lang-selector").value = savedLang;
        setTimeout(() => document.getElementById("lang-selector").dispatchEvent(new Event('change')), 100);
    }

    // 2. LÓGICA DE ACCESO Y SALUDO PERSONALIZADO
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (rememberCheck.checked) {
            localStorage.setItem("segep_saved_user", loginUser.value);
            localStorage.setItem("segep_saved_pass", loginPass.value);
        } else {
            localStorage.removeItem("segep_saved_user");
            localStorage.removeItem("segep_saved_pass");
        }

        let rawName = loginUser.value.split('@')[0];
        let capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
        localStorage.setItem("segep_active_name", capitalizedName);

        btnLogin.classList.add("hidden");
        loginSpinner.classList.remove("hidden");

        setTimeout(() => {
            localStorage.setItem("segep_session", "activa"); 
            aplicarSaludoPersonalizado();
            
            loginScreen.classList.add("hidden");
            mainSystem.classList.remove("hidden");
            window.dispatchEvent(new Event('resize'));
            btnLogin.classList.remove("hidden");
            loginSpinner.classList.add("hidden");
        }, 1500);
    });

    function aplicarSaludoPersonalizado() {
        const nombreUsuario = localStorage.getItem("segep_active_name");
        if (nombreUsuario) {
            const userNameElement = document.querySelector('.user-name');
            if (userNameElement) userNameElement.textContent = nombreUsuario;

            const auraGreeting = document.querySelector('.aura-bubble .bubble-content');
            if (auraGreeting && !auraGreeting.classList.contains('advanced-results')) {
                auraGreeting.innerHTML = `Hola, <strong>${nombreUsuario}</strong>. Soy AURA. He indexado el Data Warehouse del gasto COVID-19. Selecciona un modelo analítico y escribe tu pregunta en la parte inferior.`;
            }
        }
    }

    // 3. CERRAR SESIÓN
    document.getElementById("btn-logout").addEventListener("click", () => {
        if(confirm("¿Está seguro que desea abandonar el entorno analítico actual?")) {
            localStorage.removeItem("segep_session");
            localStorage.removeItem("segep_active_name");
            window.location.reload();
        }
    });

    // 4. NAVEGACIÓN SPA
    const navButtons = document.querySelectorAll(".nav-btn");
    const viewSections = document.querySelectorAll(".view-section");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            navButtons.forEach(b => b.classList.remove("active"));
            viewSections.forEach(s => s.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(btn.getAttribute("data-target")).classList.add("active");
        });
    });

    // 5. TEMAS Y CONFIGURACIÓN
    document.getElementById("btn-config").addEventListener("click", () => document.getElementById("config-panel").classList.remove("config-panel-hidden"));
    document.getElementById("btn-close-config").addEventListener("click", () => document.getElementById("config-panel").classList.add("config-panel-hidden"));

    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.body.className = ""; 
            const selectedTheme = btn.getAttribute("data-theme");
            if (selectedTheme !== "azure-blue") document.body.classList.add(selectedTheme);
            localStorage.setItem("segep_theme", selectedTheme); 
        });
    });

    // 6. TRADUCTOR MÚLTIPLE
    const langSelector = document.getElementById("lang-selector");
    langSelector.addEventListener("change", () => {
        const selectedLang = langSelector.value;
        const dictionary = LANGUAGES[selectedLang];
        localStorage.setItem("segep_lang", selectedLang); 

        document.querySelectorAll("[data-lang]").forEach(element => {
            const langKey = element.getAttribute("data-lang");
            if (dictionary[langKey]) {
                if (element.tagName === "INPUT") element.placeholder = dictionary[langKey];
                else {
                    const icon = element.querySelector("i");
                    if (icon) {
                        element.innerHTML = "";
                        element.appendChild(icon);
                        element.innerHTML += " " + dictionary[langKey];
                    } else {
                        element.textContent = dictionary[langKey];
                    }
                }
            }
        });
    });

    // 7. EVENTO TECLA ENTER EN EL INPUT DE IA
    const queryInput = document.getElementById("ia-query");
    if(queryInput) {
        queryInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                e.preventDefault(); 
                procesarIAReal();
            }
        });
    }
});

// ========================================================
// ORQUESTADOR DE IA CON HISTORIAL REAL (CHAT APILABLE)
// ========================================================
async function procesarIAReal() {
    const queryInput = document.getElementById("ia-query");
    const modeloSelect = document.getElementById("ia-model-selector");
    const rawQuery = queryInput.value.trim();
    const tipoModelo = modeloSelect.value; 

    if (!rawQuery) return;

    // Guardar la pregunta en la memoria del navegador (Máx 4 últimas interacciones)
    historialConversacion.push(rawQuery);
    if (historialConversacion.length > 4) historialConversacion.shift();

    const chatArea = document.querySelector(".ia-chat-area");
    queryInput.value = ""; // Limpiar input

    // 1. CREAR BURBUJA DEL USUARIO (PREGUNTA)
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user-bubble";
    userBubble.style.alignSelf = "flex-end";
    userBubble.style.marginBottom = "20px";
    userBubble.innerHTML = `
        <div style="display:flex; gap:15px; justify-content: flex-end; align-items: flex-start;">
            <div class="bubble-content" style="background: var(--primary); color: white; border-radius: var(--radius-md) 0 var(--radius-md) var(--radius-md);">
                <small style="display:block; font-size:10px; opacity:0.8; margin-bottom:4px; font-weight:700;">MODELO ${tipoModelo.toUpperCase()}</small>
                ${rawQuery}
            </div>
            <div class="bubble-avatar" style="background: var(--text-main);"><i class="fas fa-user"></i></div>
        </div>
    `;
    chatArea.appendChild(userBubble);
    chatArea.scrollTop = chatArea.scrollHeight;

    // 2. CREAR BURBUJA DE CARGA SKELETON
    const bubbleId = "aura-resp-" + Date.now();
    const loadingBubble = document.createElement("div");
    loadingBubble.className = "chat-bubble aura-bubble full-width";
    loadingBubble.id = bubbleId;
    loadingBubble.style.marginBottom = "20px";
    loadingBubble.innerHTML = `
        <div style="display:flex; gap:15px; width: 100%;">
            <div class="bubble-avatar"><i class="fas fa-robot"></i></div>
            <div class="bubble-content advanced-results" style="width: 100%;">
                <div class="ia-loading-overlay">
                    <div class="typing-indicator"><span></span><span></span><span></span></div>
                    <p class="loading-text" style="color: var(--primary); font-weight: 600; margin-left: 10px;">AURA: Analizando tu consulta y conectando con Azure...</p>
                </div>
            </div>
        </div>
    `;
    chatArea.appendChild(loadingBubble);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
        // 3. NUEVA LLAMADA API (MÉTODO POST) PARA EVITAR LIMITES DE URL
        const urlAzure = `https://covid-data-unasam-gwb2g3akcea5a0en.brazilsouth-01.azurewebsites.net/api/ia`; 
        // Nota: Si aún usas NetBeans en local, cambia a: http://localhost:8080/api/ia
        
        const respuesta = await fetch(urlAzure, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: rawQuery,
                tipo: tipoModelo,
                historial: historialConversacion // Enviamos todo el historial ordenado
            })
        });
        
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const paqueteIA = await respuesta.json();
        if (paqueteIA.error) throw new Error(paqueteIA.error);

        // 4. PREPARAR DATOS Y TABLA
        const datos = paqueteIA.datos;
        let htmlTabla = "";
        let hasData = datos && datos.length > 0;
        let columnas = [];

        if (!hasData) {
            htmlTabla = "<p style='padding:20px; color: var(--text-muted);'>La consulta no arrojó registros coincidentes.</p>";
        } else {
            columnas = Object.keys(datos[0]);
            htmlTabla = "<table class='tabla-ia'><thead><tr>";
            columnas.forEach(col => htmlTabla += `<th>${col.replace(/_/g, ' ').toUpperCase()}</th>`);
            htmlTabla += "</tr></thead><tbody>";
            const formatoMoneda = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

            datos.forEach(fila => { 
                htmlTabla += "<tr>"; 
                columnas.forEach(col => {
                    let valor = fila[col];
                    if (typeof valor === 'number' && (col.toLowerCase().includes('monto') || col.toLowerCase().includes('total') || col.toLowerCase().includes('brecha') || col.toLowerCase().includes('devengado'))) {
                        valor = formatoMoneda.format(valor);
                    }
                    htmlTabla += `<td>${valor}</td>`;
                }); 
                htmlTabla += "</tr>"; 
            });
            htmlTabla += "</tbody></table>";
        }

        // 5. REEMPLAZAR LA BURBUJA DE CARGA CON LA RESPUESTA FINAL
        const canvasId = "canvas-" + Date.now();
        const finalContent = document.getElementById(bubbleId);
        
        finalContent.innerHTML = `
            <div style="display:flex; gap:15px; width: 100%;">
                <div class="bubble-avatar"><i class="fas fa-robot"></i></div>
                <div class="bubble-content advanced-results" style="width: 100%;" id="export-${bubbleId}">
                    
                    <div class="result-actions">
                        <button onclick="exportarReporteUnico('export-${bubbleId}')" class="btn-sm-outline"><i class="fas fa-file-pdf"></i> Imprimir Reporte</button>
                    </div>

                    <div class="result-section card-inner">
                        <div class="section-badge"><i class="fas fa-brain"></i> Análisis Contextual</div>
                        <div class="ia-analysis-text" style="text-align: justify;"><strong>AURA:</strong> ${paqueteIA.analisis}</div>
                    </div>

                    <div class="ia-visuals">
                        <div class="result-section card-inner table-box">
                            <div class="section-badge"><i class="fas fa-table"></i> Datos Estructurados</div>
                            <div class="ia-table-wrapper">${htmlTabla}</div>
                        </div>
                        ${hasData && columnas.length >= 2 ? `
                        <div class="result-section card-inner chart-box">
                            <div class="section-badge"><i class="fas fa-chart-bar"></i> Visualización Dinámica</div>
                            <div class="ia-chart-wrapper"><canvas id="${canvasId}"></canvas></div>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;

        // 6. DIBUJAR GRÁFICO INDEPENDIENTE
        if (hasData && columnas.length >= 2) {
            setTimeout(() => {
                const ctx = document.getElementById(canvasId).getContext('2d');
                const colorTexto = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim();
                const paletaColores = ['rgba(15, 108, 189, 0.8)', 'rgba(16, 124, 16, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(245, 166, 35, 0.8)', 'rgba(209, 52, 56, 0.8)'];
                
                const tipoGrafico = paqueteIA.grafico || 'bar';

                new Chart(ctx, {
                    type: tipoGrafico,
                    data: {
                        labels: datos.map(item => item[columnas[0]]),
                        datasets: [{
                            label: columnas[columnas.length - 1].replace(/_/g, ' ').toUpperCase(),
                            data: datos.map(item => item[columnas[columnas.length - 1]]),
                            backgroundColor: (tipoGrafico === 'pie' || tipoGrafico === 'doughnut') ? paletaColores : 'rgba(15, 108, 189, 0.7)',
                            borderColor: 'rgba(15, 108, 189, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { labels: { color: colorTexto } } },
                        scales: (tipoGrafico === 'bar' || tipoGrafico === 'line') ? {
                            x: { ticks: { color: colorTexto } },
                            y: { ticks: { color: colorTexto } }
                        } : {}
                    }
                });
            }, 100); 
        }

        chatArea.scrollTop = chatArea.scrollHeight;

    } catch (error) {
        const finalContent = document.getElementById(bubbleId);
        finalContent.innerHTML = `
            <div style="display:flex; gap:15px; width: 100%;">
                <div class="bubble-avatar" style="background: var(--danger);"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="bubble-content" style="border: 1px solid var(--danger); color: var(--danger); width: 100%;">
                    <strong>Error de Conexión:</strong> ${error.message}. Verifica tu backend.
                </div>
            </div>
        `;
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

// ========================================================
// REPARACIÓN DEFINITIVA DEL PDF (CERO CORTES)
// ========================================================

// 1. Exportar Solo la Respuesta Actual (Centrada y Apilada)
function exportarReporteUnico(elementId) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;

    // Ocultar botones
    const actions = elemento.querySelector(".result-actions");
    if (actions) actions.style.display = 'none';

    // TRUCO MAESTRO: Forzar a que la tabla y el gráfico se apilen verticalmente (Adiós Grid)
    const visuales = elemento.querySelector(".ia-visuals");
    let originalDisplay = "";
    if (visuales) {
        originalDisplay = visuales.style.display;
        visuales.style.display = "flex";
        visuales.style.flexDirection = "column";
        visuales.style.gap = "20px";
    }

    // Estilos seguros para A4
    const originalBackground = elemento.style.background;
    elemento.style.background = "#ffffff";
    elemento.style.padding = "30px";
    elemento.style.width = "800px"; // Ancho exacto simulado para A4 Portrait

    const opt = {
        margin:       10,
        filename:     'SEGEP_Auditoria_Individual.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(elemento).save().then(() => {
        // Restaurar pantalla
        if (actions) actions.style.display = 'flex';
        if (visuales) visuales.style.display = originalDisplay;
        elemento.style.background = originalBackground;
        elemento.style.padding = "";
        elemento.style.width = "100%";
    });
}

// 2. Exportar TODO EL CHAT (Centrado y Apilado)
function exportarChatCompleto() {
    const chatContainer = document.querySelector(".ia-chat-area");
    
    // Guardar estado original
    const originalHeight = chatContainer.style.height;
    const originalOverflow = chatContainer.style.overflowY;
    const originalBg = chatContainer.style.background;
    
    // TRUCO MAESTRO MULTIPLE: Convertir todos los grids en columnas verticales
    const todosVisuales = chatContainer.querySelectorAll('.ia-visuals');
    todosVisuales.forEach(v => {
        v.dataset.display = v.style.display || "";
        v.style.display = 'flex';
        v.style.flexDirection = 'column';
    });
    
    // Preparar contenedor global
    chatContainer.style.height = "auto";
    chatContainer.style.overflowY = "visible";
    chatContainer.style.background = "#ffffff";
    chatContainer.style.padding = "40px";
    chatContainer.style.width = "1000px"; 
    
    document.body.style.overflow = "hidden";

    const opt = {
        margin:       15,
        filename:     'SEGEP_Historial_Completo.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(chatContainer).save().then(() => {
        // Restaurar contenedor global
        chatContainer.style.height = originalHeight;
        chatContainer.style.overflowY = originalOverflow;
        chatContainer.style.background = originalBg;
        chatContainer.style.padding = "25px";
        chatContainer.style.width = "100%";
        document.body.style.overflow = "auto";
        
        // Restaurar grids
        todosVisuales.forEach(v => {
            v.style.display = v.dataset.display;
            v.style.flexDirection = '';
        });
    });
}