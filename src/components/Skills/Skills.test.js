import { render, screen } from '@testing-library/react';
import Skills from './index';

describe('Skills component (sphere-only)', () => {
  test('renders energy sphere container full screen', () => {
    render(<Skills />);
    const sphereContainer = screen.getByLabelText(/skills energy sphere section/i);
    expect(sphereContainer).toBeInTheDocument();
    // Inner visualization container
    const viz = screen.getByLabelText(/skills energy sphere visualization/i);
    expect(viz).toBeInTheDocument();
  });
});
