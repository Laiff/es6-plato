/*global $:false, _:false, Morris:false, __report:false, __history:false, __options: false */
/*jshint browser:true*/

$(function(){
  "use strict";

  // bootstrap popover
  $('[rel=popover]').popover();

  function drawHistoricalChart(history) {
    var data = _.map(history,function(record){
      var date = new Date(record.date);
      return {
        date : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        average_maintainability : parseFloat(record.average.maintainability),
        average_sloc : record.average.sloc
      };
    }).slice(-20);
    Morris.Line({
      element: 'chart_historical_sloc',
      data: data,
      xkey: 'date',
      ykeys: ['average_sloc'],
      labels: ['Average Lines'],
      parseTime : false
    });
    Morris.Line({
      element: 'chart_historical_maint',
      data: data,
      xkey: 'date',
      ykeys: ['average_maintainability'],
      labels: ['Maintainability'],
      ymax: 100,
      parseTime : false
    });
  }

  function drawCharts() {
    $('.js-chart').empty();
    drawHistoricalChart(__history);
  }

  drawCharts();

  $(window).on('resize', _.debounce(drawCharts,200));
});



