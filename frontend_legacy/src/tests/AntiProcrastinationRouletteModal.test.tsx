import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AntiProcrastinationRouletteModal } from '../components/modals/AntiProcrastinationRouletteModal';
import { DashboardProvider } from '../context/DashboardContext';

describe('AntiProcrastinationRouletteModal Component', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <DashboardProvider>
        <AntiProcrastinationRouletteModal />
      </DashboardProvider>
    );

    expect(container.firstChild).toBeNull();
  });
});
