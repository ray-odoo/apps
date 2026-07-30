/** @odoo-module **/

import { registry } from "@web/core/registry";

const CHATTER_SELECTOR = ".o-mail-Chatter";
const FORM_RENDERER_SELECTOR = ".o_form_renderer";
const CHATTER_ROW_CLASS = "o_chatter_toggle_row";
const READY_CLASS = "toggle_chatter_ready";
const STORAGE_PREFIX = "toggle_chatter_hidden";
const BTN_ID = "toggle_chatter_global_btn";

// --- ToDo App integration -------------------------------------------------
// The ToDo App's chatter is NOT just CSS-hidden: the <Chatter/> component is
// only mounted once the native button fires this bus event, which also
// flips an Owl state flag inside the (now hidden) native control panel and
// chatter-panel widgets. Our button must fire the same event, or "shown"
// clicks on a To-Do record will toggle CSS on an element that doesn't exist.
const TODO_WRAPPER_SELECTOR = ".o_todo_chatter";
const TODO_BUS_EVENT = "TODO:TOGGLE_CHATTER";
const TODO_NATIVE_STORAGE_KEY = "isChatterOpened";
let currentEnv = null;

// --- Default-hidden models (System Parameters) ----------------------------
// Settings > Technical > System Parameters > key "toggle_chatter.default_hidden_models"
// Value: comma-separated technical model names, e.g. "sale.order,some.other.model"
// The chatter starts hidden on these models UNTIL the user manually toggles
// it - after that their explicit choice always wins (see getStoredPref()).
const DEFAULT_HIDDEN_PARAM_KEY = "toggle_chatter.default_hidden_models";
let defaultHiddenModels = new Set();

function getCurrentModelName() {
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
        // Technical model names always contain a dot (e.g. "sale.order");
        // this catches models with no friendly action slug, including nested
        // breadcrumb levels like .../orders/28041/368361/sale.order/11185
        const last = parts[parts.length - 1] || "";
        if (last.includes(".")) {
            return last;
        }
    } catch (e) {
        // fall through to the action-service fallback below
    }
    // Friendly action-url slugs (e.g. "/odoo/orders/28041" for sale.order)
    // never expose the technical model name in the URL, so ask the action
    // service what model the current top-level action is actually showing.
    try {
        return currentEnv?.services?.action?.currentController?.action?.res_model || null;
    } catch (e) {
        return null;
    }
}

async function loadDefaultHiddenModels(orm) {
    try {
        const raw = await orm.call("ir.config_parameter", "get_param", [DEFAULT_HIDDEN_PARAM_KEY, ""]);
        defaultHiddenModels = new Set(
            (raw || "")
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean)
        );
    } catch (e) {
        defaultHiddenModels = new Set();
    }
}

function getTodoWrapper() {
    return document.querySelector(TODO_WRAPPER_SELECTOR);
}

function syncTodoChatter(displayChatter) {
    // Fires the exact event the native (now hidden) button used to fire, so
    // the real Chatter component mounts/unmounts and the wrapper's d-none
    // class stays correct - our CSS class toggle alone can't do this.
    currentEnv?.bus?.trigger(TODO_BUS_EVENT, { displayChatter });
    try {
        // Keeps the native control panel's own onMounted() logic (which
        // still runs even though its button is CSS-hidden) from fighting
        // us on the next page load with a stale preference of its own.
        window.localStorage.setItem(TODO_NATIVE_STORAGE_KEY, displayChatter);
    } catch (e) {
        // ignore
    }
}

function syncTodoOnLoad() {
    const wrapper = getTodoWrapper();
    if (!wrapper || wrapper.dataset.myHideChatterTodoSynced) {
        return;
    }
    wrapper.dataset.myHideChatterTodoSynced = "1";
    const currentlyOpen = !wrapper.classList.contains("d-none");
    const desiredOpen = !getStoredPref();
    if (currentlyOpen !== desiredOpen) {
        syncTodoChatter(desiredOpen);
    }
}

// Prioritize Knowledge icon selectors first
const ANCHOR_SELECTORS = [
    ".o_knowledge_form_view_btn",
    ".o_knowledge_icon",
    ".o_form_view_knowledge_icon",
    ".o_control_panel .o_pager",
    ".o_control_panel_actions",
    ".o_control_panel",
];

function getScopeKey() {
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
        return parts.join("/") || "default";
    } catch (e) {
        return "default";
    }
}

