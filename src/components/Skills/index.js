import { useEffect, useState } from 'react';
import Loader from 'react-loaders';
import AnimatedLetters from '../AnimatedLetters';
import EnergySphere from '../EnergySphere';
import './index.scss';

const Skills = () => {
  const [letterClass, setLetterClass] = useState('text-animate');

  const skills = [
    'JavaScript',
    'CAD',
    'Node.js',
    'HCI',
    'Python',
    'Behavioural Analysis',
    'Jira',
    'Tableau',
    'React',
    'Sensor Design',
    'AI Governance',
    'RLHF',
    'TypeScript',
    'UI/UX',
    'Mixed Methods',
    'Neuroscience',
    'Excel',
    
    'Data Analysis',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="container skills-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['S', 'k', 'i', 'l', 'l', 's']}
              idx={15}
            />
          </h1>
        </div>
        <div className="sphere-zone">
          <EnergySphere skills={skills} />
        </div>
      </div>
      <Loader type="pacman" />
    </>
  );
};

export default Skills;
