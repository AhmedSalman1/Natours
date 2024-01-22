/* eslint-disable */
export const displayMap = (locations) => {
    const map = L.map('map', {
        zoomControl: false,
        center: locations[0].coordinates,
        zoom: 1,
    });

    L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png',
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
    ).addTo(map);

    var greenIcon = L.icon({
        iconUrl: '/img/pin.png',
        popupAnchor: [15, 18],
        className: 'marker',
    });

    const points = [];
    locations.forEach((loc) => {
        // Create points
        points.push([loc.coordinates[1], loc.coordinates[0]]);

        // Add markers
        L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: greenIcon })
            .addTo(map)
            // Add popup
            .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
                autoClose: false,
                closeOnClick: false,
            })
            .openPopup();
    });

    const bounds = L.latLngBounds(points).pad(0.5);
    map.flyToBounds(bounds);

    L.Routing.control({
        waypoints: points,
        show: false,
    }).addTo(map);

    // Disable scroll on map
    map.scrollWheelZoom.disable();
};
