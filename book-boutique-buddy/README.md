# Book Boutique Buddy - Projet E-commerce avec Supabase

Ce projet est une réplique pixel-parfaite du site Book Boutique Buddy, enrichie avec une intégration backend complète via Supabase pour l'authentification utilisateur, la gestion des profils, des commandes, des adresses et des préférences.

## Table des matières

1.  [Fonctionnalités](#fonctionnalités)
2.  [Technologies Utilisées](#technologies-utilisées)
3.  [Installation et Lancement du Projet](#installation-et-lancement-du-projet)
4.  [Configuration Supabase (Étapes Manuelles)](#configuration-supabase-étapes-manuelles)
    - [Création du Projet Supabase](#création-du-projet-supabase)
    - [Configuration de la Base de Données (Schéma SQL)](#configuration-de-la-base-de-données-schéma-sql)
    - [Configuration de l'Authentification](#configuration-de-lauthentification)
    - [Configuration des Variables d'Environnement](#configuration-des-variables-denvironnement)
5.  [Structure du Projet](#structure-du-projet)
6.  [Prochaines Étapes](#prochaines-étapes)

## 1. Fonctionnalités

Ce projet implémente les phases 1 à 5 du plan initial, offrant les fonctionnalités suivantes :

-   **Site E-commerce fonctionnel** avec un système de panier (Zustand).
-   **Page produit détaillée** avec galerie d'images.
-   **Système de navigation et header responsive**.
-   **Pages légales** (CGV, Confidentialité).
-   **Page de contact** avec formulaire.
-   **Design système complet** avec Tailwind CSS et composants UI.
-   **Gestion d'état du panier persistant**.
-   **Authentification utilisateur complète** (inscription, connexion, déconnexion, réinitialisation de mot de passe) via Supabase.
-   **Gestion des profils utilisateurs** (informations personnelles, historique des commandes, gestion des adresses, préférences).
-   **Sécurité des données** avec Row Level Security (RLS) configuré dans Supabase.

## 2. Technologies Utilisées

-   **Frontend** : React 19, React Router DOM, Tailwind CSS, Shadcn/UI, Zustand
-   **Backend** : Supabase (PostgreSQL, Supabase Auth)
-   **Langage** : JavaScript (ES6+)
-   **Gestionnaire de paquets** : pnpm

## 3. Installation et Lancement du Projet

Suivez ces étapes pour installer et lancer le projet en local :

1.  **Cloner le dépôt ou décompresser l'archive** :
    ```bash
    # Si vous avez un dépôt Git
    git clone <URL_DU_DEPOT>
    cd book-boutique-buddy
    
    # Si vous avez décompressé l'archive
    cd book-boutique-buddy
    ```

2.  **Installer les dépendances** :
    ```bash
    pnpm install
    ```

3.  **Créer le fichier d'environnement** :
    Créez un fichier nommé `.env.local` à la racine du projet et ajoutez-y vos clés Supabase (voir la section [Configuration Supabase](#configuration-supabase-étapes-manuelles) ci-dessous) :
    ```env
    VITE_SUPABASE_URL=votre_url_projet_supabase
    VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
    ```

4.  **Lancer le serveur de développement** :
    ```bash
    pnpm run dev
    ```

5.  **Ouvrir l'application** :
    L'application sera accessible à l'adresse `http://localhost:5173` dans votre navigateur.

## 4. Configuration Supabase (Étapes Manuelles)

Pour que l'application fonctionne correctement, vous devez configurer votre projet Supabase. Ces étapes doivent être effectuées manuellement sur le site de Supabase.

### Création du Projet Supabase

1.  Allez sur [Supabase](https://supabase.com/) et connectez-vous ou créez un compte.
2.  Cliquez sur `New Project`.
3.  Renseignez les informations :
    -   **Name** : `book-boutique-buddy` (ou le nom de votre choix)
    -   **Database Password** : Créez un mot de passe sécurisé et notez-le.
    -   **Region** : Choisissez la région la plus proche de vos utilisateurs.
4.  Cliquez sur `Create new project` et attendez que le projet soit provisionné.

### Configuration de la Base de Données (Schéma SQL)

Une fois votre projet Supabase créé, vous devez y importer le schéma de base de données :

1.  Dans le tableau de bord Supabase, naviguez vers `SQL Editor` (l'icône `>`).
2.  Cliquez sur `New query`.
3.  **Copiez l'intégralité du contenu du fichier `supabase_schema.sql`** (fourni dans ce projet) et collez-le dans l'éditeur SQL.
4.  Cliquez sur `RUN` pour exécuter le script. Cela créera toutes les tables (`users`, `products`, `orders`, `order_items`, `categories`, `inventory`, `user_preferences`, `user_addresses`), les relations, les triggers et les politiques de Row Level Security (RLS).
5.  Vérifiez que toutes les tables ont été créées dans la section `Database > Tables`.

### Configuration de l'Authentification

1.  Dans le tableau de bord Supabase, naviguez vers `Authentication > Settings`.
2.  **Providers d'authentification** :
    -   Assurez-vous que `Email` est activé (par défaut).
    -   Vous pouvez activer d'autres providers comme `Google`, `GitHub`, etc., si vous le souhaitez (nécessite une configuration supplémentaire pour chaque provider).
3.  **Paramètres de sécurité** :
    -   `Enable email confirmations` : **Activez cette option** pour que les utilisateurs confirment leur adresse e-mail après l'inscription.
    -   `Minimum password length` : Définissez à `6` ou plus.
4.  **URLs de redirection** :
    -   `Site URL` : Ajoutez l'URL de votre application en développement (`http://localhost:5173`).
    -   `Redirect URLs` : Ajoutez l'URL de rappel pour l'authentification (`http://localhost:5173/auth/callback`).
5.  **Email Templates** :
    -   Dans `Authentication > Email Templates`, vous pouvez personnaliser les e-mails de confirmation, de réinitialisation de mot de passe, etc.

### Configuration des Variables d'Environnement

1.  Dans le tableau de bord Supabase, naviguez vers `Settings > API`.
2.  Copiez votre **Project URL** (ressemble à `https://abcdefghijk.supabase.co`).
3.  Copiez votre **Anon Key (public)**.
4.  Collez ces valeurs dans le fichier `.env.local` de votre projet React :
    ```env
    VITE_SUPABASE_URL=votre_url_projet_supabase
    VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
    ```

## 5. Structure du Projet

```
book-boutique-buddy/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AddressManager.jsx
│   │   ├── BookCover.jsx
│   │   ├── Header.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── ProfileForm.jsx
│   │   └── UserPreferences.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/
│   │   ├── useAddresses.js
│   │   ├── useOrders.js
│   │   └── useUser.js
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── CartPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── utils/
│   │   └── formatters.js
│   ├── App.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local
├── package.json
├── pnpm-lock.yaml
├── README.md
└── supabase_schema.sql
```

## 6. Prochaines Étapes

Une fois les étapes de configuration Supabase terminées, vous aurez une application e-commerce fonctionnelle avec authentification et gestion des profils. Les prochaines phases du plan d'implémentation incluent :

-   **Phase 3 : Espace Administrateur** : Création d'un tableau de bord pour la gestion des produits, commandes et utilisateurs.
-   **Phase 4 : Finalisation E-commerce** : Intégration d'un système de paiement (ex: Stripe), calcul des frais de port, emails automatiques.
-   **Phase 5 : Améliorations UX** : Recherche avancée, recommandations, wishlist, avis clients, optimisations SEO et performance.

N'hésitez pas à me solliciter si vous avez des questions ou si vous souhaitez de l'aide pour les prochaines phases de développement. Bon codage !

