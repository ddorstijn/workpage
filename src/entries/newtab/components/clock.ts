export function initClock() {
  const clock = document.getElementById('clock')! as HTMLDivElement;
  const time = clock.querySelector('.clock__time')! as HTMLTimeElement;
  const date = clock.querySelector('.clock__date')! as HTMLTimeElement;

  const update = () => {
    let now = new Date();
    let timeStr = now.toLocaleTimeString('en-gb', { hour: '2-digit', minute: '2-digit' })
    time.dateTime = timeStr;
    time.innerText = timeStr;

    let dateStr = now.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    date.dateTime = dateStr;
    date.innerText = dateStr;
  }

  update();
  setInterval(update, 5000);
}