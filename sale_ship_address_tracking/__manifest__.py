# -*- coding: utf-8 -*-
{
    'name': "Shipping Address Tracking",

    'summary': """
        Leave a Chatter message when users change 
        the Shipping Address on a Sales Order.""",

    'description': """
        If a Customer changes their mind about where to have something shipped, it might
        be useful to have a record of this change for audit purposes.  This module alters
        the definition of the partner_shipping_id field on the sale.order model to achieve this.
    """,

    'author': "Odoo Training Modules",
    'website': "http://www.odoo.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/odoo/addons/base/module/module_data.xml
    # for the full list
    'category': 'Sales',
    'version': '12.0.1.0',
    'license': 'LGPL-3',

    # any module necessary for this one to work correctly
    'depends': ['sale'],

    # always loaded
    'data': [
    ],
    # only loaded in demonstration mode
    'demo': [
    ],

    
}
