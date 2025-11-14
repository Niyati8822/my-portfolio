import './index.scss'
import LogoS from '../../assets/images/logo-n.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faEnvelope, faLightbulb, faSuitcase, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const [open, setOpen] = useState(false)

  // close sidebar on history navigation for small screens
  useEffect(() => {
    const onPop = () => { if (window.innerWidth <= 768) setOpen(false) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <>
      {open && <div className='sidebar-overlay' onClick={() => setOpen(false)} />}

      <div className={`nav-bar ${open ? 'open' : ''}`}>
        <button className='toggle-btn' aria-label={open ? 'Close sidebar' : 'Open sidebar'} onClick={() => setOpen(!open)}>
          <FontAwesomeIcon icon={open ? faTimes : faBars} />
        </button>

        <a className='logo' href='#home'>
          <img src={LogoS} alt="logo" />
          <span className='sidebar-name'>Niyati</span>
        </a>
        <div className='sidebar-icons'>
          <a href="#home" className='sidebar-link'>
            <FontAwesomeIcon icon={faHome} size="2x" className="sidebar-icon" />
            <span className="sidebar-label">Home</span>
          </a>
          <NavLink 
            exact="true"
            activeclassname="active"
            className="about-link" 
            to="/about"
          >
            <FontAwesomeIcon icon={faUser} size="2x" className="sidebar-icon" />
            <span className="sidebar-label">About me</span>
          </NavLink>
          <NavLink
            exact="true"
            activeclassname="active"
            className="skills-link"
            to="/skills"
          >
            <FontAwesomeIcon icon={faLightbulb} size="2x" className="sidebar-icon" />
            <span className="sidebar-label">Skills</span>
          </NavLink>
          <NavLink
            exact="true"
            activeclassname="active"
            className="portfolio-link"
            to="/portfolio"
          >
            <FontAwesomeIcon icon={faSuitcase} size="2x" className="sidebar-icon" />
            <span className="sidebar-label">My Work</span>
          </NavLink>
          <a href="#contact" className='sidebar-link'>
            <FontAwesomeIcon icon={faEnvelope} size="2x" className="sidebar-icon" />
            <span className="sidebar-label">Contact</span>
          </a>
        </div>

        <div className='sidebar-footer'>
          <a className='social-link' href='https://www.linkedin.com/in/niyati-chaudhary-13544256/' target='_blank' rel='noopener noreferrer' title='LinkedIn'>
            <FontAwesomeIcon icon={faLinkedin} size='lg' />
          </a>
          <a className='social-link' href='https://github.com/' target='_blank' rel='noopener noreferrer' title='GitHub'>
            <FontAwesomeIcon icon={faGithub} size='lg' />
          </a>
        </div>
      </div>
    </>
  )
}

export default Sidebar

