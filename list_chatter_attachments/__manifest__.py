# -*- coding: utf-8 -*-
{
    'name': 'List Chatter Attachments',
    'version': '1.0',
    'category': 'Proof of Concept',
    'summary': 'Switches chatter attachments to a list view when there are more than 4 files.',
    'author': 'Odoo Technical Marketing',
    'depends': ['mail', 'web', 'documents'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'list_chatter_attachments/static/src/scss/attachment_list.scss',
            'list_chatter_attachments/static/src/xml/attachment_list.xml',
        ],
    },
    'images': [
        'static/description/list_chatter_attachments_cover.jpg',
    ],
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
    'support': 'Unsupported',
}