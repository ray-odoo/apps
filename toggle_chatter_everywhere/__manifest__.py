# -*- coding: utf-8 -*-
{
    'name': 'Toggle Chatter Everywhere',
    'version': '2.0',
    'category': 'Proof of Concept',
    'summary': 'Show/Hide Chatter on every Document Type (like the ToDo App)',
    'description': """
Replicates the native ToDo App's own "toggle chatter" control-panel button
and mechanism, generalized to every model's Form view.

- Settings > Technical > System Parameters > "toggle_chatter_everywhere.default_hidden_models"
  accepts a comma-separated list of technical model names that should start
  with the chatter hidden by default (e.g. "sale.order,account.invoice").
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
