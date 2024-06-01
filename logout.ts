import { az, type AzCommand } from "./cli.ts";
import type { GlobalArgs } from "./types.d.ts";
import type { CommandOptions } from "@gnome/exec";

/**
 * Represents the arguments for the logout command.
 */
export interface LogoutArgs extends GlobalArgs {
    /**
     * The username to logout. Defaults to the current user.
     */
    username?: string;
}

/**
 * Logs out of the Azure CLI.
 * @param args The command arguments.
 * @returns The command result.
 */
export function logout(args: LogoutArgs, options?: CommandOptions): AzCommand {
    args ??= {} as LogoutArgs;
    args.splat ??= {};
    args.splat.command = ["logout"];

    return az(args, options);
}
