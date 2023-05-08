# Copyright (c) 2023, Tes Pheakdey and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from py_linq import Enumerable
class Scheme(Document):
	def validate(self):
		
		self.total_profit =( self.total_price or 0) -( self.total_cost or 0)
		
		self.max_gift_amount=( self.total_profit or 0) * ((self.gift_percent_tag or 0)/100)

		for d in self.gift:
			d.total_amount = (d.price or 0) * (d.quantity or 1)
			
		self.total_gift_amount =   Enumerable(self.gift).sum(lambda x: (x.total_amount or 0))
		self.total_gift_quantity =   Enumerable(self.gift).sum(lambda x: (x.quantity or 0))
		self.gift_balance = self.max_gift_amount - self.total_gift_amount

		if self.max_gift_amount<self.total_gift_amount:
			frappe.throw("Gift amount cannot greater than max gift amount")


	# @frappe.whitelist()
	# def get_summary(self):
	# 	return {
	# 		"total_cost":10,
	# 		"total_price":78
	# 	}
