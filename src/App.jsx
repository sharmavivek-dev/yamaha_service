import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────
   COLOR PALETTE  — exact match to Android app
───────────────────────────────────────── */
const C = {
  black:   '#1A1A1A',
  dark:    '#2C2C2C',
  darker:  '#111111',
  red:     '#E53935',
  redDark: '#C62828',
  white:   '#FFFFFF',
  grey:    '#888888',
  greyLight:'#CCCCCC',
  purple:  '#6A1B9A',
  blue:    '#1565C0',
  green:   '#2E7D32',
  yellow:  '#F9A825',
  slate:   '#37474F',
  amber:   '#C97000',
};

/* tile colors — exact from app dashboard */
const TILE_COLORS = {
  booking:  '#555555',
  tracking: '#6A1B9A',
  history:  '#222222',
  problems: '#C62828',
  feedback: '#37474F',
  account:  '#C97000',
  helpline: '#2E7D32',
};

/* ─────────────────────────────────────────
   GLOBAL CSS INJECTED ONCE
───────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(18px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity:0; } to { opacity:1; }
    }
    @keyframes slideDown {
      from { opacity:0; transform:translateY(-12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(229,57,53,0.4); }
      50%      { box-shadow: 0 0 0 14px rgba(229,57,53,0); }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    @keyframes popIn {
      0%   { opacity:0; transform:scale(0.85); }
      70%  { transform:scale(1.04); }
      100% { opacity:1; transform:scale(1); }
    }
    .tile-card:hover { transform:translateX(7px) !important; }
    .tile-card       { transition: transform .18s ease, box-shadow .18s ease !important; }
    .nav-btn:hover   { color: #E53935 !important; }
    .submit-btn:hover { opacity:0.88 !important; }
    .submit-btn:active { transform:scale(0.98) !important; }
    .input-field:focus { border-color: #E53935 !important; outline:none; }
    .radio-opt:hover { background: rgba(229,57,53,0.08) !important; }
    .popup-overlay   { animation: fadeIn .2s ease; }
    .popup-card      { animation: popIn .28s cubic-bezier(.34,1.56,.64,1); }
    .page-enter      { animation: fadeUp .3s ease both; }
    .acct-section:hover { border-left-color: #E53935 !important; }
    .hist-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.5) !important; }
    .hist-card       { transition: transform .18s, box-shadow .18s; }
    .tag-badge       { user-select:none; }
    input[type="radio"] { accent-color: #E53935; }
    input[type="checkbox"] { accent-color: #E53935; }
  `}</style>
);

/* ─────────────────────────────────────────
   REUSABLE COMPONENTS
───────────────────────────────────────── */

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{
      background: C.dark,
      borderLeft: `5px solid ${C.red}`,
      padding: '20px 28px',
      marginBottom: 0,
    }}>
      <h2 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 28, fontWeight: 900,
        letterSpacing: 3, textTransform: 'uppercase',
        color: C.white, lineHeight: 1,
      }}>{title}</h2>
      {subtitle && (
        <p style={{ color: C.grey, fontSize: 13, marginTop: 4, letterSpacing: 1 }}>{subtitle}</p>
      )}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.dark, borderRadius: 12,
      padding: '22px 24px', marginBottom: 16,
      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      ...style,
    }}>{children}</div>
  );
}

function CardLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
      textTransform: 'uppercase', color: C.grey,
      marginBottom: 14, fontFamily: "'Barlow Condensed', sans-serif",
    }}>{children}</div>
  );
}

function Divider() {
  return <div style={{ borderBottom: `1px solid #2a2a2a`, margin: '2px 0' }} />;
}

function InfoRow({ label, value, valueColor }) {
  return (
    <>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '9px 0',
      }}>
        <span style={{ color: C.grey, fontSize: 13 }}>{label}</span>
        <span style={{
          color: valueColor || C.white,
          fontWeight: 600, fontSize: 14,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 0.5,
        }}>{value}</span>
      </div>
      <Divider />
    </>
  );
}

