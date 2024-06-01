import { az } from "./cli.ts";
import { assert as ok, assertEquals as equals } from "jsr:@std/assert@^0.224.0";

Deno.test("az", async () => {
    const result = await az({ version: true });
    equals(result.code, 0);
    ok(result.text().startsWith("azure-cli"));
});

Deno.test("az help", async () => {
    const result = await az(["--help"]);
    equals(result.code, 0);
});

Deno.test("az login", async () => {
    const result = await az(["account", "show"]);
    ok(result.code !== 0);
});
