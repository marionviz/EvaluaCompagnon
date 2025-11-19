# 📚 GUIDE D'INTÉGRATION MOODLE - ÉVALUACOMPAGNON

## 🎯 OBJECTIF

Ce guide vous aide à intégrer ÉvaluaCompagnon dans Moodle et à **tester si votre Moodle est "bridé"** par votre entreprise (ONU).

---

## ⚠️ COMPRENDRE LES RESTRICTIONS POSSIBLES

Les Moodle d'entreprise peuvent avoir des restrictions pour des raisons de sécurité :

### **Restrictions fréquentes :**

1. **Appels API externes bloqués**
   - L'IA ne pourra pas se connecter à Google Gemini
   - Symptôme : "Network error" ou pas de réponse

2. **JavaScript limité**
   - Certaines fonctionnalités peuvent ne pas marcher
   - Symptôme : Interface figée, boutons inactifs

3. **LocalStorage désactivé**
   - Pas de sauvegarde locale
   - Impact : Mineur pour ÉvaluaCompagnon

4. **Iframes restreints**
   - Le SCORM peut ne pas s'afficher
   - Symptôme : Page blanche

---

## 🧪 ÉTAPE 1 : TESTS PRÉLIMINAIRES

### **Test A : Votre navigateur sur votre ordinateur**

**Avant** de tester dans Moodle, vérifiez que ça marche sur votre ordinateur :

```bash
# Dans le dossier evaluacompagnon
npm run dev
```

✅ **Si ça marche** → Le code est bon
❌ **Si ça ne marche pas** → Problème dans le code, pas Moodle

---

### **Test B : Build de production**

```bash
npm run build
```

Puis :

```bash
npm run preview
```

Allez sur `http://localhost:4173`

✅ **Si ça marche** → Le build est bon
❌ **Si ça ne marche pas** → Problème de configuration

---

## 📦 ÉTAPE 2 : CRÉER LE PACKAGE SCORM

### **Méthode manuelle** (car pas de script build-scorm)

#### **1. Builder l'application**

```bash
npm run build
```

Cela crée un dossier `dist/`

#### **2. Créer le manifest SCORM**

Créez un fichier `imsmanifest.xml` dans le dossier `dist/` :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.evaluacompagnon.scorm.2024" version="1.0" 
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" 
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd 
                              http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd 
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  
  <organizations default="ORG-01">
    <organization identifier="ORG-01">
      <title>ÉvaluaCompagnon - Évaluation Dialogique</title>
      <item identifier="ITEM-01" identifierref="RES-01">
        <title>ÉvaluaCompagnon - Session d'évaluation</title>
        <adlcp:masteryscore>0</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="RES-01" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="assets/index.js"/>
      <file href="assets/index.css"/>
    </resource>
  </resources>
  
