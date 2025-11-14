import React from 'react';
import './index.scss';

const Skills = () => {
  const skills = [
    'JavaScript',
    'React',
    'Three.js',
    'GSAP',
    'SCSS',
    'Node.js',
    'Express',
    'MongoDB',
    'HTML',
    'CSS'
  ];

  return (
    <div className="skills-container">
      <h1 className="skills-title">My Skills</h1>
      <ul className="skills-list">
        {skills.map((skill, index) => (
          <li key={index} className="skills-item">{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;