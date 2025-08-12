/**
 * @jest-environment jsdom
 */

import { drawCards } from '../src/cardDrawer.js';

global.fetch = jest.fn();

describe('drawCards', () => {
  let container;

  beforeEach(() => {
    // Set up a container element
    container = document.createElement('div');
    container.classList.add('visible');
    document.body.appendChild(container);

    // Clear mocks
    fetch.mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('draws cards and displays them in the container', async () => {
    const mockData = [
      {
        name: 'The Fool',
        image_url: '/images/fool.jpg',
        meaning: 'New beginnings',
        reversed: false
      },
      {
        name: 'The Magician',
        image_url: '/images/magician.jpg',
        meaning: 'Manifestation',
        reversed: true
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    await drawCards(2, true, container);

    expect(fetch).toHaveBeenCalledWith('/draw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 2, allow_reversed: true })
    });

    expect(container.classList.contains('visible')).toBe(true);
    expect(container.querySelectorAll('.card').length).toBe(2);
    expect(container.innerHTML).toContain('The Fool');
    expect(container.innerHTML).toContain('The Magician (Reversed)');
  });

  it('shows an alert and logs an error on failure', async () => {
    console.error = jest.fn();
    window.alert = jest.fn();

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await drawCards(1, false, container);

    expect(console.error).toHaveBeenCalledWith('Failed to draw card(s):', expect.any(Error));
    expect(window.alert).toHaveBeenCalledWith('Failed to draw card(s).');
  });
});
