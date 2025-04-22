document.addEventListener("DOMContentLoaded", async () => {
  let firstLink;
  const _NAV_LIST = document.querySelector('.nav');
  const _NAV = document.querySelector('nav');
  const ATTR = 'aria-current';

  async function createNavMenu(jsonFilePath, menuContainerId) {
    try {
      const response = await fetch(jsonFilePath);
      const data = await response.json();
      const menuContainer = document.getElementById(menuContainerId);

      data.cities.forEach((city, index) => {
        const listElem = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = city.label;
        link.id = city.section;
        if (index == 0) {
          link.setAttribute(ATTR, true);
          firstLink = link;
        }
        link.setAttribute("href", "#");
        link.setAttribute("data-timezone", city.timezone);
        listElem.appendChild(link);
        menuContainer.appendChild(listElem);
      });
      _NAV.style.setProperty('--items', data.cities.length);
    }
    catch (e) {
      console.error(e);
    }
  }

  await createNavMenu("navigation.json", "nav");

  const bar = document.createElement("div");
  bar.classList.add("bar");
  _NAV.appendChild(bar);
  let interval;

  // resize bar for a selected element
  function resize(target) {
    const { offsetLeft: left, offsetWidth: width } = target;
    bar.style.left = `${left}px`;
    bar.style.width = `${width}px`;
  }

  // Set date & time to display
  function setDateTime(timezone, date, time) {

    const curr = new Date(new Date().toLocaleString('en', { timeZone: timezone }));

    const h = `${curr.getHours()}`.padStart(2, "0");
    const m = `${curr.getMinutes()}`.padStart(2, "0");
    const s = `${curr.getSeconds()}`.padStart(2, "0");
    time.textContent = `${h}:${m}:${s}`;
    
    const dd = `${curr.getDate()}`.padStart(2, "0");
    const mm = `${curr.getMonth()}`.padStart(2, "0");
    const yyyy = `${curr.getFullYear()}`.padStart(4, "0");
    date.textContent = `${dd}/${mm}/${yyyy}`;
  }

  // Use new timezone to start time interval
  function startTimer(timezone) {
    const displayDiv = document.getElementById("time");
    const dateDisplayDiv = document.getElementById("date");
    setDateTime(timezone, dateDisplayDiv,displayDiv);
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      setDateTime(timezone, dateDisplayDiv,displayDiv);
    }, 1000);
  }

  function updateTime(target) {
    const timeZone = target.dataset.timezone;
    startTimer(timeZone);
  }

  // add event listener to update & resize bar, also update time
  _NAV_LIST.addEventListener('click', e => {
    const _TG = e.target;

    if (_TG.href) {
      _NAV_LIST.querySelector(`[${ATTR}]`).removeAttribute(ATTR);
      _TG.setAttribute(ATTR, true);
      resize(_TG);
      updateTime(_TG);
    }
  }, false);

  // Initialize position
  const current = _NAV.querySelector("[aria-current]") || firstLink;
  resize(current);
  updateTime(current);
});