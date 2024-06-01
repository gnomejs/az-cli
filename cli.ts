import { Command, type CommandArgs, type CommandOptions, type SplatObject } from "@gnome/exec";
import { pathFinder } from "@gnome/exec/path-finder";

pathFinder.set("az", {
    name: "az",
    windows: [
        "${ProgramFiles}\\Microsoft SDKs\\Azure\\CLI2\\az.cmd",
        "${ProgramFiles}\\Microsoft SDKs\\Azure\\CLI2\\az",
    ],
    linux: [
        "/usr/bin/az",
    ],
});

/**
 * Represents an az command.
 *
 * When using the SplatObject for CommandArgs, the
 * `prefix` and `assign` properties are set to "-" and "=" respectively.
 */
export class AzCommand extends Command {
    /**
     * Creates a new instance of the `AzCommand` class.
     * @param args The command arguments.
     * @param options The command options.
     */
    constructor(args?: CommandArgs, options?: CommandOptions) {
        super("az", args, options);

        if (this.args && (typeof this.args !== "string" && !Array.isArray(args))) {
            const args = this.args as SplatObject;
            args.splat ??= {};
            args.splat.prefix = "--";
        }
    }
}

/**
 * Executes the az command line using the AzCommand class.
 *
 * @param args The command arguments.
 * @param options The command options.
 * @returns a new instance of the AzCommand class.
 *
 * @example
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
 */
export function az(args?: CommandArgs, options?: CommandOptions): AzCommand {
    return new AzCommand(args, options);
}
