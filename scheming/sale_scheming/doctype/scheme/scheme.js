// Copyright (c) 2023, Tes Pheakdey and contributors
// For license information, please see license.txt


frappe.ui.form.on("Scheme", {
    refresh(frm) {

        if (!frm.doc.__islocal) {


            frm.dashboard.add_indicator(__("Total Cost: {0}", [format_currency(frm.doc.total_cost)]), "blue");
            frm.dashboard.add_indicator(__("Total Price: {0}", [format_currency(frm.doc.total_price)]), "blue");
            frm.dashboard.add_indicator(__("Gross Profit: {0}", [format_currency(frm.doc.total_price - frm.doc.total_cost)]), "green");
            frm.dashboard.add_indicator(__("Scheme Amount: {0}", [format_currency(frm.doc.max_gift_amount)]), "green");
            frm.dashboard.add_indicator(__("Gift Amount: {0}", [format_currency(frm.doc.total_gift_amount)]), "green");
            frm.dashboard.add_indicator(__("Net Profit: {0}", [format_currency(frm.doc.total_profit - frm.doc.total_gift_amount)]), "green");


            //set intro text when give percent tage is over 100%
            if (frm.doc.gift_percent_tag > 100) {
                frm.set_intro("Your scheme is lose about " + format_currency(frm.doc.max_gift_amount - frm.doc.total_profit), "red")

            }

            var iframe = document.createElement('iframe');
            iframe.height = "1122";
            iframe.width = "100%";
            iframe.style = "border:none"
            iframe.src = '/printview?doctype=Scheme&name=' + frm.doc.name + '&format=' + frappe.get_meta("Scheme").fields.find(r => r.fieldname == 'product_list').default + '&no_letterhead=1&settings=%7B%7D&_lang=en&show_toolbar=0&view=ui';
            document.getElementById('product_list').appendChild(iframe);
        }

        set_query_gift(frm)

    },
    gift_percent_tag(frm) {

        frm.doc.max_gift_amount = (frm.doc.gift_percent_tag || 0) * (frm.doc.total_profit / 100)
        refresh_field('max_gift_amount');

    }
});

frappe.ui.form.on('Scheme Gift', {
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