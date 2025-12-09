import { render, screen } from '@testing-library/react';
import Footer from './components/Footer';


test('renders the footer element', () => {
  render(<Footer />);
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});
