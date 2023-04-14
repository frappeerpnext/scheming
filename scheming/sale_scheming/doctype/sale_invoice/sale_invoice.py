# Copyright (c) 2023, Tes Pheakdey and contributors
# For license information, please see license.txt

import frappe
from py_linq import Enumerable
from frappe.model.document import Document

class SaleInvoice(Document):
	def validate(self):
		for d in self.products:
			d.total_cost = (d.quantity or 1) * (d.cost or 0)
			d.total_amount = (d.quantity or 1) * (d.price or 0)
			d.for_sale = d.allow_scheme == "Yes"


		self.total_quantity = Enumerable(self.products).sum(lambda x: x.quantity or 0)
		self.total_cost =  Enumerable(self.products).sum(lambda x: x.total_cost or 0)
		self.total_amount =  Enumerable(self.products).sum(lambda x: x.total_amount or 0)
		self.scheme_quantity =  Enumerable(self.products).where(lambda x: x.allow_scheme == 'Yes').sum(lambda x: x.quantity or 0)
		self.scheme_amount=  Enumerable(self.products).where(lambda x: x.allow_scheme == 'Yes').sum(lambda x: x.total_amount or 0)
		self.total_profit = self.scheme_amount - self.total_cost

	def on_submit(self):
		update_sale_order(self)
	def on_cancel(self):
		update_sale_order(self) 

def update_sale_order(self):
	for d in self.products:
			data = frappe.db.sql("select coalesce(sum(quantity),0) as quantity from `tabSale Invoice Product` where docstatus=1 and sale_order_product_id ='{}'".format(d.sale_order_product_id), as_dict=1)
			qty = data[0]["quantity"]
			frappe.db.sql("update `tabSale Order Product` set delivered_qty={0}, remaining_qty=quantity - {0} where name='{1}'".format(qty,d.sale_order_product_id ))
		
	#sum total delivery qty and amount to sale order
	data = frappe.db.sql("select coalesce(sum(delivered_qty),0) as quantity, coalesce(sum(delivered_qty*price),0) as amount from `tabSale Order Product` where docstatus=1 and parent ='{}'".format(self.sale_order), as_dict=1)
	frappe.db.sql("update `tabSale Order` set total_delivered_quantity={0}, total_delivered_amount={1} where name='{2}'".format(data[0]["quantity"],data[0]["amount"], self.sale_order))
