function get_uid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = parseFloat('0.' + Math.random().toString().replace('0.', '') + new Date().getTime()) * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function myGetArrayFromStr(InputData) {
    var tmpA = [];
    var x = 0, xx = 0;

    while ((x > -1) & (xx > -1)) {
        x = InputData.indexOf("<>");
        xx = InputData.indexOf("</>");

        tmpA.push(InputData.substring(x + 2, xx));

        InputData = InputData.substring(xx + 3);

        x = InputData.indexOf("<>");
        xx = InputData.indexOf("</>");
    }

    return tmpA;
}

function myGetParamFromStr(txt, param) {
    var st1;
    var st2;

    try {
        st1 = txt.indexOf("<" + param + ">");
        st2 = txt.indexOf("</" + param + ">", st1 + param.length + 1);

        if (st1 === -1 || st2 === -1)
            return "";

        st1 = st1 + param.length + 2; //��������� ����� ���������

        return txt.substring(st1, st2);

    } catch (e) {
        return "";
    }
}

function getXmlHttp() {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }

    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    //xmlhttp.setRequestHeader('ASsoft-Context', 'test');

    return xmlhttp;
} /*closing getXmlHttp*/

function ajax(url, params, onResultFunc, onError, timeoutAjax) {

    var xmlhttp = getXmlHttp();

    //xmlhttp.async= false;

    try {// in IE EDGE not work

        xmlhttp.timeout = 5000;

        if (typeof timeoutAjax !== 'undefined')
            xmlhttp.timeout = timeoutAjax;

    } catch (e) {
    }

    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send("from=js" + params);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                onResultFunc(xmlhttp.responseText);
            }

            if (xmlhttp.status === 0) { //no server active
                if (typeof onError !== 'undefined')
                    onError();
            }
        }
    };
}




function getSys2(){

	if (navigator.appVersion.toUpperCase().includes("ANDROID"))
		return '101';
	if (navigator.appVersion.toUpperCase().includes("IPHONE"))
		return '102';
	
	return '2'; // WEB-����

}




function getNameDir(){
    var loc = window.location.pathname;
    var dir = loc.substring(loc.lastIndexOf('/')+1 )
    return dir;
}



function validateNumber(element) {
    element.value=element.value.replace(/[^\d]/,'')
};

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}


function parse_query_string2() { // to utils...
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}


function getSys(){
     var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

   
        if (Sys.ie) 		return 'IE: ' + Sys.ie;
        if (Sys.firefox) 	return 'Firefox: ' + Sys.firefox;
        if (Sys.chrome) 	return 'Chrome: ' + Sys.chrome;
        if (Sys.opera) 		return 'Opera: ' + Sys.opera;
	if (Sys.safari) 	return 'Safari: ' + Sys.safari;
}	

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function getArrayUnicum (arr){
    return arr.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    });           
}