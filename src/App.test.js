import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders home page', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const headingElement = screen.getByRole('heading', { name: /boagdev/i });
  expect(headingElement).toBeInTheDocument();
});

test('renders projects page', () => {
  render(
    <MemoryRouter initialEntries={['/projects']}>
      <App />
    </MemoryRouter>
  );

  const headingElement = screen.getByRole('heading', { name: /projects/i });
  expect(headingElement).toBeInTheDocument();

  const projectTitle = screen.getByText('boag_dev');
  expect(projectTitle).toBeInTheDocument();

  const projectsLink = screen.getByRole('link', { name: /projects/i });
  expect(projectsLink).toHaveClass('active');
});
