export const GITHUB_REPO = "https://github.com/pakizahsaqib/syncport";
export const NPM_ORG = "https://www.npmjs.com/org/syncport";

/** @syncport/* package page on npm (adapter id matches package name). */
export function syncportNpmPackageUrl(packageName: string) {
  return `https://www.npmjs.com/package/@syncport/${packageName}`;
}
