#!/usr/bin/env node
/**
 * Simple script to generate ts client from nswag cli.
 * This is required as passing the nswag config into
 * the cli fails to use the `input` option. Therefore,
 * this gets the nswag config and converts it into cli
 * args which correctly uses the `input`.
 */
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const swaggerParser = require("swagger-parser");
const { exec: childExec } = require("child_process");
const { promisify } = require("util");
const tmp = require("tmp");
const rimraf = require("rimraf");
/* tslint:disable no-console */

const exec = promisify(childExec);
const paccess = promisify(fs.access);
const pwrite = promisify(fs.writeFile);
const NSWAG_CONFIG_PATH = path.resolve(__dirname, "../nswag.json");

const primraf = (url, options = {}) => {
    return new Promise(res => {
        rimraf(url, options, err => {
            if (err) {
                return res(false);
            }
            return res(true);
        });
    });
};

const message = {
    creating: function(config) {
        const text = removeWhitespace(`
            =========================
            NSWAG TS CLIENT GENERATOR
            =========================
            > Retrieving the swagger spec from ${config.input}...
        `);

        console.log(chalk.green(text));
    },
    error: function(ex) {
        if (typeof ex !== "object") {
            console.log(chalk.red(ex));
            throw new Error(ex);
        }

        console.log(chalk.red(ex.message));
        throw ex;
    },
    success: function(msg) {
        console.log(chalk.green(msg));
    },
};

function removeWhitespace(str) {
    return str.replace(/^\s+|\s+$/gm, "");
}

function canWriteToFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return true;
    }

    return paccess(filePath, fs.W_OK);
}

function getCommandLineOptions(config) {
    if (typeof config !== "object") {
        message.error("You need to specify a config");
    }

    return Object.keys(config)
        .filter(key => config[key] !== "" && config[key] != null)
        .map(key => `/${key}:${config[key]}`)
        .join(" ");
}

function normalizeOption(option) {
    if (Array.isArray(option)) {
        return option;
    }

    if (typeof tag === "string" || option instanceof RegExp) {
        return [option];
    }

    return option;
}

function handleExcludeOption(option) {
    const { tag, path: filePath } = option;
    const parserOptions = {};

    parserOptions.tags = normalizeOption(tag);
    parserOptions.paths = normalizeOption(filePath);

    return parserOptions;
}

function handleParserOptions(options) {
    const parserOptions = {};

    if (options.exclude != null) {
        parserOptions.exclude = handleExcludeOption(options.exclude);
    }

    return parserOptions;
}

function hasSameArrayItem(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return false;
    }
    return arr1.some(item => arr2.indexOf(item) !== -1);
}

function excludePathMethods(pathMethods, compare) {
    return Object.keys(pathMethods).reduce(
        (methods, method) => {
            const pathMethod = pathMethods[method];
            if (compare(pathMethod)) {
                methods.included[method] = pathMethod;
            } else {
                methods.excluded[method] = pathMethod;
            }
            return methods;
        },
        { included: {}, excluded: {} },
    );
}

function removeEmptyPaths(paths) {
    return Object.keys(paths).reduce((all, defPath) => {
        if (Object.keys(paths[defPath]).length !== 0) {
            all[defPath] = paths[defPath];
        }
        return all;
    }, {});
}

function flattenMethods(defPath, methods) {
    return Object.keys(methods).map(method => {
        return {
            method,
            path: defPath,
            ...methods[method],
        };
    });
}

function getParameterReferences(parameters) {
    if (!Array.isArray(parameters)) {
        return [];
    }

    return parameters.reduce((refs, parameter) => {
        if (parameter.schema != null && typeof parameter.schema.$ref === "string") {
            const schemaRef = parameter.schema.$ref;
            return refs.concat([getDefinition(schemaRef)]);
        }
        return refs;
    }, []);
}

function getResponsesReferences(responses) {
    if (typeof responses !== "object") {
        return [];
    }

    return Object.keys(responses).reduce((refs, status) => {
        if (responses[status].schema != null && typeof responses[status].schema.$ref === "string") {
            const schemaRef = responses[status].schema.$ref;
            return refs.concat([getDefinition(schemaRef)]);
        }
        return refs;
    }, []);
}

function getDefinition(definition) {
    return definition.replace("#/definitions/", "");
}

function walkDefinitionReferences(definitions, definitionPath) {
    if (definitionPath == null) {
        return [];
    }

    const definition = definitions[definitionPath];

    if (definition == null) {
        return [];
    }

    if (definition.properties == null) {
        return [definitionPath];
    }

    const all = Object.keys(definition.properties).reduce((allRefs, prop) => {
        const value = definition.properties[prop];

        if (typeof value.$ref === "string") {
            const refPath = getDefinition(value.$ref);
            const refs = walkDefinitionReferences(definitions, refPath);
            return allRefs.concat(refs);
        }

        return allRefs;
    }, []);

    return all.concat([definitionPath]);
}

