/* =========================================================================
   1. DICCIONARIO DE TRADUCCIÓN (INTERNACIONALIZACIÓN DE LA INTERFAZ)
   ========================================================================= */
const LANGUAGES = {
    es: {
        "login-subtitle": "Inteligencia de Negocios",
        "login-btn": "Ingresar al Sistema",
        "login-loading": "Autenticando en Azure...",
        "status-online": "Online",
        "nav-bi": "Dashboard BI",
        "nav-ia": "Asistente IA",
        "nav-about": "Acerca de",
        "nav-contact": "Mesa de Ayuda",
        "config-title": "Configuración",
        "config-lang": "Idioma del Sistema",
        "config-theme": "Temas de Entorno",
        "config-perf": "Efectos Visuales",
        "config-logout": "Cerrar Sesión",
        "bi-title": "Inteligencia de Negocios Corporativa",
        "bi-desc": "Visualización de reportes estructurales a través de Power BI / Looker.",
        "ia-btn": "Consultar",
        "ia-loading-text": "AURA está procesando los datos en SQL Server...",
        "ia-pdf": "Exportar Auditoría",
        "about-title": "Arquitectura del Sistema",
        "contact-title": "Mesa de Ayuda",
        "contact-select": "Seleccione el área de destino...",
        "contact-send": "Enviar Ticket",
        "footer-rights": "Todos los derechos reservados."
    },
    qu: {
        "login-subtitle": "Runa Yachay Kachay",
        "login-btn": "Yaykuy Llikaman",
        "login-loading": "Azure llikapi qatichkan...",
        "status-online": "Kachkan",
        "nav-bi": "Tukuypaq Mastari",
        "nav-ia": "IA Yanapakuq",
        "nav-about": "Ñuqanchikmanta",
        "nav-contact": "Yanapakuy Manka",
        "config-title": "Allichaykuna",
        "config-lang": "Llika Rimay",
        "config-theme": "Llimphi Hawakuna",
        "config-perf": "Kuyuqkuna Rikchay",
        "config-logout": "Lluqsiy",
        "bi-title": "Hatun Ruraykunapa Mastarinin",
        "bi-desc": "Power BI / Looker Studio nisqapi qatipay ruraykuna khaway.",
        "ia-btn": "Tapuy",
        "ia-loading-text": "AURA SQL Serverpi rurachkan...",
        "ia-pdf": "Qatipayta PDFman Hurquy",
        "about-title": "Llikapa Shukunin",
        "contact-title": "Yanapakuy Manka",
        "contact-select": "Mayman chayana akllay...",
        "contact-send": "Willakuyta Apachiy",
        "footer-rights": "Tukuy ruraykuna amachasqam."
    },
    en: {
        "login-subtitle": "Business Intelligence",
        "login-btn": "Sign In to System",
        "login-loading": "Authenticating on Azure...",
        "status-online": "Online",
        "nav-bi": "BI Dashboard",
        "nav-ia": "AI Assistant",
        "nav-about": "About Project",
        "nav-contact": "Help Desk",
        "config-title": "Settings",
        "config-lang": "System Language",
        "config-theme": "Environment Themes",
        "config-perf": "Visual Effects",
        "config-logout": "Log Out",
        "bi-title": "Corporate Business Intelligence",
        "bi-desc": "Visualization of structural reports through Power BI / Looker.",
        "ia-btn": "Query",
        "ia-loading-text": "AURA is processing database on SQL Server...",
        "ia-pdf": "Export Audit",
        "about-title": "System Architecture",
        "contact-title": "Help Desk",
        "contact-select": "Select target department...",
        "contact-send": "Send Ticket",
        "footer-rights": "All rights reserved."
    },
    pt: {
        "login-subtitle": "Inteligência de Negócios",
        "login-btn": "Entrar no Sistema",
        "login-loading": "Autenticando no Azure...",
        "status-online": "Online",
        "nav-bi": "Painel BI",
        "nav-ia": "Assistente IA",
        "nav-about": "Sobre o Projeto",
        "nav-contact": "Mesa de Ajuda",
        "config-title": "Configuração",
        "config-lang": "Idioma do Sistema",
        "config-theme": "Temas de Ambiente",
        "config-perf": "Efeitos Visuais",
        "config-logout": "Sair",
        "bi-title": "Inteligência de Negócios Corporativa",
        "bi-desc": "Visualização de relatórios estruturais através do Power BI / Looker.",
        "ia-btn": "Consultar",
        "ia-loading-text": "AURA está processando dados no SQL Server...",
        "ia-pdf": "Exportar Auditoria",
        "about-title": "Arquitetura do Sistema",
        "contact-title": "Mesa de Ajuda",
        "contact-select": "Selecione a área de destino...",
        "contact-send": "Enviar Ticket",
        "footer-rights": "Todos os direitos reservados."
    },
    fr: {
        "login-subtitle": "Informatique Décisionnelle",
        "login-btn": "Se Connecter",
        "login-loading": "Authentification sur Azure...",
        "status-online": "En ligne",
        "nav-bi": "Tableau BI",
        "nav-ia": "Assistant IA",
        "nav-about": "À Propos",
        "nav-contact": "Mesa d'Aide",
        "config-title": "Configuration",
        "config-lang": "Langue du Système",
        "config-theme": "Thèmes d'Environnement",
        "config-perf": "Effets Visuels",
        "config-logout": "Se Déconnecter",
        "bi-title": "Informatique Décisionnelle Corporative",
        "bi-desc": "Visualisation des rapports structurels via Power BI / Looker.",
        "ia-btn": "Consulter",
        "ia-loading-text": "AURA traite les données sur SQL Server...",
        "ia-pdf": "Exporter l'Audit",
        "about-title": "Architecture du Système",
        "contact-title": "Mesa d'Aide",
        "contact-select": "Sélectionnez la zone cible...",
        "contact-send": "Envoyer le Ticket",
        "footer-rights": "Tous droits réservés."
    }
};

