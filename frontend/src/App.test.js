import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders landing page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Real-time Code Collaboration/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders room creation button', () => {
  render(<App />);
  const createButton = screen.getByText(/Create Room/i);
  expect(createButton).toBeInTheDocument();
});

test('renders join room input', () => {
  render(<App />);
  const joinInput = screen.getByPlaceholderText(/Enter room ID/i);
  expect(joinInput).toBeInTheDocument();
});
