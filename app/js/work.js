showLoading(true);

//var zayavki = new Zayavki('#var-list-z');

var audioDemo;

var typeDocs = {
    prihod : 'Приход'
}

var typeStates = {
    newPrihod : 'newPrihod'
}
var HistorySer = {
	items : [],
	add : function(item){
		if (this.items.indexOf(item,0) != -1)
			return;
		
		this.items.push(item);
		this.save()
	},
	save : function (){
		localStorage.DB_HistorySer = JSON.stringify(this.items);
	},
	load : function(){
		if (typeof localStorage.DB_HistorySer === 'undefined')
			this.save();
		
		this.items = JSON.parse(localStorage.DB_HistorySer).slice();
	}
	
	
};

var Data = {
    curState : "",
    curDoc : null,
	dataHistSer : [],
	delCurDoc : function(){
		var uid = this.curDoc.uid;
		this.curDoc = null;
		var idx = Data.prihod_Docs.findIndex(function(item, index, array){
			return item.uid == uid;
			
		});
		if (idx > -1){
			this.prihod_Docs.splice(idx, 1);
			this.saveDB();
			this.loadDB();
			$.mobile.changePage('#allDocs');
		}
	},
	getScanItemByUID : function (uid){
		return this.curDoc.scanList.filter(function(e){ return e.uid == uid})[0]	
	},
	getCurretScanItem : function (){
		return this.getScanItemByUID(this.curDoc.curScanItemUID);
	},
	load_cur_doc : function (uid){
		this.clear_form_newscan();
		Data.curDoc = null;
		this.curDoc = this.prihod_Docs.filter(function(e){ return e.uid == uid})[0];
		
		if (typeof Data.curDoc == 'undefined' ){
			this.curDoc	= null;
			console.log('Err:	curDoc == undefined' );
		} else {
			console.log(Data.curDoc);
			this.setDataTo_form_newscan();
			 
			this.setDataTo_pageNewDoc();
		}
		
		
	},
	setDataTo_pageNewDoc : function(){
			document.getElementById("txtAdr").innerText =   this.curDoc.typeDocs;
    		
			$('#newDocDate').val(this.curDoc.dt);
			$('#newDocComm').val(this.curDoc.comment);
			$('#newScanDT').text(this.curDoc.dt);
			$('#newScanComm').text(this.curDoc.comment);
	},
    prihod_Docs : [],
	
    addDoc_prihod : function(Data_Doc){
        this.curState = typeStates.newPrihod;       
        
		this.prihod_Docs.unshift(Data_Doc);
		
		this.saveDB();
		this.loadDB();
		this.curDoc = this.prihod_Docs[0];
		this.setDataTo_pageNewDoc();
    },
	addScan : function(data_ScanItem){
		
		if (this.curDoc.scanList.find(item => item.kod == data_ScanItem.kod)){ 
			dialogs.confirmDialogInfo('Уже есть в списке! ШК: ' + data_ScanItem.kod);
			return;
		}
			
		this.curDoc.scanList.unshift(data_ScanItem);
		this.saveDB();
		this.loadDB();
		
		this.setDataTo_form_newscan();
		$("#tableId").table('rebuild');
		$('#scanComment').val('');
		playSound();
	},
	clear_form_newscan : function(){
		$("#tableId tbody").text('');
	},
	delScanItem : function(){
		var uid = this.curDoc.curScanItemUID;
		this.curDoc.scanList = this.curDoc.scanList.filter(function(e){ return e.uid !== uid}).slice();
		//this.curDoc.scanList.splice(row-1, 1);
		this.saveDB();
		this.loadDB();
		this.setDataTo_form_newscan();
	},
	setDataTo_form_newscan : function(){
		this.clear_form_newscan();
		this.curDoc.scanList.forEach(function(item){
			var element = '<tr onclick=onClickScanItem(this) ><td>'+item.kod+'</td><td class="row-type-hw">'+item.type_hw+'</td><td class="row-comment">'+item.comment+'</td></tr>';
			$("#tableId tbody").append(element); 
		});	
		
	},
	saveDB : function(){
		
		localStorage.DB_prihod_Docs = JSON.stringify(this.prihod_Docs);
		
	},
	loadDB :function(){
		if (typeof localStorage.DB_prihod_Docs === 'undefined')
			this.saveDB();
		else {
			$("#tableHistory tbody").text('');
			this.clear_form_newscan();
			
			this.prihod_Docs = JSON.parse(localStorage.DB_prihod_Docs);	
			
			Data.prihod_Docs.forEach(function(item){
			el = '<tr onclick=onClickHistoryDoc(this) uid='+item.uid+'>\
				<td>'+item.dt+'</td>\
				<td>'+item.typeDocs+'</td>\
				<td>'+item.comment+'</td></tr>';
				$("#tableHistory tbody").append(el); 
			});	
			
			if (this.curDoc != null)
				this.load_cur_doc(this.curDoc.uid);
		}
	}
};


