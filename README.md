# Green Queen of the Night - Roblox Market Tracker

Un tracker de marché en temps réel pour l'item Roblox "Green Queen of the Night" (GQOTN), similaire à Rollimons, avec analyses détaillées, graphiques de prix, et prédictions basées sur l'historique.

## Fonctionnalités

- **Vue d'ensemble des prix**: RAP (Recent Average Price), prix actuel, variations 24h/7j/30j
- **Graphiques interactifs**: Historique des prix avec moyennes mobiles, zoom et filtres de période
- **Statistiques du marché**: Volume de ventes, demande, volatilité, tendances
- **Prédictions de prix**: Algorithmes de prédiction (régression linéaire, EMA, moyenne mobile)
- **Historique des ventes**: Liste détaillée des ventes récentes avec variations
- **Auto-refresh**: Mise à jour automatique toutes les 60 secondes
- **Cache intelligent**: Réduction des appels API avec localStorage
- **Export CSV**: Exportation des données de ventes
- **Design responsive**: Fonctionne sur mobile, tablette et desktop

## Installation

```bash
# Cloner le repo
git clone https://github.com/votre-username/tracker-gqotn.git
cd tracker-gqotn

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Configuration

### 1. Trouver l'Asset ID de Green Queen of the Night

1. Allez sur [Rolimons.com](https://www.rolimons.com) ou le catalogue Roblox
2. Cherchez "Green Queen of the Night"
3. Notez l'Asset ID (numéro unique de l'item)

### 2. Mettre à jour la configuration

Éditez [src/constants/itemConfig.js](src/constants/itemConfig.js) et remplacez l'Asset ID:

```javascript
export const ITEM_CONFIG = {
  assetId: 'VOTRE_ASSET_ID_ICI', // Remplacer par le bon ID
  // ...
};
```

## Déploiement sur GitHub Pages

### Étape 1: Activer GitHub Pages

1. Allez dans Settings > Pages de votre repo GitHub
2. Dans "Source", sélectionnez "GitHub Actions"

### Étape 2: Push vers GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Le déploiement se fera automatiquement via GitHub Actions.

### Étape 3: Accéder à votre site

Votre site sera disponible à: `https://votre-username.github.io/tracker-gqotn/`

## Structure du projet

```
tracker-gqotn/
├── src/
│   ├── components/         # Composants React
│   │   ├── Charts/        # Graphiques (Prix, Prédictions)
│   │   ├── ItemHeader.jsx # En-tête avec infos de l'item
│   │   ├── PriceOverview.jsx # Vue d'ensemble des prix
│   │   ├── MarketStats.jsx   # Statistiques du marché
│   │   └── RecentSales.jsx   # Liste des ventes
│   ├── services/          # Services API et logique métier
│   │   ├── robloxApi.js   # Appels API Rolimons/Roblox
│   │   ├── cacheService.js # Gestion du cache
│   │   └── analyticsService.js # Calculs statistiques
│   ├── utils/             # Utilitaires
│   │   ├── formatters.js  # Formatage des données
│   │   ├── dateHelpers.js # Helpers de dates
│   │   └── pricePredictor.js # Algorithmes de prédiction
│   ├── hooks/             # React hooks personnalisés
│   │   └── useItemData.js # Hook pour données de marché
│   ├── constants/         # Constantes
│   │   └── itemConfig.js  # Configuration de l'item
│   └── App.jsx            # Composant principal
├── .github/workflows/     # CI/CD
│   └── deploy.yml         # Déploiement GitHub Pages
└── public/                # Assets statiques
```

## Technologies utilisées

- **React 18** - Framework UI
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Styling
- **Recharts** - Graphiques et visualisations
- **Lucide React** - Icônes
- **date-fns** - Manipulation de dates
- **Axios** - Requêtes HTTP

## APIs utilisées

- **Rolimons API**: Données de marché pré-agrégées (RAP, demand, trend)
- **Roblox Economy API** (optionnel): Historique détaillé des prix
- **Roblox Catalog API** (optionnel): Informations sur l'item

## Développement

```bash
# Lancer en mode développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview

# Lint
npm run lint
```

## Fonctionnalités futures

- [ ] Mode sombre
- [ ] Support multi-items
- [ ] Notifications push pour alertes de prix
- [ ] Authentification pour sauvegarder les préférences
- [ ] Comparaison avec d'autres items Limited
- [ ] Indicateurs techniques avancés (MACD, Fibonacci)
- [ ] Portfolio tracker
- [ ] Calculateur de profit

## Notes importantes

- Les données Roblox API peuvent avoir des limitations de rate limit
- L'application utilise des données mockées si l'API n'est pas disponible
- Les prédictions de prix sont basées sur des algorithmes statistiques et ne constituent pas un conseil financier
- Non affilié avec Roblox Corporation

## Licence

MIT

## Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

---

Créé avec Claude Code 💜
