/** @odoo-module **/

import { onMounted, onPatched, useState } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";
import { patch } from "@web/core/utils/patch";
import { ControlPanel } from "@web/search/control_panel/control_panel";
import { defaultHiddenModels, getCurrentModelName } from "./chatter_defaults";

const STORAGE_PREFIX = "toggle_chatter_everywhere.displayChatter";
const READY_CLASS = "o_chatter_toggle_ready";
const BTN_CLASS = "toggle_chatter_everywhere_btn";

function getStorageKey(env) {
    return `${STORAGE_PREFIX}:${getCurrentModelName(env) || "unknown"}`;
}

function applyToRenderer(displayChatter) {
    const root = document.querySelector(".o_content .o_form_renderer");
    if (root) {
        root.classList.toggle("o_chatter_toggle_hidden", !displayChatter);
        root.classList.add(READY_CLASS);
    }
}

// Patched onto the base ControlPanel class itself (not a specific view's
// registered component) so this reaches EVERY app's own custom
// Controller/ControlPanel too - ToDo, Accounting, and anything else that
// registers its own dedicated form view still calls super.setup() up to
// this same base class, no matter how differently each one is templated.
patch(ControlPanel.prototype, {
    setup() {
        super.setup();
        this.chatterToggleState = useState({ displayChatter: true });
        this.chatterToggleInitialized = false;
        onMounted(() => this.updateChatterToggle());
        onPatched(() => this.updateChatterToggle());
    },

    updateChatterToggle() {
        if (this.env.config?.viewType !== "form") {
            return; // Only Form views have a Chatter to toggle - list/kanban/map/etc.
            // also render a ControlPanel with a pager, but there's nothing for
            // our button to do there.
        }

        const pager = document.querySelector(".o_cp_pager");
        if (!pager) {
            return; // No pager visible right now (e.g. a dialog, or a brand-new
            // record before its first save) - nothing to dock next to yet.
            // We'll get another chance via onPatched once it appears.
        }
        if (pager.parentElement.querySelector(".todo_toggle_chatter")) {
            return; // Native ToDo App button already present - it owns this page, we stay out.
        }

        // Only determine and apply the initial (stored/default) state ONCE,
        // but keep retrying on every mount/patch until the pager actually
        // exists to retry against - a brand-new record has no pager on the
        // very first mount, so the first real opportunity may come later,
        // e.g. right after the record is saved and the panel re-renders.
        if (!this.chatterToggleInitialized) {
            this.chatterToggleInitialized = true;
            const key = getStorageKey(this.env);
            const stored = browser.localStorage.getItem(key);
            let displayChatter;
            if (stored !== null) {
                displayChatter = stored === "1";
            } else {
                const model = getCurrentModelName(this.env);
                displayChatter = !(model && defaultHiddenModels.has(model));
            }
            this.chatterToggleState.displayChatter = displayChatter;
            applyToRenderer(displayChatter);
        }

        let btn = pager.parentElement.querySelector(`.${BTN_CLASS}`);
        if (!btn) {
            btn = document.createElement("a");
            btn.className = `btn btn-light btn-chatter ${BTN_CLASS}`;
            btn.setAttribute("role", "button");
            btn.setAttribute("title", "Toggle chatter");
            btn.setAttribute("data-hotkey", "d");
            btn.innerHTML = '<i class="fa fa-comments"></i>';
            btn.addEventListener("click", () => this.toggleChatterGlobal());
            pager.insertAdjacentElement("beforebegin", btn);
        }
        btn.classList.toggle("active", this.chatterToggleState.displayChatter);
    },

    toggleChatterGlobal() {
        this.chatterToggleState.displayChatter = !this.chatterToggleState.displayChatter;
        browser.localStorage.setItem(
            getStorageKey(this.env),
            this.chatterToggleState.displayChatter ? "1" : "0"
        );
        applyToRenderer(this.chatterToggleState.displayChatter);
        this.updateChatterToggle();
    },
});
