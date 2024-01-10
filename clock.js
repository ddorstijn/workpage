export function initClock() {
  var time = document.querySelector('.clock_time');
  var date = document.querySelector('.clock_date');
  
  update();
  setInterval(update, 5000);
  
  function update() {
    let now = new Date();
    
    let timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    time.dateTime = timeStr;
    time.innerText = timeStr;
  
    let dateStr = now.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    date.dateTime = now;
    date.innerText = dateStr;
  }
}