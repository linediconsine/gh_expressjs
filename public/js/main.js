function expand(IDselector){
    console.log("expand on " + IDselector);
    IDselector = "t1"
    elem = document.getElementById(IDselector)
    if(elem.className.indexOf("hide") != -1){
        elem.className = elem.className.replace(" hide","");
        elem.focus();
    }else{
        elem.className.className = className + " hide"
    }
}