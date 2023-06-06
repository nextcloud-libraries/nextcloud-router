/// <reference types="@nextcloud/typings" />

declare interface Window {
    OC: Nextcloud.v23.OC | Nextcloud.v24.OC | Nextcloud.v25.OC;
}
