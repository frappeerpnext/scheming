frappe.listview_settings['Sale Order'] = {
    add_fields: ['is_scheme'],
    hide_name_column: false, // hide the last column which shows the `name`
    // set this to true to apply indicator function on draft documents too
    has_indicator_for_draft: false,

    get_indicator(doc) {
        
        if(doc.docstatus==1){
            if(doc.is_scheme==1){ 
                return [__("Scheme"), "green"];
            } 
        }
        
    },
}
