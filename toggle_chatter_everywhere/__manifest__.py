# -*- coding: utf-8 -*-
{
    'name': 'Toggle Chatter Everywhere',
    'version': '2.0',
    'category': 'Proof of Concept',
    'summary': 'Show/Hide Chatter on every Document Type (like the ToDo App)',
    'description': """
Replicates the native ToDo App's own "toggle chatter" control-panel button
and mechanism, generalized to every model's Form view.

- The button is inserted into the control panel template at the exact same
  structural position the native ToDo App uses (before the pager), so it
  renders reliably for both new/unsaved and saved records.
- The ToDo App itself is untouched: it registers its own separate view type
  with its own explicit Controller/ControlPanel/Renderer, so this module's
  patch of the shared base Form view never reaches it. No duplicate button,
  no conflict, nothing to disable.
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
            'toggle_chatter_everywhere/static/src/js/form_view_patch.js',
            'toggle_chatter_everywhere/static/src/xml/chatter_toggle_control_panel.xml',
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
