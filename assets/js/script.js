// window scroll
$(window).on('scroll', function() {
  var scrollTop = $(window).scrollTop();
  if (scrollTop >= 100) {
    $('body').addClass('fixed-header');
  } else {
    $('body').removeClass('fixed-header')
  }
});

// Document Ready
$(document).ready(function() {
  // Owl Carousel
  $('.owl-carousel').owlCarousel({
    loop: true,
    items: 2,
    margin: 30,
    autoplay: true,
    autoplayTimeout: 2000,
    responsive: {
      0: {items: 1},
      900: {items: 2},
    }
  });

  // One Page Scroll
  $.scrollIt({
    easing: 'linear',  // the easing function for animation
    topOffset: -70     // offste (in px) for fixed top navigation
  });

  // Language Toggle Functionality
  let currentLanguage = 'pt';  // Default language is Portuguese

  $('#language-toggle').on('click', function() {
    if (currentLanguage === 'pt') {
      currentLanguage = 'en';
      $(this).text('Português');  // Change button text to Portuguese
      switchLanguage('en');       // Switch to English
    } else {
      currentLanguage = 'pt';
      $(this).text('English');  // Change button text to English
      switchLanguage('pt');     // Switch to Portuguese
    }
  });

  // Function to switch language content
  function switchLanguage(lang) {
    $('.lang-en').hide();  // Hide all English content
    $('.lang-pt').hide();  // Hide all Portuguese content

    if (lang === 'en') {
      $('.lang-en').show();  // Show English content
    } else {
      $('.lang-pt').show();  // Show Portuguese content
    }
  }

  // Initially set to Portuguese
  switchLanguage('pt');

  // Função para atualizar as labels do gráfico
  function updateChartLabels(raisedLabel, remainingLabel) {
    donationChart.data.labels = [raisedLabel, remainingLabel];
    donationChart.update();
  }

  // Gráfico de Pizza (Chart.js)
  let donationChart;  // Declare variable outside the condition to access it
                      // globally
  if (document.getElementById('donationChart')) {
    const ctx = document.getElementById('donationChart').getContext('2d');

    // Exemplo de valor arrecadado e meta
    const totalCampaignGoal = 63448.20;  // Meta de arrecadação total (R$ 10.000)
    const amountRaised = 0;        // Quantia arrecadada até agora
    const remainingAmount = totalCampaignGoal - amountRaised;

    donationChart = new Chart(ctx, {
      type: 'pie',  // Tipo do gráfico: pizza
      data: {
        labels: ['Arrecadado', 'Faltante'],  // Legendas para as fatias
        datasets: [{
          data: [
            amountRaised, remainingAmount
          ],  // Quantia arrecadada e o que falta
          backgroundColor: ['#002654', '#FF0000'],  // Cores das fatias
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 18  // Aumentar tamanho das labels da legenda
              }
            },
            onClick: null  // Desativa a funcionalidade de clicar nas legendas
                           // para esconder fatias
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                let label = tooltipItem.label || '';
                if (label) {
                  label += ': ';
                }
                label += tooltipItem.raw + ' R$';
                return label;
              }
            },
            titleFont: {
              size: 20  // Aumenta o tamanho do título no tooltip
            },
            bodyFont: {
              size: 18  // Aumenta o tamanho do texto dentro do tooltip
            }
          },
          datalabels: {
            formatter: function(value, context) {
              let sum = 0;
              let dataArr = context.chart.data.datasets[0].data;
              dataArr.map(data => {
                sum += data;
              });
              let percentage = (value * 100 / sum).toFixed(2) +
                  '%';            // Calcula a porcentagem
              return percentage;  // Exibe a porcentagem
            },
            color: '#fff',  // Cor do texto dentro das fatias
            font: {
              size: 20,  // Tamanho da fonte das porcentagens
              weight: 'bold'
            }
          }
        }
      },
      plugins: [ChartDataLabels]  // Ativa o plugin de DataLabels
    });
  }
});
