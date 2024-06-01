import { logout } from "./logout.ts";
import { assertEquals as equals, assert as ok } from "jsr:@std/assert@^0.224.0";

Deno.test("logout", async () => {
    const r = await logout({});
    ok(r.code !== 0);
});

Deno.test("logout with help", async () => {
    const r = await logout({ help: true }, { log: (file, args) => console.log(file, args) });
    equals(r.code, 0);
});
