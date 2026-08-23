import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Radio, ShieldCheck, UserRound, Building2, Activity, CircleHelp } from 'lucide-react';
import { roles } from '../../app/routes.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import logo from '../../assets/logo.svg';

const accessCards = [
  { role: roles.citizen, title: 'CITIZEN', subtitle: 'Emergency & Relief', icon: UserRound },
  { role: roles.agency, title: 'AGENCY', subtitle: 'Response Network', icon: Building2 },
];

export function LoginView() {
  const { login } = useAuth();
  const [role, setRole] = useState(roles.citizen);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!identifier.trim()) return setError('Enter your email or mobile number to continue.');
    if (!password.trim()) return setError('Enter your password to continue.');
    setBusy(true);
    try {
      await login({ role, identifier, password });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-noise" />
      <header className="login-header">
        <div className="login-brand">
          <img src={logo} alt="RESQGRID INDIA" />
          <div><strong>RESQGRID <span>INDIA</span></strong><small>UNIFIED DISASTER RESPONSE NETWORK</small></div>
        </div>
        <div className="login-system-status">
          <span><i /> SYSTEM OPERATIONAL</span>
          <span><ShieldCheck size={12} /> END-TO-END ENCRYPTED</span>
        </div>
      </header>

      <section className="login-content">
        <div className="login-hero">
          <div className="login-kicker"><i /> INDIA'S UNIFIED EMERGENCY RESPONSE NETWORK</div>
          <h1>HELP.<br /><span>CONNECTED.</span><br />WHEN IT MATTERS.</h1>
          <p>RESQGRID connects citizens, disaster response agencies and emergency resources through one intelligent coordination network.</p>
          <div className="network-status-card">
            <div className="network-orb"><Activity size={19} /></div>
            <div><small>LIVE RESPONSE NETWORK</small><b>48 ACTIVE RESPONSE UNITS</b></div>
            <span><i /> ONLINE</span>
          </div>
          <div className="login-feature-row">
            <div><Radio size={15} /><span>LIVE TELEMETRY</span></div>
            <div><ShieldCheck size={15} /><span>VERIFIED AGENCIES</span></div>
            <div><LockKeyhole size={15} /><span>SECURE CHANNEL</span></div>
          </div>
        </div>

        <div className="login-panel-wrap">
          <form className="login-panel" onSubmit={handleSubmit} noValidate>
            <div className="login-panel-heading"><small>SECURE ACCESS PORTAL</small><h2>WELCOME TO <span>RESQGRID</span></h2><p>Choose your access portal to continue.</p></div>
            <div className="access-grid">
              {accessCards.map(({ role: itemRole, title, subtitle, icon: Icon }) => (
                <button type="button" key={itemRole} className={`access-card ${role === itemRole ? 'selected' : ''}`} onClick={() => { setRole(itemRole); setError(''); }}>
                  <span className="access-icon"><Icon size={15} /></span><span><b>{title}</b><small>{subtitle}</small></span>
                </button>
              ))}
            </div>

            <label className="login-label" htmlFor="identifier">EMAIL OR MOBILE NUMBER</label>
            <div className="login-input"><Mail size={15} /><input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Enter your email or mobile number" autoComplete="username" /></div>
            <label className="login-label" htmlFor="password">PASSWORD</label>
            <div className="login-input"><LockKeyhole size={15} /><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}<span>{showPassword ? 'HIDE' : 'SHOW'}</span></button></div>
            <div className="login-options"><label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember this device</label><button type="button" onClick={() => setError('Password recovery is not connected in this frontend demo.')}>Forgot password?</button></div>
            {error && <div className="login-error" role="alert">{error}</div>}
            <button className="secure-login-btn" type="submit" disabled={busy}><span>{busy ? 'AUTHENTICATING...' : 'SECURE LOGIN'}</span>{busy ? <Activity size={18} className="spin" /> : <ArrowRight size={20} />}</button>
            <div className="login-divider"><span>OR CONTINUE AS</span></div>
            <div className="quick-access"><button type="button" onClick={() => { setRole(roles.citizen); setIdentifier('citizen@resqgrid.in'); setPassword('Citizen@123'); }}><UserRound size={14} /> Citizen demo</button><button type="button" onClick={() => { setRole(roles.agency); setIdentifier('agency@resqgrid.in'); setPassword('Agency@123'); }}><Building2 size={14} /> Agency demo</button></div>
            <div className="login-security"><ShieldCheck size={13} /><span>Authentication is handled securely by Supabase. Emergency actions are connected to the RESQGRID backend in the next integration step.</span></div>
          </form>
          <div className="login-help"><CircleHelp size={13} /> Need assistance? Contact your designated RESQGRID support desk.</div>
        </div>
      </section>
    </main>
  );
}
