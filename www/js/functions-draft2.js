// JavaScript Document

var undefined;
var focus_id;
var id;

/*$.urlParam = function(name){
	result = new Object;
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results!=null) result = results[1];
	return result;
	}*/

$.getAccountInfo = function(id){
	for (i=0; i<accounts.length; i++) {
		if (accounts[i].id==id) return accounts[i];
		}
	return false;
	}

$.getTransactions = function (account_id) {
	results = new Array();
	for (i=0; i<transactions.length; i++){
		if (transactions[i].account_id==account_id) results.push(transactions[i]);
		}
	return results;
	}

/***************************************************************************/
// QUERY STRING HANDLING
/***************************************************************************/

var argName;
var argValue;
var pairs;
var args;

function get_query() {
	args = new Array();
	query = location.search.substring(1);
	pairs = query.split("&");
	for (i=0;i<pairs.length;i++) {
		args[i] = pairs[i].split('=');
		}
	}
	
$.urlParam = function(myVariable) {
	if (args==undefined) get_query();
	for (i=0;i<pairs.length;i++) {
		if (args[i][0]==myVariable) return args[i][1];
		}
	}
	
/***************************************************************************/
// COOKIE HANDLING
/***************************************************************************/

$.cookie_expires = function (nodays){
	var UTCstring;
	Today = new Date();
	nomilli=Date.parse(Today);
	Today.setTime(nomilli+nodays*24*60*60*1000);
	UTCstring = Today.toUTCString();
	return UTCstring;
	}

$.get_cookie = function (cookiename) {
	var cookiestring = "" + document.cookie;
	args = Array();
	args = cookiestring.split(";");
	for (i=0;i<args.length;i++) {
		args[i] = args[i].split("=");
		if (trimAll(args[i][0])==cookiename) return args[i][1];
		}
	}

$.set_cookie = function (name,value,duration) {
	var cookie_string = "";
	cookie_string=name+"="+escape(value)+";path=/"; //+";EXPIRES="+getexpirydate(duration); // uncomment this to add tell the cookie whent to expire
	document.cookie = cookie_string;
	
	if(!getcookie(name)) {
		return false;
		}
	else {
		return true;
		}
	}

/***************************************************************************/
// OTHER FUNCTIONS
/***************************************************************************/

$.format_currency = function(n, p, d, t, c){
	if (!$.browser.webkit) {
		c = (c == undefined) ? "$" : c;
		t = (t == undefined) ? "," : t;
		n.toString();
		n = n.replace(" ","").replace(c,"").replace(/\,/g,""); // strip spaces, currency, and thousands separators - only works for t = ,
		n = (isNaN(n)) ? 0 : n;
		p = (isNaN(p = Math.abs(p))) ? 2 : p;
		d = (d == undefined) ? "." : d;
		s = (n < 0) ? "-" : "";
		i = parseInt(n = Math.abs(+n || 0).toFixed(p)) + "";
		j = (j = i.length) > 3 ? j % 3 : 0;
		
		formatted = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (p ? d + Math.abs(n - i).toFixed(p).slice(2) : "")
		// formated = c + " " + formatted;
		}
	else formatted = n;
	
   	return formatted;
 	}

$.get_new_date = function (date_str){
	var this_date = (date_str!="" && date_str!=undefined) ?  new Date(date_str) : new Date();
	var d = this_date.getDate();
	var m =  this_date.getMonth();
	m += 1;  // JavaScript months are 0-11
	var y = this_date.getFullYear();
	
	return (m + "/" + d + "/" + y);
	}
	
$.update_menu = function (id,type){
	switch(type){
			
		default:
			pages = Array(
				{"url": "#account-summary", "text": "Account Summary"}, 
				{"url": "#payments", "text": "Payments"},
				{"url": "#mobile-deposit", "text": "Mobile Deposit"},
				{"url": "#transfer", "text": "Transfer"},
				{"url": "#help", "text": "Help"}
				);
			break;
		}
	
	menu = "";
	
	for(i=0; i<pages.length; i++) {
		multiple_id = (type=="multiple") ? '?id=' + id : "";
		menu += '<li><a href="' + multiple_id + pages[i].url + '">'+ pages[i].text + '</a></li>' + "\n";
		}
	
	return menu;
	}

$.toggle_menu = function(){
	$.mobile.activePage.find('nav ul').animate({
				height: 'toggle'
			  }, 500);
	}

var transaction_count = 5;
var transaction_limit = 25;


$.get_transactions = function(obj_id, id) {
	// call API and get AJAX response
	
	id = (id) ? id : 0;
	$("#" + obj_id + ' li:last-child').remove();
	content = "";
	for (i=0; i<transactions.length; i++) {
		if (transactions[i].account_id==id) {
			content += ('<li><div class="new-transaction" data-role="collapsible" data-theme="c" data-content-theme="b">');
            content += ('<h3>');
            content += ('	<div class="ui-grid-a">');
            content += ('		<div class="column-1">' + transactions[i].date + '</div>');
            content += ('      		<div class="column-2 align-right ellipsis" id="balance">$' + transactions[i].amount + '</div>');
			content += ('      		<div class="column-3">' + transactions[i].merchant_name + '</div>');
            content += ('   </div>');
            content += ('</h3>');
			content += ('<div class="transaction-content">');
            content += ('	<strong>Date:</strong> <span class="value">' + transactions[i].date + '</span><br />');
            //if (transactions[i].auth_decline_code=="DECLINED") content += ('	<strong>Auth/Decline Code:</strong> <span class="value">' + transactions[i].auth_decline_code + '</span><br>');
            content += ('	<strong>Amount:</strong> <span class="value">$' + transactions[i].amount + '</span><br />');
            content += ('   <strong class="">Description:</strong> <span class="value">' + transactions[i].merchant_name + '</span>');
			content += ('</div>');
            content += ('</div></li>');
			
			}
		}
		
	content += '<li data-icon="false"><a href="javascript:' + "$.get_transactions('"+ obj_id + "'," + id + ');" id="load-more">load more transactions</a></li>' + "\n";
	$("#" + obj_id ).append(content);
	$("#" + obj_id).listview('refresh');
	$("#" + obj_id).trigger("create");
	$("#" + obj_id + ' .new-transaction').removeClass("new-transaction");
	
	}

