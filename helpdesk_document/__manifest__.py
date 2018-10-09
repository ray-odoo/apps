# -*- coding: utf-8 -*-
{
    'name': "Helpdesk Document for Enterprise Edition",

    'summary': """
        Tickets can now link to existing Documents -
        such as Orders, Products, Invoices, etc.""",

    'description': """
        If a Customer submits a Helpdesk ticket that is related to an existing Odoo Document, such as a Sales Order,
        users can now select the document type and document in the ticket.  Valid Document types can be configured by
        editing the field defintion in the helpdesk_ticket.py file.
    """,

    'author': "Odoo Training Modules",
    'website': "http://www.odoo.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/odoo/addons/base/module/module_data.xml
    # for the full list
    'category': 'After-Sales',
    'version': '12.0.1.0',
    'license': 'LGPL-3',

    # any module necessary for this one to work correctly
    'depends': ['helpdesk'],

    # always loaded
    'data': [
        'views/helpdesk_ticket.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
    ],
    
}
