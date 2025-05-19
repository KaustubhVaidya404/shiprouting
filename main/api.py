try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    import Algorithm as algo
    import numpy as np
except ImportError as e:
    print(f"Import error: {e}")
    print("\nThis could be due to a version compatibility issue.")
    print("Try installing compatible versions with:")
    print("pip install Flask==2.2.3 Werkzeug==2.2.3 Flask-Cors==3.0.10")
    exit(1)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/calculate-route', methods=['POST'])
def calculate_route():
    try:
        data = request.json
        
        # Extract parameters
        start_port = (data.get('startLat'), data.get('startLng'))
        end_port = (data.get('endLat'), data.get('endLng'))
        
        # Route preferences
        preferences = data.get('preferences', {})
        fuel_weight = 1.0 if preferences.get('economic', False) else 0.0
        time_weight = 1.0 if preferences.get('fastest', False) else 0.0
        safety_weight = 1.0 if preferences.get('safest', False) else 0.0
        shortest_weight = 1.0 if preferences.get('shortest', False) else 0.0
        
        # If no preference selected, use balanced weights
        if fuel_weight == 0 and time_weight == 0 and safety_weight == 0 and shortest_weight == 0:
            fuel_weight = 0.25
            time_weight = 0.25
            safety_weight = 0.25
            shortest_weight = 0.25
        
        # Call algorithm methods
        route = algo.create_graph_and_find_route(
            start_port, end_port, 
            fuel_weight, time_weight, safety_weight, shortest_weight
        )
        
        # Calculate metrics
        total_distance = 0
        fuel_consumption = 0
        travel_time = 0
        
        for i in range(len(route) - 1):
            point1 = route[i]
            point2 = route[i + 1]
            distance = algo.geodesic(point1, point2).kilometers
            total_distance += distance
            fuel_consumption += algo.calculate_fuel_consumption(distance)
            travel_time += algo.calculate_travel_time(distance)
        
        # Calculate estimated arrival date
        departure_date = data.get('departureDate')
        # Simple calculation: days = time in hours / 24
        days_to_travel = int(travel_time / 24)
        
        # Calculate estimated cost (simple model)
        estimated_cost = fuel_consumption * 100  # $100 per unit of fuel
        
        result = {
            'route': route,
            'metrics': {
                'totalDistance': round(total_distance, 2),
                'fuelConsumption': round(fuel_consumption, 2),
                'travelTime': round(travel_time, 2),
                'estimatedCost': round(estimated_cost, 2),
                'estimatedArrival': f"{days_to_travel} days after departure",
                'co2Emissions': round(fuel_consumption * 3.2, 2),  # Simple calculation
                'portFees': round(200 * len(route), 2)  # Simple estimation
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ports', methods=['GET'])
def get_ports():
    # Return a list of major ports for autocomplete
    major_ports = [
        {"name": "Mumbai Port", "country": "India", "coordinates": [18.9257, 72.8361]},
        {"name": "Chennai Port", "country": "India", "coordinates": [13.1067, 80.2917]},
        {"name": "Port of Singapore", "country": "Singapore", "coordinates": [1.2655, 103.8263]},
        {"name": "Port of Colombo", "country": "Sri Lanka", "coordinates": [6.9319, 79.8478]},
        {"name": "Port of Dubai", "country": "UAE", "coordinates": [25.2697, 55.2789]},
        {"name": "Port of Durban", "country": "South Africa", "coordinates": [-29.8687, 31.0218]},
        {"name": "Port Louis", "country": "Mauritius", "coordinates": [-20.1586, 57.5042]},
        {"name": "Port of Mombasa", "country": "Kenya", "coordinates": [-4.0435, 39.6682]},
        {"name": "Port of Jakarta", "country": "Indonesia", "coordinates": [-6.0846, 106.8346]},
        {"name": "Port of Melbourne", "country": "Australia", "coordinates": [-37.8374, 144.9441]},
    ]
    return jsonify(major_ports)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
