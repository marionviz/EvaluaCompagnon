# ÉvaluaCompagnon - Évaluation Dialogique par IA

> Outil d'évaluation dialogique pour révéler le processus d'apprentissage en français langue étrangère

## 🎯 Description

ÉvaluaCompagnon est un outil d'évaluation innovant qui utilise l'intelligence artificielle pour explorer le **processus d'apprentissage** plutôt que d'évaluer le produit final.

Contrairement aux évaluations traditionnelles, ÉvaluaCompagnon pose des questions métacognitives pour comprendre :
- 🧠 Comment l'apprenant pense et construit son discours
- 📚 À quoi il se réfère (cours, expérience, stratégies)
- 🔄 Comment il transfère ses acquis
- 💡 Sa conscience de son propre apprentissage

## 🆚 Différence avec LinguaCompagnon

| Aspect | LinguaCompagnon | **ÉvaluaCompagnon** |
|--------|----------------|-------------------|
| **Objectif** | Pratique libre | Évaluation du processus |
| **Posture IA** | Partenaire bienveillant | Évaluateur dialogique |
| **Questions** | Corrections formatives | Questions métacognitives |
| **Durée** | Illimitée | 20 minutes |
| **Trace** | Optionnelle | Complète avec analyse |
| **Export** | Texte simple | Rapport enrichi |
| **Usage** | Entraînement régulier | Évaluation périodique |

## 📚 Contexte pédagogique

Développé dans le cadre du Master Ingénierie Pédagogique Multimodale (IPM) - Université de Lille
- **Enseignante** : Marion Vizier-Marzais
- **Contexte** : Centre de Formation Multilingue, ONU Genève
- **Public** : Apprenants adultes en français (niveau A2-B1)
- **Cadre théorique** : Évaluation dialogique + Apprenance

## 🚀 Démarrage rapide

### Installation locale

```bash
# Installer les dépendances
npm install

# Configurer la clé API dans .env.local
GEMINI_API_KEY=votre_clé_ici

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:3001`

### Build pour production

```bash
npm run build
```

## 🎨 Fonctionnalités clés

### ⏱️ Session chronométrée
- Durée recommandée : 20 minutes
- Timer visible en temps réel
- Alertes visuelles (15 min, dépassement)

### ❓ Questions métacognitives automatiques
5 types de questions :
1. **Justification** : "Pourquoi avez-vous choisi...?"
2. **Stratégies** : "Comment avez-vous construit...?"
3. **Références** : "À quoi vous êtes-vous référé...?"
4. **Transfert** : "Dans quelle situation réelle...?"
5. **Métacognition** : "Qu'avez-vous appris sur votre façon d'apprendre...?"

### 📊 Rapport d'évaluation enrichi

Le rapport inclut :
- ✅ Métadonnées complètes (durée, échanges, timestamps)
- ✅ Trace dialogique intégrale
- ✅ Indicateurs quantitatifs (engagement, métacognition)
- ✅ Analyse qualitative (signes d'apprenance)
- ✅ Recommandations pour l'enseignant(e)

## 🛠️ Technologies

- **Frontend** : React 19 + TypeScript
- **Build** : Vite
- **IA** : Google Gemini 2.0 Flash
- **Styling** : Tailwind CSS

## 📂 Structure du projet

```
evaluacompagnon/
├── src/
│   ├── components/          # Composants React
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── WeekSelector.tsx
│   │   └── SessionTimer.tsx
│   ├── services/
│   │   └── geminiService.ts # Prompts d'évaluation
│   ├── utils/
│   │   └── reportGenerator.ts # Génération de rapports
│   ├── App.tsx
│   ├── index.tsx
│   ├── types.ts
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 📖 Guide d'utilisation

### Pour l'apprenant

1. **Démarrer** une session (démarrage automatique)
2. **Répondre** aux questions et tâches proposées
3. **Expliquer** votre processus de réflexion
4. **Terminer** la session (bouton "Terminer")
5. **Télécharger** votre rapport

### Pour l'enseignant(e)

1. **Récupérer** les rapports des apprenants
2. **Analyser** les traces dialogiques
3. **Identifier** les stratégies d'apprentissage
4. **Repérer** les signes d'apprenance
5. **Adapter** votre enseignement

## 🎓 Thèmes par semaine

L'application couvre 11 semaines de formation basées sur le programme du CFM-ONU :

1. Révisions (Passé/Imparfait, Comparatif)
2. Premières interactions (Téléphone, négation)
3. Mon travail (Présent, habitudes)
4. Communiquer (Formel/informel, subjonctif)
5. Souhaits et craintes (Subjonctif/infinitif)
6. Demander de l'aide (Conditionnel, pronom 'en')
7. Droits et projets (Négation complexe)
8. Engagement citoyen (But, quantité)
9. Initiatives écologiques
10. Opinion sur projets (Pronoms possessifs)
11. Bilan et révisions

## 🔧 Configuration

### Variables d'environnement

Fichier `.env.local` :

```
GEMINI_API_KEY=votre_clé_api_google_gemini
```

### Obtenir une clé API

1. Allez sur https://aistudio.google.com/apikey
2. Créez ou copiez votre clé API
3. Collez-la dans `.env.local`

## 📊 Export du rapport

Le rapport d'évaluation est généré au format texte et inclut :

```
═══ RAPPORT D'ÉVALUATION DIALOGIQUE ═══

📋 INFORMATIONS GÉNÉRALES
- Session ID, Semaine, Date, Durée
- Nombre d'échanges

📊 INDICATEURS QUANTITATIFS
- Engagement (messages, longueur, temps)
- Métacognition (questions, références, exemples)

💬 TRACE DIALOGIQUE COMPLÈTE
- Horodatage de chaque message
- Distinction apprenant/ÉvaluaCompagnon

🎯 ANALYSE QUALITATIVE
- Signes d'apprenance observés
- Points forts identifiés
- Axes de progression

💡 RECOMMANDATIONS POUR L'ENSEIGNANT(E)
```

## 🐛 Dépannage

### L'IA ne répond pas

**Solution** : Vérifiez que votre clé API est correctement configurée dans `.env.local`

### Le timer ne démarre pas

**Solution** : Rafraîchissez la page (F5)

### Le rapport ne se télécharge pas

**Solution** : Vérifiez que la session contient au moins 2 messages

## 📞 Support

**Questions pédagogiques** :
- Marion Vizier-Marzais : marionviz@hotmail.com

**Questions techniques** :
- Consultez le guide GUIDE_USAGE.md

## 📄 Licence

Projet académique - Master IPM Lille 2025

## 🙏 Remerciements

- Google Gemini AI
---

**Fait avec ❤️ pour l'évaluation authentique de l'apprentissage**
