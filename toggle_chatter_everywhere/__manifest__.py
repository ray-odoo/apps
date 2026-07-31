# -*- coding: utf-8 -*-
{
    'name': 'Toggle Chatter Everywhere',
    'version': '2.0',
    'category': 'Proof of Concept',
    'summary': 'Show/Hide Chatter on every Document Type (like the ToDo App)',
    'description': """
Replicates the native ToDo App's own "toggle chatter" control-panel button
and mechanism, generalized to every model's Form view.

- Patches the base ControlPanel class itself (not one specific view's
  registered component), so this reaches every app's own custom Form
  Controller/ControlPanel too - including ones we don't know about yet -
  since they all still call super.setup() up to this same base class,
  regardless of how differently each one is templated.
- The button is docked next to the pager via the control panel's own DOM
  (self-healing on every re-render), so it renders reliably for both
  new/unsaved and saved records.
- The ToDo App's own native button is detected and left alone - our button
  simply doesn't add itself wherever the native one is already present.
- Settings > Technical > System Parameters > "toggle_chatter_everywhere.default_hidden_models"
  accepts a comma-separated list of technical model names that should start
  with the chatter hidden by default (e.g. "wls.order.calculator,sale.order").
  A user's own explicit toggle on a given model always overrides this default
  afterwards.
""",
    'author': 'Odoo Technical Marketing',
    'website': 'https://www.odoo.com/',
    'license': 'OPL-1',
    'depends': ['mail', 'web'],
    'assets': {
        'web.assets_backend': [
            'toggle_chatter_everywhere/static/src/js/chatter_defaults.js',
            'toggle_chatter_everywhere/static/src/js/chatter_toggle_control_panel.js',
            'toggle_chatter_everywhere/static/src/scss/chatter_toggle.scss',
        ],
    },
    'images': [
        'static/description/toggle_chatter_cover.png',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
