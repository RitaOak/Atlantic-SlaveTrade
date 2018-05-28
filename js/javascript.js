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


  /* Para ir buscar os valores da bola mais à direita, como não existe id definido pelo javascript do plugin, 
  temos que ir buscar a última div [#ex1Slider div:nth-child(7) ou #ex1Slider div:last-child()] da div principal 
  do Slider [cujo id="ex1Slider"] que contem 'aria-valuemax="1866"'. Para ir buscar o valor da bola, é apenas 
  ir buscar o value do 'aria-valuenow="1711"' . 
  
  
  Para ir buscar os valores da bola mais à esquerda, a lógica é igual mas é necessário ir à penúltima div dentro
  da div do slider,vou seja, [#ex1Slider div:nth-child(6)].
  */



  /* -------------------------------------------------- OU ---------------------------------------------------- */



  /* Simplesmente vamos buscar os valores do 'aria-valuemax' à última e penúltima div do slider. No entanto, 
  não sei até que ponto isto interfere com outra coisa porque no outro exemplo existe mais coisas a pesquisar por */
});