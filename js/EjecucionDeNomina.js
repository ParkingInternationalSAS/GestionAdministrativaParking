$(":input").bind("keyup change", function(e) {
   var fechaInicial = $('#datetimePickerFrom').val();
   var fechaFinal = $('#datetimePickerUntil').val();
   var terminal = $('#terminal').val();

   if(fechaInicial != ''){
     $('#datetimePickerFrom').removeClass("is-invalid");
   }
   if(fechaFinal != ''){
     $('#datetimePickerUntil').removeClass("is-invalid");
   }  
   if(terminal != ''){
    $('.hidden-Section').removeAttr('hidden');
    $('.hidden-Section').show();
   }
   if(terminal === ''){
    $('.hidden-Section').hide();    
    $('#startInvoice').val('');    
    $('#endInvoice').val('');
   }

 });
 
 


  $(document).ready(function(){
       
       $('body').removeAttr('hidden');
       $('#actualUserL').append(sessionStorage.getItem('user'));
       $('#actualUserR').append(sessionStorage.getItem('user'));

       $('.loader-container').hide();
       let parks;
       let urlPark = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/parqueaderos';

       let optionsHtmlPark = '';
       $.when(  
           $.getJSON(urlPark, function(data) {
               parks = data;
           })          
       ).then(function() {   
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
       
       $('#datetimePickerDate').datetimepicker({
        datepicker: true,
        format: 'Y-m-d',
        timepicker:false,
        yearStart: 2010,
        yearEnd: 2050
       });
  });



  $(function(){
   $(".cargar").click(function(){  
         /*var permiso= false;
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
         }*/
         
         var table = $('#datatableIndex').DataTable();
         table.clear().draw();
         table.destroy();    
         let myurl = 'https://190.61.31.221:8443/nominaOperativa/rest/programacion/getDetalleEjecucion';
         //myurl = 'http://190.61.31.233:9081/planillaDigital/rest/usuario/detalleFacturacion';


         
         let cedula = $(`#cc`).val();
         let nombrePark = $(`#park`).val();
         let fecha = $('#datetimePickerDate').val();



         if(cedula === ''){
           cedula = null;
         }
         if(nombrePark === ''){
           nombrePark = null;
         }
         if(fecha === ''){
           fecha = null;
         }
         
         let parametros = {
             cedula,
             nombrePark,
             fecha
         };

         console.log(JSON.stringify(parametros, null, 2));       
         
         jQuery.ajax ({
         url: myurl,
         type: "POST",
         data: JSON.stringify(parametros, null , 2),
         dataType: "json",
         contentType: "application/json",
         statusCode: {
           200: function(responseObject, textStatus, jqXHR) {               

            if(responseObject.data.length > 0){
             var helper ='';
             $.each(responseObject.data,function(i, item){
               switch (item.estado) 
                {
                  case 1:
                    item.estado = `Activo`;
                    break;
                  
                  case 2:
                    item.estado = `Inactivo`;
                    break;

                  case 3:
                    item.estado = `Descanso`;
                  break;

                  case 4:
                    item.estado = `Incapacidad`;
                  break;

                  case 5:
                    item.estado = `Licencia`;
                  break;

                  case 6:
                    item.estado = `Inasistencia`;
                  break;

                  case 7:
                    item.estado = `Dia de la familia`;
                  break;

                  case 8:
                    item.estado = `Vacaciones`;
                  break;
                }
               
               helper += '<tr>' +
                           '<td>' + item.codTerminal + '</td>'+
                           '<td>' + item.codPark + '</td>'+
                           '<td>' + item.centroCostos + '</td>'+
                           '<td>' + item.poryecto + '</td>'+
                           '<td>' + item.nombrePunto + '</td>'+
                           '<td>' + item.codEmpleado +'</td>'+
                           '<td>' + item.cedula + '</td>'+
                           '<td>' + item.nombre + '</td>'+
                           '<td>' + item.cargo + '</td>'+
                           '<td>' + item.dia + '</td>'+
                           '<td>' + item.mes + '</td>'+
                           '<td>' + item.anno + '</td>'+
                           '<td>' + item.horaInicio + '</td>'+
                           '<td>' + item.horaFin + '</td>'+
                           '<td>' + item.fechaInicial + '</td>'+
                           '<td>' + item.fechaFinal + '</td>'+
                           '<td>' + item.tiempoSegundos + '</td>'+
                           '<td>' + item.tiempoHoras + '</td>'+
                           '<td>' + item.estado + '</td>'
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
                 title: 'Consulta Detalle facturacion' 
              }                      
             ],
             "lengthMenu": [ 5, 10, 25, 50, 75, 100 ],
             "language": spanish,
             "order": [[ 4, "asc" ]]
             });
            }
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
 };