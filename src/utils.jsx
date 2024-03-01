/* eslint-disable no-unused-vars */
function mittelpunktKoordinaten(koordinaten) {
    let x = 0.0;
    let y = 0.0;
    let z = 0.0;

    koordinaten.forEach((punkt) => {
        // Umrechnung von Latitude und Longitude in Radianten
        let latitude = punkt.lat * Math.PI / 180;
        let longitude = punkt.lng * Math.PI / 180;

        // Umrechnung in kartesische Koordinaten
        x += Math.cos(latitude) * Math.cos(longitude);
        y += Math.cos(latitude) * Math.sin(longitude);
        z += Math.sin(latitude);
    });

    // Durchschnitt der kartesischen Koordinaten
    let gesamt = koordinaten.length;
    x = x / gesamt;
    y = y / gesamt;
    z = z / gesamt;

    // Rückumrechnung in geographische Koordinaten
    let zentraleLongitude = Math.atan2(y, x);
    let zentraleQuadratwurzel = Math.sqrt(x * x + y * y);
    let zentraleLatitude = Math.atan2(z, zentraleQuadratwurzel);

    return [
        zentraleLongitude * 180 / Math.PI,
        zentraleLatitude * 180 / Math.PI,
    ]


}


async function fetchCoordinates(cityName, accessToken) {
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityName)}.json?access_token=${accessToken}`;

    try {
        const response = await fetch(geocodingUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const coordinates = data.features[0].center;

        console.log(coordinates) // Nimmt die Koordinaten des ersten Suchergebnisses
        return coordinates;
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}

async function fetchAllCoordinates(cities, accessToken) {
    const promises = cities.map(city => fetchCoordinates(city, accessToken));
    return Promise.all(promises);
}


const createCustomMarker = (index, coordinates) => {
    const el = document.createElement('div');

    el.className = 'custom-marker';
    index == 0 ?
        el.style.backgroundImage = "url('../car.png')" :
        el.style.backgroundImage = "url('../racing-flag.png')"
    el.style.width = '50px'; // Setze die Breite deines Icons
    el.style.height = '50px'; // Setze die Höhe deines Icons
    el.style.backgroundSize = '100%'; // Passt das Bild an den Container an
    return el;
};


function secondsFormatter(sekunden) {
    const stunden = Math.floor(sekunden / 3600);
    const minuten = Math.floor((sekunden - (stunden * 3600)) / 60);

    // Führende Null hinzufügen, wenn nötig
    const formatierteStunden = stunden.toString().padStart(2, '0');
    const formatierteMinuten = minuten.toString().padStart(2, '0');

    return `${formatierteStunden}:${formatierteMinuten}`;
}




export { fetchAllCoordinates, fetchCoordinates, mittelpunktKoordinaten, createCustomMarker, secondsFormatter }