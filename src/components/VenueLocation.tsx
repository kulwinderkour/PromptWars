"use client";

import { MapPin, ExternalLink } from "lucide-react";

/**
 * Google Maps integration for venue location and directions.
 * Uses Google Maps Embed API (free tier) when API key is configured,
 * falls back to a static map placeholder otherwise.
 */

const VENUE_NAME = "MetLife Stadium";
const VENUE_LAT = 40.8128;
const VENUE_LNG = -74.0742;
const VENUE_ADDRESS = "1 MetLife Stadium Dr, East Rutherford, NJ 07073";

export default function VenueLocation() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const hasKey = apiKey && apiKey !== "your_google_maps_api_key_here";

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${VENUE_LAT},${VENUE_LNG}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${VENUE_LAT},${VENUE_LNG}`;

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-black" />
          <h2 className="text-lg font-semibold">Venue Location</h2>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 hover:border-neutral-400 transition-colors"
          aria-label="Get directions to venue in Google Maps"
        >
          <ExternalLink className="h-3 w-3" />
          Directions
        </a>
      </div>

      {/* Map embed */}
      <div className="relative overflow-hidden rounded-lg border border-neutral-200">
        {hasKey ? (
          <iframe
            title="Venue location on Google Maps"
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${VENUE_LAT},${VENUE_LNG}&zoom=15`}
          />
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center bg-neutral-50 text-center">
            <MapPin className="h-8 w-8 text-neutral-300 mb-2" />
            <p className="text-sm font-medium text-neutral-700">{VENUE_NAME}</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">{VENUE_ADDRESS}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs underline text-neutral-500 hover:text-black"
            >
              View on Google Maps
            </a>
          </div>
        )}
      </div>

      {/* Venue details */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-600">
        <div>
          <p className="font-medium text-black">Address</p>
          <p>{VENUE_ADDRESS}</p>
        </div>
        <div>
          <p className="font-medium text-black">Gates</p>
          <p>A (North), B (East), C (South), D (West)</p>
        </div>
      </div>
    </div>
  );
}
