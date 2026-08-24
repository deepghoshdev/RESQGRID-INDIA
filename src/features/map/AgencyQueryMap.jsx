import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { complaintService } from '../complaints/complaintService.js';
import { supabase } from '../../lib/supabase.js';

import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default marker icons when using Vite.
const queryIcon = L.divIcon({
  className: 'query-map-marker',
  html: `
    <div class="query-marker-pin">
      <span></span>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -32],
});

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export function AgencyQueryMap() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      const data = await complaintService.getForAgency();

      const mapped = (data || []).filter(
        (item) =>
          item.latitude !== null &&
          item.longitude !== null &&
          item.latitude !== undefined &&
          item.longitude !== undefined
      );

      setComplaints(mapped);
    } catch (error) {
      console.error('Failed to load query locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();

    const channel = supabase
      .channel('agency-query-map')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'citizen_complaints',
        },
        (payload) => {
          const complaint = payload.new;

          if (
            complaint.latitude !== null &&
            complaint.longitude !== null
          ) {
            setComplaints((current) => [
              complaint,
              ...current,
            ]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'citizen_complaints',
        },
        (payload) => {
          setComplaints((current) =>
            current.map((item) =>
              item.id === payload.new.id
                ? payload.new
                : item
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="agency-query-map panel">
      <div className="agency-map-header">
        <div>
          <div className="agency-map-title">
            <MessageSquare size={16} />
            CITIZEN QUERY LOCATION MAP
          </div>

          <div className="agency-map-subtitle">
            Live locations of citizen queries raised through the portal
          </div>
        </div>

        <div className="agency-map-live">
          <span>●</span> LIVE
        </div>
      </div>

      <div className="agency-map-content">
        <MapContainer
          center={[22.5726, 88.3639]}
          zoom={7}
          scrollWheelZoom={true}
          className="agency-leaflet-map"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapResizeHandler />

          {complaints.map((complaint) => {
            const lat = Number(complaint.latitude);
            const lng = Number(complaint.longitude);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
              return null;
            }

            return (
              <Marker
                key={complaint.id}
                position={[lat, lng]}
                icon={queryIcon}
              >
                <Popup>
                  <div className="query-popup">
                    <strong>
                      {complaint.subject || 'Citizen Query'}
                    </strong>

                    <span>
                      {complaint.category || 'General'}
                    </span>

                    <p>
                      {complaint.description ||
                        'No description available.'}
                    </p>

                    <div>
                      {complaint.district || 'Unknown district'}
                      {complaint.state
                        ? `, ${complaint.state}`
                        : ''}
                    </div>

                    <small>
                      Status: {complaint.status || 'Pending'}
                    </small>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="agency-map-overlay">
          <div>
            <span className="map-stat-number">
              {complaints.length}
            </span>
            <span className="map-stat-label">
              MAPPED QUERIES
            </span>
          </div>

          <div>
            <span className="map-stat-dot"></span>
            <span className="map-stat-label">
              LIVE SYNC
            </span>
          </div>
        </div>

        {loading && (
          <div className="agency-map-loading">
            Loading query locations...
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="agency-map-empty">
            <MessageSquare size={22} />
            <strong>No mapped queries yet</strong>
            <span>
              Citizen queries with location data will appear here.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}