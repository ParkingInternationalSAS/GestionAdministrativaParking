function insertarData() {
  var login=document.getElementById("login").value;
  var pass=document.getElementById("pass").value;

  myurl = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/login';  
  //myurl = 'http://190.61.31.233:9081/planillaDigital/rest/usuario/login';  
  var objetoLogin = {
  usuario: login,
  password: pass,   
  };
  jQuery.ajax ({
    url: myurl,
    type: "POST",
    data: JSON.stringify(objetoLogin),
    dataType: "json",
    contentType: "application/json",
    statusCode: {
      200: function(responseObject, textStatus, jqXHR) {
        sessionStorage.clear();
        var permision = new Array();

        for(var i = 0; i < responseObject.data.permisos.length; i++){
          permision[i] = {
          modulo: responseObject.data.permisos[i].modulo,
          actividad: responseObject.data.permisos[i].actividad
        };
        }      

        sessionStorage.setItem('cc', login);
        sessionStorage.setItem('user', responseObject.data.nombre);
        sessionStorage.setItem('permissions', JSON.stringify(permision));
        window.location = "index.html";   
      },
      500: function(responseObject, textStatus, errorThrown) {
        $('#Modal-2-Message').text('Error logueando al usuario!!');
        $('#modal-2').modal('show');	      
    },
    202: function(responseObject, textStatus, errorThrown) {
      $('#Modal-2-Message').text('Usuario o password incorrecto');
      $('#modal-2').modal('show');	      
    } 
  }
}) .done( function() { 

}).fail( function() { 
  console.log(JSON.stringify(objetoLogin))
});
}

  $(document).ready(function(){
    sessionStorage.clear();
});
  
  
  
