/// <reference types="@nextcloud/typings" />

declare interface Window {
    OC: Nextcloud.v25.OC | Nextcloud.v26.OC | Nextcloud.v27.OC;
}
