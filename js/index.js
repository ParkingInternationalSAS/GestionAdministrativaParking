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
   let fechaInicial = $('#datetimePickerFrom').val();
   let fechaFinal = $('#datetimePickerUntil').val();
   let terminal = $('#terminal').val();

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
       let zones, parks, incomeTypes;
       let urlZone = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/zonas';
       let urlPark = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/parqueaderos';
       let urlIncomeType = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/tipoIngreso';

       let optionsHtmlZone = '';
       let optionsHtmlPark = '';
       let optionHtmlIncomeType = '';
       $.when(            
           $.getJSON(urlZone, function(data) {
               zones = data;
           }),
           $.getJSON(urlPark, function(data) {
               parks = data;
           }),
           $.getJSON(urlIncomeType, function(data){
               incomeTypes = data;
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
             $('#Park').html(optionsHtmlPark);
           }
           else{
             optionsHtmlPark = '<option value="">No hay parqueaderos disponibles</option>';
           }
          
           if(incomeTypes){
             optionHtmlIncomeType = '<option value="">Selec. Tipo de ingreso</option>';
             $.each(incomeTypes.data, function(key, val){
               optionHtmlIncomeType += '<option value="' + val.tipoIngreso + '">' + val.nombreTipoIngreso + '</option>';       
             });
             $('#incomeType').html(optionHtmlIncomeType);
           }
           else{
             optionsHtmlPark = '<option value="">No hay parqueaderos disponibles</option>';
           }

       }); 
       
       $('#datetimePickerFrom').datetimepicker({
        datepicker: true,
        format: 'Y-m-d',
        timepicker:false,
        yearStart: 2010,
        yearEnd: 2050
       });
       
      
  });
