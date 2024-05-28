import type { SplatObject } from "@gnome/exec";

/**
 * Represents the global arguments for the command-line interface.
 */
export interface GlobalArgs extends SplatObject {
    /**
     * Enables debug mode.
     */
    debug?: boolean;

    /**
     * Displays help information.
     */
    help?: boolean;

    /**
     * Only shows errors in the output.
     */
    onlyShowErrors?: boolean;

    /**
     * Specifies the output format. Possible values are:
     * - 'json': JSON format
     * - 'jsonc': JSON with comments format
     * - 'none': No output
     * - 'table': Table format
     * - 'tsv': Tab-separated values format
     * - 'yaml': YAML format
     * - 'yamlc': YAML with comments format
     */
    output?: "json" | "jsonc" | "none" | "table" | "tsv" | "yaml" | "yamlc";

    /**
     * Specifies a query string.
     */
    query?: string;

    /**
     * Enables verbose mode.
     */
    verbose?: boolean;
}
