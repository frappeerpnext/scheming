frappe.ui.form.on('Sale Order', {
    refresh:function(frm){
        if(!frm.doc.__islocal && frm.doc.docstatus == 1){

			frm.dashboard.add_indicator(__("SCHEME QUANTITY: {0}",[frm.doc.scheme_quantity]) ,"blue");
			frm.dashboard.add_indicator(__("SCHEME AMOUNT: {0}",[format_currency(frm.doc.scheme_amount)]) ,"blue");
			frm.dashboard.add_indicator(__("ACTUAL QUANTITY: {0}",[frm.doc.total_delivered_quantity]) ,"orange");
			frm.dashboard.add_indicator(__("ACTUAL AMOUNT: {0}",[format_currency(frm.doc.total_delivered_amount)]) ,"orange");
			 
			frm.dashboard.add_indicator(__("BALANCE QUANTITY: {0}",[frm.doc.scheme_quantity - frm.doc.total_delivered_quantity]) ,"green");
			frm.dashboard.add_indicator(__("BALANCE AMOUNT: {0}",[format_currency( frm.doc.scheme_amount -  frm.doc.total_delivered_amount)]) ,"green");
			 
		}
    },
    setup: function (frm) {


        setTimeout(function () {
 
            if (frm.doc.quotation_number) {

                if (frm.doc.__islocal) {

                    const data = frappe.get_doc("Quotation", frm.doc.quotation_number)
                    frm.doc.is_scheme = data.is_scheme;
                    frm.refresh_field('is_scheme');
                    
                    frm.doc.start_date = data.start_date;
                    frm.refresh_field('start_date');
                    
                    frm.doc.end_date = data.end_date;
                    frm.refresh_field('end_date');

                    data.products.forEach(r => {
                        var row = frappe.model.add_child(frm.doc, 'Sale Order Product', 'products');
                        row.product_code = r.product_code;
                        row.product_name = r.product_name;
                        row.quantity = r.quantity;
                        row.cost = r.cost;
                        row.price = r.price;
                        row.total_cost = r.total_cost;
                        row.total_amount = r.total_amount;
                        row.allow_scheme = r.is_scheme_product;
                    });
                    frm.refresh_field('products');
                }
            }
        }, 1000)



        // frm.set_query("customer", function() {
        //     return {
        //         "filters": {
        //             "customer_group": "Commercial"
        //         }
        //     };
        // });
    }
});