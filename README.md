# Book Boutique Buddy - Réplique

Ce projet est une réplique pixel-parfaite du site web Book Boutique Buddy, créée avec React et Tailwind CSS.

## Fonctionnalités

- **Page produit** : Affichage détaillé du livre "Les Murmures du Temps" avec galerie d'images, sélecteur de quantité et bouton d'ajout au panier
- **Système de panier** : Gestion complète du panier avec ajout, suppression et modification des quantités
- **Page contact** : Formulaire de contact avec validation et informations de contact
- **Design responsive** : Compatible desktop et mobile
- **Couvertures de livre personnalisées** : Composant BookCover avec design décoratif

## Technologies utilisées

- React 19
- Tailwind CSS
- Shadcn/UI
- Lucide React (icônes)
- React Router DOM
- Vite (bundler)

## Installation et lancement

1. Extraire l'archive
2. Installer les dépendances :
   ```bash
   cd book-boutique-buddy
   pnpm install
   ```
3. Lancer le serveur de développement :
   ```bash
   pnpm run dev
   ```
4. Ouvrir http://localhost:5173 dans votre navigateur

## Structure du projet

```
book-boutique-buddy/
├── src/
│   ├── components/
│   │   ├── ui/           # Composants UI de Shadcn
│   │   ├── Header.jsx    # En-tête avec navigation
│   │   └── BookCover.jsx # Composant couverture de livre
│   ├── pages/
│   │   ├── ProductPage.jsx # Page produit
│   │   ├── ContactPage.jsx # Page contact
│   │   └── CartPage.jsx    # Page panier
│   ├── context/
│   │   └── CartContext.jsx # Gestion d'état du panier
│   ├── App.jsx           # Composant principal avec routage
│   └── App.css           # Styles personnalisés
├── public/               # Fichiers statiques
└── package.json          # Dépendances et scripts
```

## Pages disponibles

- `/` ou `/produit` - Page produit principal
- `/contact` - Page de contact
- `/panier` - Page du panier

## Fonctionnalités du panier

- Ajout de produits avec quantité personnalisée
- Modification des quantités dans le panier
- Suppression d'articles
- Calcul automatique du total
- Persistance de l'état du panier

## Design

Le design reproduit fidèlement l'original avec :
- Palette de couleurs violette et rose
- Couvertures de livre décoratives avec motifs floraux
- Interface utilisateur moderne et épurée
- Animations et transitions fluides

## Notes de développement

Ce projet a été créé comme une réplique exacte du site original, en reproduisant :
- La structure de navigation
- Le design des pages
- Les fonctionnalités interactives
- L'expérience utilisateur

Toutes les fonctionnalités de base d'un site e-commerce sont implémentées côté frontend, prêtes pour une intégration backend future.

