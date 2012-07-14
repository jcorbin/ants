(function () {
    function updateGeometry() {
        var ctl = document.getElementById("controls");
        var cont = document.getElementById("container");
        ctl.style.left = Math.floor(ctl.parentNode.clientWidth/2 - (ctl.offsetWidth/2))+"px";
    }
    window.addEventListener("resize", updateGeometry, false);
    updateGeometry();

    var grid = document.getElementById('grid');
    grid = new Ants.Grid(
        grid, // canvas
        10,   // rows
        10,   // cols
        Ants.Grid.HueWheelGenerator(0.5, 0.3)
    );

    var ant = new Ants.Ant(
        Math.floor(grid.rows/2), // row
        Math.floor(grid.cols/2), // col
        0,                       // heading (radians)
        "#fff",                  // color
        "RL"                     // turns
    );
    grid.addAnt(ant);

    document.getElementById('reset').addEventListener('click',
        grid.reset.bind(grid), false);

    document.getElementById('slower').addEventListener('click',
        function() {grid.runSlower(2)}, false);

    document.getElementById('faster').addEventListener('click',
        function() {grid.runFaster(2)}, false);

    var iteration = document.getElementById('iteration');
    function updateIteration() {
        iteration.value = grid.iteration.toString();
        iteration.size = iteration.value.length;
    }
    iteration.addEventListener('keypress', function() {
        this.size = Math.max(1, this.value.length);
    }, false);
    iteration.addEventListener('change', function() {
        var i = parseInt(iteration.value);
        if (isNaN(i) || i < grid.iteration)
            updateIteration();
        else
            grid.setIteration(i);
    }, false);
    grid.addListener("reset", updateIteration);
    grid.addListener("step", updateIteration);
    updateIteration();

    grid.addListener("play", function() {
        iteration.readOnly = true;
        runctl.innerText = 'Pause';
    });

    grid.addListener("stop", function() {
        iteration.readOnly = false;
        runctl.innerText = 'Play';
    });

    window.addEventListener("error", grid.stop.bind(grid), false);

    var runctl = document.getElementById('run_ctl');
    runctl.addEventListener('click', function() {
        if (grid.running == null)
            grid.play();
        else
            grid.stop();
    }, false);

    new Ants.RulesEditor(grid, grid.ants[0],
        document.getElementById('rules'));
})();
