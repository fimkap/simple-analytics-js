function sendAnalytics(data, mode) {
    var client_id = getCookie("saCookie");
    data.clientid = `${client_id}`;
    $.post('http://localhost:5000/analytics?mode='+mode, data, function() {
    });
}
function createUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
}
function createCookie(daysToExpire)
{
    var date = new Date();
    date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
    document.cookie = "saCookie" + "=" + createUUID() + "; expires=" + date.toGMTString();
}
function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
        let [k,v] = el.split('=');
        cookie[k.trim()] = v;
    })
    return cookie[name];
}
if (getCookie("saCookie") == undefined) {
    createCookie(5);
}
var query_params = window.location.search;
// The smallest meaningful length
if (query_params.length > 3) {
    console.log(query_params.substring(1));
    var data={
        query: query_params.substring(1)
    }
    sendAnalytics(data, "query");
}
console.log(getCookie("saCookie"));
console.log(`${location.pathname}`);
var data={
    path: `${location.pathname}`
}
sendAnalytics(data, "pageview");

// Store mouse moves here
var moves = [];
document.addEventListener('mousemove', function (event) {
    //console.log("mousemove");
    moves.push(event.pageX+','+event.pageY);
}, false);

function sendMoves() {
    if (moves.length > 0) {
        var movesToSend = moves.join(';');
        console.log(movesToSend);
        moves = []; // reset
        var data={
            moves: movesToSend
        }
        sendAnalytics(data, "moves");
    }
}
setInterval(sendMoves, 5000);

document.addEventListener('click', function (event) {
    console.log(event.target);
    var data={
        target: `${event.target}`
    }
    sendAnalytics(data, "click");
}, false);

document.addEventListener('change', function (event) {
    console.log("on change: " + event.target.value);
    var data={
        text: `${event.target.value}`
    }
    sendAnalytics(data, "text");
}, false);
