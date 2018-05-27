$(document).ready(function () {

    /* PRIMEIRO BOTÃO */
    $("#total_desem").on('click', function () {
        if ($(this).hasClass("button_selected")) {
            return "already has";
          } else {
            $(this).addClass("button_selected");
            $("#total_em").removeClass("button_selected");
          }
    });
    
    $("#total_em").on('click', function () {
        if ($(this).hasClass("button_selected")) {
            return "already has";
          } else {
            $(this).addClass("button_selected");
            $("#total_desem").removeClass("button_selected");
          }
    });


    /* SEGUNDO BOTÃO */
    $("#percentagem_homens").on('click', function () {
        if ($(this).hasClass("button_selected")) {
            return "already has";
          } else {
            $(this).addClass("button_selected");
            $("#percentagem_criancas").removeClass("button_selected");
          }
    });

    $("#percentagem_criancas").on('click', function () {
        if ($(this).hasClass("button_selected")) {
            return "already has";
          } else {
            $(this).addClass("button_selected");
            $("#percentagem_homens").removeClass("button_selected");
          }
    });


    /*INGLÊS - PORTUGUÊS E VICE-VERSA*/
    $("#pt").on('click', function () {
      if ($(this).hasClass("button_selected")) {
          return "already has";
        } else {
          $(this).addClass("button_selected");
          $("#en").removeClass("button_selected");

          $("#titulo_principal").text("Tráfico de Escravos");

          $("#opcoes_vis").text("Opções de visualização");
          $("#total_desem").text("Total de desembarcados");
          $("#total_em").text("Total de embarcados");
          $("#percentagem_homens").text("Percentagem de homens");
          $("#percentagem_criancas").text("Percentagem de crianças");

          $("#total_dias_viagem").text("Total de dias de viagem");
          $("#tonelagem_navio").text("Tonelagem do navio");
          $("#media_dias_viagem").text("Média de dias de viagem");
          $("#total_mortos").text("Total de mortos");
        }
  });

  $("#en").on('click', function () {
      if ($(this).hasClass("button_selected")) {
          return "already has";
        } else {
          $(this).addClass("button_selected");
          $("#pt").removeClass("button_selected");

          $("#titulo_principal").text("Slave trade");
          
          $("#opcoes_vis").text("Vizualization options");
          $("#total_desem").text("Total of disembarked");
          $("#total_em").text("Total of embarked");
          $("#percentagem_homens").text("Percentage of men");
          $("#percentagem_criancas").text("Percentage of children");

          $("#total_dias_viagem").text("Total of travel's days");
          $("#tonelagem_navio").text("Tonnage of ship");
          $("#media_dias_viagem").text("Average days of travel");
          $("#total_mortos").text("Total of dead");
        }
  });
});