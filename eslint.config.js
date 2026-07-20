/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and contributors
 */

import { recommendedLibrary } from '@nextcloud/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	...recommendedLibrary,
])
