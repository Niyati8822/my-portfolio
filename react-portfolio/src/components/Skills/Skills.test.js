import React from 'react';
import { render, screen } from '@testing-library/react';
import Skills from './index';

describe('Skills Component', () => {
  test('renders Skills component', () => {
    render(<Skills />);
    const skillsHeading = screen.getByRole('heading', { name: /skills/i });
    expect(skillsHeading).toBeInTheDocument();
  });

  test('displays a list of skills', () => {
    const skills = ['JavaScript', 'React', 'CSS', 'Node.js'];
    render(<Skills skills={skills} />);
    skills.forEach(skill => {
      const skillItem = screen.getByText(skill);
      expect(skillItem).toBeInTheDocument();
    });
  });
});