function FormInput({ label, type = 'text', placeholder, value, onChange, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 10, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase',
          color: C.grey, marginBottom: 6,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>{label}{required && <span style={{ color: C.red }}> *</span>}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
        style={{
          width: '100%', background: C.darker,
          border: `1.5px solid #333`, borderRadius: 7,
          padding: '12px 15px', color: C.white,
          fontSize: 14, fontFamily: "'Barlow', sans-serif",
          transition: 'border-color .2s',
        }}
      />
    </div>
  );
}

function FormTextarea({ label, placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 10, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase',
          color: C.grey, marginBottom: 6,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>{label}</label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
        rows={4}
        style={{
          width: '100%', background: C.darker,
          border: `1.5px solid #333`, borderRadius: 7,
          padding: '12px 15px', color: C.white,
          fontSize: 14, fontFamily: "'Barlow', sans-serif",
          resize: 'vertical', transition: 'border-color .2s',
        }}
      />
    </div>
  );
}

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 10, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase',
          color: C.grey, marginBottom: 8,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>{label}</label>
      )}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <label key={opt} className="radio-opt" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: value === opt ? 'rgba(229,57,53,0.12)' : '#1a1a1a',
            border: `1.5px solid ${value === opt ? C.red : '#333'}`,
            borderRadius: 7, padding: '10px 18px',
            cursor: 'pointer', transition: 'all .15s',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 15, fontWeight: 600, letterSpacing: 1,
            color: value === opt ? C.white : C.grey,
          }}>
            <input type="radio" name={name} value={opt}
              checked={value === opt} onChange={() => onChange(opt)}
              style={{ width: 15, height: 15 }} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function SubmitButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      className="submit-btn"
      style={{
        width: '100%', background: C.red, border: 'none',
        borderRadius: 9, padding: '16px', color: C.white,
        fontSize: 16, fontWeight: 800, letterSpacing: 3,
        textTransform: 'uppercase',
        fontFamily: "'Barlow Condensed', sans-serif",
        cursor: 'pointer', transition: 'opacity .15s, transform .1s',
        boxShadow: `0 4px 20px rgba(229,57,53,0.35)`,
        ...style,
      }}
    >{children}</button>
  );
}

function SuccessScreen({ icon, title, message, onReset, resetLabel }) {
  return (
    <div className="page-enter" style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>{icon}</div>
      <h2 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 34, fontWeight: 900, color: C.white,
        letterSpacing: 2, marginBottom: 10,
      }}>{title}</h2>
      <p style={{ color: C.grey, fontSize: 15, marginBottom: 36 }}>{message}</p>
      <button onClick={onReset} className="submit-btn" style={{
        background: C.red, border: 'none', borderRadius: 9,
        padding: '13px 36px', color: C.white, fontSize: 15,
        fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase',
        fontFamily: "'Barlow Condensed', sans-serif", cursor: 'pointer',
      }}>{resetLabel}</button>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: LOGIN
