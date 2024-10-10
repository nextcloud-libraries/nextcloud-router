/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { getAppRootUrl, getBaseUrl, getRootUrl } from '../lib/index'

declare global {
	interface Window {
		_oc_appswebroots?: Record<string, string|undefined>
		_oc_webroot?: string
	}
}

describe('Web root handling', () => {
	test('empty web root', () => {
		window._oc_webroot = ''
		expect(getRootUrl()).toBe('')
		expect(getBaseUrl()).toBe(window.location.origin)
	})

	test('with given web root', () => {
		window._oc_webroot = '/nextcloud'
		expect(getRootUrl()).toBe('/nextcloud')
		expect(getBaseUrl()).toBe(`${window.location.origin}/nextcloud`)
	})

	test('without web root configured', () => {
		window._oc_webroot = undefined
		window.location.pathname = '/index.php/apps/files'
		expect(getRootUrl()).toBe('')
		expect(getBaseUrl()).toBe(window.location.origin)
	})

	test('with implicit web root', () => {
		window._oc_webroot = undefined
		window.location.pathname = '/nextcloud/index.php/apps/files'
		expect(getRootUrl()).toBe('/nextcloud')
		expect(getBaseUrl()).toBe(`${window.location.origin}/nextcloud`)
	})

	test('with implicit empty web root', () => {
		window._oc_webroot = undefined
		window.location.pathname = '/'
		expect(getRootUrl()).toBe('/')
		expect(getBaseUrl()).toBe(`${window.location.origin}/`)
	})

	test('with implicit web root and path rename', () => {
		window._oc_webroot = undefined
		window.location.pathname = '/nextcloud'
		expect(getRootUrl()).toBe('/nextcloud')
		expect(getBaseUrl()).toBe(`${window.location.origin}/nextcloud`)
	})

	test('with implicit web root on route with path rename', () => {
		window._oc_webroot = undefined
		window.location.pathname = '/nextcloud/apps/files'
		expect(getRootUrl()).toBe('/nextcloud')
		expect(getBaseUrl()).toBe(`${window.location.origin}/nextcloud`)
	})
})

describe('Apps web root handling', () => {
	test('unset app web roots', () => {
		window._oc_appswebroots = undefined
		expect(getAppRootUrl('files')).toBe('')
	})

	test('missing app web root', () => {
		window._oc_appswebroots = { files: '/nextcloud' }
		expect(getAppRootUrl('activity')).toBe('')
	})

	test('configured app web root', () => {
		window._oc_appswebroots = { files: '/nextcloud' }
		expect(getAppRootUrl('files')).toBe('/nextcloud')
	})
})
