function Loader(screen){
  $(document)
      .ajaxStart(function (){ 
          screen.fadeIn();
      })
      .ajaxStop(function() {
          screen.fadeOut();
      });
}


$(":input").bind("keyup change", function(e) {
    var fechaInicial = $('#datetimePickerFrom').val();
    var fechaFinal = $('#datetimePickerUntil').val();
    var park = $('#Park').val();
 
    if(fechaInicial != ''){
      $('#datetimePickerFrom').removeClass("is-invalid");
    }
    if(fechaFinal != ''){
      $('#datetimePickerUntil').removeClass("is-invalid");
    }   
    if(park != ''){
      $('.hidden-Section').removeAttr('hidden');
      $('.hidden-Section').show();
    }     
    if(park === ''){
      $('.hidden-Section').hide();
      $('#idStickerStart').val('');
      $('#idStickerEnd').val('');
    }        
  });

  $(document).ready(function(){
    $('body').removeAttr('hidden');
    $('#actualUserL').append(sessionStorage.getItem('user'));
    $('#actualUserR').append(sessionStorage.getItem('user'));

    $('.loader-container').hide();   
    
    $('#datetimePickerFrom').datetimepicker({
     timepicker: true,
     datepicker: true,
     format: 'Y-m-d H:i:s',
     hours12: false,
     step: 20,
     yearStart: 2010,
     yearEnd: 2050
   });
   $('#datetimePickerUntil').datetimepicker({
     timepicker: true,
     datepicker: true,
     format: 'Y-m-d H:i:s',
     hours12: false,
     step: 20,
     yearStart: 2010,
     yearEnd: 2050
   });

   var urlPark = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/parqueaderos';

   $.when(       
    $.getJSON(urlPark, function(data) {
        parks = data;
    })
  ).then(function() {      
      if(parks){
        optionsHtmlPark = '<option value="">Seleccionar Parqueadero</option>';
        $.each(parks.data, function(key, val){
          optionsHtmlPark += '<option value="' + val.nombrePark + '">' + val.nombrePark + '</option>';       
        });
        $('#Park').html(optionsHtmlPark);
      }
      else{
        optionsHtmlPark = '<option value="">No hay parqueaderos disponibles</option>';
      }
  });

});

$(function(){
  $(".cargar").click(function(){  

         var permiso= false;
         var permissions = new Array();
         permissions = JSON.parse(sessionStorage.getItem('permissions'));

         for(var i = 0; i < permissions.length; i++){
           permiso = verifyPermissions(permissions[i].modulo, permissions[i].actividad);
           if(permiso == true){
             break;
           }
         }      
         
         if(!permiso){
           alert('no tiene permitido ejecutar esta acción');
           return;
         }
        
        var table = $('#datatableIndex').DataTable();
        table.clear().draw();
        table.destroy();    
        myurl = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/transaccionStickers';
        //myurl = 'http://190.61.31.233:9081/planillaDigital/rest/usuario/transaccionStickers';

        var fechaInicial = $('#datetimePickerFrom').val();
        var fechaFinal = $('#datetimePickerUntil').val();
        var park = $('#Park').val();
        var idStickerStart = $('#idStickerStart').val();
        var idStickerEnd = $('#idStickerEnd').val();
        
        if(fechaInicial === ''){
          $('#datetimePickerFrom').addClass("is-invalid");
          return;
        }
        if(fechaFinal === ''){
          $('#datetimePickerUntil').addClass("is-invalid");
          return;
        }
        if(park === ''){
          park = null;
          idStickerStart = null;
          idStickerEnd = null;
        }
        if(idStickerStart === ''){
          idStickerStart = null;
        }
        if(idStickerEnd === ''){
          idStickerEnd = null;
        }

        var parametros = {
            fechaInicial,
            fechaFinal,
            park,
            idStickerStart,
            idStickerEnd
        };

        console.log(JSON.stringify(parametros, null, 2));
        var screen = $('.loader-container');
        Loader(screen);
        
        jQuery.ajax ({
        url: myurl,
        type: "POST",
        data: JSON.stringify(parametros, null , 2),
        dataType: "json",
        contentType: "application/json",
        statusCode: {
          200: function(responseObject, textStatus, jqXHR) {
            alert(responseObject.data.length);
            var helper ='';
            $.each(responseObject.data,function(i, item){
              
              helper += '<tr>' +
                          '<td>' + item.placa + '</td>'+
                          '<td>' + item.fechaInicial + '</td>'+
                          '<td>' + item.fechaFinal + '</td>'+
                          '<td>' + item.centroCostos + '</td>'+
                          '<td>' + item.nombreConvenio + '</td>'+
                          '<td>' + item.codigoSticker + '</td>'+
                          '<td>' + item.codEmpleado + '</td>'+
                          '<td>' + item.tiempoTotal + '</td>'+
                          '<td>' + item.total + '</td>'+
                        '</tr>';     
            });
            $('#datatableIndex').append(helper);
            $('#datatableIndex').DataTable({
              dom: 'lBfrtip',
            buttons: [
             {
                extend:    'excelHtml5',    
                text:      '<i class="fas fa-file-excel"></i>',
                titleAttr: 'Exportar a Excel',
                className: 'btn btn-success',
                title: 'Planillas Digitales Parking'  
             }                      
            ],
            "lengthMenu": [ 5, 10, 25, 50, 75, 100 ],
            "language": spanish
            });
          },
          500: function(responseObject, textStatus, errorThrown) {
            alert( 'Error guardando las respuestas!!' );
          },
          202: function(responseObject, textStatus, errorThrown) {
            alert(responseObject.mensaje);
          }
        },
        404: function(responseObject, textStatus, errorThrown) {
          alert( 'No se pudo guradar las respuestas intentelo mas tarde!!' );
        }  
        }).done( function() {

        }).fail( function() {
        console.log(JSON.stringify(parametros))            
        });
    })
});

var spanish = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    },
    "buttons": {
        "copy": "Copiar",
        "colvis": "Visibilidad"
    }
}




function verifyPermissions(modulo, actividad){
  if( modulo === 2 & actividad === 1){
    console.log('true');
    return true;
  }
  else{
    console.log('false');
    return false;
  }
 }