var Expander = (function() {
    function getOffset(el) {
        var x = y = 0;
        while (el) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
        }
        return [x, y];
    }

    function viewBox(win) {
        return [
            win.pageXOffset,
            win.pageYOffset,
            win.innerWidth + win.pageXOffset,
            win.innerHeight + win.pageYOffset
        ];
    }

    function elementBox(el) {
        var off = getOffset(el);
        return [
            off[0],
            off[1],
            off[0] + el.offsetWidth,
            off[1] + el.offsetHeight
        ];
    }

    function moveTo(el, x, y) {
        el.style.left = x.toString() + "px";
        el.style.top = y.toString() + "px";
    }

    function moveToClamped(el, x, y, box) {
        x = Math.max(box[0], Math.min(box[2] - el.offsetWidth, x));
        y = Math.max(box[1], Math.min(box[3] - el.offsetHeight, y));
        el.style.left = x.toString() + "px";
        el.style.top = y.toString() + "px";
    }

    function Expander(anchor, element) {
        if (anchor)
            this.anchor = anchor;
        if (element) {
            this.element = element;
            this.element.style.position = "absolute";
            this.element.style.display = "";
            this.element.style.visibility = "hidden";
            this.element.style.zIndex = 100;
            var doc = this.element.ownerDocument;
            if (this.element.parentNode != doc.body) {
                this.element.parentNode.removeChild(this.element);
                doc.body.appendChild(this.element);
            }
        }
        this.collapseDelay = null;
    }

    Expander.prototype = new EventDispatcher();

    Expander.prototype.updateGeometry = function() {
        var anch = elementBox(this.anchor);
        var view = viewBox(this.element.ownerDocument.defaultView);
        if (this.element.offsetHeight <= view[3] - anch[3])
            moveToClamped(this.element, anch[0], anch[3], view);
        else if (this.element.offsetHeight <= anch[1] - view[1])
            moveToClamped(this.element, anch[0], anch[1] - this.element.offsetHeight, view);
        else if (this.element.offsetWidth <= view[2] - anch[2])
            moveToClamped(this.element, anch[2], anch[1], view);
        else if (this.element.offsetWidth <= anch[0] - view[0])
            moveToClamped(this.element, anch[0] - this.element.offsetWidth, anch[1], view);
        else
            moveToClamped(this.element, anch[0], anch[3], view);
    };

    Expander.prototype.expand = function() {
        if (this.collapseDelay) {
            clearTimeout(this.collapseDelay);
            delete this.collapseDelay;
        }
        this.updateGeometry();
        this.element.style.visibility = "visible";
        if (! this._onviewresize) {
            this._onviewresize = this.updateGeometry.bind(this);
            this.element.ownerDocument.defaultView.addEventListener("resize", this._onviewresize);
        }
    };

    Expander.prototype.delayCollapse = function(delay) {
        delay = delay || 100;
        if (this.collapseDelay)
            clearTimeout(this.collapseDelay);
        this.collapseDelay = setTimeout(this.collapse.bind(this), delay);
    };

    Expander.prototype.collapse = function() {
        if (this.collapseDelay) {
            clearTimeout(this.collapseDelay);
            delete this.collapseDelay;
        }
        this.element.style.visibility = "hidden";
        if (this._onviewresize) {
            this.element.ownerDocument.defaultView.removeEventListener("resize", this._onviewresize);
            delete this._onviewresize;
        }
    };

    return Expander;
})();