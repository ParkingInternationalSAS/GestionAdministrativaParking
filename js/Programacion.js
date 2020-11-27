  //Variables globales
  var firstId = null, allowCreateOrUpdate = false, conteo = 1, isEdit = false, cedula, nombrePark, optionsHtmlPark = '', isConsult = false;

	$(document).on('click', '.btn_edit', function(event) 
	{
    
    //Verificacion de permiso para edtar
    /*var permiso= false;
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
    }*/
    
    event.preventDefault(); 
    if(allowCreateOrUpdate){
      alert('Debe cancelar el elemento seleccionado');
      if(isEdit)
      {
        location.href = `#rowId-${firstId}-edit`;
      }
      else
      {
        location.href = `#rowId-${firstId}`;
      }      
      return;
    }	
    
    firstId = $(this).attr(`row_id`);
    let fecha = $('#fecha-' + firstId).text();
    
    fecha = new Date(fecha);
    let today = new Date();    

    diff = today - fecha;   
    console.log(parseInt(diff/ 86400000));
    if(parseInt((diff / 86400000)) != 0)
    {
      alert(`Demasiado antiguo para modificar`);
      return;
    }
    
    isEdit = true;
    
    
    AllowUpdateRow(firstId, 'btn btn-success btn-sm', 'fas fa-ellipsis-h');

    let helper = '#rowId-' + firstId;
    $(helper).hide(); 
	})	


$(document).on('click', '.btn_cancel', function(event) {
    event.preventDefault();
    allowCreateOrUpdate = false;
    let helper =  '#rowId-' + firstId;

    if(isEdit)
    {
      $(helper).show();
      helper = `${helper}-edit`;
      $(helper).remove();
      isEdit = false;
    }
    else
    {
      helper =  '#rowId-' + firstId;
      $(helper).remove();
    }
})

