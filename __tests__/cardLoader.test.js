/**
 * @jest-environment jsdom
*/

import { loadCards, loadMajorArcana, loadMinorArcana } from '../src/cardLoader.js';

global.fetch = jest.fn();

describe('cardLoader.js', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    fetch.mockClear();
  });

  describe('loadCards', () => {
    it('fetches and renders cards with filters', async () => {
      document.body.innerHTML = `
        <select id="type-filter">
          <option value="Major Arcana" selected></option>
        </select>
        <select id="suit-filter">
        <option value="Cups" selected></option>
        </select>
        <div id="cards-container"></div>
      `;

      const mockData = [
        { name: 'Ace of Cups', suit: 'Cups', arcana: 'Minor Arcana', image_url: '/img/ace.jpg' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      await loadCards({
        cardsContainer: document.querySelector('#cards-container'),
        typeFilter: document.querySelector('#type-filter'),
        suitFilter: document.querySelector('#suit-filter')
});

      expect(fetch).toHaveBeenCalledWith('/cards?arcana=Major%20Arcana&suit=Cups');
      expect(document.querySelector('.card')).toBeTruthy();
      expect(document.body.innerHTML).toContain('Ace of Cups');
    });
  });

  describe('loadMajorArcana', () => {
    it('fetches and renders Major Arcana cards', async () => {
      document.body.innerHTML = '<div id="major-cards"></div>';

      const mockData = [
        { name: 'The Fool', image_url: '/img/fool.jpg', upright_meaning: 'New beginnings' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      await loadMajorArcana();

      expect(fetch).toHaveBeenCalledWith('/cards?arcana=Major%20Arcana');
      expect(document.querySelector('.card')).toBeTruthy();
      expect(document.body.innerHTML).toContain('The Fool');
    });
  });

  describe('loadMinorArcana', () => {
    it('fetches and renders Minor Arcana cards with suit filter', async () => {
      document.body.innerHTML = `
        <select id="suit-filter"><option value="Swords" selected></option></select>
        <div id="minor-cards"></div>
      `;

      const mockData = [
        { name: 'Two of Swords', suit: 'Swords', upright_meaning: 'Tension', image_url: '/img/2swords.jpg' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      await loadMinorArcana();

      expect(fetch).toHaveBeenCalledWith('/cards?arcana=Minor%20Arcana&suit=Swords');
      expect(document.querySelector('.card')).toBeTruthy();
      expect(document.body.innerHTML).toContain('Two of Swords');
    });
  });
});