// Mumsnet Favourite / Ignore feature
// version 0.1
// 2011-10-02
// Released under the GPL license: http://www.gnu.org/copyleft/gpl.html
//
// Changelog:
// 0.1 (2011-10-02) -- Original release.
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts, select this script,
// and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name            Mumsnet Favourites
// @namespace       http://www.edochan.com/widgets/mumsnet
// @description     Adds Favourite and Ignore features to Mumsnet.
// @include         http://mumsnet.com/*
// @include         http://*.mumsnet.com/*
// ==/UserScript==


function edmund_widget_mumsnet_setup(){
if(document.getElementById('edmund_widget_next_favourite_top_link')){ return true; };
if(!document.getElementById('posts') || (document.getElementsByClassName('post').length==0) ) {
window.setTimeout('edmund_widget_mumsnet_setup()',500); 
return false; 
};
edmund_widget_mumsnet_set_styles();
var divs=document.getElementsByClassName('post');
for(i=0;i<divs.length;i++){ edmund_widget_linkify_node(divs[i]); };
edmund_widget_mumsnet_refresh();
if(!document.getElementById('edmund_widget_next_favourite_top_link')){ document.getElementById('thread_title').innerHTML+='<br /><a id="edmund_widget_next_favourite_top_link" name="edmund_widget_next_favourite_top_link" href="#edmund_widget_next_favourite_top_link" onClick="return edmund_widget_mumsnet_next_favourite(null,this);">First favourite</a> '; }; 
};

function edmund_widget_mumsnet_set_styles(){
var sheet = document.createElement('style');
sheet.innerHTML = ""+
"div.post.edmund-widget-ignore a.ignore_link {display:none !important ; float:right !important}"+
"div.post.edmund-widget-ignore a.unignore_link { float:right !important}"+
"div.post.edmund-widget-ignore div.bar { background-color: #e0e0e0 !important}"+
"div.post.edmund-widget-favourite a.favourite_link{display:none !important ; float:right !important}"+
"div.post.edmund-widget-favourite a.unfavourite_link{float:right !important; }"+
"div.post:not(.edmund-widget-ignore) a.unignore_link {display:none !important ; float:right !important}"+
"div.post:not(.edmund-widget-ignore) a.ignore_link {float:right !important}"+
"div.post:not(.edmund-widget-favourite) a.unfavourite_link {display:none !important ; float:right !important}"+
"div.post:not(.edmund-widget-favourite) a.favourite_link {float:right !important;}"+
"div.post:not(.edmund-widget-favourite) a.next_favourite_link {display:none !important }"+
"div.post.edmund-widget-ignore div.message {display:none !important ;}"+
"div.post.edmund-widget-favourite {background-color:#ffffcc !important ;}"+
"div.post.edmund-widget-favourite div.message {background-color:#ffffcc !important ;}"+
"div.post div.edmund-widget-controls {font-size:10px !important ; margin-top;4px;}"+
"div.post div.edmund-widget-controls span.ignore_favourite_divider{font-size:10px !important; margin-right:4px; margin-left:4px; float:right !important}"+
"div.post div.edmund-widget-controls a:hover {text-decoration:underline !important;}";
document.body.appendChild(sheet);
};

function edmund_widget_linkify_node(node){
if(node.tagName!='DIV'){ return; };
if(node.getAttribute('data-edmund-widget-author')&&node.getAttribute('data-edmund-widget-author')!=''){ return; };
if(!node.getElementsByClassName('nick')) { return; };
var cid=node.id;
var posternode=node.getElementsByClassName('nick')[0];
poster=posternode.innerHTML;
posterbox=posternode.parentNode.parentNode;
node.setAttribute('data-edmund-widget-author',poster);
addhtml='<div class="edmund-widget-controls" id="edmund-widget-comment-'+cid+'">';
addhtml+='<a href="#'+cid+'" class="unignore_link" onClick="return edmund_widget_mumsnet_remove_poster(this,\'mmign\');"> Unignore </a> ';
addhtml+='<a href="#'+cid+'" class="ignore_link" onClick="return edmund_widget_mumsnet_add_poster(this,\'mmign\');"> Ignore </a> ';
addhtml+='<span class="ignore_favourite_divider"> | </span>';
addhtml+='<a href="#'+cid+'" class="unfavourite_link" onClick="return edmund_widget_mumsnet_remove_poster(this,\'mmfav\');"> Unfavourite </a> ';
addhtml+='<a href="#'+cid+'" class="favourite_link" onClick="return edmund_widget_mumsnet_add_poster(this,\'mmfav\');"> Favourite </a> ';
addhtml+='<a href="#'+cid+'" class="next_favourite_link" onClick="return edmund_widget_mumsnet_next_favourite(this,this);">Next Favourite</a> ';
addhtml+=' &nbsp; ';
addhtml+='</div>';
node.getElementsByClassName('bar')[0].innerHTML+=addhtml;
};


