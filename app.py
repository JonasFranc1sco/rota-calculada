from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import googlemaps

load_dotenv()

app = Flask(__name__)

API_KEY = "GOOGLE_API_KEY" # Troque pelo nome da sua API Key definida no .env

gmaps = googlemaps.Client(key=API_KEY)

@app.route('/')
def pagina_inicial():
    
    return render_template("index.html")


@app.route('/calcular', methods=['POST'])
def calcular_rota():
    try:
        data = request.get_json()
        origem_place_id = data['origem_place_id']
        destino_place_id = data['destino_place_id']
        
        preco_gasolina = float(data['preco_gasolina'])
        consumo_veiculo = float(data['consumo_veiculo'])
        
        if not origem_place_id or not destino_place_id:
            return jsonify({"status": "ERRO", "mensagem": "Por favor, selecione uma origem e destino da lista."}), 400
        
        resultado_direcoes = gmaps.directions(f"place_id:{origem_place_id}",
                                              f"place_id:{destino_place_id}",
                                              mode="driving",
                                              language="pt-BR")
        
        if not resultado_direcoes:
            return jsonify({"status": "ERRO", "mensagem": "Não foi possível encontrar uma rota para os locais selecionados."}), 400
        
        rota = resultado_direcoes[0]['legs'][0]
        distancia_em_metros = rota['distance']['value']
        distancia_texto = rota['distance']['text']
        
        distancia_em_km = distancia_em_metros / 1000
        litros_necessarios = distancia_em_km / consumo_veiculo
        custo_total = litros_necessarios * preco_gasolina
        
        resultado = {
            "status":"OK",
            "distancia_texto": distancia_texto,
            "custo_total": f"{custo_total:.2f}",
        }
        return jsonify(resultado)
        
    except Exception as e:
        return jsonify({"status": "ERRO", "mensagem": str(e)}), 500