import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type PackageJson = {
  name?: unknown;
  version?: unknown;
};

function asString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Expected package.json ${fieldName} to be a non-empty string`);
  }
  return value;
}

const repoRoot = path.resolve(import.meta.dir, "..");
const packageJsonPath = path.join(repoRoot, "package.json");
const outputPath = path.join(repoRoot, "src", "cli", "version.ts");

const raw = await readFile(packageJsonPath, "utf8");
const pkg = JSON.parse(raw) as PackageJson;

const name = asString(pkg.name, "name");
const version = asString(pkg.version, "version");

const out = [
  `export const HELIXENT_NAME = ${JSON.stringify(name)} as const;`,
  `export const HELIXENT_VERSION = ${JSON.stringify(version)} as const;`,
  "",
].join("\n");

try {
  const existing = await readFile(outputPath, "utf8");
  if (existing === out) {
    process.stdout.write(`[gen-version] up-to-date (${version})\n`);
    process.exit(0);
  }
} catch {
  // ignore missing file; we'll create it
}

await writeFile(outputPath, out, "utf8");
process.stdout.write(`[gen-version] wrote src/cli/version.ts (${version})\n`);
