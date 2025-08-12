/**
 * @jest-environment jsdom
 */

import '../src/main.js';
import { setupEventListeners } from '../src/eventListeners.js';
import { loadMajorArcana, loadMinorArcana } from '../src/cardLoader.js';

// Mock the dependencies
jest.mock('../src/eventListeners.js', () => ({
  setupEventListeners: jest.fn()
}));

jest.mock('../src/cardLoader.js', () => ({
  loadCards: jest.fn(),
  loadMajorArcana: jest.fn(),
  loadMinorArcana: jest.fn()
}));

function fireDOMContentLoaded() {
  document.dispatchEvent(new Event('DOMContentLoaded'));
}

afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});

test('calls setupEventListeners on DOMContentLoaded', () => {
  fireDOMContentLoaded();
  expect(setupEventListeners).toHaveBeenCalled();
});

test('calls loadMinorArcana if minor-cards element is present', () => {
  document.body.innerHTML = '<div id="minor-cards"></div>';
  fireDOMContentLoaded();
  expect(loadMinorArcana).toHaveBeenCalled();
});

test('calls loadMajorArcana if page contains "Major Arcana" in h1', () => {
  document.body.innerHTML = '<h1>Major Arcana</h1>';
  fireDOMContentLoaded();
  expect(loadMajorArcana).toHaveBeenCalled();
});

test('does not call any loader if conditions are not met', () => {
  document.body.innerHTML = '<h1>Welcome</h1>';
  fireDOMContentLoaded();
  expect(loadMajorArcana).not.toHaveBeenCalled();
  expect(loadMinorArcana).not.toHaveBeenCalled();
});
