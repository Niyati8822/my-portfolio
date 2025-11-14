import './index.scss';
import PortraitImg from '../../assets/images/myportrait.png';
import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
// React import not needed for functional features now; removed unused hooks.

const Home = () => {
  // Wrap each character in a span for individual hover animations
  const wrapChars = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className='char'>{char}</span>
    ));
  };

  const titleRef = useRef(null);
  const rafRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const charsRef = useRef([]);

  useEffect(() => {
    if (!titleRef.current) return;
    charsRef.current = Array.from(titleRef.current.querySelectorAll('.char'));
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // floating dots removed per request

  const applyCharTransforms = (mx, my) => {
    const MAX_DIST = 220; // px radius of effect
    const MAX_OFFSET = 14; // px translate
    const MAX_ROT = 8; // deg
    const MAX_SCALE = 0.22; // additional scale

    charsRef.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const t = Math.max(0, 1 - dist / MAX_DIST);
      const nx = -dx / dist; // move away from cursor
      const ny = -dy / dist;

      const tx = nx * t * MAX_OFFSET;
      const ty = ny * t * MAX_OFFSET;
      const rot = (nx * ny) * t * MAX_ROT;
      const sc = 1 + t * MAX_SCALE;

      // chromatic aberration via text-shadow
      const sx = Math.round((dx / dist) * t * 2);
      const sy = Math.round((dy / dist) * t * 2);
      const shadow = `${sx}px ${sy}px 0 rgba(255,0,100,0.6), ${-sx}px ${-sy}px 0 rgba(0,230,255,0.6)`;

      el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sc})`;
      el.style.textShadow = shadow;
    });
  };

  const handleMouseMove = (e) => {
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      applyCharTransforms(lastPosRef.current.x, lastPosRef.current.y);
    });
  };

  const handleMouseLeave = () => {
    if (!charsRef.current) return;
    charsRef.current.forEach((el) => {
      if (!el) return;
      el.style.transform = '';
      el.style.textShadow = '';
    });
  };

  // Simple hover effect: scale + filter transition

  return (
    <div id='home' className='home'>
      <div className="hero-image-container">
        <img src={PortraitImg} alt="Portrait" className="hero-image" />
      </div>
      
      <div className='home-content'>
        <h1
          className='home-title'
          ref={titleRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span className='line glitch' data-text={'Hi'}>{wrapChars('Hi')}</span><br />
          <span className='line glitch' data-text={"I'm Niyati,"}>
            <span className='normal'>{wrapChars("I'm")}</span>
            <span> </span>
            <span className='name'>{wrapChars('Niyati')}</span>
            {wrapChars(',')}
          </span><br />
          <span className='line glitch' data-text={'AI User Researcher.'}>{wrapChars('AI')} <span>{wrapChars('User')} <span>{wrapChars('Researcher.')}</span></span></span>
        </h1>
      </div>

      <div className='contact-info'>
        <h2 className='contact-heading'>Contact Me</h2>
        <div className='contact-details'>
          <p className='contact-item'>
            <span className='contact-label'>Email:</span>
            <a href='mailto:niyati_chaudhary@berkeley.edu' className='contact-link'>
              niyati_chaudhary@berkeley.edu
            </a>
          </p>
          <p className='contact-item'>
            <span className='contact-label'>Phone:</span>
            <a href='tel:+16692901476' className='contact-link'>
              (669) 290-1476
            </a>
          </p>
          <p className='contact-item'>
            <span className='contact-label'>LinkedIn:</span>
            <a 
              href='https://www.linkedin.com/in/niyati-chaudhary-13544256/' 
              target='_blank' 
              rel='noopener noreferrer'
              className='contact-link linkedin-link'
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </p>
        </div>
      </div>

      {/* Reference-inspired RGB hover split effect applied */}
    </div>
  );
};

export default Home;
