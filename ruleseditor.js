if (typeof(Ants) == 'undefined')
    Ants = {};

Ants.RulesEditor = (function() {
    function Editor(grid, ant, input) {
        this.grid = grid;
        this.ant = ant;
        this.input = input;
        this.input.addEventListener("keypress", function() {
            this.size = Math.max(1, this.value.length);
        });
        this.input.addEventListener("change", function() {
            try {
                this.ant.setTurnString(this.input.value);
            } catch(err) {
                this.input.value = this.ant.getTurnString();
            }
            this.refresh();
        }.bind(this));
        var updateInput = function() {
            var s = this.ant.getTurnString();
            this.input.value = s;
            this.input.size = s.length;
        }.bind(this);
        ant.addListener("turnsChanged", updateInput);
        updateInput();

        var doc = input.ownerDocument;
        this.table = doc.createElement('table');
        this.table.className = "rules";
        this.table.style.display = "none";
        this.table.style.position = "absolute";

        var row = this.table.createTHead().insertRow();
        row.appendChild(doc.createElement("th"))
            .appendChild(doc.createTextNode("On color"));
        row.appendChild(doc.createElement("th"))
            .appendChild(doc.createTextNode("turn."));
        row.appendChild(doc.createElement("th"))
            .appendChild(doc.createTextNode(" "));

        row = this.table.createTFoot().insertRow();
        var cell = row.insertCell(-1);
        cell.appendChild(doc.createTextNode(" "));
        cell.colSpan = 2;
        var el = row.insertCell(-1).appendChild(doc.createElement("button"));
        el.appendChild(doc.createTextNode("+"));
        el.addEventListener("click", this.onAddRuleClicked.bind(this));

        this.table.appendChild(doc.createElement("tbody"));

        doc.body.appendChild(this.table);

        Expander.apply(this, [this.input, this.table]);

        this.input.addEventListener("focus", this.expand.bind(this));
    }

    Editor.prototype = new Expander();

    Editor.prototype.addRuleRow = function(color, rule) {
        var body = this.table.tBodies[0];
        var doc = body.ownerDocument;
        var row = body.insertRow(-1);

        var cell = row.insertCell(-1);
        cell.className = "swatch";
        cell.appendChild(doc.createTextNode(" "));
        cell.style.backgroundColor = color;

        cell = row.insertCell(-1);
        var select = cell.appendChild(doc.createElement("select"));
        var option = select.appendChild(doc.createElement("option"));
        option.appendChild(doc.createTextNode("Left"));
        option = select.appendChild(doc.createElement("option"));
        option.appendChild(doc.createTextNode("Right"));
        select.value = rule;
        select.addEventListener('change', this.update.bind(this));

        cell = row.insertCell(-1);
        var button = cell.appendChild(doc.createElement("button"));
        button.className = "rule_del";
        button.appendChild(doc.createTextNode("-"));
        button.addEventListener("click", this.onDelRuleClicked.bind(this));
    };

    Editor.prototype.update = function() {
        this.grid.stop();
        var body = this.table.tBodies[0];
        var turns = [];
        for (var i=0; i<body.rows.length; i++) {
            var row = body.rows[i];
            var select = row.getElementsByTagName("select")[0];
            turns.push(Ants.Ant.Name2Turn(select.value));
        }
        this.ant.turns = turns;
        this.ant.dispatch("turnsChanged");
        this.grid.reset();
    };

    Editor.prototype.refresh = function() {
        Expander.prototype.refresh.apply(this, arguments);

        var body = this.table.tBodies[0];
        while (body.childNodes.length)
            body.removeChild(body.firstChild);
        for (var i=0; i<this.ant.turns.length; i++)
            this.addRuleRow(this.grid.colors[i],
                Ants.Ant.Turn2Name(this.ant.turns[i]));
        var disabled = this.grid.colors.length <= 2;
        var buttons = this.table.getElementsByClassName("rule_del");
        for (var i=0; i<buttons.length; i++)
            buttons[i].disabled = disabled;
    };

    Editor.prototype.onDelRuleClicked = function(e) {
        if (this.grid.colors.length <= 2)
            return;
        var row = e.target;
        while (row.tagName.toLowerCase() != "tr")
            row = row.parentNode;
        var rows = row.parentNode.rows;
        for (var i=0; i<rows.length; i++)
            if (rows[i] === row)
                break;
        if (i >= rows.length)
            return;
        this.grid.stop();
        this.grid.removeColor(i);
        this.refresh();
    };

    Editor.prototype.onAddRuleClicked = function() {
        this.grid.stop();
        this.grid.addColor();
        this.refresh();
    };

    return Editor;
})();
