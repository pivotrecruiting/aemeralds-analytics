# Testing im Projekt

Dieses Projekt verwendet zwei verschiedene Testing-Frameworks für unterschiedliche Testebenen:

1. **Jest**: Für Unit- und Komponententests
2. **Playwright**: Für End-to-End (E2E) Tests

## Verzeichnisstruktur

- **Unit- und Komponententests (Jest)**: Befinden sich in der Nähe der zu testenden Dateien oder in `__tests__`-Verzeichnissen
- **E2E-Tests (Playwright)**: Befinden sich im Verzeichnis `e2e-tests/`

## Jest-Tests ausführen

Jest-Tests sind für Unit-Tests und Komponententests gedacht. Sie testen einzelne Funktionen, Hooks und Komponenten isoliert.

```bash
# Alle Jest-Tests ausführen
npm test

# Jest-Tests im Watch-Modus ausführen (für die Entwicklung)
npm run test:watch

# Jest-Tests mit Coverage-Report ausführen
npm run test:coverage
```

## Playwright-Tests ausführen

Playwright-Tests sind für End-to-End-Tests gedacht. Sie testen die Anwendung aus der Perspektive eines Benutzers in einem echten Browser.

```bash
# Alle E2E-Tests ausführen
npm run test:e2e

# E2E-Tests im UI-Modus ausführen (für interaktives Debugging)
npm run test:e2e:ui

# E2E-Tests im Debug-Modus ausführen
npm run test:e2e:debug

# E2E-Tests mit minimaler Ausgabe ausführen (ohne Reports)
npm run test:e2e:minimal

# Alle Reports und Screenshots löschen
npm run test:e2e:clean

# Reports löschen und Tests im UI-Modus ausführen
npm run test:e2e:ui:clean
```

## Wichtige Hinweise

- **Getrennte Ausführung**: Jest- und Playwright-Tests müssen getrennt ausgeführt werden. Versuche nicht, Playwright-Tests mit Jest auszuführen oder umgekehrt.
- **Testdateien**: Jest-Tests enden typischerweise mit `.test.ts` oder `.test.tsx`, während Playwright-Tests mit `.spec.ts` enden.
- **Mocking**: In Jest-Tests können Abhängigkeiten gemockt werden. In Playwright-Tests wird die echte Anwendung getestet.

## Wann welches Framework verwenden?

### Jest verwenden für:

- Tests für einzelne Funktionen und Utilities
- Tests für React-Komponenten
- Tests für Hooks und State-Management
- Tests, die schnell ausgeführt werden sollen

### Playwright verwenden für:

- Tests für komplette Benutzerflüsse
- Tests für Browser-Kompatibilität
- Tests für responsive Layouts
- Tests, die die echte Anwendung in einem Browser testen sollen

## Weitere Ressourcen

- [Jest-Dokumentation](https://jestjs.io/docs/getting-started)
- [Playwright-Dokumentation](https://playwright.dev/docs/intro)
- [Testing Library-Dokumentation](https://testing-library.com/docs/) (für React-Komponententests)
