/** @odoo-module **/

import { onMounted, useState } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";
import { ControlPanel } from "@web/search/control_panel/control_panel";
import { defaultHiddenModels, getCurrentModelName } from "./chatter_defaults";

const STORAGE_PREFIX = "toggle_chatter_everywhere.displayChatter";
const READY_CLASS = "o_chatter_toggle_ready";

function getStorageKey(env) {
    return `${STORAGE_PREFIX}:${getCurrentModelName(env) || "unknown"}`;
}

function applyToRenderer(displayChatter) {
    // Same document-wide lookup used throughout this module's history -
    // only one form renderer is ever visibly active at a time.
    const root = document.querySelector(".o_content .o_form_renderer");
    if (root) {
        root.classList.toggle("o_chatter_toggle_hidden", !displayChatter);
        root.classList.add(READY_CLASS);
    }
}

export class ChatterToggleControlPanel extends ControlPanel {
    static template = "toggle_chatter_everywhere.ControlPanel";

    setup() {
        super.setup();
        this.chatterState = useState({ displayChatter: true });

        onMounted(() => {
            const key = getStorageKey(this.env);
            let displayChatter;
            const stored = browser.localStorage.getItem(key);
            if (stored !== null) {
                displayChatter = stored === "1";
            } else {
                const model = getCurrentModelName(this.env);
                displayChatter = !(model && defaultHiddenModels.has(model));
            }
            this.chatterState.displayChatter = displayChatter;
            applyToRenderer(displayChatter);
        });
    }

    toggleChatter() {
        this.chatterState.displayChatter = !this.chatterState.displayChatter;
        browser.localStorage.setItem(
            getStorageKey(this.env),
            this.chatterState.displayChatter ? "1" : "0"
        );
        applyToRenderer(this.chatterState.displayChatter);
    }
}
