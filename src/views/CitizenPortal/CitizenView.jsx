import React, { useMemo, useState } from 'react';
import {
  Bell, CalendarDays, Check, ChevronDown, Clock3, CloudRain, Crosshair,
  FileImage, Flame, HeartPulse, House, Info, LockKeyhole, MapPin,
  Menu, Mountain, Navigation, Phone, Plus, Send, Shield, ShieldCheck,
  Siren, Tornado, Upload, Waves, X, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { sosService } from '../../features/sos/sosService.js';
import { isPhone } from '../../utils/validators.js';
import logo from '../../assets/resqgrid-logo.png';

const disasterTypes = [
  { label: 'Flood', icon: Waves, tone: 'blue' },
  { label: 'Fire', icon: Flame, tone: 'red' },
  { label: 'Earthquake', icon: House, tone: 'purple' },
  { label: 'Landslide', icon: Mountain, tone: 'brown' },
  { label: 'Cyclone / Storm', icon: Tornado, tone: 'green' },
  { label: 'Other', icon: MoreIcon, tone: 'gray' },
];

function MoreIcon(props) { return <span className="more-icon" {...props}>•••</span>; }

export function CitizenView() {
  const { user } = useAuth();
  const { location, loading: gpsLoading, error: gpsError, detect } = useGeolocation();
  const [disaster, setDisaster] = useState('Cyclone / Storm');
  const [ongoing, setOngoing] = useState(true);
  const [severity, setSeverity] = useState('Severe');
  const [description, setDescription] = useState('Heavy waterlogging on the main road. Water level is around 2–3 feet. Vehicles are stuck and traffic is not moving.');
  const [people, setPeople] = useState(25);
  const [families, setFamilies] = useState(8);
  const [date, setDate] = useState('23 Aug 2026');
  const [time, setTime] = useState('03:25 PM');
  const [phone, setPhone] = useState('');
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [navOpen, setNavOpen] = useState(false);

  const address = useMemo(() => {
    if (location) return `${location.lat.toFixed(6)}° N, ${location.lng.toFixed(6)}° E`;
    return '12, MG Road, Near City Hospital, Pune, Maharashtra 411001, India';
  }, [location]);

  const submitReport = async () => {
    if (phone && !isPhone(phone)) {
      setStatus('phone');
      return;
    }
    setStatus('sending');
    try {
      await sosService.transmit({ crisis: disaster, people, phone, location, severity, description });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const onFiles = (event) => setFiles(Array.from(event.target.files || []).slice(0, 4));

  return (
    <div className="citizen-reference-page">
      <header className="citizen-reference-nav">
        <div className="citizen-brand">
          <img src={logo} alt="RESQGRID INDIA" />
          <div><strong>RESQGRID <span>INDIA</span></strong><small>UNIFIED DISASTER RESPONSE NETWORK</small></div>
        </div>
        <nav className={navOpen ? 'open' : ''}>
          <button>Dashboard</button>
          <button className="active">Report Incident</button>
          <button>My Reports</button>
          <button>Alerts</button>
          <button>Resources</button>
          <button>Contact</button>
        </nav>
        <div className="citizen-userbar">
          <button className="notification" aria-label="Notifications"><Bell size={19}/><i>3</i></button>
          <div className="avatar">{(user?.name || 'PS').split(' ').map(x => x[0]).join('').slice(0,2)}</div>
          <div className="user-copy"><b>{user?.name || 'Priya Sharma'}</b><span>Citizen</span></div>
          <ChevronDown size={17}/>
          <button className="mobile-menu" onClick={() => setNavOpen(v => !v)} aria-label="Menu"><Menu size={20}/></button>
        </div>
      </header>

      <main className="citizen-reference-main">
        <section className="report-column">
          <div className="report-title-row">
            <div className="report-title">
              <div className="report-icon"><Shield size={26}/></div>
              <div><h1>REPORT A DISASTER</h1><p>Your report can help save lives. Please share accurate information.</p></div>
            </div>
            <div className="report-notice"><Info size={21}/><div><b>Provide as much detail as you can.</b><span>Our team will respond as quickly as possible.</span></div></div>
          </div>

          <div className="reference-form">
            <section className="form-section">
              <div className="section-marker">1</div>
              <div className="section-content">
                <h2>What is happening?</h2><p className="section-help">Select the type of disaster you are witnessing.</p>
                <div className="disaster-grid">
                  {disasterTypes.map(({label, icon: Icon, tone}) => (
                    <button key={label} className={`disaster-option ${disaster === label ? 'selected' : ''}`} onClick={() => setDisaster(label)}>
                      <span className={`disaster-icon ${tone}`}><Icon size={23}/></span><b>{label}</b>{disaster === label && <span className="selected-check"><Check size={12}/></span>}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="form-section location-section">
              <div className="section-marker">2</div>
              <div className="section-content">
                <h2>Where is it happening?</h2><p className="section-help">Drag the map or tap to pin the exact location.</p>
                <div className="reference-map">
                  <div className="map-faux-grid" />
                  <div className="map-road road-a"/><div className="map-road road-b"/><div className="map-road road-c"/>
                  <div className="map-river"/>
                  <div className="map-pin main-pin"><MapPin size={30}/></div><div className="map-blue-dot"/>
                  <div className="map-zoom"><button><Plus size={18}/></button><button><span>−</span></button><button><Crosshair size={18}/></button></div>
                  <button className="map-current" onClick={detect}><Navigation size={16}/>{gpsLoading ? 'Locating…' : 'Use my current location'}</button>
                  <div className="map-address"><MapPin size={19}/><div><b>{address}</b><span>Location accuracy: <em>{location ? `± ${Math.round(location.accuracy)} m` : 'High'}</em></span></div></div>
                </div>
                {gpsError && <div className="reference-warning">{gpsError}</div>}
                <div className="location-fields">
                  <label>District <em>*</em><div className="reference-select">Pune <Check size={16}/></div></label>
                  <label>State <em>*</em><div className="reference-select">Maharashtra <Check size={16}/></div></label>
                </div>
              </div>
            </section>

            <section className="form-section more-section">
              <div className="section-marker">3</div>
              <div className="section-content">
                <h2>Tell us more</h2>
                <div className="top-fields">
                  <label>When did it happen? <em>*</em><div className="field-control"><input value={date} onChange={e => setDate(e.target.value)}/><CalendarDays size={16}/></div></label>
                  <label>Time <em>*</em><div className="field-control"><input value={time} onChange={e => setTime(e.target.value)}/><Clock3 size={16}/></div></label>
                  <label className="ongoing-field">Is it ongoing?<div className="toggle-line"><button className={`switch ${ongoing ? 'on' : ''}`} onClick={() => setOngoing(v => !v)}><span/></button><span>Yes</span></div></label>
                </div>
                <div className="severity-description">
                  <div>
                    <label>How severe is it? <em>*</em><small>Help us understand the impact.</small></label>
                    <div className="severity-grid">{['Low','Moderate','Severe','Extreme'].map(x => <button key={x} className={`${x.toLowerCase()} ${severity === x ? 'selected' : ''}`} onClick={() => setSeverity(x)}>{x}</button>)}</div>
                  </div>
                  <label>Description <em>*</em><small>Please describe what you are seeing (water level, fire spread, damage, etc.)</small><textarea maxLength={500} value={description} onChange={e => setDescription(e.target.value)}/><span className="char-count">{description.length}/500</span></label>
                </div>
                <div className="affected-row">
                  <div className="uploads">
                    <label>Add Photos / Videos <small>(Optional)</small><span>Upload clear photos or short videos that help explain the situation.</span></label>
                    <div className="upload-list">
                      {files.slice(0,3).map((file, i) => <div className="upload-thumb" key={`${file.name}-${i}`}><FileImage size={19}/><small>{file.name.slice(0,12)}</small></div>)}
                      <label className="upload-more"><Upload size={19}/><b>{files.length ? `${files.length} selected` : 'Upload More'}</b><input type="file" accept="image/*,video/*" multiple onChange={onFiles}/></label>
                    </div>
                  </div>
                  <div className="counter-block"><label>People affected (Approx.)<small>Helps authorities plan better.</small></label><div className="counter"><button onClick={() => setPeople(Math.max(0, people-1))}>−</button><b>{people}</b><button onClick={() => setPeople(people+1)}>+</button></div></div>
                  <div className="counter-block"><label>Families affected (Approx.)<small>Helps authorities plan better.</small></label><div className="counter"><button onClick={() => setFamilies(Math.max(0, families-1))}>−</button><b>{families}</b><button onClick={() => setFamilies(families+1)}>+</button></div></div>
                </div>
                <div className="reference-actions">
                  <button className="cancel-btn" onClick={() => {setDescription('');setFiles([])}}>Cancel</button>
                  <button className="submit-btn" onClick={submitReport}><Send size={17}/>{status === 'sending' ? 'Submitting…' : status === 'sent' ? 'Report Submitted' : 'Submit Report'}</button>
                </div>
                {status === 'phone' && <div className="reference-warning">Please enter a valid alternate contact number.</div>}
                {status === 'error' && <div className="reference-warning">The report could not be transmitted. Please try again.</div>}
                <div className="form-security"><LockKeyhole size={13}/> Your information is safe and will only be used to help in this emergency.</div>
              </div>
            </section>
          </div>
        </section>

        <aside className="reference-sidebar">
          <section className="side-card pinned-card">
            <h3>PINNED LOCATION</h3><p>Move the pin to the exact location</p>
            <div className="mini-map"><div className="mini-grid"/><div className="mini-pin"><MapPin size={31}/></div><div className="mini-blue"/></div>
            <b className="side-address">12, MG Road, Near City Hospital,<br/>Pune, Maharashtra 411001, India</b>
            <button className="side-location" onClick={detect}><Crosshair size={17}/> Use my current location</button>
          </section>

          <section className="side-card why-card"><h3>WHY YOUR REPORT MATTERS?</h3>
            {['Your report is sent to relevant authorities.','Emergency teams can respond faster.','You help save lives and protect communities.'].map((x,i)=><div className="why-item" key={i}><ShieldCheck size={21}/><span>{x}</span>{i===2 && <div className="people-watermark">♥</div>}</div>)}
          </section>

          <section className="side-card safety-card"><h3><Shield size={17}/> SAFETY TIPS</h3>
            <ul><li><House size={16}/>Stay in a safe place.</li><li><Zap size={16}/>Avoid electrical poles, wires and flooded areas.</li><li><Waves size={16}/>Do not try to cross fast flowing water.</li><li><Siren size={16}/>Keep yourself and others informed.</li></ul>
          </section>

          <section className="side-card help-card"><h3>NEED IMMEDIATE HELP?</h3><p>Call emergency services</p><a href="tel:112"><Phone size={24}/>112</a><span>Available 24x7</span></section>
        </aside>
      </main>
    </div>
  );
}
