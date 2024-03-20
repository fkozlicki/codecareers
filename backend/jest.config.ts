import type { Config } from 'jest';

export default {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/**/*.test.ts'],
	transformIgnorePatterns: [
		'/node_modules/(?!@lucia-auth/adapter-drizzle).+\\.js$',
	],
	extensionsToTreatAsEsm: ['.ts'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { useESM: true }],
	},
	forceExit: true,
} satisfies Config;
