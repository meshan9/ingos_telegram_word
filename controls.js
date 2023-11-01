$('.goback').on('click', function (){
    $('.no-main').hide();
    $('.main').show();
    $('.goback').hide();
})

$('.goto-rewards').on('click', function (){
    $('.main').hide();
    $('.rewards').show();
    $('.goback').show();
})

$('.goto-shop').on('click', function (){
    $('.main').hide();
    $('.shop').show();
    $('.goback').show();
})

$('.goto-tasks').on('click', function (){
    $('.main').hide();
    $('.tasks').show();hide
    $('.goback').show();
})

$('.goto-collections').on('click', function (){
    $('.main').hide();
    $('.collections').show();
    $('.goback').show();
})

$('.goto-rating').on('click', function (){
    $('.main').hide();
    $('.rating').show();
    $('.goback').show();
    get_leaderboard();
})

$('.goto-help').on('click', function (){
    $('.modal-help').modal('show')
})