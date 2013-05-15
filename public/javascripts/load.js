
function loadjscssfile(filename, filetype){
	if (filetype=="js"){ //判定文件类型
	var fileref=document.createElement('script')//创建标签
	fileref.setAttribute("type","text/javascript")//定义属性type的值为text/javascript
	fileref.setAttribute("src", filename)//文件的地址
	}
	else if (filetype=="css"){ //判定文件类型
	var fileref=document.createElement("link")
	fileref.setAttribute("rel", "stylesheet")
	fileref.setAttribute("type", "text/css")
	fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined")
	document.getElementsByTagName("head")[0].appendChild(fileref)
}

