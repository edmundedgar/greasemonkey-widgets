// Disqus PB Favourite / Ignore feature
// version 0.5 Inline
// 2012-05-11
// Released under the GPL license: http://www.gnu.org/copyleft/gpl.html
// By Edmund Edgar using techniques from Meglamaniacs4U's version.
// This is designed for politicalbetting.com, but would probably work...
// ...on other sites using Disqus...
// ...if you replace politicalbetting.com for the name of the other site.
//
// Changelog:
// 0.1 (2011-10-02) -- Original release of Disqus version
// 0.2 (2011-12-01) -- Updated along with Disqus change
// 0.3 (2012-05-11) -- Fix to handle Firefox upgrade (broke setTimeout), added rewidgetize links.
// 0.4 (2012-10-19) -- Workaround for broken "More comments" button, which is unusable on the default site.
// 0.5 (2012-10-19) -- Automated rewidgetizing after "More comments" loads.
//



function edmund_widget_disqus_setup_links(){

	if((!document.getElementById('dsq-comments')||(document.getElementsByClassName('dsq-comment').length==0))){ 
		window.setTimeout(edmund_widget_disqus_setup_links,500); 
		return false; 
	}

	if(!document.getElementById('edmund_widget_reload_upper')){ 
		document.getElementById('dsq-global-toolbar').innerHTML+='<a id="edmund_widget_reload_upper" href="#" onClick="return edmund_widget_disqus_more_comments()">Reload</a> &nbsp; &nbsp; &nbsp ';
	};

	if(!document.getElementById('edmund_widget_rewidgetize_upper')){ 
		document.getElementById('dsq-global-toolbar').innerHTML+='<a id="edmund_widget_rewidgetize_upper" href="#" onClick="return edmund_widget_disqus_setup_links()">Rewidgetize</a> &nbsp; &nbsp &nbsp; ';
	};

	if(!document.getElementById('edmund_widget_next_favourite_top_link')){ 
		document.getElementById('dsq-global-toolbar').innerHTML+='<a id="edmund_widget_next_favourite_top_link" name="edmund_widget_next_favourite_top_link" href="#edmund_widget_next_favourite_top_link" onClick="return edmund_widget_disqus_next_favourite(null,this);">First Favourite</a> '; 
	}

	if(!document.getElementById('edmund_widget_reload_lower')){ 
		var edmund_widget_lower_navigation_div=document.createElement('div'); 
		edmund_widget_lower_navigation_div.innerHTML='<a id="edmund_widget_reload_lower" href="#" onClick="return edmund_widget_disqus_more_comments()">Reload</a>  &nbsp; &nbsp; &nbsp '+'<a id="edmund_widget_rewidgetize_lower" href="#" onClick="return edmund_widget_disqus_setup_links()">Rewidgetize</a>';
		document.getElementById('dsq-pagination').parentNode.insertBefore(edmund_widget_lower_navigation_div,document.getElementById('dsq-pagination')); 
	};

	edmund_widget_disqus_set_styles();

	lis=document.getElementsByClassName('dsq-comment');
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
"li.dsq-comment div.dsq-comment-text{font-size:100% !important ;}"+
"li.dsq-comment.edmund-widget-ignore a.ignore_link {display:none !important ;}"+
"li.dsq-comment.edmund-widget-favourite a.favourite_link{display:none !important ;}"+
"li.dsq-comment:not(.edmund-widget-ignore) a.unignore_link {display:none !important ;}"+
"li.dsq-comment:not(.edmund-widget-favourite) a.unfavourite_link {display:none !important ;}"+
"li.dsq-comment:not(.edmund-widget-favourite) a.next_favourite_link {display:none !important ;}"+
"li.dsq-comment.edmund-widget-ignore div.dsq-comment-message {display:none !important ;}"+
"li.dsq-comment.edmund-widget-ignore div.dsq-comment-footer {display:none !important ;}"+
"li.dsq-comment.edmund-widget-favourite {margin:4px; background-color:#ffffcc !important ;}"+
"li.dsq-comment.edmund-widget-favourite div.dsq-comment-message{padding: 6px !important ;}";
document.body.appendChild(sheet);
};

