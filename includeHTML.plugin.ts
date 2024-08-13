import { Plugin } from "vite";
import path from "path";
import fs from "fs";

/**
 * Renders a template string with the values from the provided locals object.
 *
 * @param {string} template - The template string to render.
 * @param {Record<string, unknown>} locals - The object containing the values to replace in the template.
 * @return {string} The rendered template string.
 */
function renderTemplate(template: string, locals: Record<string, unknown>): string {
    const result = template.replace(/{{\s*([^}\s]+)\s*}}/g, (match: string, key: string) => {
        return locals[key] !== undefined ? String(locals[key]) : "";
    });
    return result;
}

/**
 * Parses a locals string into a JavaScript object.
 *
 * @param {string} localsString - The locals string to parse.
 * @return {Record<string, unknown>} The parsed JavaScript object.
 */
function parseLocals(localsString: string): Record<string, unknown> {
    if (!localsString) {
        return {};
    }
    try {
        const trimmedString = localsString.replace(/^\s*|\s*$/g, "");
        const strippedString = trimmedString.replace(/^'([\s\S]*)'$/, "$1");
        const result = JSON.parse(strippedString);
        return result;
    } catch (error) {
        console.error("Error parsing locals:", error);
        console.error("Problematic string:", localsString);
        return {};
    }
}

/**
 * Processes includes in the given HTML string recursively.
 *
 * @param {string} html - The HTML string to process.
 * @param {string} parentDir - The parent directory of the HTML file.
 * @param {Record<string, unknown>} [parentLocals={}] - The parent locals object.
 * @returns {string} The processed HTML string.
 */
function processIncludes(
    html: string,
    parentDir: string,
    parentLocals: Record<string, unknown> = {}
): string {
    const includeRegex =
        /<include\s+src="(.+?)"(?:\s+locals='([\s\S]*?)')?(?:\s+locals="([\s\S]*?)")?\s*><\/include>/g;

    return html.replace(includeRegex, (...args: string[]) => {
        const [, src, singleQuoteLocals, doubleQuoteLocals] = args;
        const filePath = path.resolve(parentDir, src);

        let content = "";
        try {
            content = fs.readFileSync(filePath, "utf-8");
        } catch (err) {
            console.error(`Error reading file: ${filePath}`, err);
            return "";
        }

        let locals = { ...parentLocals };
        const localsString = singleQuoteLocals || doubleQuoteLocals;
        if (localsString) {
            locals = { ...locals, ...parseLocals(localsString) };
        }

        return renderTemplate(content, locals);
    });
}

/**
 * Creates a Vite plugin that processes HTML includes.
 * 
 * @returns {Plugin} The Vite plugin.
 */
export function htmlIncludePlugin(): Plugin {
    return {
        name: 'html-include-plugin',

        transformIndexHtml: {
            order: 'pre',
            handler(html: string, context) {
                return processIncludes(html, path.dirname(context.filename));
            },
        },

        buildStart() {
            function findHtmlFiles(dir: string, fileList: string[] = []) {
                const files = fs.readdirSync(dir);

                files.forEach(file => {
                    const filePath = path.join(dir, file);
                    const stat = fs.lstatSync(filePath);

                    if (stat.isDirectory()) {
                        findHtmlFiles(filePath, fileList);
                    } else if (filePath.endsWith('.template.html')) {
                        fileList.push(filePath);
                    }
                });

                return fileList;
            }

            const htmlFiles = findHtmlFiles(path.resolve(__dirname, 'src/entries/'));
            htmlFiles.forEach(file => {
                this.addWatchFile(file);
            })
        }
    };
}