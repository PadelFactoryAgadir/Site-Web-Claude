# Spécification API — Padel Factory

> Document destiné au développeur de l'ERP Padel Factory.
> À fournir : un service HTTP renvoyant les disponibilités des terrains
> sur les 15 jours à venir, pour chaque club.

---

## 1. Vue d'ensemble

Le site web `padelfactoryagadir.com` doit afficher en temps réel quels créneaux et terrains sont disponibles, pour permettre aux clients de générer un message WhatsApp pré-rempli envoyé au club.

### Flux global

```
[Site Web Next.js]
       │
       │ 1. Charge la page de réservation
       ▼
[GET /availability/{club}]
       │
       │ 2. ERP renvoie les dispos sur 15 jours
       ▼
[Site affiche calendrier + créneaux + terrains]
       │
       │ 3. Utilisateur fait son choix
       │ 4. Clique "Envoyer au club"
       ▼
[WhatsApp s'ouvre avec message pré-rempli]
       │
       │ 5. Club reçoit le message
       │ 6. Club confirme → ENREGISTRE dans l'ERP
       │
       ▼
[Au prochain appel API, le créneau apparaît "pris"]
```

### Points clés

- L'API est **read-only** côté site (le site ne POST jamais).
- La réservation effective se fait **manuellement** par le club après réception WhatsApp.
- L'ERP est la **source de vérité unique**.
- Pas de transactions, pas de webhooks, pas de complexité.

---

## 2. Contraintes métier

| Contrainte | Valeur |
|---|---|
| Fenêtre de réservation maximale | **15 jours** à partir d'aujourd'hui |
| Nombre de terrains à Padel Factory Agadir | **4** (numérotés 1 à 4) |
| Nombre de terrains à Padel Factory Universiapolis | **3** (numérotés 1 à 3) |
| Durée d'un créneau | **1h30** |
| Heures d'ouverture | 9h30 → 23h00, tous les jours |
| Devise des prix | **MAD** (Dirham marocain) |

### Créneaux quotidiens (9 par jour)

| # | Début | Fin | Type semaine (Lun-Ven) | Type WE/férié |
|---|------|-----|------------------------|---------------|
| 1 | 09:30 | 11:00 | Heures creuses | Heures pleines |
| 2 | 11:00 | 12:30 | Heures creuses | Heures pleines |
| 3 | 12:30 | 14:00 | Heures creuses | Heures pleines |
| 4 | 14:00 | 15:30 | Heures creuses | Heures pleines |
| 5 | 15:30 | 17:00 | Heures creuses | Heures pleines |
| 6 | 17:00 | 18:30 | Heures pleines | Heures pleines |
| 7 | 18:30 | 20:00 | Heures pleines | Heures pleines |
| 8 | 20:00 | 21:30 | Heures pleines | Heures pleines |
| 9 | 21:30 | 23:00 | Heures pleines | Heures pleines |

### Tarifs par terrain (1h30, terrain entier pour 4 joueurs max)

- Heures creuses : **300 DHS**
- Heures pleines : **400 DHS**

Ces tarifs peuvent être renvoyés par l'API (forward-compatible) OU déduits du `kind` du créneau côté site.

### Jours fériés marocains

L'API doit reconnaître les jours fériés marocains pour activer la règle "toute la journée en heures pleines".

