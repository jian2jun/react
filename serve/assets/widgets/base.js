define(["jquery", "bootstrap", "widget"], function($, bootstrap){

    $.widget("ued.base", {

        _replaceSlot: function(slot, value){

            if($.isFunction(value)){
                value = value.call(this.element[0], slot);
            }

            if(value != null){
                slot.replaceWith(value);
            }
        }
    });

});