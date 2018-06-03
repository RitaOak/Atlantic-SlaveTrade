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
});