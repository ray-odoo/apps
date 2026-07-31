/** @odoo-module **/

import { registry } from "@web/core/registry";

// Settings > Technical > System Parameters > key below.
// Value: comma-separated technical model names, e.g. "wls.order.calculator,sale.order"
// Models in this list start with the chatter hidden UNTIL the user
// manually toggles it once - after that their explicit choice always wins
// (see chatter_toggle_control_panel.js).
export const DEFAULT_HIDDEN_PARAM_KEY = "toggle_chatter_everywhere.default_hidden_models";

export const defaultHiddenModels = new Set();

export const chatterDefaultsService = {
    dependencies: ["orm"],
    async start(env, { orm }) {
        try {
            const raw = await orm.call("ir.config_parameter", "get_param", [
                DEFAULT_HIDDEN_PARAM_KEY,
                "",
            ]);
            for (const model of (raw || "").split(",")) {
                const trimmed = model.trim();
                if (trimmed) {
                    defaultHiddenModels.add(trimmed);
                }
            }
        } catch (e) {
            // No parameter set, or read failed - default hidden list stays empty.
        }
        return {};
    },
};

registry.category("services").add("chatterDefaults", chatterDefaultsService);

/**
 * Best-effort technical model name of whatever is currently displayed.
 * Two sources, tried in order:
 *  1. The URL, when it contains the raw technical name - true for models
 *     with no "friendly" action-url slug, and for nested breadcrumb levels
 *     (e.g. .../orders/28041/368361/wls.order.calculator/11185).
 *  2. The action service, for models accessed via a friendly slug at the
 *     top level (e.g. sale.order at /odoo/orders/28041), where the URL
 *     never exposes the technical name at all.
 */
export function getCurrentModelName(env) {
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
    } catch (e) {
        // fall through to the action-service fallback below
    }
    try {
        return env?.services?.action?.currentController?.action?.res_model || null;
    } catch (e) {
        return null;
    }
}
