/**
 * If the app path needs to be provided through the CI,
 * interpolate the following string.
 */
const CI_APP_ROOT = "__CI_APP_ROOT__";

/**
 * If the app path needs to be provided by an environment
 * variable, make sure the variable is assigned to the
 * following:
 */
const ENV_APP_ROOT = process.env.ENV_APP_ROOT;

/**
 * If neither of the other approaches are used, fallback
 * to the default app root.
 */
const FALLBACK_APP_ROOT = "/";

/**
 * Retrieve the application root, the application root is used
 * as the base of where content is served and where the application
 * is hosted.
 * There are multiple approaches that will be used, in the following
 * priority:
 * [1] Interpolated by CI.
 * [2] Retrieved using an environment variable.
 * [3] Fallback to default value
 * @example: If the site is hosted on "https://example.com/i-live-here",
 * then the assets will need to be served from "/i-live-here".
 */
function getAppRoot() {
    // Compare against the template string but ensure
    // that the template string comparison isn't interpolated
    // itself.
    if (CI_APP_ROOT !== "__CI_APP_ROOT_" + "_") {
        return CI_APP_ROOT;
    }

    if (ENV_APP_ROOT != null) {
        return ENV_APP_ROOT;
    }

    return FALLBACK_APP_ROOT;
}

exports["getAppRoot"] = getAppRoot;