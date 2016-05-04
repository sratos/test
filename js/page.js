$( window ).load(function() {

    $(document).on('click', '#question-table .sbl-answer', function() {
        $(this).toggleClass('selected-answer');
    });
    $('#sbtn-next').on('click', function() {
        window.test.move({data: {goNext: true}});
    });
    $('#sbtn-prev').on('click', function() {
        window.test.move({data: {goNext: false}});
    });
    $('#sbtn-answer').on('click', function() {
        window.test.answer();
    });
    $('#sbtn-iforgot').on('click', function () {
        $('.sbl-answer').each(function(a) {
            if ($(this).attr('correct') == 1) {
                $(this).append('<div class="emo emo-right emo-forgot"></div>');
                $(this).addClass('forgot-correct');
            }
        });
        window.test.update({forgot:1});
    });
    $('.sbtn-exit').on('click', function() {
        if(window.confirm("Бросить тест и выйти?")) {
            $('#start-table').show();
            $('#question-table').hide();
            $('#results-table').hide();
        }
    });
    $('#next-bar').on('click', function() {
        $('#question-table').removeClass('opacity-answers');
        $('body').removeClass('correct-answer wrong-answer');
        $('.emo').addClass('emo-think').removeClass('emo-right emo-wrong');
        $('#rays').remove();
        $('#next-bar').hide();
        $('#control-bar').show();
        window.test.move(null);
    });

    var testList = [
          ['Пробное тестирование - 2016', null],
          ['Физ. химия', 'fiz_himia'],
          ['Фармакология', 'farmakologia'],
          ['Пат. физиология', 'pat_fiziologia'],
          ['Органич. химия', 'organich_himia'],
          ['Микробиология', 'mikrobiologia'],
          ['Ботаника', 'botanika'],
          ['Биохимия', 'biohimia'],
          ['Аналитич. химия', 'analit_himia']];

    var jsons = [];

    function fetchJson(name, iter) {
        $.getJSON('asset/test/' + name, function( data ) {
            jsons[iter] = data;
        });
    }

    var options = '';
    for(var i in testList) {
        options += '<option value="'+i+'">'+testList[i][0]+'</option>';
        if (testList[i][1] != null) fetchJson(testList[i][1] + ".json", i);
    }
    $('#test-list').append(options);

    $('#sbtn-begin').on('click', function () {
        window.test = new Test(JSON.parse(JSON.stringify(jsons)));
        window.test.startTest();
    });
});