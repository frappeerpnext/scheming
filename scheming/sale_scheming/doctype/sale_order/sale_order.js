frappe.ui.form.on('Sale Order', {
    refresh:function(frm){
        if(!frm.doc.__islocal){

			frm.dashboard.add_indicator(__("QUANTITY: {0}",[frm.doc.total_quantity]) ,"blue");
			frm.dashboard.add_indicator(__("AMOUNT: {0}",[format_currency(frm.doc.total_cost)]) ,"blue");
			frm.dashboard.add_indicator(__("AMOUNT: {0}",[format_currency(frm.doc.total_amount)]) ,"blue");

			frm.dashboard.add_indicator(__("Forecast Cost: {0}",[format_currency(frm.doc.forecast_cost)]) ,"orange");
			frm.dashboard.add_indicator(__("Forecast Amount: {0}",[format_currency(frm.doc.forecast_amount)]) ,"orange");
			frm.dashboard.add_indicator(__("Forecast Profit: {0}",[format_currency(frm.doc.forecast_profit)]) ,"orange");

			frm.dashboard.add_indicator(__("Actual QTY: {0}",[frm.doc.actual_quantity]) ,"red");
			frm.dashboard.add_indicator(__("Actual Cost: {0}",[format_currency(frm.doc.actual_cost)]) ,"red");
			frm.dashboard.add_indicator(__("Actual Amount: {0}",[format_currency(frm.doc.actual_amount)]) ,"red");
			frm.dashboard.add_indicator(__("Actual Profit: {0}",[format_currency(frm.doc.actual_profit)]) ,"red");

			frm.dashboard.add_indicator(__("BALANCE QUANTITY: {0}",[frm.doc.total_quantity - frm.doc.actual_quantity]) ,"green");
			frm.dashboard.add_indicator(__("BALANCE AMOUNT: {0}",[format_currency( frm.doc.forecast_amount -  frm.doc.actual_amount)]) ,"green");
			 
		}
        set_query_gift(frm)
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
    },
    gift_percentage(frm) {

        frm.doc.max_gift_amount = (frm.doc.gift_percentage || 0) * (frm.doc.forecast_profit / 100)
        refresh_field('max_gift_amount');

    }
});


frappe.ui.form.on('Sale Order Gift', {
    quantity: function (frm, cdt, cdn) {
        let doc = locals[cdt][cdn];
        update_gift_amount(frm, doc)
    },

    price: function (frm, cdt, cdn) {
        let doc = locals[cdt][cdn];
        update_gift_amount(frm, doc)
    },
    gift_remove: function (frm) {

        frm.set_value('total_gift_quantity', frm.doc.gift.reduce((n, d) => n + (d.quantity || 0), 0));
        frm.set_value('total_gift_amount', frm.doc.gift.reduce((n, d) => n + (d.total_amount || 0), 0));
        frm.set_value('gift_balance', frm.doc.max_gift_amount - frm.doc.total_gift_amount);

        set_query_gift(frm);


    }

})



function update_gift_amount(frm, doc) {
    doc.total_amount = doc.quantity * doc.price;

    refresh_field('gift');
    frm.set_value('total_gift_quantity', frm.doc.gift.reduce((n, d) => n + (d.quantity || 0), 0));
    frm.set_value('total_gift_amount', frm.doc.gift.reduce((n, d) => n + (d.total_amount || 0), 0));
    frm.set_value('gift_balance', frm.doc.max_gift_amount - frm.doc.total_gift_amount);

    set_query_gift(frm);

}

function set_query_gift(frm) {
    frm.set_query("gift", "gift", function () {
        return {
            filters: [
                ["Gift", "total_amount", "<=", frm.doc.gift_balance]
            ]
        }
    });
}