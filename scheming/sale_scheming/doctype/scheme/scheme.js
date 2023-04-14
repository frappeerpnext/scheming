// Copyright (c) 2023, Tes Pheakdey and contributors
// For license information, please see license.txt


frappe.ui.form.on("Scheme", {
	refresh(frm) {
        if(!frm.doc.__islocal){
            var iframe = document.createElement('iframe');
            iframe.height="1122";
            iframe.width="100%";
            iframe.style="border:none"
        iframe.src = '/printview?doctype=Scheme&name=' + frm.doc.name +  '&format=' + frappe.get_meta("Scheme").fields.find(r=>r.fieldname=='product_list').default + '&no_letterhead=1&settings=%7B%7D&_lang=en&show_toolbar=0&view=ui';
            document.getElementById('product_list').appendChild(iframe);
        }
	},
});
