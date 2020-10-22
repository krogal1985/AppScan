var dialogsMulti = {
	arr : [],
	newDlg : function(obj){
		this.arr[this.arr.length] = obj;
		
		if ($('.ui-dialog.ui-page-active').dialog().length == 0) // Если нет активных диалогов
			this.show();
	},
	show : function(){
				
		if (this.arr.length > 0){
			this.arr[0].show();
		} else
			$('.ui-dialog').dialog('close');
	},
	del : function(){
		this.arr.shift();
		this.show();
	}		
};


var dialogs = {

 
  confirmDialogInfo: function(text, callback) {
	if (text == "")
		return;
	
	var id = 'dlgINFO1';
	var result = {};

	result.show = function(){

		$("#" + id + " .ui-title").text(text);
		
		$("#" + id +" .btclickOK").on("click." + id, function() {
			
			$(this).off("click." + id);
				
			if (callback)
				callback();
			
			dialogsMulti.del();		
		});
		
		$.mobile.changePage("#" + id);
	};
	
	dialogsMulti.newDlg(result);
		
	return result;
	
},
	
 confirmDialog: function(text, callbackYES, callbackNO) {
	var id = 'dlgINFOConfirm';
	var result = {};

	result.show = function(){
		$("#" + id + " .ui-title").text(text);	
		$("#" + id + " .btclickOK").on("click." + id, function() {

			$(this).off("click." + id);	
			$("#" + id + " .btclickNO").off("click." + id);	

			if (callbackYES)
				callbackYES();
			
			dialogsMulti.del();		
		});
		
		$("#" + id + " .btclickNO").on("click." + id, function() {

			$(this).off("click." + id);	
			$("#" + id + " .btclickOK").off("click." + id);	

			if (callbackNO)
				callbackNO();
			
			dialogsMulti.del();		
		});
		
		
		$.mobile.changePage("#" + id);	
	}
	
	dialogsMulti.newDlg(result);
	
	return result;
},


	
 confirmDialog_old: function(text, callback) {
    var popupDialogId = 'popupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-transition="pop" data-overlay-theme="a" data-theme="a" data-dismissible="false" style="max-width:500px;"> \
                        <div data-role="header" data-theme="a">\
                            <h1>Сообщение</h1>\
                        </div>\
                        <div role="main" class="ui-content">\
                            <h3 class="ui-title">' + text + '</h3>\
                            <a href="#" style="width:20%" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a optionConfirm" data-rel="back">Да</a>\
                            <a href="#" style="width:20%" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a optionCancel" data-rel="back" data-transition="flow">Нет</a>\
                        </div>\
                    </div>')
        .appendTo($.mobile.pageContainer);
		
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (isConfirmed && callback) {
                callback();
            }
        }
    });
    popupDialogObj.popup('open');
    popupDialogObj.find(".optionConfirm").first().on('click', function () {
        popupDialogObj.attr('data-confirmed', 'yes');
    });
},


 confirmDialogInfo_old: function(text, callback) {
	 if (text == '')
		 return;
	 dialogs.dlgInfo("df","dsf");
	 return;
	 
    var popupDialogId = 'popupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-transition="pop" data-overlay-theme="a" data-theme="a" data-dismissible="false" > \
                        <div data-role="header" data-theme="a">\
                            <h1>Сообщение</h1>\
                        </div>\
                        <div role="main" class="ui-content">\
                            <h3 class="ui-title">' + text + '</h3>\
                            <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn ui-btn-a optionConfirm" data-rel="back">OK</a>\
                        </div>\
                    </div>')
        .appendTo($.mobile.pageContainer);
		
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (isConfirmed && callback) {
                callback();
            }
        }
    });
    popupDialogObj.popup('open');
    popupDialogObj.find(".optionConfirm").first().on('click', function () {
        popupDialogObj.attr('data-confirmed', 'yes');
    });
},





 areYouSure: function(text1, text2, button, callback) {
  $("#sure .sure-1").text(text1);
  $("#sure .sure-2").text(text2);
  $("#sure .sure-do").text(button).on("click.sure", function() {
    callback();
    $(this).off("click.sure");
  });
  $.mobile.changePage("#sure");
},


 dlgInfo: function(text1, text2) {
	if (text1 == '')
		return;
	
	$("#dlginfo .sure-1").text(text1);
	$("#dlginfo .sure-2").text(text2);
   	$.mobile.changePage("#dlginfo");
}

};

