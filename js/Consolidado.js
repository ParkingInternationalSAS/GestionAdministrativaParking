 $(document).ready(function(){
    $('body').removeAttr('hidden');
    $('#actualUserL').append(sessionStorage.getItem('user'));
    $('#actualUserR').append(sessionStorage.getItem('user'));

    $('.loader-container').hide();   
    
    $('#date').datetimepicker({
     timepicker: true,
     datepicker: true,
     format: 'Y-m-d',
     hours12: false,
     step: 20,
     yearStart: 2010,
     yearEnd: 2050
   });
  
       let zones, parks;
       let urlZone = 'https://190.61.31.221:8443/nominaOperativa/rest/programacion/getZonas';
       let urlPark = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/parqueaderos';

       let optionsHtmlZone = '';
       let optionsHtmlPark = '';
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
         /*let permiso= false;
         let permissions = new Array();
         permissions = JSON.parse(sessionStorage.getItem('permissions'));

         for(let i = 0; i < permissions.length; i++){
           permiso = verifyPermissionsConsult(permissions[i].modulo, permissions[i].actividad);
           if(permiso == true){
             break;
           }
         }      
         
         if(!permiso){
           $('#Modal-2-Message').text('no tiene permitido ejecutar esta acción');
           $('#modal-2').modal('show');
           return;
         }*/
         
         var table = $('#datatableIndex').DataTable();
         table.clear().draw();
         table.destroy();    
         let myurl = 'https://190.61.31.221:8443/nominaOperativa/rest/programacion/getConsolidado';
         //myurl = 'http://190.61.31.233:9081/planillaDigital/rest/usuario/detalleFacturacion';

         let cedula = $(`#cc`).val();
         let parqueadero =$(`#park`).val();
         let _from = new Date($('#date').val());
         let fecha = $('#date').val();
         let zona = $('#zone').val();

         if(cedula === ''){
           cedula = null;
         }
         if(parqueadero === ''){
           parqueadero = null;
         }
         if(fecha === ''){
           fecha = null;
         }
         if(zona === ''){
           zona = null;
         }

         
         var parametros = {
             cedula,
             parqueadero,
             fecha,
             zona
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
              
                console.log(item);
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
                    

                switch(item.inconsistencias)
                {
                    case 0:
                        item.inconsistencias = `CUADRADO`
                        break;
                    case 1:
                        item.inconsistencias = `DESCUADRADO`
                        break;
                }

                switch(item.cumpleHoraEntrada)
                {
                    case 0:
                        item.cumpleHoraEntrada = `NO`
                        break;
                    case 1:
                        item.cumpleHoraEntrada = `SI`
                        break;
                }

                switch(item.cumpleHoraSalida)
                {
                    case 0:
                        item.cumpleHoraSalida = 'NO'
                        break;
                    case 1:
                        item.cumpleHoraSalida = `SI`
                        break;
                }

               helper += '<tr>' +
                           '<td>' + item.zona + '</td>'+
                           '<td>' + item.cedula + '</td>'+
                           '<td>' + item.nombre + '</td>'+
                           '<td>' + item.cargo + '</td>'+
                           '<td>' + item.centroCostos + '</td>'+                       
                           '<td>' + item.parquedero + '</td>'+
                           '<td>' + item.fecha + '</td>'+
                           '<td>' + item.dia + '</td>'+
                           '<td>' + item.semana + '</td>'+
                           '<td>' + item.horaInicial + '</td>'+
                           '<td>' + item.horaFinal + '</td>'+
                           '<td>' + item.observaciones + '</td>'+
                           '<td>' + item.estado + '</td>'+
                           '<td>' + item.horasTrabajadas + '</td>'+
                           '<td>' + item.horasProgramadas + '</td>'+
                           '<td>' + item.cumpleHoraEntrada + '</td>'+
                           '<td>' + item.cumpleHoraSalida + '</td>'+
                           '<td>' + item.inconsistencias + '</td>'+
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
                 className: 'btn btn-success btn-sm',
                 title: 'Consulta Consolidado' 
              }                      
             ],
             "lengthMenu": [ 5, 10, 25, 50, 75, 100 ],
             "language": spanish,
             "order": [[ 4, "asc" ]]
             });


            }
           },
           500: function(responseObject, textStatus, errorThrown) {
             $('#Modal-2-Message').text('Error haciendo la consulta!!');
             $('#modal-2').modal('show');	
           } 
         },
         404: function(responseObject, textStatus, errorThrown) {
           $('#Modal-2-Message').text('No se pudo generar la cosnulta intentelo mas tarde!');
           $('#modal-2').modal('show');	
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
 };

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
