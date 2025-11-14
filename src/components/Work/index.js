import './index.scss';
import { useState } from 'react';
import Project1 from '../../assets/images/Project 1.png';
import Project2 from '../../assets/images/Project 2.png';
import Project3 from '../../assets/images/Project 3. jpg.png';
import Project4 from '../../assets/images/Project 4.png';
import Project5 from '../../assets/images/Project 5.png';
import Project6 from '../../assets/images/Project 6.jpg';

const Work = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Portfolio projects data - you can add images and details later
  const projects = [ 
    {
      id: 1,
      title: 'Human–AI Interaction Researcher',
      category: 'Research',
      thumbnail: Project1,
      description: 'As a Human-AI Interaction Researcher at Piedmont Gardens Senior Center in Oakland, I worked closely with over 100 older adults to investigate real-world conversational AI interactions. My efforts focused on capturing behavioral patterns, emotional responses, and trust dynamics, extending analysis well beyond technical performance metrics. Utilizing Reinforcement Learning from Human Feedback (RLHF), I systematically collected, annotated, and structured user feedback, resulting in robust datasets that quantified user preferences and significantly improved alignment between AI outputs and human values. In addition, I identified potential ethical risks associated with AI deployment among vulnerable populations and contributed to developing documentation vital for future security audits (SOC2), supporting responsible and transparent AI development. This project bridged the gap between technical innovation and human-centered design, advancing the creation of AI systems that truly reflect and respect the diverse needs and values of senior community members.',
      technologies: ['RLHF', 'AI Ethics', 'UX Research']
    },
    {
      id: 2,
      title: 'Sensor for AD Detection',
      category: 'Research',
      thumbnail: Project2,
      description: 'I developed an innovative biosensor designed for the early detection of Alzheimer\'s Disease by targeting amyloid-beta oligomers in tear fluid. The sensor leveraged a gold electrode layered with silver nanoparticles and a specialized protein complex, forming a highly specific and sensitive platform for analyte recognition. Upon deposition of a tear sample, the biosensor generated a reaction that could be visually analyzed. I also built a companion mobile app that interpreted reaction outputs based on their wavelength, enabling rapid, on-site quantification of amyloid-beta concentrations. This integrated approach facilitated timely and non-invasive detection of Alzheimer\'s biomarkers, providing critical tools for early intervention and monitoring with user-friendly accessibility.',
      technologies: ['Biosensor Design', 'Mobile App Development', 'Nanotechnology'],
      link: ''
    },
    {
      id: 3,
      title: 'Dronaid',
      category: 'Healthcare Technology',
      thumbnail: Project3,
      description: 'During my internship at Tech Swarm, I co-developed DRONAID- a drone based delivery service designed to help high-risk or quarantined individuals safely access essential medications during the COVID-19 pandemic. My responsibilities included the 3D design and assembly of the quadcopter and integrating pharmacy systems for seamless deliveries. Collaborating with Apollo Pharmacy, our team automated the transport of medicines directly to the doorsteps of those unable to leave home, managing to serve over 200 households. Despite challenges in scaling due to logistical and economic constraints, the project demonstrated the significant impact technology can have in addressing urgent healthcare needs and supporting vulnerable communities during crises.',
      technologies: ['Drone Design', '3D Modeling', 'System Integration'],
      link: ''
    },
    {
      id: 4,
      title: 'Verite',
      category: 'Clothing Brand',
      thumbnail: Project4,
      description: 'I am currently developing a clothing brand as a creative side project, focused on designing versatile exercise apparel that acts as an extension of the skin and empowers movement in all forms. Inspired by active lifestyles and built on iterative testing with athlete friends, my process involves research, fabric sampling, design sketching, stitching prototypes, and refining through real-world use. The collection emphasizes high-quality, breathable fabrics and innovative designs that blend aesthetics with true functionality for a transformed workout experience. My vision is to share this shift—combining technology, comfort, and self-expression—so others can experience the profound impact of purposeful, thoughtfully designed activewear. The brand and its website are currently in progress, with exciting pieces like premium sports bras and bodysuits soon to launch.',
      technologies: ['Fashion Design', 'Prototyping', 'Product Development'],
      link: ''
    },
    {
      id: 5,
      title: 'Robotic Arm',
      category: 'Robotics & Automation',
      thumbnail: Project5,
      description: 'I engineered and 3D printed a flexible 6-degree-of-freedom robotic arm designed for high-precision industrial operations such as assembly, welding, and material handling. The arm features custom designed joints, reliable high-torque actuators, and integrated sensor feedback for accurate motion and force control. Before fabrication, I conducted extensive performance validation and optimization using RoboDK simulation software, including workspace analysis, collision avoidance, and cycle time refinement to ensure safety and efficiency. Its modular architecture and open interface enable seamless integration with industrial controllers and allow for straightforward upgrades and maintenance. The arm\'s programmable capabilities, real-time trajectory features, and robust design make it exceptionally adaptable for a wide range of automated manufacturing and research environments.',
      technologies: ['3D Printing', 'RoboDK', 'Sensor Integration'],
      link: ''
    },
    {
      id: 6,
      title: 'Flood Wall',
      category: 'Materials Engineering',
      thumbnail: Project6,
      description: 'I led the fabrication and testing of an innovative composite material composed of wood, resin, and mulch, developed for flood wall applications in Oroville, California. My work focused on improving flood resilience using sustainable resources and advanced material engineering to build robust and eco-friendly barriers. I oversaw the synthesis, prototyping, and rigorous performance assessments under simulated flood conditions to ensure durability, water resistance, and structural integrity. Through this research-driven approach, I advanced flood mitigation infrastructure while prioritizing environmental impact and long-term sustainability.',
      technologies: ['Composite Materials', 'Sustainability', 'Performance Testing'],
      link: ''
    }
  ];

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="work" className="section section-work">
      <div className="work-content">
        <h2 className="work-heading">My Work</h2>
        
        <div className="portfolio-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="portfolio-item"
              onClick={() => openModal(project)}
            >
              <div className="portfolio-item-inner">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.title} />
                ) : (
                  <div className="placeholder-image">
                    <span>Add Image</span>
                  </div>
                )}
                <div className="portfolio-overlay">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Popup */}
        {selectedProject && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              
              <div className="modal-body">
                <div className="modal-details only-text">
                  <h2>{selectedProject.title}</h2>
                  <p className="modal-category">{selectedProject.category}</p>
                  <p className="modal-description">{selectedProject.description}</p>
                  
                  <div className="modal-technologies">
                    <h4>Technologies:</h4>
                    <div className="tech-tags">
                      {selectedProject.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  {selectedProject.link && (
                    <a 
                      href={selectedProject.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Work;
