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
    }

    Expander.prototype = new EventDispatcher();

    Expander.prototype.refresh = function() {
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
        this.refresh();
        this.element.style.visibility = "visible";

        var view = this.element.ownerDocument.defaultView;
        if (! this._onviewresize) {
            this._onviewresize = this.refresh.bind(this);
            view.addEventListener("resize", this._onviewresize);
        }
    };

    Expander.prototype.collapse = function() {
        this.element.style.visibility = "hidden";

        var view = this.element.ownerDocument.defaultView;
        if (this._onviewresize) {
            view.removeEventListener("resize", this._onviewresize);
            delete this._onviewresize;
        }
    };

    return Expander;
})();
