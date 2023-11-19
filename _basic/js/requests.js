var query = decodeURI(window.location.search)
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((values, [ key, value ]) => {
        values[ key ] = value;
        return values
    }, {});

function errorModal() {
    $('.modal-accelera-dialog-error').modal('show');
}

$('.reload-page').on('click', function (){
    window.open('main_web.html' + document.location.search, '_self');
})

function get_counters() {
    loader('start');
    $.ajax({
        url: 'https://'+host+'/api/counters',
        crossdomain: true,
        headers: {
            "Authorization": 'Key ' + game_key,
            "Content-Type": 'application/json'
        },
        contentType: 'application/json',
        type: 'post',
        data: JSON.stringify({
            fingerprint: fingerprint,
            token: token
        }),
        success: function (data) {
            loader('stop');
            console.info(data);
            let json = JSON.parse(data);
            $('.counter-tries').html('Попыток: ' + ((json.tries !== undefined) ? json.tries : 0))
        },
        error: function (data, e) {
            loader('stop');
            errorModal();
        }
    });
}

function get_leaderboard() {
    loader('start');

    for (let i = 0; i < 50; i++) {
        $('.leaderboard-daily-content').append('<tr>\n' +
            '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-0lax2" rowspan="2">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t<i class="fe fe-award mr-2"></i>\n' +
            '\t\t\t\t\t\t\t\t\t\t</td>\n' +
            '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-cly2 tg-0lax2" rowspan="2">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t<h5 class="mr-2">'+i+'</h5>\n' +
            '\t\t\t\t\t\t\t\t\t\t</td>\n' +
            '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0 mb-0">'+i+'</p>\n' +
            '\t\t\t\t\t\t\t\t\t\t</td>\n' +
            '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0  mb-0 font-weight-bold">'+i+'</p>\n' +
            '\t\t\t\t\t\t\t\t\t\t</td>\n' +
            '\t\t\t\t\t\t\t\t\t</tr>\n' +
            '\t\t\t\t\t\t\t\t\t<tr>\n' +
            '\t\t\t\t\t\t\t\t\t\t<td class="tg-0lax pt-0 pb-0" colspan="2">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t<p class="f-12 mt-0 mb-0" style="color: var(--bs-teal)">Приз: 1000 руб на покупки</p>\n' +
            '\t\t\t\t\t\t\t\t\t\t</td>\n' +
            '\t\t\t\t\t\t\t\t\t</tr>')
    }

    $('.daily-player-place').html()
            $('.daily-player-place').html(1);
            $('.daily-player-score').html(123);

    
        for (let i = 0; i < 50; i ++) {
            $('.leaderboard-weekly-content').append('<tr>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-0lax2" rowspan="2">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<i class="fe fe-award mr-2"></i>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-cly2 tg-0lax2" rowspan="2">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<h5 class="mr-2">'+i+'</h5>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0 mb-0">'+i+'</p>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0  mb-0 font-weight-bold">'+i+'</p>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t</tr>\n' +
                '\t\t\t\t\t\t\t\t\t<tr>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-0lax pt-0 pb-0" colspan="2">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<p class="f-12 mt-0 mb-0" style="color: var(--bs-teal)">Приз: 1000 руб на покупки</p>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t</tr>')
        }

        $('.weekly-player-place').html()
            $('.weekly-player-place').html(2);
            $('.weekly-player-score').html(234);

            
        for (let i = 0; i < 100; i++) {
            $('.leaderboard-monthly-content').append('<tr>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-0lax2" rowspan="2">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<i class="fe fe-award mr-2"></i>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-cly2 tg-0lax2" rowspan="2">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<h5 class="mr-2">'+i+'</h5>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0 mb-0">'+i+'</p>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0  mb-0 font-weight-bold">'+i+'</p>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t</tr>\n' +
                '\t\t\t\t\t\t\t\t\t<tr>\n' +
                '\t\t\t\t\t\t\t\t\t\t<td class="tg-0lax pt-0 pb-0" colspan="2">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<p class="f-12 mt-0 mb-0" style="color: var(--bs-teal)">Приз: 1000 руб на покупки</p>\n' +
                '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                '\t\t\t\t\t\t\t\t\t</tr>')
        }

        $('.monthly-player-place').html()
            $('.monthly-player-place').html(3);
            $('.monthly-player-score').html(345);

    $.ajax({
        url: 'https://'+host+'/api/leaderboard',
        crossdomain: true,
        headers: {
            "Authorization": 'Key ' + game_key,
            "Content-Type": 'application/json'
        },
        contentType: 'application/json',
        type: 'post',
        data: JSON.stringify({
            fingerprint: fingerprint,
            token: query.token,
            name : "points"
        }),
        success: function (data) {
            loader('stop');
            console.info(data);
            let scores = JSON.parse(data);


            //Daily
            let daily = scores.find(x => x.category === 'daily');
            let	position = daily.position;
            let score = 0;
            let player = daily.player;
            if (position !== 0){
                score = daily.score;
            }

            $('.daily-player-place').html()
            $('.daily-player-place').html(position);
            $('.daily-player-score').html(score);

            let x = 1;

            for (let i in daily.scores) {
                $('.leaderboard-daily-content').append('<tr>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-0lax2" rowspan="2">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<i class="fe fe-award mr-2"></i>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-cly2 tg-0lax2" rowspan="2">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<h5 class="mr-2">'+x+'</h5>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0 mb-0">'+i+'</p>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0  mb-0 font-weight-bold">'+daily.scores[i]+'</p>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t</tr>\n' +
                    '\t\t\t\t\t\t\t\t\t<tr>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-0lax pt-0 pb-0" colspan="2">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<p class="f-12 mt-0 mb-0" style="color: var(--bs-teal)">Приз: 1000 руб на покупки</p>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t</tr>')
                x++;
            }

            //Weekly
            let weekly = scores.find(x => x.category === 'weekly');
            position = weekly.position;
            score = 0;
            player = weekly.player;
            if (position !== 0){
                score = weekly.score;
            }

            $('.weekly-player-place').html()
            $('.weekly-player-place').html(position);
            $('.weekly-player-score').html(score);

            let y = 1;

            for (let i in weekly.scores) {
                $('.leaderboard-weekly-content').append('<tr>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-0lax2" rowspan="2">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<i class="fe fe-award mr-2"></i>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-cly2 tg-0lax2" rowspan="2">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<h5 class="mr-2">'+y+'</h5>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0 mb-0">'+i+'</p>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0  mb-0 font-weight-bold">'+weekly.scores[i]+'</p>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t</tr>\n' +
                    '\t\t\t\t\t\t\t\t\t<tr>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-0lax pt-0 pb-0" colspan="2">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<p class="f-12 mt-0 mb-0" style="color: var(--bs-teal)">Приз: 1000 руб на покупки</p>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t</tr>')
                y++;
            }

            //Monthly
            let monthly = scores.find(x => x.category === 'monthly');
            position = monthly.position;
            score = 0;
            player = monthly.player;
            if (position !== 0){
                score = monthly.score;
            }

            $('.monthly-player-place').html()
            $('.monthly-player-place').html(position);
            $('.monthly-player-score').html(score);

            let z = 1;

            for (let i in monthly.scores) {
                $('.leaderboard-monthly-content').append('<tr>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-0lax2" rowspan="2">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<i class="fe fe-award mr-2"></i>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1 tg-cly2 tg-0lax2" rowspan="2">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<h5 class="mr-2">'+z+'</h5>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0 mb-0">'+i+'</p>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-cly1">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<p class="mt-0  mb-0 font-weight-bold">'+monthly.scores[i]+'</p>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t</tr>\n' +
                    '\t\t\t\t\t\t\t\t\t<tr>\n' +
                    '\t\t\t\t\t\t\t\t\t\t<td class="tg-0lax pt-0 pb-0" colspan="2">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t<p class="f-12 mt-0 mb-0" style="color: var(--bs-teal)">Приз: 1000 руб на покупки</p>\n' +
                    '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t\t</tr>')
                z++;
            }

        },
        error: function (data, e) {
            loader('stop');
            errorModal();
        }
    });
}

function get_games() {
    loader('start');
    $.ajax({
        url: 'https://'+host+'/api/games',
        crossdomain: true,
        headers: {
            "Authorization": 'Key ' + game_key,
            "Content-Type": 'application/json'
        },
        contentType: 'application/json',
        type: 'post',
        data: JSON.stringify({
            fingerprint: fingerprint,
            token: token
        }),
        success: function (data) {
            loader('stop');
            console.info(data);
            let json = JSON.parse(data);

            $('.shop-content').html('<h1 class="mb-6 mt-4" style="color: #FFFFFF">\n' +
                '\t\t\t\t\tМагазин\n' +
                '\t\t\t\t</h1>');

            //Check free pack available
            if (json.free !== undefined) {
                let active = (json.free[0].free_available === true) ? '' : 'disabled';
                let wording = (json.free[0].free_available === true) ? 'Забрать' : 'Забрать через ' + json.free[0].time_to_free;

                $('.shop-content').append('<div class="card card-body text-left mb-2" style="background-color: var(--bs-teal)">\n' +
                    '\t\t\t\t\t<h6 class="mb-4 mt-2">\n' +
                    '\t\t\t\t\t\t<table>\n' +
                    '\t\t\t\t\t\t\t<tr>\n' +
                    '\t\t\t\t\t\t\t\t<td>\n' +
                    '\t\t\t\t\t\t\t\t\t<h1 class="mr-2 text-white">+'+json.free[0].rate+ ' '+ json.free[0].ending.toLowerCase()+'</h1>\n' +
                    '\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t\t<td class="text-white">\n' +
                    '\t\t\t\t\t\t\t\t\t'+json.free[0].description+'\n' +
                    '\t\t\t\t\t\t\t\t\t<button class="btn w-100 mt-2 mb-2 text-white shadow button-19 bsm '+active+'" style="" onclick="getfreepack('+json.free[0].id+')">\n' +
                    '\t\t\t\t\t\t\t\t\t\t'+wording+'\n' +
                    '\t\t\t\t\t\t\t\t\t</button>\n' +
                    '\t\t\t\t\t\t\t\t</td>\n' +
                    '\t\t\t\t\t\t\t</tr>\n' +
                    '\t\t\t\t\t\t</table>\n' +
                    '\t\t\t\t\t</h6>\n' +
                    '\t\t\t\t</div>')
            }

            //Processing packs
            if (json.special !== undefined) {
                for (let i in json.special) {
                    $('.shop-content').append('<div class="card card-body text-left mb-2" style="">\n' +
                        '\t\t\t\t\t<h6 class="mb-4 mt-2">\n' +
                        '\t\t\t\t\t\t<table>\n' +
                        '\t\t\t\t\t\t\t<tr>\n' +
                        '\t\t\t\t\t\t\t\t<td>\n' +
                        '\t\t\t\t\t\t\t\t\t<h1 class="mr-2 text-dark">+'+json.special[i].rate+ ' '+ json.special[i].ending.toLowerCase()+'</h1>\n' +
                        '\t\t\t\t\t\t\t\t</td>\n' +
                        '\t\t\t\t\t\t\t\t<td class="text-dark">\n' +
                        '\t\t\t\t\t\t\t\t\t'+json.special[i].description+'\n' +
                        '\t\t\t\t\t\t\t\t\t<button class="btn w-100 mt-2 mb-2 text-white shadow button-19 bsm" style="" onclick="purchase('+json.special[i].id+')">\n' +
                        '\t\t\t\t\t\t\t\t\t\tПриобрести за '+json.special[i].pointsrate+' руб.\n' +
                        '\t\t\t\t\t\t\t\t\t</button>\n' +
                        '\t\t\t\t\t\t\t\t</td>\n' +
                        '\t\t\t\t\t\t\t</tr>\n' +
                        '\t\t\t\t\t\t</table>\n' +
                        '\t\t\t\t\t</h6>\n' +
                        '\t\t\t\t</div>')
                }
            }

            //Processing packs
            if (json.packs !== undefined) {
                for (let i in json.packs) {
                    $('.shop-content').append('<div class="card card-body text-left mb-2" style="">\n' +
                        '\t\t\t\t\t<h6 class="mb-4 mt-2">\n' +
                        '\t\t\t\t\t\t<table>\n' +
                        '\t\t\t\t\t\t\t<tr>\n' +
                        '\t\t\t\t\t\t\t\t<td>\n' +
                        '\t\t\t\t\t\t\t\t\t<h1 class="mr-2 text-dark">+'+json.packs[i].rate+ ' '+ json.packs[i].ending.toLowerCase()+'</h1>\n' +
                        '\t\t\t\t\t\t\t\t</td>\n' +
                        '\t\t\t\t\t\t\t\t<td class="text-dark">\n' +
                        '\t\t\t\t\t\t\t\t\t'+json.packs[i].description.toLowerCase()+'\n' +
                        '\t\t\t\t\t\t\t\t\t<button class="btn w-100 mt-2 mb-2 text-white shadow button-19 bsm" style="" onclick="purchase('+json.packs[i].id+')">\n' +
                        '\t\t\t\t\t\t\t\t\t\tПриобрести за '+json.packs[i].pointsrate+' руб.\n' +
                        '\t\t\t\t\t\t\t\t\t</button>\n' +
                        '\t\t\t\t\t\t\t\t</td>\n' +
                        '\t\t\t\t\t\t\t</tr>\n' +
                        '\t\t\t\t\t\t</table>\n' +
                        '\t\t\t\t\t</h6>\n' +
                        '\t\t\t\t</div>')
                }
            }

            //Collection descriptions
            if (json.collections !== undefined) {
                $('.collections-content').html(json.collections[0].description)
            }

            //Rewards
            if (json.rewards !== undefined) {
                $('.rewards-content').html('');

                for (let i in json.rewards) {
                    let next_index = parseInt(i)+1
                    let header_link = '';
                    if (json.rewards[i].link === undefined) {
                        header_link = 'display: none';
                    }

                    $('.rewards-content').append('<div class="card card-body text-left mb-2">\n' +
                        '\t\t\t\t\t\t\t\tЗадание ' + next_index + '\n' +
                        '\t\t\t\t\t\t\t<h6 class="mb-4 mt-2">\n' +
                        '\t\t\t\t\t\t\t\t<table>\n' +
                        '\t\t\t\t\t\t\t\t\t<tr>\n' +
                        '\t\t\t\t\t\t\t\t\t\t<td>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t<img src="_basic/i/rewards.svg" alt="" style="width: 70px" class="mr-2">\n' +
                        '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                        '\t\t\t\t\t\t\t\t\t\t<td>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t<h5>'+json.rewards[i].short_description+ 'short' + '</h5>\n' +
                        '\t\t\t\t\t\t\t\t<a target="_blank" href="'+json.rewards[i].link+ '" class="btn w-100 mb-2 text-white shadow button-19 bsm" style="'+header_link+'">\n' +
                        '\t\t\t\t\t\t\t\t\tОткрыть ссылку\n' +
                        '\t\t\t\t\t\t\t\t</a>\n'+
                        '\t\t\t\t\t\t\t\t\t\t</td>\n' +
                        '\t\t\t\t\t\t\t\t\t</tr>\n' +
                        '\t\t\t\t\t\t\t\t</table>\n' +
                        '\t\t\t\t\t\t\t</h6>\n' +
                        '\t\t\t\t\t\t\t<a class="" data-bs-toggle="collapse" href="#collapse'+json.rewards[i].id+'" role="button" aria-expanded="false" aria-controls="collapseExample">\n' +
                        '\t\t\t\t\t\t\t\tПодробнее\n' +
                        '\t\t\t\t\t\t\t</a>\n' +
                        '\t\t\t\t\t\t\t<div class="collapse" id="collapse'+json.rewards[i].id+'">\n' +
                        '\t\t\t\t\t\t\t\t'+json.rewards[i].full_description+'\n' +
                        '\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t</div>')
                }
            }
        },
        error: function (data, e) {
            loader('stop');
            errorModal();
        }
    });
}

//Getting game data
get_counters();
get_games();

//API
function getfreepack(id) {
    loader('start');
    $.ajax({
        url: 'https://'+host+'/api/packs/free/get',
        crossdomain: true,
        headers: {
            "Authorization": 'Key ' + game_key,
            "Content-Type": 'application/json'
        },
        contentType: 'application/json',
        type: 'post',
        data: JSON.stringify({
            fingerprint: fingerprint,
            token: query.token
        }),
        success: function (data) {
            loader('stop');
            console.info(data);
            let json = JSON.parse(data);
            $('.dialog-header').html('Бесплатные попытки получены!');
            $('.dialog-body').html('Бесплатные попытки успешно получены и вы можете продолжить игру!');
            $('.dialog-button').html('<button class="btn w-50 mt-2 mb-2 text-white shadow button-19" data-bs-dismiss="modal" aria-label="Close" style="">\n' +
                '\t\t\t\t\tЗакрыть\n' +
                '\t\t\t\t</button>')
            $('.modal-accelera-dialog').modal('show');
            get_games();
            get_counters();
        },
        error: function (data, e) {
            loader('stop');
            errorModal();
        }
    });
}

function purchase(id) {
    loader('start');
    $.ajax({
        url: 'https://'+host+'/api/packs/purchase',
        crossdomain: true,
        headers: {
            "Authorization": 'Key ' + game_key,
            "Content-Type": 'application/json'
        },
        contentType: 'application/json',
        type: 'post',
        data: JSON.stringify({
            fingerprint: fingerprint,
            token: query.token,
            pack: id
        }),
        success: function (data) {
            loader('stop');
            console.info(data);
            $('.dialog-header').html('Пакет попыток приобретен!');
            $('.dialog-body').html('Пакет попыток успешно успешно приобретен и вы можете продолжить игру!');
            $('.dialog-button').html('<button class="btn w-50 mt-2 mb-2 text-white shadow button-19" data-bs-dismiss="modal" aria-label="Close" style="">\n' +
                '\t\t\t\t\tЗакрыть\n' +
                '\t\t\t\t</button>')
            $('.modal-accelera-dialog').modal('show');
            get_counters();
        },
        error: function (data, e) {
            loader('stop');

            console.log(data.responseJSON.status)
            console.log(data);
            if (data.responseJSON.status !== undefined) {

                switch (data.responseJSON.status) {
                    case ("RULE_CODE_STATUS"): {
                        $('.dialog-body').html("К сожалению, вам недоступна покупка попыток, так как вы не абонент билайна. Переходите в билайн со своим номером и получите возможность играть чаще.");
                        break;
                    }

                    case ("RULE_CODE_BALANCE"): {
                        $('.dialog-body').html("К сожалению, у вас недостаточно средств на счете для покупки попыток. Пополнить счет удобно в приложении билайн.");
                        break;
                    }

                    case ("RULE_CODE_PAYMENT_TYPE"): {
                        $('.dialog-body').html("К сожалению, вам недоступна покупка попыток, так как у вас подключена постоплатная система расчетов. Управлять подключенными услугами удобно в приложении билайн.");
                        break;
                    }

                    case ("RULE_CODE_SOC"): {
                        $('.dialog-body').html("К сожалению, вам недоступна покупка попыток, так как у вас подключен запрет на подключение платных услуг. Управлять подключенными услугами удобно в приложении билайн.");
                        break;
                    }

                    case ("RULE_CODE_ACCOUNT"): {
                        $('.dialog-body').html("К сожалению, вам недоступна покупка попыток, так как у вас подключен специальный авансовый счёт. Управлять подключенными услугами удобно в приложении билайн.");
                        break;
                    }

                    case ("RULE_CODE_REGION"): {
                        $('.dialog-body').html("К сожалению, вам недоступна покупка попыток, так как выбранная услуга не предоставляется в текущем регионе.");
                        break;
                    }

                    case ("FAILED"): {
                        $('.dialog-body').html("К сожалению, что-то пошло не так, попробуйте позже.");
                        break;
                    }

                   default: {
                        $('.dialog-body').html("К сожалению, что-то пошло не так, попробуйте позже.");
                        break;
                    }
                }

                $('.dialog-header').html('Что-то пошло не так...');
                $('.dialog-button').html('<button class="btn w-50 mt-2 mb-2 text-white shadow button-19" data-bs-dismiss="modal" aria-label="Close" style="">\n' +
                    '\t\t\t\t\tЗакрыть\n' +
                    '\t\t\t\t</button>')
                $('.modal-accelera-dialog').modal('show');
            }
        }
    });
}