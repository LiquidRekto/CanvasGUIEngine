var OBJECT_QUEUE = [];
var EVENT_QUEUE = [];
var CURSOR_EVENT_HANDLER, CURSOR_OBJECT_HANDLER = null;
var ctx;

document.addEventListener('mousemove',GetCursors,false);


function CheckCursorEvent(event) {
    var x = event.pageX;
    var y = event.pageY;
    return {"X":x,"Y":y};
}

function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
  }



function IsFillGrad(Fill) {
    // GRADIENT STRUCTURE

    /*

    GRADIENT {
        StartPoint = (x0,y0)
        EndPoint = (x,y)
        ColorStops = num
        Colors = (
            black,
            green,
            .....
        )
    }


    FOR EX: GRADIENT{StartPoint=(150,600) EndPoint=(200,100) ColorStops=3 Colors=(d,d,d,etc.)}

    */


    //


    if (Fill.includes('GRADIENT')) {
        return true;
    } else {
        return false;
    }
}

function FillLinearGradify(Fill) {
    var StartPoint, EndPoint, ColorStops, Colors, h;
    var DAT;
    // Parse the data
    
    // =( -> 2, = -> 1
    
    // Check for spaces

    var SpaceIndex = [];

    for (h = 0; h < Fill.length; h++) {
        if (Fill.substring(h,h+1) == " ") {
            SpaceIndex.push(h);
        }
    }


    DAT = Fill.substring(Fill.indexOf("StartPoint") + String("StartPoint").length - 1 + 2,SpaceIndex[0]);
    StartPoint = {"X":parseInt(DAT.substring(1,DAT.indexOf(","))),"Y":parseInt(DAT.substring(DAT.indexOf(",")+1,DAT.length - 1))};
    console.log(StartPoint);
    

    DAT = Fill.substring(Fill.indexOf("EndPoint") + String("EndPoint").length - 1 + 2,SpaceIndex[1]);
    EndPoint = {"X":parseInt(DAT.substring(1,DAT.indexOf(","))),"Y":parseInt(DAT.substring(DAT.indexOf(",") + 1,DAT.length - 1))};
    console.log(EndPoint);


    DAT = Fill.substring(Fill.indexOf("ColorStops") + String("ColorStops").length + 1, SpaceIndex[2]);
    ColorStops = parseInt(DAT);
    console.log(ColorStops);

    DAT = Fill.substring(Fill.indexOf("Colors") + String("Colors").length - 1 + 2,Fill.length - 1);
    console.log(DAT);
    Colors = [];
    var SpotIndex = []; SpotIndex.push(1);

    for (h = 0; h < DAT.length; h++) {
        if (DAT.substring(h,h+1) == ";") {
            SpotIndex.push(h+1);
        }
    }

    SpotIndex.push(DAT.length);


    for (h = 0; h < SpotIndex.length - 1; h++) {
        Colors.push(DAT.substring(SpotIndex[h],SpotIndex[h+1] - 1));
    }

    console.log(Colors);
    
    //




    //



    var grd = ctx.createLinearGradient(StartPoint.X,StartPoint.Y,EndPoint.X,EndPoint.Y);
    for (h = 0; h < Colors.length; h++) {
        grd.addColorStop(h/(ColorStops- 1), Colors[h]);
        if (h == Colors.length - 1) {
            grd.addColorStop(1,Colors[h]);
            break;
        }
    }

    return grd;
}


function CheckCursorObject(event) {
    var x = event.pageX;
    var y = event.pageY;
    return {"X":x,"Y":y};
}

function GetCursors(e) {
    CURSOR_EVENT_HANDLER = CheckCursorEvent(e);
    CURSOR_OBJECT_HANDLER = CheckCursorObject(e);
}



class CVS_RENDERER {
     constructor(CANVAS) {
        this.target = CANVAS;
        ctx = this.target.getContext('2d');
        this.ObjectQueue = OBJECT_QUEUE;
     }

