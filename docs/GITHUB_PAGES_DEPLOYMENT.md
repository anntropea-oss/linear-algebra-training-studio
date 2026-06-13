# GitHub Pages Deployment

## Public Demo URL

The standing demo URL is:

https://anntropea-oss.github.io/linear-algebra-training-studio/

## Deployment Flow

- Merges to `main` trigger `.github/workflows/pages.yml`.
- The workflow runs `npm ci`, `npm test`, and `npm run build:pages`.
- `npm run build:pages` builds the Vite app with `/linear-algebra-training-studio/` as the base path.
- The generated `dist` folder is uploaded as the GitHub Pages artifact and deployed to the `github-pages` environment.

## Local Verification

Before merging work that affects the app shell or deployment, run:

```bash
npm test
npm run build:pages
npm run lint
```

## Repository Settings

GitHub Pages should use GitHub Actions as its publishing source:

1. Open the repository settings.
2. Go to Pages.
3. Set Build and deployment source to GitHub Actions.

The workflow can also be run manually from the Actions tab with `workflow_dispatch`.

## Path Toward An App

GitHub Pages gives us a stable web demo while the tutor is still changing quickly. The next app-shaped steps are:

- Add a web app manifest and icons so the site can be installed as a PWA.
- Add offline-safe static assets and a service worker after the learning data model settles.
- Move learner records from local browser storage to a backend when multi-device accounts become necessary.
- Wrap the mature web app with a native shell only after the browser experience is stable.
