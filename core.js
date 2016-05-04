function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function Test(q) {
    var th1s = this;
    this.selectedQuestions = 25;
    this.answered = [];
    this.questions = q;
    this._currentQuestion = null;
    this._base = [];

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
            var ansHtml = '';
            for(var j in th1s.answered[i].answers) {
                ansHtml += '<div class="' + (th1s.answered[i].answers[j].correct == 1 ? 'correct-answer' : '') + '">';
                ansHtml += th1s.answered[i].answers[j].name + '</div>';
            }
            var clType = '';
            if (th1s.answered[i].state.isCorrectAnswer == 1) {
                correctQuestionsCount++;
                clType = 'correct';
            } else {
                clType = 'wrong';
            }

            questionsHtml += '<tr><td class="question-result ' + clType + '-result">';
            questionsHtml += '<b class="result-question">' + th1s.answered[i].name + '</b>' + ansHtml + '</td></tr>';
        }

        var questionsCount = th1s.answered.length;
        resultPercent = Math.floor((correctQuestionsCount/questionsCount)*100);

        $('.score-percent').text(resultPercent + '%');

        var fullSuccess = (resultPercent >= 60);

        $('#result-emo').removeClass('emo-think');
        $('.score-percent').removeClass(fullSuccess ? 'wrong' : 'correct');
        $('.score-percent').addClass(fullSuccess ? 'correct' : 'wrong');
        $('#result-emo').removeClass(fullSuccess ? 'emo-wrong' : 'emo-right');
        $('#result-emo').addClass(fullSuccess ? 'emo-right' : 'emo-wrong');

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
            var ansHtml = '';
            for (var j=0; j < q.answers.length; j++) {
                ansHtml += '<tr><td class="sbl-answer" correct="' + q.answers[j].correct + '">';
                ansHtml += '<span>' + q.answers[j].name + '</span></td></tr>';
            }
            $('#block-answers').append(ansHtml);
        };

    this.startTest = function() {
        testId = $('#test-list').val();
        var data = [];
        if (testId == 0) {
            for (var i=1; i < th1s.questions.length; i++) {
                shuffle(th1s.questions[i]);
                var q = th1s.questions[i].splice(0,th1s.selectedQuestions);
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
}