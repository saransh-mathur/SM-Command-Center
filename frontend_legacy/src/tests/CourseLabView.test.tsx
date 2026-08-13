import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CourseLabView } from '../components/courses/CourseLabView';
import { DashboardProvider } from '../context/DashboardContext';

describe('CourseLabView Component', () => {
  it('renders Course Lab header and 1 Video = 1 Commit banner', () => {
    render(
      <DashboardProvider>
        <CourseLabView />
      </DashboardProvider>
    );

    expect(screen.getByText(/Course Lab & Udemy Unblocker/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Video = 1 Code Snippet Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/10-Minute "1 Video = 1 Commit" Sprint/i)).toBeInTheDocument();
  });

  it('renders active course deck and AI cheat sheet generator', () => {
    render(
      <DashboardProvider>
        <CourseLabView />
      </DashboardProvider>
    );

    expect(screen.getAllByText(/FastAPI & Microservices Architecture with Python/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/AI Course Fast-Track & Cheat Sheet/i)).toBeInTheDocument();
    expect(screen.getByText(/3-Bullet Mental Model/i)).toBeInTheDocument();
  });
});