function Data_Doc(dt, comment, typeDocs) {
	this.curScanItemUID = null;
    this.uid = get_uid();
	this.ts = Date.now();
    this.dt = dt;
    this.comment = comment;
    this.typeDocs = typeDocs;
    this.scanList = [];		
}

function Data_ScanItem(kod, type_hw, comment){
	this.uid = get_uid();
	this.ts = Date.now();
	this.kod = kod;
	this.type_hw = type_hw;
	this.comment = comment;
}




function initPages(){
	$('#verApp').text("v." + ver);
	
	$.mobile.defaultPageTransition = "none";
    $.mobile.defaultDialogTransition = 'none'; 
    
    // откл истории
        //$.mobile.hashListeningEnabled = false;
        //$.mobile.changePage.defaults.changeHash = false;
    //

    $('#pageNewDoc').on('pageshow', function (event, ui) {
		
    });	    
	
	$('#allDocs').on('pageshow', function (event, ui) {
        $("#tableHistory").table('rebuild');	
    });	
	
	$('#newscan').on('pageshow', function (event, ui) {
        $("#tableId").table('rebuild');	
    });	
	

    $('#select-native-fc').on('change', function (event) {
		
    });	
	
	$('#page_edit_hw').on('pageshow', function (event, ui) {
        initPageEditHW();
    });	
}    

function initPageEditHW(){
    HistorySer.load();
    historyFilterSearch(HistorySer.items, $("#new_scan_dlg_hw"), $("#new_scan_dlg_hw_search"), '');
	
    $("#new_scan_dlg_hw").focusin(function () {
      $("#new_scan_dlg_hw_search").show();
    });

    $('#new_scan_dlg_hw_search').on('click', 'li', function (a) {
		$("#new_scan_dlg_hw").val($(this).text()).change();
        $("#new_scan_dlg_hw_search").hide();  
    });

    $("#new_scan_dlg_hw").on('change', function(e){
        historyFilterSearch(HistorySer.items, $(this), $("#new_scan_dlg_hw_search"), '');
    });
	
    $("#new_scan_dlg_hw").on('input', function(e){
        historyFilterSearch(HistorySer.items, $(this), $("#new_scan_dlg_hw_search"), '');
    }); 
}


function historyFilterSearch(arr, input, searchForm, textSer){
    searchForm.html("");
	var cnt = 0;
		
    $.each(arr, function (i, el) {
		if (el.toLowerCase().indexOf(input.val().toLowerCase()) > -1){			
			var item = '<li my="1" value='+el+'>' + el+ '</li>';
		
			if (cnt < 3)
				searchForm.append(item);  
			cnt++;
		}
    });
    
    searchForm.listview().listview('refresh');
    searchForm.trigger("updatelayout"); 
}

/////////////////////////////////////////////////////

function showNewScan(){
	//$('#newScanInfo').text(dt + ' (' +comment+')' );
	$.mobile.changePage("#newscan");
}


