import { render, screen } from '@testing-library/react';
import App from './App';
import {getIndex, createGroups} from './components/Utils/Utils.js';


// Testing of web objects

// test('renders welcome message', () => {
//   render(<App />);
//   expect(screen.getByText('Start drawing')).toBeInTheDocument();
// });

test('renders drawing button', () => {
  render(<App />);
  expect(screen.getByText('Start drawing')).toBeInTheDocument();
});


// Testing of functions

test('getting index', () => {
  expect(getIndex([1, 2, 3, 4, 5])).toEqual(4);
  expect(getIndex([100, 34, 563, 31, 73])).toEqual(2);
});

test('creating groups', () => {
  expect(createGroups([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)).toEqual([[1,2,3], [4,5,6], [7,8,9]]);
});

// Testing of hyperlinks

test('github profile link', () => {
  render(<App />);
  const linkElement = screen.getByText('Bryan Lusse');
  expect(linkElement).toBeInTheDocument();
});

test('github profile link working', () => {
  render(<App />);
  const linkElement = screen.getByText('Bryan Lusse');
  expect(linkElement).toHaveAttribute('href', 'https://github.com/bryanlusse');
});