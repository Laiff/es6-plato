"use strict";

var eslint = require("eslint"),
  CLIEngine = eslint.CLIEngine;

var engine;

exports.process = function (source, options, reportInfo) {
  return generateReport(lint(source, options, reportInfo.file));
};

function generateReport(data) {

  var out = {
    messages : []
  };

  data.results.forEach(function (result) {
    out.messages.push({
      severity : 'error',
      line     : result.line,
      column   : result.column,
      message  : result.message,
      source   : result.source
    });
  });

  return out;
}

function lint(source, config, fileName) {
  config = config || {};

  var data = [];

  // Remove potential Unicode BOM.
  source = source.replace(/^\uFEFF/, "");

  var results = ensureEngine(config).executeOnText(source, fileName);

  return {
    results : results.results[0].messages,
    data : data
  };
}

function ensureEngine(config) {
  if (!engine) {
    engine = new CLIEngine(config);
  }

  return engine;
}
