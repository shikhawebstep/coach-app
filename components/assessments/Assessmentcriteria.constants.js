// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for Practical Assessment criteria.
//
// Per Loom walkthrough: "this is the practical quotient, this is what we
// look for, punctuality, communication skills, structure of exercises,
// control of group."
//
// Both AssessmentCriteria.jsx (rating input) and AssessmentResults.jsx
// (results breakdown) import from here so the labels can never drift apart
// again. If the client ever changes wording, change it once, here.
// ---------------------------------------------------------------------------

export const PRACTICAL_ASSESSMENT_CRITERIA = [
    { id: 1, key: 'punctuality', text: 'Punctuality' },
    { id: 2, key: 'communicationSkills', text: 'Communication Skills' },
    { id: 3, key: 'structureOfExercises', text: 'Structure of Exercises' },
    { id: 4, key: 'controlOfGroup', text: 'Control of Group' },
];

// Helper: turns the raw { [key]: 1-5 } ratings object into the shape
// AssessmentResults needs for its breakdown list (score + percentage).
export function buildRatingsBreakdown(ratingsByKey = {}) {
    return PRACTICAL_ASSESSMENT_CRITERIA.map((criterion) => {
        const answer = ratingsByKey[criterion.key] ?? 0;
        return {
            id: criterion.id,
            title: criterion.text,
            answer,
            score: `${answer}/5`,
            percentage: (answer / 5) * 100,
        };
    });
}

// Helper: overall percentage across all criteria (average of 1-5 scores,
// scaled to 100). Matches Loom: "divided by 30, it's an average... that's
// what gives the result."
export function calculateOverallPercentage(ratingsByKey = {}) {
    const values = PRACTICAL_ASSESSMENT_CRITERIA.map((c) => ratingsByKey[c.key] ?? 0);
    const sum = values.reduce((acc, v) => acc + v, 0);
    const maxPossible = PRACTICAL_ASSESSMENT_CRITERIA.length * 5;
    if (maxPossible === 0) return 0;
    return Math.round((sum / maxPossible) * 100);
}