/* =========================================================================
   2. VARIABLES E INSTANCIAS GLOBALES
   ========================================================================= */
let chartInstance = null; 

/* =========================================================================
   3. INICIALIZACIÓN COMPLETA DEL SISTEMA (DOM LOADED)
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
    
    const loginScreen = document.getElementById("login-screen");
    const mainSystem = document.getElementById("main-system");
    const loginForm = document.getElementById("login-form");
    const loginSpinner = document.getElementById("login-spinner");
    const btnLogin = document.getElementById("btn-login");

    // --- CARGAR DATOS DE MEMORIA NATIVA (SESIÓN, TEMA E IDIOMA) ---
    
    // Verificar si ya hay una sesión iniciada
    if (localStorage.getItem("segep_session") === "activa") {
        loginScreen.classList.add("hidden");
        mainSystem.classList.remove("hidden");
    }

    // Verificar si hay un tema guardado
    const savedTheme = localStorage.getItem("segep_theme");
    if (savedTheme && savedTheme !== "azure-blue") {
        document.body.classList.add(savedTheme);
    }

    // Verificar si hay un idioma guardado
    const savedLang = localStorage.getItem("segep_lang");
    if (savedLang) {
        document.getElementById("lang-selector").value = savedLang;
        setTimeout(() => document.getElementById("lang-selector").dispatchEvent(new Event('change')), 100);
    }

    // --- MANEJO DEL FORMULARIO DE ACCESO (LOGIN MOCKUP) ---
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        btnLogin.classList.add("hidden");
        loginSpinner.classList.remove("hidden");

        // Simulación de conexión y verificación asíncrona
        setTimeout(() => {
            localStorage.setItem("segep_session", "activa"); // Guardar estado de sesión
            loginScreen.classList.add("hidden");
            mainSystem.classList.remove("hidden");
            window.dispatchEvent(new Event('resize'));
        }, 1500);
    });

    // --- NAVEGACIÓN SPA ENTRE SECCIONES ---
    const navButtons = document.querySelectorAll(".nav-btn");
    const viewSections = document.querySelectorAll(".view-section");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            navButtons.forEach(b => b.classList.remove("active"));
            viewSections.forEach(s => s.classList.remove("active"));

            btn.classList.add("active");
            const targetId = btn.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
        });
    });

    // --- CONTROL DE PANEL LATERAL DE CONFIGURACIÓN ---
    const btnConfig = document.getElementById("btn-config");
    const btnCloseConfig = document.getElementById("btn-close-config");
    const configPanel = document.getElementById("config-panel");

    btnConfig.addEventListener("click", () => configPanel.classList.remove("config-panel-hidden"));
    btnCloseConfig.addEventListener("click", () => configPanel.classList.add("config-panel-hidden"));

    // --- MANEJO DE LOS 10 TEMAS DE ENTORNO ---
    const themeButtons = document.querySelectorAll(".theme-btn");
    themeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            document.body.className = ""; // Limpiar clases
            const selectedTheme = btn.getAttribute("data-theme");
            
            if (selectedTheme !== "azure-blue") {
                document.body.classList.add(selectedTheme);
            }
            
            localStorage.setItem("segep_theme", selectedTheme); // Guardar tema en memoria
            
            if (!document.getElementById("toggle-animations").checked) {
                document.body.classList.add("animations-off");
            }
        });
    });

    // --- INTERRUPTOR DE ANIMACIONES ---
    const toggleAnimations = document.getElementById("toggle-animations");
    toggleAnimations.addEventListener("change", () => {
        if (toggleAnimations.checked) {
            document.body.classList.remove("animations-off");
        } else {
            document.body.classList.add("animations-off");
        }
    });

    // --- RENDERIZADO DEL RESPLANDOR DEL MOUSE ---
    window.addEventListener("mousemove", (e) => {
        if (!document.body.classList.contains("animations-off")) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        }
    });

    // --- TRADUCTOR MULTILINGÜE ---
    const langSelector = document.getElementById("lang-selector");
    langSelector.addEventListener("change", () => {
        const selectedLang = langSelector.value;
        const dictionary = LANGUAGES[selectedLang];

        localStorage.setItem("segep_lang", selectedLang); // Guardar idioma en memoria

        document.querySelectorAll("[data-lang]").forEach(element => {
            const langKey = element.getAttribute("data-lang");
            if (dictionary[langKey]) {
                if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                    element.placeholder = dictionary[langKey];
                } else {
                    const icon = element.querySelector("i");
                    if (icon) {
                        element.innerHTML = "";
                        element.appendChild(icon);
                        element.removeAttribute("data-lang");
                        element.innerHTML += " " + dictionary[langKey];
                        element.setAttribute("data-lang", langKey);
                    } else {
                        element.textContent = dictionary[langKey];
                    }
                }
            }
        });
    });

    // --- ENVÍO DE FORMULARIO DE SOPORTE MOCK ---
    const supportForm = document.getElementById("support-form");
    supportForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("¡Ticket enviado con éxito! Se procesará su solicitud a la brevedad.");
        supportForm.reset();
    });

    // --- ALERTA DE CONFIRMACIÓN AL CERRAR SESIÓN ---
    document.getElementById("btn-logout").addEventListener("click", () => {
        // Alerta de dificultad antes de salir para evitar accidentes
        const seguro = confirm("¡Atención! Está a punto de cerrar su sesión de trabajo seguro. ¿Desea abandonar el entorno analítico actual?");
        if (seguro) {
            localStorage.removeItem("segep_session"); // Eliminar clave de acceso
            window.location.reload(); // Recargar para forzar pantalla de bloqueo
        }
    });
});

/* =========================================================================
   4. MANEJO DE CONSULTAS A LA IA (ENTORNO LOCAL: NETBEANS)
   ========================================================================= */