───────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username === 'Vivek' && password === '1234') {
        onLogin();
      } else {
        setError('Incorrect username or password. Please try again.');
        setLoading(false);
      }
    }, 700);
  };

  const handleKey = e => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)', padding: 20,
      background: `radial-gradient(ellipse at 60% 30%, #2c0808 0%, #1a1a1a 60%, #0d0d0d 100%)`,
    }}>
      <div className="page-enter" style={{
        background: C.dark, borderRadius: 18,
        padding: '48px 40px', width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        border: '1px solid #333',
      }}>
        {/* Logo */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: C.red, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 34, fontWeight: 900, color: C.white,
          margin: '0 auto 24px',
          animation: 'pulse 2s infinite',
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>Y</div>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 40, fontWeight: 900, letterSpacing: 5,
          textTransform: 'uppercase', textAlign: 'center',
          color: C.white, marginBottom: 8,
        }}>Login</h1>
        <p style={{ textAlign: 'center', color: C.grey, fontSize: 13, marginBottom: 32 }}>
          Yamaha Service Management Portal
        </p>

        <FormInput label="Username" placeholder="Enter username"
          value={username} onChange={e => { setUsername(e.target.value); setError(''); }}
          onKeyDown={handleKey} />
        <FormInput label="Password" type="password" placeholder="Enter password"
          value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
          onKeyDown={handleKey} />

        {error && (
          <div style={{
            background: 'rgba(229,57,53,0.12)', border: `1px solid ${C.red}44`,
            borderRadius: 7, padding: '10px 14px', marginBottom: 14,
            color: C.red, fontSize: 13, letterSpacing: 0.5,
          }}>{error}</div>
        )}

        <SubmitButton onClick={handleLogin} style={{ marginTop: 4 }}>
          {loading ? 'Logging in...' : 'Login'}
        </SubmitButton>

        <div style={{
          marginTop: 28, padding: '14px 16px',
          background: '#1a1a1a', borderRadius: 8,
          border: '1px solid #2a2a2a',
        }}>
          <p style={{ textAlign: 'center', color: '#555', fontSize: 12, marginBottom: 4 }}>
            Demo Credentials
          </p>
          <p style={{
            textAlign: 'center', color: C.grey, fontSize: 13,
            fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1,
          }}>
            <span style={{ color: C.greyLight }}>Username:</span> Vivek
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span style={{ color: C.greyLight }}>Password:</span> 1234
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#444', fontSize: 12 }}>
          Helpline 24/7
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: DASHBOARD
───────────────────────────────────────── */
const MODULES = [
  { id: 'booking',  label: 'Service Booking',    sub: 'Pre-book your next service appointment', icon: '📋' },
  { id: 'tracking', label: 'Service Tracking',   sub: 'Real-time status of your vehicle service', icon: '📡' },
  { id: 'history',  label: 'Service History',    sub: 'Complete record of all past services',    icon: '📜' },
  { id: 'problems', label: 'Servicing Problems', sub: 'Report issues you faced during service',  icon: '⚠️' },
  { id: 'feedback', label: 'Service Feedback',   sub: 'Rate and review your service experience', icon: '⭐' },
  { id: 'account',  label: 'Account Details',    sub: 'View your profile and membership info',   icon: '👤' },
  { id: 'helpline', label: 'Helpline',           sub: 'Get support — available 24/7',           icon: '📞' },
];

