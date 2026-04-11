# Build IAgence

## Commandes

```bash
# Installer les dépendances
npm install

# Build production (minification)
npm run build

# Watching pour le développement
npm run watch
```

## Fichiers générés

| Fichier source | Fichier minifié | Gain |
|---------------|----------------|------|
| assets/css/style.css | assets/css/style.min.css | ~22% (36KB → 28KB) |
| assets/js/main.js | assets/js/main.min.js | ~42% (11KB → 6.4KB) |

## Architecture

- **Source** : `style.css`, `main.js` — Versions lisibles pour le développement
- **Production** : `style.min.css`, `main.min.js` — Versions minifiées déployées

## Déploiement

1. Exécuter `npm run build`
2. Les fichiers `.min.*` sont générés automatiquement
3. Les balises HTML pointent vers les versions minifiées

## Outils

- **esbuild** : Minification JS et CSS