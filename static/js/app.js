document.addEventListener('DOMContentLoaded', function() {
    let map;
    let directionsRenderer;

    window.initApp = function() {
        
        // 1. Initialize maps
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -8.7619, lng: -63.9039 },
            zoom: 5,
        });

        // 2. Initialize router render
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        // 3. Catch elements
        const originInput = document.getElementById('autocomplete-origin');
        const destinationInput = document.getElementById('autocomplete-destination');
        const originHidden = document.getElementById('origin_place_id');
        const destinationHidden = document.getElementById('destination_place_id');
        const form = document.getElementById('form-route');

        // 4. Create autocomplete using Google API
        const autocompleteOrigin = new google.maps.places.Autocomplete(originInput);
        const autocompleteDestination = new google.maps.places.Autocomplete(destinationInput);

        autocompleteOrigin.addListener('place_changed', () => {
            const place = autocompleteOrigin.getPlace();
            if (place && place.place_id) {
                originHidden.value = place.place_id;
                console.log("ORIGIN PLACE_ID CATCHED:", place.place_id);
            } else {
                console.warn("DON'T CATCH PLACE_ID FROM ORIGIN");
            }
        });

        autocompleteDestination.addListener('place_changed', () => {
            const place = autocompleteDestination.getPlace();
            if (place && place.place_id) {
                destinationHidden.value = place.place_id;
                console.log("DESTINO PLACE_ID CATCHED:", place.place_id);
            } else {
                console.warn("DON'T CATCH PLACE_ID FROM DESTINATION");
            }
        });

        // 5. Send form
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const data = Object.fromEntries(new FormData(form).entries());
            console.log("SENDED DATA:", data);

            fetch('/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                console.log("SERVER RESPONSE:", result);

                if (result.status === "OK") {
                    const directionsService = new google.maps.DirectionsService();
                    directionsService.route({
                        origin: { placeId: data.origin_place_id },
                        destination: { placeId: data.destination_place_id },
                        travelMode: 'DRIVING'
                    }, (result, status) => {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(result);
                        } else {
                            console.error("Error to draw route:", status);
                        }
                    });
                    document.getElementById('distance-result').textContent = result.distance_text;
                    document.getElementById('result-cost').textContent = result.total_cost;
                    document.getElementById('area-results').classList.remove('hidden');
                } else {
                    alert("Server error: " + result.message);
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                alert("Error to conect with Flask Server.");
            });
        });
    };
});
