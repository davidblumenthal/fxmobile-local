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
				{"url": "account-summary.html", "text": "Account Summary"}, 
				{"url": "payments.html", "text": "Payments"},
				{"url": "mobile-deposit.html", "text": "Mobile Deposit"},
				{"url": "transfer.html", "text": "Transfer"},
				{"url": "help.html", "text": "Help"}
				);
			break;
		}
	
	menu = "";
	
	for(i=0; i<pages.length; i++) {
		multiple_id = (type=="multiple") ? '?id=' + id : "";
		menu += '<li><a href="' + pages[i].url + multiple_id + '" rel="external" data-ajax="false">'+ pages[i].text + '</a></li>' + "\n";
		}
	$("#menu").html(menu);
	}

$.toggle_menu = function(){
	$('#menu').animate({
				height: 'toggle'
			  }, 500, function() {
				// Animation complete.
			});
	}

$.init = function (){
	
	if (/mobile/i.test(navigator.userAgent) && !pageYOffset && !location.hash && document.documentElement.scrollTop === 0) window.scrollTo(0, 1);
	
	$('#nav .control').click(function(){
		$.toggle_menu();
		});
	
	$("#menu a").click(function(){
		$.toggle_menu();
		});
	
	$("#content").click(function(){
		if (!$("#menu").is(":hidden")) {
			$.toggle_menu();
			}
		});
	
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

	
	}