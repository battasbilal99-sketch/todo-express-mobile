# 🔥 Configuration Firebase App Distribution

## 1. Créer un projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Créer un nouveau projet ou utiliser un existant
3. Ajouter une application Android avec l'ID `com.bilal.todoexpress`

## 2. Activer App Distribution

1. Dans la console Firebase, aller dans **App Distribution**
2. Cliquer sur **Commencer**
3. Ajouter des testeurs ou créer un groupe "testers"

## 3. Configurer les secrets GitHub

### FIREBASE_APP_ID
1. Dans Firebase Console → Paramètres du projet → Applications
2. Copier l'**ID de l'application** (format: `1:123456789:android:abc123def456`)
3. Ajouter comme secret GitHub : `FIREBASE_APP_ID`

### FIREBASE_SERVICE_ACCOUNT
1. Firebase Console → Paramètres du projet → Comptes de service
2. Cliquer sur **Générer une nouvelle clé privée**
3. Télécharger le fichier JSON
4. Copier tout le contenu du fichier JSON
5. Ajouter comme secret GitHub : `FIREBASE_SERVICE_ACCOUNT`

## 4. Ajouter des testeurs

### Via Firebase Console
1. App Distribution → Testeurs et groupes
2. Ajouter des e-mails individuels ou créer un groupe
3. Le groupe par défaut est "testers"

### Via workflow GitHub
```yaml
# Dans le workflow firebase-distribution.yml
# Modifier la ligne 'groups: testers' si nécessaire
```

## 5. Utilisation

### Distribution automatique
- Push un tag `v*` (ex: `v1.0.0`) → Distribution automatique

### Distribution manuelle
1. Aller dans **Actions** → **Firebase App Distribution**
2. Cliquer sur **Run workflow**
3. Optionnel : Ajouter des notes de version et e-mails testeurs

## 6. Testeurs - Installation

Les testeurs recevront un e-mail avec :
- Lien de téléchargement direct
- Instructions d'installation
- QR code (si configuré)

### Instructions pour testeurs
1. Ouvrir l'e-mail de Firebase App Distribution
2. Cliquer sur **Télécharger**
3. Activer "Sources inconnues" sur Android
4. Installer l'APK
5. Donner des retours via Firebase ou GitHub Issues

## 7. Monitoring

- **Firebase Console** → App Distribution → Versions
- Voir les statistiques de téléchargement
- Gérer les testeurs et groupes
- Historique des distributions

---

## 🔧 Configuration avancée

### Groupes de testeurs multiples
```yaml
# Dans firebase-distribution.yml
groups: "testers,beta-users,internal"
```

### Notes de version dynamiques
```yaml
# Utilise le message du commit
releaseNotes: ${{ github.event.head_commit.message }}
```

### Distribution conditionnelle
```yaml
# Seulement sur la branche main
if: github.ref == 'refs/heads/main'
```