function edmund_widget_mumsnet_refresh(){
var divs=document.getElementsByClassName('post');
for(i=0;i<divs.length;i++){
var lnode=divs[i];
if(!lnode.getAttribute('data-edmund-widget-author')){ continue; };
poster=lnode.getAttribute('data-edmund-widget-author');
var oldclasses = lnode.getAttribute('class').split(' ');
var newclasses = new Array();
for(j=0;j<oldclasses.length;j++){
if ((oldclasses[j]!='edmund-widget-favourite')&&(oldclasses[j]!='edmund-widget-ignore')){
newclasses.push(oldclasses[j]);
};
};
if(edmund_widget_mumsnet_cookie_contains_poster(poster,'mmfav')){
newclasses.push('edmund-widget-favourite');
lnode.setAttribute('data-edmund-widget-favourite','true');
}else{
lnode.setAttribute('data-edmund-widget-favourite','');
};
if(edmund_widget_mumsnet_cookie_contains_poster(poster,'mmign')){
lnode.setAttribute('data-edmund-widget-ignore','true');
newclasses.push('edmund-widget-ignore');
}else{
lnode.setAttribute('data-edmund-widget-ignore','');
};
lnode.setAttribute('class',newclasses.join(' '));
};
return false;
};

function edmund_widget_mumsnet_cookie_contains_poster(poster,ckn){
if(document.cookie.length<1){
return false;
};
ck=edmund_widget_mumsnet_cookie(ckn);
return (ck.indexOf('|'+escape(poster)+'|')>=0);
};

function edmund_widget_mumsnet_add_poster(node,ckn){
var poster=node.parentNode.parentNode.parentNode.getAttribute('data-edmund-widget-author');
if(edmund_widget_mumsnet_cookie_contains_poster(poster,ckn)) {return true;};
var ck=edmund_widget_mumsnet_cookie(ckn);
document.cookie=ckn+'='+ck+'|'+escape(poster)+'|; expires=Thu, 22 Feb 2020 00:00:00 UTC; path=/; domain=mumsnet.com';
edmund_widget_mumsnet_refresh();
return true;
};

function edmund_widget_mumsnet_remove_poster(node,ckn){
var poster=node.parentNode.parentNode.parentNode.getAttribute('data-edmund-widget-author');
var ck=edmund_widget_mumsnet_cookie(ckn);
ck=ck.replace('|'+escape(poster)+'|','');
document.cookie=ckn+'='+ck+'; expires=Thu, 22 Feb 2020 00:00:00 UTC; path=/; domain=mumsnet.com';
edmund_widget_mumsnet_refresh();
return true;
};

function edmund_widget_mumsnet_cookie(n){
var ck='';
var c_start;
var c_end;
if(document.cookie.length>0){
c_start=document.cookie.indexOf(n+"=");
if(c_start!=-1){
c_start=c_start+n.length+1;
c_end=document.cookie.indexOf(";",c_start);
if(c_end==-1) c_end=document.cookie.length;
ck=document.cookie.substring(c_start,c_end);
};
};
return ck;
};

function edmund_widget_mumsnet_next_favourite(startnode,node){
var div;
if(!startnode){
if(document.getElementsByClassName('post').length>0){
div=document.getElementsByClassName('post')[0];
}else{
return false;
};
}else{
div=startnode.parentNode.parentNode.parentNode.nextSibling;
};
while(div){
if(div && div.tagName=='DIV' && div.getAttribute && div.getAttribute('data-edmund-widget-favourite')=='true' ) {
node.href='#'+div.id;
return true;
} 
div=div.nextSibling
};
node.href='#edmund_widget_next_favourite_top_link';
return true;
};



function embedFunction(s) 
{
	var script=document.createElement('script');
	script.innerHTML=s.toString().replace(/([\s\S]*?return;){2}([\s\S]*)}/,'$2');
	document.body.appendChild(script);
}

embedFunction(edmund_widget_mumsnet_setup);
embedFunction(edmund_widget_mumsnet_set_styles);
embedFunction(edmund_widget_linkify_node);
embedFunction(edmund_widget_mumsnet_refresh);
embedFunction(edmund_widget_mumsnet_cookie_contains_poster);
embedFunction(edmund_widget_mumsnet_add_poster);
embedFunction(edmund_widget_mumsnet_remove_poster);
embedFunction(edmund_widget_mumsnet_cookie);
embedFunction(edmund_widget_mumsnet_next_favourite);

edmund_widget_mumsnet_setup();
