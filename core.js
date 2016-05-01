window.Test = {
    _currentQuestion: null,
    _base: [],
    Init: function () {

        $( window ).load(function() {

            $(document).on('click', '#question-table .sbl-answer', function() {
                $(this).toggleClass('selected-answer');
            })

            fillTestList();
            $('#sbtn-begin').on('click', function() {
                loadTest();
                $('#start-table').hide();
                $('#question-table').show();
            })

          $('#sbtn-exit').on('click', function() {
                if(window.confirm("Бросить тест и выйти?")) {
                    $('#start-table').show();
                    $('#question-table').hide();

                }
          });

          $('#sbtn-answer').on('click', function() {
                var isCorrect = true;
                var answers = $('.sbl-answer');
                    answers.each(function(a) {
                    if (($(this).hasClass('selected-answer') && $(this).attr('correct') == 0)
                        || (!$(this).hasClass('selected-answer') && $(this).attr('correct') == 1)) {
                        isCorrect = false;
                        return;
                    }
                });
                isCorrect ? correctAnswer() : wrongAnswer();
          })

          $('#sbtn-next').on('click', next);
          $('#sbtn-prev').on('click', prev);
        });

        questions = {correct: [], wrong: []}


        function updateScores() {
            var wrongAnswers = 0;
            var correctAnswers = 0;
            for(var i in Test._base) {
                if (!Test._base[i].state) {

                }
                else if (Test._base[i].state && Test._base[i].state.isCorrectAnswer == 1) {
                    correctAnswers++;
                } else if (Test._base[i].state && Test._base[i].state.isCorrectAnswer == 0) {
                    wrongAnswers++;
                }
            }
            $('#score-correct').text(correctAnswers);
            $('#score-wrong').text(wrongAnswers);
        }

        function wrongAnswer () {
            Test._base[Test._currentQuestion].state = {isCorrectAnswer:0, answered: 1};
            updateScores();
            visualize(false);
        }

        function correctAnswer () {
            Test._base[Test._currentQuestion].state = {isCorrectAnswer:1, answered: 1};
            updateScores();
            visualize(true);
        }

        function visualize(isRight) {
            $('#control-bar').hide();
            $('#next-bar').show();
            var emo = $('.emo');

            emo.removeClass('emo-think');
            isRight ? emo.addClass('emo-right') : emo.addClass('emo-wrong');

            if(isRight) {
                $('body').append('<div id="rays"></div>');
                $('body').addClass('correct-answer');
            } else {
                $('body').addClass('wrong-answer');
            }

            var answers = $('.sbl-answer');
                answers.each(function(a) {
                if ($(this).attr('correct') == 1) {
                    $(this).removeClass('selected-answer');
                    $(this).addClass('correct-answer');
                }
            });

        }

        $('#sbtn-iforgot').on('click', function () {
            $('.sbl-answer').each(function(a) {
                if ($(this).attr('correct') == 1) {
                    $(this).append('<div class="emo emo-right emo-forgot"></div>');
                    $(this).addClass('forgot-correct');
                }
            });
        });

        $('#next-bar').on('click', function() {
            $('body').removeClass('correct-answer');
            $('body').removeClass('wrong-answer');
            $('#rays').remove();
            var emo = $('.emo');
            emo.removeClass('emo-right');
            emo.removeClass('emo-wrong');
            emo.addClass('emo-think');
            $('#next-bar').hide();
            $('#control-bar').show();
            next();
        });

        function loadTest() {
            testId = $('#test-list').val();
            var data = window.questions[testId];
            shuffle(data);
            Test._base = data;
            Test._currentQuestion = 0;
            showQuestion();
        }

        function shuffle(a) {
            var j, x, i;
            for (i = a.length; i; i -= 1) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
        }

        function next() {
            Test._currentQuestion++;
            showQuestion();
        }

        function prev() {
            if(Test._currentQuestion > 0) {
                Test._currentQuestion--;
            }
            showQuestion();
        }

        function getCurrentQuestion() {
            var id = Test._currentQuestion;
            return window.Test._base[id];
        }

        function showQuestion() {
            var q = getCurrentQuestion();
            $('#block-question').text(q.name)
            $('#block-answers').empty();
            shuffle(q.answers);
            for(var j=0; j < q.answers.length; j++) {
                $('#block-answers').append('<tr><td class="sbl-answer" correct="'+q.answers[j].correct+'"><span>'+q.answers[j].name+'</span></td></tr>')
            }
        }

        window.testJson = [
            ['_ЗАОЧ_КРОК1 Пробное тестирование - 2016', null],
            ['_ЗАОЧ_КРОК1_Физ. химия (обучение)', 'fiz_himia'],
            ['_ЗАОЧ_КРОК1_Фармакология (обучение)', 'farmakologia'],
            ['_ЗАОЧ_КРОК1_Пат. физиология (обучение)', 'pat_fiziologia'],
            ['_ЗАОЧ_КРОК1_Органич. химия (обучение)', 'organich_himia'],
            ['_ЗАОЧ_КРОК1_Микробиология (обучение)', 'mikrobiologia'],
            ['_ЗАОЧ_КРОК1_Ботаника (обучение)', 'botanika'],
            ['_ЗАОЧ_КРОК1_Биохимия (обучение)', 'biohimia'],
            ['_ЗАОЧ_КРОК1_Аналитич. химия (обучение)', 'analit_himia']
        ]

        window.questions = []

        function fetchJson(name, iter) {
            $.getJSON(name, function( data ) {
                window.questions[iter] = data;
            });
        }


        for(var i in window.testJson) {
            if(window.testJson[i][1] == null) continue;
            fetchJson(window.testJson[i][1] + ".json", i)
        }

        function fillTestList() {
            var options = ''
            for(var i in window.testJson) {
                options += '<option value="'+i+'">'+window.testJson[i][0]+'</option>'
            }
            $('#test-list').append(options)
        }

    }
}



