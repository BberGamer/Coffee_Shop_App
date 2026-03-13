import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'moon_coffee_token';
const USER_KEY = 'moon_coffee_user';

export const storage = {
  async setAuth(token: string, user: string) {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, user]
    ]);
  },
  async clearAuth() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },
  async getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async getUser() {
    return AsyncStorage.getItem(USER_KEY);
  }
};
