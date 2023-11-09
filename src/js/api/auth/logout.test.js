// Assuming you have a file named `auth.js` with the logout function
import { logout } from './logout.js'; // Adjust the path to where your logout function is actually located.
import * as storage from '../../storage/index.js';

// Mock the remove function from the storage module
jest.mock('../../storage/index.js', () => ({
  remove: jest.fn(),
}));

describe('logout function', () => {
  it('should call remove with "token" and "profile"', () => {
    // Call the logout function
    logout();

    // Check that storage.remove was called first with 'token'
    expect(storage.remove).toHaveBeenNthCalledWith(1, 'token');

    // Check that storage.remove was called second with 'profile'
    expect(storage.remove).toHaveBeenNthCalledWith(2, 'profile');
  });
});
