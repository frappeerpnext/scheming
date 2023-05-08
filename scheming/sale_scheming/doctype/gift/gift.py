# Copyright (c) 2023, Tes Pheakdey and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class Gift(Document):
	def validate(self):
		self.total_amount  = self.price * self.quantity
