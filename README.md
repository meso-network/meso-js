# Meso

Embed crypto on/off-ramps into your dapp or traditional web application.

⚡️ Looking to get started with `meso-js`? View the
[docs](./packages//meso-js/README.md).

> ⚠️ This project is currently in a closed beta. For access to Meso, contact
> [support@meso.network](mailto:support@meso.network).

## Development

This is a TypeScript monorepo using [pnpm
workspaces](https://pnpm.io/workspaces).

### Prerequisites

This repo uses [pnpm](https://pnpm.io/) and requires Node.js v20.

> We recommend using [nvm](https://github.com/nvm-sh/nvm) or
> [asdf](https://asdf-vm.com/) to manage Node.js versions.

### Tasks

- `pnpm build`: Build all packages
- `pnpm test`: Run tests in all packages
- `pnpm lint`: Run linting in all packages
- `pnpm typecheck`: Run typechecking in all packages

### VSCode

This repo ships with recommended VSCode extensions. You should be prompted to
install them when first opening the project or you can [install
them](https://code.visualstudio.com/docs/editor/extension-marketplace#_recommended-extensions)
from the Extensions pane.

### Releases

This project uses [changesets](https://github.com/changesets/changesets) to
automate releases.

To add a changeset:

- In a branch run: `pnpm changeset` and follow the prompts and describe your
  changes.
  - [semver](https://semver.org/) is used for versioning:
    - `major`: Breaking change
    - `minor`: New features, no breaking changes
    - `patch`: Bugfixes & non-functional updates
  - All packages are versioned together.
- Commit the newly applied changeset to your branch.
- Once your PR is merged into `main`, the Changesets Github Action will prepare
  a release PR which can be merged. After it is merged, new packages will be
  published to `npm`.
