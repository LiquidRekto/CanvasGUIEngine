var cvs = document.createElement('canvas');
cvs.width = 600; cvs.height = 450;
var body = document.getElementsByTagName('body')[0];

body.appendChild(cvs);

var renderer = new CVS_RENDERER(cvs);
var evHdl = new CVS_EVENTHANDLER(cvs);

var btn = new CVS_BUTTON("simple_btn",true,100,50,200,45,"Click Me","bold","1.2em","Arial","rgb(25,25,25)","white","rgb(80,80,80)",null,"pointer");
var btn_2 = new CVS_BUTTON("simple_btn_2",true,100,300,200,45,"Hello","bold","1.2em","Arial","rgb(25,25,25)","white","rgb(80,80,80)",null,"pointer");

renderer.AppendObject(btn);
renderer.AppendObject(btn_2);

var click_ev = new CVS_EVENT(btn);
click_ev.MouseClick = function() {
   alert("Hello Kode World!");
}

evHdl.AppendEvent(click_ev);

window.onmousemove = window.onload =  function() {
    evHdl.InitializeEvents();
    renderer.InitializeObjects();
}
