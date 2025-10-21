# GymCoding — mijn experimentele programmeertaal

GymCoding is een klein, experimenteel project waarin ik mijn eigen programmeertaal ontwerp en implementeer. Het doel is leren: taalkenmerken, lexing/parsing en het bouwen van een eenvoudige interpreter.

Let op: dit is een hobby-/leerproject. Veel onderdelen zijn nog in ontwikkeling.

## Wat is het doel?

- Oefenen met taalontwerp, lexers en parsers
- Een minimale interpreter schrijven in TypeScript
- Inzicht krijgen in runtime-waarden en scopebeheer

## Status

- Basis lexer & parser: in ontwikkeling
- Variabelen en basistypen: in ontwikkeling
- Lussen en conditionals: in ontwikkeling
- Functies: nog niet geïmplementeerd
- Foutafhandeling: nog niet geïmplementeerd

## Snelstart

1. Installeer dependencies:

```powershell
npm install
```

2. Run het project (sneltest met ts-node):

```powershell
npx ts-node index.ts
```

Opmerking: dit project gebruikt TypeScript als implementatietaal. Er zijn geen npm-scripts gedefinieerd in de repo, dus we gebruiken `npx ts-node` om direct de bron te starten.

## Projectstructuur

Belangrijke bestanden en mappen:

- `index.ts` — kleine entrypoint / runner
- `frontend/` — lexer, parser en AST-gerelateerde code (`lexer.ts`, `parser.ts`, `ast.ts`)
- `runtime/` — interpreter en runtime-structuren (`environment.ts`, `interpreter.ts`, `values.ts`)

Tip: open deze bestanden om te zien hoe tokens worden opgebouwd en hoe de interpreter waarden evalueert.
