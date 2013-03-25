// Vanilla PB Favourite / Ignore feature
// version 0.3
// 2013-03-21
// Released under the GPL license: http://www.gnu.org/copyleft/gpl.html
// By Edmund Edgar using techniques from Meglamaniacs4U's version.
// This is designed for politicalbetting.com, but would probably work...
// ...on other sites using Vanilla Forums.
//
// Changelog:
// 0.1 (2011-10-02) -- Original release of Disqus version
// 0.2 (2011-12-01) -- Updated along with Disqus change
// 0.3 (2012-05-11) -- Fix to handle Firefox upgrade (broke setTimeout), added rewidgetize links.
// 0.4 (2012-10-19) -- Workaround for broken "More comments" button, which is unusable on the default site.
// 0.5 (2012-10-19) -- Automated rewidgetizing after "More comments" loads.
// 0.6 (2013-03-15) -- Updated along with Disqus change
// 0.7 (2013-03-21) -- Adapted to Vanilla Forums
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
// @name            PB Vanilla Widget
// @namespace       http://www.edochan.com/widgets/pb
// @description     Adds Favourite and Ignore features to politicalbetting.com.
// @include         http://politicalbetting.vanillaforums.com/*
// ==/UserScript==



function edmund_widget_disqus_setup_links(){

	if((!document.getElementById('vanilla_discussion_embed')||(document.getElementsByClassName('ItemComment').length==0))){ 
		window.setTimeout(edmund_widget_disqus_setup_links,5000); 
		return false; 
	}

	if(!document.getElementById('edmund_widget_reload_upper')){
console.log("adding upper"); 
		document.getElementById('Form_Comment').innerHTML+='<a id="edmund_widget_reload_upper" href="#" onClick="return edmund_widget_disqus_more_comments()">Reload</a> &nbsp; &nbsp; &nbsp ';
	};

	if(!document.getElementById('edmund_widget_rewidgetize_upper')){ 
		document.getElementById('Form_Comment').innerHTML+='<a id="edmund_widget_rewidgetize_upper" href="#" onClick="return edmund_widget_disqus_setup_links()">Rewidgetize</a> &nbsp; &nbsp &nbsp; ';
	};

	if(!document.getElementById('edmund_widget_next_favourite_top_link')){ 
		document.getElementById('Form_Comment').innerHTML+='<a id="edmund_widget_next_favourite_top_link" name="edmund_widget_next_favourite_top_link" href="#edmund_widget_next_favourite_top_link" onClick="return edmund_widget_disqus_next_favourite(null,this);">First Favourite</a> '; 
	}

	if(!document.getElementById('PagerMore')){ 
		document.getElementById('PagerMore').onclick='edmund_widget_disqus_setup_links();';
//		var edmund_widget_lower_navigation_div=document.createElement('div'); 
//		edmund_widget_lower_navigation_div.innerHTML='<a id="edmund_widget_reload_lower" href="#" onClick="return edmund_widget_disqus_more_comments()">Reload</a>  &nbsp; &nbsp; &nbsp '+'<a id="edmund_widget_rewidgetize_lower" href="#" onClick="return edmund_widget_disqus_setup_links()">Rewidgetize</a>';
		//document.getElementById('dsq-pagination').parentNode.insertBefore(edmund_widget_lower_navigation_div,document.getElementById('dsq-pagination')); 
	};

	edmund_widget_disqus_set_styles();

	lis=document.getElementsByClassName('ItemComment');
	for(i=0;i<lis.length;i++){ 
		edmund_widget_disqus_linkify_child_node(lis[i]); 
	};

	edmund_widget_refresh_document();

	return false;
	
};

