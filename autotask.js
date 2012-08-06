var request = require("request");
var log = require("sklog");
var self;
var soap={model:{},generate:function(a){var b='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://autotask.net/ATWS/v1_5/"><soapenv:Header><v1:AutotaskIntegrations xmlns="http://autotask.net/ATWS/v1_5/"><v1:PartnerID/></v1:AutotaskIntegrations></soapenv:Header><soapenv:Body><v1:query xmlns="http://autotask.net/ATWS/v1_5/"><v1:sXML><![CDATA[<queryxml>';b+=soap.sgen(a);b+="</queryxml>]]></v1:sXML></v1:query></soapenv:Body></soapenv:Envelope>";return b},sgen:function(a){var b="";var c;a=JSON.parse(JSON.stringify(a));for(var d in a){c=a[d];if(typeof c=="object"){if(typeof c.tags=="object"||typeof c.val=="string"){b+="<"+d;for(var e in c.tags){b+=" "+e+'="'+c.tags[e]+'"'}b+=">"+c.val;delete c.tags;delete c.val;b+=soap.sgen(c);b+="</"+d+">"}else{if(c instanceof Array){b+="<"+d+">";if(typeof c[x]=="object"){b+=soap.sgen(c[x])}else{b+=c[x]}b+="</"+d+">"}else{b+="<"+d+">"+soap.sgen(c)+"</"+d+">"}}}else{b+="<"+d+">"+c+"</"+d+">"}}return b},parse:function(a){var b=function(a){var c={};var d=function(a){a=a===undefined||a===null?"":a;return a.match(/^\s*\d*[\.]{0,1}\d*\s*$/)!==null?parseFloat(a.replace(/^\s*(\d*[\.]{1}\d*)\s*$/,"$1")):a};try{while(a.match(/<.*?>/gmi).length){var e=a.match(/<.*?>/gmi)[0];var f=a.indexOf(e)+e.length;var g="";if(e.substring(e.length-2)=="/>"){a=a.substring(a.indexOf(e)+e.length);continue}e=e.replace(/<([^\s]+)\s*.*>/gmi,"$1");var h=a.indexOf("</"+e+">");g=a.substring(f,h);if(g.indexOf(">")>-1){c[e.toLowerCase()]=b(g)}else{c[e.toLowerCase()]=d(g)}a=a.substring(a.indexOf("</"+e+">")+3+e.length)}}catch(i){}return c};var c=[];var d={};a=a.replace(/[\n\r\t]*/gmi,"");var e=a.match(/<Entity xsi:type=\".*?\">.*?<\/Entity>/gmi);var f,g;for(var h in e){f=e[h];f=f.substring(f.indexOf(">")+1,f.lastIndexOf("</"));c.push(b(f))}return c}};
soap.model.resource = function(){return {
	//"SOAPACTION":"http://autotask.net/ATWS/v1_5/query"
	//,"RESOURCE":"resources"
	"entity":"resource"
	,"query":{"field":{"val":"UserName","tags":{},"expressions":{"val":"0","tags":{"op":"equals"}}}}
};};

var atask = function(url){this.url = url;}
atask.prototype.getEntityInfo = {};
atask.prototype.getEntityInfo.resource = function(rname){
	var s = soap.model.resource();
	s.query.field.expressions.val = rname;
	self.soap(s,function(e,r,b){
		log("Called");
		var rrr = soap.parse(b.toString());
		for(var i in rrr){//dG9ueW9kQHBhY2NvYX
			if(rrr[i].email == rname || rname.indexOf(rrr[i].username + "@") == 0){
				log(rname + " logged in");
			}
		}
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
			,"Authorization":"Basic N0LmNvbToxMjM0NQ=="
		}
	},callback);
}
module.exports = function(url){self = (new atask(url)); return self;}