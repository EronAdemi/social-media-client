import { login } from './login.js';
import { save as _save } from '../../storage/index';
import { apiPath as _apiPath } from '../constants.js';
import { headers as _headers } from '../headers.js';

// Mocking the modules
jest.mock('../../storage/index', () => ({
  save: jest.fn(),
}));

jest.mock('../constants', () => ({
  apiPath: 'http://localhost/api',
}));

jest.mock('../headers', () => ({
  headers: jest.fn().mockReturnValue({ 'Content-Type': 'application/json' }),
}));

describe('login', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should save profile and token when login is successful', async () => {
    // Setup
    const fakeResponse = {
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ accessToken: 'fakeToken', name: 'John Doe' }),
      statusText: 'OK',
    };
    global.fetch.mockResolvedValue(fakeResponse);

    // Execution
    const profile = await login('test@example.com', 'password');

    // Assertions
    expect(global.fetch).toHaveBeenCalledWith(
      `${_apiPath}/social/auth/login`,
      {
        method: 'post',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password',
        }),
        headers: _headers('application/json'),
      },
    );
    expect(_save).toHaveBeenCalledWith('token', 'fakeToken');
    expect(_save).toHaveBeenCalledWith('profile', { name: 'John Doe' });
    expect(profile).toEqual({ name: 'John Doe' });
  });

  it('should throw an error when login is unsuccessful', async () => {
    // Setup
    const fakeResponse = {
      ok: false,
      statusText: 'Unauthorized',
    };
    global.fetch.mockResolvedValue(fakeResponse);

    // Assertions
    await expect(login('test@example.com', 'password')).rejects.toThrow(
      'Unauthorized',
    );
  });
});