function edmund_widget_disqus_linkify_child_node(node){
if(node.tagName=='LI'){
if(node.getAttribute('data-edmund-widget-author')&&node.getAttribute('data-edmund-widget-author')!=''){ return; };
bits=node.id.split('-');
if((bits.length==3)&&(bits[0]=='dsq')&&(bits[1]=='comment')){
cid=bits[2];
l=node.id;
poster=node.getElementsByClassName('dsq-commenter-name')[0].innerHTML;
posterbox=node.getElementsByClassName('dsq-comment-header')[0];
node.setAttribute('data-edmund-widget-author',poster);
addhtml='<div class="edmund-widget-controls" id="edmund-widget-comment-'+cid+'">';
addhtml+=' <a href="#'+l+'" class="unignore_link" onClick="return edmund_widget_remove_poster_from_list(this,\'pbign\');"> Unignore</a>';
addhtml+=' <a href="#'+l+'" class="ignore_link" onClick="return edmund_widget_disqus_add_poster_to_list(this,\'pbign\');"> Ignore</a>';
addhtml+=' <a href="#'+l+'" class="unfavourite_link" onClick="return edmund_widget_remove_poster_from_list(this,\'pbfav\');"> Unfavourite</a>';
addhtml+=' <a href="#'+l+'" class="favourite_link" onClick="return edmund_widget_disqus_add_poster_to_list(this,\'pbfav\');"> Favourite</a>';
addhtml+=' <a href="#'+l+'" class="next_favourite_link" onClick="return edmund_widget_disqus_next_favourite(this,this);"> Next Favourite</a>';
addhtml+='</div>';
posterbox.innerHTML+=addhtml;
};
};
};

function edmund_widget_disqus_setup_links_when_ready(){
	if (document.getElementById('dsq-pagination').getElementsByTagName('img').length > 0){
		window.setTimeout(edmund_widget_disqus_setup_links_when_ready,500); 
		return false; 
	}
	window.setTimeout(edmund_widget_disqus_setup_links, 500);
}

function edmund_widget_refresh_document(){
// Temporary workaround for Disqus breakage in more comments button.
//DISQUS.dtpl.actions.fire('thread.paginate', 2, this); return false
if (document.getElementsByClassName('dsq-more-button').length > 0) {
var orig = document.getElementsByClassName('dsq-more-button')[0].getAttribute('onClick');
if (orig && (orig.indexOf("this)") != -1)) {
	var newstr = orig.replace("this)", "this, 250); edmund_widget_disqus_setup_links_when_ready();");
	document.getElementsByClassName('dsq-more-button')[0].setAttribute('onClick', newstr);
}
}
lis=document.getElementsByClassName('dsq-comment');
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

function edmund_widget_disqus_add_poster_to_list(node,ckn){
poster=node.parentNode.parentNode.parentNode.parentNode.getAttribute('data-edmund-widget-author');
if(edmund_widget_disqus_cookie_contains_poster(poster,ckn)) {return true;};
ck=edmund_widget_discus_cookie_contents(ckn);
document.cookie=ckn+'='+ck+'|'+escape(poster)+'|; expires=Thu, 22 Feb 2020 00:00:00 UTC; path=/; domain=politicalbetting.com';
edmund_widget_refresh_document();
return true;
};

function edmund_widget_remove_poster_from_list(node,ckn){
poster=node.parentNode.parentNode.parentNode.parentNode.getAttribute('data-edmund-widget-author');
ck=edmund_widget_discus_cookie_contents(ckn);
ck=ck.replace('|'+escape(poster)+'|','');
document.cookie=ckn+'='+ck+'; expires=Thu, 22 Feb 2020 00:00:00 UTC; path=/; domain=politicalbetting.com';
edmund_widget_refresh_document();
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

function edmund_widget_disqus_next_favourite(startnode,node){
if(!startnode){
if(document.getElementsByClassName('dsq-comment').length>0){
li=document.getElementsByClassName('dsq-comment')[0];
}else{
return false;
};
}else{
li=startnode.parentNode.parentNode.parentNode.parentNode;
};
while(li=li.nextSibling){
if(li && li.tagName=='LI' && li.getAttribute && li.getAttribute('data-edmund-widget-favourite')=='true' ) {
node.href='#'+li.id;
return true;
};
};
node.href='#edmund_widget_next_favourite_top_link';
return true;
};


function edmund_widget_disqus_embed_function(s) 
{
	var script=document.createElement('script');
	script.innerHTML=s.toString().replace(/([\s\S]*?return;){2}([\s\S]*)}/,'$2');
	document.body.appendChild(script);
}

window.onload=edmund_widget_disqus_setup_links;

