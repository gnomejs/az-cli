/**
 * The `az-cli` module provides a simple way to execute
 * az commands.
 *
 * The module relies upon the @gnome/exec module and
 * has the same basic usage as the `Command` class.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import { az } from "@gnome/az-cli";
 *
 * // az --version
 * await az({ version: true }).run()
 *
 * // use a splat object
 * // runs the az login command  e.g. az login --use-device-code
 * // run() will send the output to stdout and stderror
 * await az({ splat: { command: ["login"] },  useDeviceCode: true }).run();
 *
 * let result await = az(["login", "--use-device-code"]);
 * console.log(result.code);
 * console.log(result.text());
 *
 * // using SplatObject
 * result = await az({ splat: { command: ["login"] }})
 * console.log(result.code);
 * console.log(result.text());
 * console.log(result.errorText());
 *
 * const json = await az({ splat: { command: ["account", "show"] }}).json();
 * console.log(json);
 * ```
 * @module
 */
export * from "./cli.ts";
export * from "./login.ts";
export * from "./logout.ts";
