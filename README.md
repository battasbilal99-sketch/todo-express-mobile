# Todo Express Mobile

![Android CI](https://github.com/USERNAME/REPO/workflows/Android%20CI/badge.svg)
![Pages](https://github.com/USERNAME/REPO/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)

Application mobile Todo Express développée avec React + Vite + Capacitor pour Android.

## 🚀 Prévisualisation & Téléchargement

### 📱 APK Android
- **[Télécharger APK Debug](https://github.com/USERNAME/REPO/actions)** (GitHub Actions)
- **Version**: 1.0 (Build 1) | **Min SDK**: Android 6.0 (API 23)
- **SHA-256**: `9E45FABDA57E632EC2CC6D5B9818406DC8F05C7B913758B99EFB17FB10F258A3`

### 🌐 Web Preview
- **[Ouvrir dans le navigateur](https://USERNAME.github.io/REPO/)** (GitHub Pages)
- Interface responsive, compatible mobile
- Même build que l'APK Android

### 📋 Page de prévisualisation complète
- **[Preview Hub](./preview.html)** - QR codes, liens directs, instructions

### 🔥 Distribution Firebase (Optionnel)
- **[Configuration Firebase](./FIREBASE_SETUP.md)** - Guide complet
- Distribution automatique aux testeurs
- Notifications par e-mail + QR codes

---

## 🚀 Technologies

- **Frontend**: React 18 + Vite
- **Mobile**: Capacitor 6
- **Base de données**: SQLite (@capacitor-community/sqlite)
- **Build**: Gradle 8.x + AGP 8.3.2
- **Java**: JDK 17

## 📋 Prérequis

- Node.js 22.12.0+ (voir `.nvmrc`)
- JDK 17
- Android Studio / Android SDK
- Git

## 🛠️ Installation

```bash
# Cloner le projet
git clone <repo-url>
cd todo-express-mobile

# Installer les dépendances
npm install

# Build de l'app React
npm run build

# Synchroniser avec Capacitor
npx cap sync android
```

## 🏗️ Build Android

### Build local (après configuration)

**Important**: Pour éviter les problèmes de verrouillage Windows sur `native-platform.dll`, configurez d'abord :

```powershell
# Créer les dossiers dédiés
mkdir C:\gradle-home
mkdir C:\gradle-tmp

# Configurer les variables d'environnement
setx GRADLE_USER_HOME "C:\gradle-home"
setx GRADLE_OPTS "-Djava.io.tmpdir=C:\gradle-tmp"

# Redémarrer la session ou rebooter
```

Puis builder :

```bash
cd android

# Build debug
.\gradlew clean --no-daemon --stacktrace
.\gradlew :app:assembleDebug --no-daemon --stacktrace

# Build release (non signé)
.\gradlew :app:assembleRelease --no-daemon --stacktrace
```

### Build via CI/CD (recommandé)

Le workflow GitHub Actions génère automatiquement les APK :

- **Déclenchement**: Push sur `main`/`develop`, PR, ou manuel
- **Artefacts**: `app-debug.apk` et `app-release-unsigned.apk`
- **Rétention**: 30 jours

## 📱 Lancement

```bash
# Mode développement web
npm run dev

# Ouvrir dans Android Studio
npx cap open android

# Build et run sur device/émulateur
npx cap run android
```

## 🔧 Configuration

### Gradle (android/gradle.properties)
```properties
org.gradle.jvmargs=-Xmx4096m -Dfile.encoding=UTF-8 -Djava.io.tmpdir=C:/gradle-tmp
org.gradle.daemon=false
org.gradle.user.home=C:/gradle-home
```

### Capacitor (capacitor.config.json)
```json
{
  "webDir": "dist",
  "android": {
    "scheme": "http"
  }
}
```

## 🐛 Dépannage

### Erreur `native-platform.dll` verrouillé

1. Utiliser les dossiers dédiés (voir section Build)
2. Killer les processus Java/Gradle restants
3. Utiliser le CI/CD en alternative

### Conflits Kotlin

Les exclusions sont déjà configurées dans `build.gradle` :
```gradle
configurations.all {
    exclude group: 'org.jetbrains.kotlin', module: 'kotlin-stdlib-jdk7'
    exclude group: 'org.jetbrains.kotlin', module: 'kotlin-stdlib-jdk8'
}
```

## 📦 Artefacts

- **Debug APK**: `android/app/build/outputs/apk/debug/`
- **Release APK**: `android/app/build/outputs/apk/release/`
- **CI Artifacts**: Téléchargeables depuis GitHub Actions

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push et créer une PR

Le CI vérifiera automatiquement le build Android.
ci: trigger build
