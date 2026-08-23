<<<<<<< HEAD
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
=======
import React,{useState} from 'react'; import {MapPin,LockKeyhole,Minus,Plus,AlertTriangle,CloudRain,LifeBuoy,ShieldCheck,Phone,Globe2,ChevronRight} from 'lucide-react'; import {Navbar} from '../../components/layout/Navbar.jsx'; import {PageShell} from '../../components/layout/PageShell.jsx'; import {MapView} from '../../features/map/MapView.jsx'; import {SafeShelterList} from './SafeShelterList.jsx'; import {Button} from '../../components/ui/Button.jsx'; import {Modal} from '../../components/ui/Modal.jsx'; import {useGeolocation} from '../../hooks/useGeolocation.js'; import {sosService} from '../../features/sos/sosService.js'; import {isPhone} from '../../utils/validators.js';
export function CitizenView(){const {location,loading,error,detect}=useGeolocation();const [crisis,setCrisis]=useState('Flood Evacuation');const [people,setPeople]=useState(3);const [phone,setPhone]=useState('');const [status,setStatus]=useState('idle');const [details,setDetails]=useState(false);const transmit=async()=>{if(!isPhone(phone)){setStatus('phone');return}setStatus('sending');await sosService.transmit({crisis,people,phone,location});setStatus('sent')};return <PageShell><Navbar mode="citizen" subtitle="CITIZEN EMERGENCY & RELIEF PORTAL"/><div className="alert-banner"><AlertTriangle size={24}/><b>EMERGENCY ASSISTANCE DESK:</b><span>Instant GPS Broadcast to Nearest NDRF/SDRF & Relief Units</span><small>FOR LIFE-THREATENING EMERGENCIES<br/><b>Use 112 / 1070 Immediately</b></small></div><div className="citizen-grid"><section className="card request-card"><div className="card-heading"><LifeBuoy size={22}/><div><h2>Request Immediate Evacuation / Relief</h2><p>Provide accurate details to help us reach you faster.</p></div></div><button className="gps-btn" onClick={detect}><MapPin size={18}/>{loading?'CAPTURING GPS...':'AUTO-DETECT CURRENT GPS LOCATION'}<span>HIGH ACCURACY</span></button><div className="location-row"><LockKeyhole size={13}/><span>Location {location?'Captured':'Locked'}</span><b>Lat: {location?location.lat.toFixed(6):'22.572682'}° N</b><b>Lng: {location?location.lng.toFixed(6):'88.363895'}° E</b><em>Accuracy: ± {location?Math.round(location.accuracy):3.2} m</em></div>{error&&<div className="inline-warning">{error}</div>}<label>Select Crisis Type</label><div className="crisis-grid">{['Flood Evacuation','Medical Emergency','Fire Hazard','Food & Drinking Water'].map((x,i)=><button key={x} className={crisis===x?'selected':''} onClick={()=>setCrisis(x)}>{['≈','✚','♨','◉'][i]}<span>{x}</span></button>)}</div><label>People Trapped / Needing Help</label><div className="stepper"><button onClick={()=>setPeople(Math.max(1,people-1))}>−</button><b>{people}</b><button onClick={()=>setPeople(people+1)}>+</button><span>(Including You)</span></div><label><Phone size={13}/> Alternate Contact Number <small>(For Coordination)</small></label><div className="phone-input"><span>+91</span><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="Enter 10-digit mobile number"/></div>{status==='phone'&&<div className="inline-warning">Enter a valid 10-digit alternate contact number.</div>}<Button variant="danger" className="sos-submit" onClick={transmit}><AlertTriangle size={18}/>{status==='sending'?'TRANSMITTING...':status==='sent'?'SOS TRANSMITTED':'TRANSMIT DISTRESS SOS TO NEAREST AGENCIES'}</Button><div className="secure-note"><ShieldCheck size={14}/> Your location & details are secure and encrypted end-to-end</div><div className="status-tracker"><div className="row between"><b>SOS STATUS TRACKER</b><span className="green">● Last Updated: Just now</span></div><div className="tracker-line"><span className="done">✓</span><span className="done">✓</span><span className={status==='sent'?'done':''}>3</span><span>4</span></div><div className="tracker-labels"><span>SOS Transmitted<br/><b>02:41 PM</b></span><span>Acknowledged<br/><b>2nd Bn NDRF</b></span><span>En Route<br/><b>Dispatch ETA: 18 mins</b></span><span>Arriving Soon</span></div>{status==='sent'&&<div className="ack">Acknowledged by: <b>2nd Bn NDRF (Kolkata Unit)</b><button onClick={()=>setDetails(true)}>View Details <ChevronRight size={13}/></button></div>}</div></section><section className="card map-card"><div className="privacy"><ShieldCheck size={18}/><div><b>PRIVACY SHIELD ACTIVE</b><span>Agency contact numbers are hidden. You see public helpline & distance only.</span><a onClick={()=>setDetails(true)}>Learn More</a></div></div><MapView focus="Kolkata"/><div className="map-legend"><b>MAP LEGEND</b><span>🟢 Safe Flood Shelter</span><span>✚ Medical Aid Tent</span><span>🔵 Relief Agency (Active)</span><span>🟥 High Risk / Submerged Zone</span></div><SafeShelterList/></section></div><div className="info-bar"><div><CloudRain size={30}/><b>LIVE WEATHER WARNING</b><span>Heavy to Very Heavy Rainfall<br/><small>Likely in North & South 24 Parganas</small></span></div><div><span className="wave">≋</span><b>FLOOD LEVEL WARNING</b><span>Hooghly River at Chandannagar<br/><strong>ABOVE DANGER LEVEL (7.35 m)</strong></span></div><div><Globe2 size={30}/><b>STAY SAFE. STAY INFORMED.</b><span>Follow official updates & instructions<br/><small>from local authorities.</small></span></div></div><footer className="citizen-footer"><span>ⓘ About RESQGRID</span><span>?</span><span>How It Works</span><span>Safety Tips</span><span>Do’s & Don’ts</span><span>Emergency Contacts</span><b><ShieldCheck size={17}/> Secured & Powered by NDMA</b></footer><Modal open={details} onClose={()=>setDetails(false)} title="Emergency response protocol"><p className="modal-copy">Your request is routed to the nearest verified response units. In a real deployment, agency phone numbers remain hidden from the public portal; only official public helplines and dispatch status are exposed.</p><div className="protocol"><span>01</span><b>GPS captured</b><small>High-accuracy coordinates attached to SOS packet.</small><span>02</span><b>Nearest agencies notified</b><small>NDRF / SDRF / relief units ranked by distance and capability.</small><span>03</span><b>Dispatch acknowledgement</b><small>Citizen sees ETA and status without private responder data.</small></div></Modal></PageShell>}
>>>>>>> origin/main
