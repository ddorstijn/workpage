/**
 * @typedef {{ name: string, url: URL }} Link
 */

/**
 * @typedef {{ name: string, color: string, links: Link[] }} Linkgroup
 */

/**
 * @typedef {{ name: String }} Task
 */

/**
 * @typedef {{ used: Date, todo: Task[], done: Task[], linkgroups: Linkgroup[] }} Project
 */
