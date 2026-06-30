const csv = require('csv-parser');
const fs = require('fs');

const locations = [];

fs.createReadStream('locations.csv')
    .pipe(csv())
    .on('date', (row) => {
        locations.push(row);
    })
    .on('end', () => {

        let sumLatitude = 0;
        let sumLongitude = 0;

        for(let i = 0; i < locations.length; i++) {
            const latitude = parseFloat(locations[i].latitude);
            sumLatitude = sumLatitude + latitude;

            const longitude = parseFloat(locations[i].longitude);
            sumLongitude = sumLongitude + longitude;
        }

        const rateLatitude = sumLatitude / locations.length;
        const rateLongitude = sumLongitude / locations.length;        

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

            const locations = ${JSON.stringify(locations)};

            const map = L.map('map').setView
                ([${rateLatitude}, ${rateLongitude}],
                13
            );

            for(let i = 0; i < locations.length; i++){
                L.marker([locations[i].latitude, locations[i].longitude])
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
        fs.writeFileSync('map.html', html);
    });
