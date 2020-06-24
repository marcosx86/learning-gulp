var proj = {};

proj.APIKey = ""; // <- your API Key
proj.APIPwd = ""; // <- your API Password
proj.Name = "Sample1";
proj.ReplaceNames = true;

// for more parameters of the proj object , please reference
// http://service.javascriptobfuscator.com/httpapi.asmx?WSDL

var item0 = new Object();
item0.FileName = "test0.js";
item0.FileCode = "function hello(x,y){var z=11;return x+y+z;}";

var item1 = new Object();
item1.FileName = "test1.js";
item1.FileCode = "var strs=['aaaa','bbbb','cccc','dddd','eeee','abcdefghijklmnopqrstuvwxyz0123456789']";

proj.Items = [item0, item1];

var url = "https://service.javascriptobfuscator.com/HttpApi.ashx";

var xhr = new XMLHttpRequest();
xhr.open("POST", url, false);
xhr.setRequestHeader("Content-Type", "text/json");
xhr.send(JSON.stringify(proj));

if (xhr.status != 200) {
  alert("Http Error :" + xhr.status + "\r\n" + xhr.responseText);
} else {
  var result = JSON.parse(xhr.responseText);
  if (result.Type != "Succeed") {
    alert(" ERROR : " + result.Type + ":" + result.ErrorCode + ":" + result.Message);
  } else {
    for (var i = 0; i < result.Items.length; i++) {
      var div = document.createElement("DIV");
      div.style.cssText = "margin:12px;border-bottom:solid 1px gray;";
      div.innerText = result.Items[i].FileCode;
      document.body.appendChild(div);
    }
  }
}