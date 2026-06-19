const csv = require('csv-parser');
const fs = require('fs');

const localidades = [];

fs.createReadStream('localidades.csv')
    .pipe(csv())
    .on('data', (row) => {
        localidades.push(row);
    })
    .on('end', () => {

        let somaLatitude = 0;
        let somaLongitude = 0;

        for(let i = 0; i < localidades.length; i++) {
            const latitude = parseFloat(localidades[i].latitude);
            somaLatitude = somaLatitude + latitude;

            const longitude = parseFloat(localidades[i].longitude);
            somaLongitude = somaLongitude + longitude;
        }

        const mediaLatitude = somaLatitude / localidades.length;
        const mediaLongitude = somaLongitude / localidades.length;

        console.log('Latitude Central:', mediaLatitude);
        console.log('Longitude Central:',mediaLongitude);
        

        const html = `
        <!DOCTYPE html>
        <html>
        <head>

            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>

            <style>
                #map {

                height: 500px;
                width: 100%;
                
                }
            </style>
         </head>

        <body>

            <div id="map"></div>

            <script>

            const localidades = ${JSON.stringify(localidades)};

            const map = L.map('map').setView
                ([${mediaLatitude}, ${mediaLongitude}],
                13
            );

            for(let i = 0; i < localidades.length; i++){
                L.marker([localidades[i].latitude, localidades[i].longitude])
                .addTo(map);
            }

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map); 
    
            </script>

        </body>

        </html>
        `;
        fs.writeFileSync('mapa.html', html);
        console.log('Mapa gerado com sucesso!');

    });
