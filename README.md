# Bento Charts

[![Coverage Status](https://coveralls.io/repos/github/bento-platform/Bento-Charts/badge.svg?branch=master)](https://coveralls.io/github/bento-platform/Bento-Charts?branch=master)
[![npm version](https://badge.fury.io/js/bento-charts.svg)](https://badge.fury.io/js/bento-charts)

This repository hosts the code for `bento-charts`, a library written in TypeScript for React projects, which wraps
Recharts and Leaflet in easy-to-use components compatible with the Bento platform.

The following components are currently available:

* Bar chart
* Pie chart
* Choropleth map
* Point map



## Installation

Add `bento-charts` as a dependency to another project:

```bash
npm install bento-charts
```

To install `bento-charts` with map support:

```bash
npm install bento-charts leaflet react-leaflet
```



## Usage

Wrap your app in the `ChartConfigProvider` and pass in the Language of your site.

```jsx
import { ChartConfigProvider } from 'bento-charts';
```

```jsx
<ChartConfigProvider Lng={language}>
  <App />
</ChartConfigProvider>
```
Language can be either `'en'` or `'fr'`.

You also can provide your own theme and translation dictionary.

```jsx
<ChartConfigProvider
  Lng={language}
  theme={theme}
  translations={translations}
>
    <App />
</ChartConfigProvider>
```
refer to [theme](https://github.com/bento-platform/Bento-Charts/blob/main/src/types/chartTypes.ts#L20) 
and [translations](https://github.com/bento-platform/Bento-Charts/blob/main/src/types/chartTypes.ts#L47) 
for more information.

Right now, no properties from `ChartConfigProvider` are used for any map components, but they may do so in the future.


## Usage

### Using a Chart

```jsx
import { BarChart, PieChart } from 'bento-charts';
```
Refer to [Props](https://github.com/bento-platform/Bento-Charts/blob/main/src/types/chartTypes.ts#L51) 
for information on their props.


### Using a Map

Maps can be imported using a command like the following:

```jsx
import { ChoroplethMap } from 'bento-charts/dist/maps';
```

Here, note the sub-path on the import - this separation allows us to have the 
map-related peer dependencies marked as "optional".

The following map components are available:

* `ChoroplethMap` for showing a choropleth map, coloured by 
* `PointMap` (for showing a list of point coordinates; this uses a different data structure than the other components)

See [map component properties](https://github.com/bento-platform/bento_charts/blob/main/src/types/mapTypes.ts) 
for more information.



## Release procedure

A commit on the `main` branch will trigger a build and release of the package to the npm Registry, no need to manually 
create tags thanks to semantic-release.

**Please follow the instructions bellow when writing your commits.**


### Semantic release
Bento-Charts adheres to the [semver](https://semver.org/) versioning convention (Semantic Versioning). This repository uses the 
[semantic-release](https://github.com/semantic-release/semantic-release) library to automate the release of semver compliant packages to 
the npm Registry.

Semantic-release parses the commit messages in the release branch in order to determine the versioning changes. It does 
not rely on magic to work, but rather on specific commit message formats, which are described bellow.

### Commit message guidelines
Semantic-release uses the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification in order to parse relevant information.

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: Optional, what was changed.
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

Both `<type>` and `<short summary>` are mandatory, while `<scope>` is optional, but recommended for pretty release notes.

**Example commit messages**

After fixing a dependency issue:
```
fix(dependencies): resolve peer dependencies issues caused by React version
```

After adding a new Rechart feature:
```
feat(charts): add support for mixmarchart
```

After adding unit tests to the charts
```
test(charts): add unit tests for mixbarchart
```



## Commit with `commitlint`

[Commitlint](https://commitlint.js.org/#/) is a safeguard for commit message formats, which you can use to help write 
semver-compliant commits. [Husky](https://github.com/typicode/husky) is a git hooks tool that binds commitlint to the `git commit` command.

### Installation
Run these steps once to setup commitlint + husky.
```shell
# Install dev dependencies (commitlint & husky)
npm install
# Install husky git hook
npx husky init
# Add commitlint as a hook to husky
echo 'npx --no -- commitlint --edit ${1}' > .husky/commit-msg
```

### Usage
Use the git cli as you normally would to make your commits, commitlint will intercept your commit if it is malformed.

Example:
```bash
git commit -m "ci(semantic-release): add commitlint and husky as dev tools to write valid commits"
```



## Local development

For local development in a React/Recharts app that uses bento-charts, you can follow these steps for your setup:

1. `build` and `pack` bento-charts
   ```bash
   # Builds package and creates a pack file in the "./packs" dir
   npm run buildpack
   ```

2. In the project using bento-charts, modify the bento-charts dependency in package.json so that the version number is now the absolute path to the pack file.
   ```diff
   - "bento-charts": "2.0.0",
   + "bento-charts": "file:~/bento-charts/packs/bento-charts-2.0.0.tgz",
   ```

3. Install the dependencies in the project
   ```bash
   npm install
   ```

**Note: you will need to repeat steps 1 and 3 everytime you want the changes to be applied to the app using 
`bento-charts`**



## Testing

A small web application is included in the `test` folder to provide an easy manual testing bed for components.

This application can be launched with the following command:

```bash
npm test
```
