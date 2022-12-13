import Clock from "./js/clock"

window.addEventListener('load', function(e)
{
    document.querySelectorAll('canvas.clock').forEach(function(i)
    {
        new Clock(i)
    })
})