var EDU = EDU || {};

(function(EDU) {
    EDU.Component = {};

    var Event = EDU.Util.Event;


    var Slide = function(slides, pointers) {
        this.slides = slides;
        this.pointers = pointers;
        this.currentIndex = 0;
        this.switchTimerID = null;

        this.init();
    };
    Slide.prototype = {
        init: function() {
            this.autoSwitch();
            this.bind();
            for (var i = 0, pointer; pointer = this.pointers[i]; i++) {
                this.navigate(pointer, i);
            }
        },
        bind: function() {
            var self = this;
            var mouseInHandler = function() {
                    if (self.switchTimerID !== null) {
                        clearInterval(self.switchTimerID);
                        self.switchTimerID = null;
                    }
                },
                mouseOutHandler = function() {
                    if (self.switchTimerID === null) {
                        self.autoSwitch();
                    }
                };

            Event.addHandler(this.slides[0].parentNode, 'mouseover', mouseInHandler);
            Event.addHandler(this.slides[0].parentNode, 'mouseout', mouseOutHandler);
        },
        navigate: function(pointer, index) {
            var self = this;
            var mouseInHandler = function() {
                clearInterval(self.switchTimerID);

                self.fadeIn(self.slides[index], 500);
                self.setActive(index);
                self.currentIndex = index;
            };
            Event.addHandler(pointer, 'mouseover', mouseInHandler);
        },
        fadeIn: function(ele, time) {
            var stepLength = 1 / 50,
                timerID, self = this;

            for (var i = 0, slide; slide = this.slides[i]; i++) {
                slide.style.display = 'none';
            }

            ele.style.cssText = 'opacity: 0.5;';
            ele.style.display = 'block';

            function step() {
                if (parseFloat(ele.style.opacity) < 1) {
                    ele.style.opacity = parseFloat(ele.style.opacity) + stepLength / 2;
                } else {
                    clearInterval(timerID);
                }
            }

            timerID = setInterval(step, stepLength * time);
        },
        autoSwitch: function() {
            var self = this,
                prevIndex;
            this.switchTimerID = setInterval(function() {
                self.currentIndex++;
                if (self.currentIndex === self.slides.length) {
                    self.currentIndex = 0;
                }
                self.fadeIn(self.slides[self.currentIndex], 500);

                self.setActive(self.currentIndex);
            }, 2000);
        },
        setActive: function(index) {
            for (var i = 0, pointer; pointer = this.pointers[i]; i++) {
                pointer.className = pointer.className.replace('current', '');
            }
            this.pointers[index].className += ' current';
        }
    };
    EDU.Component.Slide = Slide;


    var Tab = function(tabs, targets) {
        this.tabs = tabs;
        this.targets = targets;
        this.init();
    };
    Tab.prototype = {
        init: function() {
            var self = this;
            for (var i = 0, tab; tab = this.tabs[i]; i++) {
                (function(index) {
                    Event.addHandler(tab, 'click', function() {
                        for (var j = 0, tab; tab = self.tabs[j]; j++) {
                            tab.className = tab.className.replace('active', '');
                        }
                        this.className += ' active';
                        for (var j = 0, target; target = self.targets[j]; j++) {
                            target.className = 'hidden';
                        }
                        self.targets[index].className = '';
                    });
                })(i);
            }
        }
    };
    EDU.Component.Tab = Tab;


    var Modal = function() {
        this.obj = null;
        this.modal = null;

        this.init();
    }
    Modal.prototype = {
        init: function() {
            var overlay = document.createElement('div'),
                modal = document.createElement('div'),
                header = document.createElement('div'),
                footer = document.createElement('div'),
                content = document.createElement('div'),
                close = document.createElement('span'),
                title = document.createElement('h4'),

                self = this;

            overlay.style.display = 'none';
            overlay.className = 'overlay';
            modal.className = 'modal';
            header.className = 'modal-header',
            content.className = 'modal-content',
            footer.className = 'modal-footer';
            close.className = 'icon close-modal';
            close.innerHTML = '&#xe601;';

            header.appendChild(close);
            header.appendChild(title);
            modal.appendChild(header);
            modal.appendChild(content);
            modal.appendChild(footer);
            overlay.appendChild(modal);

            document.body.appendChild(overlay);

            this.modal = modal;

            Event.addHandler(close, 'click', function() {
                self.modal.parentNode.style.display = 'none'
            });
        },
        open: function(obj) {
            var modalWidth = obj.width || '500px',
                modalHeight = obj.height || '500px';

            this.modal.style.width = modalWidth;
            this.modal.style.height = modalHeight;

            this.obj = obj;
            if ('content' in obj) {
                this.modal.firstChild.nextSibling.innerHTML = obj.content;
            }
            if ('title' in obj) {
                this.modal.firstChild.lastChild.innerHTML = obj.title;
            }
            if ('footer' in obj) {
                this.modal.lastChild.innerHTML = obj.footer;
            }
            this.modal.parentNode.style.display = 'block';

            this.center();

            if (obj.openCallback) {
                obj.openCallback();
            }
        },
        center: function() {
            var modalWidth = this.modal.style.width,
                modalHeight = this.modal.style.height;

            this.modal.style.marginTop = 0 - (parseInt(modalHeight) / 2) + 'px';
            this.modal.style.marginLeft = 0 - (parseInt(modalWidth) / 2) + 'px';
        },
        close: function() {
            this.modal.parentNode.style.display = 'none';
            if (this.obj.closeCallback) {
                this.obj.closeCallback();
            }
        }
    };

    EDU.Component.Modal = Modal;
})(EDU);
