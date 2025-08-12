/**
 * @jest-environment jsdom
 */
import { setupEventListeners } from '../src/eventListeners.js';
import { drawCards } from '../src/cardDrawer.js';
import { loadCards, loadMinorArcana } from '../src/cardLoader.js';

// Mock the modules that are imported
jest.mock('../src/cardLoader.js', () => ({
  loadCards: jest.fn(),
  loadMinorArcana: jest.fn()
}));

jest.mock('../src/cardDrawer.js', () => ({
  drawCards: jest.fn()
}));

function setupDOM() {
  document.body.innerHTML = `
    <select id="suit-filter"><option value="Cups">Cups</option></select>
    <select id="type-filter"><option value="Minor Arcana">Minor Arcana</option></select>
    <div id="all-cards"></div>
    <div id="minor-cards"></div>
    <button id="draw-btn"></button>
    <input type="checkbox" id="allow-reversed" />
    <div id="drawn-card" class="visible"></div>
    <form id="draw-form">
      <input id="count" value="3" />
      <button type="submit">Draw</button>
    </form>
    <div id="results"></div>
  `;
}

beforeEach(() => {
  setupDOM();
  jest.clearAllMocks();
  setupEventListeners();
});

test('calls loadMinorArcana on suit filter change for Minor Arcana page', () => {
  const suitFilter = document.getElementById('suit-filter');
  suitFilter.dispatchEvent(new Event('change'));
  expect(loadMinorArcana).toHaveBeenCalled();
});

test('calls loadCards when type filter is changed', () => {
  const typeFilter = document.getElementById('type-filter');
  typeFilter.value = 'Minor Arcana';
  typeFilter.dispatchEvent(new Event('change'));
  expect(loadCards).toHaveBeenCalled();
});

test('calls loadCards when suit filter changes (on all-cards page)', () => {
  const suitFilter = document.getElementById('suit-filter');
  suitFilter.dispatchEvent(new Event('change'));
  expect(loadCards).toHaveBeenCalled();
});

test('calls drawCards with 1 card on draw button click', () => {
  const drawBtn = document.getElementById('draw-btn');
  const checkbox = document.getElementById('allow-reversed');
  checkbox.checked = true;

  drawBtn.click();

  expect(drawCards).toHaveBeenCalledWith(1, true, expect.any(HTMLElement));
});

test('calls drawCards with count and reversed on form submit', () => {
  const form = document.getElementById('draw-form');
  const countInput = document.getElementById('count');
  countInput.value = "3";
  const checkbox = document.getElementById('allow-reversed');
  checkbox.checked = false;

  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(drawCards).toHaveBeenCalledWith(3, false, expect.any(HTMLElement));
});
