# Gravity

A real-time 3D n-body gravity simulation that runs in the browser. Hundreds of
bodies attract each other, collide, and merge into larger ones. Each merged body
takes a colour mixed from its parents.

### [Try the live demo](https://www.gebrial.ca/gravity/)

[![Lint and test](https://github.com/gebrial/gravity/workflows/Lint%20and%20test/badge.svg)](https://github.com/gebrial/gravity/actions?query=workflow%3A%22Lint+and+test%22)

[![Gravity simulation](./assets/demo.gif)](https://www.gebrial.ca/gravity/)

## Controls

| Control | Effect |
| --- | --- |
| Drag | Orbit the camera |
| Scroll | Zoom |
| Body count slider | Number of bodies to simulate (1 to 1000) |
| Distribution dropdown | Starting arrangement of the bodies |

Changing either control restarts the simulation with a fresh universe.

## Starting distributions

- **Ellipsoid.** A cloud flattened along one axis, spun about that axis at a
  speed taken from the gravitational field each body sits in, so the cloud
  orbits instead of falling straight inward.
- **Ring.** Bodies placed on a circle with a small random offset, starting at
  rest.
- **Sphere.** Radii drawn from a Gaussian and masses from a Cauchy distribution.
  Each body's speed comes from its own gravitational potential energy.
- **Solar system.** Real masses and orbital radii for the Sun and planets, read
  from [`solar_system_bodies.json`](src/solar_system_bodies.json) and scaled
  down to simulation units.

Spiral and uniform distributions are listed but not implemented yet.

## How it works

Each frame advances the universe by one step.

1. **Merge collisions.** Any two bodies closer than the sum of their radii
   become one body. The merge is perfectly inelastic. Mass adds, position and
   velocity are the mass-weighted averages of the two, and the lost kinetic
   energy is discarded. Merging repeats until a pass finds no more collisions,
   because a merged body can overlap a third.
2. **Accumulate accelerations.** Every unordered pair contributes an equal and
   opposite acceleration following an inverse-square law. Iterating over pairs
   rather than over all ordered combinations halves the work.
3. **Integrate.** Each body adds its accumulated acceleration to its velocity
   and position, then clears the acceleration for the next frame.

The camera tracks the system's centre of mass, so a cluster drifting across the
scene stays in frame.

Each body stores its colour as an HSB hue. A merge averages the two hues by
mass, taking the shorter way around the colour wheel, so a red body and a violet
body blend through red rather than through green. After a long run a body's hue
is a rough record of which bodies it absorbed.

### Barnes-Hut octree

[`Octree.ts`](src/app/Octree.ts) implements the Barnes-Hut approximation. It
subdivides space recursively and treats any cell far enough away relative to its
size as a single point mass at that cell's centre of mass, which drops the force
calculation from O(n²) to O(n log n). The octree is implemented and tested, but
the simulation still runs the direct pairwise loop. Wiring it in is the next
piece of work.

## Running it locally

```bash
yarn install
yarn copy-html && yarn esbuild-browser:dev
```

Then open `dist/index.html` in a browser. Use `yarn esbuild-browser:watch` to
rebuild on save.

Other commands:

```bash
yarn test          # jest
yarn lint          # eslint
yarn build-all     # clean tsc + esbuild build into dist/
yarn docs          # typedoc API docs into docs/
```

## Layout

```
src/
  Body.ts                            a single point mass: state, physics, rendering
  Universe.ts                        the simulation step, collisions, merging
  app/Octree.ts                      Barnes-Hut octree (not yet wired in)
  app/universe/BodyDistribution.ts   the starting arrangements
  app/inputs/                        thin wrappers over p5 sliders and selects
  solar_system_bodies.json           real masses and orbital radii
test/                                jest tests
```

## Built with

[TypeScript](https://www.typescriptlang.org/), [p5.js](https://p5js.org/) in
WebGL mode for rendering, [esbuild](https://esbuild.github.io/) for bundling,
and [Jest](https://jestjs.io/) for tests.
[`deploy-gh-pages.yml`](.github/workflows/deploy-gh-pages.yml) deploys to GitHub
Pages on every push to `master`.

## License

MIT
