  //Variables globales
  var firstValue = null, firstId = null, editAmount = null;

	$(document).on('click', '.btn_edit', function(event) 
	{
    if(editAmount != null){
      alert('Debe cancelar el elemento seleccionado');
      return;
    }
    //Verificacion de permiso para edtar
    var permiso= false;
    var permissions = new Array();
    permissions = JSON.parse(sessionStorage.getItem('permissions'));
    
    for(var i = 0; i < permissions.length; i++){
      permiso = verifyPermissionsUpdate(permissions[i].modulo, permissions[i].actividad);
      if(permiso == true){
        break;
      }
    }      
    
    if(!permiso){
      alert('no tiene permitido ejecutar esta acción');
      return;
    }
    
		event.preventDefault(); 	
    //make field editable
    firstId = $(this).attr('row_id');
    var helper =  '#' + $(this).attr('row_id');    
    
    var clickedCell= $(helper).closest("td"); 


    firstValue = clickedCell.text();

    var helper2 = '[row_id=' + $(this).attr('row_id') + ']'
    $(helper2).removeAttr('hidden');


    $(helper).attr('contenteditable', 'true');
    $(helper).addClass('bg-warning');
   
	  editAmount = 1;
	})	


$(document).on('click', '#modalCancel', function(event) {
    event.preventDefault();
    var helper =  '#' + firstId;
    $(helper).text(firstValue);
    
    $(helper).attr('contenteditable', 'false');
    $(helper).removeClass('bg-warning');	

    editAmount = null;
})

$(document).on('click', '.btn_save, #modalSave', function(event) 
	{
		event.preventDefault();
    var helper =  '#' + firstId;
    var clickedCell= $(helper).closest("td"); 
    var NewValue = clickedCell.text();
    $(helper).attr('contenteditable', 'false');
    $(helper).removeClass('bg-warning').css('padding','0px');
    helper = '#Fac_' + firstId;
    var factura = $(helper).text();

    if(firstValue === NewValue){
      alert('Valores iguales');
      return;
    }

    helper =  '#park' + firstId;

    var numAprobacionAntiguo = firstValue;
    var numAprobacionNuevo = NewValue;
    var usuarioModifica = sessionStorage.getItem('user'); 
    var numFactura = factura;
    var nombrePark = $(helper).text();;

    

    var myurl = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/editarComprobanteDatafono';

    var parametros = {
             numAprobacionAntiguo,
             numAprobacionNuevo,
             usuarioModifica,
             numFactura,
             nombrePark
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

               console.log(responseObject.mensaje);            
           },
           500: function(responseObject, textStatus, errorThrown) {
             alert( 'Error guardando las respuestas!!' );
           } 
         },
         404: function(responseObject, textStatus, errorThrown) {
           alert( 'No se pudo guradar las respuestas intentelo mas tarde!!' );
         }  
         }).done( function() {

         }).fail( function() {           
         });

         $('#modal1').modal('hide');	 
         
         editAmount = null;
	});



$(document).on('focusout', '.row_data', function(event) 
	{
    $('#modal1').modal('show');	
  });


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
    var park = $('#park').val();
 
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
  
   var zones, parks, incomeTypes;
       var urlZone = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/zonas';
       var urlPark = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/parqueaderos';

       var optionsHtmlZone = '';
       var optionsHtmlPark = '';
       $.when(            
           $.getJSON(urlZone, function(data) {
               zones = data;
           }),
           $.getJSON(urlPark, function(data) {
               parks = data;
           })          
       ).then(function() {
           if (zones) {
             optionsHtmlZone = '<option value="">Selec. Zona</option>';
             $.each(zones.data, function(key, val){
               optionsHtmlZone += '<option value="' + val.nombreZona + '">' + val.nombreZona + '</option>';                    
             });
             $('#zone').html(optionsHtmlZone);
             
           }
           else {
             optionsHtmlZone = '<option value="">No hay zonas disponibles</option>';
           }

           if(parks){
             optionsHtmlPark = '<option value="">Selec. Parqueadero</option>';
             $.each(parks.data, function(key, val){
               optionsHtmlPark += '<option value="' + val.nombrePark + '">' + val.nombrePark + '</option>';       
             });
             $('#park').html(optionsHtmlPark);
           }
           else{
             optionsHtmlPark = '<option value="">No hay parqueaderos disponibles</option>';
           }
          
       }); 
});

$(function(){
  $(".cargar").click(function(){  

         //Verificacion de permiso para consultar
         var permiso= false;
         var permissions = new Array();
         permissions = JSON.parse(sessionStorage.getItem('permissions'));

         for(var i = 0; i < permissions.length; i++){
           permiso = verifyPermissionsConsult(permissions[i].modulo, permissions[i].actividad);
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
        myurl = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/validacionVaucher';

        var fechaInicial = $('#datetimePickerFrom').val();
        var fechaFinal = $('#datetimePickerUntil').val();
        var zona = $('#zone').val();
        var nombrePark = $('#park').val();        
        var numeroAprobacion = $('#approval').val();
        
        if(fechaInicial === ''){
          $('#datetimePickerFrom').addClass("is-invalid");
          return;
        }
        if(fechaFinal === ''){
          $('#datetimePickerUntil').addClass("is-invalid");
          return;
        }
        if(zona === ''){
          zona = null;
        }
        if(nombrePark === ''){
          nombrePark = null;
        }
        if(numeroAprobacion === ''){
          numeroAprobacion = null;
        }

        var parametros = {
            fechaInicial,
            fechaFinal,
            zona,
            nombrePark
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
            //alert(responseObject.data.length);
            var helper =''; var conteo = 0;
            $.each(responseObject.data,function(i, item){
              
              helper += '<tr>' +
                          '<td id="park' + conteo +'">' + item.nombrePark + '</td>'+
                          '<td id="Fac_' +conteo + '">' + item.factura + '</td>'+
                          '<td>' + item.fechaFinal + '</td>'+
                          '<td>' + item.codEmpleado + '</td>'+
                          '<td>' + item.nombreEmpleado + '</td>'+
                          '<td class="row_data" id="' + conteo + '">' + item.numAprobacion + '</td>'+
                          '<td>' + item.valor + '</td>'+
                          '<td>' + item.zona + '</td>'+
                          '<td> <button type="button" class="btn_edit btn btn-success btn-sm" row_id="'+ conteo +'"> <i class="fas fa-edit"> </i></button>' +
                          '</td>'+
                        '</tr>';  
                        
              conteo = conteo + 1;
            });
            $('#datatableIndex').append(helper);
            $('#datatableIndex').DataTable({
              dom: 'lBfrtip',
              keys: true,
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


function verifyPermissionsConsult(modulo, actividad){
  if( modulo === 3 & actividad === 1){
    return true;
  }
  else{
    return false;
  }
 }

 function verifyPermissionsUpdate(modulo, actividad){
  if( modulo === 3 & actividad === 2){
    return true;
  }
  else{
    return false;
  }
 }