</manifest>
```

#### **3. Créer le ZIP SCORM**

**Windows** :
1. Allez dans le dossier `dist/`
2. Sélectionnez **TOUS** les fichiers (y compris `imsmanifest.xml`)
3. Clic droit > "Envoyer vers" > "Dossier compressé"
4. Nommez : `evaluacompagnon-scorm.zip`

**⚠️ IMPORTANT** : Les fichiers doivent être **à la racine** du ZIP, pas dans un sous-dossier !

---

## 🎓 ÉTAPE 3 : UPLOADER DANS MOODLE (TEST)

### **1. Uploader le SCORM**

1. Connectez-vous à votre Moodle CFM
2. Allez dans un **cours de test** (pas un cours réel !)
3. **Activez** le mode édition
4. **Ajoutez** une activité > **Paquetage SCORM**
5. **Uploadez** `evaluacompagnon-scorm.zip`
6. **Configurez** :
   - Nom : "ÉvaluaCompagnon - TEST"
   - Mode d'affichage : "Nouvelle fenêtre"
   - Largeur : 100%
   - Hauteur : 700px
7. **Enregistrez**

---

### **2. TEST : Lancer l'activité**

**Cliquez** sur l'activité SCORM

#### **✅ CAS 1 : Tout fonctionne !**

Vous voyez :
- L'interface ÉvaluaCompagnon
- Badge "ÉVALUATION" vert
- Timer qui démarre
- Vous pouvez écrire et l'IA répond

**→ Votre Moodle N'EST PAS bridé ! 🎉**

Passez directement à l'**ÉTAPE 4 : Déploiement en production**

---

#### **❌ CAS 2 : Page blanche**

**Problème** : Moodle bloque les iframes ou JavaScript

**Test diagnostic** :
1. Ouvrez la console (F12)
2. Regardez les erreurs
3. Cherchez : "Content Security Policy" ou "iframe blocked"

**Solution possible** :
- Demandez à votre administrateur Moodle d'autoriser les iframes
- OU utilisez Vercel (voir plus bas)

---

#### **❌ CAS 3 : Interface visible mais IA ne répond pas**

**Problème** : Appels API externes bloqués

**Test diagnostic** :
1. Ouvrez la console (F12)
2. Cherchez des erreurs réseau : "Failed to fetch" ou "CORS error"
3. Regardez l'onglet "Network" → Requêtes vers `generativelanguage.googleapis.com` bloquées ?

**Solutions** :

**Solution A** : Demander l'autorisation
- Contactez votre admin Moodle/IT
- Demandez d'autoriser : `generativelanguage.googleapis.com`
- Expliquez que c'est l'API Google Gemini (confiance Google)

**Solution B** : Utiliser Vercel à la place (voir ci-dessous)

---

## 🔄 SOLUTION ALTERNATIVE : VERCEL + LIEN DANS MOODLE

Si votre Moodle est **trop bridé**, utilisez cette approche :

### **1. Déployez sur Vercel**

```bash
# 1. Créez un repo GitHub
git init
git add .
git commit -m "ÉvaluaCompagnon pour Moodle"
git remote add origin https://github.com/VOTRE-USERNAME/EvaluaCompagnon.git
git push -u origin main
```

```
# 2. Allez sur https://vercel.com/
# 3. Importez le projet depuis GitHub
# 4. Ajoutez la variable d'environnement :
#    GEMINI_API_KEY = votre_clé
# 5. Déployez
```

Vous obtenez une URL : `https://evaluacompagnon.vercel.app`

---

### **2. Créez un lien dans Moodle**

Au lieu d'un SCORM, créez une **activité URL** :

1. Dans Moodle : **Ajouter une activité** > **URL**
2. **Nom** : "ÉvaluaCompagnon - Évaluation Dialogique"
3. **URL externe** : `https://evaluacompagnon.vercel.app`
4. **Description** : 
   ```
   Session d'évaluation dialogique (20 minutes)
   
   IMPORTANT : À la fin de votre session, cliquez sur le bouton 
   "Envoyer par email" pour m'envoyer votre rapport automatiquement.
   ```
5. **Affichage** : "Nouvelle fenêtre"
6. **Enregistrez**

---

### **Avantages de cette approche :**

✅ Pas de restrictions Moodle
✅ Fonctionne partout (ordinateur, tablette, téléphone)
✅ Facile à mettre à jour (push sur GitHub → auto-deploy)
✅ Envoi email direct intégré
✅ URL partageable facilement

**Inconvénient** :
- Pas de tracking automatique dans Moodle (mais email compense)

---

## 📊 ÉTAPE 4 : COLLECTER LES RAPPORTS

### **Méthode 1 : Email (recommandée)**

Les étudiants cliquent sur le **bouton Email** 📧 :
- Leur client email s'ouvre
- Destinataire : `marionviz@hotmail.com` (pré-rempli)
- Sujet : pré-rempli
- Corps : Le rapport complet (pré-rempli)
- Ils n'ont qu'à **cliquer "Envoyer"**

**Vous recevez** :
- ✅ Email avec le rapport complet en texte
- ✅ Sujet clair : "ÉvaluaCompagnon - Semaine X - Date"
- ✅ Facile à organiser dans votre boîte mail

---

### **Méthode 2 : Téléchargement + Upload Moodle**

Si email ne marche pas :

1. Créez un **Devoir** dans Moodle
2. Nom : "ÉvaluaCompagnon - Dépôt du rapport"
3. Type de remise : "Fichiers"
4. Les étudiants :
   - Téléchargent leur rapport (bouton 📥)
   - L'uploadent dans le devoir Moodle

**Vous recevez** :
- ✅ Tous les rapports centralisés dans Moodle
- ✅ Vous voyez qui a rendu / pas rendu

---

## 🧪 ÉTAPE 5 : TEST COMPLET AVEC UN ÉTUDIANT PILOTE

Avant de déployer à tous :

