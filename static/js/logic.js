// Map object
var map = L.map('map').setView([37.7749, -122.4194], 5); // Set to the view of San Francisco with zoom level 5

// Tile layer (the base map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Define the URL for the earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the earthquake data
d3.json(queryUrl).then(function(data) {
    // Function to determine marker size based on magnitude
    function markerSize(magnitude) {
        return magnitude * 4;
    }

    // Function to determine marker color based on depth
    function markerColor(depth) {
        return depth > 90 ? '#ff3333' :
               depth > 70 ? '#ff6633' :
               depth > 50 ? '#ff9933' :
               depth > 30 ? '#ffcc33' :
               depth > 10 ? '#ffff33' :
                            '#ccff33';
    }

    // Create a GeoJSON layer with the data
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + "</p><p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
        }
    }).addTo(map);

    // Create the legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // Loop through depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
});