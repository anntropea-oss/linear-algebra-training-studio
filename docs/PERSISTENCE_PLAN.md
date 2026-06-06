# Persistence Plan

Issue: #1

The app now has a persistence-ready shape:

- browser local storage for the current freestanding demo
- PostgreSQL schema documentation for the durable backend
- learner, assignment, attempt, mistake, and event shapes aligned between code and docs

## Current Implementation

Source: `src/data/persistence.ts`

The browser snapshot stores:

- learners
- assignments
- saved timestamp
- schema version

This lets the demo preserve submissions, diagnostics, generated assignments, and correction logs across refreshes.

The loader normalizes older snapshots against the current seed shape. Missing attempt logs, mistake categories, mistake statuses, or assignment problem metadata are filled or replaced with current defaults instead of crashing the app.

## Backend Direction

The next backend step is to connect these records to a server API and PostgreSQL tables from `docs/database/schema.sql`.

## Privacy Rule

Do not store real learner names or educational records in GitHub issues. Use anonymized learner IDs when creating tracking issues.
