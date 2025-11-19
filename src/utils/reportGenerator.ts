import type { ChatMessage, SessionMetadata } from '../types';

export function generateEvaluationReport(
  messages: ChatMessage[],
  metadata: SessionMetadata,
  week: number
): string {
  const userMessages = messages.filter(m => m.role === 'user');
  const modelMessages = messages.filter(m => m.role === 'model');
  
  // Calculs basiques
  const duration = metadata.endTime ? metadata.endTime - metadata.startTime : 0;
  const durationMinutes = Math.floor(duration / 60000);
  const durationSeconds = Math.floor((duration % 60000) / 1000);
  
  const averageMessageLength = userMessages.length > 0
    ? Math.floor(userMessages.reduce((acc, msg) => acc + msg.text.length, 0) / userMessages.length)
    : 0;
  
  const metacognitiveQuestions = modelMessages.filter(m => 
    m.text.includes('❓') || 
    m.text.toLowerCase().includes('pourquoi') ||
    m.text.toLowerCase().includes('comment')
  ).length;
  
  // Analyse qualitative basique
  const courseReferences = userMessages.filter(m => 
    m.text.toLowerCase().includes('cours') ||
    m.text.toLowerCase().includes('leçon') ||
    m.text.toLowerCase().includes('appris') ||
    m.text.toLowerCase().includes('vu en classe')
  ).length;
  
  const personalExamples = userMessages.filter(m =>
    m.text.toLowerCase().includes('dans ma vie') ||
    m.text.toLowerCase().includes('au travail') ||
    m.text.toLowerCase().includes('mon expérience') ||
    m.text.toLowerCase().includes('par exemple')
  ).length;
  
  // Génération du rapport
  return `═══════════════════════════════════════════════════════════════════════
  RAPPORT D'ÉVALUATION DIALOGIQUE - ÉVALUACOMPAGNON
═══════════════════════════════════════════════════════════════════════

📋 INFORMATIONS GÉNÉRALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session ID : ${metadata.sessionId}
Semaine : ${week}
Date : ${new Date(metadata.startTime).toLocaleDateString('fr-FR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
Durée de la session : ${durationMinutes} minutes ${durationSeconds} secondes
Nombre total d'échanges : ${userMessages.length}

───────────────────────────────────────────────────────────────────────

📊 INDICATEURS QUANTITATIFS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENGAGEMENT ET PARTICIPATION :
  • Messages envoyés par l'apprenant : ${userMessages.length}
  • Longueur moyenne des messages : ${averageMessageLength} caractères
  • Durée moyenne par échange : ${userMessages.length > 0 ? Math.floor(duration / userMessages.length / 1000) : 0} secondes

MÉTACOGNITION :
  • Questions métacognitives posées : ${metacognitiveQuestions}
  • Références explicites au cours : ${courseReferences}
  • Exemples personnels donnés : ${personalExamples}
  • Ratio questions/réponses : ${userMessages.length > 0 ? (metacognitiveQuestions / userMessages.length).toFixed(2) : 0}

───────────────────────────────────────────────────────────────────────

💬 TRACE DIALOGIQUE COMPLÈTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${messages.map((msg, index) => {
  const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('fr-FR') : 'N/A';
  const icon = msg.role === 'user' ? '👤' : '🤖';
  const label = msg.role === 'user' ? 'APPRENANT' : 'ÉVALUACOMPAGNON';
  
  return `[${time}] ${icon} ${label} :
${msg.text}

${index < messages.length - 1 ? '─────────────────────────────────────────────────────────────────\n' : ''}`;
}).join('\n')}

═══════════════════════════════════════════════════════════════════════

🎯 ANALYSE QUALITATIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIGNES D'APPRENANCE OBSERVÉS :

${courseReferences > 0 ? '✅ L\'apprenant fait référence aux contenus du cours (' + courseReferences + ' fois)' : '⚠️  Peu de références explicites au cours'}
${personalExamples > 0 ? '✅ L\'apprenant donne des exemples personnels (' + personalExamples + ' fois)' : '⚠️  Peu d\'exemples personnels partagés'}
${userMessages.length >= 8 ? '✅ Engagement soutenu tout au long de la session' : '⚠️  Engagement limité (moins de 8 échanges)'}
${metacognitiveQuestions >= 5 ? '✅ Nombreuses opportunités de réflexion métacognitive' : '⚠️  Peu de questions métacognitives posées'}

POINTS FORTS POTENTIELS :

${userMessages.length >= 10 ? '🌟 Participation active et soutenue\n' : ''}${courseReferences >= 2 ? '🌟 Capacité à mobiliser les contenus du cours\n' : ''}${personalExamples >= 2 ? '🌟 Transfert vers des situations personnelles/professionnelles\n' : ''}${averageMessageLength > 50 ? '🌟 Réponses développées et réfléchies\n' : ''}

AXES DE PROGRESSION POSSIBLES :

${userMessages.length < 8 ? '📝 Développer la participation et l\'engagement\n' : ''}${courseReferences < 2 ? '📝 Faire davantage de liens explicites avec le cours\n' : ''}${personalExamples < 2 ? '📝 Illustrer avec plus d\'exemples personnels\n' : ''}${averageMessageLength < 30 ? '📝 Développer les réponses de manière plus approfondie\n' : ''}

───────────────────────────────────────────────────────────────────────

💡 RECOMMANDATIONS POUR L'ENSEIGNANT(E)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ANALYSE DE LA TRACE
   • Identifiez les moments où l'apprenant fait preuve de réflexion métacognitive
   • Relevez les stratégies d'apprentissage qu'il mentionne
   • Notez les difficultés exprimées ou implicites

2. RETOUR À L'APPRENANT
   • Valorisez les efforts de verbalisation du processus
   • Encouragez à expliciter davantage ses stratégies
   • Suggérez des liens supplémentaires avec le cours

3. AJUSTEMENTS PÉDAGOGIQUES
   • Adaptez les activités en fonction des stratégies identifiées
   • Renforcez les points de grammaire/vocabulaire mal maîtrisés
   • Proposez des situations de transfert similaires aux exemples donnés

4. SUIVI
   • Comparez avec les prochaines sessions d'évaluation dialogique
   • Observez l'évolution de la capacité métacognitive
   • Mesurez le développement de l'autonomie

───────────────────────────────────────────────────────────────────────

📎 INFORMATIONS TECHNIQUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Outil : ÉvaluaCompagnon v1.0
Modèle IA : Gemini 2.0 Flash
Cadre théorique : Évaluation dialogique + Apprenance
Contexte : Master IPM - Université de Lille
Enseignante : Marion Vizier-Marzais (marionviz@hotmail.com)
Centre : CFM - Organisation des Nations Unies, Genève

═══════════════════════════════════════════════════════════════════════
                        FIN DU RAPPORT
═══════════════════════════════════════════════════════════════════════

Ce rapport est confidentiel et destiné à l'usage pédagogique uniquement.
Pour toute question : marionviz@hotmail.com

Rapport généré le : ${new Date().toLocaleString('fr-FR')}
`;
}
