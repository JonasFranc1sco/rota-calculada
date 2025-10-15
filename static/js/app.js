document.addEventListener('DOMContentLoaded', function() {
    let map;
    let directionsRenderer;

    window.initApp = function() {
        
        // 1. Inicializa o mapa
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -8.7619, lng: -63.9039 },
            zoom: 5,
        });

        // 2. Inicializa o renderizador de rotas
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        // 3. Pega elementos
        const inputOrigem = document.getElementById('autocomplete-origem');
        const inputDestino = document.getElementById('autocomplete-destino');
        const hiddenOrigem = document.getElementById('origem_place_id');
        const hiddenDestino = document.getElementById('destino_place_id');
        const form = document.getElementById('form-viagem');

        // 4. Cria os autocompletes usando a API
        const autocompleteOrigem = new google.maps.places.Autocomplete(inputOrigem);
        const autocompleteDestino = new google.maps.places.Autocomplete(inputDestino);

        autocompleteOrigem.addListener('place_changed', () => {
            const place = autocompleteOrigem.getPlace();
            if (place && place.place_id) {
                hiddenOrigem.value = place.place_id;
                console.log("ORIGEM PLACE_ID CAPTURADO:", place.place_id);
            } else {
                console.warn("NÃO CAPTUROU PLACE_ID DA ORIGEM");
            }
        });

        autocompleteDestino.addListener('place_changed', () => {
            const place = autocompleteDestino.getPlace();
            if (place && place.place_id) {
                hiddenDestino.value = place.place_id;
                console.log("DESTINO PLACE_ID CAPTURADO:", place.place_id);
            } else {
                console.warn("NÃO CAPTUROU PLACE_ID DO DESTINO");
            }
        });

        // 5. Envio do formulário
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const data = Object.fromEntries(new FormData(form).entries());
            console.log("DADOS ENVIADOS:", data);

            fetch('/calcular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(resultado => {
                console.log("RESPOSTA SERVIDOR:", resultado);

                if (resultado.status === "OK") {
                    const directionsService = new google.maps.DirectionsService();
                    directionsService.route({
                        origin: { placeId: data.origem_place_id },
                        destination: { placeId: data.destino_place_id },
                        travelMode: 'DRIVING'
                    }, (result, status) => {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(result);
                        } else {
                            console.error("Erro ao desenhar rota:", status);
                        }
                    });

                    document.getElementById('resultado-distancia').textContent = resultado.distancia_texto;
                    document.getElementById('resultado-custo').textContent = resultado.custo_total;
                    document.getElementById('area-resultados').classList.remove('escondido');
                } else {
                    alert("Erro do servidor: " + resultado.mensagem);
                }
            })
            .catch(err => {
                console.error("Erro no fetch:", err);
                alert("Erro ao conectar com o servidor Flask.");
            });
        });
    };
});
