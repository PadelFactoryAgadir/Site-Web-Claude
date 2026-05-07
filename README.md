# Padel Factory — Site Web

Site web officiel de **Padel Factory Agadir** et **Padel Factory Universiapolis**.

## Ce que contient ce projet

- Site bilingue français / anglais (routes `/fr/...` et `/en/...`)
- Design "premium dark" aux couleurs Padel Factory
- 8 pages : Accueil, Agadir, Universiapolis, Tarifs, Coaching, Tournois, À propos, Contact
- Système de réservation avec connexion à l'API ERP (à venir, semaine 3)
- Génération automatique de message WhatsApp pour confirmer la réservation

## Charte de marque

| Élément | Valeur |
|---------|--------|
| Bleu électrique | `#0001ff` (action principale + Agadir) |
| Vert | `#05DF72` (Universiapolis uniquement) |
| Lime | `#cdd550` (accent ponctuel) |
| Gris foncé | `#414042` (cartes / blocs) |
| Police | Montserrat (Google Fonts, gratuite) |

## Stack technique

- **Next.js 15** (framework React, App Router)
- **TypeScript** (sécurité du code)
- **Tailwind CSS** (styling)
- **next-intl** (bilingue)
- **Vercel** (hébergement gratuit)

## Pour lancer le site en local (optionnel)

Si Node.js est installé sur ton PC :

```bash
npm install
npm run dev
```

Puis ouvre http://localhost:3000 dans ton navigateur.

## Mise en ligne

Le site est déployé automatiquement sur Vercel à chaque push sur GitHub.
URL de production : https://padelfactoryagadir.com (à connecter)

## Domaine

Domaine : `padelfactoryagadir.com` — hébergé chez Namecheap.
Pour le brancher à Vercel, modifier les DNS chez Namecheap (étape de déploiement final).