     InitializeObjects() {
        var i;
        ctx.clearRect(0,0,window.screen.width,window.screen.height);
        document.body.style.cursor = "default";
        for (i=0;i<this.ObjectQueue.length;i++) {
            var Obj = this.ObjectQueue[i];
            switch(Obj.Type) {
                case "CVS_BUTTON": 
                    {
                        //CURSOR INIT

                        

                       if (CURSOR_OBJECT_HANDLER != undefined) {
                            if (
                                CURSOR_OBJECT_HANDLER.X >= Obj.X && CURSOR_OBJECT_HANDLER.X <= (Obj.X + Obj.Width) &&
                                CURSOR_OBJECT_HANDLER.Y >= Obj.Y && CURSOR_OBJECT_HANDLER.Y <= (Obj.Y + Obj.Height)
                            ) {                          
                                if (Obj.Cursor != undefined) {
                                document.body.style.cursor = Obj.Cursor;
                                } else {
                               document.body.style.cursor = "default";
                                }
                            }
                       }



                        //

                        
                    //Create a fake label element to calculate actual width and height of the button label
                    var lb = document.createElement('label');
                    lb.style.zIndex = 10;
                    lb.style.fontWeight = Obj.FontWeight;
                    lb.style.fontSize = Obj.FontSize;
                    lb.style.fontFamily = Obj.FontFamily;
                    lb.innerHTML = Obj.Label; 
                    document.body.appendChild(lb);


                    //

                    //Draw Button Base
                if (CURSOR_OBJECT_HANDLER != undefined) {
                    if (Obj.AllowHover) {
                        if (
                             CURSOR_OBJECT_HANDLER.X >= Obj.X && CURSOR_OBJECT_HANDLER.X <= (Obj.X + Obj.Width) &&
                             CURSOR_OBJECT_HANDLER.Y >= Obj.Y && CURSOR_OBJECT_HANDLER.Y <= (Obj.Y + Obj.Height)
                        ) {      
                            if (Obj.Hover_Background != undefined) {
                                ctx.fillStyle = (IsFillGrad(Obj.Hover_Background) ? FillLinearGradify(Obj.Hover_Background) : Obj.Hover_Background);
                            }    else {
                                ctx.fillStyle = (IsFillGrad(Obj.Background) ? FillLinearGradify(Obj.Background) :  Obj.Background);
                            }                 
                            
                        } else {
                            ctx.fillStyle = (IsFillGrad(Obj.Background) ? FillLinearGradify(Obj.Background) :  Obj.Background);
                        }
                    } else {
                        ctx.fillStyle = (IsFillGrad(Obj.Background) ? FillLinearGradify(Obj.Background) :  Obj.Background);
                    }
                } else {
                    ctx.fillStyle = (IsFillGrad(Obj.Background) ? FillLinearGradify(Obj.Background) :  Obj.Background);
                }
                    
                    ctx.fillRect(Obj.X,Obj.Y,Obj.Width,Obj.Height);
                    //

                    //Draw Button Label

                if (CURSOR_OBJECT_HANDLER != undefined) {

                    if (Obj.AllowHover) {
                        if (
                             CURSOR_OBJECT_HANDLER.X >= Obj.X && CURSOR_OBJECT_HANDLER.X <= (Obj.X + Obj.Width) &&
                             CURSOR_OBJECT_HANDLER.Y >= Obj.Y && CURSOR_OBJECT_HANDLER.Y <= (Obj.Y + Obj.Height)
                        ) {      
                            if (Obj.Hover_Foreground != undefined) {
                                ctx.fillStyle = Obj.Hover_Foreground;
                            }    else {
                                ctx.fillStyle = Obj.Foreground;
                            }                 
                            
                        } else {
                            ctx.fillStyle = Obj.Foreground;
                        }
                    } else {
                        ctx.fillStyle = Obj.Foreground;
                    }
                } else {
                    ctx.fillStyle = Obj.Foreground;
                }

                    var txtWidth = lb.offsetWidth;
                    var txtHeight = lb.offsetHeight;
                    if (Obj.FontWeight != 'regular') {
                    ctx.font = Obj.FontWeight + " " + Obj.FontSize + " " + Obj.FontFamily;
                    } else {
                        ctx.font = Obj.FontSize + " " + Obj.FontFamily;
                    }
                    //Draw Button Label
                    ctx.fillText(Obj.Label,Obj.X + (Obj.Width - txtWidth)/2 ,Obj.Y + (Obj.Height + txtHeight*2/3)/2);
                    //
                    //Remove labels
                    document.body.removeChild(lb);
                    //

                    //
                    }

                    

                    break;
                case 'CVS_TEXT':
                    {

                    }
                    break;
                case 'CVS_TEXTBOX':
                    {
                        //Create a fake label element to calculate actual width and height of the button label
                        // -->  1. To indicate the 'blink' pointer
                        // --> 
                        //

                        var lb = document.createElement('label');
                        lb.style.zIndex = 10;
                        lb.style.fontWeight = Obj.FontWeight;
                        lb.style.fontSize = Obj.FontSize;
                        lb.style.fontFamily = Obj.FontFamily;
                        lb.innerHTML = Obj.Label; 
                        document.body.appendChild(lb);
                    }
                    break;
                case 'CVS_TICKBOX':
                    {

                    }
                    break;
                case 'CVS_RADIOBUTTON':
                    {

                    }
                    break;
                case 'CVS_IMAGE':
                    {

                    }
                    break;
            }
        }
     }