function AddZero(num){
  if(num.length < 2){
    num = '0' + num;
  }
  return num;
};






 $(function(){
   $(".cargar").click(function(){  
         let permiso= false;
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
         }
         
         var table = $('#datatableIndex').DataTable();
         table.clear().draw();
         table.destroy();    
         myurl = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/detalleFacturacion';
         //myurl = 'http://190.61.31.233:9081/planillaDigital/rest/usuario/detalleFacturacion';


         let date = $('#datetimePickerFrom').val();
         let fechaInicial = date + ' 00:00:00';
         let fechaFinal = date + ' 23:59:59';  
         let turno = $('#turn').val();
         let zona = $('#zone').val();
         let tipoIngreso = $('#incomeType').val();
         let rangoFacturaInicial = $('#startInvoice').val();
         let rangoFacturaFinal = $('#endInvoice').val();
         let centroCosto = $('#costCenter').val();
         let nombrePark = $('#Park').val();
         let terminal = $('#terminal').val();

         

         if($('#datetimePickerFrom').val() === ''){
           $('#datetimePickerFrom').addClass("is-invalid");
           return;
         }
         if(turno === ''){
           turno = null;
         }
         if(zona === ''){
           zona = null;
         }
         if(tipoIngreso === ''){
           tipoIngreso = null;
         }
         if(rangoFacturaInicial === ''){
           rangoFacturaInicial = null;
         }
         if(rangoFacturaFinal === ''){
           rangoFacturaFinal = null;
         }
         if(centroCosto === ''){
           centroCosto = null;
         }
         if(nombrePark === ''){
          nombrePark = null;
         }
         if(terminal === ''){
           terminal = null;
           rangoFacturaInicial = null;
           rangoFacturaFinal = null;
         }
         

         let currency = new Intl.NumberFormat("en-US" , {
           style:"currency",
           currency: "USD"
         });
         
         let parametros = {
             fechaInicial,
             fechaFinal,
             turno,
             zona,
             tipoIngreso,
             rangoFacturaInicial,
             rangoFacturaFinal,
             centroCosto,
             nombrePark,
             terminal
         };

         console.log(JSON.stringify(parametros, null, 2));

         let screen = $('.loader-container');
         Loader(screen);
         
         jQuery.ajax ({
         url: myurl,
         type: "POST",
         data: JSON.stringify(parametros, null , 2),
         dataType: "json",
         contentType: "application/json",
         statusCode: {
           200: function(responseObject, textStatus, jqXHR) {

               /*if(responseObject.data.length > 30000){
                 alert('Demasiados registros devueltos por el servicio.\nPor favor eliga un rango de fecha menor o aplique mas filtros.');
                 return;
               }*/

            if(responseObject.data.length > 0){
             let helper ='';
             $.each(responseObject.data,function(i, item){
               
               helper += '<tr>' +
                           '<td>' + item.nombreTipoIngreso + '</td>'+
                           '<td>' + item.factura + '</td>'+
                           '<td>' + item.placa + '</td>'+
                           '<td>' + item.fechaInicial + '</td>'+
                           '<td>' + item.fechaFinal + '</td>'+
                           '<td>' + currency.format(item.efectivo) + '</td>'+
                           '<td>' + currency.format(item.prepark) + '</td>'+
                           '<td>' + currency.format(item.datafono) + '</td>'+
                           '<td>' + currency.format(item.cheque) + '</td>'+
                           '<td>' + currency.format(item.subTotal) + '</td>'+
                           '<td>' + currency.format(item.iva) + '</td>'+
                           '<td>' + currency.format(item.total) + '</td>'+
                           '<td>' + item.nombreEmpleado + '</td>'+
                           '<td>' + item.codTerminal + '</td>'+
                           '<td>' + item.nombrePark + '</td>'+
                           '<td>' + item.codPark + '</td>'+
                           '<td>' + item.barcode + '</td>'+
                           '<td>' + item.idInicioTurno + '</td>'+
                           '<td>' + item.tipoVehiculo + '</td>'+
                           '<td>' + item.beparking + '</td>'+
                           '<td>' + currency.format(item.valorGrupon) + '</td>'+
                         '</tr>';     
             });
             $('#datatableIndex').append(helper);
             $('#datatableIndex').DataTable({               
               dom: 'lBfrtip',
               "scrollX": true,
               fixedHeader: true,
               buttons: [
              {
                 extend:    'excelHtml5',    
                 text:      '<i class="fas fa-file-excel"></i>',
                 titleAttr: 'Exportar a Excel',
                 className: 'btn btn-success',
                 title: 'Detalle Facturacion'  
              }                      
             ],
             "lengthMenu": [ 25, 5, 10, 25, 50, 75, 100 ],
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

function buildTable(item){
var table = document.getElementById('datatableIndex');

for(let i = 0; i < item.length; i++){
let row = '<tr>' +
            '<td>' + item[i].nombreTipoIngreso + '</td>'+
            '<td>' + item[i].factura + '</td>'+
            '<td>' + item[i].placa + '</td>'+
            '<td>' + item[i].fechaInicial + '</td>'+
            '<td>' + item[i].fechaFinal + '</td>'+
            '<td>' + item[i].efectivo + '</td>'+
            '<td>' + item[i].prepark + '</td>'+
            '<td>' + item[i].datafono + '</td>'+
            '<td>' + item[i].cheque + '</td>'+
            '<td>' + item[i].subTotal + '</td>'+
            '<td>' + item[i].iva + '</td>'+
            '<td>' + item[i].total + '</td>'+
            '<td>' + item[i].codEmpleado + '</td>'+
            '<td>' + item[i].codTerminal + '</td>'+
            '<td>' + item[i].nombrePark + '</td>'+
            '<td>' + item[i].codPark + '</td>'+
            '<td>' + item[i].numStiker + '</td>'+
            '<td>' + item[i].idInicioTurno + '</td>'+
            '<td>' + item[i].tipoVehiculo + '</td>'+
            '<td>' + item[i].beparking + '</td>'+
            '<td>' + item[i].valorGrupon + '</td>'+
          '</tr>';
          table.innerHTML += row;
  }
}

function verifyPermissionsConsult(modulo, actividad){
  if( modulo === 1 & actividad === 1){
    console.log('true');
    return true;
  }
  else{
    console.log('false');
    return false;
  }
 }


