import { Plugin, usePlugin } from "@odoo/owl";
import { ORM } from "@web/core/orm_plugin";
import { services } from "@web/core/services";

// Settings > Technical > System Parameters > key below.
// Value: comma-separated technical model names, e.g. "wls.order.calculator,sale.order"
// Models in this list start with the chatter hidden UNTIL the user
// manually toggles it once - after that their explicit choice always wins
// (see chatter_toggle_control_panel.js).
export const DEFAULT_HIDDEN_PARAM_KEY = "toggle_chatter_everywhere.default_hidden_models";

/**
 * Global plugin (Odoo 20 replacement of the former "chatterDefaults" service).
 * It reads the system parameter once, in the background, and exposes:
 *  - `defaultHiddenModels`: Set of technical model names
 *  - `ready`: promise resolved once the parameter has been read (never rejects)
 */
export class ChatterDefaultsPlugin extends Plugin {
    orm = usePlugin(ORM);

    setup() {
        this.defaultHiddenModels = new Set();
        this.ready = this._load();
    }

    async _load() {
        try {
            const raw = await this.orm.silent.call("ir.config_parameter", "get_param", [
                DEFAULT_HIDDEN_PARAM_KEY,
                "",
            ]);
            for (const model of (raw || "").split(",")) {
                const trimmed = model.trim();
                if (trimmed) {
                    this.defaultHiddenModels.add(trimmed);
                }
            }
        } catch {
            // No parameter set, or read failed - default hidden list stays empty.
        }
    }
}

services.add(ChatterDefaultsPlugin);

/**
 * Best-effort technical model name of whatever is currently displayed.
 * Two sources, tried in order:
 *  1. The URL, when it contains the raw technical name - true for models
 *     with no "friendly" action-url slug, and for nested breadcrumb levels
 *     (e.g. .../orders/28041/368361/wls.order.calculator/11185).
 *  2. The action service, for models accessed via a friendly slug at the
 *     top level (e.g. sale.order at /odoo/orders/28041), where the URL
 *     never exposes the technical name at all.
 *
 * @param {Object} actionService the "action" service/plugin (has `currentController`)
 */
export function getCurrentModelName(actionService) {
    try {
        const hashMatch = (window.location.hash || "").match(/[#&]model=([^&]+)/);
        if (hashMatch) {
            return decodeURIComponent(hashMatch[1]);
        }
        const path = window.location.pathname.replace(/\/+$/, "");
        const parts = path.split("/").filter(Boolean);
        if (parts.length && /^\d+$/.test(parts[parts.length - 1])) {
            parts.pop();
        }
        const last = parts[parts.length - 1] || "";
        if (last.includes(".")) {
            return last;
        }
    } catch {
        // fall through to the action-service fallback below
    }
    try {
        return actionService?.currentController?.action?.res_model || null;
    } catch {
        return null;
    }
}