function getStoredPref() {
    try {
        const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${getScopeKey()}`);
        if (raw === "1") {
            return true;
        }
        if (raw === "0") {
            return false;
        }
    } catch (e) {
        return false;
    }
    // No explicit user choice yet on this page - fall back to the
    // configured default for this model, if any.
    const modelName = getCurrentModelName();
    return !!(modelName && defaultHiddenModels.has(modelName));
}

function setStoredPref(hidden) {
    try {
        window.localStorage.setItem(`${STORAGE_PREFIX}:${getScopeKey()}`, hidden ? "1" : "0");
    } catch (e) {
    }
}

function getVisibleFormRenderer() {
    const roots = document.querySelectorAll(FORM_RENDERER_SELECTOR);
    for (const el of roots) {
        if (el.offsetParent !== null) {
            return el;
        }
    }
    return null;
}

function getAnchor() {
    for (const sel of ANCHOR_SELECTORS) {
        const el = document.querySelector(sel);
        if (el) {
            return el;
        }
    }
    return null;
}

function setButtonState(btn, hidden) {
    const icon = btn.querySelector("i");
    if (icon) {
        icon.className = hidden ? "fa fa-comments-o" : "fa fa-comments";
    }
    btn.classList.toggle("toggle_chatter_btn_active", hidden);
    btn.title = hidden ? "Show chatter" : "Hide chatter";
}

function createGlobalButton() {
    let btn = document.getElementById(BTN_ID);
    if (btn) {
        return btn;
    }

    btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.className = "toggle_chatter_btn";

    const icon = document.createElement("i");
    btn.appendChild(icon);
    setButtonState(btn, getStoredPref());

    btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const root = getVisibleFormRenderer();
        if (!root) {
            return;
        }
        const hidden = root.classList.toggle("o_chatter_hidden");
        root.classList.add(READY_CLASS);
        setButtonState(btn, hidden);
        setStoredPref(hidden);

        if (getTodoWrapper()) {
            syncTodoChatter(!hidden);
        }
    });

    return btn;
}

function dockButton(btn) {
    const root = getVisibleFormRenderer();
    const anchor = getAnchor();

    if (!root || !anchor) {
        btn.style.display = "none";
        return;
    }

    // Check if anchor is a Knowledge button element
    const isKnowledge = anchor.matches(".o_knowledge_form_view_btn, .o_knowledge_icon, .o_form_view_knowledge_icon");

    if (isKnowledge) {
        if (btn.previousElementSibling !== anchor) {
            anchor.insertAdjacentElement("afterend", btn);
        }
    } else if (btn.parentElement !== anchor) {
        anchor.appendChild(btn);
    }

    btn.style.display = "inline-flex";
    setButtonState(btn, root.classList.contains("o_chatter_hidden"));
}

function applyStoredPref(root) {
    root.classList.toggle("o_chatter_hidden", getStoredPref());
    root.classList.add(READY_CLASS);
}

function tagChatterRow(chatterEl) {
    const root = chatterEl.closest(FORM_RENDERER_SELECTOR);
    if (!root) {
        return;
    }
    const container = chatterEl.parentElement;
    if (container) {
        container.classList.add(CHATTER_ROW_CLASS);
    }
    applyStoredPref(root);
}

function scan(node) {
    if (!node || node.nodeType !== 1) {
        return;
    }
    if (node.matches && node.matches(FORM_RENDERER_SELECTOR)) {
        applyStoredPref(node);
    }
    if (node.querySelectorAll) {
        node.querySelectorAll(FORM_RENDERER_SELECTOR).forEach(applyStoredPref);
    }

    if (node.matches && node.matches(CHATTER_SELECTOR)) {
        tagChatterRow(node);
    }
    if (node.querySelectorAll) {
        node.querySelectorAll(CHATTER_SELECTOR).forEach(tagChatterRow);
    }
}

export const chatterToggleService = {
    dependencies: ["orm", "action"],
    async start(env, { orm }) {
        currentEnv = env;
        await loadDefaultHiddenModels(orm);

        const btn = createGlobalButton();

        scan(document.body);
        syncTodoOnLoad();
        dockButton(btn);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach((node) => scan(node));
            }
            syncTodoOnLoad();
            dockButton(btn);
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });

        window.addEventListener("popstate", () => scan(document.body));

        return { observer };
    },
};

registry.category("services").add("toggle_chatter_service", chatterToggleService);