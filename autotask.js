var request = require("request");
var log = require("sklog");
var b64 = require("./static/b64.js");
var self;
Date.prototype.getMDay=function(){return(this.getDay()+6)%7;};Date.prototype.getISOYear=function(){var thu=new Date(this.getFullYear(),this.getMonth(),this.getDate()+3-this.getMDay());return thu.getFullYear();};Date.prototype.getISOWeek=function(){var onejan=new Date(this.getISOYear(),0,1);var wk=Math.ceil((((this-onejan)/86400000)+onejan.getMDay()+1)/7);if(onejan.getMDay()>3)wk--;return wk;};Date.prototype.getJulian=function(){return Math.floor((this/86400000)-(this.getTimezoneOffset()/1440)+2440587.5);};Date.prototype.getMonthName=function(){var m=['January','February','March','April','May','June','July','August','September','October','November','December'];return m[this.getMonth()];};Date.prototype.getMonthShort=function(){var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return m[this.getMonth()];};Date.prototype.getDayName=function(){var d=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];return d[this.getDay()];};Date.prototype.getDayShort=function(){var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];return d[this.getDay()];};Date.prototype.getOrdinal=function(){var d=this.getDate();switch(d){case 1:case 21:case 31:return'st';case 2:case 22:return'nd';case 3:case 23:return'rd';default:return'th';}};Date.prototype.getDOY=function(){var onejan=new Date(this.getFullYear(),0,1);if(onejan.getDST())onejan.addHours(1);if(this.getDST())onejan.addHours(-1);return Math.ceil((this-onejan+1)/86400000);};Date.prototype.getWeek=function(){var onejan=new Date(this.getFullYear(),0,1);return Math.ceil((((this-onejan)/86400000)+onejan.getDay()+1)/7);};Date.prototype.getStdTimezoneOffset=function(){var jan=new Date(this.getFullYear(),0,1);var jul=new Date(this.getFullYear(),6,1);return Math.max(jan.getTimezoneOffset(),jul.getTimezoneOffset());};Date.prototype.getDST=function(){return this.getTimezoneOffset()<this.getStdTimezoneOffset();};Date.prototype.getSwatch=function(){var swatch=((this.getUTCHours()+1)%24)+this.getUTCMinutes()/60+this.getUTCSeconds()/3600;return Math.floor(swatch*1000/24);};function _daysInMonth(month,year){var dd=new Date(year,month,0);return dd.getDate();};Date.prototype.format=function(f){var fmt=f.split('');var res='';for(var i=0,l=fmt.length;i<l;i++){switch(fmt[i]){case'^':res+=fmt[++i];break;case'd':var d=this.getDate();res+=((d<10)?'0':'')+d;break;case'D':res+=this.getDayShort();break;case'j':res+=this.getDate();break;case'l':res+=this.getDayName();break;case'S':res+=this.getOrdinal();break;case'w':res+=this.getDay();break;case'z':res+=this.getDOY()-1;break;case'R':var dy=this.getDOY();if(dy<9)dy='0'+dy;res+=(dy>99)?dy:'0'+dy;break;case'F':res+=this.getMonthName();break;case'm':var m=this.getMonth()+1;res+=((m<10)?'0':'')+m;break;case'M':res+=this.getMonthShort();break;case'n':res+=(this.getMonth()+1);break;case't':res+=_daysInMonth(this.getMonth()+1,this.getFullYear());break;case'L':res+=(_daysInMonth(2,this.getFullYear())==29)?1:0;break;case'Y':res+=this.getFullYear();break;case'y':var y=this.getFullYear().toString().substr(3);res+=((y<10)?'0':'')+y;break;case'a':res+=(this.getHours()>11)?'pm':'am';break;case'A':res+=(this.getHours()>11)?'PM':'AM';break;case'g':var h=this.getHours()%12;res+=(h==0)?12:h;break;case'G':res+=this.getHours();break;case'h':var h=this.getHours()%12;res+=(h==0)?12:(h>9)?h:'0'+h;break;case'H':var h=this.getHours();res+=(h>9)?h:'0'+h;break;case'i':var m=this.getMinutes();res+=(m>9)?m:'0'+m;break;case's':var s=this.getSeconds();res+=(s>9)?s:'0'+s;break;case'O':var m=this.getTimezoneOffset();var s=(m<0)?'+':'-';m=Math.abs(m);var h=Math.floor(m/60);m=m%60;res+=s+((h>9)?h:'0'+h)+((m>9)?m:'0'+m);break;case'P':var m=this.getTimezoneOffset();var s=(m<0)?'+':'-';m=Math.abs(m);var h=Math.floor(m/60);m=m%60;res+=s+((h>9)?h:'0'+h)+':'+((m>9)?m:'0'+m);break;case'U':res+=Math.floor(this.getTime()/1000);break;case'I':res+=this.getDST()?1:0;break;case'K':res+=this.getDST()?'DST':'Std';break;case'c':res+=this.format('Y-m-d^TH:i:sP');break;case'r':res+=this.format('D, j M Y H:i:s P');break;case'Z':var tz=this.getTimezoneOffset()*-60;res+=tz;break;case'W':res+=this.getISOWeek();break;case'X':res+=this.getWeek();break;case'x':var w=this.getWeek();res+=((w<10)?'0':'')+w;break;case'B':res+=this.getSwatch();break;case'N':var d=this.getDay();res+=d?d:7;break;case'u':res+=this.getMilliseconds()*1000;break;case'o':res+=this.getISOYear();break;case'J':res+=this.getJulian();break;case'e':case'T':break;default:res+=fmt[i];}}return res;};
var soap={model:{},generate:function(a){var b='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://autotask.net/ATWS/v1_5/"><soapenv:Header><v1:AutotaskIntegrations xmlns="http://autotask.net/ATWS/v1_5/"><v1:PartnerID/></v1:AutotaskIntegrations></soapenv:Header><soapenv:Body><v1:query xmlns="http://autotask.net/ATWS/v1_5/"><v1:sXML><![CDATA[<queryxml>';b+=soap.sgen(a);b+="</queryxml>]]></v1:sXML></v1:query></soapenv:Body></soapenv:Envelope>";return b}};
soap.parse = function(a){var jj = [];var fields = {};a = a.replace(/[\n\r\t]*/gmi,"");var matches = a.match(/<Entity xsi:type=\".*?\">.*?<\/Entity>/gmi);var row,line;for(var index in matches){row = matches[index];row = row.substring(row.indexOf(">") + 1,row.lastIndexOf("</"));jj.push(soap.parseRow(row));}return jj;};
soap.parseRow = function(data){var obj = {};try{while(data.match(/<.*?>/gmi).length){var tag = data.match(/<.*?>/gmi)[0];var dstart = data.indexOf(tag) + tag.length;var val = "";if(tag.substring(tag.length-2) == "/>"){data = data.substring(data.indexOf(tag) + tag.length);continue;}tag = tag.replace(/<([^\s]+)\s*.*>/gmi,"$1");var dend = data.indexOf("</" + tag + ">");val = data.substring(dstart,dend);if(val.indexOf(">") > -1){obj[tag.toLowerCase()] = parseRow(val);}else{obj[tag.toLowerCase()] = soap.d(val);}data = data.substring(data.indexOf("</" + tag + ">") + 3 + tag.length);}}catch(e){ }return obj;};
soap.d = function(v){v = v === undefined || v === null ? "" : v;return v.match(/^\s*\d*[\.]{0,1}\d*\s*$/) !== null ? parseFloat(v.replace(/^\s*(\d*[\.]{1}\d*)\s*$/, "$1")) : v;};
soap.flags = {log:{}};
soap.sgen = function(data){
	var jj = "";
	var row;
	data = JSON.parse(JSON.stringify(data)); //COPY
	for(var key in data){
		row = data[key];
		//log(row);
		if(typeof row == "object"){
			//log("obj");
			if(typeof row.tags == "object" || (typeof row.val) in {"string":1,"number":1}){
				jj += "<" + key;
				for(var tag in row.tags){
					jj += " " + tag + "=\"" + row.tags[tag] + "\"";
				}
				jj += ">" + row.val;
				delete row.tags;
				delete row.val;
				jj += soap.sgen(row);
				jj += "</" + key + ">";
			}else{
				if(row instanceof Array){
					for(var x in row){
						jj += "<" + key + ">";
						if(typeof row[x] == "object"){
							jj += soap.sgen(row[x]);
						}else{
							jj += row[x];
						}
						jj += "</" + key + ">";
					}
				}else{
					jj += "<" + key + ">" + soap.sgen(row) + "</" + key + ">";
				}
			}
		}else{
			//log("plain");
			jj += (!(key in {"val":1,"tags":1})?"<" + key + ">":"") + row + (!(key in {"val":1,"tags":1})?"</" + key + ">":"");
		}
	}
	return jj;
}
soap.statics= {status:{"New":"1","Complete":"5","Waiting Customer":"7","In Progress":"8","CR-Waiting CFO Approval":"15","CR/CMR-In Migration":"20","In Review":"21","Workaround in Place":"26","CR/CMR-Mngr Assessment":"27","With Developer":"28","Quality Assurance Testing":"29","Outsourcing Complete":"30","Transfered from Taskfire":"31"}};
soap.model.resource = function(){return {
	"entity":"resource"
	,"query":{"field":{"val":"UserName","tags":{},"expressions":{"val":"0","tags":{"op":"equals"}}}}
};};
soap.model.tasks = function(){return {
	"entity":"task"
	,"query":{"field":{"val":"id","tags":{},"expression":{"val":"0","tags":{"op":"greaterthan"}}}}
};};
soap.model.tickets = function(){return {
	"entity":"ticket"
	,"query":{"field":{"val":"id","tags":{},"expression":{"val":"0","tags":{"op":"greaterthan"}}}}
};};

var atask = function(url){this.url = url;}
atask.prototype.getEntityInfo = {};
atask.prototype.getEntityInfo.resource = function(rname,callback){
	var s = soap.model.resource();
	rname = b64.decode(rname);
	s.query.field.expressions.val = rname;
	self.soap(s,function(e,r,b){
		var rrr = soap.parse(b.toString());
		for(var i in rrr){//kQHBhY2NvYXN0LmNvbToxMjM0NQ==
			if(rrr[i].email == rname || rname.indexOf(rrr[i].username + "@") == 0){
				log(rname + " logged in (" + rrr[i].id + ")");
				callback({uid:rrr[i].id});
				return;
			}
		}
		callback({uid:-1});
	});
};
atask.prototype.getEntityInfo.tasks = function(d,callback){
	var s = soap.model.tasks();
	var fields = [];
	fields.push(JSON.parse(JSON.stringify(s.query.field)));
	fields.push(JSON.parse(JSON.stringify(s.query.field)));
	fields[0].val = "AssignedResourceID";
	fields[0].expression.val = d.resource;
	fields[0].expression.tags.op = "equals";
	fields[1].val = "Status";
	fields[1].expression.val = soap.statics.status["Complete"];	
	fields[1].expression.tags.op = "notequal";
	s.query.field = fields;
	self.soap(s,function(e,r,b){
		var rrr = soap.parse(b.toString());
		callback(rrr);
	});
};

atask.prototype.soap = function(data,callback){
	if(typeof data == "object"){
		data = soap.generate(data);
	}
	request({
		"url":self.url
		,"method":"POST"
		,"body":data
		,"encoding":null
		,"headers":{
			"Content-Type":"text/xml; charset=\"utf-8\""
			,"Authorization":"Basic dG9ueW9"
		}
	},callback);
}
module.exports = function(url){self = (new atask(url)); return self;}