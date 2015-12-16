var fs = require('fs'),
  _ = require('lodash');

var fileGraphTemplate = _.template(
  '<div class="threshold-<%= threshold %>">' +
  '<label><%= label %></label>' +
  '<span class="horizontal-bar" style="width:<%= width %>px"></span>' +
  '<span class="chart-value"><%= value %></span>' +
  '</div>'
);

exports.getReportCharts = function getReportCharts(report, templatePath) {
  var barChartTemplate = fs.readFileSync(templatePath).toString();
  var sloc = {
    data: [],
    ymax: 400,
    label: 'Sloc',
    color: '#1f6b75'
  };
  var bugs = {
    data: [],
    ymax: 20,
    label: 'Bugs',
    color: '#ff9b40'
  };
  var maintainability = {
    data: [],
    ymax: 100,
    label: 'Maintainability',
    color: '#ff9b40'
  };
  var lint = {
    data: [],
    ymax: 20,
    label: 'Lint errors',
    color: '#1f6b75'
  };

  report.reports.forEach(function (report) {

    sloc.ymax = Math.max(sloc.ymax, report.complexity.aggregate.complexity.sloc.physical);
    bugs.ymax = Math.max(bugs.ymax, report.complexity.aggregate.complexity.halstead.bugs.toFixed(2));
    lint.ymax = Math.max(lint.ymax, report.jshint.messages);

    sloc.data.push({
      value: report.complexity.aggregate.complexity.sloc.physical,
      label: report.info.fileShort,
      link: report.info.link
    });
    bugs.data.push({
      value: report.complexity.aggregate.complexity.halstead.bugs.toFixed(2),
      label: report.info.fileShort,
      link: report.info.link
    });
    maintainability.data.push({
      value: report.complexity.maintainability ? report.complexity.maintainability.toFixed(2) : 0,
      label: report.info.fileShort,
      link: report.info.link
    });
    lint.data.push({
      value: report.jshint && report.jshint.messages,
      label: report.info.fileShort,
      link: report.info.link
    });
  });

  return {
    maintainabilityChart: _.template(barChartTemplate, {chart: maintainability}),
    slocChart: _.template(barChartTemplate, {chart: sloc}),
    lintChart: _.template(barChartTemplate, {chart: lint}),
    bugsChart: _.template(barChartTemplate, {chart: bugs})
  }
};

function _horizontalBar(orig, width, label, thresholds) {
  var threshold = 0;
  for (var i = thresholds.length - 1; i > -1; i--) {
    if (orig > thresholds[i]) {
      threshold = i + 1;
      break;
    }
  }
  return fileGraphTemplate({
    width: width,
    label: label,
    threshold: threshold,
    value: orig
  });
};

exports.fileChart = function fileChart(data) {
  var maxWidth = 620;

  return '<div>' +
    _horizontalBar(data.complexity, Math.min(data.complexity * 2, maxWidth), 'complexity', [5, 10]) +
    _horizontalBar(data.sloc, Math.min(data.sloc, maxWidth), 'sloc', [5, 10]) +
    _horizontalBar(data.bugs, Math.min(data.bugs * 5, maxWidth), 'est errors', [5, 10]) +
    _horizontalBar(data.lint, Math.min(data.lint * 5, maxWidth), 'lint errors', [5, 10]) +
    '</div>';
};