function edmund_widget_disqus_set_styles(){
if(document.getElementById('edmund-widget-disqus-stylesheet')) { return true; };
var sheet = document.createElement('style');
sheet.setAttribute('id','edmund-widget-disqus-stylesheet');
sheet.innerHTML = ""+
"li.ItemComment div.dsq-comment-text{font-size:100% !important ;}"+
"li.ItemComment.edmund-widget-ignore a.ignore_link {display:none !important ;}"+
"li.ItemComment.edmund-widget-favourite a.favourite_link{display:none !important ;}"+
"li.ItemComment:not(.edmund-widget-ignore) a.unignore_link {display:none !important ;}"+
"li.ItemComment:not(.edmund-widget-favourite) a.unfavourite_link {display:none !important ;}"+
"li.ItemComment:not(.edmund-widget-favourite) a.next_favourite_link {display:none !important ;}"+
"li.ItemComment.edmund-widget-ignore div.Item-BodyWrap {display:none !important ;}"+
"li.ItemComment.edmund-widget-ignore div.CommentInfo {display:none !important ;}"+
"li.ItemComment.edmund-widget-ignore div.PhotoWrap {display:none !important ;}"+
"li.ItemComment.edmund-widget-favourite {background-color:#ffffcc !important ;}";
document.body.appendChild(sheet);
};

function edmund_widget_disqus_linkify_child_node(node){
if(node.tagName=='LI'){
//console.log("linkifying node");
if(node.getAttribute('data-edmund-widget-author')&&node.getAttribute('data-edmund-widget-author')!=''){ return; };
bits=node.id.split('_');
if((bits.length==2)&&(bits[0]=='Comment')){
cid=bits[1];
l=node.id;
poster=node.getElementsByClassName('Username')[0].innerHTML;
posterbox=node.getElementsByClassName('AuthorInfo')[0];
node.setAttribute('data-edmund-widget-author',poster);
addhtml='<div class="edmund-widget-controls" id="edmund-widget-comment-'+cid+'">';
addhtml+=' <a href="#'+l+'" class="unignore_link" onClick="return edmund_widget_remove_poster_from_list(this,\'pbign\',event);"> Unignore</a>';
addhtml+=' <a href="#'+l+'" class="ignore_link" onClick="return edmund_widget_disqus_add_poster_to_list(this,\'pbign\',event);"> Ignore</a>';
addhtml+=' <a href="#'+l+'" class="unfavourite_link" onClick="return edmund_widget_remove_poster_from_list(this,\'pbfav\',event);"> Unfavourite</a>';
addhtml+=' <a href="#'+l+'" class="favourite_link" onClick="return edmund_widget_disqus_add_poster_to_list(this,\'pbfav\',event);"> Favourite</a>';
addhtml+=' <a href="#'+l+'" class="next_favourite_link" onClick="return edmund_widget_disqus_next_favourite(this,this,event);"> Next Favourite</a>';
addhtml+='</div>';
posterbox.innerHTML+=addhtml;
};
};
};

function edmund_widget_disqus_setup_links_when_ready(){
console.log('setup when ready');
	if (document.getElementsByClassName('vn-loading').length > 0){
		window.setTimeout(edmund_widget_disqus_setup_links_when_ready,500); 
		return false; 
	}
	window.setTimeout(edmund_widget_disqus_setup_links, 500);
}

function edmund_widget_refresh_document(){
// Temporary workaround for Disqus breakage in more comments button.
//DISQUS.dtpl.actions.fire('thread.paginate', 2, this); return false
document.getElementById('PagerMore').getElementsByTagName('a')[0].setAttribute('onClick', "setTimeout('edmund_widget_disqus_setup_links_when_ready', 5000);");

if (document.getElementsByClassName('dsq-more-button').length > 0) {
var orig = document.getElementsByClassName('dsq-more-button')[0].getAttribute('onClick');
if (orig && (orig.indexOf("this)") != -1)) {
	var newstr = orig.replace("this)", "this, 250); edmund_widget_disqus_setup_links_when_ready();");
	document.getElementsByClassName('dsq-more-button')[0].setAttribute('onClick', newstr);
}
}
lis=document.getElementsByClassName('ItemComment');
for(i=0;i<lis.length;i++){
lnode=lis[i];
if(lnode.getAttribute('data-edmund-widget-author')){
poster=lnode.getAttribute('data-edmund-widget-author');
oldclasses = lnode.getAttribute('class').split(' ');
newclasses = new Array();
for(j=0;j<oldclasses.length;j++){
if ((oldclasses[j]!='edmund-widget-favourite')&&(oldclasses[j]!='edmund-widget-ignore')){
newclasses.push(oldclasses[j]);
};
};
if(edmund_widget_disqus_cookie_contains_poster(poster,'pbfav')){
newclasses.push('edmund-widget-favourite');
lnode.setAttribute('data-edmund-widget-favourite','true');
}else{
lnode.setAttribute('data-edmund-widget-favourite','');
};
if(edmund_widget_disqus_cookie_contains_poster(poster,'pbign')){
lnode.setAttribute('data-edmund-widget-ignore','true');
newclasses.push('edmund-widget-ignore');
}else{
lnode.setAttribute('data-edmund-widget-ignore','');
};
lnode.setAttribute('class',newclasses.join(' '));
};
};
return false;
};


