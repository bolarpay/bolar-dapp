import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const output = mkdtempSync(join(tmpdir(), "bolar-quote-tests-"));
try {
  execFileSync(process.execPath, ["node_modules/typescript/bin/tsc",
    "lib/remittance-quote.ts", "lib/exchange-rate.ts", "lib/support.ts",
    "--module", "commonjs", "--target", "ES2020", "--skipLibCheck", "--outDir", output], { stdio: "inherit" });
  execFileSync(process.execPath, ["--test", "tests/quote.test.mjs"], {
    stdio: "inherit", env: { ...process.env, BOLAR_QUOTE_TEST_OUTPUT: output },
  });
} finally { rmSync(output, { recursive: true, force: true }); }
