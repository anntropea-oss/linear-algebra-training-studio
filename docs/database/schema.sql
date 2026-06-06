create table learners (
  id text primary key,
  name text not null,
  cohort text not null,
  level_name text not null,
  diagnostic_score integer not null default 0,
  weekly_goal_minutes integer not null default 0,
  minutes_this_week integer not null default 0,
  streak_days integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table skills (
  id text primary key,
  name text not null,
  stage text not null,
  level integer not null,
  mastery_goal text not null,
  diagnostic_prompt text not null
);

create table skill_prerequisites (
  skill_id text not null references skills(id) on delete cascade,
  prerequisite_skill_id text not null references skills(id) on delete restrict,
  primary key (skill_id, prerequisite_skill_id)
);

create table learner_skill_states (
  learner_id text not null references learners(id) on delete cascade,
  skill_id text not null references skills(id) on delete cascade,
  mastery integer not null check (mastery between 0 and 100),
  confidence integer not null check (confidence between 0 and 100),
  attempts integer not null default 0,
  last_practiced_at timestamptz,
  trend integer not null default 0,
  primary key (learner_id, skill_id)
);

create table problem_templates (
  id text primary key,
  skill_id text not null references skills(id) on delete restrict,
  prompt text not null,
  hint text not null,
  solution text not null,
  difficulty integer not null check (difficulty between 1 and 5),
  checks_for text not null,
  misconception_category text not null,
  evidence_mode text not null,
  transfer_type text not null,
  rubric_id text not null,
  estimated_minutes integer not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table assignments (
  id text primary key,
  learner_id text not null references learners(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  due_at timestamptz not null,
  estimated_minutes integer not null,
  generator_version text not null default 'prototype-v1'
);

create table assignment_problems (
  id text primary key,
  assignment_id text not null references assignments(id) on delete cascade,
  template_id text not null references problem_templates(id) on delete restrict,
  skill_id text not null references skills(id) on delete restrict,
  prompt text not null,
  hint text not null,
  solution text not null,
  difficulty integer not null,
  checks_for text not null,
  misconception_category text not null,
  evidence_mode text not null,
  transfer_type text not null,
  rubric_id text not null,
  estimated_minutes integer not null,
  display_order integer not null
);

create table attempts (
  id text primary key,
  learner_id text not null references learners(id) on delete cascade,
  assignment_id text not null references assignments(id) on delete cascade,
  problem_id text not null references assignment_problems(id) on delete cascade,
  skill_id text not null references skills(id) on delete restrict,
  submitted_answer text not null,
  score integer not null check (score between 0 and 5),
  max_score integer not null default 5,
  outcome text not null,
  confidence_before integer not null check (confidence_before between 0 and 100),
  confidence_after integer not null check (confidence_after between 0 and 100),
  hints_used integer not null default 0,
  misconception_category text not null,
  feedback text not null,
  submitted_at timestamptz not null default now()
);

create table mistakes (
  id text primary key,
  learner_id text not null references learners(id) on delete cascade,
  skill_id text not null references skills(id) on delete restrict,
  category_id text not null,
  problem text not null,
  misconception text not null,
  learner_answer text not null,
  correction text not null,
  severity text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table activity_events (
  id text primary key,
  learner_id text not null references learners(id) on delete cascade,
  type text not null,
  title text not null,
  detail text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_attempts_learner_submitted_at on attempts (learner_id, submitted_at desc);
create index idx_mistakes_learner_status on mistakes (learner_id, status);
create index idx_events_learner_created_at on activity_events (learner_id, created_at desc);
