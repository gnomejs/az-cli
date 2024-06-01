import type { CommandOptions } from "@gnome/exec";
import { az, type AzCommand } from "./cli.ts";
import type { GlobalArgs } from "./types.d.ts";
import { env } from "jsr:@gnome/env@^0.1.0";

/**
 * Represents the arguments for the login command.
 */
export interface LoginArgs extends GlobalArgs {
    /**
     * Specifies whether to allow login without any subscriptions.
     */
    allowNoSubscriptions?: boolean;

    /**
     * The federated token to use for authentication.
     */
    federatedToken?: string;

    /**
     * Specifies whether to use identity authentication.
     */
    identity?: boolean;

    /**
     * The password to use for authentication. This can also be the client secret.
     */
    password?: string;

    /**
     * Specifies whether to use service principal authentication.
     */
    servicePrincipal?: boolean;

    /**
     * The scope for the authentication.
     */
    scope?: string;

    /**
     * The tenant ID for the authentication.
     */
    tenant?: string;

    /**
     * Specifies whether to use device code authentication.
     */
    useDeviceCode?: boolean;

    /**
     * The username to use for authentication. This can also be the clientId.
     */
    username: string;

    /**
     * Specifies whether to use certificate serial number issuer authentication.
     */
    useCertSnIssuer?: boolean;
}

/**
 * Login to a vault server.
 *
 * @param args The command arguments. @see LoginArgs
 * @param options The command options. @see CommandOptions
 * @returns The VaultCommand instance.
 */
export function login(args: LoginArgs, options?: CommandOptions): AzCommand {
    args.splat = args.splat ?? {};
    args.splat.command = ["login"];

    return az(args, options);
}

export interface AutoLoginArgs extends LoginArgs {
    interactive?: boolean;
    subscriptionId?: string;
}

/**
 * Automatically logs in to Azure CLI. The function will check if the user is already logged in
 * and set the subscription if provided.
 *
 * @description
 * This function will attempt to login to Azure CLI using the following methods:
 * - Managed Identity
 * - Service Principal
 * - Interactive
 *
 * The following environment variables are used to determine the login method:
 * - AZURE_MSI - 'true' or '1'
 * - AZURE_CLIENT_ID
 * - AZURE_CLIENT_SECRET
 * - AZURE_TENANT_ID
 *
 * @param args - Optional arguments for auto login.
 * @param options - Optional command options.
 * @returns A boolean indicating whether the login was successful.
 */
export async function autoLogin(args?: AutoLoginArgs, options?: CommandOptions): Promise<boolean> {
    options = options ?? {};
    options.stdin ??= "inherit";
    options.stdout ??= "inherit";
    args = args ?? {} as AutoLoginArgs;

    const { interactive, subscriptionId } = args;

    if (interactive !== undefined) {
        delete args["interactive"];
    }

    if (subscriptionId !== undefined) {
        delete args["subscriptionId"];
    }

    const r1 = await az(["account", "list", "--refresh"], options);
    if (r1.code === 0) {
        if (subscriptionId) {
            const r2 = await az(["account", "set", "--subscription", subscriptionId], options);
            if (r2.code === 0) {
                return true;
            }
        }

        return true;
    }

    let { identity, username, servicePrincipal, password, tenant } = args;

    if (!identity) {
        const msi = env.get("AZURE_MSI");
        identity = msi === "true" || msi === "1";
    }

    if (!username) {
        const clientId = env.get("AZURE_CLIENT_ID");
        if (clientId) {
            username = clientId;
        }
    }

    if (identity) {
        const params = ["login", "--identity"];
        if (username) {
            params.push("--username", username);
        }

        const r1 = await az(params, options);
        if (r1.code === 0) {
            if (subscriptionId) {
                const r2 = await az(["account", "set", "--subscription", subscriptionId], options);
                if (r2.code === 0) {
                    return true;
                }
            }

            return true;
        }
    }

    if (password === undefined) {
        password = env.get("AZURE_CLIENT_SECRET");
    }

    if (tenant === undefined) {
        tenant = env.get("AZURE_TENANT_ID");
    }

    if (tenant && username && password && servicePrincipal) {
        const params = [
            "login",
            "--service-principal",
            "--username",
            username,
            "--password",
            password,
            "--tenant",
            tenant,
        ];
        const r1 = await az(params, options);
        if (r1.code === 0) {
            if (subscriptionId) {
                const r2 = await az(["account", "set", "--subscription", subscriptionId], options);
                if (r2.code === 0) {
                    return true;
                }
            }

            return true;
        }
    }

    if (interactive) {
        const params = ["login"];

        if (args.useDeviceCode) {
            params.push("--use-device-code");
        }

        if (args.allowNoSubscriptions) {
            params.push("--allow-no-subscriptions");
        }

        const r1 = await az(params, options);
        if (r1.code === 0) {
            if (subscriptionId) {
                const r2 = await az(["account", "set", "--subscription", subscriptionId], options);
                if (r2.code === 0) {
                    return true;
                }
            }

            return true;
        }
    }

    return false;
}