function edmund_widget_disqus_cookie_contains_poster(poster,ckn){
if(document.cookie.length<1){
return false;
};
ck=edmund_widget_discus_cookie_contents(ckn);
return (ck.indexOf('|'+escape(poster)+'|')>=0);
};

function edmund_widget_disqus_add_poster_to_list(node,ckn,e){
poster=node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-edmund-widget-author');
if(edmund_widget_disqus_cookie_contains_poster(poster,ckn)) {return false;};
ck=edmund_widget_discus_cookie_contents(ckn);
document.cookie=ckn+'='+ck+'|'+escape(poster)+'|; expires=Thu, 22 Feb 2020 00:00:00 UTC; path=/; domain=politicalbetting.vanillaforums.com';
edmund_widget_refresh_document();
e.preventPropagation();
return true;
};

function edmund_widget_remove_poster_from_list(node,ckn,e){
poster=node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-edmund-widget-author');
ck=edmund_widget_discus_cookie_contents(ckn);
ck=ck.replace('|'+escape(poster)+'|','');
document.cookie=ckn+'='+ck+'; expires=Thu, 22 Feb 2020 00:00:00 UTC; path=/; domain=politicalbetting.vanillaforums.com';
edmund_widget_refresh_document();
e.preventPropagation();
return true;
};

function edmund_widget_disqus_more_comments(){
DISQUS.dtpl.actions.fire('thread.sort', document.getElementById('dsq-sort-select').value);
window.edmund_widget_setup_links_done=false;
window.setTimeout('edmund_widget_disqus_setup_links()',500);
return false;
};

function edmund_widget_discus_cookie_contents(n){
ck='';
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

function edmund_widget_disqus_next_favourite(startnode,node,e){
if(!startnode){
if(document.getElementsByClassName('ItemComment').length>0){
li=document.getElementsByClassName('ItemComment')[0];
}else{
e.stopPropagation();
return false;
};
}else{
li=startnode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
};
while(li=li.nextSibling){
if(li && li.tagName=='LI' && li.getAttribute && li.getAttribute('data-edmund-widget-favourite')=='true' ) {
console.log(li.id);
node.href='#'+li.id;
e.stopPropagation();
console.log('return');
return true;
};
};
node.href='#'+li.id;
e.stopPropagation();
return true;
};


function edmund_widget_disqus_embed_function(s) 
{
	var script=document.createElement('script');
	script.innerHTML=s.toString().replace(/([\s\S]*?return;){2}([\s\S]*)}/,'$2');
	document.body.appendChild(script);
}


edmund_widget_disqus_embed_function(edmund_widget_disqus_setup_links);


edmund_widget_disqus_embed_function(edmund_widget_disqus_set_styles);
edmund_widget_disqus_embed_function(edmund_widget_disqus_linkify_child_node);
edmund_widget_disqus_embed_function(edmund_widget_refresh_document);
edmund_widget_disqus_embed_function(edmund_widget_disqus_setup_links_when_ready);
edmund_widget_disqus_embed_function(edmund_widget_disqus_cookie_contains_poster);
edmund_widget_disqus_embed_function(edmund_widget_disqus_add_poster_to_list);


edmund_widget_disqus_embed_function(edmund_widget_remove_poster_from_list);
edmund_widget_disqus_embed_function(edmund_widget_disqus_more_comments);
edmund_widget_disqus_embed_function(edmund_widget_discus_cookie_contents);



edmund_widget_disqus_embed_function(edmund_widget_disqus_next_favourite);

edmund_widget_disqus_setup_links();


