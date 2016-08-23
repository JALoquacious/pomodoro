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
    fileBase  = 'https://dl.dropboxusercontent.com/s/',
    tick      = new Audio(fileBase + 'd4x41ou0q2jwmjg/tick.mp3'),
    ding      = new Audio(fileBase + 'hjnhovbeq9r09lv/ding.mp3'),
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
    // populate object with percentage values, min->max, every 5 steps
    for (let i = 0; i <= 100; i += 5 ) {
        marks[i + '%'] = i / 5;
    }
    return marks;
}//====================================================================


// convert seconds to MM:SS format
//---------------------------------------------------------------------
function secs2MMSS(n) {
	let m = Math.floor(n % (60 * 60) / 60), // minutes
        s = Math.floor(n % (60 * 60) % 60); // seconds
    // if minute or second count less than 10, prepend zero
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}//====================================================================


// countdown & update display
//---------------------------------------------------------------------
function updateClock() { // occurs at every interval
    timer--;
    tick.play();
    clock.textContent  = secs2MMSS(timer); // seconds -> clock format
    progress.style.top = updateProgress(); // move div bar from top
    
    if (timer <= 0) { // countdown finish
        ding.play();
        timer = working ? brkTime : wrkTime; // alternate session timer
        working = !working; // toggle work/break flag
        status.textContent = working ? wrkMsg : brkMsg;
    }
}//====================================================================


// return percentage of session complete
//---------------------------------------------------------------------
function updateProgress() {
    return (
        working // if work:
            ? 0 + (timer / wrkTime) // divide to get %
            : 1 - (timer / brkTime) // inverse % of above
    ) * 100 + '%';
}//====================================================================


// handle timer 
//---------------------------------------------------------------------
function playPause() {
    timer = motion ? timer : wrkTime; // enable continue after pause
    status.textContent = working ? wrkMsg : brkMsg; // appropriate msg
    
    if (wrkTime === 0) {
        window.alert("Work interval cannot start at 00:00");
        reset();
    } else if (!countdown && wrkTime > 0) { // before clock is started
        wrkSlider.setAttribute('disabled', true);
        brkSlider.setAttribute('disabled', true);
        countdown = window.setInterval(updateClock, 1000);
        motion = true; // flag for play/pause button
    } else { // if clock actively counting
        window.clearInterval(countdown);
        countdown = 0; // remove count so 'if' statement reads false
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


// instantiate sliders
noUiSlider.create(wrkSlider, sliderParams);
noUiSlider.create(brkSlider, sliderParams);


// event listeners
//---------------------------------------------------------------------
wrkSlider.noUiSlider.on('update', function (time) {
    wrkTime = time * 60;
    clock.textContent = secs2MMSS(wrkTime); // always start at 'work'
});

brkSlider.noUiSlider.on('update', function (time) {
    brkTime = time * 60;
});

playBtn.addEventListener('click', playPause);
                           
resetBtn.addEventListener('click', reset);
//=====================================================================