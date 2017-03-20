function Navigator(query) {
    // Private
    var _el = document.querySelector(query),
        _bNext = _el.getElementsByClassName('btn-next-slide')[0],
        _bPrev = _el.getElementsByClassName('btn-prev-slide')[0],
        _active = _el.querySelector('li.is-active');

    function isLastPage() {
        return _active.nextElementSibling === null;
    }

    function isFirstPage() {
        return _active.previousElementSibling === null;
    }

    /**
     *
     */
    function _slideShow(event) {
        if (this.classList.contains('is-active')) return;
        var span = event.target.children[0];
        span.style.display = 'block';
        var width = span.offsetWidth;
        span.style.width = 0;
        setTimeout(function() {
            span.style.width = width + 'px';
        }, 50);
    }

    /**
     *
     */
    function _slideHide(event) {
        // if (this.classList.contains('is-active')) return;
        event.target.children[0].removeAttribute('style');
    }

    /**
     * Events
     */
    function _events() {
        Array.prototype.forEach.call(_el.getElementsByTagName('li'), function(item) {
            item.addEventListener('mouseenter', _slideShow, false);
            item.addEventListener('mouseleave', _slideHide, false);
        });
    }
    /**
     * Active the previous page indicator
     */
    this.prev = function() {
        _bNext.classList.remove('is-up');

        _active.classList.remove('is-active');
        _active.previousElementSibling.classList.add('is-active');

        _active = _active.previousElementSibling;

        isFirstPage() ? _bPrev.classList.add('is-up') : _bPrev.classList.remove('is-up');

        return _active.getAttribute('data-ref');
    }

    /**
     * Active the next page indicator
     */
    this.next = function() {
        // El boton de atras apunta arriba
        _bPrev.classList.remove('is-up');

        _active.classList.remove('is-active');
        _active.nextElementSibling.classList.add('is-active');

        _active = _active.nextElementSibling;

        isLastPage() ? _bNext.classList.add('is-up') : _bNext.classList.remove('is-up');

        window.location.href = window.location.pathname + "#" + _active.getAttribute("data-ref");
        return _active.getAttribute('data-ref');
    }

    /**
     * Active the next page indicator
     */
    this.to = function() {
        // El boton de atras apunta arriba
        _bPrev.classList.remove('is-up');

        _active.classList.remove('is-active');

        _active = _el.querySelector('[data-ref="' + this.getAttribute('data-ref') + '"]');
        _active.classList.add('is-active');

        isLastPage() ? _bNext.classList.add('is-up') : _bNext.classList.remove('is-up');
        isFirstPage() ? _bPrev.classList.add('is-up') : _bPrev.classList.remove('is-up');

        window.location.href = window.location.pathname + "#" + _active.getAttribute("data-ref");
        return _active.getAttribute('data-ref');
    }

    this.active = function() {
        return _active.getAttribute('data-ref');
    }

    this.items = function() {
        return Array.prototype.slice.call(_el.querySelectorAll('li'));
    }

    this.reset = function() {
        _active.classList.remove('is-active');
        _active = _el.querySelector('li:first-child');
        _active.classList.add('is-active');
    }

    _events();
}
