function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function Test() {
    var th1s = this;
    this.answered = [];
    this.questions = [];
    this.answer = function() {
        var isCorrect = true;
        var answers = $('.sbl-answer');
            answers.each(function(a) {
            if (($(this).hasClass('selected-answer') && $(this).attr('correct') == 0)
                || (!$(this).hasClass('selected-answer') && $(this).attr('correct') == 1)) {
                isCorrect = false;
                return;
            }
        });
        th1s.update({isCorrectAnswer: isCorrect ? 1 : -1, answered: 1});
        th1s.endQuestion(isCorrect);
    };
    this.update = function(o) {
        if(o) {
            if(!th1s._base[th1s._currentQuestion].state) {
                th1s._base[th1s._currentQuestion].state = {};
            }
            for(var i in o) {
                th1s._base[th1s._currentQuestion].state[i] = o[i];
            }
        }
        var tbl = {wrong: 0, correct: 0, forgot: 0, na: 0, a: 0};
        for(var i in th1s.answered) {
            if (th1s.answered[i].state.isCorrectAnswer != null)tbl.a++;

            if (th1s.answered[i].state && th1s.answered[i].state.forgot == 1) tbl.forgot++;
            if (th1s.answered[i].state.isCorrectAnswer == 1)  tbl.correct++;
            else if (th1s.answered[i].state.isCorrectAnswer == -1) tbl.wrong++;
        }
        for(var i in th1s._base) {
            if (!th1s._base[i].state) continue;
            if (th1s._base[i].state.isCorrectAnswer != null)tbl.a++;

            if (th1s._base[i].state && th1s._base[i].state.forgot == 1) tbl.forgot++;
            if (th1s._base[i].state.isCorrectAnswer == 1)  tbl.correct++;
            else if (th1s._base[i].state.isCorrectAnswer == -1) tbl.wrong++;
        }
        $('#score-correct').text(tbl.correct);
        $('#score-wrong').text(tbl.wrong);
        $('#score-forgot').text(tbl.forgot);
        $('#score-overall').text(th1s.answered.length + '/' + (th1s._base.length + th1s.answered.length));
    };
    this.endTest = function() {
        $('#question-table').hide();
        $('#results-table').show();
        var questionsHtml = '';
        var correctQuestionsCount = 0;
        for(var i in th1s.answered) {
            var answersHtml = '';
            for(var j in th1s.answered[i].answers) {
                answersHtml += '<div class="'+( th1s.answered[i].answers[j].correct == 1 ? 'correct-answer' : '')+'">' + th1s.answered[i].answers[j].name + '</div>';
            }
            questionsHtml += '<tr><td class="question-result ' + (th1s.answered[i].state.isCorrectAnswer == 1 ? 'correct-result' : 'wrong-result')+'"><b class="result-question">'
            questionsHtml += th1s.answered[i].name +  '</b>'+answersHtml+'</td></tr>';

            if (th1s.answered[i].state.isCorrectAnswer == 1)
                correctQuestionsCount++;
        }

        var questionsCount = th1s.answered.length;
        resultPercent = Math.floor((correctQuestionsCount/questionsCount)*100);

        $('.score-percent').text(resultPercent + '%');

        $('#result-emo').removeClass('emo-think');
        if(resultPercent >= 60) {
            $('.score-percent').removeClass('wrong');
            $('.score-percent').addClass('correct');
            $('#result-emo').removeClass('emo-wrong');
            $('#result-emo').addClass('emo-right');
        } else {
            $('.score-percent').removeClass('correct');
            $('.score-percent').addClass('wrong');
            $('#result-emo').removeClass('emo-right');
            $('#result-emo').addClass('emo-wrong');
        }

        $('#results-table').append(questionsHtml);

        $('#results-score-correct').text($('#score-correct').text());
        $('#results-score-wrong').text($('#score-wrong').text());
        $('#results-score-forgot').text($('#score-forgot').text());
    };
    this.endQuestion = function (isRight) {
            th1s.answered.push(th1s._base[th1s._currentQuestion]);
            th1s._base.splice(th1s._currentQuestion, 1);
            th1s.update(null);

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
        };
        this.move = function (o) {
            if (o != null) {
                o.data.goNext ? th1s._currentQuestion++ : th1s._currentQuestion--;
            }

            if (th1s._currentQuestion < 1)
                th1s._currentQuestion = th1s._base.length - 1;
            else if (th1s._currentQuestion > th1s._base.length - 1)
                th1s._currentQuestion = 0;
            if (th1s._base.length <= 0) {
                th1s.endTest();
                return;
            }
            var q = th1s._base[th1s._currentQuestion];
            $('#block-question').text(q.name)
            $('#block-answers').empty();
            shuffle(q.answers);
            for (var j=0; j < q.answers.length; j++) {
                $('#block-answers').append('<tr><td class="sbl-answer" correct="'+q.answers[j].correct+'"><span>'+q.answers[j].name+'</span></td></tr>')
            }
        };
    this._currentQuestion = null;
    this._base = [];

        this.startTest = function() {
            testId = $('#test-list').val();
            var data = [];
            if (testId == 0) {
                for (var i=1; i < th1s.questions.length; i++) {
                    shuffle(th1s.questions[i]);
                    var q = th1s.questions[i].splice(0,1); //20
                    for(var j in q) {
                        data.push(q[j]);
                    }
                }
            } else {
                data = th1s.questions[testId];
            }
            shuffle(data);
            th1s._base = data;
            th1s._currentQuestion = 0;
            th1s.move(null);
            $('#start-table').hide();
            $('#question-table').show();
            th1s.update(null);
        };

    this.Init = function (q) {

        th1s.questions = q;
        th1s.answered = [];
        th1s._currentQuestion = 0;
        th1s._base = [];

        $(document).on('click', '#question-table .sbl-answer', function() {
            $(this).toggleClass('selected-answer');
        })

        $('.sbtn-exit').on('click', function() {
            if(window.confirm("Бросить тест и выйти?")) {
                $('#start-table').show();
                $('#question-table').hide();
                $('#results-table').hide();
            }
        });

        $('#sbtn-next').on('click', {goNext: true}, th1s.move);
        $('#sbtn-prev').on('click', {goNext: false}, th1s.move);
        $('#sbtn-answer').on('click', th1s.answer)

        $('#sbtn-iforgot').on('click', function () {
            $('.sbl-answer').each(function(a) {
                if ($(this).attr('correct') == 1) {
                    $(this).append('<div class="emo emo-right emo-forgot"></div>');
                    $(this).addClass('forgot-correct');
                }
            });
            th1s.update({forgot:1});
        });

        $('#next-bar').on('click', function() {
            $('#question-table').removeClass('opacity-answers');
            $('body').removeClass('correct-answer wrong-answer');
            $('.emo').addClass('emo-think').removeClass('emo-right emo-wrong');
            $('#rays').remove();
            $('#next-bar').hide();
            $('#control-bar').show();
            th1s.move(null);
        });

    };
}