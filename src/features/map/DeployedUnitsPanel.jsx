import React from 'react';
import {
  Ambulance,
  ArrowLeft,
  Battery,
  MapPin,
  Radio,
  Truck,
  Users,
} from 'lucide-react';

const deployedUnits = [
  {
    id: 'ALPHA-01',
    type: 'Rescue Team',
    location: 'Kharagpur Sector',
    status: 'En Route',
    eta: '18 min',
    personnel: 8,
    battery: '91%',
  },
  {
    id: 'MED-04',
    type: 'Medical Ambulance',
    location: 'Tamluk',
    status: 'On Site',
    eta: 'On Site',
    personnel: 4,
    battery: '76%',
  },
  {
    id: 'DRONE-02',
    type: 'Drone Recon Unit',
    location: 'Pingla Block',
    status: 'In Air',
    eta: '12 min',
    personnel: 2,
    battery: '64%',
  },
  {
    id: 'BOAT-07',
    type: 'Inflatable Rescue Boat',
    location: 'Paschim Medinipur',
    status: 'En Route',
    eta: '24 min',
    personnel: 6,
    battery: '83%',
  },
];

export function DeployedUnitsPanel({ onBack }) {
  return (
    <section className="deployed-units-panel panel">
      <div className="deployed-header">
        <div>
          <div className="deployed-title">
            <Truck size={17} />
            DEPLOYED UNITS TRACKER
          </div>

          <div className="deployed-subtitle">
            Live operational unit status — demonstration data
          </div>
        </div>

        <button
          type="button"
          className="back-map-btn"
          onClick={onBack}
        >
          <ArrowLeft size={14} />
          Query Map
        </button>
      </div>

      <div className="deployed-summary">
        <div>
          <strong>04</strong>
          <span>UNITS DEPLOYED</span>
        </div>

        <div>
          <strong>20</strong>
          <span>PERSONNEL</span>
        </div>

        <div>
          <strong>03</strong>
          <span>ACTIVE MISSIONS</span>
        </div>
      </div>

      <div className="deployed-unit-list">
        {deployedUnits.map((unit) => (
          <article
            className="deployed-unit-card"
            key={unit.id}
          >
            <div className="deployed-unit-icon">
              <Truck size={18} />
            </div>

            <div className="deployed-unit-main">
              <div className="deployed-unit-top">
                <strong>{unit.id}</strong>

                <span
                  className={`unit-status ${unit.status
                    .toLowerCase()
                    .replaceAll(' ', '-')}`}
                >
                  ● {unit.status}
                </span>
              </div>

              <span className="deployed-unit-type">
                {unit.type}
              </span>

              <div className="deployed-unit-location">
                <MapPin size={12} />
                {unit.location}
              </div>

              <div className="deployed-unit-meta">
                <span>
                  <Users size={11} />
                  {unit.personnel} personnel
                </span>

                <span>
                  <Battery size={11} />
                  {unit.battery}
                </span>

                <span>
                  <Radio size={11} />
                  ETA {unit.eta}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="deployment-note">
        <span>●</span>
        Demo telemetry active · Last sync 10:24:18 IST
      </div>
    </section>
  );
}