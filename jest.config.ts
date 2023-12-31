import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(firebase|@firebase|.*(?:expo|react|native).*|((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)/)',
  ],
};

export default config;
