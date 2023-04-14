# Copyright (c) 2023, Tes Pheakdey and contributors
# For license information, please see license.txt

import frappe
from py_linq import Enumerable
from frappe.model.document import Document

class Quotation(Document):
	def validate(self):
		for d in self.products:
			d.total_cost = (d.quantity or 1) * (d.cost or 0)
			d.total_amount = (d.quantity or 1) * (d.price or 0)

		self.total_quantity = Enumerable(self.products).sum(lambda x: x.quantity or 0)
		self.total_cost =  Enumerable(self.products).sum(lambda x: x.total_cost or 0)
		self.total_amount =  Enumerable(self.products).sum(lambda x: x.total_amount or 0)
		self.scheme_quantity =  Enumerable(self.products).where(lambda x: x.is_scheme_product == 'Yes').sum(lambda x: x.quantity or 0)
		self.scheme_amount=  Enumerable(self.products).where(lambda x: x.is_scheme_product == 'Yes').sum(lambda x: x.total_amount or 0)
		self.total_profit = self.scheme_amount - self.total_cost


		if self.is_scheme:
			if not self.start_date:
				frappe.throw("Please enter start date")
				
			if not self.end_date:
				frappe.throw("Please enter end date")