/* Главная форма  pageMain  */
function onClickNewPrihod(){
	document.getElementById('btOK').onclick =  function(){
        prihod = new Data_Doc(
            $('#newDocDate').val(), 
            $('#newDocComm').val(),
            typeDocs.prihod
        );

        Data.addDoc_prihod(prihod);
		
		showNewScan();
    };

	Data.curDoc = null;
    document.getElementById("txtAdr").innerText =   typeDocs.prihod;
    
    var nowDate = moment().format('yyyy-MM-DD');
    
	
    $('#newDocDate').val(nowDate);
	$('#newDocComm').val("");
    
	$.mobile.changePage("#pageNewDoc");
	

}/* Главная форма  pageMain  */

function editCurDoc(){
	document.getElementById('btOK').onclick =  function(){
			Data.curDoc.dt =  $('#newDocDate').val();
			Data.curDoc.comment =  $('#newDocComm').val();
			Data.saveDB();
			Data.loadDB();
			
			//Data.load_cur_doc(Data.curDoc.uid);
			
			showNewScan();		
    };

    $.mobile.changePage("#pageNewDoc");
}

function delCurDoc(){
	var item = Data.curDoc;
	
	dialogs.confirmDialog('Удалить документ Дата: ' + item.dt +' Комментарий: ' + item.comment, function(){
		Data.delCurDoc();
	});
}


function scanItemDel(){
	var item = Data.getCurretScanItem();
	
	dialogs.confirmDialog('Удалить Код: ' + item.kod +' Тип: ' + item.type_hw, function(){
		//var row = $('#dlg_edit_item').attr('row');
		Data.delScanItem();
		$.mobile.changePage('#newscan');
	});
}

function newScanAdd(){

    var val = $('#scan').text();
    var comment = $('#scanComment').val();
    var type_hw = $('#new_scan_dlg_hw').val();

	var scan_item = new Data_ScanItem(val, type_hw, comment);
	Data.addScan(scan_item);
	

	 /*
    var element = '<tr onclick=onClickScanItem(this) uid='+scan_item.uid+' ><td>'+val+'</td><td calss="row-type-hw">'+type_hw+'</td><td class="row-comment">'+comment+'</td></tr>';
    $("#tableId tbody").prepend(element); */

	
}


function onClickHistoryDoc(is){
	//$( "#allDocs_popupMenu" ).popup( "open" );
	//return;
	
	var uid = $(is).attr('uid');

	Data.load_cur_doc(uid);
		
	showNewScan();
}

function show_dlg_edit_hw(is){
	//$('#allDocs_popupMenu_edit_type_hw').popup('open');
	$('#page_edit_hw').attr('btSelector', is.id);
	
	$('#new_scan_dlg_hw').val($(is).val()).change();
	
	$.mobile.changePage("#page_edit_hw");	
	$('#new_scan_dlg_hw').focus();
}
function onClick_dlg_edit_hw_ok(){
	var selector = '#' + $('#page_edit_hw').attr('btSelector');
	
	var v = 'Введите тип оборудования';
	var new_val = $('#new_scan_dlg_hw').val();
	
	if (new_val != ""){
		$(selector).text(new_val);
		$(selector).val(new_val);
		
		HistorySer.add(new_val);
		
	}else{
		$(selector).text(v);	
		$(selector).val("");	
		
	}
		
	//$('#allDocs_popupMenu_edit_type_hw').popup('close');	
	//$.mobile.changePage("#");
	$.mobile.back();
}

function onClickScanItem(is){
	console.log(is);
	$(is).parent().children().removeClass('active');
	$(is).addClass('active');
	
	
	var scan_item = Data.curDoc.scanList[is.rowIndex-1];
	
	Data.curDoc.curScanItemUID = scan_item.uid;
	
	$('#scan').text(scan_item.kod);
	$('#scanComment').val(scan_item.comment);
	

	if (scan_item.type_hw == ''){
		$('#choce_edit_hw').text('Введите тип оборудования');
		$('#choce_edit_hw').val('');
		
		
	}
	else{
		$('#choce_edit_hw').text(scan_item.type_hw);
		$('#choce_edit_hw').val(scan_item.type_hw);
	}
	

	

	bt_save_dlg_scan.onclick = function (){

			scan_item.type_hw = $('#choce_edit_hw').val();
			scan_item.comment =$('#scanComment').val();	
				//$('#tableId tr:eq('+row+') .row-type-hw').text(scan_item.type_hw);
				//$('#tableId tr:eq('+row+') .row-comment').text(scan_item.comment);
			Data.saveDB();
			
			Data.load_cur_doc(Data.curDoc.uid);
			$('#scanComment').val('');
			
			$.mobile.changePage("#newscan");
	};
	
	$.mobile.changePage("#dlg_edit_item");
}


