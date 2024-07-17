/// <reference types="@nextcloud/typings" />

/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

declare interface Window {
	OC: Nextcloud.v26.OC | Nextcloud.v27.OC;

	// Private state directly from server
	_oc_webroot?: string
	_oc_appswebroots?: Record<string, string|undefined>
}