     // Add object to the queue
     AppendObject(CVS_OBJECT) {
         OBJECT_QUEUE.push(CVS_OBJECT);
     }

     // Remove object from the queue
     RemoveObject(CVS_OBJECT) {
         var i;
         var deleted = false;
         for (i=0;i<OBJECT_QUEUE.length;i++) {
             if (CVS_OBJECT.Name == OBJECT_QUEUE[i].Name) {
                 OBJECT_QUEUE.splice(i,1);
                 deleted = true;
                 break;
             }
         }
         if (!deleted) {
             console.warn("WARNING: OBJECT IS ALREADY REMOVED OR DOESN'T ON QUEUE!")
         }
     }

     // Swap two chosen objects' places
     SwapObjects(CVS_OBJECT_1,CVS_OBJECT_2) {
        var p1,p2,i;
        for (i=0;i<OBJECT_QUEUE.length;i++) {
            if (CVS_OBJECT_1.Name == OBJECT_QUEUE[i].Name) {
                p1 = i;
            }
            if (CVS_OBJECT_2.Name == OBJECT_QUEUE[i].Name) {
                p2 = i;
            }
        }
        OBJECT_QUEUE[p1] = CVS_OBJECT_2;
        OBJECT_QUEUE[p2] = CVS_OBJECT_1;
     }


     // Lets an object to be rendered last
     PushOnTop(CVS_OBJECT) {     
        for (i=0;i<OBJECT_QUEUE.length;i++) {
            if (CVS_OBJECT.Name == OBJECT_QUEUE[i].Name) {
                OBJECT_QUEUE.splice(i,1);
                break;
            }
        }
        OBJECT_QUEUE.push(CVS_OBJECT);
     }

     // Lets an object to be rendered first
     DropOnBottom(CVS_OBJECT) {       
        for (i=0;i<OBJECT_QUEUE.length;i++) {
            if (CVS_OBJECT.Name == OBJECT_QUEUE[i].Name) {
                OBJECT_QUEUE.splice(i,1);
                break;
            }
        }
        OBJECT_QUEUE.unshift(CVS_OBJECT);
     }
}

class CVS_EVENTHANDLER {
    constructor(CANVAS) {
        /*

        CURRENT EVENTS

        MouseDown
        MouseEnter
        MouseLeave
        MouseClick
        MouseUp
        KeyDown
        KeyPress
        

        */

        this.target = CANVAS;
        this.EventQueue = [];

    }

