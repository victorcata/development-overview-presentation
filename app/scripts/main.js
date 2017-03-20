var app = app || {};

(function(app, w, d) {
    /**
     * Return the slide container of an element
     * @param {object} obj Node Element
     * @param {string} className Name of the class to check
     * @returns {object} Node parent with the class 'slide'
     */
    app.parent = function (node, className) {
        if (node === null) return null;
        if (node.classList.contains(className)) {
            return node;
        } else {
            return app.parent(node.parentElement, className);
        }
    }

    /**
     *
     * @returns {object} Actual navigator
     */
    app.navigator = function() {
        if (d.getElementById('l-front').classList.contains('is-visible')) {
            return navigatorFront;
        } else if (d.getElementById('l-back').classList.contains('is-visible')) {
            return navigatorBack;
        } else {
            return null;
        }
    }

    /**
     * Go to the next slide
     */
    function nextSlide() {
        var actual = d.querySelector('.slide.is-visible');
        var to = this.getAttribute('data-next'),
            toNode = d.querySelector('[data-page="' + to + '"]');
        if (to === undefined && toNode === null) return;

        toNode.classList.add('is-visible');
        var slide = app.parent(this, 'slide');

        slide.style.marginTop = '-100vh';

        if (to === 'front' || to === 'back') {
            if (to === 'front') {
                document.getElementById('menu-front').classList.add('is-active');
                document.getElementById('menu-back').classList.remove('is-active');
            } else if (to === 'back') {
                document.getElementById('menu-back').classList.add('is-active');
                document.getElementById('menu-front').classList.remove('is-active');
            }
            showPaginator(toNode.getElementsByClassName('navigator')[0]);
        }

        setTimeout(function(){
            actual.classList.remove('is-visible');
        }, 1000);

        window.location.href = window.location.pathname + "#" + toNode.getAttribute("data-page");
    }

    /**
     * Go to the next section
     */
    function nextSection() {
        var nav = app.navigator(),
            fromSection = d.querySelector('[data-page="' + nav.active() + '"]');

        // Pasar a otro evento
        if (this.classList.contains('is-up')) {
            goIndex();
            return;
        }

        var to = nav.next(),
            toSection = d.querySelector('[data-page="' + to + '"]');

        var index = getIndex(fromSection.parentElement.querySelectorAll('.section'), toSection);
        fromSection.parentElement.style.left = (index * -100) + 'vw';
    }


    function _navigateToSlide(to) {
       var actual = d.querySelector('.slide.is-visible');
       //var to = this.getAttribute('data-next');
       var toNode = d.querySelector('[data-page="' + to + '"]');
       if (to === undefined && toNode === null) return;

       toNode.classList.add('is-visible');
       var slide = app.parent(this, 'slide');

       if (slide !== null) {
           slide.style.marginTop = '-100vh';
       }

       if (to === 'front' || to === 'back') {
           if (to === 'front') {
               d.getElementById('menu-front').classList.add('is-active');
               d.getElementById('menu-back').classList.remove('is-active');
               d.getElementById('l-front').classList.add('is-visible');
               d.getElementById('l-back').classList.remove('is-visible');
           } else if (to === 'back') {
               d.getElementById('menu-back').classList.add('is-active');
               d.getElementById('menu-front').classList.remove('is-active');
               d.getElementById('l-back').classList.add('is-visible');
               d.getElementById('l-front').classList.remove('is-visible');
           }
           showPaginator(toNode.getElementsByClassName('navigator')[0]);
       }

       setTimeout(function(){
           actual.classList.remove('is-visible');
       }, 1000);
    }

    /**
     * Go to the next section
     */
    function _navigateToSection() {
        var to = this.getAttribute('data-ref');
        var nav = app.navigator();
        if (!isOnSameGroup.call(this, nav, to)) {
            _navigateToSlide.call(this, this.parentElement.getAttribute('data-ref'));
            nav = app.navigator();
        }

        var fromSection = d.querySelector('[data-page="' + nav.active() + '"]');

        // Pasar a otro evento
        if (this.classList.contains('is-up')) {
            goIndex();
            return;
        }

        var to = nav.to.call(this), //nav.next(),
            toSection = d.querySelector('[data-page="' + to + '"]');

        var index = getIndex(fromSection.parentElement.querySelectorAll('.section'), toSection);
        fromSection.parentElement.style.left = (index * -100) + 'vw';
    }

    /**
     *
     */
    function isOnSameGroup(nav, to) {
        if (nav === null) return false;
        var refs = nav.items().map(function(item){ return item.getAttribute('data-ref'); });
        return refs.indexOf(to) > -1;
    }

    /**
     * Go to the previous section
     */
    function prevSection() {
        var nav = (d.getElementById('l-front').classList.contains('is-visible')) ? navigatorFront : navigatorBack,
            fromSection = d.querySelector('[data-page="' + nav.active() + '"]');

        // Pasar a otro evento
        if (this.classList.contains('is-up')) {
            goIndex();
            return;
        }

        var to = nav.prev(),
            toSection = d.querySelector('[data-page="' + to + '"]');

        var navigator = app.parent(this, 'navigator')
            optActive = navigator.getElementsByClassName('is-active')[0],
            from = optActive.getAttribute('data-ref');

        var index = getIndex(fromSection.parentElement.querySelectorAll('.section'), toSection);
        fromSection.parentElement.style.left = (index * -100) + 'vw';
        
        window.location.href = window.location.pathname + "#" + toSection.getAttribute("data-page");
    }

    function getIndex(list, element) {
        var nodeList = Array.prototype.slice.call(list);
        return nodeList.indexOf(element);
    }

    function goIndex() {
        app.navigator().reset();
        d.getElementById('l-index').classList.add('is-visible');
        d.querySelector('.navigator.is-visible').classList.remove('is-visible');
        setTimeout(function() {
            d.getElementById('l-index').style.marginTop = 0;
        }, 500);

        // Reset
        setTimeout(function(){
            // Reset sections
            d.getElementById('l-back').classList.remove('is-visible');
            d.getElementById('l-back').removeAttribute('style');
            d.getElementById('l-front').removeAttribute('style');
            d.getElementById('l-front').classList.remove('is-visible');
            // Reset navigator
            d.querySelector('#navigator-front .is-active').classList.remove('is-active');
            d.querySelector('#navigator-back .is-active').classList.remove('is-active');
            d.querySelector('#navigator-front li:first-child').classList.add('is-active');
            d.querySelector('#navigator-back li:first-child').classList.add('is-active');
            if (d.querySelector('#navigator-front .is-up') !== null) d.querySelector('#navigator-front .is-up').classList.remove('is-up');
            d.querySelector('#navigator-front .btn-prev-slide').classList.add('is-up');
            if (d.querySelector('#navigator-back .is-up') !== null) d.querySelector('#navigator-back .is-up').classList.remove('is-up');
            d.querySelector('#navigator-back .btn-prev-slide').classList.add('is-up');
        }, 1200);

        window.location.href = window.location.pathname + "#index";
    }

    function showPaginator(navigator) {
        setTimeout(function() {
            navigator.classList.add('is-visible');
        }, 500);
    }

    // events
    Array.prototype.forEach.call(d.getElementsByClassName('btn-next-slide'), function(btn) {
        if (btn.parentElement.classList.contains('navigator')) {
            btn.addEventListener('click', nextSection, false);
        } else {
            btn.addEventListener('click', nextSlide, false);
        }
    });

    // TODO: Asignar evento al padre y recoger target del hijo
    Array.prototype.forEach.call(d.querySelectorAll('.navigator li'), function(btn) {
        btn.addEventListener('click', _navigateToSection, false);
    });

    Array.prototype.forEach.call(d.querySelectorAll('.menu-header li'), function(btn) {
        btn.addEventListener('click', _navigateToSection, false);
    });

    Array.prototype.forEach.call(d.querySelectorAll('#l-index li'), function(btn) {
        btn.addEventListener('click', _navigateToSection, false);
    });

    Array.prototype.forEach.call(d.getElementsByClassName('btn-prev-slide'), function(btn) {
        btn.addEventListener('click', prevSection, false);
    });

    var navigatorFront = new Navigator('#navigator-front'),
        navigatorBack = new Navigator('#navigator-back');

    window.onload = function() {
        if (!window.location.hash) return;

        var page = window.location.hash.replace("#", "");
        var to = d.querySelector("[data-ref=" + page + "]");
        if (to === null) {

        } else {
            _navigateToSection.call(to);
        }
    }
    

    window.addEventListener('keyup', function(e){
        var slide = d.querySelector(".slide.is-visible");
        if (slide.getAttribute("id") === "l-index" || slide.getAttribute("id") === "l-home") return;

        var nav =  d.querySelector(".navigator.is-visible"), 
            btn;
        if (e.keyCode === 39) { // right
            btn = nav.querySelector(".btn-next-slide");
            btn.click();
        } else if (e.keyCode === 37){ // left
            btn = nav.querySelector(".btn-prev-slide");
            btn.click();
        }
    }, false);

})(app, window, document);
