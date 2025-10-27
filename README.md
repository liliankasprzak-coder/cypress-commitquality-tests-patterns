# CommitQuality UI Tests (Design Patterns)

> Testes E2E (UI) aplicando Design Patterns com Cypress

Autora: Lilian Kasprzak  
Função: Analista de QA  
Data: Outubro 2025

---

## Sobre o Projeto

Este repositório contém os testes de interface (UI) da aplicação CommitQuality, refatorados com padrões de projeto (Page Objects, Commands, Builders e Validadores). Os cenários estão documentados em Gherkin (.txt) e as specs utilizam a estrutura de patterns para melhor manutenção e reuso.

### Objetivos
- Demonstrar aplicação de Design Patterns em testes UI
- Manter cenários claros (Gherkin) e código modular
- Facilitar execução local e em CI

---

## Estrutura do Projeto

```
cypress-commitquality-tests-patterns/
├── cypress/
│   ├── e2e/
│   │   ├── exercicio2_commitquality_cenarios-patterns/   # Cenários Gherkin (.txt)
│   │   └── exercicio2_commitquality_tests-patterns/      # Testes UI com patterns (.cy.js)
│   ├── fixtures/
│   │   ├── data-testids.json                            # Data-testids da aplicação
│   │   └── test-file.pdf                                # Arquivo de teste (upload/download)
│   └── support/
│       ├── builders/                                     # Test Data Builders
│       ├── commands/                                     # Comandos customizados
│       ├── config/                                       # Config utilitária
│       ├── observers/                                    # Observers (ex.: intercepts)
│       ├── pages/                                        # Page Objects
│       ├── validators/                                   # Validadores/assertions
│       └── e2e.js                                        # Setup global
├── cypress.config.js
├── package.json
└── README.md
```

---

## Instalação

Pré-requisitos: Node.js 18+ e npm.

```bash
# 1. Clone
git clone <url-do-repo>
cd cypress-commitquality-tests-patterns

# 2. Instale
yarn install || npm install
```

---

## Execução

Modo interativo (UI):
```bash
npm run cypress:open
```

Headless (CLI):
```bash
npm run test:patterns
```

---

## Licença

Uso educacional e demonstração de automação de testes.
