# Instructor Analytics

Issue: #6

The dashboard now computes cohort-level learning signals.

## Current Signals

- learner count
- average mastery
- average diagnostic score
- total review queue count
- open mistake count
- attempt count
- common misconception categories
- stage-level mastery and confidence averages

## Implementation

Source: `src/data/learningModel.ts`

Function:

- `buildCohortAnalytics`

The dashboard shows cohort KPIs and the most common open misconception categories.

## Next Analytics Step

Add instructor drill-downs:

- cohort heatmap by skill
- misconception trend over time
- time-to-mastery by concept
- review effectiveness after spaced practice
- template difficulty calibration
