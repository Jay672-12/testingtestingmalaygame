class MalayQuizlet {
    constructor() {
        this.defaultWords = [
            { malay: 'makan', english: 'eat' },
            { malay: 'minum', english: 'drink' },
            { malay: 'tidur', english: 'sleep' },
            { malay: 'baca', english: 'read' },
            { malay: 'tulis', english: 'write' },
            { malay: 'lari', english: 'run' },
            { malay: 'jalan', english: 'walk' },
            { malay: 'duduk', english: 'sit' },
            { malay: 'berdiri', english: 'stand' },
            { malay: 'main', english: 'play' },
            { malay: 'kerja', english: 'work' },
            { malay: 'belajar', english: 'study' },
            { malay: 'rumah', english: 'house' },
            { malay: 'mobil', english: 'car' },
            { malay: 'buku', english: 'book' },
            { malay: 'meja', english: 'table' },
            { malay: 'kursi', english: 'chair' },
            { malay: 'pintu', english: 'door' },
            { malay: 'air', english: 'water' },
            { malay: 'api', english: 'fire' },
            { malay: 'rumah', english: 'house' },
            { malay: 'kucing', english: 'cat' },
            { malay: 'anjing', english: 'dog' },
            { malay: 'burung', english: 'bird' },
            { malay: 'ikan', english: 'fish' },
            { malay: 'merah', english: 'red' },
            { malay: 'biru', english: 'blue' },
            { malay: 'hijau', english: 'green' },
            { malay: 'kuning', english: 'yellow' },
            { malay: 'hitam', english: 'black' },
            { malay: 'putih', english: 'white' },
            { malay: 'besar', english: 'big' },
            { malay: 'kecil', english: 'small' },
            { malay: 'baik', english: 'good' },
            { malay: 'buruk', english: 'bad' },
            { malay: 'saya', english: 'I/me' },
            { malay: 'kamu', english: 'you' },
            { malay: 'dia', english: 'he/she' },
            { malay: 'ini', english: 'this' },
            { malay: 'itu', english: 'that' },
            { malay: 'sekarang', english: 'now' },
            { malay: 'nanti', english: 'later' },
            { malay: 'pagi', english: 'morning' },
            { malay: 'siang', english: 'afternoon' },
            { malay: 'malam', english: 'night' },
            { malay: 'satu', english: 'one' },
            { malay: 'dua', english: 'two' },
            { malay: 'tiga', english: 'three' },
            { malay: 'empat', english: 'four' },
            { malay: 'lima', english: 'five' }
        ];

        this.words = [];
        this.currentWord = null;
        this.correctAnswers = 0;
        this.totalAttempts = 0;
        this.currentStreak = 0;
        this.usedWords = [];
        this.sessionWords = [];
        this.pendingWords = [];
        this.uploadFile = null;
        
        // Enhanced quiz features
        this.wordStats = {}; // Track performance for each word
        this.encouragementMessages = [
            "🎉 Great job! Keep it up!",
            "🔥 Well done! You're on fire!",
            "⭐ Excellent work! Keep going!",
            "💪 Awesome! Keep learning!",
            "🚀 Fantastic! You're doing great!",
            "🎯 Perfect! Keep that momentum!",
            "🌟 Brilliant! Keep pushing forward!",
            "🏆 Outstanding! You're crushing it!",
            "💥 Wow! Amazing progress!",
            "🎈 Superb! Keep up the great work!"
        ];

        this.initializeElements();
        this.loadWords();
        this.attachEventListeners();
        this.startQuiz();
    }

    initializeElements() {
        // Navigation
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.views = document.querySelectorAll('.view');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Quiz elements
        this.malayWordEl = document.getElementById('malay-word');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.feedback = document.getElementById('feedback');
        this.feedbackIcon = document.getElementById('feedback-icon');
        this.feedbackText = document.getElementById('feedback-text');
        this.correctAnswerEl = document.getElementById('correct-answer');
        this.correctCountEl = document.getElementById('correct-count');
        this.totalWordsEl = document.getElementById('total-words');
        this.progressFill = document.getElementById('progress-fill');

        // Add word elements
        this.addWordForm = document.getElementById('add-word-form');
        this.newMalayInput = document.getElementById('new-malay');
        this.newEnglishInput = document.getElementById('new-english');
        this.recentWordsList = document.getElementById('recent-words-list');

        // Upload elements
        this.fileInput = document.getElementById('file-input');
        this.uploadBtn = document.getElementById('upload-btn');
        this.uploadArea = document.getElementById('upload-area');
        this.uploadPreview = document.getElementById('upload-preview');
        this.confirmUploadBtn = document.getElementById('confirm-upload-btn');
        this.cancelUploadBtn = document.getElementById('cancel-upload-btn');
        this.uploadProgress = document.getElementById('upload-progress');
        this.uploadProgressFill = document.getElementById('upload-progress-fill');
        this.progressText = document.getElementById('progress-text');

        // Stats elements
        this.totalWordsStat = document.getElementById('total-words-stat');
        this.correctAnswersStat = document.getElementById('correct-answers-stat');
        this.accuracyStat = document.getElementById('accuracy-stat');
        this.streakStat = document.getElementById('streak-stat');
        this.resetStatsBtn = document.getElementById('reset-stats-btn');
        this.exportWordsBtn = document.getElementById('export-words-btn');
    }

    attachEventListeners() {
        // Navigation
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.view));
        });

        // Tab functionality
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Quiz functionality
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
        this.nextBtn.addEventListener('click', () => this.nextWord());

        // Add word functionality
        this.addWordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewWord();
        });

        // Upload functionality
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.confirmUploadBtn.addEventListener('click', () => this.confirmUpload());
        this.cancelUploadBtn.addEventListener('click', () => this.cancelUpload());

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));

        // Stats functionality
        this.resetStatsBtn.addEventListener('click', () => this.resetStats());
        this.exportWordsBtn.addEventListener('click', () => this.exportWords());

        // Auto-focus input on quiz view
        this.answerInput.addEventListener('focus', () => {
            this.answerInput.select();
        });
    }

    loadWords() {
        try {
            const savedWords = localStorage.getItem('malayQuizletWords');
            if (savedWords) {
                this.words = JSON.parse(savedWords);
            } else {
                this.words = [...this.defaultWords];
                this.saveWords();
            }
        } catch (e) {
            console.warn('Could not load words from localStorage');
            this.words = [...this.defaultWords];
        }

        // Load word statistics
        this.loadWordStats();
        
        // Shuffle words on every start
        this.words = this.shuffleArray([...this.words]);
        
        this.loadStats();
        this.updateUI();
    }

    loadStats() {
        try {
            const stats = localStorage.getItem('malayQuizletStats');
            if (stats) {
                const savedStats = JSON.parse(stats);
                this.correctAnswers = savedStats.correctAnswers || 0;
                this.totalAttempts = savedStats.totalAttempts || 0;
            }
        } catch (e) {
            console.warn('Could not load stats from localStorage');
        }
    }

    loadWordStats() {
        try {
            const stats = localStorage.getItem('malayQuizletWordStats');
            if (stats) {
                this.wordStats = JSON.parse(stats);
            }
        } catch (e) {
            console.warn('Could not load word stats from localStorage');
            this.wordStats = {};
        }
    }

    saveWordStats() {
        try {
            localStorage.setItem('malayQuizletWordStats', JSON.stringify(this.wordStats));
        } catch (e) {
            console.warn('Could not save word stats to localStorage');
        }
    }

    saveWords() {
        try {
            localStorage.setItem('malayQuizletWords', JSON.stringify(this.words));
        } catch (e) {
            console.warn('Could not save words to localStorage');
        }
    }

    saveStats() {
        try {
            const stats = {
                correctAnswers: this.correctAnswers,
                totalAttempts: this.totalAttempts
            };
            localStorage.setItem('malayQuizletStats', JSON.stringify(stats));
        } catch (e) {
            console.warn('Could not save stats to localStorage');
        }
    }

    switchView(viewName) {
        // Update navigation buttons
        this.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        // Update views
        this.views.forEach(view => {
            view.classList.toggle('active', view.id === `${viewName}-view`);
        });

        // Update specific view content
        if (viewName === 'add') {
            this.updateRecentWords();
        } else if (viewName === 'stats') {
            this.updateStatsDisplay();
        } else if (viewName === 'quiz') {
            setTimeout(() => this.answerInput.focus(), 100);
        }
    }

    switchTab(tabName) {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
        
        if (tabName === 'manual') {
            this.newMalayInput.focus();
        }
    }

    startQuiz() {
        if (this.words.length === 0) {
            this.malayWordEl.textContent = 'No words available. Add some words first!';
            this.answerInput.disabled = true;
            this.submitBtn.disabled = true;
            return;
        }

        // Generate weighted list of words based on performance
        this.sessionWords = this.generateWeightedWordList();
        this.nextWord();
    }

    generateWeightedWordList() {
        const weightedWords = [];
        
        for (const word of this.words) {
            const stats = this.wordStats[word.malay] || { correct: 0, attempts: 0 };
            const accuracy = stats.attempts > 0 ? stats.correct / stats.attempts : 1.0;
            
            // Calculate weight - lower accuracy = higher weight
            let weight = 1.0;
            if (stats.attempts > 0) {
                // If accuracy is high, reduce weight (show less often)
                // If accuracy is low, increase weight (show more often)
                weight = 2.0 - accuracy; // Range: 1.0 to 2.0
            }
            
            // Add word multiple times based on weight
            const times = Math.ceil(weight * 3); // Base multiplier
            for (let i = 0; i < times; i++) {
                weightedWords.push(word);
            }
        }
        
        return this.shuffleArray(weightedWords);
    }

    nextWord() {
        if (this.sessionWords.length === 0) {
            this.sessionWords = this.shuffleArray([...this.words]);
        }

        this.currentWord = this.sessionWords.pop();
        this.malayWordEl.textContent = this.currentWord.malay;
        
        this.answerInput.value = '';
        this.answerInput.className = '';
        this.answerInput.disabled = false;
        this.answerInput.focus();
        
        this.submitBtn.disabled = false;
        this.nextBtn.classList.add('hidden');
        this.feedback.classList.add('hidden');
        
        this.updateProgress();
    }

    checkAnswer() {
        const userAnswer = this.answerInput.value.trim().toLowerCase();
        const correctAnswer = this.currentWord.english.toLowerCase();
        
        if (!userAnswer) {
            this.answerInput.focus();
            return;
        }

        this.totalAttempts++;
        
        // Handle slash-separated meanings
        const correctAnswers = correctAnswer.split('/').map(ans => ans.trim());
        const isCorrect = correctAnswers.some(correctAns => 
            this.normalizeAnswer(userAnswer) === this.normalizeAnswer(correctAns)
        );

        // Update word statistics
        this.updateWordStats(this.currentWord.malay, isCorrect);

        if (isCorrect) {
            this.correctAnswers++;
            this.currentStreak++;
            this.showFeedback(true, correctAnswer);
            
            // Check for encouragement every 5 correct answers
            if (this.correctAnswers % 5 === 0) {
                this.showEncouragement();
            }
        } else {
            this.currentStreak = 0;
            this.showFeedback(false, correctAnswer);
        }

        this.saveStats();
        this.saveWordStats();
        this.updateUI();
    }

    updateWordStats(malayWord, isCorrect) {
        if (!this.wordStats[malayWord]) {
            this.wordStats[malayWord] = { correct: 0, attempts: 0 };
        }
        
        this.wordStats[malayWord].attempts++;
        if (isCorrect) {
            this.wordStats[malayWord].correct++;
        }
    }

    normalizeAnswer(answer) {
        // Remove common punctuation and extra spaces
        return answer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ').trim();
    }

    showFeedback(isCorrect, correctAnswer) {
        this.answerInput.disabled = true;
        this.submitBtn.disabled = true;

        // Handle slash-separated answers for display
        const displayAnswers = correctAnswer.split('/').map(ans => ans.trim()).join(' / ');

        if (isCorrect) {
            this.answerInput.classList.add('correct');
            this.feedback.className = 'feedback correct';
            this.feedbackIcon.textContent = '✅';
            this.feedbackText.textContent = 'Correct! Well done!';
            this.correctAnswerEl.textContent = '';
        } else {
            this.answerInput.classList.add('incorrect');
            this.feedback.className = 'feedback incorrect';
            this.feedbackIcon.textContent = '❌';
            this.feedbackText.textContent = 'Not quite right.';
            if (correctAnswer.includes('/')) {
                this.correctAnswerEl.textContent = `Possible answers: ${displayAnswers}`;
            } else {
                this.correctAnswerEl.textContent = `The correct answer is: ${correctAnswer}`;
            }
        }

        this.feedback.classList.remove('hidden');
        this.nextBtn.classList.remove('hidden');
        this.nextBtn.focus();
    }

    showEncouragement() {
        const randomMessage = this.encouragementMessages[Math.floor(Math.random() * this.encouragementMessages.length)];
        
        // Create encouragement element
        const encouragementEl = document.createElement('div');
        encouragementEl.className = 'encouragement-message';
        encouragementEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(243, 156, 18, 0.3);
            z-index: 2000;
            animation: bounceIn 0.6s ease;
            max-width: 90%;
            text-align: center;
        `;
        encouragementEl.textContent = randomMessage;
        
        document.body.appendChild(encouragementEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            encouragementEl.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => {
                if (encouragementEl.parentNode) {
                    encouragementEl.remove();
                }
            }, 500);
        }, 3000);
    }

    addNewWord() {
        const malayWord = this.newMalayInput.value.trim();
        const englishWord = this.newEnglishInput.value.trim();

        if (!malayWord || !englishWord) {
            return;
        }

        // Check if word already exists
        const exists = this.words.some(word => 
            word.malay.toLowerCase() === malayWord.toLowerCase()
        );

        if (exists) {
            alert('This Malay word already exists!');
            return;
        }

        const newWord = { malay: malayWord, english: englishWord };
        this.words.push(newWord);
        this.saveWords();

        // Clear form
        this.newMalayInput.value = '';
        this.newEnglishInput.value = '';
        this.newMalayInput.focus();

        // Show success feedback
        this.showAddSuccess();
        this.updateRecentWords();
        this.updateUI();
    }

    showAddSuccess() {
        const btn = document.querySelector('.add-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Word Added!';
        btn.style.background = '#229954';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }

    updateRecentWords() {
        const recentWords = this.words.slice(-5).reverse();
        
        if (recentWords.length === 0) {
            this.recentWordsList.innerHTML = '<p style="color: #7f8c8d; text-align: center;">No words added yet</p>';
            return;
        }

        this.recentWordsList.innerHTML = '';
        recentWords.forEach(word => {
            const item = document.createElement('div');
            item.className = 'recent-word-item';
            item.innerHTML = `
                <span class="recent-malay">${word.malay}</span>
                <span class="recent-english">${word.english}</span>
            `;
            this.recentWordsList.appendChild(item);
        });
    }

    updateUI() {
        this.correctCountEl.textContent = this.correctAnswers;
        this.totalWordsEl.textContent = this.words.length;
        this.updateProgress();
    }

    updateProgress() {
        if (this.words.length === 0) {
            this.progressFill.style.width = '0%';
            return;
        }

        const progress = ((this.words.length - this.sessionWords.length) / this.words.length) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    updateStatsDisplay() {
        this.totalWordsStat.textContent = this.words.length;
        this.correctAnswersStat.textContent = this.correctAnswers;
        this.streakStat.textContent = this.currentStreak;
        
        const accuracy = this.totalAttempts > 0 
            ? Math.round((this.correctAnswers / this.totalAttempts) * 100) 
            : 0;
        this.accuracyStat.textContent = `${accuracy}%`;
    }

    resetStats() {
        if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
            this.correctAnswers = 0;
            this.totalAttempts = 0;
            this.currentStreak = 0;
            this.saveStats();
            this.updateStatsDisplay();
            this.updateUI();
        }
    }

    exportWords() {
        const dataStr = JSON.stringify(this.words, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `malay-words-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // File handling methods
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    async processFile(file) {
        if (!this.isValidFile(file)) {
            this.showUploadError('Please upload a valid Excel (.xlsx, .xls) or CSV file');
            return;
        }

        try {
            this.showUploadProgress('Reading file...');
            
            const data = await this.readFile(file);
            const words = this.parseExcelData(data);
            
            if (words.length === 0) {
                this.showUploadError('No valid word pairs found in the file');
                return;
            }

            this.pendingWords = words;
            this.showUploadPreview(words);
            
        } catch (error) {
            console.error('Error processing file:', error);
            this.showUploadError('Error processing file. Please check the format.');
        }
    }

    isValidFile(file) {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv',
            'application/csv'
        ];
        
        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const fileName = file.name.toLowerCase();
        
        return validTypes.includes(file.type) || 
               validExtensions.some(ext => fileName.endsWith(ext));
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            if (file.name.toLowerCase().endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    parseExcelData(data) {
        const words = [];
        
        try {
            if (typeof data === 'string') {
                // CSV parsing
                const lines = data.split('\n').filter(line => line.trim());
                for (const line of lines) {
                    // Better CSV parsing to handle quoted fields
                    const cells = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
                    if (cells.length >= 2) {
                        const malay = cells[0].replace(/^"|"$/g, '').trim();
                        const english = cells[1].replace(/^"|"$/g, '').trim();
                        if (malay && english) {
                            words.push({
                                malay: malay,
                                english: english
                            });
                        }
                    }
                }
            } else {
                // Excel parsing
                if (typeof XLSX === 'undefined') {
                    throw new Error('XLSX library not loaded');
                }
                
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                
                for (const row of jsonData) {
                    if (row.length >= 2 && row[0] && row[1]) {
                        words.push({
                            malay: String(row[0]).trim(),
                            english: String(row[1]).trim()
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error parsing data:', error);
            throw new Error('Failed to parse file data');
        }
        
        return words;
    }

    showUploadPreview(words) {
        const existingMalayWords = new Set(this.words.map(w => w.malay.toLowerCase()));
        
        const newWords = words.filter(word => 
            !existingMalayWords.has(word.malay.toLowerCase()) &&
            word.malay.trim() && word.english.trim()
        );
        
        const duplicateWords = words.filter(word => 
            existingMalayWords.has(word.malay.toLowerCase())
        );
        
        document.getElementById('preview-total').textContent = words.length;
        document.getElementById('preview-new').textContent = newWords.length;
        document.getElementById('preview-duplicates').textContent = duplicateWords.length;
        
        this.uploadPreview.classList.remove('hidden');
    }

    async confirmUpload() {
        if (!this.pendingWords || this.pendingWords.length === 0) {
            return;
        }

        try {
            this.showUploadProgress('Adding words...');
            
            const existingMalayWords = new Set(this.words.map(w => w.malay.toLowerCase()));
            const newWords = this.pendingWords.filter(word => 
                !existingMalayWords.has(word.malay.toLowerCase()) &&
                word.malay.trim() && word.english.trim()
            );
            
            // Add words with progress
            for (let i = 0; i < newWords.length; i++) {
                const word = newWords[i];
                this.words.push(word);
                
                const progress = ((i + 1) / newWords.length) * 100;
                this.updateUploadProgress(progress, `Adding word ${i + 1} of ${newWords.length}`);
                
                // Small delay for visual feedback
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            this.saveWords();
            this.updateUI();
            this.cancelUpload();
            this.showUploadSuccess(newWords.length);
            
        } catch (error) {
            console.error('Error adding words:', error);
            this.showUploadError('Error adding words. Please try again.');
        }
    }

    cancelUpload() {
        this.pendingWords = [];
        this.uploadPreview.classList.add('hidden');
        this.uploadProgress.classList.add('hidden');
        this.fileInput.value = '';
    }

    showUploadProgress(text) {
        this.uploadArea.classList.add('hidden');
        this.uploadPreview.classList.add('hidden');
        this.uploadProgress.classList.remove('hidden');
        this.progressText.textContent = text;
        this.uploadProgressFill.style.width = '0%';
    }

    updateUploadProgress(percent, text) {
        this.uploadProgressFill.style.width = `${percent}%`;
        this.progressText.textContent = text;
    }

    showUploadError(message) {
        this.uploadProgress.classList.add('hidden');
        this.uploadArea.classList.remove('hidden');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'upload-error';
        errorDiv.style.cssText = `
            background: #e74c3c;
            color: white;
            padding: 12px;
            border-radius: 8px;
            margin-top: 16px;
            text-align: center;
            animation: slideUp 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        this.uploadArea.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showUploadSuccess(count) {
        const successDiv = document.createElement('div');
        successDiv.className = 'upload-success';
        successDiv.style.cssText = `
            background: #27ae60;
            color: white;
            padding: 12px;
            border-radius: 8px;
            margin-top: 16px;
            text-align: center;
            animation: slideUp 0.3s ease;
        `;
        successDiv.textContent = `✅ Successfully added ${count} new words!`;
        
        document.querySelector('.add-main').appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if XLSX library is loaded
    if (typeof XLSX === 'undefined') {
        console.warn('XLSX library not loaded. Excel upload will not work.');
        // Disable upload tab if XLSX not available
        const uploadTabBtn = document.querySelector('[data-tab="upload"]');
        if (uploadTabBtn) {
            uploadTabBtn.style.display = 'none';
        }
    }
    
    new MalayQuizlet();
});

// Prevent zoom on double tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);