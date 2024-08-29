document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.querySelector('#calendar');
    const calendarDates = document.querySelector('#calendarDates');
    const currentMonthElement = document.querySelector('#currentMonth');
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    const todayBtn = document.querySelector('#today-date');

    const newEvent = document.querySelector('#new-event');
    const newEndDate = document.querySelector('#new-date');
    const newMemo = document.querySelector('#new-memo');
    const dateInfo = document.querySelector('#date-info');
    const addButton = document.querySelector('#add-button');
    const closeButton = document.querySelector('#close-button');

    let editMode = false;
    let currentTask = null;
 
    const today = new Date()
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();

    loadTasks = () => {
        const task = JSON.parse(localStorage.getItem('tasks'));
        const days = new Date(currentYear, currentMonth + 1, 0).getDate();

        for(var i = 1; i <= days; i++){
            if(task){
                task.forEach(storage => {
                    if(`${currentYear}-${currentMonth + 1}-${i}` === storage.date){
                        createTaskElement(storage.date, storage.title, storage.enddate, storage.memo, storage.id)
                    }
                })
            }
        }
        
    }

    saveTasks = () => {
        let existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
        calendarDates.querySelectorAll('.date').forEach(elem => {
            elem.querySelectorAll('.taskElem').forEach(task => {

                const taskData = {
                    id : task.dataset.id,
                    date: elem.dataset.fullDate,
                    title: task.textContent,
                    enddate: task.dataset.endDate,
                    memo: task.dataset.memo,
                };
    
                // 기존 tasks에서 동일한 ID를 가진 항목을 찾아 업데이트합니다.
                const taskIndex = existingTasks.findIndex(list =>
                    list.id === taskData.id && list.date === taskData.date
                );
    
                if (taskIndex !== -1) {
                    // 동일한 task가 있으면 업데이트합니다.
                    existingTasks[taskIndex] = taskData;
                } else {
                    // 동일한 task가 없으면 새로 추가합니다.
                    existingTasks.push(taskData);
                }
            });
        });
    
        localStorage.setItem('tasks', JSON.stringify(existingTasks));
    };
    

    createTaskElement = (date, title, endDate, memo, id) => {
        const selectElem = document.querySelector(`[data-full-date="${calendar.dataset.date}"]`);
        const scsElem = document.querySelector(`[data-full-date="${date}"]`);
        const taskElem = document.createElement('div');

        taskElem.className = 'taskElem';
        taskElem.textContent = title; //newEvent.value
        taskElem.dataset.endDate = endDate; // newEndDate.value
        taskElem.dataset.memo =  memo;// newMemo.value;
        
        if(!id){
            id = `Task_${Date.now()}`
        }
        taskElem.dataset.id = id;
        
        if(selectElem === null){
            scsElem.appendChild(taskElem);
        }else{
            selectElem.appendChild(taskElem);
            saveTasks();
        }

        taskElem.addEventListener('click', (e) => {
            newEvent.value = e.target.textContent;
            newEndDate.value = e.target.dataset.endDate.trim();
            newMemo.value = e.target.dataset.memo;

            newEvent.focus();
            editMode = true;
            currentTask = e.target;
        })
    }

    renderCalendar = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay();

        currentMonthElement.textContent = `${currentYear}년 ${currentMonth + 1}월`;
        calendarDates.innerHTML = '';

        for(var i = 0; i < startDayOfWeek; i++){
            const emptyDate = document.createElement('div');
            emptyDate.classList.add('date', 'empty');

            calendarDates.appendChild(emptyDate);
        }


        for(var i = 1; i <= daysInMonth; i++){
            const dateElement = document.createElement('div');
            const dayElement = document.createElement('div');
            dateElement.className = 'date';
            dayElement.className = 'day';
            dateElement.dataset.fullDate = `${currentYear}-${currentMonth + 1}-${i}`
            dayElement.innerHTML = `<span>${i}</span> 일`;

            dateElement.appendChild(dayElement);

            if(today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === i){
                dayElement.querySelector('span').classList.add('today')
            }

            calendarDates.appendChild(dateElement);
        }

        calendarDates.querySelectorAll('.date').forEach(elem => {
            elem.addEventListener('click', () => {
                calendar.classList.add('on');
                calendar.dataset.date = `${currentYear}-${currentMonth + 1}-${elem.querySelector('span').textContent}`;
                dateInfo.textContent = calendar.dataset.date;

            })
        })
    }

    renderCalendar();

    todayBtn.addEventListener('click', () => {
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        renderCalendar();
        loadTasks();
        saveTasks();
    })

    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if(currentMonth < 0){
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
        loadTasks();
        saveTasks();
    })

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if(currentMonth > 11){
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
        loadTasks();
        saveTasks();
    })

    addButton.addEventListener('click', () => {
        console.log(newEvent.value.trim())
        
        if(newEvent.value.trim() === '') return alert('내용을 입력하세요.');
        
        if(editMode && currentTask){
            currentTask.textContent = newEvent.value.trim();
            currentTask.dataset.endDate = newEndDate.value;
            currentTask.dataset.memo = newMemo.value.trim();
            editMode = false;
            currentTask = null;
        }else{
            createTaskElement(calendar.dataset.date, newEvent.value, newEndDate.value, newMemo.value);
        }
        
        calendar.classList.remove('on');
        calendar.dataset.date = '';
        newEvent.value = '';
        saveTasks();
    })

    closeButton.addEventListener('click', () => {
        calendar.classList.remove('on');
        calendar.dataset.date = '';
        
    })
    
    loadTasks();
})