/**
 * @copyright 2024 Ferdinand Thiessen <opensource@fthiessen.de
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { describe, expect, test } from 'vitest'
import { getAppRootUrl, getRootUrl } from '../lib/index'

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
	})

	test('with given web root', () => {
		window._oc_webroot = '/nextcloud'
		expect(getRootUrl()).toBe('/nextcloud')
	})

	test('without web root configured', () => {
		window._oc_webroot = undefined
		window.location.pathname = '/index.php/apps/files'
		expect(getRootUrl()).toBe('')
	})

	test('with implicit web root', () => {
		window._oc_webroot = undefined
		window.location.pathname = '/nextcloud/index.php/apps/files'
		expect(getRootUrl()).toBe('/nextcloud')
	})

	// TODO: This seems to be wrong, would expect `/nextcloud`
	test('with implicit web root and path rename', () => {
		window._oc_webroot = undefined
		window.location.pathname = '/nextcloud/apps/files'
		expect(getRootUrl()).toBe('/nextcloud/apps')
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