function walkMethodReferences(definitions, methodRefs) {
    return methodRefs.reduce((allRefs, methodRef) => {
        const definitionPath = getDefinition(methodRef);
        const allDefinitionRefs = walkDefinitionReferences(definitions, definitionPath);
        return allRefs.concat(allDefinitionRefs);
    }, []);
}

function findDefinitionReferences(definitions, methods, deep) {
    const refs = methods.reduce((all, method) => {
        let methodRefs = [...getParameterReferences(method.parameters), ...getResponsesReferences(method.responses)];

        if (deep) {
            methodRefs = walkMethodReferences(definitions, methodRefs);
        }

        return all.concat(methodRefs);
    }, []);

    const dedupeRefs = [...new Set(refs)];

    return dedupeRefs;
}

function removeUnusedDefinitions(definitions, includedMethods, excludedMethods) {
    const usedReferences = findDefinitionReferences(definitions, includedMethods, true);
    const excludeReferences = findDefinitionReferences(definitions, excludedMethods, false);

    const removeReferences = excludeReferences.filter(ref => {
        if (usedReferences.some(usedRef => usedRef === ref)) {
            return false;
        }
        return true;
    });

    return Object.keys(definitions).reduce((filteredDefinitions, definition) => {
        if (!removeReferences.some(ref => ref === definition)) {
            filteredDefinitions[definition] = definitions[definition];
        }
        return filteredDefinitions;
    }, {});
}

function handleParserExclude(api, options) {
    if (api == null || typeof api !== "object") {
        return api;
    }

    const { tags, paths } = options;
    let includedMethods = [];
    let excludedMethods = [];

    if (tags != null) {
        api.paths = Object.keys(api.paths).reduce((allPaths, defPath) => {
            const { included, excluded } = excludePathMethods(api.paths[defPath], method => {
                return !hasSameArrayItem(method.tags, tags);
            });

            const flattenedInclude = flattenMethods(defPath, included);
            const flattenedExclude = flattenMethods(defPath, excluded);

            includedMethods = [...includedMethods, ...flattenedInclude];
            excludedMethods = [...excludedMethods, ...flattenedExclude];
            allPaths[defPath] = included;

            return allPaths;
        }, {});
    }

    if (paths != null) {
        api.paths = Object.keys(api.paths).reduce((allPaths, defPath) => {
            if (!paths.some(excludePath => excludePath === defPath)) {
                allPaths[defPath] = api.paths[defPath];
            }
            return allPaths;
        }, {});
    }

    api.paths = removeEmptyPaths(api.paths);

    const defs = removeUnusedDefinitions(api.definitions, includedMethods, excludedMethods);

    api.definitions = defs;

    return api;
}

async function parse(url, parseOptions = {}) {
    const { exclude } = handleParserOptions(parseOptions);

    try {
        const api = await swaggerParser.parse(url);

        if (exclude != null) {
            handleParserExclude(api, exclude);
        }

        return Promise.resolve(api);
    } catch (ex) {
        return Promise.reject(ex);
    }
}

async function createTempSwaggerConfig(config) {
    try {
        const tmpObj = tmp.fileSync({
            discardDescriptor: true,
            mode: 0666,
            postfix: ".json",
        });
        await pwrite(tmpObj.name, JSON.stringify(config), "utf8");

        return Promise.resolve({
            cleanup: tmpObj.removeCallback,
            tempFileName: tmpObj.name,
        });
    } catch (ex) {
        return Promise.reject(ex);
    }
}

async function init(opts, parserOptions) {
    const config = opts.codeGenerators.swaggerToTypeScriptClient;

    message.creating(config);

    if (config.output != null) {
        let canWrite = false;

        try {
            canWrite = await canWriteToFile(config.output);
        } catch (ex) {
            message.error(ex);
        }

        if (!canWrite) {
            const removed = await primraf(config.output);

            if (removed) {
                message.success(`> Removed existing file at ${config.output}...`);
            } else {
                message.error("Failed to write to file. You do not have permissions to write to the file.");
            }
        }
    }

    try {
        const parsed = await parse(config.input, parserOptions);
        const { tempFileName, cleanup } = await createTempSwaggerConfig(parsed);
        config.input = tempFileName;

        const cmdOptions = getCommandLineOptions(config);

        await exec(`nswag swagger2tsclient ${cmdOptions}`);
        message.success(`> Saved client to ${config.output}.`);

        cleanup();
    } catch (ex) {
        console.log(ex);
        message.error(ex);
    }
}

let nswagOptions = {};

try {
    nswagOptions = require(NSWAG_CONFIG_PATH);
} catch (ex) {
    message.error(ex);
}

init(nswagOptions);