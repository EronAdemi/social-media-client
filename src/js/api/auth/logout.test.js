import { logout } from './logout.js'; 
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
