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

import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { generateFilePath, imagePath, linkTo } from '../lib/index'

declare global {
	interface Window {
		_oc_appswebroots?: Record<string, string|undefined>
		_oc_webroot?: string
		OC?: Record<string, unknown>
	}
}

describe('Path generation', () => {
	beforeAll(() => {
		window.OC = {
			coreApps: ['', 'admin', 'log', 'core/search', 'core', '3rdparty'],
		}
	})

	describe('generateFilePath', () => {
		beforeEach(() => {
			window._oc_webroot = ''
			window._oc_appswebroots = { forms: '/apps-extra/forms' }
		})

		test('non core PHP index file', () => {
			expect(generateFilePath('forms', '', 'index.php')).toBe('/index.php/apps/forms')
		})

		// TODO: This feels wrong, I would expect `/index.php/apps/forms/templates`
		test('non core PHP index files with type', () => {
			expect(generateFilePath('forms', 'templates', 'index.php')).toBe('/index.php/apps/forms')
		})

		test('non core PHP file', () => {
			expect(generateFilePath('forms', '', 'version.php')).toBe('/index.php/apps/forms/version.php')
		})

		test('non core PHP file with type', () => {
			expect(generateFilePath('forms', 'templates', 'version.php')).toBe('/index.php/apps/forms/templates/version.php')
		})

		test('non core file', () => {
			expect(generateFilePath('forms', '', 'file.js')).toBe('/apps-extra/forms/file.js')
		})

		test('non core file with type', () => {
			expect(generateFilePath('forms', 'js', 'file.js')).toBe('/apps-extra/forms/js/file.js')
		})

		test('core PHP file with ajax type', () => {
			expect(generateFilePath('admin', 'ajax', 'file.php')).toBe('/admin/ajax/file.php')
		})

		test('special core PHP file with ajax type', () => {
			expect(generateFilePath('core', 'ajax', 'file.php')).toBe('/index.php/core/ajax/file.php')
		})

		test('empty app file path', () => {
			expect(generateFilePath('', '', 'file.php')).toBe('/file.php')
		})

		test('empty app file path with type', () => {
			expect(generateFilePath('', 'ajax', 'file.php')).toBe('/ajax/file.php')
		})
	})

	describe('linkTo', () => {
		test('non core PHP index file', () => {
			expect(linkTo('forms', 'index.php')).toBe('/index.php/apps/forms')
		})

		test('non core PHP file', () => {
			expect(linkTo('forms', 'version.php')).toBe('/index.php/apps/forms/version.php')
		})

		test('non core file', () => {
			expect(linkTo('forms', 'file.js')).toBe('/apps-extra/forms/file.js')
		})

		test('empty app file path', () => {
			expect(linkTo('', 'file.php')).toBe('/file.php')
		})
	})

	describe('imagePath', () => {
		test('non core file without extension', () => {
			expect(imagePath('forms', 'color')).toBe('/apps-extra/forms/img/color.svg')
		})

		test('non core file with extension', () => {
			expect(imagePath('forms', 'color.png')).toBe('/apps-extra/forms/img/color.png')
		})

		test('core file without extension', () => {
			expect(imagePath('admin', 'color')).toBe('/admin/img/color.svg')
		})

		test('core file with extension', () => {
			expect(imagePath('admin', 'color.png')).toBe('/admin/img/color.png')
		})

		test('empty app without extension', () => {
			expect(imagePath('', 'color')).toBe('/img/color.svg')
		})

		test('empty app without extension', () => {
			expect(imagePath('', 'color.png')).toBe('/img/color.png')
		})
	})
})
