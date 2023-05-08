# Copyright (c) 2023, Tes Pheakdey and contributors
# For license information, please see license.txt

import frappe
from py_linq import Enumerable
from frappe.model.document import Document

class SaleOrder(Document):
	def validate(self):
		for d in self.products:
			d.total_cost = (d.quantity or 1) * (d.cost or 0)
			d.total_amount = (d.quantity or 1) * (d.price or 0)
		



		self.total_quantity = Enumerable(self.products).sum(lambda x: x.quantity or 0)
		self.total_cost =  Enumerable(self.products).sum(lambda x: x.total_cost or 0)
		self.total_amount =  Enumerable(self.products).sum(lambda x: x.total_amount or 0)

		validate_forcase_cost(self)

		self.max_gift_amount = (self.forecast_profit or 0) * (self.gift_percentage or 0) /100
		self.gift_balance = self.max_gift_amount or 0  - self.total_gift_amount or 0
		
def validate_forcase_cost(self):
	for d in self.forecast_order_products:
		product_price =get_product_price(self.customer,d.date, d.product,d.quantity)
		price = product_price["price"]
		d.quantity = d.quantity or 1
		d.cost =product_price["cost"]
		d.price =  price
		d.total_cost = (d.quantity or 1) * (d.cost or 0)
		d.total_amount = d.quantity * (d.price or 0)
		d.profit = d.total_amount - d.total_cost

	self.forecast_quantity=  Enumerable(self.forecast_order_products).sum(lambda x: x.quantity or 0)
	self.forecast_cost=  Enumerable(self.forecast_order_products).sum(lambda x: x.total_cost or 0)
	self.forecast_amount=  Enumerable(self.forecast_order_products).sum(lambda x: x.total_amount or 0)
	self.forecast_profit=  Enumerable(self.forecast_order_products).sum(lambda x: x.profit or 0)


def get_product_price(customer,date, product,quantity):
	sql= "select coalesce(max(cost),0) as cost, coalesce(max(price),0) as price from `tabProduct Price` where customer='{0}' and product_code='{1}' and {2} between min_quantity and max_quantity and '{3}' between start_date and end_date "
	sql = sql.format(customer, product, quantity, date)
	data = frappe.db.sql(sql, as_dict=1)
	cost = 0.0
	price = 0.0
 
	 
	if data:
		
		cost = data[0]["cost"]
		price = data[0]["price"]
	
	if cost == 0 and price == 0:
		product = frappe.get_doc("Product",product)
		cost = product.cost
		price = product.price
	return {
		"cost":cost,
		"price":price
	}