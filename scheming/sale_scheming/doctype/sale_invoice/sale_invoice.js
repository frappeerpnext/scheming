frappe.ui.form.on('Sale Invoice', {
    refresh:function(frm){
  
    },
    setup: function (frm) {
        setTimeout(function () {
 
            if (frm.doc.sale_order) {

                if (frm.doc.__islocal) {

                    const data = frappe.get_doc("Sale Order", frm.doc.sale_order)
                    frm.doc.is_scheme = data.is_scheme;
                    frm.refresh_field('is_scheme');
                    
                    frm.doc.start_date = data.start_date;
                    frm.refresh_field('start_date');
                    
                    frm.doc.end_date = data.end_date;
                    frm.refresh_field('end_date');

                    data.products.forEach(r => {
                        if(r.quantity - r.delivered_qty){ 
                            var row = frappe.model.add_child(frm.doc, 'Sale Invoice Product', 'products');
                            
                            row.product_code = r.product_code;
                            row.product_name = r.product_name;
                            row.quantity = r.quantity - r.delivered_qty;
                            row.cost = r.cost;
                            row.price = r.price;
                            row.total_cost = r.cost * row.quantity;
                            row.total_amount = r.price * row.quantity;
                            row.allow_scheme = r.allow_scheme;
                            row.sale_order_product_id = r.name;
                        }
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