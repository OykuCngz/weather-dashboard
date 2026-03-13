import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI(title="Weather & Pollution API Proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
BASE_URL = "https://api.openweathermap.org/data/2.5"

def get_lat_lon(city: str):
    geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={OPENWEATHER_API_KEY}"
    response = requests.get(geo_url)
    if response.status_code != 200 or not response.json():
        raise HTTPException(status_code=404, detail=f"City '{city}' not found.")
    data = response.json()[0]
    return data["lat"], data["lon"], data["name"], data.get("state"), data["country"]

@app.get("/api/weather")
async def get_weather_data(city: str = Query(..., description="The name of the city")):
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeatherMap API Key is not configured.")
    
    try:
        lat, lon, official_name, state, country = get_lat_lon(city)
        
        weather_url = f"{BASE_URL}/weather?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_API_KEY}"
        weather_resp = requests.get(weather_url).json()
        
        pollution_url = f"{BASE_URL}/air_pollution?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
        pollution_resp = requests.get(pollution_url).json()
        
        forecast_url = f"{BASE_URL}/forecast?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_API_KEY}"
        forecast_resp = requests.get(forecast_url).json()

        result = {
            "location": {
                "name": official_name,
                "state": state,
                "country": country,
                "lat": lat,
                "lon": lon
            },
            "current": {
                "temp": weather_resp["main"]["temp"],
                "feels_like": weather_resp["main"]["feels_like"],
                "humidity": weather_resp["main"]["humidity"],
                "wind_speed": weather_resp["wind"]["speed"],
                "description": weather_resp["weather"][0]["description"],
                "icon": weather_resp["weather"][0]["icon"],
                "pressure": weather_resp["main"]["pressure"]
            },
            "pollution": pollution_resp["list"][0],
            "forecast": forecast_resp["list"]
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reverse-geo")
async def get_reverse_geo(lat: float, lon: float):
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeatherMap API Key is not configured.")
    
    geo_url = f"http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={OPENWEATHER_API_KEY}"
    response = requests.get(geo_url)
    if response.status_code != 200 or not response.json():
        raise HTTPException(status_code=404, detail="Location not found.")
    
    return response.json()[0]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
