# Copyright (c) 2023, Tes Pheakdey and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime
from frappe.model.document import Document

class SchemeProduct(Document):
	def validate(self):
		
		if self.scheme_name:
			scheme = frappe.get_doc("Scheme", self.scheme_name)
		
			if  not (datetime.strptime(str(scheme.start_date), "%Y-%m-%d") <= datetime.strptime(str(self.start_date), "%Y-%m-%d")  <= datetime.strptime(str(scheme.end_date), "%Y-%m-%d") ):
				frappe.throw("Start date must be in date range of scheme name")
			if  not (datetime.strptime(str(scheme.start_date), "%Y-%m-%d") <= datetime.strptime(str(self.end_date), "%Y-%m-%d")  <= datetime.strptime(str(scheme.end_date), "%Y-%m-%d") ):
				frappe.throw("End date must be in date range of scheme name")


	def on_update(self):
		update_scheme(self)
	
	def after_delete(self):
		update_scheme(self)
		
def update_scheme(self):
	sql = "select coalesce(sum(max_quantity * cost),0) as cost, coalesce(sum(max_quantity*price),0) as price from `tabScheme Product` where scheme_name='{}'".format(self.scheme_name)
	data = frappe.db.sql(sql,as_dict=1)

	if  data:

		doc = frappe.get_doc("Scheme",self.scheme_name)
		doc.total_cost = data[0]["cost"]
		doc.total_price = data[0]["price"]
		doc.total_profit = doc.total_price - doc.total_cost
		doc.max_gift_amount= doc.total_profit * (doc.gift_percent_tag/100)
		doc.gift_balance = doc.max_gift_amount - doc.total_gift_amount
		

		doc.save()
