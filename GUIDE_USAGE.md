# 📖 GUIDE D'UTILISATION - ÉVALUACOMPAGNON

## 🎯 POUR QUI EST CE GUIDE ?

- ✅ **Pour vous, Marion** : Comprendre et utiliser l'outil
- ✅ **Pour vos apprenants** : Savoir comment participer
- ✅ **Pour votre mémoire** : Documentation méthodologique

---

## 📚 PARTIE 1 : COMPRENDRE L'ÉVALUATION DIALOGIQUE

### Qu'est-ce que l'évaluation dialogique ?

L'évaluation dialogique est une approche qui évalue le **processus d'apprentissage** plutôt que le produit final.

**Principe clé** : On ne cherche PAS à savoir si l'apprenant a la bonne réponse, mais COMMENT il arrive à sa réponse.

### Pourquoi cette approche avec l'IA générative ?

Face à l'utilisation de ChatGPT par les étudiants pour faire leurs devoirs :
- ❌ **Approche punitive** : "C'est interdit, vous aurez zéro"
- ✅ **Approche dialogique** : "Expliquez-moi votre processus"

**L'avantage** : Même si l'étudiant utilise l'IA pour écrire, le dialogue révèle sa vraie compréhension.

---

## 🚀 PARTIE 2 : INSTALLATION (Pour Marion)

### Étape 1 : Installation locale

```bash
# 1. Ouvrir le terminal dans le dossier evaluacompagnon
cd evaluacompagnon

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API
# Ouvrez .env.local et ajoutez votre clé Gemini
GEMINI_API_KEY=votre_clé_ici

# 4. Lancer l'application
npm run dev
```

L'application s'ouvre sur `http://localhost:3001`

### Étape 2 : Tester avec vous-même

**Avant de tester avec des étudiants**, faites vous-même une session complète :
1. Répondez aux questions comme si vous étiez un apprenant
2. Voyez quelles questions métacognitives sont posées
3. Téléchargez le rapport et analysez-le
4. Ajustez le prompt si nécessaire

---

## 👥 PARTIE 3 : UTILISATION AVEC VOS APPRENANTS

### Scénario d'utilisation recommandé

**Contexte** : Session d'évaluation de 20 minutes, 1 fois toutes les 2-3 semaines

**Avant la session** :
1. ✅ Expliquez l'objectif : "Ce n'est pas une note, c'est pour comprendre votre processus"
2. ✅ Rassurez : "Il n'y a pas de mauvaise réponse"
3. ✅ Précisez : "L'IA va vous poser des questions sur COMMENT vous pensez"

**Pendant la session** :
- L'apprenant travaille seul avec ÉvaluaCompagnon
- Durée : 20 minutes maximum
- Vous n'intervenez pas (sauf problème technique)

**Après la session** :
- L'apprenant télécharge le rapport
- Il vous l'envoie par email
- Vous l'analysez et donnez un feedback

---

## 📝 PARTIE 4 : INSTRUCTIONS POUR LES APPRENANTS

### Message à envoyer à vos apprenants

```
Bonjour,

Nous allons utiliser un nouvel outil : ÉvaluaCompagnon.

🎯 OBJECTIF
Ce n'est PAS un examen noté. C'est un dialogue pour comprendre 
COMMENT vous apprenez et réfléchissez en français.

⏱️ DURÉE
Environ 20 minutes.

❓ CE QUI VA SE PASSER
L'IA va vous proposer des tâches et vous poser des questions comme :
- "Pourquoi avez-vous choisi ce mot ?"
- "Comment avez-vous construit cette phrase ?"
- "À quoi vous êtes-vous référé ?"

💡 CONSEILS
- Soyez honnête sur votre processus de réflexion
- Expliquez ce qui vous aide à apprendre
- Donnez des exemples de votre vie
- Il n'y a pas de mauvaise réponse !

📥 À LA FIN
Téléchargez le rapport et envoyez-le moi : marionviz@hotmail.com

Lien : [VOTRE_LIEN_ICI]

Bonne session !
Marion
```

---

## 🔍 PARTIE 5 : ANALYSER LES RAPPORTS

### Ce que vous devez chercher dans un rapport

#### 1️⃣ SIGNES D'APPRENANCE

**Positif** ✅ :
- L'apprenant cite le cours spontanément
- Il donne des exemples personnels
- Il explique ses stratégies
- Il identifie ses difficultés
- Il fait des liens avec sa vie

**À développer** ⚠️ :
- Réponses très courtes
- Pas de référence au cours
- Pas d'exemples personnels
- Difficulté à expliquer son processus

#### 2️⃣ STRATÉGIES D'APPRENTISSAGE

Identifiez quelles stratégies l'apprenant utilise :
- **Comparaison L1/L2** : "J'ai pensé à l'anglais"
- **Mémorisation** : "Je me suis souvenu de l'exercice"
- **Logique** : "J'ai déduit en fonction de..."
- **Répétition** : "J'ai répété la phrase dans ma tête"

