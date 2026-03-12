<!-- javascript: logic (separated in script.js style) -->
    (function() {
        // --- DATA STORES (initial samples) ---
        let tasks = [
            { id: 't1', text: 'Design team meeting', category: 'work', completed: false },
            { id: 't2', text: 'Buy groceries', category: 'personal', completed: false },
            { id: 't3', text: 'Review flashcards', category: 'study', completed: true },
        ];

        let goals = [
            { id: 'g1', name: 'Read 12 books', term: 'long', current: 4, target: 12 },
            { id: 'g2', name: 'Run 50km', term: 'short', current: 22, target: 50 },
        ];

        let challenges = [
            { id: 'c1', name: '30-day yoga', totalDays: 30, progress: 12 },
        ];

        let expenses = [
            { id: 'e1', desc: 'Freelance payment', amount: 450, type: 'income' },
            { id: 'e2', desc: 'Groceries', amount: 87.5, type: 'expense' },
            { id: 'e3', desc: 'Gym membership', amount: 60, type: 'expense' },
        ];

        // --- helper functions ---
        function generateId() { return Date.now() + '-' + Math.random().toString(36).substr(2, 9); }

        // --- RENDER ALL UI ---
        function renderEverything() {
            renderTasks();
            renderGoals();
            renderChallenges();
            renderExpenses();
            updateDashboardCards();   // updates summary cards + snapshot
        }

        // 1. TASKS
        function renderTasks() {
            const container = document.getElementById('taskListContainer');
            if (!container) return;
            let html = '';
            tasks.forEach(task => {
                const checked = task.completed ? 'checked' : '';
                html += `<div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <div class="task-left">
                        <input type="checkbox" class="task-check" ${checked} data-id="${task.id}">
                        <span class="task-text">${task.text}</span>
                        <span class="category-tag">${task.category}</span>
                    </div>
                    <div class="task-actions">
                        <button class="edit-task" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-task" data-id="${task.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
            });
            container.innerHTML = html || '<div class="task-item" style="justify-content:center">✨ no tasks — add one</div>';
            document.getElementById('taskCounter').innerText = tasks.length + ' total';

            // attach check listener
            document.querySelectorAll('.task-check').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const id = e.target.dataset.id;
                    const task = tasks.find(t => t.id === id);
                    if (task) { task.completed = e.target.checked; renderEverything(); }
                });
            });
            // delete
            document.querySelectorAll('.delete-task').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    tasks = tasks.filter(t => t.id !== id);
                    renderEverything();
                });
            });
            // edit (simple prompt)
            document.querySelectorAll('.edit-task').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const task = tasks.find(t => t.id === id);
                    if (task) {
                        const newText = prompt('Edit task description', task.text);
                        if (newText && newText.trim()) { task.text = newText.trim(); renderEverything(); }
                    }
                });
            });
        }

        // 2. GOALS
        function renderGoals() {
            const container = document.getElementById('goalList');
            let html = '';
            goals.forEach(g => {
                const progress = Math.round((g.current / g.target) * 100) || 0;
                html += `<div class="goal-item" data-id="${g.id}">
                    <div style="flex:1">
                        <div style="display:flex; justify-content:space-between;">
                            <span><strong>${g.name}</strong> (${g.term})</span>
                            <span>${g.current}/${g.target}</span>
                        </div>
                        <div class="progress-bar-bg"><div class="progress-fill" style="width:${progress}%"></div></div>
                        <div class="goal-meta">${progress}% complete · <button class="btn-outline" style="padding:2px 8px; font-size:0.7rem;" data-id="${g.id}" data-delta="1">+1</button> <button data-delta="-1" data-id="${g.id}" style="padding:2px 8px;">−1</button> <button class="delete-goal" data-id="${g.id}" style="border:none; background:none; color:#999;"><i class="fas fa-times"></i></button></div>
                    </div>
                </div>`;
            });
            container.innerHTML = html || '<div class="text-small">➕ add a goal to track progress</div>';

            document.querySelectorAll('[data-delta]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const delta = parseInt(e.currentTarget.dataset.delta);
                    const goal = goals.find(g => g.id === id);
                    if (goal) {
                        goal.current = Math.min(goal.target, Math.max(0, goal.current + delta));
                        renderEverything();
                    }
                });
            });
            document.querySelectorAll('.delete-goal').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    goals = goals.filter(g => g.id !== id);
                    renderEverything();
                });
            });
        }

        // 3. CHALLENGES
        function renderChallenges() {
            const container = document.getElementById('challengeList');
            let html = '';
            challenges.forEach(c => {
                const prog = Math.round((c.progress / c.totalDays) * 100) || 0;
                html += `<div class="challenge-item">
                    <div style="flex:1">
                        <div style="display:flex; justify-content:space-between;">
                            <span><i class="fas fa-bolt"></i> ${c.name}</span>
                            <span>${c.progress}/${c.totalDays} days</span>
                        </div>
                        <div class="progress-bar-bg"><div class="progress-fill" style="width:${prog}%"></div></div>
                        <div class="challenge-meta"><button class="btn-outline" style="padding:2px 10px;" data-id="${c.id}" data-progress="1">➕ day</button> <button class="delete-challenge" data-id="${c.id}" style="border:none;background:none;"><i class="fas fa-trash-alt"></i></button></div>
                    </div>
                </div>`;
            });
            container.innerHTML = html || '<div class="text-small">⚡ start a challenge (e.g., 30-day)</div>';
            document.querySelectorAll('[data-progress="1"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const chal = challenges.find(c => c.id === id);
                    if (chal && chal.progress < chal.totalDays) { chal.progress++; renderEverything(); }
                });
            });
            document.querySelectorAll('.delete-challenge').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    challenges = challenges.filter(c => c.id !== id);
                    renderEverything();
                });
            });
        }

        // 4. EXPENSES
        function renderExpenses() {
            const container = document.getElementById('expenseList');
            let rows = '';
            expenses.slice(-5).forEach(e => {
                const sign = e.type === 'income' ? '+' : '-';
                const cls = e.type === 'income' ? 'expense-income' : 'expense-expense';
                rows += `<div class="expense-row"><span>${e.desc}</span> <span class="${cls}">${sign}$${e.amount.toFixed(2)}</span> <button class="delete-expense" data-id="${e.id}" style="border:none; background:none; color:#ccc;"><i class="fas fa-times"></i></button></div>`;
            });
            container.innerHTML = rows || '<div class="expense-row">no entries</div>';

            // totals
            const totalInc = expenses.filter(e => e.type==='income').reduce((acc, e) => acc + e.amount, 0);
            const totalExp = expenses.filter(e => e.type==='expense').reduce((acc, e) => acc + e.amount, 0);
            const balance = totalInc - totalExp;
            document.getElementById('totalIncome').innerText = '$' + totalInc.toFixed(2);
            document.getElementById('totalExpenses').innerText = '$' + totalExp.toFixed(2);
            document.getElementById('balanceStrong').innerText = '$' + balance.toFixed(2);
            document.getElementById('balanceAmount').innerText = '$' + balance.toFixed(2);
            document.getElementById('balanceSmall').innerText = '$' + balance.toFixed(2);
            const monthSpentEl = document.getElementById('monthSpent');
            monthSpentEl.innerText = 'spent $' + totalExp.toFixed(2);

            document.querySelectorAll('.delete-expense').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    expenses = expenses.filter(ex => ex.id !== id);
                    renderEverything();
                });
            });
        }

        // DASHBOARD summary cards + quickview
        function updateDashboardCards() {
            // today's tasks (not completed, but we consider all due? we simply show count of incomplete)
            const todayTasks = tasks.filter(t => !t.completed).length;
            document.getElementById('todayTasksCount').innerText = todayTasks;
            document.getElementById('todayTasksDetail').innerText = todayTasks + ' pending';
            document.getElementById('dashTodayTasks').innerText = todayTasks;

            const activeGoals = goals.length;
            document.getElementById('activeGoalsCount').innerText = activeGoals;
            const avgProgress = goals.length ? Math.round(goals.reduce((acc,g)=> acc + (g.current/g.target*100),0)/goals.length) : 0;
            document.getElementById('activeGoalsProgress').innerText = avgProgress + '% avg';
            document.getElementById('dashActiveGoals').innerText = activeGoals;
            document.getElementById('dashAvgProgress').innerText = avgProgress;

            const challCount = challenges.length;
            document.getElementById('challengesCount').innerText = challCount;
            document.getElementById('challengesDetail').innerText = challCount + ' active';
            document.getElementById('dashChallenges').innerText = challCount;

            const totalExp = expenses.filter(e => e.type==='expense').reduce((acc, e) => acc + e.amount, 0);
            document.getElementById('dashExpensesTotal').innerText = totalExp.toFixed(2);
        }

        // --- ADD HANDLERS ---
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            const inp = document.getElementById('newTaskDesc');
            const cat = document.getElementById('newTaskCat').value;
            if (!inp.value.trim()) return;
            tasks.push({ id: generateId(), text: inp.value.trim(), category: cat, completed: false });
            inp.value = '';
            renderEverything();
        });

        document.getElementById('addGoalBtn').addEventListener('click', () => {
            const name = document.getElementById('newGoalName').value.trim();
            const term = document.getElementById('goalTerm').value;
            const target = parseFloat(document.getElementById('goalTarget').value);
            if (!name || !target || target<=0) return alert('enter goal name and target >0');
            goals.push({ id: generateId(), name, term, current: 0, target });
            document.getElementById('newGoalName').value = ''; document.getElementById('goalTarget').value = '';
            renderEverything();
        });

        document.getElementById('addChallengeBtn').addEventListener('click', () => {
            const name = document.getElementById('newChallengeName').value.trim();
            const total = parseInt(document.getElementById('challengeTotal').value);
            if (!name || total<1) return;
            challenges.push({ id: generateId(), name, totalDays: total, progress: 0 });
            document.getElementById('newChallengeName').value = '';
            renderEverything();
        });

        document.getElementById('addExpenseBtn').addEventListener('click', () => {
            const desc = document.getElementById('expenseDesc').value.trim();
            const amount = parseFloat(document.getElementById('expenseAmount').value);
            const type = document.getElementById('expenseType').value;
            if (!desc || isNaN(amount) || amount<=0) return alert('valid description and amount');
            expenses.push({ id: generateId(), desc, amount, type });
            document.getElementById('expenseDesc').value = ''; document.getElementById('expenseAmount').value = '';
            renderEverything();
        });

        // initial render
        renderEverything();

        // extra: pressing enter not needed but fine.
    })();

