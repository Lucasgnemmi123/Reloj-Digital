function agregarCero(numero) {
    return numero < 10 ? '0' + numero : numero;
}
 
function obtenerFecha() {
    const ahora = new Date();
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
 
    const diaSemana = diasSemana[ahora.getDay()];
    const dia = agregarCero(ahora.getDate());
    const mes = meses[ahora.getMonth()];
    const año = ahora.getFullYear();
 
    return `${diaSemana}, ${dia} de ${mes} de ${año}`;
}
 
function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('horas').textContent = agregarCero(ahora.getHours());
    document.getElementById('minutos').textContent = agregarCero(ahora.getMinutes());
    document.getElementById('segundos').textContent = agregarCero(ahora.getSeconds());
    document.getElementById('fecha').textContent = obtenerFecha();
}
 
setInterval(actualizarReloj, 1000);
actualizarReloj();
 