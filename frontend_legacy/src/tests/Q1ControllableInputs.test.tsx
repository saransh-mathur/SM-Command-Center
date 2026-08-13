import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Q1ControllableInputs } from '../components/quadrants/Q1ControllableInputs';
import { DashboardProvider } from '../context/DashboardContext';

describe('Q1ControllableInputs Component', () => {
  it('renders Tri-Track Daily Controllable Inputs title and momentum score', () => {
    render(
      <DashboardProvider>
        <Q1ControllableInputs />
      </DashboardProvider>
    );

    expect(screen.getByText(/Tri-Track Daily Controllable Inputs/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Momentum Score/i)).toBeInTheDocument();
    expect(screen.getByText(/7-Day Streak Grid/i)).toBeInTheDocument();
  });

  it('renders all 4 tracked input categories', () => {
    render(
      <DashboardProvider>
        <Q1ControllableInputs />
      </DashboardProvider>
    );

    expect(screen.getByText(/Job Applications & Outreach Pings/i)).toBeInTheDocument();
    expect(screen.getByText(/Udemy \/ Course Micro-Sprints/i)).toBeInTheDocument();
    expect(screen.getByText(/MBA Concept & Formula Recall/i)).toBeInTheDocument();
    expect(screen.getByText(/90-min Ultradian Deep Work Block/i)).toBeInTheDocument();
  });

  it('renders action triggers for 5-Min Micro Start and Roulette', () => {
    render(
      <DashboardProvider>
        <Q1ControllableInputs />
      </DashboardProvider>
    );

    expect(screen.getByText(/🎲 Unblock Me \(3-Min Roulette\)/i)).toBeInTheDocument();
    expect(screen.getByText(/🚀 5-Min Micro-Start/i)).toBeInTheDocument();
  });
});