function Dashboard({ onNav }) {
  return (
    <div className="page-enter">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 55%, #2c0808 100%)',
        padding: '64px 24px 48px', textAlign: 'center',
        borderBottom: `1px solid #2a2a2a`, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: C.red }} />
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:`${C.red}10`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:140, height:140, borderRadius:'50%', background:`${C.red}08`, pointerEvents:'none' }} />

        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          background: C.red, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 42, fontWeight: 900,
          color: C.white, margin: '0 auto 20px',
          boxShadow: `0 0 48px ${C.red}55`,
          fontFamily: "'Barlow Condensed', sans-serif",
          animation: 'pulse 3s infinite',
        }}>Y</div>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 64, fontWeight: 900, letterSpacing: 8,
          textTransform: 'uppercase', color: C.white, lineHeight: 1, marginBottom: 6,
        }}>YAMAHA</h1>
        <p style={{ color: C.grey, letterSpacing: 4, textTransform: 'uppercase', fontSize: 13, marginBottom: 32 }}>
          Service Management Portal
        </p>

        {/* owner info pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[
            ['Vivek Sharma',     'Owner'],
            ['YZF R1 2024',  'Vehicle'],
            ['GJ04EE2919',   'Registration'],
            ['PLATINUM',     'Membership'],
          ].map(([val, lbl]) => (
            <div key={lbl} style={{
              background: '#1a1a1a', border: '1px solid #333',
              borderRadius: 8, padding: '10px 18px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16, fontWeight: 700, color: C.white, letterSpacing: 1,
              }}>{val}</div>
              <div style={{ fontSize: 10, color: C.grey, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tiles */}
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '32px 20px' }}>
        <p style={{
          color: C.grey, fontSize: 11, letterSpacing: 2.5,
          textTransform: 'uppercase', marginBottom: 20,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>Select a Service Module</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MODULES.map((mod, i) => (
            <div
              key={mod.id}
              className="tile-card"
              onClick={() => onNav(mod.id)}
              style={{
                background: TILE_COLORS[mod.id],
                borderRadius: 10, padding: '20px 24px',
                borderLeft: `5px solid ${C.red}`,
                display: 'flex', alignItems: 'center', gap: 18,
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
                animationDelay: `${i * 0.05}s`,
                animation: 'fadeUp .35s ease both',
              }}
            >
              <span style={{ fontSize: 26, width: 40, textAlign: 'center', flexShrink: 0 }}>{mod.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 21, fontWeight: 800, letterSpacing: 2,
                  textTransform: 'uppercase', color: C.white, lineHeight: 1.2,
                }}>{mod.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 3, letterSpacing: 0.5 }}>{mod.sub}</div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 22, fontWeight: 300 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: SERVICE BOOKING
───────────────────────────────────────── */
function ServiceBooking() {
  const init = { name:'', phone:'', email:'', date:'', time:'', centerCode:'', userId:'', serviceType:'', pickup:'' };
  const [form, setForm]       = useState(init);
  const [submitted, setSubmitted] = useState(false);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  if (submitted) return (
    <SuccessScreen icon="✅" title="Booking Confirmed!"
      message="Your service appointment has been pre-booked. You will receive a confirmation shortly."
      onReset={() => { setForm(init); setSubmitted(false); }} resetLabel="Book Another" />
  );

  return (
    <div className="page-enter">
      <SectionHeader title="Service Booking" subtitle="Pre-book your next Yamaha service appointment" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>

        <Card>
          <CardLabel>Personal Information</CardLabel>
          <FormInput label="Full Name" placeholder="Enter your full name" value={form.name} onChange={set('name')} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormInput label="Mobile Number" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')} required />
            <FormInput label="Email Address" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} />
          </div>
        </Card>

        <Card>
          <CardLabel>Schedule Your Service</CardLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormInput label="Preferred Date" type="date" value={form.date} onChange={set('date')} required />
            <FormInput label="Preferred Time" type="time" value={form.time} onChange={set('time')} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormInput label="Service Center Code" placeholder="e.g. SC001" value={form.centerCode} onChange={set('centerCode')} />
            <FormInput label="User ID Code" placeholder="e.g. UID1234" value={form.userId} onChange={set('userId')} />
          </div>
        </Card>

        <Card>
          <CardLabel>Service Options</CardLabel>
          <RadioGroup label="Service Type" name="serviceType"
            options={['Free Service', 'Paid Service']}
            value={form.serviceType} onChange={v => setForm(f => ({ ...f, serviceType: v }))} />
          <RadioGroup label="Pickup Service Required?" name="pickup"
            options={['Yes', 'No']}
            value={form.pickup} onChange={v => setForm(f => ({ ...f, pickup: v }))} />
        </Card>

        <SubmitButton onClick={() => setSubmitted(true)}>Submit Booking</SubmitButton>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: SERVICE TRACKING
───────────────────────────────────────── */
const TRACK_STEPS = [
  { label: 'Bike body check',            done: true  },
  { label: 'Engine checked',             done: true  },
  { label: 'Oil and filter replaced',    done: true  },
  { label: 'Braking and clutch system checked', done: true  },
  { label: 'Washing',                    done: false },
  { label: 'Final service checkup',      done: false },
];

function ServiceTracking() {
  const doneCount = TRACK_STEPS.filter(s => s.done).length;
  const pct = Math.round((doneCount / TRACK_STEPS.length) * 100);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="page-enter">
      <SectionHeader title="Service Tracking" subtitle="Real-time status of your vehicle service" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>

        {/* Owner Info */}
        <Card>
          <CardLabel>Owner Information</CardLabel>
          <InfoRow label="Owner Name"    value="Vivek Sharma" />
          <InfoRow label="Vehicle"       value="YZF R1 2024" />
          <InfoRow label="Registration"  value="GJ04EE2919" />
        </Card>

        {/* Progress */}
        <Card>
          <CardLabel>Bike Servicing Status</CardLabel>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: C.grey, fontSize: 13 }}>Overall Progress</span>
            <span style={{ color: C.red, fontWeight: 700, fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif" }}>{pct}%</span>
          </div>
          <div style={{ background: '#333', borderRadius: 6, height: 8, marginBottom: 20, overflow: 'hidden' }}>
            <div style={{ background: C.red, width: `${barWidth}%`, height: '100%', borderRadius: 6, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
          </div>
          {TRACK_STEPS.map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '11px 0', borderBottom: `1px solid #222`,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: step.done ? C.green : '#3a3a3a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: C.white, fontWeight: 700,
                border: step.done ? 'none' : `2px solid #444`,
              }}>{step.done ? '✓' : ''}</div>
              <span style={{
                flex: 1, color: step.done ? C.white : C.grey,
                fontSize: 15, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
              }}>{step.label}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 2,
                color: step.done ? C.green : '#555',
                fontFamily: "'Barlow Condensed', sans-serif",
                background: step.done ? 'rgba(46,125,50,0.12)' : '#1a1a1a',
                padding: '3px 10px', borderRadius: 3,
              }}>{step.done ? 'DONE' : 'PENDING'}</span>
            </div>
          ))}
        </Card>

        {/* Time & Cost */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <CardLabel>Time for Completing Work</CardLabel>
            <InfoRow label="Total hours"  value="29 hours" />
            <InfoRow label="Hours left"   value="3 hours"  valueColor={C.red} />
          </Card>
          <Card>
            <CardLabel>Service Cost</CardLabel>
            <InfoRow label="Service type" value="Free service" />
            <InfoRow label="Total amount" value="₹ 0.00" valueColor={C.green} />
          </Card>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: SERVICE HISTORY
───────────────────────────────────────── */
const SERVICE_HISTORY = [
  {
    title: 'First Service',
    tag: '1st',
    rows: [
      ['Date',         '12 / 08 / 2023'],
      ['Odometer',     '235 KM'],
      ['Damage',       "Don't have any major damage"],
      ['Maintain Level', "'Stage 1'"],
      ['Work Done',    'Oil and engine check'],
    ],
  },
  {
    title: 'Second Service',
    tag: '2nd',
    rows: [
      ['Date',         '06 / 01 / 2024'],
      ['Odometer',     '1768 KM'],
      ['Damage',       'Left side damaged'],
      ['Maintain Level', "'Stage 1'"],
      ['Work Done',    'Oil and filter are replaced'],
    ],
  },
];

function ServiceHistory() {
  return (
    <div className="page-enter">
      <SectionHeader title="Service History" subtitle="Complete record of all past services" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
        {SERVICE_HISTORY.map((srv, i) => (
          <div key={i} className="hist-card" style={{
            background: C.dark, borderRadius: 12,
            marginBottom: 20, overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          }}>
            {/* Card header */}
            <div style={{
              background: `linear-gradient(90deg, ${C.redDark}, #3a0a0a)`,
              padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 900, color: C.white,
              }}>{srv.tag}</div>
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 22, fontWeight: 800, letterSpacing: 2,
                textTransform: 'uppercase', color: C.white,
              }}>{srv.title}</h3>
            </div>
            {/* Rows */}
            <div style={{ padding: '4px 24px 16px' }}>
              {srv.rows.map(([label, value]) => (
                <InfoRow key={label} label={label} value={value} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: SERVICING PROBLEMS
───────────────────────────────────────── */
function ServicingProblems() {
  const [form, setForm] = useState({
    userId:'', serviceId:'',
    bodyRelated:'', engineRelated:'', vehicleOthers:'',
    oilFilter:'', serviceCheckup:'', partsReplacement:'', serviceOthers:'',
    washing:'', cleaning:'', washOthers:'',
  });
  const [submitted, setSubmitted] = useState(false);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  if (submitted) return (
    <SuccessScreen icon="📨" title="Complaint Submitted!"
      message="Our service team will review your complaint and get back to you within 24 hours."
      onReset={() => { setForm(Object.fromEntries(Object.keys(form).map(k=>[k,'']))); setSubmitted(false); }}
      resetLabel="Submit Another" />
  );

  return (
    <div className="page-enter">
      <SectionHeader title="Servicing Problems" subtitle="Report any issues you faced during your service" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>

        <Card>
          <CardLabel>Identification</CardLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormInput label="User ID Code" placeholder="Enter User ID" value={form.userId} onChange={set('userId')} />
            <FormInput label="Service ID" placeholder="Enter Service ID" value={form.serviceId} onChange={set('serviceId')} />
          </div>
        </Card>

        <Card>
          <CardLabel>Vehicle Related Problems</CardLabel>
          <FormInput label="Body Related" placeholder="Describe body-related issues" value={form.bodyRelated} onChange={set('bodyRelated')} />
          <FormInput label="Engine Related" placeholder="Describe engine-related issues" value={form.engineRelated} onChange={set('engineRelated')} />
          <FormInput label="Others" placeholder="Any other vehicle issues" value={form.vehicleOthers} onChange={set('vehicleOthers')} />
        </Card>

        <Card>
          <CardLabel>Service Related Problems</CardLabel>
          <FormInput label="Oil and Filter Related" placeholder="Describe oil/filter issues" value={form.oilFilter} onChange={set('oilFilter')} />
          <FormInput label="Service Checkup" placeholder="Describe checkup problems" value={form.serviceCheckup} onChange={set('serviceCheckup')} />
          <FormInput label="Parts Replacement" placeholder="Describe parts replacement issues" value={form.partsReplacement} onChange={set('partsReplacement')} />
          <FormInput label="Others" placeholder="Any other service issues" value={form.serviceOthers} onChange={set('serviceOthers')} />
        </Card>

        <Card>
          <CardLabel>Washing Related Problems</CardLabel>
          <FormInput label="Washing and Detailing" placeholder="Describe washing issues" value={form.washing} onChange={set('washing')} />
          <FormInput label="Cleaning Related" placeholder="Describe cleaning issues" value={form.cleaning} onChange={set('cleaning')} />
          <FormInput label="Others" placeholder="Any other washing issues" value={form.washOthers} onChange={set('washOthers')} />
        </Card>

        <SubmitButton onClick={() => setSubmitted(true)}>Submit Complaint</SubmitButton>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: SERVICE FEEDBACK + POPUP
───────────────────────────────────────── */
function FeedbackPopup({ onClose }) {
  return (
    <div className="popup-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
    }} onClick={onClose}>
      <div className="popup-card" style={{
        background: C.slate, borderRadius: 18, padding: '44px 36px',
        maxWidth: 380, width: '92%', textAlign: 'center',
        boxShadow: '0 24px 80px rgba(0,0,0,0.9)',
        border: `1px solid #555`,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 26, fontWeight: 900, letterSpacing: 2,
          textTransform: 'uppercase', color: C.white, marginBottom: 6,
        }}>Thank You For Your Feedback!</h2>
        <p style={{ color: '#aaa', fontSize: 14, marginBottom: 22 }}>CONGRATULATIONS</p>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 40, fontWeight: 900, color: C.yellow,
          letterSpacing: 2, marginBottom: 6,
        }}>200 GOLD POINTS</div>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 28 }}>
          You've been rewarded for your valuable feedback
        </p>
        <button onClick={onClose} className="submit-btn" style={{
          background: C.black, border: `1.5px solid #444`,
          borderRadius: 9, padding: '13px 40px',
          color: C.white, fontSize: 16, fontWeight: 800,
          letterSpacing: 3, textTransform: 'uppercase',
          fontFamily: "'Barlow Condensed', sans-serif", cursor: 'pointer',
        }}>CLAIM</button>
      </div>
    </div>
  );
}

function ServiceFeedback() {
  const [form, setForm]       = useState({ serviceId:'', hasProblem:'', detail:'' });
  const [showPopup, setShowPopup] = useState(false);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="page-enter">
      <SectionHeader title="Service Feedback" subtitle="Rate and review your service experience" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>

        {/* Service ID badge */}
        <Card style={{ textAlign: 'center', background: '#1a2a1a', border: `1px solid ${C.green}44` }}>
          <p style={{ color: C.grey, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>Your Service ID</p>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 28, fontWeight: 800, letterSpacing: 4, color: C.white,
          }}>215AW56J</p>
        </Card>

        <Card>
          <CardLabel>Bike Service Feedback</CardLabel>
          <FormInput label="Service ID" placeholder="Enter your service ID" value={form.serviceId} onChange={set('serviceId')} />
          <RadioGroup label="Did you face any problems during service?"
            name="hasProblem" options={['Yes', 'No']}
            value={form.hasProblem} onChange={v => setForm(f => ({ ...f, hasProblem: v }))} />
          <FormTextarea label="Please Describe in Detail"
            placeholder="Share your experience with us..."
            value={form.detail} onChange={set('detail')} />
        </Card>

        <SubmitButton onClick={() => setShowPopup(true)}>Submit Feedback</SubmitButton>
      </div>

      {showPopup && <FeedbackPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: ACCOUNT DETAILS
───────────────────────────────────────── */
function AccountDetails() {
  return (
    <div className="page-enter">
      <SectionHeader title="Account Details" subtitle="Your profile, vehicles, and membership information" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>

        {/* Profile header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24,
          background: C.dark, borderRadius: 12, padding: '22px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: C.red, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 28, fontWeight: 900,
            color: C.white, flexShrink: 0,
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>VS</div>
          <div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 28, fontWeight: 900, color: C.white, letterSpacing: 2, marginBottom: 6,
            }}>Vivek Sharma</h2>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#3d2a00', color: C.yellow,
              padding: '5px 14px', borderRadius: 20, fontSize: 13,
              fontWeight: 700, letterSpacing: 2,
              fontFamily: "'Barlow Condensed', sans-serif",
              border: `1px solid ${C.yellow}44`,
            }}>⭐ PLATINUM MEMBER</div>
          </div>
        </div>

        {/* ID Details */}
        <div className="acct-section" style={{
          background: '#111', borderRadius: 10, padding: '18px 22px',
          marginBottom: 14, borderLeft: `4px solid #333`, transition: 'border-left-color .2s',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.red, textTransform: 'uppercase', marginBottom: 12, fontFamily: "'Barlow Condensed', sans-serif" }}>ID Details</p>
          <InfoRow label="Name"      value="Vivek Sharma" />
          <InfoRow label="Vehicle 1" value="YAMAHA R1, 2023 — FAB" />
          <InfoRow label="Vehicle 2" value="YAMAHA R7, 2024 — Jun" />
        </div>

        {/* Personal Details */}
        <div className="acct-section" style={{
          background: '#111', borderRadius: 10, padding: '18px 22px',
          marginBottom: 14, borderLeft: `4px solid #333`, transition: 'border-left-color .2s',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.red, textTransform: 'uppercase', marginBottom: 12, fontFamily: "'Barlow Condensed', sans-serif" }}>Personal Details</p>
          <InfoRow label="Owner Name"     value="Vivek R. Sharma" />
          <InfoRow label="City"           value="Bhavnager, Gujarat" />
          <InfoRow label="Contact Number" value="7228044114" />
        </div>

        {/* Membership Details */}
        <div className="acct-section" style={{
          background: '#111', borderRadius: 10, padding: '18px 22px',
          marginBottom: 14, borderLeft: `4px solid #333`, transition: 'border-left-color .2s',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.red, textTransform: 'uppercase', marginBottom: 12, fontFamily: "'Barlow Condensed', sans-serif" }}>Membership Details</p>
          <InfoRow label="Membership Type" value="PLATINUM" valueColor={C.yellow} />
          <InfoRow label="Member Since"    value="353 Days" />
          <InfoRow label="Membership ID"   value="K23-HGY45-B0" />
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: HELPLINE
───────────────────────────────────────── */
function Helpline() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText('120-2350695');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-enter">
      <SectionHeader title="Helpline" subtitle="Get support — available 24 hours, 7 days a week" />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>

        <div style={{
          width: 120, height: 120, borderRadius: '50%', background: C.red,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, margin: '0 auto 36px',
          boxShadow: `0 0 48px ${C.red}44`,
          animation: 'pulse 2.5s infinite',
        }}>📞</div>

        <Card>
          <CardLabel>Helpline Numbers</CardLabel>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 44, fontWeight: 900, color: C.white, letterSpacing: 2, marginBottom: 8,
          }}>120-2350695</div>
          <p style={{ color: C.grey, fontSize: 14, marginBottom: 20 }}>Available 24 / 7</p>
          <button onClick={copy} className="submit-btn" style={{
            background: copied ? C.green : C.red, border: 'none', borderRadius: 8,
            padding: '12px 28px', color: C.white, fontSize: 14, fontWeight: 800,
            letterSpacing: 2, textTransform: 'uppercase',
            fontFamily: "'Barlow Condensed', sans-serif", cursor: 'pointer',
            width: 'auto', transition: 'background .2s',
          }}>{copied ? '✓ Copied!' : 'Copy Number'}</button>
        </Card>

        <Card>
          <CardLabel>Helpline Website</CardLabel>
          <a href="https://www.yamaha-motor-india.com/contact-us.html"
            target="_blank" rel="noreferrer"
            style={{
              color: C.blue, fontSize: 16, wordBreak: 'break-all',
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
              textDecoration: 'none',
            }}>
            www.yamaha-motor-india.com/contact-us.html
          </a>
          <p style={{ color: C.grey, fontSize: 12, marginTop: 8 }}>
            Click to visit the official Yamaha India contact page
          </p>
        </Card>

        <p style={{ color: '#444', fontSize: 12, marginTop: 8 }}>
          For any service-related queries, complaints, or emergency assistance
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home' },
  { id: 'booking',   label: 'Booking' },
  { id: 'tracking',  label: 'Tracking' },
  { id: 'history',   label: 'History' },
  { id: 'problems',  label: 'Problems' },
  { id: 'feedback',  label: 'Feedback' },
  { id: 'account',   label: 'Account' },
  { id: 'helpline',  label: 'Helpline' },
];

function Navbar({ page, onNav, onLogout }) {
  return (
    <nav style={{
      background: C.dark, borderBottom: `3px solid ${C.red}`,
      padding: '0 20px', display: 'flex', alignItems: 'center',
      height: 60, position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
    }}>
      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginRight:'auto', cursor:'pointer' }}
        onClick={() => onNav('dashboard')}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: C.red,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 900, color: C.white,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>Y</div>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 20, fontWeight: 700, letterSpacing: 3,
          color: C.white, textTransform: 'uppercase',
        }}>Yamaha Service</span>
      </div>

      {/* Nav Links */}
      <div style={{ display:'flex', gap:2, alignItems:'center', flexWrap:'wrap' }}>
        {NAV_ITEMS.map(n => (
          <button key={n.id} className="nav-btn"
            onClick={() => onNav(n.id)}
            style={{
              background: 'none', border: 'none',
              color: page === n.id ? C.red : '#999',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12, fontWeight: 600, letterSpacing: 2,
              textTransform: 'uppercase', padding: '6px 10px',
              cursor: 'pointer', transition: 'color .15s',
              borderBottom: page === n.id ? `2px solid ${C.red}` : '2px solid transparent',
            }}>{n.label}</button>
        ))}
        <button onClick={onLogout} className="submit-btn" style={{
          background: C.red, border: 'none', borderRadius: 6,
          padding: '7px 16px', color: C.white, fontSize: 12,
          fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
          fontFamily: "'Barlow Condensed', sans-serif", cursor: 'pointer',
          marginLeft: 8, transition: 'opacity .15s',
        }}>Logout</button>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%',
      transform: 'translateX(-50%)',
      background: '#2c2c2c', color: C.white,
      padding: '13px 24px', borderRadius: 9,
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 14, letterSpacing: 1,
      boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
      zIndex: 999, borderLeft: `4px solid ${C.red}`,
      whiteSpace: 'nowrap', animation: 'slideDown .25s ease',
    }}>{message}</div>
  );
}

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
const SCREENS = {
  dashboard: Dashboard,
  booking:   ServiceBooking,
  tracking:  ServiceTracking,
  history:   ServiceHistory,
  problems:  ServicingProblems,
  feedback:  ServiceFeedback,
  account:   AccountDetails,
  helpline:  Helpline,
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page,     setPage]     = useState('dashboard');
  const [toast,    setToast]    = useState('');

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const handleLogin = () => {
    setLoggedIn(true);
    showToast('Welcome back, Vivek Sharma! 👋');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPage('dashboard');
    showToast('Logged out successfully');
  };

  const handleNav = id => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Screen = SCREENS[page] || Dashboard;

  return (
    <div style={{ background: C.black, minHeight: '100vh', color: C.white }}>
      <GlobalStyles />

      {loggedIn && (
        <Navbar page={page} onNav={handleNav} onLogout={handleLogout} />
      )}

      {!loggedIn
        ? <LoginPage onLogin={handleLogin} />
        : <Screen onNav={handleNav} />
      }

      <Toast message={toast} />
    </div>
  );
}