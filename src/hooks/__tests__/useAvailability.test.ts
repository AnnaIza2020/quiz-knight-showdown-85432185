
import { renderHook, act } from '@testing-library/react-hooks';
import { useAvailability } from '../useAvailability';
import { supabase } from '@/lib/supabase';

// Mock supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnValue({ error: null }),
    })),
  },
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useAvailability hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with empty state', () => {
    const { result } = renderHook(() => useAvailability());
    
    expect(result.current.playerAvailability).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('should handle fetch availability', async () => {
    // Mock the supabase response
    const mockData = [
      { 
        player_id: 'player1', 
        date: '2025-05-19', 
        time_slots: { '16:00': 'available', '17:00': 'maybe' } 
      }
    ];
    
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ data: mockData, error: null })
    }));
    
    const { result, waitForNextUpdate } = renderHook(() => useAvailability());
    
    // Call the fetchAvailability function
    let promise;
    act(() => {
      promise = result.current.fetchAvailability();
    });
    
    // Wait for state updates
    await waitForNextUpdate();
    
    // Check the result
    const availabilityData = await promise;
    expect(availabilityData).toEqual([
      {
        playerId: 'player1',
        slots: [
          {
            playerId: 'player1',
            date: '2025-05-19',
            timeSlots: { '16:00': 'available', '17:00': 'maybe' }
          }
        ]
      }
    ]);
    
    expect(result.current.isLoading).toBe(false);
  });

  // Add more tests for updateAvailability, error handling, etc.
});
