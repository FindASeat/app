import { validate_credentials } from '../firebase/firebase_api';

describe('validate_credentials() Tests', () => {
  test('Valid Credentials', async () => {
    const validUser = await validate_credentials('rohkal', 'password');
    expect(validUser?.username).toEqual('rohkal');
  });

  test('Invalid Credentials', async () => {
    const invalidUser = await validate_credentials('invalid_username', 'invalid_password');
    expect(invalidUser).toBeNull();
  });
});
