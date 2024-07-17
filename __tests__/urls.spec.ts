/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeAll, beforeEach, describe, expect, it, test } from 'vitest'
import { generateOcsUrl, generateRemoteUrl, generateUrl } from '../lib/index'

declare global {
	interface Window {
		_oc_appswebroots?: Record<string, string|undefined>
		_oc_webroot?: string
		OC?: Record<string, unknown>
	}
}

describe('URL generation', () => {
	beforeAll(() => {
		window.OC = {
			coreApps: ['', 'admin', 'log', 'core/search', 'core', '3rdparty'],
		}
	})

	describe('generateRemoteUrl', () => {
		beforeEach(() => {
			window._oc_webroot = ''
		})

		it('uses base URL by default', () => {
			expect(generateRemoteUrl('dav')).toBe(`${window.location.origin}/remote.php/dav`)
		})

		it('replaces base URL with given one', () => {
			const baseURL = 'https://remote-url.com'
			expect(generateRemoteUrl('dav', { baseURL })).toBe(`${baseURL}/remote.php/dav`)
		})

		it('includes webroot', () => {
			window._oc_webroot = '/nextcloud'
			expect(generateRemoteUrl('dav')).toBe(`${window.location.origin}/nextcloud/remote.php/dav`)
		})
	})


	describe('generateOcsUrl', () => {
		beforeEach(() => {
			window._oc_webroot = ''
		})

		it('uses OCSv2 by default', () => {
			expect(generateOcsUrl('/foo/bar')).toBe(`${window.location.href}ocs/v2.php/foo/bar`)
		})

		it('can use OCSv1', () => {
			expect(generateOcsUrl('/foo/bar', undefined, { ocsVersion: 1 })).toBe(`${window.location.href}ocs/v1.php/foo/bar`)
		})

		it('replaces base URL with given one', () => {
			const baseURL = 'https://remote-url.com'
			expect(generateOcsUrl('/foo/bar', undefined, { baseURL })).toBe(`${baseURL}/ocs/v2.php/foo/bar`)
		})

		it('starts with webroot', () => {
			window._oc_webroot = '/nextcloud'
			expect(generateOcsUrl('/foo/bar')).toBe(`${window.location.href}nextcloud/ocs/v2.php/foo/bar`)
		})

		it('replaces parameters', () => {
			expect(generateOcsUrl('/foo/{bar}', { bar: 'hello' })).toBe(`${window.location.href}ocs/v2.php/foo/hello`)
		})
	})

	describe('generateUrl', () => {
		beforeEach(() => {
			window.OC.config = { modRewriteWorking: false }
			window._oc_webroot = ''
		})

		it('starts with webroot', () => {
			window._oc_webroot = '/nextcloud'
			expect(generateUrl('/foo/bar')).toBe('/nextcloud/index.php/foo/bar')
		})

		it('works without webroot', () => {
			(window.OC.config as Record<string, unknown>).modRewriteWorking = true
			// meaning it injects '/' at the beginning
			expect(generateUrl('foo')).toBe('/foo')
		})

		it('replaces base URL with given one', () => {
			const baseURL = 'https://remote-url.com'
			expect(generateUrl('/foo/bar', undefined, { baseURL })).toBe(`${baseURL}/index.php/foo/bar`)
		})

		it('respects disabled mod-rewrite', () => {
			expect(generateUrl('/foo/bar')).toMatch(/index\.php/)
		})

		it('respects mod-rewrite', () => {
			(window.OC.config as Record<string, unknown>).modRewriteWorking = true

			expect(generateUrl('/foo/bar')).not.toMatch(/index\.php/)
		})

		it('force disable mod-rewrite', () => {
			(window.OC.config as Record<string, unknown>).modRewriteWorking = true

			expect(generateUrl('/foo/bar', undefined, { noRewrite: true })).toMatch(/index\.php/)
		})

		it('replaces string parameters', () => {
			expect(generateUrl('/foo/{bar}', { bar: 'hello' })).toBe('/index.php/foo/hello')
		})

		it('replaces numeric parameters', () => {
			expect(generateUrl('/foo/{bar}', { bar: 123 })).toBe('/index.php/foo/123')
		})

		it('escapes parameters', () => {
			expect(generateUrl('/foo/{bar}', { bar: 'hello world' })).toBe('/index.php/foo/hello%20world')
		})

		it('can disabled escaping of parameters', () => {
			expect(generateUrl('/foo/{bar}', { bar: 'hello world' }, { escape: false })).toBe('/index.php/foo/hello world')
		})

		it('does not replace invalid parameters', () => {
			expect(generateUrl('/foo/{bar}', { bar: true })).toBe('/index.php/foo/%7Bbar%7D')
		})

		it('does not replace invalid parameters and keeps curly brackets when unescaped', () => {
			expect(generateUrl('/foo/{bar}', { bar: true }, { escape: false })).toBe('/index.php/foo/{bar}')
		})
	})
})
