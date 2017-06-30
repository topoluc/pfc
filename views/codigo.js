

var capaSatelite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg', {
        maxZoom: 18,
        attribution: 'Mapas de ArcGIS Online'
});

var capaOSM = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© Colaboradores de OpenStreetMap'
});

var map = L.map('contenedorMapa', {
        center: [41.98504, 2.82814]
        ,zoom: 18
        ,layers : [capaSatelite, capaOSM]
});

L.control.layers(
  {'OpenStreetMap': capaOSM,
  'Satélite ArcGIS' : capaSatelite},
  {'Área dibujada' : geometriasDibujadas,
  'Universidades' : universidades,
  'Dónde comer' : comer,
  'Ruta' : ruta}
).addTo(map);