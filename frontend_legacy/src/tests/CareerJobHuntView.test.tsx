import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CareerJobHuntView } from '../components/career/CareerJobHuntView';
import { DashboardProvider } from '../context/DashboardContext';

describe('CareerJobHuntView Component', () => {
  it('renders Career & Job Hunt Launchpad header and pipeline tabs', () => {
    render(
      <DashboardProvider>
        <CareerJobHuntView />
      </DashboardProvider>
    );

    expect(screen.getByText(/Career & Job Hunt Launchpad/i)).toBeInTheDocument();
    expect(screen.getByText(/Pipeline Kanban/i)).toBeInTheDocument();
    expect(screen.getByText(/1-Click Outreach Bank/i)).toBeInTheDocument();
    expect(screen.getByText(/Star Project Pitches/i)).toBeInTheDocument();
  });

  it('renders Kanban stages correctly', () => {
    render(
      <DashboardProvider>
        <CareerJobHuntView />
      </DashboardProvider>
    );

    expect(screen.getAllByText(/Targeted/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Resume Tailored/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Outreach Sent/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Interviewing/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Offer/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches to Outreach Templates view when tab clicked', () => {
    render(
      <DashboardProvider>
        <CareerJobHuntView />
      </DashboardProvider>
    );

    const templatesTab = screen.getByText(/1-Click Outreach Bank/i);
    fireEvent.click(templatesTab);

    expect(screen.getByText(/LinkedIn Recruiter Cold Ping/i)).toBeInTheDocument();
    expect(screen.getByText(/Engineering Manager Value-Add Pitch/i)).toBeInTheDocument();
  });
});
