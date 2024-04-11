async function login(){
    event.preventDefault()
    let userEmail = document.querySelector('#emailUser').value;
    sessionStorage.setItem("user", userEmail)
    console.log(sessionStorage.getItem("user"))
}

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
    return undefined;
}

async function search(){
    event.preventDefault()
    let search = document.querySelector('#Search').value;
    let domain = window.location.host;
    let params = GetURLParameter("category") ? "&category="+GetURLParameter("category") : "";

    if(search!=''){
        window.location.replace("/index.html?name="+search+params);
    }
}