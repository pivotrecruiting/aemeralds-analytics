/**
 * @jest-environment jsdom
 */

// Import der Testing-Library-Erweiterungen
require("@testing-library/jest-dom");

// Mock für Next.js-Komponenten und -Funktionen
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock für Framer Motion
jest.mock("framer-motion", () => {
  // Verwende eine Funktion statt JSX
  const React = require("react");
  return {
    motion: {
      div: function MockMotionDiv(props) {
        const { children, ...rest } = props;
        return React.createElement("div", rest, children);
      },
      span: function MockMotionSpan(props) {
        const { children, ...rest } = props;
        return React.createElement("span", rest, children);
      },
    },
    AnimatePresence: function MockAnimatePresence(props) {
      return props.children;
    },
  };
});

// Globale Mocks für Fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  })
);

// Unterdrücke Konsolenausgaben während der Tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});
