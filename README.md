# gestionnaire_de_taches

Voici le test en question : Test : Gestionnaire de tâches "collaboratif" simulé


## Contexte :

On te confie le développement d’un prototype mobile pour suivre les tâches d’un projet. Plusieurs personnes peuvent créer des tâches, et l’utilisateur mobile doit voir les mises à jour en quasi-temps réel de manière fluide.

 

## Objectif :

Créer une app mobile qui permet d’afficher une liste de tâches et de voir automatiquement les nouvelles tâches créées côté backend (simulateur multi-utilisateurs). 

 

## Partie Backend (Node.js + MongoDB) :

À développer :

- Modèle MongoDB Task :
    - title (string)
    - status ("todo", "in_progress", "done")
    - createdAt (Date)

- Endpoints :
    - ```GET /tasks?after=<date>``` – retourne les nouvelles tâches après une certaine date (max 20)

- Simulateur :
    - Endpoint POST /simulate qui crée automatiquement 10 tâches espacées de 5s(simulant des utilisateurs)

 

## Partie Frontend (React Native) :

Écran à développer :

- Liste des tâches :
    - Affichage dynamique avec FlatList
    - Bouton pour "simuler des ajouts"
    - Mise à jour automatique toutes les 5 secondes des nouvelles tâches


## Points attendus :

- Les tâches s’ajoutent sans recharger toute la liste

- Bon usage de l’asynchrone, useEffect, useCallback, etc.

- Pas de fetch redondant si pas de nouvelle tâche

- Bonne architecture des composants et services API

 

## Bonus possible : (facultatif)

- Coloration visuelle selon le statut (todo = gris, in_progress = bleu, done = vert)

- Animation à l’arrivée d’une tâche

- Tri côté client ou backend

 

## Contraintes :

- Front : structure de composants claire, appels API bien séparés

- Back : code clair et réutilisable, Mongo bien utilisé (index sur createdAt)

- Pas de lib externe obligatoire pour le cache ou la synchro

 

## Livrables :

- Dépôt GitHub avec code front + back

- README rapide (installation + logique)

- (optionnel) mini-note de conception