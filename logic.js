// init vars
//---------------------------------------------------------------------
let sliderParams = {
        start   : 2,
        connect : 'lower',
        snap    : true,
        tooltips: true,
        range   : slideRange(),
        pips    : {
            mode    : 'values',
            values  : [0, 5, 10, 15, 20],
            density : 5
        },
        format: {
            to: function (value) {
                return parseInt(value, 10);
            },
            from: function (value) {
                return value;
            }
        }
    },
    tick      = new Audio('sounds/tick.mp3'),
    ding      = new Audio('sounds/ding.mp3'),
    wrkTime   = sliderParams.start * 60,
    brkTime   = sliderParams.start * 60,
    wrkSlider = document.getElementById('slider-work'),
    brkSlider = document.getElementById('slider-break'),
    playBtn   = document.getElementById('play'),
    resetBtn  = document.getElementById('reset'),
    status    = document.getElementById('status'),
    clock     = document.getElementById('clock'),
    progress  = document.getElementById('progress-bar'),
    timer     = wrkTime,
    working   = true,
    motion    = false,
    wrkMsg    = "Get to work already!",
    brkMsg    = "Take a break, you bum.",
    countdown = 0;
//=====================================================================


// generate object with range values for sliders
//---------------------------------------------------------------------
function slideRange() {
    let marks = {};
    [marks.min, marks.max] = [0, 20];
    
    for (let i = 0; i <= 100; i += 5 ) {
        marks[i + '%'] = i / 5;
    }
    return marks;
}//====================================================================


// convert seconds to MM:SS format
//---------------------------------------------------------------------
function secs2MMSS(n) {
	let m = Math.floor(n % (60 * 60) / 60),
        s = Math.floor(n % (60 * 60) % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}//====================================================================


// countdown & update display
//---------------------------------------------------------------------
function updateClock() {
    timer--;
    tick.play();
    clock.textContent  = secs2MMSS(timer);
    progress.style.top = updateProgress();
    
    if (timer <= 0) {
        ding.play();
        timer = working ? brkTime : wrkTime;
        working = !working;
        status.textContent = working ? wrkMsg : brkMsg;
    }
}//====================================================================


// return percentage of session complete
//---------------------------------------------------------------------
function updateProgress() {
    return (
        working
            ? 0 + (timer / wrkTime)
            : 1 - (timer / brkTime)
    ) * 100 + '%';
}//====================================================================


// handle timer 
//---------------------------------------------------------------------
function playPause() {
    if (wrkTime === 0) {
        window.alert("Work interval cannot start at 00:00");
    }
    
    timer = motion ? timer : wrkTime;
    status.textContent = working ? wrkMsg : brkMsg;
    
    if (!countdown && wrkTime > 0) {
        wrkSlider.setAttribute('disabled', true);
        brkSlider.setAttribute('disabled', true);
        countdown = window.setInterval(updateClock, 1000);
        motion = true;
    } else {
        window.clearInterval(countdown);
        countdown = 0;
    }
}//====================================================================


// reset all
//---------------------------------------------------------------------
function reset() {
    wrkSlider.removeAttribute('disabled');
    brkSlider.removeAttribute('disabled');
    window.clearInterval(countdown);
    clock.textContent  = secs2MMSS(wrkTime);
    status.textContent = "Ready!";
    progress.style.top = '100%';
    timer     = wrkTime;
    working   = true;
    motion    = false;
    countdown = 0;
}//====================================================================


//instantiate sliders
noUiSlider.create(wrkSlider, sliderParams);
noUiSlider.create(brkSlider, sliderParams);


// event listeners
//---------------------------------------------------------------------
wrkSlider.noUiSlider.on('update', function (time) {
    wrkTime = time * 60;
    clock.textContent = secs2MMSS(wrkTime);
});

brkSlider.noUiSlider.on('update', function (time) {
    brkTime = time * 60;
});

playBtn.addEventListener('click', playPause);
                           
resetBtn.addEventListener('click', reset);
//=====================================================================