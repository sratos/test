window.Test = {
    list: [
              ['_ЗАОЧ_КРОК1 Пробное тестирование - 2016', null],
              ['_ЗАОЧ_КРОК1_Физ. химия (обучение)', 'fiz_himia'],
              ['_ЗАОЧ_КРОК1_Фармакология (обучение)', 'farmakologia'],
              ['_ЗАОЧ_КРОК1_Пат. физиология (обучение)', 'pat_fiziologia'],
              ['_ЗАОЧ_КРОК1_Органич. химия (обучение)', 'organich_himia'],
              ['_ЗАОЧ_КРОК1_Микробиология (обучение)', 'mikrobiologia'],
              ['_ЗАОЧ_КРОК1_Ботаника (обучение)', 'botanika'],
              ['_ЗАОЧ_КРОК1_Биохимия (обучение)', 'biohimia'],
              ['_ЗАОЧ_КРОК1_Аналитич. химия (обучение)', 'analit_himia']
          ],
    answer: function() {
        var isCorrect = true;
        var answers = $('.sbl-answer');
            answers.each(function(a) {
            if (($(this).hasClass('selected-answer') && $(this).attr('correct') == 0)
                || (!$(this).hasClass('selected-answer') && $(this).attr('correct') == 1)) {
                isCorrect = false;
                return;
            }
        });
        Test.update({isCorrectAnswer: isCorrect ? 1 : -1, answered: 1});
        Test.endQuestion(isCorrect);
    },
    update: function(o) {
        if(o) {
            if(!Test._base[Test._currentQuestion].state) {
                Test._base[Test._currentQuestion].state = {};
            }
            for(var i in o) {
                Test._base[Test._currentQuestion].state[i] = o[i];
            }
        }
        var tbl = {wrong: 0, correct: 0, forgot: 0, na: 0, a: 0};
        for(var i in Test._base) {
            if (!Test._base[i].state) continue;
            if (Test._base[i].state.isCorrectAnswer != null)tbl.a++;

            if (Test._base[i].state && Test._base[i].state.forgot == 1) tbl.forgot++;
            if (Test._base[i].state.isCorrectAnswer == 1)  tbl.correct++;
            else if (Test._base[i].state.isCorrectAnswer == -1) tbl.wrong++;
        }
        $('#score-correct').text(tbl.correct);
        $('#score-wrong').text(tbl.wrong);
        $('#score-forgot').text(tbl.forgot);
        $('#score-overall').text(tbl.a + '/' + Test._base.length);
    },
    endQuestion: function (isRight) {
            $('#control-bar').hide();
            $('#next-bar').show();
            $('.emo').removeClass('emo-think').addClass(isRight ? 'emo-right' : 'emo-wrong');

            if(isRight) {
                $('body').append('<div id="rays"></div>');
                $('body').addClass('correct-answer');
                $('#question-table').addClass('opacity-answers');
            } else {
                $('body').addClass('wrong-answer');
            }

            $('.sbl-answer').each(function(a) {
                if ($(this).attr('correct') == 1) {
                    $(this).addClass('correct-answer');
                } else if ($(this).hasClass('selected-answer')) {
                    $(this).addClass('wrong-answer');
                }
                $(this).removeClass('selected-answer');
            });
        },
    _currentQuestion: null,
    _base: [],
    Init: function () {
        $(document).on('click', '#question-table .sbl-answer', function() {
            $(this).toggleClass('selected-answer');
        })

        var options = '';
        for(var i in Test.list) {
            options += '<option value="'+i+'">'+Test.list[i][0]+'</option>'
        }
        $('#test-list').append(options);

        $('#sbtn-begin').on('click', function() {
            testId = $('#test-list').val();
            var data = window.questions[testId];
            shuffle(data);
            Test._base = data;
            Test._currentQuestion = 0;
            showQuestion();
            $('#start-table').hide();
            $('#question-table').show();
            Test.update(null);
        })

        $('#sbtn-exit').on('click', function() {
            if(window.confirm("Бросить тест и выйти?")) {
                $('#start-table').show();
                $('#question-table').hide();
            }
        });

        $('#sbtn-next').on('click', {goNext: true}, move);
        $('#sbtn-prev').on('click', {goNext: false}, move);

        $('#sbtn-answer').on('click', Test.answer)

        $('#sbtn-iforgot').on('click', function () {
            $('.sbl-answer').each(function(a) {
                if ($(this).attr('correct') == 1) {
                    $(this).append('<div class="emo emo-right emo-forgot"></div>');
                    $(this).addClass('forgot-correct');
                }
            });
            Test.update({forgot:1});
        });

        $('#next-bar').on('click', function() {
            $('#question-table').removeClass('opacity-answers');
            $('body').removeClass('correct-answer wrong-answer');
            $('.emo').addClass('emo-think').removeClass('emo-right emo-wrong');
            $('#rays').remove();


            $('#next-bar').hide();
            $('#control-bar').show();
            move({data: {goNext: true}});
        });

        function shuffle(a) {
            var j, x, i;
            for (i = a.length; i; i -= 1) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
        }

        function move(o) {
            if (o.data.goNext) Test._currentQuestion++;
            else if (Test._currentQuestion > 0) Test._currentQuestion--;
            showQuestion();
        }

        function getCurrentQuestion() {
            return window.Test._base[Test._currentQuestion];
        }

        function showQuestion() {
            var q = getCurrentQuestion();
            $('#block-question').text(q.name)
            $('#block-answers').empty();
            shuffle(q.answers);
            for (var j=0; j < q.answers.length; j++) {
                $('#block-answers').append('<tr><td class="sbl-answer" correct="'+q.answers[j].correct+'"><span>'+q.answers[j].name+'</span></td></tr>')
            }
        }

        window.questions = []

        for(var i in Test.list) {
            if (Test.list[i][1] == null) continue;
            fetchJson(Test.list[i][1] + ".json", i)
        }

        function fetchJson(name, iter) {
            $.getJSON(name, function( data ) {
                window.questions[iter] = data;
            });
        }
    }
}