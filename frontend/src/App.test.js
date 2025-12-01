import { render, screen } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import App from './App';

test("App se renderiza sin crashear", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Solo verificamos que exista algo del Header o Home
  const header = screen.getByRole("banner"); // <header>
  expect(header).toBeInTheDocument();
});
