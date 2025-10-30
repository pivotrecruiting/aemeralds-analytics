# Testing in the Project

This project uses two different testing frameworks for different test levels:

1. **Jest**: For unit and component tests
2. **Playwright**: For End-to-End (E2E) tests

## Directory Structure

- **Unit and Component Tests (Jest)**: Located near the files being tested or in `__tests__` directories
- **E2E Tests (Playwright)**: Located in the `e2e-tests/` directory

## Running Jest Tests

Jest tests are intended for unit tests and component tests. They test individual functions, hooks, and components in isolation.

```bash
# Run all Jest tests
npm test

# Run Jest tests in watch mode (for development)
npm run test:watch

# Run Jest tests with coverage report
npm run test:coverage
```

## Running Playwright Tests

Playwright tests are intended for End-to-End tests. They test the application from a user's perspective in a real browser.

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode (for interactive debugging)
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run E2E tests with minimal output (without reports)
npm run test:e2e:minimal

# Delete all reports and screenshots
npm run test:e2e:clean

# Delete reports and run tests in UI mode
npm run test:e2e:ui:clean
```

## Important Notes

- **Separate Execution**: Jest and Playwright tests must be run separately. Don't try to run Playwright tests with Jest or vice versa.
- **Test Files**: Jest tests typically end with `.test.ts` or `.test.tsx`, while Playwright tests end with `.spec.ts`.
- **Mocking**: In Jest tests, dependencies can be mocked. In Playwright tests, the real application is tested.

## When to Use Which Framework?

### Use Jest for:

- Tests for individual functions and utilities
- Tests for React components
- Tests for hooks and state management
- Tests that should run quickly

### Use Playwright for:

- Tests for complete user flows
- Tests for browser compatibility
- Tests for responsive layouts
- Tests that should test the real application in a browser

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library Documentation](https://testing-library.com/docs/) (for React component tests)
