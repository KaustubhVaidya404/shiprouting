const API_URL = 'http://localhost:5000/api';

export const calculateRoute = async (routeData) => {
  try {
    const response = await fetch(`${API_URL}/calculate-route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routeData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calculating route:', error);
    throw error;
  }
};

export const getPorts = async () => {
  try {
    const response = await fetch(`${API_URL}/ports`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ports:', error);
    throw error;
  }
};
