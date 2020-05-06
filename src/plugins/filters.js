exports.formatDate = 
     (dataStr)=>{ 
        dataStr = dataStr + ""
        var dt = new Date(parseInt(dataStr));
        //console.log(dt)
        // yyyy-mm-dd
        var y = dt.getFullYear();
        var m = (dt.getMonth() + 1).toString().padStart(2,"0");
        var d = dt.getDate().toString().padStart(2,"0");
        var hh = dt.getHours().toString().padStart(2,"0");
        var mm = dt.getMinutes().toString().padStart(2,"0");
        var ss = dt.getSeconds().toString().padStart(2,"0");

        return y + "-" + m + "-" + d + "  " + hh + ":" + mm + ":" + ss
   } 