1. ✅ Choisissez **1 étudiant volontaire**
2. ✅ Expliquez le processus
3. ✅ Faites-lui faire une session
4. ✅ Vérifiez que vous recevez bien le rapport
5. ✅ Analysez le rapport
6. ✅ Demandez feedback à l'étudiant
7. ✅ Ajustez si nécessaire

---

## ✅ CHECKLIST DE DÉPLOIEMENT

### **Tests préliminaires**
- [ ] `npm run dev` fonctionne en local
- [ ] `npm run build` puis `npm run preview` fonctionne
- [ ] J'ai testé moi-même une session complète
- [ ] Le bouton Email ouvre bien mon client email
- [ ] Le rapport se télécharge correctement

### **Intégration Moodle**
- [ ] SCORM créé avec `imsmanifest.xml` à la racine du ZIP
- [ ] SCORM uploadé dans Moodle de test
- [ ] L'interface s'affiche dans Moodle
- [ ] L'IA répond aux questions
- [ ] Le timer fonctionne
- [ ] Le bouton Email fonctionne
- [ ] OU Vercel déployé si Moodle bridé

### **Collecte des rapports**
- [ ] Méthode de collecte choisie (Email ou Devoir Moodle)
- [ ] Testé avec un étudiant pilote
- [ ] J'ai bien reçu le rapport
- [ ] Le rapport est lisible et complet

### **Communication aux étudiants**
- [ ] Message préparé expliquant l'activité
- [ ] Lien/accès communiqué
- [ ] Instructions claires sur l'envoi du rapport
- [ ] Date limite fixée

---

## 🆘 DÉPANNAGE

### **Problème : "API key not found"**

**En SCORM**, la clé API doit être **hard-codée** dans le build :

**Solution** :
1. Ouvrez `src/App.tsx`
2. Ligne ~58 environ :
   ```typescript
   // AVANT
   if (!process.env.API_KEY) {
     throw new Error("API_KEY environment variable not set.");
   }
   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
   
   // APRÈS (pour SCORM uniquement)
   const ai = new GoogleGenAI({ apiKey: 'AIza...VOTRE_VRAIE_CLÉ...' });
   ```
3. Refaites le build : `npm run build`
4. Recréez le SCORM

⚠️ **Attention** : Ne publiez pas ce code sur GitHub public avec la clé !

---

### **Problème : Le bouton Email ne fait rien**

**Cause** : Le rapport est trop long pour mailto:

**Solution** :
- Utilisez le bouton **Télécharger** à la place
- Ou demandez aux étudiants d'envoyer en pièce jointe

---

### **Problème : Moodle refuse le SCORM**

**Vérifications** :
1. `imsmanifest.xml` est bien à la racine du ZIP
2. Le ZIP ne contient pas de dossier parent
3. Le fichier `index.html` est à la racine

---

## 📞 BESOIN D'AIDE ?

### **Questions techniques Moodle**
- Contactez votre administrateur Moodle CFM
- Expliquez que vous testez un outil pédagogique avec IA
- Mentionnez que c'est pour votre Master (crédibilité)

### **Questions sur l'outil**
- Consultez README.md et GUIDE_USAGE.md
- Revenez me voir dans Claude ! 😊

---

## 📊 RÉCAPITULATIF : 3 SCÉNARIOS POSSIBLES

### **Scénario 1 : Moodle fonctionne parfaitement** ✅

→ Utilisez le SCORM dans Moodle
→ Les étudiants cliquent sur Email pour envoyer
→ Vous recevez tout par email

---

### **Scénario 2 : Moodle bloque les appels API** ⚠️

→ Déployez sur Vercel
→ Créez un lien URL dans Moodle vers Vercel
→ Les étudiants cliquent sur Email pour envoyer
→ Vous recevez tout par email

---

### **Scénario 3 : Email ne marche pas** 📥

→ Utilisez SCORM ou Vercel
→ Les étudiants téléchargent le rapport
→ Ils l'uploadent dans un Devoir Moodle
→ Vous récupérez dans Moodle

---

## 🎯 MA RECOMMANDATION FINALE

**Essayez d'abord** : SCORM dans Moodle (15 minutes de test)

**Si ça ne marche pas** : Vercel + lien dans Moodle (30 minutes)

**Pour la collecte** : Bouton Email (le plus simple pour les étudiants)

---

**Bon courage pour l'intégration ! 🚀**

N'hésitez pas à me demander si vous bloquez quelque part ! 😊

---

Marion Vizier-Marzais
marionviz@hotmail.com
Master IPM - Université de Lille
