/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { generateUrl } from './base.ts'

export interface AvatarUrlOptions {
	/**
	 * Should a dark theme variant of the avatar be used.
	 *
	 * @default false
	 */
	isDarkTheme?: boolean

	/**
	 * If the given user is is a guest user.
	 * This is needed as guest users use a different API endpoint.
	 *
	 * @default false
	 */
	isGuestUser?: boolean

	/**
	 * Avatar image size.
	 * The backend only supports 64px and 512px.
	 *
	 * @default 64
	 */
	size?: 64 | 512
}

/**
 * Get the avatar URL for a given user.
 *
 * @param user - The user id to lookup the avatar of
 * @param options - Options for configuring the avatar
 * @return Relative URL for the avatar
 */
export function generateAvatarUrl(user: string, options?: AvatarUrlOptions): string {
	// backend only supports 64 and 512px
	// so we only request the needed size for better caching of the request.
	const size = (options?.size || 64) <= 64
		? 64
		: 512

	const guestUrl = options?.isGuestUser
		? '/guest'
		: ''
	const themeUrl = options?.isDarkTheme
		? '/dark'
		: ''

	return generateUrl(`/avatar${guestUrl}/{user}/{size}${themeUrl}`, {
		user,
		size,
	})
}
