# TP06 - Formulaires web

Ce code implémente [MDN Local Library tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website) en remplaçant Mongoose/MongoDB par Sequelize/MySQL.

## Utilisation

- Copiez le fichier `config/mysql.json.example` vers `config/mysql.json` et adaptez le à vos besoins.
- Assurez-vous que votre DB soit accessible à partir des infos que vous avez configuré dans `config/mysql.json`.
- Exécutez `npm install` une fois pour installer les dépendances.
- Exécutez `npm run populatedb` une fois pour remplir la DB avec des données.
- Exécutez `npm run serverstart` pour démarrer le serveur Node.js Express en mode développment.
- Pointez votre navigateur web vers http://127.0.0.1:3000/.

## Consignes

Votre mission est d'implémenter les formulaires suivants :

- Suppression des genres
- Modification des auteurs

Ces formulaires doivent fonctionner de la même manière que ceux déjà implémentés :

- Une requête GET permet d'afficher le formulaire.
- Une requête POST vers la même URL permet d'exécuter la commande (suppression ou modification).
- Les données transmises dans le corps de la requête POST doivent être validés et nettoyés coté serveur.
- En cas de données invalides, le formulaire est réaffiché et des messages d'erreurs expliquent le problème.
- Un genre littéraire ne peut être supprimé si des livres y sont encore associés.

## Étapes de résolution

1. Vous devez implémenter les méthodes `genre_delete_get()` et `genre_delete_post` dans le fichier `/controllers/genreController.js` ainsi que les méthodes `author_update_get` et `author_update_post` dans le fichier `/controllers/authorController.js`.
2. Inspirez-vous de l'implémentation d'autres méthodes dans les contrôleurs. Il ne devrait pas y avoir de grandes différences.
3. Vous devrez créer un template `genre_delete.pug` pour la suppression, mais vous pourrez réutiliser celui de `author_create` pour la mise à jour.
