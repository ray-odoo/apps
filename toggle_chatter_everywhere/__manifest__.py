# -*- coding: utf-8 -*-
{
    'name': "toggle_chatter_everwhere",
    'summary': """Toggle Chatter Everywhere""",
    'description': """
        - Systemwide Show/Hide Chatter (like ToDo App)
        """,
    'author': 'Odoo Valencia',
    'website': 'https://www.odoo.com/',
    'category': 'Custom Development',
    'version': '1.0',
    'license': 'OPL-1',
    'depends': ['web'],
    'assets': {
        'web.assets_backend': [
            'toggle_chatter_everwhere/static/src/js/chatter_toggle_service.js',
            'toggle_chatter_everwhere/static/src/scss/chatter_toggle.scss',
        ],
    },
    'images': [
        'static/description/toggle_chatter_cover.png',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
