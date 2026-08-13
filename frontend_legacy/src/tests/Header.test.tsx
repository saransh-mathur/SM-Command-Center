import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../components/Header';
import { DashboardProvider } from '../context/DashboardContext';

describe('Header Component', () => {
  it('renders brand title and live telemetry badges', () => {
    render(
      <DashboardProvider>
        <Header />
      </DashboardProvider>
    );

    expect(screen.getByText('SM COMMAND CENTER')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText(/NITRO-AN515/i)).toBeInTheDocument();
  });

  it('renders all 4 navigation tabs', () => {
    render(
      <DashboardProvider>
        <Header />
      </DashboardProvider>
    );

    expect(screen.getByText(/⚡ Cockpit/i)).toBeInTheDocument();
    expect(screen.getByText(/💼 Career & Jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/💻 Course Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/🎓 MBA Copilot/i)).toBeInTheDocument();
  });

  it('renders the emergency Unblock Me button', () => {
    render(
      <DashboardProvider>
        <Header />
      </DashboardProvider>
    );

    expect(screen.getByText(/🎲 Unblock Me/i)).toBeInTheDocument();
  });
});
