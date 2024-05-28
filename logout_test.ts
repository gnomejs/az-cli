import { logout } from "./logout.ts";
import { assertEquals as equals } from "jsr:@std/assert@^0.224.0";

Deno.test("logout", async () => {
    const r = await logout({});
    equals(r.code, 2);
});

Deno.test("logout with help", async () => {
    const r = await logout({ help: true }, { log: (file, args) => console.log(file, args) });
    equals(r.code, 0);
});
