# -*- coding: utf-8 -*-
{
    'name': 'Toggle Chatter Everywhere',
    'version': '1.0',
    'category': 'Proof of Concept',
    'summary': 'Show/Hide Chatter on every Document Type (like the ToDo App)',
    'author': 'Odoo Technical Marketing',
    'website': 'https://www.odoo.com/',
    'license': 'OPL-1',
    'depends': ['web'],
    'assets': {
        'web.assets_backend': [
            'toggle_chatter_everywhere/static/src/js/chatter_toggle_service.js',
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
