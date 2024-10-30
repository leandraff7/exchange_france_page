// window scroll
$(window).on('scroll', function () {
  var scrollTop = $(window).scrollTop();
  if (scrollTop >= 100) {
    $('body').addClass('fixed-header');
  } else {
    $('body').removeClass('fixed-header');
  }
});

// Document Ready
$(document).ready(function () {
  // Owl Carousel
  $('.owl-carousel').owlCarousel({
    loop: true,
    items: 2,
    margin: 30,
    autoplay: true,
    autoplayTimeout: 2000,
    responsive: {
      0: { items: 1 },
      900: { items: 2 },
    }
  });

  // One Page Scroll
  $.scrollIt({
    easing: 'linear',  // the easing function for animation
    topOffset: -70     // offset (in px) for fixed top navigation
  });

  // Language Toggle Functionality
  let currentLanguage = 'pt';  // Default language is Portuguese

  $('#language-toggle').on('click', function () {
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

  // Oculta as mensagens de sucesso ao carregar a página
  $('#copy-success, #copy-success-copy-paste, #copy-success-paypal').hide();

  $('#copy-button').on('click', function () {
    console.log("Copiando Chave PIX");
    var pixEmail = $('#pix-email').text();
    copyToClipboard(pixEmail, 'copy-success');
  });

  $('#copy-button-copy-paste').on('click', function () {
    console.log("Copiando PIX Copia e Cola");
    var pixCopyPaste = $('#pix-copy-paste').text();
    copyToClipboard(pixCopyPaste, 'copy-success-copy-paste');
  });

  $('#copy-button-paypal').on('click', function () {
    console.log("Copiando PayPal Email");
    var paypalEmail = $('#paypal-email').text();
    copyToClipboard(paypalEmail, 'copy-success-paypal');
  });

  // Função genérica para copiar texto para a área de transferência
  function copyToClipboard(text, successElementId) {
    if (navigator.clipboard && window.isSecureContext) {
      // Usa a API do navegador moderna para copiar
      navigator.clipboard.writeText(text)
        .then(function () {
          // Exibe mensagem de sucesso
          $('#' + successElementId).fadeIn().delay(2000).fadeOut();
        })
        .catch(function (error) {
          console.error('Falha ao copiar:', error);
        });
    } else {
      // Método de fallback para navegadores que não suportam Clipboard API
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999);  // Para dispositivos móveis
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      // Exibe mensagem de sucesso
      $('#' + successElementId).fadeIn().delay(2000).fadeOut();
    }
  }

  // Função para atualizar as labels do gráfico
  function updateChartLabels(raisedLabel, remainingLabel) {
    donationChart.data.labels = [raisedLabel, remainingLabel];
    donationChart.update();
  }

  // Gráfico de Pizza (Chart.js)
  let donationChart;  // Declaração global para o gráfico
  if (document.getElementById('donationChart')) {
    const ctx = document.getElementById('donationChart').getContext('2d');

    // Exemplo de valor arrecadado e meta
    const totalCampaignGoal = 68378.20;  // Meta de arrecadação total
    const amountRaised = 30058.24;              // Quantia arrecadada até agora
    const remainingAmount = parseFloat((totalCampaignGoal - amountRaised).toFixed(2));  // Quantia faltante

    donationChart = new Chart(ctx, {
      type: 'pie',  // Tipo do gráfico: pizza
      data: {
        labels: ['Arrecadado', 'Faltante'],  // Legendas para as fatias
        datasets: [{
          data: [amountRaised, remainingAmount],    // Dados para o gráfico
          backgroundColor: ['#002654', '#FF0000'],  // Cores das fatias
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              font: { size: 18 }  // Aumenta o tamanho das labels da legenda
            },
            onClick: null  // Desativa a funcionalidade de clicar nas legendas
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                let label = tooltipItem.label || '';
                if (label) {
                  label += ': ';
                }
                label += 'R$ ' + tooltipItem.raw ;
                return label;
              }
            },
            titleFont: { size: 20 },
            bodyFont: { size: 18 }
          },
          datalabels: {
            formatter: function (value, context) {
              let sum = 0;
              let dataArr = context.chart.data.datasets[0].data;
              dataArr.map(data => sum += data);
              let percentage = (value * 100 / sum).toFixed(2) + '%';
              return percentage;  // Exibe a porcentagem nas fatias
            },
            color: '#fff',  // Cor do texto dentro das fatias
            font: {
              size: 20,  // Tamanho da fonte
              weight: 'bold'
            }
          }
        }
      },
      plugins: [ChartDataLabels]  // Ativa o plugin de DataLabels
    });
  }
});
