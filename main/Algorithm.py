import numpy as np
import networkx as nx
from geopy.distance import geodesic
import folium

# Function to calculate fuel consumption
def calculate_fuel_consumption(distance):
    return distance * 0.2  # Example: fuel consumption rate

# Function to calculate travel time
def calculate_travel_time(distance):
    speed = 20  # Example: average speed in knots
    return distance / speed

# Function to assess safety
def safety_assessment(point):
    lat, lon = point
    return 1 / (1 + np.sqrt(lat**2 + lon**2))  # Mock safety score

# Function to assess comfort
def comfort_assessment(point):
    lat, lon = point
    return np.cos(np.radians(lat)) * np.sin(np.radians(lon))  # Mock comfort score

# Function to add edges to the graph
def add_edge(G, point1, point2, fuel_weight, time_weight, safety_weight, comfort_weight):
    distance = geodesic(point1, point2).kilometers
    fuel_consumption = calculate_fuel_consumption(distance)
    travel_time = calculate_travel_time(distance)
    safety_score = safety_assessment(point2)
    comfort_score = comfort_assessment(point2)

    weight = (fuel_weight * fuel_consumption +
              time_weight * travel_time -
              safety_weight * safety_score +
              comfort_weight * comfort_score)
    
    G.add_edge(point1, point2, weight=weight)

# Function to create a graph and find the optimal route
def create_graph_and_find_route(start_port, end_port, fuel_weight, time_weight, safety_weight, comfort_weight):
    G = nx.Graph()

    # Define a grid of potential waypoints in the region
    latitude_range = np.linspace(10, 20, 5)
    longitude_range = np.linspace(70, 80, 5)
    waypoints = [(lat, lon) for lat in latitude_range for lon in longitude_range]

    for i in range(len(waypoints)):
        for j in range(i + 1, len(waypoints)):
            add_edge(G, waypoints[i], waypoints[j], fuel_weight, time_weight, safety_weight, comfort_weight)

    for waypoint in waypoints:
        add_edge(G, start_port, waypoint, fuel_weight, time_weight, safety_weight, comfort_weight)
        add_edge(G, waypoint, end_port, fuel_weight, time_weight, safety_weight, comfort_weight)

    shortest_path = nx.shortest_path(G, source=start_port, target=end_port, weight='weight')
    return shortest_path

# Function to visualize multiple routes on the same map
def visualize_routes_on_map(routes, start_port, end_port):
    map_route = folium.Map(location=[(start_port[0] + end_port[0]) / 2, (start_port[1] + end_port[1]) / 2], zoom_start=6)

    # Add start and end markers
    folium.Marker(location=start_port, popup="Start Port", icon=folium.Icon(color="green")).add_to(map_route)
    folium.Marker(location=end_port, popup="End Port", icon=folium.Icon(color="red")).add_to(map_route)

    # Define colors for different routes
    colors = ["blue", "orange", "purple"]
    labels = ["Least Fuel Consumption", "Shortest Travel Time", "Best Safety and Comfort"]

    for route, color, label in zip(routes, colors, labels):
        folium.PolyLine(locations=route, color=color, weight=2.5, opacity=1, tooltip=label).add_to(map_route)

    # Save map to HTML file
    map_route.save("combined_optimal_routes_map.html")
    print("Map saved as 'combined_optimal_routes_map.html'")

# Main function to handle user input and generate maps
def main():
    # Take user input for start and end locations
    start_lat = float(input("Enter start latitude: "))
    start_lon = float(input("Enter start longitude: "))
    end_lat = float(input("Enter end latitude: "))
    end_lon = float(input("Enter end longitude: "))

    start_port = (start_lat, start_lon)
    end_port = (end_lat, end_lon)

    # Create routes optimized for different criteria
    route_fuel = create_graph_and_find_route(start_port, end_port, fuel_weight=1, time_weight=0, safety_weight=0, comfort_weight=0)
    route_time = create_graph_and_find_route(start_port, end_port, fuel_weight=0, time_weight=1, safety_weight=0, comfort_weight=0)
    route_safety_comfort = create_graph_and_find_route(start_port, end_port, fuel_weight=0, time_weight=0, safety_weight=0.5, comfort_weight=0.5)

    # Visualize all routes on the same map
    visualize_routes_on_map([route_fuel, route_time, route_safety_comfort], start_port, end_port)

if __name__ == "__main__":
    main()