var scanReaded ="";
function scanBuff(key){
	if (key == 'Enter'){
	    onScanFinish(scanReaded);
	    scanReaded = '';
		$('#captionNewScan').css('color', 'black');
    }else{  
        scanReaded += key;
		$('#captionNewScan').css('color', 'red');
	
	}
}
    

function onScanFinish(val){
    if (scanReaded == 'Enter'){
        return;
    }

    console.log(val);

    $('#scan').text(val);

	newScanAdd();
}	
///////////////////////////////////////////////////////////////////////////////////////////////////

function init(done){
    document.addEventListener('keypress', function(event) {
        if ($.mobile.activePage.attr( "id" ) == 'newscan' )
			if (!$.mobile.popup.active)
            scanBuff(event.key);           
    }); 
	
    showLoading(false); 
}

	

        
function showLoading(show){
    if (show)
        $.mobile.loading('show');
    else
        $.mobile.loading('hide');
}

        

function playSound(url){
	var urldef = '';
	
	if (typeof url == 'undefined')
		urldef = 'sounds/beep2.mp3';
	else
		urldef = url;
	
	if (typeof audioDemo == 'undefined'){
		audioDemo = new Audio(urldef);
		audioDemo.volume = 0.9;
		audioDemo.autoplay = true;
		//audioDemo.muted = true;
	}
	
	if (audioDemo.readyState > 0){
		
		audioDemo.play();
		audioDemo.muted = false;
	}
}



$(document).ready(function() {
	initPages();      
	init();
    
	$('#telefone').bind("cut copy paste drag drop", function(e) {
		e.preventDefault();
	});   

/* Full Screen on click

if (document.body.webkitRequestFullScreen) { 
	window.addEventListener('click', function(e) { 
		if (e.target.type != 'text' && e.target.type != 'password') { 
			if (getSys2() != "2"){
				document.body.webkitRequestFullScreen(); 
				window.setTimeout(function() { 
					//document.webkitCancelFullScreen(); 
				}, 500); 
			}
		} 
	}, false); 
}*/
	
	Data.loadDB();
});

function scanSave(){
	var file_name = Data.curDoc.dt + '_' +Data.curDoc.typeDocs+ '_'+ Data.curDoc.comment;
	var txt = "";
	
	Data.curDoc.scanList.filter(function(e){
		  txt += e.kod + '\n';
	});
	  
    download(txt, file_name + '.txt','text/plain');
}
function scanSaveAll(){
	
	var file_name = Data.curDoc.dt + '_' +Data.curDoc.typeDocs+ '_'+ Data.curDoc.comment;
	var txt = "";
	
	Data.curDoc.scanList.filter(function(e){
		  txt += e.kod +'\t'+e.type_hw+'\t'+e.comment+ '\n';
	});
	  
    download(txt, file_name + '.txt','text/plain');
}

function scanSaveJSON(file_name){
	 
    download(JSON.stringify(JSON.stringify(Data.curDoc.scanList)),file_name + '.txt','text/plain');
}


function tableToJson(table) { 
    var data = [];
    for (var i=1; i<table.rows.length; i++) { 
        var tableRow = table.rows[i]; 
        var rowData = []; 
        for (var j=0; j<tableRow.cells.length; j++) { 
            rowData.push(tableRow.cells[j].innerHTML);; 
        } 
        data.push(rowData); 
    } 
    return data; 
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}






