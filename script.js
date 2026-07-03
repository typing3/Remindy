// Global tracking selectors for general navigation elements
const pagesTrack = document.getElementById('pagesTrack');
const hudClock = document.getElementById('hudClock');
const currentDayLabel = document.getElementById('currentDayLabel');
const pageNumIndicator = document.getElementById('pageNumIndicator');
const subNavTabs = document.querySelectorAll('.sub-nav-link');

let currentActivePage = 0;
const totalPagesCount = 4;

// 1. DIGITAL CLOCK CORE ENGINE
function runDashboardClock() {
  const current = new Date();
  let hr = current.getHours();
  let min = current.getMinutes();
  let sec = current.getSeconds();
  
  if (hr < 10) hr = '0' + hr;
  if (min < 10) min = '0' + min;
  if (sec < 10) sec = '0' + sec;
  
  hudClock.textContent = hr + ':' + min + ':' + sec;
}
setInterval(runDashboardClock, 1000);
runDashboardClock();

// 2. DEVICE CALENDAR WEEKDAY TRACKER
function syncLocalCalendarDay() {
  const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const current = new Date();
  currentDayLabel.textContent = dayNames[current.getDay()];
}
syncLocalCalendarDay();

// 3. HORIZONTAL WORKSPACE SNAP SLIDER NAVIGATION
function jumpToWorkspacePage(slideIndex) {
  currentActivePage = slideIndex;
  
  // Hardware accelerated translation path shifts screens smoothly sideways
  pagesTrack.style.transform = `translateX(-${slideIndex * 100}vw)`;
  pagesTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  
  // Update indicator loops for the tab menu highlighting links
  subNavTabs.forEach((tab) => {
    if (parseInt(tab.getAttribute('data-tab')) === slideIndex) {
      tab.classList.add('active-tab');
    } else {
      tab.classList.remove('active-tab');
    }
  });
  
  pageNumIndicator.textContent = slideIndex + 1;
}

function stepToNextWorkspacePage() {
  let nextIdx = currentActivePage + 1;
  if (nextIdx >= totalPagesCount) nextIdx = 0;
  jumpToWorkspacePage(nextIdx);
}

// 4. NOTES PAGE CHARACTER LENGTH CONTROLLER 
const noteInputBox = document.getElementById('noteInputBox');
const charCountDisplay = document.getElementById('charCountDisplay');

noteInputBox.addEventListener('input', () => {
  const textLength = noteInputBox.value.length;
  charCountDisplay.textContent = textLength < 10 ? '0' + textLength : textLength;
});

// 5. REMINDERS SYSTEM STORAGE BOARD QUEUE
const reminderQueueContainer = document.getElementById('reminderQueueContainer');
const reminderText = document.getElementById('reminderText');
const reminderTime = document.getElementById('reminderTime');

function createNewReminderItem() {
  const notePayload = reminderText.value.trim();
  const rawTime = reminderTime.value;
  
  if (!notePayload || !rawTime) return;
  
  if (reminderQueueContainer.querySelector('.empty-state-msg')) {
    reminderQueueContainer.innerHTML = '';
  }
  
  const elementRow = document.createElement('div');
  elementRow.className = 'interactive-entry-row';
  elementRow.innerHTML = `<span class="entry-main-text">${notePayload}</span><span class="entry-sub-tag">AT // ${rawTime}</span>`;
  
  // Delete current reminder box when item row is clicked
  elementRow.addEventListener('click', () => {
    elementRow.remove();
    if (reminderQueueContainer.children.length === 0) {
      reminderQueueContainer.innerHTML = '<div class="empty-state-msg">No reminders loaded inside data matrix tracks.</div>';
    }
  });
  
  reminderQueueContainer.appendChild(elementRow);
  reminderText.value = '';
  reminderTime.value = '';
}

// 6. TASKS TO-DO PROGRESS METRIC ARRAYS LOG
const todoTasksContainer = document.getElementById('todoTasksContainer');
const taskTextInput = document.getElementById('taskTextInput');
const taskCompletionRatio = document.getElementById('taskCompletionRatio');

let totalTasksLogged = 0;
let completeTasksCount = 0;

