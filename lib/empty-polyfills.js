// Intentionally empty.
//
// Next.js bundles `polyfill-module` (core-js shims for Array.prototype.at,
// Object.hasOwn, String.prototype.trimStart, URL.canParse, etc.) into the
// client bundle unconditionally, regardless of browserslist. Every one of those
// APIs is natively supported by this project's target browsers (see
// `browserslist` in package.json: chrome>=90, firefox>=90, safari>=15,
// edge>=90), so shipping the shims is pure dead weight that PageSpeed flags as
// "legacy JavaScript".
//
// next.config.ts aliases Next's polyfill module to this empty file so the shims
// are dropped from the bundle. See vercel/next.js discussion #64330.
