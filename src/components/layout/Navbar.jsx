import React from 'react';
import { Menu, Bell, ShieldCheck, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export function Navbar({ mode = 'citizen', title, subtitle }) {
  const { user, logout } = useAuth();
  return (
    <header className="navbar">
      <div className="brand">
        <button className="icon-btn" aria-label="Open navigation"><Menu size={20} /></button>
        <div className="brand-mark"><ShieldCheck size={22} /><span>RG</span></div>
        <div><div className="brand-title">RESQGRID INDIA</div><div className="brand-sub">{subtitle || 'UNIFIED DISASTER RESPONSE NETWORK'}</div></div>
        {title && <><div className="nav-divider" /><div className="unit-title">{title}</div></>}
      </div>
      <div className="nav-right">
        {mode === 'citizen' ? <>
          <div className="dial"><span>EMERGENCY DIAL</span><b className="red">112</b><b className="blue">1070</b></div>
          <div className="lang"><Globe size={14} /> EN <span>HI</span><span>BN</span></div>
        </> : <><div className="live-dot">● LIVE</div><button className="icon-btn" aria-label="Notifications"><Bell size={18} /></button></>}
        <div className="session-chip"><span>{user?.name || (mode === 'citizen' ? 'Citizen' : 'Agency')}</span><button type="button" onClick={logout} title="Sign out" aria-label="Sign out"><LogOut size={13} /></button></div>
      </div>
    </header>
  );
}

export function CommandHeader({ children }) { return <div className="command-header">{children}</div>; }
