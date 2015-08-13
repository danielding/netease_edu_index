/*jslint browser: true, devel: true */
var EDU = EDU || {};

(function (EDU) {
    function init() {
        var Event = EDU.Util.Event,
            Ajax = EDU.Util.Ajax,
            Cookie = EDU.Util.Cookie,
            Modal = EDU.Component.Modal;

        if (document.documentElement.clientWidth < 1205) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = 'styles/narrowScreen.css';
            document.getElementsByTagName("head")[0].appendChild(link);
        }

        var close = document.getElementById('close');
        if (Cookie.get('closeInfo') !== '1') {
            close.parentNode.parentNode.style.display = 'block';
            Event.addHandler(close, 'click', function () {
                Cookie.set('closeInfo', '1', new Date(2020, 1, 1));
                close.parentNode.parentNode.style.display = 'none';
            });
        }

        var follow = document.getElementById('follow'),
            followed = document.getElementById('followed'),
            unfollow = document.getElementById('unfollow');

        if (Cookie.get('followSuc')) {
            follow.style.display = 'none';
            followed.style.display = 'inline-block';
        } else {
            follow.style.display = 'inline-block';
            followed.style.display = 'none';
        }

        Event.addHandler(unfollow, 'click', function () {
            Cookie.unset('followSuc');
            follow.style.display = 'inline-block';
            followed.style.display = 'none';
        });

        var modal = new Modal();

        var video = document.getElementById('video');
        Event.addHandler(video, 'click', function () {
            modal.open({
                'width': '970px',
                'height': '610px',
                'title': '请观看以下视频',
                'content': '<video class="video" autobuffer autoloop loop controls>' +
                    '<source src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4">' +
                    '<param name="autoplay" value="false">' +
                    '<param name="autoStart" value="0">' +
                    '</object>' +
                    '</video>',
                'footer': ''
            });
        });

        Event.addHandler(follow, 'click', function () {
            if (Cookie.get('loginSuc')) {
                Ajax.getRequestData('http://study.163.com/webDev/attention.htm', function (data) {
                    if (parseInt(data, 10) === 1) {
                        Cookie.set('followSuc', '1');
                        follow.style.display = 'none';
                        followed.style.display = 'inline-block';
                    } else {
                        window.alert('关注失败！');
                        return false;
                    }
                });
            } else {
                modal.open({
                    title: '登录网易云课堂',
                    width: '390px',
                    height: '290px',
                    content: '<div class="login-area"><label for="username"><input id="username" placeholder="用户名" type="text"></label><label for="password"><input id="password" placeholder="密码"  type="password"></label></div>',
                    footer: '<button id="login" type="submit">登录</button>',
                    openCallback: function () {
                        var username = document.getElementById('username'),
                            password = document.getElementById('password'),
                            submitBtn = document.getElementById('login');
                        Event.addHandler(submitBtn, 'click', function () {
                            if (username.value.length === 0 || password.value.length === 0) {
                                alert('用户名或密码不能为空');
                                return false;
                            }
                            username = md5(username.value);
                            password = md5(password.value);
                            var url = 'http://study.163.com/webDev/login.htm?userName=' + username + '&password=' + password;
                            Ajax.getRequestData(url, function (data) {
                                if (parseInt(data, 10) === 1) {
                                    modal.close();
                                } else {
                                    alert('用户名或密码错误');
                                    return false;
                                }
                            });
                        });
                    },
                    closeCallback: function () {
                        Cookie.set('loginSuc', '1');
                        Ajax.getRequestData('http://study.163.com/webDev/attention.htm', function (data) {
                            if (parseInt(data, 10) === 1) {
                                Cookie.set('followSuc', '1');
                                follow.style.display = 'none';
                                followed.style.display = 'inline-block';
                            } else {
                                alert('关注失败！');
                            }
                        });

                    }
                });
            }

        });


        var Slider = EDU.Component.Slide;

        var slidesParent = document.getElementById('slides'),
            slides = slidesParent.getElementsByTagName('div'),
            pointersParent = document.getElementById('pointers'),
            pointers = pointersParent.getElementsByTagName('a');

        new Slider(slides, pointers);


        var rankListUrl = 'http://study.163.com/webDev/hotcouresByCategory.htm',
            rank = document.getElementById('rank-list');

        var renderRankList = function (data) {
            var str = '',
                temp,
                i,
                item;

            for (i = 0; i < 10; i++) {
                item = data[i];
                temp = '<li class="rank-item"> ' +
                    '<img class="small-cover" src="images/course/s-' + i % 5 + '.png" alt="">' +
                    '<h5 class="rank-title"><a class="rank-link" href="http://study.163.com/course/introduction/' + item.id + '.htm">' + item.name + '</a></h5>' +
                    '<p class="learner-count-1"><span class="icon">&#xe606;</span> ' + item.learnerCount + '</p>' +
                    '</li>';
                str += temp;
            }
            rank.innerHTML = str;

            for (i = 0; i < 10; i++) {
                data.push(data[i]);
            }

            var start = 0;

            setInterval(function () {
                str = '';
                temp = '';
                if (start < 20) {
                    start++;
                } else {
                    start = 0;
                }

                for (i = start; i < start + 10; i++) {
                    item = data[i];
                    temp = '<li class="rank-item"> ' +
                        '<img class="small-cover" src="images/course/s-' + i % 5 + '.png" alt="">' +
                        '<h5 class="rank-title"><a class="rank-link" href="http://study.163.com/course/introduction/' + item.id + '.htm">' + item.name + '</a></h5>' +
                        '<p class="learner-count-1"><span class="icon">&#xe606;</span> ' + item.learnerCount + '</p>' +
                        '</li>';
                    str += temp;
                }
                rank.innerHTML = str;
            }, 3000);
        };
        Ajax.getRequestData(rankListUrl, renderRankList);


        var productCourseUrl = 'http://study.163.com/webDev/couresByCategory.htm?pageNo=1&psize=24&type=10',
            programCourseUrl = 'http://study.163.com/webDev/couresByCategory.htm?pageNo=1&psize=24&type=20';

        var renderCourseList = function (result, targetID) {
            var data = result.list,
                str = '',
                pageStr = '',
                temp,
                target = document.getElementById(targetID),
                i,
                item;

            for (i = 0; i < data.length; i++) {
                item = data[i];
                temp = '<a class="card" href="http://study.163.com/course/introduction/' + item.id + '.htm">' +
                    '<div class="cover">' +
                    '<img class="" src=images/course/' + (i % 6) + '.png alt="">' +
                    '</div>' +
                    '<h5 class="course-title">' + item.name + '</h4>' +
                    '<p class="author">' + item.provider + '</p>' +
                    '<p class="learner-count"><span class="icon">&#xe606;</span> ' + item.learnerCount + '</p>' +
                    '<p class="price">￥' + item.price + '</p>' +
                    '</a>';
                str += temp;
            }
            pageStr += '<ol class="pagination">' + '<li><a class="prev" href="javascript:void(0)" rel="prev"></a></li>';
            for (i = 1; i < result.totalPage + 1; i++) {
                if (i === result.pagination.pageIndex) {
                    pageStr += '<li><a class="selected" href="javascript:void(0)">' + i + '</a></li>';
                } else {
                    pageStr += '<li><a href="javascript:void(0)">' + i + '</a></li>';
                }
            }
            pageStr += '<li><a class="next" href="javascript:void(0)" rel="next"></a></li>' + '</ol>';
            target.innerHTML = (str + pageStr);
            target.setAttribute('pageIndex', result.pagination.pageIndex);
            target.setAttribute('totalCount', result.pagination.totalCount);
        };
        Ajax.getRequestData(productCourseUrl, function (data) {
            renderCourseList(data, 'product-design');
        });
        Ajax.getRequestData(programCourseUrl, function (data) {
            renderCourseList(data, 'program-language');
        });

        var course = document.getElementById('course');

        Event.addHandler(course, 'click', function (event) {
            event = Event.getEvent(event);
            var target = Event.getTarget(event);
            var pageIndex = target.text;
            var currentIndex = parseInt(target.parentNode.parentNode.getAttribute('pageIndex'), 10),
                totalCount = parseInt(target.parentNode.parentNode.getAttribute('totalCount'), 10);

            if (pageIndex === '' && currentIndex !== 1) {
                if (target.className === 'prev' && currentIndex !== 1) {
                    pageIndex = --currentIndex;
                }
                if (target.className === 'next' && currentIndex !== totalCount) {
                    pageIndex = ++currentIndex;
                }
            }

            if (target.parentNode.parentNode.className === 'pagination') {
                var url = 'http://study.163.com/webDev/couresByCategory.htm?pageNo=' + pageIndex + '&psize=24&type=';
                if (target.parentNode.parentNode.parentNode.id === 'product-design') {
                    url += '10';
                    Ajax.getRequestData(url, function (data) {
                        renderCourseList(data, 'product-design');
                    });
                } else {
                    url += '20';
                    Ajax.getRequestData(url, function (data) {
                        renderCourseList(data, 'program-language');
                    });
                }
            }

        });

        var Tab = EDU.Component.Tab;
        var tab = document.getElementById('tab'),
            tabs = tab.getElementsByTagName('a');

        var target = document.getElementById('course');

        var targets = target.children; // 此处要做兼容性替换

        new Tab(tabs, targets);

    }

    window.onload = init;
})(EDU);