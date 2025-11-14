import { render, screen } from '@testing-library/react';
import EnergySphere from './index';

// Basic render test: ensures container mounts and accepts skills prop

describe('EnergySphere', () => {
  test('renders container', () => {
    render(<EnergySphere skills={['A','B','C']} />);
    const container = screen.getByLabelText(/skills energy sphere visualization/i);
    expect(container).toBeInTheDocument();
  });
});
