// Charts for Diabetes Prediction Dashboard
Chart.defaults.font.family = "'Segoe UI', sans-serif";
Chart.defaults.color = '#495057';

// 1. RISK GAUGE CHART
function renderRiskGauge(probability) {
    const ctx = document.getElementById('riskGauge');
    if (!ctx) return;
    
    const color = getRiskColor(probability);
    
    // Clear previous chart if exists
    if (window.riskGaugeChart) {
        window.riskGaugeChart.destroy();
    }
    
    window.riskGaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [probability, 100 - probability],
                backgroundColor: [color, '#f0f2f5'],
                borderWidth: 0,
                circumference: 180,
                rotation: -90
            }]
        },
        options: {
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Risk Score: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
    
    // Add gauge value in center
    const container = ctx.parentElement;
    let centerText = container.querySelector('.gauge-center');
    if (!centerText) {
        centerText = document.createElement('div');
        centerText.className = 'gauge-center';
        centerText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        `;
        container.style.position = 'relative';
        container.appendChild(centerText);
    }
    
    centerText.innerHTML = `
        <div style="font-size: 2.5rem; font-weight: 700; color: ${color}">
            ${probability}%
        </div>
        <div style="font-size: 0.9rem; color: #666; margin-top: 5px">
            ${getRiskLevel(probability)}
        </div>
    `;
}

// 2. FEATURE COMPARISON BAR CHART (NEW - Column/Bar Chart)
function renderFeatureBarChart(bmi, glucose, age, insulin, pregnancies, blood_pressure, skin_thickness) {
    const ctx = document.getElementById('featureBar');
    if (!ctx) return;
    
    // Clear previous chart if exists
    if (window.featureBarChart) {
        window.featureBarChart.destroy();
    }
    
    // Data for the bar chart
    const labels = ['BMI', 'Glucose', 'Age', 'Insulin', 'Pregnancies', 'BP', 'Skin'];
    const patientValues = [bmi, glucose, age, insulin, pregnancies, blood_pressure, skin_thickness];
    
    // Normal/Healthy ranges for comparison
    const normalRanges = {
        'BMI': { min: 18.5, max: 24.9, optimal: 22 },
        'Glucose': { min: 70, max: 140, optimal: 100 },
        'Age': { min: 20, max: 60, optimal: 40 },
        'Insulin': { min: 16, max: 166, optimal: 100 },
        'Pregnancies': { min: 0, max: 4, optimal: 2 },
        'BP': { min: 90, max: 120, optimal: 110 },
        'Skin': { min: 10, max: 30, optimal: 20 }
    };
    
    const normalValues = labels.map(label => {
        const key = label === 'BP' ? 'BP' : label;
        return normalRanges[key] ? normalRanges[key].optimal : 0;
    });
    
    // Colors based on how far from normal
    const patientColors = patientValues.map((value, index) => {
        const label = labels[index];
        const key = label === 'BP' ? 'BP' : label;
        const range = normalRanges[key];
        
        if (!range) return '#3498db';
        
        if (value < range.min || value > range.max) {
            return '#e74c3c'; // Red - outside range
        } else if (Math.abs(value - range.optimal) > (range.max - range.min) * 0.3) {
            return '#f39c12'; // Orange - borderline
        } else {
            return '#2ecc71'; // Green - normal
        }
    });
    
    window.featureBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Patient Values',
                    data: patientValues,
                    backgroundColor: patientColors,
                    borderColor: patientColors.map(color => color.replace('0.8', '1')),
                    borderWidth: 1,
                    borderRadius: 5,
                    barPercentage: 0.6
                },
                {
                    label: 'Normal Range',
                    data: normalValues,
                    type: 'line',
                    borderColor: '#34495e',
                    borderWidth: 2,
                    pointBackgroundColor: '#34495e',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label;
                            const value = context.parsed.y;
                            const param = context.label;
                            
                            let unit = '';
                            switch(param) {
                                case 'BMI': unit = ' kg/m²'; break;
                                case 'Glucose': unit = ' mg/dL'; break;
                                case 'Age': unit = ' years'; break;
                                case 'Insulin': unit = ' μU/mL'; break;
                                case 'Pregnancies': unit = ''; break;
                                case 'BP': unit = ' mmHg'; break;
                                case 'Skin': unit = ' mm'; break;
                            }
                            
                            if (context.datasetIndex === 0) {
                                const key = param === 'BP' ? 'BP' : param;
                                const range = normalRanges[key];
                                if (range) {
                                    return [
                                        `${label}: ${value}${unit}`,
                                        `Normal: ${range.min}-${range.max}${unit}`,
                                        `Optimal: ${range.optimal}${unit}`
                                    ];
                                }
                            }
                            return `${label}: ${value}${unit}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Value',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// 3. RISK CATEGORY PIE CHART (Optional - if you want a 3rd chart)
function renderRiskPie(probability) {
    const ctx = document.getElementById('riskPie');
    if (!ctx) return;
    
    // Calculate risk categories
    let low, medium, high;
    
    if (probability < 30) {
        low = probability;
        medium = 0;
        high = 0;
    } else if (probability < 60) {
        low = 30;
        medium = probability - 30;
        high = 0;
    } else {
        low = 30;
        medium = 30;
        high = probability - 60;
    }
    
    // Adjust to make total 100%
    const remaining = 100 - probability;
    low += remaining * 0.3;
    medium += remaining * 0.4;
    high += remaining * 0.3;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Low Risk', 'Medium Risk', 'High Risk'],
            datasets: [{
                data: [low, medium, high],
                backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15
                    }
                }
            }
        }
    });
}

// HELPER FUNCTIONS
function getRiskColor(probability) {
    if (probability >= 70) return '#e74c3c'; // High risk - red
    if (probability >= 40) return '#f39c12'; // Medium risk - orange
    return '#2ecc71'; // Low risk - green
}

function getRiskLevel(probability) {
    if (probability >= 70) return 'High Risk';
    if (probability >= 40) return 'Moderate Risk';
    return 'Low Risk';
}

// RENDER ALL CHARTS
function renderAllCharts(probability, bmi, glucose, age, insulin, pregnancies, blood_pressure, skin_thickness) {
    renderRiskGauge(probability);
    renderFeatureBarChart(bmi, glucose, age, insulin, pregnancies, blood_pressure, skin_thickness);
    // Uncomment if you want 3rd chart
    // renderRiskPie(probability);
}

// AUTO-RUN ON ANALYSIS PAGE
if (window.location.pathname.includes('analysis')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            const probability = parseFloat('{{ probability|default(50) }}') || 50;
            const bmi = parseFloat('{{ bmi|default(25) }}') || 25;
            const glucose = parseFloat('{{ glucose|default(100) }}') || 100;
            const age = parseFloat('{{ age|default(40) }}') || 40;
            const insulin = parseFloat('{{ insulin|default(100) }}') || 100;
            const pregnancies = parseFloat('{{ pregnancies|default(0) }}') || 0;
            const blood_pressure = parseFloat('{{ blood_pressure|default(120) }}') || 120;
            const skin_thickness = parseFloat('{{ skin_thickness|default(20) }}') || 20;
            
            renderAllCharts(probability, bmi, glucose, age, insulin, pregnancies, blood_pressure, skin_thickness);
        }, 100);
    });
}

// PDF download enhancement
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.querySelector('.btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Force charts to redraw for better print quality
            if (window.riskGaugeChart) window.riskGaugeChart.resize();
            if (window.featureBarChart) window.featureBarChart.resize();
            
            setTimeout(() => {
                window.print();
            }, 100);
        });
    }
    
    console.log("Diabetes Prediction Charts loaded successfully");
});