    InitializeEvents() {


        // Set all canvas events to null ==> RESET

        this.target.onclick = null;
        this.target.onmousedown = null;
        this.target.onmouseenter = null;
        this.target.onmouseleave = null;
        this.target.onmouseup = null;
        this.target.onkeydown = null;
        this.target.onkeypress = null;
        this.target.onkeyup = null;



        //


        var i,k;
        var Obj;

        



        


        for (i=0;i<this.EventQueue.length;i++) {

            for (k=0;k<OBJECT_QUEUE.length;k++) {

                // Find targetted Object
                if (this.EventQueue[i].Name == OBJECT_QUEUE[k].Name) {
                    Obj = OBJECT_QUEUE[k];
                }

                //
            }

            if (CURSOR_EVENT_HANDLER != undefined) {
            
            if (
               CURSOR_EVENT_HANDLER.X >= Obj.X && CURSOR_EVENT_HANDLER.X <= (Obj.X + Obj.Width) &&
               CURSOR_EVENT_HANDLER.Y >= Obj.Y && CURSOR_EVENT_HANDLER.Y <= (Obj.Y + Obj.Height)
            ) {
                this.target.onclick = this.EventQueue[i].MouseClick;
            }
            }
            
        }
    }

    AppendEvent(CVS_EVENT) {
        this.EventQueue.push(CVS_EVENT);
    }
}

class CVS_EVENT {
    constructor(OBJECT) {
        this.Name = OBJECT.Name;
        this.Type = OBJECT.Type;
        this.MouseDown = null;
        this.MouseEnter = null;
        this.MouseLeave = null;
        this.MouseClick = null;
        this.MouseUp = null;
        this.KeyDown = null;
        this.KeyPress = null;
        this.KeyUp = null;
        this.LeftMouseClick = null;
        this.RightMouseClick = null;
        this.MiddleMouseClick = null;
        this.DoubleClick = null;

        console.log("EVENT INFORMATION:",
        {
            "__ObjectName":this.Name,
            "__ObjectType":this.Type,
            "MouseDown":this.MouseDown,
            "MouseEnter":this.MouseEnter,
            "MouseLeave":this.MouseLeave,
            "MouseClick":this.MouseClick,
            "MouseUp":this.MouseUp,
            "KeyDown":this.KeyDown,
            "KeyPress":this.KeyPress,
            "KeyUp":this.KeyUp,
            "LeftMouseClick":this.LeftMouseClick,
            "RightMouseClick":this.RightMouseClick,
            "MiddleMouseClick":this.MiddleMouseClick,
            "DoubleClick":this.DoubleClick          
        });
    }
    
}

class CVS_BUTTON {
    constructor(NAME,ALLOW_HOVER,POS_X,POS_Y,WIDTH,HEIGHT,LABEL,FONT_WEIGHT,FONT_SIZE,FONT_FAMILY,BACK_COLOR,FORE_COLOR,HOVER_BACK_COLOR,HOVER_FORE_COLOR,CURSOR) {
        this.Type = "CVS_BUTTON";
        this.Name = NAME;
        this.AllowHover = ALLOW_HOVER;
        this.X = POS_X;
        this.Y = POS_Y;
        this.Width = WIDTH;
        this.Height = HEIGHT;
        this.Label = LABEL;
        this.FontWeight = FONT_WEIGHT;
        this.FontSize = FONT_SIZE;
        this.FontFamily = FONT_FAMILY;
        this.Background = BACK_COLOR;
        this.Hover_Background = HOVER_BACK_COLOR;
        this.Hover_Foreground = HOVER_FORE_COLOR;
        this.Foreground = FORE_COLOR;
        this.Cursor = CURSOR;
        console.log("BUTTON INFORMATION:",
        {
            "__Name":this.Name,
            "__Type":"CVS_BUTTON",
            "Allow hover?":this.AllowHover,
            "X Position":this.X,
            "Y Position":this.Y,
            "Width":this.Width,
            "Height":this.Height,
            "Label":this.Label,
            "Font Weight":this.FontWeight,
            "Font Size":this.FontSize,
            "Font Family":this.FontFamily,
            "Background":this.Background,
            "Foreground":this.Foreground,
            "Background (Hover state)":this.Hover_Background,
            "Foreground (Hover state)":this.Hover_Foreground,
            "Cursor":this.Cursor
        });
    }