Liste à maintenir côté ERP (modifiable par l'admin si possible) :

```
01/01 — Jour de l'an
11/01 — Manifeste de l'indépendance
01/05 — Fête du travail
30/07 — Fête du Trône
14/08 — Journée Oued Ed-Dahab
20/08 — Révolution du Roi et du Peuple
21/08 — Fête de la Jeunesse
06/11 — Marche Verte
18/11 — Fête de l'Indépendance
+ fêtes religieuses islamiques (Aïd el-Fitr, Aïd al-Adha, Aïd al-Mawlid, Hijra)
```

Les fêtes religieuses sont à dates variables selon le calendrier hégirien — à mettre à jour annuellement.

---

## 3. Endpoint principal

### `GET /availability/{clubSlug}`

Renvoie l'intégralité des disponibilités sur 15 jours à partir d'aujourd'hui pour un club donné.

#### Paramètres

| Paramètre | Position | Type | Valeurs possibles | Obligatoire |
|---|---|---|---|---|
| `clubSlug` | URL path | string | `agadir`, `universiapolis` | Oui |

#### En-têtes de requête

```
Accept: application/json
```

#### Réponse en cas de succès — `200 OK`

##### Format

```json
{
  "club": "agadir",
  "totalCourts": 4,
  "windowDays": 15,
  "currency": "MAD",
  "days": [
    {
      "date": "2026-05-08",
      "dayOfWeek": "vendredi",
      "isPeakDay": false,
      "isHoliday": false,
      "isClosed": false,
      "slots": [
        {
          "start": "09:30",
          "end": "11:00",
          "kind": "off-peak",
          "pricePerCourt": 300,
          "courts": [
            { "number": 1, "available": true },
            { "number": 2, "available": false, "reason": "booked" },
            { "number": 3, "available": true },
            { "number": 4, "available": true }
          ]
        }
      ]
    }
  ],
  "generatedAt": "2026-05-08T10:30:00Z"
}
```

##### Description des champs

| Champ | Type | Description |
|---|---|---|
| `club` | string | Slug du club. `"agadir"` ou `"universiapolis"`. |
| `totalCourts` | integer | Nombre total de terrains. `4` pour Agadir, `3` pour Universiapolis. |
| `windowDays` | integer | Toujours `15`. Permet au site de s'adapter si la valeur change. |
| `currency` | string | Toujours `"MAD"`. |
| `days` | array | Liste de 15 objets `Day`, **dans l'ordre chronologique**, en commençant par aujourd'hui. |
| `generatedAt` | string ISO 8601 | Timestamp de génération côté serveur. Utile pour le débogage. |

##### Objet `Day`

| Champ | Type | Description |
|---|---|---|
| `date` | string | Format `YYYY-MM-DD`. |
| `dayOfWeek` | string | Jour de la semaine en français minuscules (`lundi`, `mardi`, ..., `dimanche`). |
| `isPeakDay` | boolean | `true` si week-end OU jour férié (tous les créneaux deviennent "peak"). |
| `isHoliday` | boolean | `true` si jour férié marocain. |
| `isClosed` | boolean | `true` si le club est complètement fermé ce jour-là (ex : maintenance). Si `true`, `slots` peut être un tableau vide. |
| `slots` | array | Liste des 9 objets `Slot`, dans l'ordre chronologique. |

##### Objet `Slot`

| Champ | Type | Description |
|---|---|---|
| `start` | string | Heure de début, format 24h `HH:MM`. |
| `end` | string | Heure de fin, format 24h `HH:MM`. |
| `kind` | string | `"off-peak"` (heures creuses) ou `"peak"` (heures pleines). Sur un `isPeakDay`, **tous** les slots ont `kind = "peak"`. |
| `pricePerCourt` | integer | Prix en MAD pour le terrain entier sur ce créneau. |
| `courts` | array | Liste de `totalCourts` objets `Court`, dans l'ordre des numéros. |

##### Objet `Court`

| Champ | Type | Description |
|---|---|---|
| `number` | integer | Numéro du terrain (1 à `totalCourts`). |
| `available` | boolean | `true` si libre, `false` si déjà réservé. |
| `reason` | string (optionnel) | Si `available: false`, raison : `"booked"`, `"maintenance"`, `"private_event"`, etc. |

#### Réponses en cas d'erreur

| Code | Cas | Body |
|---|---|---|
| `400 Bad Request` | `clubSlug` invalide | `{ "error": "invalid_club", "message": "Club not found" }` |
| `500 Internal Server Error` | Erreur côté ERP | `{ "error": "internal_error" }` |
| `503 Service Unavailable` | ERP temporairement indisponible | `{ "error": "erp_down" }` |

---

## 4. Configuration HTTP

### CORS

L'API doit autoriser les origines suivantes (via `Access-Control-Allow-Origin`) :

```
https://padelfactoryagadir.com
https://www.padelfactoryagadir.com
https://*.vercel.app
http://localhost:3000
```

Méthodes : `GET, OPTIONS`
En-têtes autorisés : `Content-Type, Accept`

### Cache HTTP

L'API doit renvoyer un en-tête de cache léger :

```
Cache-Control: public, max-age=30
```

30 secondes suffisent : ça réduit la charge sur l'ERP en cas de pic de trafic, et 30 secondes d'écart est invisible pour l'utilisateur.

### Authentification

**Phase initiale** : aucune (lecture publique).
**Évolution possible** : ajouter un en-tête `X-API-Key` pour rate-limiting si abus détectés.

### Performance attendue

- Temps de réponse cible : < 500 ms
- Taille typique de réponse : 5 à 15 KB
- Encodage : `Content-Encoding: gzip` recommandé

---

## 5. Exemples concrets

### Exemple 1 — Aujourd'hui vendredi 8 mai 2026 (jour de semaine)

```json
{
  "date": "2026-05-08",
  "dayOfWeek": "vendredi",
  "isPeakDay": false,
  "isHoliday": false,
  "isClosed": false,
  "slots": [
    { "start": "09:30", "end": "11:00", "kind": "off-peak", "pricePerCourt": 300, "courts": [...] },
    { "start": "11:00", "end": "12:30", "kind": "off-peak", "pricePerCourt": 300, "courts": [...] },
    ...
    { "start": "17:00", "end": "18:30", "kind": "peak", "pricePerCourt": 400, "courts": [...] },
    ...
  ]
}
```

### Exemple 2 — Samedi 9 mai 2026 (week-end)

```json
{
  "date": "2026-05-09",
  "dayOfWeek": "samedi",
  "isPeakDay": true,
  "isHoliday": false,
  "isClosed": false,
  "slots": [
    { "start": "09:30", "end": "11:00", "kind": "peak", "pricePerCourt": 400, "courts": [...] },
    ...
    { "start": "21:30", "end": "23:00", "kind": "peak", "pricePerCourt": 400, "courts": [...] }
  ]
}
```

**Tous** les `kind` sont `"peak"` et tous les `pricePerCourt` sont `400`.

### Exemple 3 — Vendredi 1er mai 2026 (jour férié)

```json
{
  "date": "2026-05-01",
  "dayOfWeek": "vendredi",
  "isPeakDay": true,
  "isHoliday": true,
  "isClosed": false,
  "slots": [
    { "start": "09:30", "end": "11:00", "kind": "peak", "pricePerCourt": 400, "courts": [...] },
    ...
  ]
}
```

Bien que ce soit un vendredi (jour de semaine), `isPeakDay: true` parce que c'est un jour férié.

### Exemple 4 — Jour fermé

```json
{
  "date": "2026-12-25",
  "dayOfWeek": "vendredi",
  "isPeakDay": false,
  "isHoliday": false,
  "isClosed": true,
  "slots": []
}
```

---

## 6. Cas particuliers à gérer

### Heures déjà passées (jour J)

Si l'utilisateur ouvre la page à 15h, les créneaux 09:30 à 14:00 du jour même sont déjà passés.

**Recommandation** : l'API peut soit :
- (A) Renvoyer ces créneaux avec tous les `courts` à `available: false` et `reason: "past"`
- (B) Renvoyer ces créneaux comme un autre jour (le site filtrera côté front en comparant à `now`)

L'option **B est plus simple** : laissons l'API renvoyer toutes les données, le site filtre.

### Réservations bloquantes (cours, tournois, événements privés)

Si un terrain est bloqué pour un cours collectif ou un tournoi, l'API doit le renvoyer avec :

```json
{ "number": 2, "available": false, "reason": "private_event" }
```

ou `"reason": "tournament"`, `"reason": "coaching"` selon ce que tu veux afficher au site (à terme on pourra montrer à l'utilisateur "Court 2 réservé pour un tournoi").

---

## 7. Configuration côté site web

Quand l'API sera disponible, le site web aura besoin de connaître l'URL de base via une variable d'environnement Vercel :

```env
NEXT_PUBLIC_API_BASE_URL=https://api.padelfactoryagadir.com
```

Le site fera ses appels :

```
GET ${NEXT_PUBLIC_API_BASE_URL}/availability/agadir
GET ${NEXT_PUBLIC_API_BASE_URL}/availability/universiapolis
```

**Question pour le développeur** : sur quel domaine sera hébergée l'API ?
Suggestions :
- `api.padelfactoryagadir.com` (sous-domaine dédié)
- `erp.padelfactoryagadir.com/api`
- Hébergé séparément ailleurs

---

## 8. Checklist côté développeur ERP

Pour valider que l'API est prête :

- [ ] Endpoint `GET /availability/agadir` retourne 15 jours, 9 slots/jour, 4 courts/slot
- [ ] Endpoint `GET /availability/universiapolis` retourne 15 jours, 9 slots/jour, 3 courts/slot
- [ ] Format de réponse exactement conforme à la section 3
- [ ] `isPeakDay = true` les samedis et dimanches
- [ ] `isPeakDay = true` les jours fériés marocains
- [ ] `isHoliday = true` uniquement les jours fériés marocains
- [ ] Sur un jour peak, tous les `slots[*].kind = "peak"`
- [ ] Les courts qui ont une réservation effective dans l'ERP sont marqués `available: false`
- [ ] CORS autorise au minimum `https://padelfactoryagadir.com` et `https://*.vercel.app`
- [ ] Cache-Control est `max-age=30` ou similaire
- [ ] L'API gère un domaine HTTPS valide (certificat SSL)
- [ ] Test : appeler l'API à 15h le jour J et vérifier que les créneaux passés du matin sont là (ou bloqués)
- [ ] Test : 1 mai 2026 → `isHoliday: true, isPeakDay: true`
- [ ] Test : Samedi → `isPeakDay: true`
- [ ] Temps de réponse < 500ms en moyenne

---

## 9. Évolutions futures (pas pour la V1)

Pour info, voici ce qu'on pourra ajouter plus tard si besoin :

- **Endpoint POST** pour pré-réserver un slot (lock pendant 5 min) avant la confirmation WhatsApp, afin d'éviter le double-booking si 2 utilisateurs choisissent le même slot en même temps.
- **Webhook** : ERP qui notifie le site quand une réservation est ajoutée/annulée (pour rafraîchir en temps réel).
- **Endpoint GET pour les coachs et cours** : disponibilité des coachs pour la page Coaching/Académie.
- **Endpoint POST pour les inscriptions** aux tournois.

---

## 10. Contact

Pour toute question d'implémentation : Nacer Benzekri (`nacer.benzekri.3@gmail.com`).

Le code du site web est sur GitHub : https://github.com/PadelFactoryAgadir/Site-Web-Claude

Cette spec est versionnée dans le repo : `docs/API-SPECIFICATION.md`.
