#!/usr/bin/env node

var inq = require('inquirer');
var exec = require('child_process').exec;
var options = require('./options.js');
var path = require('path');
var cwd = process.cwd();
var arg = process.argv.slice(2);

var templates = options.get_templates();

var questions = [
	{type: 'list', name: 'template', message: 'Choose a template..', choices: options.get_choices},
	{type: 'input', name: 'fname', message: 'Name of directory?', when: (ans)=> templates[ans.template].is_dir },
	{type: 'input', name: 'fname', message: 'Name of file? (no extension)', when: (ans)=> !templates[ans.template].is_dir}
];

inq.prompt(questions, function(answers){
	var template = templates[answers.template];
	var ext = template.is_dir ? '' : path.extname(template.dirname);
	exec(`cp ${template.is_dir ? '-r' : ''} ${template.dirname} ${cwd+'/'+answers.fname+ext}`); 
});
