// journal.js – dynamic journal + Chart

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-entry');
  const container = document.getElementById('journal-entries');
  const moodChartCtx = document.getElementById('mood-chart').getContext('2d');
  const noEntriesMessage = document.querySelector('.no-entries-message'); // Get the new message element

  const dataLabels = [];
  const dataScores = [];

  // Initial chart creation with improved options
  let chart = new Chart(moodChartCtx, {
      type: 'line',
      data: {
          labels: dataLabels,
          datasets: [{
              label: 'Mood Score (1-5)', // More descriptive label
              data: dataScores,
              borderColor: '#4CAF50', // Changed to a distinct green
              backgroundColor: 'rgba(76, 175, 80, 0.2)', // Light fill under the line
              tension: 0.3, // Slightly more curved line
              pointBackgroundColor: '#4CAF50',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              fill: true // Fill the area under the line
          }]
      },
      options: {
          responsive: true, // Chart will resize with its container
          maintainAspectRatio: false, // Allows CSS to control height (e.g., via a parent div)
          plugins: {
              legend: {
                  display: true, // Display the legend (Mood Score)
                  position: 'top',
                  labels: {
                      color: '#333' // Adjust legend text color if needed
                  }
              },
              tooltip: {
                  callbacks: {
                      label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                              label += ': ';
                          }
                          // Map score to emoji for tooltip
                          const moodEmoji = {
                              5: '😄 Excellent',
                              3: '😐 Neutral',
                              1: '😢 Sad'
                          };
                          return label + (moodEmoji[context.raw] || context.raw);
                      }
                  }
              }
          },
          scales: {
              x: {
                  grid: {
                      display: false // Hide x-axis grid lines for cleaner look
                  },
                  ticks: {
                      color: '#555' // X-axis label color
                  }
              },
              y: {
                  min: 1,
                  max: 5,
                  ticks: {
                      stepSize: 1, // Ensure ticks are at 1, 2, 3, 4, 5
                      callback: function(value, index, values) {
                          // Display custom labels for Y-axis ticks
                          switch (value) {
                              case 1: return '😢 Sad';
                              case 3: return '😐 Neutral';
                              case 5: return '😄 Excellent';
                              default: return ''; // Hide 2 and 4
                          }
                      },
                      color: '#555' // Y-axis label color
                  },
                  grid: {
                      color: 'rgba(0, 0, 0, 0.1)', // Light grid lines
                  }
              }
          }
      }
  });

  addBtn?.addEventListener('click', () => {
      const block = document.createElement('div');
      block.className = 'journal-block';
      block.innerHTML = `
          <div class="journal-input-group">
              <label for="journal-date-${Date.now()}">Date:</label>
              <input type="date" id="journal-date-${Date.now()}" class="journal-date"/>
          </div>
          <div class="journal-input-group">
              <label for="journal-mood-${Date.now()}">Mood:</label>
              <select id="journal-mood-${Date.now()}" class="journal-mood">
                  <option value="5">😄 Excellent</option>
                  <option value="4">😊 Good</option>
                  <option value="3">😐 Neutral</option>
                  <option value="2">😟 Bad</option>
                  <option value="1">😢 Sad</option>
              </select>
          </div>
          <div class="journal-input-group">
              <label for="journal-thoughts-${Date.now()}">Thoughts:</label>
              <textarea id="journal-thoughts-${Date.now()}" rows="3" placeholder="Write your thoughts..."></textarea>
          </div>
          <button class="remove-entry-btn">Remove</button>
      `;
      container.appendChild(block);

      // Hide "No entries" message when the first entry is added
      if (noEntriesMessage) {
          noEntriesMessage.style.display = 'none';
      }

      const dateInput = block.querySelector('.journal-date');
      const moodSelect = block.querySelector('.journal-mood');
      const removeBtn = block.querySelector('.remove-entry-btn');

      moodSelect.addEventListener('change', updateChart);
      dateInput.addEventListener('change', updateChart);
      removeBtn.addEventListener('click', () => {
          block.remove();
          updateChart();
          // Show "No entries" message if all entries are removed
          if (document.querySelectorAll('.journal-block').length === 0 && noEntriesMessage) {
              noEntriesMessage.style.display = 'block';
          }
      });

      // Initialize with current date for convenience
      dateInput.valueAsDate = new Date();
      updateChart(); // Update chart immediately after adding a new entry
  });

  function updateChart() {
      dataLabels.length = 0;
      dataScores.length = 0;

      // Collect data in chronological order by date
      const entries = Array.from(document.querySelectorAll('.journal-block')).map(b => {
          const d = b.querySelector('.journal-date').value;
          const m = b.querySelector('.journal-mood').value;
          return { date: d, mood: Number(m) };
      }).filter(entry => entry.date && entry.mood); // Filter out incomplete entries

      // Sort entries by date
      entries.sort((a, b) => new Date(a.date) - new Date(b.date));

      entries.forEach(entry => {
          dataLabels.push(entry.date);
          dataScores.push(entry.mood);
      });

      chart.update();

      // Show/hide "No entries" message based on current entries
      if (noEntriesMessage) {
          if (document.querySelectorAll('.journal-block').length === 0) {
              noEntriesMessage.style.display = 'block';
          } else {
              noEntriesMessage.style.display = 'none';
          }
      }
  }

  // Initial check for entries on load (if any are pre-existing or loaded from storage)
  // If you plan to load entries from local storage, call updateChart() after loading them.
  updateChart(); // Call once on load to initialize chart and message state
});