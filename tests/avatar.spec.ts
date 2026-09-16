/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { generateAvatarUrl } from '../lib/avatar.ts'

describe('generateAvatarUrl', () => {
	it('should return correct relative URL for user avatar', () => {
		expect(generateAvatarUrl('alice')).toBe('//index.php/avatar/alice/64')
		expect(generateAvatarUrl('john', { size: 64 })).toBe('//index.php/avatar/john/64')
	})

	it('should return correct relative URL with fixed sizes', () => {
		/// @ts-expect-error testing invalid value
		expect(generateAvatarUrl('alice', { size: 0 })).toBe('//index.php/avatar/alice/64')
		/// @ts-expect-error testing invalid value
		expect(generateAvatarUrl('alice', { size: -1 })).toBe('//index.php/avatar/alice/64')
		expect(generateAvatarUrl('john', { size: 64 })).toBe('//index.php/avatar/john/64')
		/// @ts-expect-error testing invalid value
		expect(generateAvatarUrl('john', { size: 65 })).toBe('//index.php/avatar/john/512')
		expect(generateAvatarUrl('john', { size: 512 })).toBe('//index.php/avatar/john/512')
	})

	it('should return correct relative URL for user avatar in dark mode if enforced', () => {
		expect(generateAvatarUrl('alice', { isDarkTheme: true })).toBe('//index.php/avatar/alice/64/dark')
		expect(generateAvatarUrl('john', { isDarkTheme: true, size: 512 })).toBe('//index.php/avatar/john/512/dark')
	})

	it('should return correct relative URL for guest avatar', () => {
		expect(generateAvatarUrl('alice', { isGuestUser: true })).toBe('//index.php/avatar/guest/alice/64')
		expect(generateAvatarUrl('john', { isGuestUser: true, size: 512 })).toBe('//index.php/avatar/guest/john/512')
	})

	it('should return correct relative URL for guest avatar in dark mode', () => {
		expect(generateAvatarUrl('alice', { isGuestUser: true, isDarkTheme: true })).toBe('//index.php/avatar/guest/alice/64/dark')
		expect(generateAvatarUrl('john', { isGuestUser: true, isDarkTheme: true, size: 512 })).toBe('//index.php/avatar/guest/john/512/dark')
	})

	it('should append guestFallback query parameter if set', () => {
		expect(generateAvatarUrl('alice', { guestFallback: true })).toBe('//index.php/avatar/alice/64?guestFallback=true')
		expect(generateAvatarUrl('alice', { guestFallback: false })).toBe('//index.php/avatar/alice/64')
	})

	it('should append v query parameter if version is set', () => {
		expect(generateAvatarUrl('alice', { version: 3 })).toBe('//index.php/avatar/alice/64?v=3')
		expect(generateAvatarUrl('alice', { version: 'abc' })).toBe('//index.php/avatar/alice/64?v=abc')
	})

	it('should append both query parameters when combined', () => {
		expect(generateAvatarUrl('alice', { guestFallback: true, version: 3 })).toBe('//index.php/avatar/alice/64?guestFallback=true&v=3')
	})

	it('should still append guestFallback for guest avatars even though the backend ignores it', () => {
		expect(generateAvatarUrl('alice', { isGuestUser: true, guestFallback: true })).toBe('//index.php/avatar/guest/alice/64?guestFallback=true')
	})
})
