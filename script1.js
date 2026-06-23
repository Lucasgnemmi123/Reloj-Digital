document.addEventListener('DOMContentLoaded', function () {
    // FECHA FIJA PARA EL INICIO DEL CONTEO DE DÍAS SIN ACCIDENTES
    // Cambia esta fecha por la fecha del último accidente
    let startDate = new Date('2026-05-13T11:00:00'); // Formato: YYYY-MM-DDTHH:mm:ss

    // Asignar la fecha al input
    document.getElementById('fechaAccidente').value = startDate.toISOString().split('T')[0];

    // Función para calcular los días transcurridos y días totales
    function calcularDiasTranscurridos() {
        const now = new Date();
        
        // Calcular días totales
        const diffTime = Math.abs(now - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Actualizar días totales con animación
        animateNumber('dias-totales', diffDays);
        
        // Calcular desglose en años, meses y días
        let anos = now.getFullYear() - startDate.getFullYear();
        let meses = now.getMonth() - startDate.getMonth();
        let dias = now.getDate() - startDate.getDate();

        if (dias < 0) {
            meses--;
            const diasEnMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            dias += diasEnMesAnterior;
        }

        if (meses < 0) {
            anos--;
            meses += 12;
        }

        // Actualizar desglose
        document.getElementById('anos').innerText = anos;
        document.getElementById('meses').innerText = meses;
        document.getElementById('dias-solo').innerText = dias;
        
        // Actualizar barra de hitos
        updateMilestones(anos, meses);
    }

    // Función para animar números
    function animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const currentValue = parseInt(element.innerText) || 0;
        
        if (currentValue === targetValue) return;
        
        const duration = 1000; // 1 segundo
        const steps = 30;
        const increment = (targetValue - currentValue) / steps;
        let current = currentValue;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            current += increment;
            
            if (step >= steps) {
                element.innerText = targetValue;
                clearInterval(timer);
            } else {
                element.innerText = Math.floor(current);
            }
        }, duration / steps);
    }

    // Calcular los días transcurridos al cargar
    calcularDiasTranscurridos();
    
    // Actualizar cada minuto
    setInterval(calcularDiasTranscurridos, 60000);

    // Panel de control: mostrar/ocultar con doble clic
    let clickCount = 0;
    let clickTimer = null;
    
    // Botón toggle para abrir/cerrar panel
    document.getElementById('togglePanelBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        toggleControlPanel();
    });
    
    function toggleControlPanel() {
        const panel = document.getElementById('controlPanel');
        panel.classList.toggle('active');
    }
    
    document.getElementById('closePanel').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('controlPanel').classList.remove('active');
    });

    // Evento para actualizar la fecha del accidente
    document.getElementById('cambiarFecha').addEventListener('click', function(e) {
        e.stopPropagation();
        let nuevaFecha = document.getElementById('fechaAccidente').value;
        
        if (nuevaFecha) {
            startDate = new Date(nuevaFecha + 'T00:00:00');
            console.log('✅ Fecha actualizada:', startDate.toISOString());
            
            // Calcular inmediatamente con la nueva fecha
            calcularDiasTranscurridos();
            
            // Cerrar el panel
            document.getElementById('controlPanel').classList.remove('active');
            
            // Mostrar confirmación visual
            showNotification('Fecha actualizada correctamente');
        } else {
            showNotification('Por favor, selecciona una fecha válida', true);
        }
    });
    
    // Función para mostrar notificaciones
    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isError ? 'rgba(255, 68, 68, 0.95)' : 'rgba(0, 217, 255, 0.95)'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Agregar animaciones CSS para notificaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // SISTEMA DE HITOS
    // ============================================
    function updateMilestones(completedYears, months) {
        const maxMilestones = 6; // Hitos hasta 6 años
        
        // Calcular el próximo hito
        const nextMilestone = completedYears + 1;
        if (nextMilestone <= maxMilestones) {
            document.getElementById('next-milestone-years').textContent = nextMilestone;
        } else {
            document.getElementById('next-milestone-years').textContent = '¡Completado!';
        }
        
        // Calcular años con progreso decimal (incluye meses)
        const exactYears = completedYears + (months / 12);
        
        // Crear marcadores de hitos
        const markersContainer = document.getElementById('milestones-markers');
        markersContainer.innerHTML = '';
        
        // Determinar qué hitos mostrar (1, 2, 3, 4, 5, 6 años)
        let milestones = [];
        for (let i = 1; i <= maxMilestones; i++) {
            milestones.push(i);
        }
        
        // Calcular el progreso en porcentaje
        const maxYears = maxMilestones;
        const progressPercent = Math.min((exactYears / maxYears) * 100, 100);
        
        // Actualizar barra de progreso
        const progressBar = document.getElementById('milestones-progress');
        progressBar.style.width = progressPercent + '%';
        
        // Crear marcadores
        milestones.forEach((year, index) => {
            const marker = document.createElement('div');
            marker.className = 'milestone-marker';
            
            // Determinar si está completado o es el próximo
            if (year <= completedYears) {
                marker.classList.add('completed');
            } else if (year === nextMilestone && year <= maxMilestones) {
                marker.classList.add('next');
            }
            
            const markerInner = document.createElement('div');
            markerInner.className = 'milestone-marker-inner';
            
            // Agregar ícono o número
            if (year <= completedYears) {
                markerInner.innerHTML = '<i class="fas fa-check"></i>';
            } else {
                markerInner.textContent = year;
            }
            
            const label = document.createElement('div');
            label.className = 'milestone-label';
            label.textContent = year + (year === 1 ? ' AÑO' : ' AÑOS');
            
            marker.appendChild(markerInner);
            marker.appendChild(label);
            markersContainer.appendChild(marker);
        });
    }
});