   // 
   

}

class CVS_TEXT {
    //NAME,ALLOW_HOVER,POS_X,POS_Y,ALIGNMENT,LABEL,FONT_WEIGHT,FONT_SIZE,FONT_FAMILY,COLOR,HOVER_COLOR,CURSOR
    constructor(NAME,ALLOW_HOVER,POS_X,POS_Y,ALIGNMENT,LABEL,FONT_WEIGHT,FONT_SIZE,FONT_FAMILY,COLOR,HOVER_COLOR,CURSOR) {
        this.Type = "CVS_TEXT";
    }
}

class CVS_TEXTBOX {
    constructor(NAME,ALLOW_HOVER,ALLOW_AUTO_BREAK_LINE,POS_X,POS_Y,WIDTH,HEIGHT,HORIZONTAL_ALIGNMENT,VERTICAL_ALIGNMENT,LABEL,PLACEHOLDER,FONT_WEIGHT,FONT_SIZE,FONT_FAMILY,BACK_COLOR,FORE_COLOR,HOVER_BACK_COLOR,HOVER_FORE_COLOR) {
        this.Type = "CVS_TEXTBOX";
        this.Name = NAME;
        this.AllowHover = ALLOW_HOVER;
        this.AllowAutoBreakLine = ALLOW_AUTO_BREAK_LINE;
        this.HorizontalAlignment = HORIZONTAL_ALIGNMENT;
        this.VerticalAlignment = VERTICAL_ALIGNMENT;
        this.X = POS_X;
        this.Y = POS_Y;
        this.Width = WIDTH;
        this.Height = HEIGHT;
        this.Placeholder = PLACEHOLDER;
        this.Label = LABEL,
        this.FontWeight = FONT_WEIGHT;
        this.FontSize = FONT_SIZE;
        this.FontFamily = FONT_FAMILY;
        this.Background = BACK_COLOR;
        this.Hover_Background = HOVER_BACK_COLOR; 
        this.Hover_Foreground = HOVER_FORE_COLOR; 
        this.Foreground = FORE_COLOR;
        console.log("TEXT BOX INFORMATION:",
        {
            "Name":this.Name,
            "Type":"CVS_TEXTBOX",
            "Allow hover?":this.AllowHover,
            "Allow auto break line?":this.AllowAutoBreakLine,
            "X Position":this.X,
            "Y Position":this.Y,
            "Width":this.Width,
            "Height":this.Height,
            "Placeholder":this.Placeholder,
            "Label":this.Label,
            "Horizontal Alignment":this.HorizontalAlignment,
            "Vertical Alignment":this.VerticalAlignment,
            "Font Weight":this.FontWeight,
            "Font Size":this.FontSize,
            "Font Family":this.FontFamily,
            "Background":this.Background,
            "Foreground":this.Foreground,
            "Background (Hover state)":this.Hover_Background,
            "Foreground (Hover state)":this.Hover_Foreground
        });
    }
}

class CVS_TICKBOX {
    constructor() {
        this.Type = "CVS_TICKBOX";
    }
}

class CVS_RADIOBUTTON {
    constructor() {
        this.Type = "CVS_RADIOBUTTON";
    }
}

class CVS_IMAGE {
    constructor() {
        this.Type = "CVS_IMAGE";
    }
}

class CVS_SLIDER {
    constructor() {
        this.Type = "CVS_SLIDER";
    }
}

class CVS_LISTBOX {
    constructor() {
        this.Type = "CVS_LISTBOX";
    }
}

class CVS_GROUPS {
    constructor() {
        this.Type = "CVS_GROUPS";
    }
}

class CVS_SCROLLER {
    constructor() {
        this.Type = "CVS_SCROLLER";
    }
}

class CVS_GRAPHICS {
    constructor() {
        this.Type = "CVS_GRAPHICS";
    }
}