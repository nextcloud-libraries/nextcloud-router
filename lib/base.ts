/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Options for URL parameter replacement
 */
export interface UrlOptions {
	/**
	 * Set to false if parameters should not be URL encoded
	 * @default true
	 */
	escape?: boolean

	/**
	 * True if you want to force index.php being added
	 * @default false
	 */
	noRewrite?: boolean

	/**
	 * OCS version to use
	 * @default 2
	 */
	ocsVersion?: number

	/**
	 * URL to use as a base (defaults to current instance)
	 * @default ''
	 */
	baseURL?: string
}

/**
 * Get an url with webroot to a file in an app
 *
 * @param app - The id of the app the file belongs to
 * @param file the file path relative to the app folder
 * @return URL with webroot to a file
 */
export function linkTo(app: string, file: string): string {
	return generateFilePath(app, '', file)
}

/**
 * Creates a relative url for remote use
 *
 * @param {string} service id
 * @return {string} the url
 */
const linkToRemoteBase = (service: string) => '/remote.php/' + service

/**
 * Creates an absolute url for remote use
 * @param {string} service id
 * @return {string} the url
 * @param {UrlOptions} [options] options for the parameter replacement
 */
export const generateRemoteUrl = (service: string, options?: UrlOptions) => {
	const baseURL = options?.baseURL ?? getBaseUrl()
	return baseURL + linkToRemoteBase(service)
}

/**
 * Get the base path for the given OCS API service
 *
 * @param {string} url OCS API service url
 * @param {object} params parameters to be replaced into the service url
 * @param {UrlOptions} options options for the parameter replacement
 * @return {string} Absolute path for the OCS URL
 */
export const generateOcsUrl = (url: string, params?: object, options?: UrlOptions) => {
	const allOptions = Object.assign({
		ocsVersion: 2,
	}, options || {})

	const version = (allOptions.ocsVersion === 1) ? 1 : 2
	const baseURL = options?.baseURL ?? getBaseUrl()

	return baseURL + '/ocs/v' + version + '.php' + _generateUrlPath(url, params, options)
}

/**
 * Generate a url path, which can contain parameters
 *
 * Parameters will be URL encoded automatically
 *
 * @param {string} url address (can contain placeholders e.g. /call/{token} would replace {token} with the value of params.token
 * @param {object} params parameters to be replaced into the address
 * @param {UrlOptions} options options for the parameter replacement
 * @return {string} Path part for the given URL
 */
const _generateUrlPath = (url: string, params?: object, options?: UrlOptions) => {
	const allOptions = Object.assign({
		escape: true,
	}, options || {})

	const _build = function(text: string, vars: Record<string, unknown>) {
		vars = vars || {}
		return text.replace(/{([^{}]*)}/g,
			function(a: string, b: string) {
				const r = vars[b]
				if (allOptions.escape) {
					return (typeof r === 'string' || typeof r === 'number') ? encodeURIComponent(r.toString()) : encodeURIComponent(a)
				} else {
					return (typeof r === 'string' || typeof r === 'number') ? r.toString() : a
				}
			},
		)
	}

	if (url.charAt(0) !== '/') {
		url = '/' + url
	}

	return _build(url, (params || {}) as Record<string, unknown>)
}

/**
 * Generate the url with webroot for the given relative url, which can contain parameters
 * If options.baseURL is provided, generate the absolute url pointing ro remote server
 *
 * Parameters will be URL encoded automatically
 *
 * @param {string} url address (can contain placeholders e.g. /call/{token} would replace {token} with the value of params.token
 * @param {object} params parameters to be replaced into the url
 * @param {UrlOptions} options options for the parameter replacement
 * @return {string} URL with webroot for the given relative URL
 */
export const generateUrl = (url: string, params?: object, options?: UrlOptions) => {
	const allOptions = Object.assign({
		noRewrite: false,
	}, options || {})

	const baseOrRootURL = options?.baseURL ?? getRootUrl()

	if (window?.OC?.config?.modRewriteWorking === true && !allOptions.noRewrite) {
		return baseOrRootURL + _generateUrlPath(url, params, options)
	}

	return baseOrRootURL + '/index.php' + _generateUrlPath(url, params, options)
}

/**
 * Get the path with webroot to an image file
 * if no extension is given for the image, it will automatically add .svg
 *
 * @param {string} app the app id to which the image belongs
 * @param {string} file the name of the image file
 * @return {string}
 */
export const imagePath = (app: string, file: string) => {
	if (!file.includes('.')) {
		// if no extension is given, use svg
		return generateFilePath(app, 'img', `${file}.svg`)
	}

	return generateFilePath(app, 'img', file)
}

/**
 * Get the url with webroot for a file in an app
 *
 * @param {string} app the id of the app
 * @param {string} type the type of the file to link to (e.g. css,img,ajax.template)
 * @param {string} file the filename
 * @return {string} URL with webroot for a file in an app
 */
export const generateFilePath = (app: string, type: string, file: string) => {
	const isCore = window?.OC?.coreApps?.includes(app) ?? false
	const isPHP = file.slice(-3) === 'php'
	let link = getRootUrl()
	if (isPHP && !isCore) {
		link += `/index.php/apps/${app}`
		if (type) {
			link += `/${encodeURI(type)}`
		}
		if (file !== 'index.php') {
			link += `/${file}`
		}
	} else if (!isPHP && !isCore) {
		link = getAppRootUrl(app)
		if (type) {
			link += `/${type}/`
		}
		if (link.at(-1) !== '/') {
			link += '/'
		}
		link += file
	} else {
		if ((app === 'settings' || app === 'core' || app === 'search') && type === 'ajax') {
			link += '/index.php'
		}
		if (app) {
			link += `/${app}`
		}
		if (type) {
			link += `/${type}`
		}
		link += `/${file}`
	}
	return link
}

/**
 * Return the full base URL where this Nextcloud instance
 * is accessible, with a web root included.
 * For example "https://company.com/nextcloud".
 *
 * @return {string} base URL
 */
export const getBaseUrl = () => window.location.protocol + '//' + window.location.host + getRootUrl()

/**
 * Return the web root path where this Nextcloud instance
 * is accessible, with a leading slash.
 * For example "/nextcloud".
 *
 * @return {string} web root path
 */
export function getRootUrl(): string {
	let webroot = window._oc_webroot

	if (typeof webroot === 'undefined') {
		webroot = location.pathname
		const pos = webroot.indexOf('/index.php/')
		if (pos !== -1) {
			webroot = webroot.slice(0, pos)
		} else {
			const index = webroot.indexOf('/', 1)
			// Make sure to not cut end of path if there is just the webroot like `/nextcloud`
			webroot = webroot.slice(0, index > 0 ? index : undefined)
		}
	}
	return webroot
}

/**
 * Return the web root path for a given app
 * @param {string} app The ID of the app
 */
export function getAppRootUrl(app: string): string {
	const webroots = window._oc_appswebroots ?? {}
	return webroots[app] ?? ''
}
