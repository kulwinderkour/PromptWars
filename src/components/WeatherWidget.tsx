"use client";

import type { WeatherData } from "@/lib/data";
import { Sun, Cloud, CloudRain, Wind, CloudSun, Droplets, Sunset } from "lucide-react";

interface WeatherWidgetProps {
  weather: WeatherData;
}

function getWeatherIcon(condition: WeatherData["condition"]) {
  switch (condition) {
    case "clear":
      return <Sun className="h-8 w-8" />;
    case "cloudy":
      return <Cloud className="h-8 w-8" />;
    case "rainy":
      return <CloudRain className="h-8 w-8" />;
    case "windy":
      return <Wind className="h-8 w-8" />;
    case "partly-cloudy":
      return <CloudSun className="h-8 w-8" />;
    default:
      return <Sun className="h-8 w-8" />;
  }
}

function formatCondition(condition: string) {
  return condition.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Venue Weather</h2>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-black">{getWeatherIcon(weather.condition)}</div>
        <div>
          <p className="text-3xl font-bold text-black">{weather.temp}°C</p>
          <p className="text-xs text-neutral-500">Feels like {weather.feelsLike}°C &middot; {formatCondition(weather.condition)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
          <Droplets className="h-3.5 w-3.5" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
          <Wind className="h-3.5 w-3.5" />
          <span>{weather.wind} km/h</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
          <Sunset className="h-3.5 w-3.5" />
          <span>{weather.sunset}</span>
        </div>
      </div>
    </div>
  );
}