function escribirConsulta(texto) {
    document.getElementById("ia-query").value = texto;
}

async function procesarIAReal() {
    const queryInput = document.getElementById("ia-query");
    const query = queryInput.value.trim();
    if (!query) return;

    const resultsDiv = document.getElementById("ia-results");
    const loadingDiv = document.getElementById("ia-loading");
    const textDiv = document.getElementById("ia-text");
    const tablaDiv = document.getElementById("ia-tabla-contenedor");
    
    resultsDiv.classList.add("hidden");
    loadingDiv.classList.remove("hidden");
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    try {
        // =============================================================
        // CONFIGURADO PARA TU PRUEBA LOCAL DE HOY EN NETBEANS (PUERTO 8080)
        // =============================================================
       const urlAzure = `https://covid-data-unasam-gwb2g3akcea5a0en.brazilsouth-01.azurewebsites.net/api/ia?q=${encodeURIComponent(query)}`;
        const respuesta = await fetch(urlAzure);
        
        if (!respuesta.ok) throw new Error(`Error en servidor de Azure: HTTP ${respuesta.status}`);

        const paqueteIA = await respuesta.json();
        
        loadingDiv.classList.add("hidden");
        resultsDiv.classList.remove("hidden");

        if (paqueteIA.error) throw new Error(paqueteIA.error);

        // A. Imprimir análisis de Lucía/AURA
        textDiv.innerHTML = `<strong><i class="fas fa-brain" style="color: var(--primary);"></i> AURA:</strong> ${paqueteIA.analisis}`;

        // B. Crear tabla dinámica con formato monetario para Soles
        const datos = paqueteIA.datos;
        if (!datos || datos.length === 0) {
            tablaDiv.innerHTML = "<p style='padding: 20px;'>Consulta sin registros coincidentes.</p>";
            document.getElementById('ia-chart-container').style.display = 'none';
            return;
        }

        const columnas = Object.keys(datos[0]);
        let htmlTabla = "<table class='tabla-ia'><thead><tr>";
        columnas.forEach(col => htmlTabla += `<th>${col.replace(/_/g, ' ').toUpperCase()}</th>`);
        htmlTabla += "</tr></thead><tbody>";
        
        const formatoMoneda = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

        datos.forEach(fila => { 
            htmlTabla += "<tr>"; 
            columnas.forEach(col => {
                let valor = fila[col];
                if (typeof valor === 'number' && 
                    (col.toLowerCase().includes('monto') || col.toLowerCase().includes('total') || 
                     col.toLowerCase().includes('pim') || col.toLowerCase().includes('pia') || 
                     col.toLowerCase().includes('devengado') || col.toLowerCase().includes('girado'))) {
                    valor = formatoMoneda.format(valor);
                }
                htmlTabla += `<td>${valor}</td>`;
            }); 
            htmlTabla += "</tr>"; 
        });
        htmlTabla += "</tbody></table>";
        tablaDiv.innerHTML = htmlTabla;

        // C. Crear Gráfico adaptado cromáticamente al tema activo
        if (columnas.length >= 2) {
            document.getElementById('ia-chart-container').style.display = 'block';
            const ctx = document.getElementById('ia-canvas').getContext('2d');
            
            const etiquetas = datos.map(item => item[columnas[0]]);
            const valores = datos.map(item => item[columnas[columnas.length - 1]]);

            const paletaColores = [
                'rgba(37, 99, 235, 0.75)', 'rgba(139, 92, 246, 0.75)', 
                'rgba(16, 185, 129, 0.75)', 'rgba(245, 158, 11, 0.75)', 
                'rgba(239, 68, 68, 0.75)', 'rgba(6, 182, 212, 0.75)'
            ];

            const colorTextoDinamico = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim();

            chartInstance = new Chart(ctx, {
                type: paqueteIA.grafico,
                data: {
                    labels: etiquetas,
                    datasets: [{
                        label: columnas[columnas.length - 1].replace(/_/g, ' ').toUpperCase(),
                        data: valores,
                        backgroundColor: paqueteIA.grafico === 'bar' || paqueteIA.grafico === 'line' ? 'rgba(37, 99, 235, 0.7)' : paletaColores,
                        borderColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: colorTextoDinamico } } },
                    scales: paqueteIA.grafico === 'bar' || paqueteIA.grafico === 'line' ? {
                        x: { ticks: { color: colorTextoDinamico } },
                        y: { ticks: { color: colorTextoDinamico } }
                    } : {}
                }
            });
        } else {
            document.getElementById('ia-chart-container').style.display = 'none';
        }

    } catch (error) {
        loadingDiv.classList.add("hidden");
        resultsDiv.classList.remove("hidden");
        tablaDiv.innerHTML = "";
        document.getElementById('ia-chart-container').style.display = 'none';
        textDiv.innerHTML = `<span style="color:#EF4444;"><i class="fas fa-exclamation-triangle"></i> <strong>Error local:</strong> ${error.message}. ¿NetBeans está ejecutando el proyecto en el puerto 8080?</span>`;
    }
}

/* =========================================================================
   5. EXPORTACIÓN A PDF
   ========================================================================= */
function exportarPDF() {
    const elemento = document.getElementById("ia-results");
    const opciones = {
        margin:       15,
        filename:     'Reporte_Auditoria_SEGEP.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opciones).from(elemento).save();
}