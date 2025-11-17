from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import googlemaps

load_dotenv()

app = Flask(__name__)

API_KEY = "API_MAPS_HERE" # Change for the name of your API Key from .env file

gmaps = googlemaps.Client(key=API_KEY)

@app.route('/')
def initial_page():
    
    return render_template("index.html")


@app.route('/calculate', methods=['POST'])
def calculate_route():
    try:
        data = request.get_json()
        origin_place_id = data['origin_place_id']
        destination_place_id = data['destination_place_id']
        
        fuel_price = float(data['fuel_price'])
        vehicle_consum = float(data['vehicle_consum'])
        
        if not origin_place_id or not destination_place_id:
            return jsonify({"status": "ERRO", "message": "Please, select a origin and destiny from the list."}), 400
        
        direction_result = gmaps.directions(f"place_id:{origin_place_id}",
                                              f"place_id:{destination_place_id}",
                                              mode="driving",
                                              language="en-us")
        
        if not direction_result:
            return jsonify({"status": "ERRO", "message": "No route could be found for the selected locations."}), 400
        
        route = direction_result[0]['legs'][0]
        meter_distance = route['distance']['value']
        distance_text = route['distance']['text']
        km_distance = meter_distance / 1000
        liter_consum = km_distance / vehicle_consum
        total_cost = liter_consum * fuel_price
        
        result = {
            "status":"OK",
            "distance_text": distance_text,
            "total_cost": f"{total_cost:.2f}",
        }
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"status": "ERRO", "mensagem": str(e)}), 500