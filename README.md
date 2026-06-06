# Linear Algebra Training Studio

A freestanding React prototype for personalized linear algebra training. The app tracks multiple learners, shows mastery and confidence by skill, generates adaptive homework, downloads homework as an HTML handout with an answer key, and logs practice, mistakes, assignments, and downloads.

## Run Locally

```bash
npm install
npm run dev
```

## What Is Included

- Multi-learner dashboard with sample learner profiles.
- Linear algebra skill graph organized by prerequisite stage.
- Mastery, confidence, streak, weekly work, and review queue metrics.
- Assignment generator based on weak skills, recent mistakes, confidence, prerequisite gaps, and review debt.
- Downloadable HTML homework handouts with hints and answer keys.
- Practice logger that updates mastery and records mistake evidence.
- Learning log and correction queue.

## Planning Docs

- [Product Blueprint](/Users/atropea/Documents/Linear%20Algebra/docs/PRODUCT_BLUEPRINT.md)
- [Curriculum Skill Map](/Users/atropea/Documents/Linear%20Algebra/docs/CURRICULUM_SKILL_MAP.md)
- [Data Model](/Users/atropea/Documents/Linear%20Algebra/docs/DATA_MODEL.md)
- [MVP Roadmap](/Users/atropea/Documents/Linear%20Algebra/docs/MVP_ROADMAP.md)
- [Pedagogy Notes](/Users/atropea/Documents/Linear%20Algebra/docs/PEDAGOGY_NOTES.md)
- [GitHub Setup](/Users/atropea/Documents/Linear%20Algebra/docs/GITHUB_SETUP.md)

## Next Engineering Step

The prototype is currently local-first and in-memory. The next major step is to add persistence:

- PostgreSQL tables for learners, skills, assignments, attempts, mistakes, and events.
- Authentication and roles for learners, instructors, and administrators.
- Server-side PDF generation for homework exports.
- A verified problem-template library with tagged skills, difficulty, hints, and solutions.