$(document).on('click', '.btn_save', function(event) 
	{
    event.preventDefault();
    let id = firstId;
    let helper;
    if(isEdit)
    {
      helper = `${firstId}-edit`;
    }
    else
    {
      helper = conteo;
    }

    let zona = $('#zona-' + helper).text();
    let cedula = $('#cedula-' + helper).val();
    let nombre = $('#nombre-' + helper).text();
    let cargo = $('#cargo-' + helper).text();
    let proyecto = $('#proyecto-' + helper).val();
    let parqueadero = $('#parqueadero-' + helper).text();
    let fecha = $('#fecha-' + helper).val();
    let dia = $('#dia-' + helper).text();
    let semana = $('#semana-' + helper).text();
    let horaEntrada = $('#horaEntrada-' + helper).val();
    let horaSalida = $('#horaSalida-' + helper).val();
    let estado = $('#estado-' + helper).val();
    let obervaciones = $('#obervaciones-' + helper).val();   
    console.log('#obervaciones-' + helper);

    var myurl = 'https://190.61.31.221:8443/nominaOperativa/rest/programacion/insertTurno';

    var parametros = {
            zona,
            cedula,
            nombre,
            cargo,
            proyecto,
            parqueadero,
            fecha,
            dia,
            semana,
            horaEntrada,
            horaSalida,
            estado,
            obervaciones
        };

    if(isEdit)
    {
      myurl = 'https://190.61.31.221:8443/nominaOperativa/rest/programacion/updateTurno';
      
      parametros = {
        id,
        zona,
        cedula,
        nombre,
        cargo,
        proyecto,
        parqueadero,
        fecha,
        dia,
        semana,
        horaEntrada,
        horaSalida,
        estado,
        obervaciones
        };
    }
    console.log(JSON.stringify(parametros, null, 2));   
    console.log(myurl);     
    

        if(cedula === '' || proyecto === `` || fecha === `` ||  horaEntrada === `` || horaSalida === `` || estado === ``)
        {      
          alert('Todos los campos son obligatorios');    
          return;
        }
        
        if(nombre == ``)
        {
          alert('Debe ingresar una cedula registrada');
          return;
        }
        
        if(parqueadero === ``)
        {
          alert('Debe ingresar una parqueadero registrado');
          return;
        }
        helper = '#rowId-' + conteo;
        if(isEdit)
        {
          helper = `#rowId-${firstId}-edit`
        }
        $(helper).remove();

         jQuery.ajax ({
         url: myurl,
         type: "POST",
         data: JSON.stringify(parametros, null , 2),
         dataType: "json",
         contentType: "application/json",
         statusCode: {
           200: function(responseObject, textStatus, jqXHR) {
          
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


         
         if(isConsult)
         {
           setTimeout(executeConsult, 1000);
         }

        conteo +=1;   
        allowCreateOrUpdate = false;        
	});



$(document).on('focusout', '.row_data_cc', function(event) 
  {
        let helper = '#cedula-' + conteo;
        if(isEdit)
        {
          helper = `#cedula-${firstId}-edit`
        }
        console.log(helper);
        let cc = $(helper).val();

        if(cc != '')
        {
          let myurl = 'https://190.61.31.221:8443/nominaOperativa/rest/programacion/getNombre/' + cc;
          console.log(myurl);
          $.ajax({
              type: 'get',
              url: myurl,
              statusCode: 
              {
                200: function(response) {
                  
                  helper= '#nombre-' + conteo;
                  if(isEdit)
                  {
                    helper= `#nombre-${firstId}-edit`;
                  }

                  $(helper).text(response.data.nombre);

                  helper = '#cargo-'  + conteo;
                  if(isEdit)
                  {
                    helper= `#cargo-${firstId}-edit`;
                  }
                  $(helper).text(response.data.cargo);
                },
                500: function(){
                  helper= '#nombre-' + conteo;
                  $(helper).text('');
                  helper = '#cargo-'  + conteo;
                  $(helper).text('');
                  return;
                }
              }

          });
        }   
  });


  $(document).on('focusout', '.row_data_proy', function(event) 
  {
        let helper = '#proyecto-' + conteo;
        if(isEdit)
        {
          helper = `#proyecto-${firstId}-edit`
        }
        let idPark = $(helper).val();
        if(idPark != '')
        {
          let myurl1 = 'https://190.61.31.221:8443/nominaOperativa/rest/programacion/getNombrePark/' + idPark;
          $.ajax({
            type: 'get',
            url: myurl1,
            statusCode: 
            {
              200:function(response)
              {
              helper = '#parqueadero-' + conteo;
              if(isEdit)
                  {
                    helper= `#parqueadero-${firstId}-edit`;
                  }
              $(helper).text(response.data.nombrePark);

              helper = '#zona-' + conteo;
              if(isEdit)
              {
                helper = `#zona-${firstId}-edit`;
              }
              $(helper).text(response.data.nombreZona);
              },
              500:function()
              {
                helper = '#parqueadero-' + conteo;
                $(helper).text('');
                return;
              }
            }
          });
        }
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


  $(document).ready(function(){    
    $('body').removeAttr('hidden');
    $('#actualUserL').append(sessionStorage.getItem('user'));
    $('#actualUserR').append(sessionStorage.getItem('user'));

    $('.loader-container').hide();   
  
    var parks;
    var urlPark = 'https://190.61.31.221:8443/planillaDigital/rest/usuario/parqueaderos';

    
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
});




$(function(){
  $(".cargar").click(function(){  
        /* editAmount = null;
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
         }*/

        isConsult = true; 
        cedula = $('#cc').val();;
        nombrePark = $('#park').val();
        executeConsult();        
    })   
    

    $('#add').click(function()
    { 
      if(allowCreateOrUpdate)
      {
        alert('Debe cancelar el elemento seleccionado');
        if(isEdit)
        {
          location.href = `#rowId-${firstId}-edit`;
        }
        else
        {
          location.href = `#rowId-${conteo}`;
        }      
        return;
      }      
      firstId = conteo;
      AllowUpdateRow(conteo, 'btn btn-primary btn-sm btn_save', 'far fa-save');
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






function AllowUpdateRow(id, btnClass, iconClass)
{
  let zona = '';
  let cedula = '';
  let nombre = '';
  let cargo = '';
  let proyecto = '';
  let parqueadero = '';
  let fecha = '';
  let dia = '';
  let semana = '';
  let horaEntrada = '';
  let horaSalida = '';
  let obervaciones = ''; 

  if(btnClass == 'btn btn-success btn-sm')
  {
    proyecto = $('#proyecto-' + id).text();
    parqueadero = $('#parqueadero-' + id).text();
    zona = $('#zona-' + id).text();
    cedula = $('#cedula-' + id).text();
    nombre = $('#nombre-' + id).text();
    cargo = $('#cargo-' + id).text();
    fecha = $('#fecha-' + id).text();
    dia = $('#dia-' + id).text();
    semana = $('#semana-' + id).text();
    horaEntrada = $('#horaEntrada-' + id).text();
    horaSalida = $('#horaSalida-' + id).text();
    obervaciones = $('#observaciones-' + id).text();   
  } 

  if(isEdit)
  {    
    id = `${id}-edit`
  }

  $('#datatableIndex')
  .append
  (
      $('<tr>').attr('id','rowId-' + id).addClass('new-row')  
      .append
      (
          $('<td>')
          .append
          (
              $('<input>').attr('type', 'number').attr('id', 'proyecto-' + id).attr('autocomplete','off').addClass('form-control row_data_proy').val(proyecto)
          )
      )
      .append
      (
          $('<td>').attr('id','parqueadero-' + id).text(parqueadero)
      )
      
      .append
      (
          $('<td>').attr('id','zona-' + id).text(zona)
      )
      .append
      (
          $('<td>')
          .append
          (
              $('<input>').attr('type', 'text').attr('id','cedula-' + id).attr('autocomplete','off').addClass('form-control row_data_cc').val(cedula)
          )
      )
      .append
      (
          $('<td>').attr('id','nombre-' + id).text(nombre)
      )
      .append
      (
          $('<td>').attr('id','cargo-' + id).text(cargo)
      )            
      .append
      (
          $('<td>')
          .append
          (
              $('<input>').attr('type', 'text').attr('id','fecha-' + id).attr('onkeydown','return false').attr('autocomplete','off').addClass('form-control date').val(fecha)
          )
      )
      .append
      (
          $('<td>').attr('id','dia-' + id).text(dia)
      )
      .append
      (
          $('<td>').attr('id','semana-' + id).text(semana)
      )
      .append
      (
          $('<td>')
          .append
          (
              $('<input>').attr('type', 'text').attr('id','horaEntrada-' + id).attr('autocomplete','off').attr('onkeydown','return false').addClass('form-control timepicker').val(horaEntrada)
          )
      )
      .append
      (
          $('<td>')
          .append
          (
              $('<input>').attr('type', 'text').attr('id','horaSalida-' + id).attr('autocomplete','off').attr('onkeydown','return false').addClass('form-control timepicker').val(horaSalida)
          )
      )
      .append
      (
          $('<td>')
          .append
          (
              $('<select>').attr('type', 'text').attr('id','estado-' + id).attr('autocomplete','off').addClass('form-control state')
          )
      )
      .append
      (
          $('<td>')
          .append
          (
              $('<input>').attr('type', 'text').attr('id','obervaciones-' + id).attr('autocomplete','off').addClass('form-control').val(obervaciones)
          )
      )
      .append
      (
          $('<td>')
          .append
          (
              $('<button>').addClass('btn btn-success btn-sm btn_save')
              .append
              (
                $('<i>').addClass('fas fa-check-circle')
              )
          )
          .append
          (
              $('<button>').addClass('btn btn-danger btn-sm btn_cancel')
              .append
              (
                $('<i>').addClass('far fa-window-close ')
              )
          )
      )
  )
  $('.zona').html(optionsHtmlPark);

  $('.date').datepicker({
          dateFormat:"yy-mm-dd",
          onSelect: function(dateText, inst) {
            let  weekday=new Array(7);
                weekday[0]="Domingo";
                weekday[1]="Lunes";
                weekday[2]="Martes";
                weekday[3]="Miercoles";
                weekday[4]="Jueves";
                weekday[5]="Viernes";
                weekday[6]="Sabado";


            let date = $(this).datepicker('getDate');
            let dayOfWeek = date.getUTCDay();

            let helper1 = '';
            if(date.getDate() > 0 && date.getDate() < 8){
              helper1 = '1'
            }else if(date.getDate() > 7 && date.getDate() < 16){
              helper1 = '2'
            }
            else if(date.getDate() > 15 && date.getDate() < 23){
              helper1 = '3'
            }else if(date.getDate() > 22 && date.getDate() < 31){
              helper1 = '4'
            }

            let idHelper = '#dia-' + id;
            $(idHelper).text(weekday[dayOfWeek]);
            idHelper = '#semana-' + id
            $(idHelper).text(helper1);    
            //$(idHelper).text($.datepicker.iso8601Week(new Date(dateText)));    
        }
      });       

      $('.timepicker').datetimepicker({
        timepicker: true,
        datepicker: false,
        format: 'H:i',
        hours12: false,
        step: 1,
        yearStart: 2010,
        yearEnd: 2050
      });

      let optionState = `<option value="">Select. Estado</option>
                          <option value="1">Activo</option>
                          <option value="2">Inactivo</option>
                          <option value="3">Descanso</option>
                          <option value="4">Incapacidad</option>
                          <option value="5">Licencia</option>
                          <option value="6">Inasistencia</option>
                          <option value="7">Dia de la familia</option>
                          <option value="8">Vacaciones</option>`;

      $('.state').html(optionState);
      
      allowCreateOrUpdate = true;
      location.href = `#rowId-${id}`;
                       
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

 function executeConsult ()
 {
    allowCreateOrUpdate = false;
    var table = $('#datatableIndex').DataTable();
    table.clear().draw();
    table.destroy();    
    let myurl = 'https://190.61.31.221:8443/nominaOperativa/rest/programacion/getProgramacion';

    if(nombrePark === ''){
      nombrePark = null;
    }
    if(cedula === ''){
      cedula = null;
    }

    let parametros = {
        cedula,
        nombrePark
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
        let helper =''; 
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

          helper += `<tr id="rowId-${item.id}">
                      <td id="proyecto-${item.id}">${item.proyecto}</td>
                      <td id="parqueadero-${item.id}">${item.parqueadero}</td>
                      <td id="zona-${item.id}">${item.zona}</td>
                      <td id="cedula-${item.id}">${item.cedula}</td>
                      <td id="nombre-${item.id}">${item.nombre}</td>
                      <td id="cargo-${item.id}">${item.cargo}</td>                      
                      <td id="fecha-${item.id}">${item.fecha}</td>
                      <td id="dia-${item.id}">${item.dia}</td>
                      <td id="semana-${item.id}">${item.semana}</td>
                      <td id="horaEntrada-${item.id}">${item.horaEntrada}</td>
                      <td id="horaSalida-${item.id}">${item.horaSalida}</td>
                      <td id="estado-${item.id}">${item.estado}</td>
                      <td id="observaciones-${item.id}">${item.observaciones}</td>
                      <td><button type="button" class="btn_edit btn btn-success btn-sm" row_id="${item.id}"><i class="fas fa-edit"></i></button></td>
                      </tr>`;  
                    
          if(item.id > conteo)
          {
            conteo = item.id;
          }
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
              title: 'Comprobante Datafono'  
          }                      
          ],
        "lengthMenu": [ 100, 5, 10, 25, 50, 75, 100 ],
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
 }