function calculateTaskCompletionRatio() {
  if (totalTasksLogged === 0) {
    taskCompletionRatio.textContent = '0%';
    return;
  }
  const statusPercentage = Math.round((completeTasksCount / totalTasksLogged) * 100);
  taskCompletionRatio.textContent = statusPercentage + '%';
}

function createNewTodoTaskItem() {
  const taskDesc = taskTextInput.value.trim();
  if (!taskDesc) return;
  
  if (todoTasksContainer.querySelector('.empty-state-msg')) {
    todoTasksContainer.innerHTML = '';
  }
  
  totalTasksLogged++;
  
  const elementRow = document.createElement('div');
  elementRow.className = 'interactive-entry-row';
  elementRow.innerHTML = `<span class="entry-main-text">${taskDesc}</span><span class="entry-sub-tag">PENDING</span>`;
  
  elementRow.addEventListener('click', () => {
    if (!elementRow.classList.contains('task-done')) {
      elementRow.classList.add('task-done');
      elementRow.querySelector('.entry-sub-tag').textContent = 'CLEARED';
      elementRow.querySelector('.entry-sub-tag').style.color = '#00ffaa';
      elementRow.style.opacity = '0.3';
      completeTasksCount++;
    } else {
      elementRow.remove();
      totalTasksLogged--;
      completeTasksCount--;
      if (todoTasksContainer.children.length === 0) {
        todoTasksContainer.innerHTML = '<div class="empty-state-msg">No tasks pending inside core registers.</div>';
      }
    }
    calculateTaskCompletionRatio();
  });
  
  todoTasksContainer.appendChild(elementRow);
  taskTextInput.value = '';
  calculateTaskCompletionRatio();
}
todoTasksContainer.innerHTML = '<div class="empty-state-msg">No tasks pending inside core registers.</div>';

// 7. CHRONOLOGICAL AUTOMATED CALENDAR MATRIX GRID
const calendarMonthHeader = document.getElementById('calendarMonthHeader');
const calendarGridCanvas = document.getElementById('calendarGridCanvas');
const selectedDateText = document.getElementById('selectedDateText');

let activeCalendarDate = new Date();

function renderInteractiveCalendarGrid() {
  calendarGridCanvas.innerHTML = '';
  
  const monthNamesList = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const selectYear = activeCalendarDate.getFullYear();
  const selectMonth = activeCalendarDate.getMonth();
  
  calendarMonthHeader.textContent = `${monthNamesList[selectMonth]} ${selectYear}`;
  
  const paddingGapsCount = new Date(selectYear, selectMonth, 1).getDay();
  const totalDaysInCurrentMonth = new Date(selectYear, selectMonth + 1, 0).getDate();
  const realToday = new Date();
  
  // Fill in blank boxes for calendar padding layout alignments
  for (let i = 0; i < paddingGapsCount; i++) {
    const blankBox = document.createElement('span');
    calendarGridCanvas.appendChild(blankBox);
  }
  
  // Loop generate month days array text markers
  for (let dayNum = 1; dayNum <= totalDaysInCurrentMonth; dayNum++) {
    const dayBoxCell = document.createElement('span');
    dayBoxCell.className = 'cal-day-cell';
    dayBoxCell.textContent = dayNum;
    
    // Check constraints to map current day border border highlights
    if (dayNum === realToday.getDate() && selectMonth === realToday.getMonth() && selectYear === realToday.getFullYear()) {
      dayBoxCell.classList.add('current-today-highlight');
    }
    
    dayBoxCell.addEventListener('click', () => {
      document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('active-date-focus'));
      dayBoxCell.classList.add('active-date-focus');
      selectedDateText.textContent = `TARGET SCHEDULE DATA REGISTRY // RECORDED SELECTION: ${dayNum} ${monthNamesList[selectMonth]}, ${selectYear}`;
    });
    
    calendarGridCanvas.appendChild(dayBoxCell);
  }
}

function shiftCalendarMonth(directionValue) {
  activeCalendarDate.setMonth(activeCalendarDate.getMonth() + directionValue);
  renderInteractiveCalendarGrid();
}
renderInteractiveCalendarGrid();
