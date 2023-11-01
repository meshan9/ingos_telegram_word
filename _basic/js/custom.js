/* Auth */
var game_key = 'SSWf-NCMd2efoZH5SLqCIYRtx8_IIVr0y-mi-x1b';
var game_id = 'duckshoot';
var host = 'g1-dev.accelera.ai'
var token = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6Ijc5NjQ3ODA2MTMwIiwicHJvZmlsZV9pZCI6InFGTjA3d0ozVWlCRWFEQWdNZE5yIiwicGxheWVyX2lkIjoiNzk2NDc4MDYxMzAiLCJhZHZhbmNlZF9pZCI6IjE2NTk5NDYxNTgzNjI2IiwiZ2FtZV9pZCI6ImR1Y2tzaG9vdCIsIm5pY2tuYW1lIjoiIiwiYXZhdGFyIjoiIiwic3Vic2NyaXB0aW9uIjoiYWN0aXZlIiwibm90aWZpY2F0aW9ucyI6ImFjdGl2ZSIsIm9uYm9hcmRpbmciOiJmYWxzZSIsImFjdGl2YXRlZCI6dHJ1ZSwidGltZXN0YW1wIjoxNjU5OTQ2MTU4MzYyLCJ1cGRhdGVfZGF0ZSI6IjIwMjItMDgtMDggMTQ6MDk6MTgiLCJkYXRlIjoiMjAyMi0wOC0wOCIsInRpbWUiOiIxMTowOSIsImRhdGV0aW1lIjoiMjAyMi0wOC0wOCAxNDowOToxOCIsInRhc2tzX25vdGlmaWNhdGlvbiI6ImFjdGl2ZSIsImVuZHBvaW50IjoicHJvZmlsZXMvbW9kaWZ5IiwiY29sbGVjdGlvbnNfaW5mbyI6ImFjdGl2ZSIsInNob3BfaW5mbyI6Im5vdF9hY3RpdmUiLCJyYXRpbmdfaW5mbyI6ImFjdGl2ZSIsInRhc2tzX2luZm8iOiJhY3RpdmUiLCJyZXdhcmRzX2luZm8iOiJhY3RpdmUiLCJhdXRob3JpemVkIjp0cnVlLCJmaW5nZXJwcmludCI6eyJmaW5nZXJwcmludCI6IjE3MDU5MzkzMTAiLCJicm93c2VyIjoiQ2hyb21lIiwiT1MiOiJBbmRyb2lkIiwib3NWZXJzaW9uIjoiNi4wIn0sImlwIjoiNDYuMTM4LjE3LjE0MiJ9.tu5VbZSsMH96EqQN7d_5IUmRt80joQD5RtTxbMcgouM'

var query = decodeURI(window.location.search)
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((values, [ key, value ]) => {
        values[ key ] = value;
        return values
    }, {});

$.ajax({
    url: 'https://'+host+'/api/visit',
    crossdomain: true,
    headers: {
        "Authorization": 'Key ' + game_key,
        "Content-Type": 'application/json'
    },
    contentType: 'application/json',
    type: 'post',
    data: JSON.stringify({
        fingerprint: fingerprint
    }),
    success: function (data) {
        console.info(data);
    },
    error: function (data, e) {
        if (data.status === 500) {
            window.open('_closed.html' + document.location.search, '_self');
        }
    }
});

$('.back-mobile').on('click', function (){
    $('.failed').html('');
    $('.auth').prop('disabled', true).fadeOut(500);
    $('.back-mobile').fadeOut(500);
    $('.code-frame').fadeOut(500);
    $('.mobile-frame').prop('disabled', false).fadeIn(500);
    $('.get-code').prop('disabled', false).fadeIn(500);
    $('.get-code').html('Получить проверочный код');
})

$('.get-code').on('click', function (){
    if ($('.mobile').val() !== '' && $('.mobile').val().replace(/\D/g, "").length === 11){
        $('.get-code').html('Авторизироваться');
        $('.failed').html('');
        $('.get-code').html('Отправлен');
        $('.mobile-frame').prop('disabled', true).fadeOut(500);
        $('.get-code').prop('disabled', true).fadeOut(500);
        $('.auth').prop('disabled', false).fadeIn(500);
        $('.code-frame').fadeIn(500);
        $('.back-mobile').fadeIn(500);
        $.ajax({
            url: 'https://'+host+'/api/auth',
            crossdomain: true,
            headers: {
                "Authorization": 'Key ' + game_key,
                "Content-Type": 'application/json'
            },
            contentType: 'application/json',
            type: 'post',
            data: JSON.stringify({
                ctn : $('.mobile').val().replace(/\D/g, ""),
                fingerprint: fingerprint
            }),
            success: function (data) {
                console.info(data);
                checksum = data.checksum;
            }
        });
    } else {
        $('.failed').html('Проверьте правильность ввода мобильного номера')
    }
})

$('.auth').on('click', function (){
    if ($('.code').val() !== '' && $('.code').val().length === 6){
        $('.failed').html('');
        $('.get-code').html('Подождите...');

        $.ajax({
            url: 'https://'+host+'/api/confirm',
            crossdomain: true,
            headers: {
                "Authorization": 'Key ' + game_key,
                "Content-Type": 'application/json'
            },
            contentType: 'application/json',
            type: 'post',
            data: JSON.stringify({
                ctn : $('.mobile').val().replace(/\D/g, ""),
                code: $('.code').val(),
                checksum: checksum,
                fingerprint: fingerprint
            }),
            success: function (data) {
                window.open('main_web.html' + '?token=' + data.token, '_self');
            },
            error: function (data, e) {
                $('.failed').html('Проверьте правильность кода в СМС сообщении')
            }
        });
    } else {
        $('.failed').html('Проверьте правильность кода в СМС сообщении')
    }
})

//Play
$('.goto-game').on('click', function (){
    $.ajax({
        url: 'https://'+host+'/api/sessions/get',
        crossdomain: true,
        headers: {
            "Authorization": 'Key ' + game_key,
            "Content-Type": 'application/json'
        },
        contentType: 'application/json',
        type: 'post',
        data: JSON.stringify({
            token : query.token
        }),
        success: function (data) {
            console.info(data);
            let session = data.session;
            window.open('main_game.html' + '?token=' + query.token + '&session='+ session, '_self');
        }
    });
})

//goto-menu-initial
$('.goto-menu-initial').on('click', function (){
    window.open('main.html' + '?token=' + query.token, '_self');
})