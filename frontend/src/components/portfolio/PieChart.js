import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function PieChart({ carb, protein, fat }) {
    Chart.register(ArcElement);

    // Register the plugin to all charts:
    Chart.register(ChartDataLabels);
    // Change default options for ALL charts
    Chart.defaults.set('plugins.datalabels', {
        color: 'white'
    });

    const data = {
        labels: [
            'Carbohydrates', 'Protein', 'Fats'
            // 'Red', 'Green', 'Blue',
            // 'Yellow', 'Purple', 'Orange'
        ],
        datasets: [
            {
                label: 'Macronutrient Percentage',
                //   data: [40, 40, 20],
                data: [
                    carb,
                    protein, 
                    fat,
                ],

                backgroundColor: [
                    'blue',
                    'red',
                    'green',
                    // 'rgba(255, 99, 132, 0.2)',
                    // 'rgba(54, 162, 235, 0.2)',
                    // 'rgba(75, 192, 192, 0.2)',
                    // 'rgba(255, 206, 86, 0.2)',
                    // 'rgba(153, 102, 255, 0.2)',
                    // 'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'white',
                    'white',
                    'white'
                    // 'rgba(255, 99, 132, 1)',
                    // 'rgba(54, 162, 235, 1)',
                    // 'rgba(75, 192, 192, 1)',
                    // 'rgba(255, 206, 86, 1)',
                    // 'rgba(153, 102, 255, 1)',
                    // 'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1
            }],

        options: {
            plugins: {
                datalabels: {
                    color: 'white',
                    font: {
                        size: 24,
                        weight: 'bold'
                    },
                },
                    labels: {
                        color: 'white',
                        font: {
                            size: 24,
                            weight: 'bold'
                        },
                    }
                }
            }
    }

    return <Pie data={data} />;
};