#### 3️⃣ UTILISATION D'IA ?

Si vous suspectez l'utilisation de ChatGPT pour les réponses :
- ✅ Le dialogue révèle la vraie compréhension
- ✅ Les questions métacognitives forcent l'explicitation
- ✅ Pas besoin d'accuser, le rapport montre tout

---

## 📊 PARTIE 6 : POUR VOTRE MÉMOIRE

### Données à collecter

Pour chaque apprenant sur 14 maximum :
- ✅ 3-4 sessions espacées dans le temps
- ✅ Tous les rapports sauvegardés
- ✅ Évolution visible

### Indicateurs à mesurer

**Quantitatifs** :
- Nombre de références au cours
- Nombre d'exemples personnels
- Longueur moyenne des réponses
- Nombre d'échanges

**Qualitatifs** :
- Type de stratégies utilisées
- Conscience métacognitive
- Capacité de transfert
- Évolution dans le temps

### Comparaison LinguaCompagnon / ÉvaluaCompagnon

| Critère | LinguaCompagnon | ÉvaluaCompagnon |
|---------|----------------|----------------|
| **Engagement** | Utilisation libre | Session structurée |
| **Motivation** | Pratique autonome | Évaluation |
| **Apprenance** | Implicite | Explicite |
| **Traces** | Basiques | Enrichies |

---

## ⚙️ PARTIE 7 : PERSONNALISATION

### Modifier les prompts

Si vous voulez ajuster les questions métacognitives :

**Fichier** : `src/services/geminiService.ts`

**Section à modifier** : `getEvaluationPrompt()`

**Exemple** : Ajouter un type de question

```typescript
### 6️⃣ QUESTIONS SUR LES ÉMOTIONS
Objectif : Explorer le ressenti

Exemples :
- "Comment vous sentez-vous en utilisant cette structure ?"
- "Qu'est-ce qui vous rend confiant/anxieux ?"
```

### Modifier la durée

**Fichier** : `src/App.tsx`

**Ligne** : `maxDuration={20 * 60 * 1000}`

Changez `20` par le nombre de minutes souhaité.

---

## 🎯 PARTIE 8 : CAS D'USAGE CONCRETS

### Cas 1 : Détection d'utilisation d'IA

**Situation** : L'apprenant écrit des phrases très complexes, vocabulaire soutenu.

**Réponse d'ÉvaluaCompagnon** :
"Votre phrase est très bien construite ! Pouvez-vous me l'expliquer avec des mots plus simples ? Comment diriez-vous cela à l'oral ?"

**Résultat** : Le dialogue révèle si l'apprenant comprend vraiment.

### Cas 2 : Apprenant bloqué

**Situation** : L'apprenant ne sait pas répondre.

**Réponse d'ÉvaluaCompagnon** :
"Pas de problème. Qu'est-ce qui vous pose difficulté ? À quoi pourriez-vous vous référer pour m'aider ?"

**Résultat** : Focus sur les stratégies, pas la bonne réponse.

### Cas 3 : Apprenant avancé

**Situation** : L'apprenant répond correctement.

**Réponse d'ÉvaluaCompagnon** :
"Excellent ! Comment avez-vous su utiliser cette structure ? Pouvez-vous me donner un autre exemple de votre travail ?"

**Résultat** : Approfondissement du transfert.

---

## 📞 BESOIN D'AIDE ?

### FAQ

**Q : L'apprenant peut-il tricher en utilisant ChatGPT ?**
R : Oui, mais le dialogue révèlera s'il comprend vraiment. Les questions métacognitives forcent l'explicitation.

**Q : 20 minutes c'est trop court/long ?**
R : Ajustable selon votre contexte. 15-25 minutes est idéal.

**Q : Combien de sessions par apprenant ?**
R : Minimum 2 (avant/après), idéal 3-4 pour voir l'évolution.

**Q : Dois-je noter les rapports ?**
R : NON. C'est une évaluation formative, pas sommative. Utilisez pour adapter votre enseignement.

---

## 🎓 POUR ALLER PLUS LOIN

### Lectures recommandées

1. **Carless & Boud (2018)** - The development of student feedback literacy
2. **Wiliam (2011)** - Embedded Formative Assessment
3. **Perrenoud (1998)** - From Formative Evaluation to a Controlled Regulation of Learning

### Concept d'apprenance

**Définition** : Capacité à apprendre à apprendre (Carré, 2005)

**Dimensions** :
- Métacognition : Conscience de son apprentissage
- Autonomie : Capacité à s'auto-diriger
- Stratégies : Méthodes d'apprentissage

**ÉvaluaCompagnon** révèle ces 3 dimensions !

---

**Bon courage pour votre projet de mémoire ! 🚀**

Marion Vizier-Marzais
marionviz@hotmail.com
Master IPM - Université de Lille
