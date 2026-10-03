import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Fuel,
  Gift,
  MapPin,
  Navigation,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  WalletCards,
} from 'lucide-react';
import './styles.css';

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type TerminalReading = { gallons: number; total: number; completedAt: string };

const brand = {
  green: '#008053',
  yellow: '#FFC72C',
  red: '#EE3124',
  orange: '#F58220',
  mint: '#00D084',
  black: '#000000',
  background: '#F3F4F6',
  white: '#FFFFFF',
  text: '#1C1917',
} as const;

function Logo() {
  return (
    <img className="logo" src="/assets/horizlogo_1645478836585-HR.png" alt="7-Eleven" />
  );
}

function Button({
  children,
  onClick,
  variant = 'green',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'green' | 'red' | 'black' | 'outline';
  disabled?: boolean;
}) {
  return (
    <button className={`button button-${variant}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function StepProgress({ step }: { step: Step }) {
  const labels = ['Location', 'Safety', 'Pump', 'Pay', 'Fueling', 'Receipt'];
  return (
    <div className="progress-card">
      {labels.map((label, index) => {
        const number = index + 1;
        return (
          <React.Fragment key={label}>
            <div className={`progress-step ${step === number ? 'current' : ''} ${step > number ? 'done' : ''}`}>
              <span className="progress-number">{step > number ? <Check size={14} /> : number}</span>
              <span>{label}</span>
            </div>
            {index < labels.length - 1 && <ChevronRight className="progress-chevron" size={16} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Confetti({ active }: { active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(active);
  }, [active]);

  useEffect(() => {
    if (!active || !visible) return;
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d');
    if (!context) return;
    element.width = window.innerWidth;
    element.height = window.innerHeight;
    const colors = [brand.green, brand.red, brand.orange, brand.yellow, brand.black];
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * element.width,
      y: -Math.random() * element.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 4 + 3,
      drift: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    let frame = 0;
    const render = () => {
      context.clearRect(0, 0, element.width, element.height);
      particles.forEach((particle) => {
        particle.y += particle.speed;
        particle.x += particle.drift;
        particle.rotation += 3;
        context.save();
        context.translate(particle.x, particle.y);
        context.rotate((particle.rotation * Math.PI) / 180);
        context.fillStyle = particle.color;
        context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        context.restore();
      });
      frame = requestAnimationFrame(render);
    };
    render();
    const timeout = window.setTimeout(() => {
      cancelAnimationFrame(frame);
      context.clearRect(0, 0, element.width, element.height);
      setVisible(false);
    }, 3000);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      context.clearRect(0, 0, element.width, element.height);
    };
  }, [active, visible]);
  return visible ? <canvas ref={canvas} className="confetti" /> : null;
}

export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [member, setMember] = useState(true);
  const [pump, setPump] = useState('04');
  const [safety, setSafety] = useState({ parked: false, engineOff: false });
  const [payment, setPayment] = useState('7pay');
  const [terminalReading, setTerminalReading] = useState<TerminalReading | null>(null);

  const basePrice = 3.79;
  const price = member ? basePrice - 0.2 : basePrice;

  useEffect(() => {
    if (step !== 5) return;
    const terminalTimer = window.setTimeout(() => {
      const gallons = 8.42;
      setTerminalReading({
        gallons,
        total: Number((gallons * price).toFixed(2)),
        completedAt: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      });
      setStep(6);
    }, 5000);
    return () => window.clearTimeout(terminalTimer);
  }, [step, price]);

  const reset = () => {
    setStep(1);
    setSafety({ parked: false, engineOff: false });
    setTerminalReading(null);
  };

  return (
    <div className="site-shell">
      <Confetti active={step === 6} />
      <div className="utility-bar">We accept SNAP/EBT. <span>Find a Store</span></div>
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-area">
            <Logo />
            <nav className="desktop-nav">
              <a href="#food"><img className="brand-icon" src="/assets/7-eleven_logo.svg" alt="" />FOOD</a><a href="#drinks">DRINKS</a><a className="active" href="#rewards">7REWARDS®</a><a href="#delivery">ORDER 7NOW® DELIVERY</a>
            </nav>
          </div>
          <button className={`member-toggle ${member ? 'active' : ''}`} onClick={() => setMember((value) => !value)}>
            <User size={16} />
            {member ? '7REWARDS ACTIVE' : 'SIGN IN / 20¢ OFF'}
          </button>
        </div>
      </header>
      <div className={`rewards-strip ${member ? 'member-strip' : 'guest-strip'}`}>
        <Sparkles size={18} />
        <strong>{member ? '20¢ OFF / GAL INSTANT DISCOUNT APPLIED' : 'FUEL WITH 7REWARDS® TO UNLOCK 20¢ OFF / GAL'}</strong>
        <button onClick={() => setMember((value) => !value)}>{member ? 'STATUS' : 'APPLY NOW'}</button>
      </div>

      <main className="journey">
        <StepProgress step={step} />
        {step === 1 && (
          <section className="journey-card">
            <div className="hero-panel">
              <h1>WELCOME TO 7-ELEVEN FUEL</h1>
              <p>STORE #48291 · 1201 MAIN STREET</p>
            </div>
            <div className="panel-body center">
              <div className="verified"><MapPin size={28} /><div><strong>STATION LOCATION VERIFIED</strong><span>GPS & BLE beacon confirmed at pump island</span></div></div>
              <div className="price-callout"><span>UNLEADED REGULAR FUEL RATE</span><strong>${price.toFixed(2)} / GAL</strong><small>{member ? '7REWARDS MEMBER RATE APPLIED' : 'JOIN 7REWARDS TO SAVE 20¢ / GAL'}</small></div>
              <div className="station-meta"><Navigation size={18} /> You are located at Pump <strong>04</strong></div>
              <Button onClick={() => setStep(2)}>I AM PARKED & SAFE TO FUEL <ArrowRight size={18} /></Button>
            </div>
          </section>
        )}
        {step === 2 && (
          <section className="journey-card panel-body">
            <div className="center"><ShieldCheck size={46} color={brand.orange} /><h2>SAFETY CHECKPOINT</h2><p>Confirm these steps before unlocking the pump dispenser.</p></div>
            {[
              ['parked', 'VEHICLE IS IN PARK', 'Emergency brake engaged'],
              ['engineOff', 'ENGINE IS TURNED OFF', 'No smoking or open flames nearby'],
            ].map(([key, title, detail]) => (
              <button key={key} className={`check-option ${safety[key as keyof typeof safety] ? 'selected' : ''}`} onClick={() => setSafety((current) => ({ ...current, [key]: !current[key as keyof typeof safety] }))}>
                <span className="checkbox">{safety[key as keyof typeof safety] && <Check size={15} />}</span><span><strong>{title}</strong><small>{detail}</small></span>
              </button>
            ))}
            <div className="actions"><Button variant="outline" onClick={() => setStep(1)}>BACK</Button><Button disabled={!safety.parked || !safety.engineOff} onClick={() => setStep(3)}>CONFIRM & SELECT PUMP <ArrowRight size={18} /></Button></div>
          </section>
        )}
        {step === 3 && (
          <section className="journey-card panel-body">
            <div className="center"><Fuel size={44} color={brand.red} /><h2>SELECT YOUR PUMP NUMBER</h2><p>Look at the physical pump dispenser banner.</p></div>
            <div className="pump-grid">{['01','02','03','04','05','06','07','08','09','10','11','12'].map((number) => <button className={`pump-option ${pump === number ? 'selected' : ''}`} key={number} onClick={() => setPump(number)}>PUMP {number}</button>)}</div>
            <div className="fuel-summary"><span>SELECTED PUMP</span><strong>#{pump}</strong><span>MEMBER RATE</span><strong>${price.toFixed(2)} / GAL</strong></div>
            <Button onClick={() => setStep(4)}>CONTINUE TO PAYMENT <ArrowRight size={18} /></Button>
          </section>
        )}
        {step === 4 && (
          <section className="journey-card panel-body">
            <div className="center"><CreditCard size={44} color={brand.green} /><h2>SELECT PAYMENT METHOD</h2><p>Temporary pre-authorization hold applied before the pump is unlocked.</p></div>
            <button className={`payment-option ${payment === '7pay' ? 'selected' : ''}`} onClick={() => setPayment('7pay')}><span className="payment-logo">7-PAY</span><span><strong>7-Eleven Wallet / Apple Pay</strong><small>Double 7Rewards points active</small></span>{payment === '7pay' && <CheckCircle2 />}</button>
            <button className={`payment-option ${payment === 'visa' ? 'selected' : ''}`} onClick={() => setPayment('visa')}><span className="payment-logo">VISA</span><span><strong>Visa ending in 4242</strong><small>Default credit card</small></span>{payment === 'visa' && <CheckCircle2 />}</button>
            <div className="yellow-callout"><strong>FUEL WITH 7REWARDS®</strong><span>Applied rate: ${price.toFixed(2)}/gal · 20¢/gal savings active</span></div>
            <div className="actions"><Button variant="outline" onClick={() => setStep(3)}>BACK</Button><Button variant="red" onClick={() => setStep(5)}>AUTHORIZE & BEGIN FUELING <ArrowRight size={18} /></Button></div>
          </section>
        )}
        {step === 5 && (
          <section className="journey-card panel-body fueling-screen">
            <div className="active-pump">PUMP #{pump} ACTIVE · DISPENSER UNLOCKED</div>
            <h2>FUELING IN PROGRESS...</h2>
            <div className="terminal-gauge"><div className="gauge-ring"><Fuel size={42} color={brand.mint} /></div><strong>WAITING FOR TERMINAL</strong><span>Fuel amount and billing will be fetched automatically when the physical pump meter completes.</span><div className="loading-dots"><i /><i /><i /></div></div>
            <div className="terminal-note"><ShieldCheck size={18} /> Keep the nozzle in the vehicle. Replace it in the pump cradle when finished.</div>
            <p className="muted">The app does not control gallons, dollar limits, or pump completion.</p>
          </section>
        )}
        {step === 6 && terminalReading && (
          <section className="journey-card panel-body success-screen">
            <div className="success-icon"><CheckCircle2 size={48} /></div><h2>FUELING FINISHED!</h2><p className="success-greeting">Have a safe and happy ride!</p><p>Your terminal reading was received and your digital receipt is ready.</p>
            <div className="receipt"><div><span>STATION / PUMP</span><strong>#48291 / PUMP #{pump}</strong></div><div><span>TOTAL FUEL DISPENSED</span><strong>{terminalReading.gallons.toFixed(3)} GAL</strong></div><div><span>APPLIED RATE</span><strong>${price.toFixed(2)} / GAL</strong></div><div className="total"><span>TOTAL PAID</span><strong>${terminalReading.total.toFixed(2)}</strong></div><small>Terminal completed at {terminalReading.completedAt}</small></div>
            <div className="points-card"><Gift size={32} /><div><strong>7REWARDS EARNED</strong><span>Added to account ending in 9102</span></div><b>+{Math.round(terminalReading.total * 10)} PTS</b></div>
            <div className="offer-card"><ShoppingBag size={24} /><div><strong>FREE MEDIUM SLURPEE® INSIDE!</strong><span>Redeem with your new 7Rewards points today.</span></div></div>
            <Button onClick={reset}>START NEW FUELING TRANSACTION <ArrowRight size={18} /></Button>
          </section>
        )}
      </main>
      <footer className="mobile-nav"><span className="selected"><Fuel size={20} />FUEL & PAY</span><span><Gift size={20} />REWARDS</span><span><WalletCards size={20} />WALLET</span><span><User size={20} />ACCOUNT</span></footer>
    </div>
  );
}