var transaction_count = 5;
var transaction_limit = 25;

$.get_payments = function (obj_id, id) {
	// call API and get AJAX response
	
	
	id = (id) ? id : 0;
	$("#" + obj_id + ' li:last-child').remove();
	content = "";
	for (i=0; i<transactions.length; i++) {
		if (transactions[i].account_id==id) {
			content += ('<li><div class="new-transaction" data-role="collapsible" data-theme="c" data-content-theme="b">');
            content += ('<h3>');
            content += ('	<div class="ui-grid-a">');
            content += ('		<div class="column-1">' + transactions[i].date + '</div>');
            content += ('      		<div class="column-2 align-right ellipsis" id="balance">$' + transactions[i].amount + '</div>');
			content += ('      		<div class="column-3">' + transactions[i].merchant_name + '</div>');
            content += ('   </div>');
            content += ('</h3>');
			content += ('<div class="transaction-content">');
            content += ('	<strong>Payee:</strong> Payee #2 <br>');
            content += ('	<strong>Pay from Account:</strong> Account #1<br>');
            content += ('	<strong>Payment On:</strong> 12/31/2013<br>');
            content += ('	<strong>Amount: </strong>$1.00<br>');
            content += ('	<strong>Memo: </strong><br>');
            content += ('	<strong>Ref #:</strong> 1234567890');
			content += ('</div>');
            content += ('</div></li>');
			
			}
		}
	content += ('<li data-icon="false"><a href="javascript:' + "$.get_payments('"+ obj_id + "'," + id + ');" id="load-more">load more transactions</a></li>') + "\n";
	$("#" + obj_id).append(content);
	$("#" + obj_id).listview('refresh');
	$("#" + obj_id).trigger("create");
	$('.new-transaction').removeClass("new-transaction");
	
	}

var start = 0;

$.get_accounts = function(start) {
	// call API and parse AJAX response
	
	
	$('#account-summary #account_list li:last-child').remove();
	count = 0;
	limit = accounts.length; //10;
	content = "";
	while (count<limit) { 
		content += ('<li><a href="?id=' + accounts[start].id +  '#account-activity" data-ajax="false"><div class="column-1">' + accounts[start].account_nickname + '</div><div class="column-2 align-right" id="balance">$' + accounts[start].balance + '</div></a></li>' + "\n");
		start++;
		count++;
		if (start>=accounts.length) start = 0;
		}
	content += ('<li data-icon="false"><a href="javascript:$.get_accounts('+start+');" id="load-more">load more accounts</a></li>' + "\n");
	$('#account-summary #account_list').append(content);
	$('#account-summary #account_list').listview('refresh');
	
	}

/***************************************************************************/
// FORM HANDLING
/***************************************************************************/

// Constants  
var MISSING = "missing";  
var EMPTY = "";  

/***************************************************************************/
// DOCUMENT INITIALIZATION
/***************************************************************************/

$.init = function (page_id){
	id = (window.location.search) ? $.urlParam('id') : 0;
	//$('.menu').html($.update_menu(id));
	
	if (/mobile/i.test(navigator.userAgent) && !pageYOffset && !location.hash && document.documentElement.scrollTop === 0) window.scrollTo(0, 1);
	
	// menu settings
	$( ".menu" ).popup({tolerance: '40,0,0,0'});
	$('nav .control').on('click', function(){
		if ($("nav ul").css("display")=='none') $('nav ul').show(500);
		else $('nav ul').hide(500);
		});
	$('nav ul li a').click(function(){
		$('nav ul').hide();
		});
	$(".ui-content").click(function(){
		if ($("nav ul").css("display")=='block')  $('nav ul').hide();
		});
	
	// form settings
	inputMapVar = $('input[name*="_r"]');
	$("input[type=file]").change(function(ev) {
		var parent_id = $(this).parent().attr("id");
		$("#"+parent_id+" img").toggle();
		var reader = new FileReader();
		reader.onload = (function(ev) {
		  	$("#"+parent_id+" img").attr("src", ev.target.result).fadeIn();
			});
	
		var file = this.files[0];
		$("#"+parent_id+" img").data("name", file.name);
		reader.readAsDataURL(file);
	  	});

	$('#login-form').submit(function(e){
		var err = false;
		// Perform form validation  
		inputMapVar.each(function(index){  
			if ($(this).val()==null || $(this).val()==EMPTY) {  
				$(this).prev().addClass(MISSING);  
				err = true;  
				}  
			});  
		// If validation fails, show Dialog content  
		if (err == true) {  
			// do something  
			return false;  
			}  
		// If validation passes, show Transition content   
		// Submit the form  
		$.post($(this).attr("action"), $(this).serialize(), function(data){  
			response = jQuery.parseJSON(data);
			alert(response.confirmation_id);
			//alert(data);
			});  
		return false;
		});

	}

function takePicture(pictureId){
	if (typeof(cordova) !== 'undefined' && cordova !== null) {
		cordova.plugins.barcodeScanner.scan(
				function (result) {
					console.log("Success on picture");
				}, 
				function (error) {
					alert("Scanning failed: " + error);
				}
		);
	} else {
		$('#' + pictureId).click();
	}
}//takePicture