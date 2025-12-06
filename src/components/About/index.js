import './index.scss';

const About = () => {
  return (
    <section id="about" className="section section-about">
      <div className="page-inner">
        <h2 className="about-paragraph">About Me</h2>
        <div className="about-content">
          <p className="about-paragraph">
            As an Engineer and Designer, I approach every project with curiosity and empathy at its core. I'm inspired by the transformative potential of AI and envision myself shaping its impact on the way people live and interact.
          </p>
          <p className="about-paragraph">
            Over the years, I’ve built robots, prototyped health tech devices and explored the world of neuroscience. At the heart of it all has been a deep respect for human well-being and solutions that help protect it.
          </p>
          <p className="about-paragraph">
            Now, as a master’s student at UC Berkeley specialising in Human-AI interaction, I’m channeling that passion into projects that bring AI, design and human experience together—building intelligent systems that feel as thoughtful as the people they serve.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
