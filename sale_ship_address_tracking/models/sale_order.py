# -*- coding: utf-8 -*-

from odoo import models, fields, api

class SaleOrder(models.Model):
    _inherit = "sale.order"

    partner_shipping_id = fields.Many2one('res.partner',
           string='Delivery Address',
           readonly=True,
           required=True,
           states={
               'draft': [('readonly', False)],
               'sent': [('readonly', False)],
               'sale': [('readonly', False)]},
           help="Delivery address for current sales order.",
           track_visibility='onchange')




