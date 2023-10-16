// Globals
var boxIdentifier;
var pm = getPathMaps();

// Assessment State closure for path selections
function formState() {
	var emptyPath = {
		completed: false,
		pathLabel: '',
		pathIndex: -1,
		pathName: '',
		skills: [],
		tools: [],
	};
	var initialState = {
		round: 1,
		page: 1,
		path1: JSON.parse(JSON.stringify(emptyPath)),
		path2: JSON.parse(JSON.stringify(emptyPath)),
	};

	// State
	var formData = JSON.parse(JSON.stringify(initialState));

	// Sets the round var in state to reflect what path selection round the user is on
	var setFormRoundToFinal = function () {
		formData.round = 2;
	};

	// Sets the page var in state so we know what form page to build for the user
	var setFormPage = function (p) {
		formData.page = p;
	};

	// Sets the nested completed var in path state so we know if path contains data to reflect in final output
	var setPathComplete = function (path) {
		formData[path].completed = true;
	};

	// Sets nested path label and path when the user makes form selection on form page 1
	var setLabelIndexName = function (path, data) {
		var pd = data.split(','); // data should be a comma separated value: pathLabel,pathIndex,pathName
		formData[path].pathLabel = pd[0];
		formData[path].pathIndex = parseInt(pd[1]);
		formData[path].pathName = pd[2].trim();
	};

	// Sets the nested skills when the user makes form selection on form page 2
	var setSkills = function (path, skills) {
		formData[path].skills = skills; // skills should be passed as an array
	};

	// Sets the nested tools when the user makes from selection on form page 3
	var setTools = function (path, tools) {
		formData[path].tools = [...tools]; // tools should be passed as an array
	};

	// Reset state to initial state
	var resetState = function () {
		formData = JSON.parse(JSON.stringify(initialState));
	};

	// Returns state
	var getState = function () {
		return formData;
	};

	// Closure return vars from formState
	return {
		setFormRoundToFinal,
		setFormPage,
		setPathComplete,
		setLabelIndexName,
		setSkills,
		setTools,
		resetState,
		getState,
	};
}

var fst = formState();

// Tooltips
$('#A4').tooltip({ content: pm.A4.Definition, tooltipClass: 'normal' });
$('#B5').tooltip({ content: pm.B5.Definition, tooltipClass: 'normal' });
$('#C6').tooltip({ content: pm.C6.Definition, tooltipClass: 'normal' });
$('#A3').tooltip({ content: pm.A3.Definition, tooltipClass: 'normal' });
$('#B4').tooltip({ content: pm.B4.Definition, tooltipClass: 'normal' });
$('#C5').tooltip({ content: pm.C5.Definition, tooltipClass: 'normal' });
$('#A2').tooltip({ content: pm.A2.Definition, tooltipClass: 'normal' });
$('#B3').tooltip({ content: pm.B3.Definition, tooltipClass: 'normal' });
$('#C4').tooltip({ content: pm.C4.Definition, tooltipClass: 'normal' });

// Client Defined Weights per score input
var perfWeights = [0.5, 0.2, 0.15, 0.15];
var poWeights = [0.16, 0.17, 0.17, 0.17, 0.17, 0.16];

// Reset Func - resets user input scores and sets state to initial
$(document).on('click', '#reset-btn', function () {
	$('.score').each(function (index, el) {
		el.value = '';
	});
	$('#po-score').html('');
	$('#perf-score').html('');
	if ($('.datarow').length) {
		$('.datarow').remove();
	}
	if ($('.development-container').hasClass('show')) {
		$('.development-container').removeClass('show');
		$('.development-container').addClass('hide');
	}
	removeFocus();
	setAssessmentStatus();
	fst.resetState();
});

// Removes 9box selected css style upon a reset
function removeFocus() {
	$('.basic-box').each(function (index, box) {
		if (box.classList.contains('selected')) {
			box.classList.remove('selected');
		}
	});
}

// This function normalizes the rating into one of three categories as a score to help determine box positioning
function normalizeScore(rating) {
	if (rating < 2.5) {
		return 1;
	} else if (rating >= 2.5 && rating <= 3.5) {
		return 2;
	} else {
		return 3;
	}
}

// Determine if inputs are complete and if assessment form can be started
function setAssessmentStatus() {
	var ok = true,
		rb = $('#assessment-btn');
	$('.score').each(function (index, input) {
		if (input.value === '') {
			if (!rb.is(':disabled')) {
				rb.attr('disabled', true);
			}
			ok = false;
		}
	});
	if (ok) {
		rb.removeAttr('disabled');
	}
}

// Grid Box Select - uses the scoring to identify which 9box to highlight with selected class css styles
function identifyBox() {
	var pScore = $('#perf-score').html();
	var tScore = $('#po-score').html();
	removeFocus();
	var pRow = pScore < 2.5 ? 'A' : pScore > 3.5 ? 'C' : 'B';
	var box = pRow + (normalizeScore(pScore) + normalizeScore(tScore));
	boxIdentifier = box;
	$('#' + box).addClass('selected');
}

// Calc Func
function calcScores(weights, inputs) {
	var score = 0;
	inputs.each(function (index, input) {
		var iv = input.value;
		var enforceMinMax =
			iv !== '' ? (iv < 1 ? (iv = 1) : iv > 5 ? (iv = 5) : iv) : iv;
		input.value = iv;
		score += weights[index] * enforceMinMax;
	});
	if (inputs.length > 4) {
		$('#po-score').html(score.toFixed(2));
	} else {
		$('#perf-score').html(score.toFixed(2));
	}
	identifyBox();
	setAssessmentStatus();
}

// Overlay and Modal control - shows or hides form modal
function overlayModalControl(show) {
	var overlay = $('#overlay'),
		modal = $('#modal');
	if (show) {
		overlay.removeClass('hide');
		overlay.addClass('show');
		modal.removeClass('hide');
		modal.addClass('show');
	} else {
		modal.removeClass('show');
		modal.addClass('hide');
		overlay.removeClass('show');
		overlay.addClass('hide');
	}
}

// *************** ASSESSMENT FORM CODE **************** //
// The assessment form has 4 phases
// Phase one is the paths radio selection
// Phase two is the skill checkbox selections
// Phase three is the tools checkbox selections
// Phase four checks formStatus round state and offers the user a chance to initiate
// another round if state round is 1 - or to simply finish the assessment and see results

// *************** FORM PATHS CODE *************** //

// Function to return paths based on the 9box position
// if a successful round has already been completed - this function will remove
// the already selected path from pathmaps to ensure the user cannot select the same path twice
function returnValidPaths() {
	var data = pm[boxIdentifier];
	var pathToRemove = '';
	if (fst.getState().path1.completed) {
		pathToRemove = fst.getState().path1.pathName;
	}
	var validPaths = [];
	for (var i = 0; i < data['In Role - Performance'].length; i++) {
		var n = data['In Role - Performance'][i].name;
		validPaths.push({
			pathLabel: 'In Role - Performance',
			pathIndex: i,
			pathName: n,
		});
	}
	for (var i = 0; i < data['In Role - Potential'].length; i++) {
		var n = data['In Role - Potential'][i].name;
		validPaths.push({
			pathLabel: 'In Role - Potential',
			pathIndex: i,
			pathName: n,
		});
	}
	for (var i = 0; i < data['Out of Role'].length; i++) {
		var n = data['Out of Role'][i].name;
		validPaths.push({
			pathLabel: 'Out of Role',
			pathIndex: i,
			pathName: n,
		});
	}
	validPaths = validPaths.filter((p) => p.pathName !== pathToRemove);
	return validPaths;
}

// Simple function that ensures a path is selected before allowing user to proceed with an enabled button
function isPathSelected() {
	var pathSelected = $('.path:radio:checked').length;
	var pathSubmit = $('#path-submit');
	pathSelected
		? pathSubmit.attr('disabled', false)
		: pathSubmit.attr('disabled', true);
}

// After returning valid paths - this function builds the path selection form page 1
function buildPathsPage() {
	// User instructions
	$('#instructions').html('Select a path and click next');
	// Create an empty form div
	var fDiv = $('<div></div>').addClass('path-form');
	// Create an empty field set
	var fSet = $('<fieldset></fieldset>').addClass('fs-form pd-small');
	// Create the path submit button - make it disabled at first
	var psBtn = $('<button></button>')
		.addClass('mg-top-medium mg-bottom-medium')
		.attr({ id: 'path-submit', disabled: true })
		.html('Next');
	// Get available/valid paths from state
	var paths = returnValidPaths();
	// Loop through paths and build out the div, input, and label -> append them fieldset
	for (var i = 0; i < paths.length; i++) {
		var { pathLabel, pathIndex, pathName } = paths[i];
		var attrs = {
			type: 'radio',
			value: `${pathLabel}, ${pathIndex}, ${pathName}`,
			id: pathName,
			name: 'paths',
		};
		var div = $('<div></div>').addClass('mg-bottom-small');
		var iput = $('<input />').addClass('path').attr(attrs);
		var ilab = $('<label></label')
			.addClass('txt-small')
			.attr('for', pathName)
			.html(`${pathName} - (${pathLabel})`);
		div.append(iput, ilab);
		fSet.append(div);
	}
	// Append form div to modal-form-container
	$('.modal-form-container').append(fDiv);
	// Append fieldset to form div
	fDiv.append(fSet);
	fDiv.append(psBtn);
	// Show Modal Form
	overlayModalControl(true);
}

// *************** END FORM PATHS CODE *************** //

// *************** FORM SKILLS/TOOLS (CHECKBOXES) CODE *************** //

// Returns Skills or Tools as an array for checkboxes type form pages
function returnBoxTypes(bType) {
	var csPath = fst.getState().round === 1 ? 'path1' : 'path2';
	var { pathLabel, pathIndex } = fst.getState()[csPath];
	return pm[boxIdentifier][pathLabel][pathIndex][bType].split(',');
}

// Enables or disables Checkbox type form page "Next" button by checking length
function areBoxesSelected(cName) {
	var boxes =
		cName === 'skill'
			? $('.skill:checkbox:checked')
			: $('.tool:checkbox:checked');
	var btn = cName === 'skill' ? $('#skill-submit') : $('#tool-submit');
	boxes.length >= 1 ? btn.attr('disabled', false) : btn.attr('disabled', true);
}

// Builds Skills or Tools Checkbox type form page (pages 2 and 3)
function buildCheckBoxPage(bType) {
	// User instructions
	$('#instructions').html(`Select 1-2 ${bType}s and click next`);
	// Create an empty form div
	var fDiv = $('<div></div>').addClass('path-form');
	// Create an empty field set
	var fSet = $('<fieldset></fieldset>').addClass('fs-form pd-small');
	// Create the path submit button - make it disabled at first
	var btn = $('<button></button>')
		.addClass('mg-top-medium mg-bottom-medium')
		.attr({ id: `${bType}-submit`, disabled: true })
		.html('Next');
	// Get skills or tools
	var arr =
		bType === 'skill' ? returnBoxTypes('skills') : returnBoxTypes('tools');
	// Loop through skills and build out the div, input, and label -> append them fieldset
	for (var i = 0; i < arr.length; i++) {
		var attrs = {
			type: 'checkbox',
			value: arr[i],
			id: arr[i],
			name: `${bType}s`,
		};
		var div = $('<div></div>').addClass('mg-bottom-small');
		var iput = $('<input />').addClass(bType).attr(attrs);
		var ilab = $('<label></label')
			.addClass('txt-small')
			.attr('for', arr[i])
			.html(arr[i]);
		div.append(iput, ilab);
		fSet.append(div);
	}
	// Append form div to modal-form-container
	$('.modal-form-container').append(fDiv);
	// Append fieldset to form div
	fDiv.append(fSet);
	fDiv.append(btn);
	// Show Modal Form
	overlayModalControl(true);
}

// *************** END FORM SKILLS CODE *************** //

// *************** ROUND/FINISH CODE *************** //

// This function builds the final form page which if state round is 1 will contain both a next round
// and a finish button - allowing the user to either initiate another path round or finish the assessment
function buildRoundOrFinishPage() {
	var instructions =
		fst.getState().round === 1
			? `Click Next Path to configure an additional development path or click Finish to complete the assessment`
			: `Maximum paths configured - click Finish to complete the assessment`;
	$('#instructions').html(instructions);
	var div = $('<div></div>').addClass(
		'fs-form pd-small mg-top-small mg-bottom-small'
	);
	var roundBtn = $('<button></button>')
		.addClass('mg-right-large')
		.attr('id', 'roundBtn')
		.html('Next Path');
	var finishBtn = $('<button></button>')
		.addClass('blue')
		.attr('id', 'finishBtn')
		.html('Finish');
	if (fst.getState().round === 1) {
		div.append(roundBtn);
	}
	div.append(finishBtn);
	$('.modal-form-container').append(div);
	overlayModalControl(true);
}

// *************** END ROUND/FINISH CODE *************** //

// Populates Modal content based on state page
function populateModal() {
	var data = pm[boxIdentifier];
	$('.path-form').remove();
	$('.fs-form').remove();
	$('#modal-title').html(data.Title);
	$('#definition').html(data.Definition);
	var { page } = fst.getState();
	switch (page) {
		case 1:
			buildPathsPage();
			break;
		case 2:
			buildCheckBoxPage('skill');
			break;
		case 3:
			buildCheckBoxPage('tool');
			break;
		default:
			buildRoundOrFinishPage();
	}
}

// Build Assessment Table from Form State
function buildAssessmentTable() {
	var r, sd, nd, skd, td, state, pArr;
	$('.datarow').remove();
	state = fst.getState();
	pArr = [];
	if (state.path1.completed && state.path2.completed) {
		pArr.push(state.path1, state.path2);
	} else {
		pArr.push(state.path1);
	}
	for (var i = 0; i < pArr.length; i++) {
		r = $('<div></div>').addClass('tr datarow');
		sd = sd = $('<div></div').addClass('td').html(pArr[i].pathLabel);
		nd = $('<div></div>').addClass('td').html(pArr[i].pathName);
		skd = $('<div></div>').addClass('td').html(pArr[i].skills.toString());
		td = $('<div></div>').addClass('td').html(pArr[i].tools.toString());
		r.append(sd, nd, skd, td);
		$('.table').append(r);
	}
	$('#matrix-title').html(pm[boxIdentifier].Title);
	$('#table-description').html(pm[boxIdentifier].Definition);
	$('.development-container').removeClass('hide');
	$('.development-container').addClass('show');
}

// Change theme
function changeTheme(theme) {
	var sun = $('.theme-btn-sun'),
		moon = $('.theme-btn-moon');
	if (theme === 'dark') {
		sun.removeClass('show');
		sun.addClass('hide');
		moon.removeClass('hide');
		moon.addClass('show');
	} else {
		moon.removeClass('show');
		moon.addClass('hide');
		sun.removeClass('hide');
		sun.addClass('show');
	}
}

// Listeners

// Performance Inputs
$(document).on('change keyup', '.perf-input', function () {
	calcScores(perfWeights, $('.perf-input'));
});

// Potential Inputs
$(document).on('change keyup', '.po-input', function () {
	calcScores(poWeights, $('.po-input'));
});

// Start Assessment Btn
$(document).on('click', '#assessment-btn', function () {
	populateModal(boxIdentifier);
});

// Modal "X" Btn
$(document).on('click', '#close-btn', function () {
	overlayModalControl(false);
	fst.resetState();
	fst.getState();
});

// Form Listeners

// Path radios
$(document).on('click', '.path', function () {
	$('.path').attr('checked', false);
	$(this).attr('checked', true);
	isPathSelected();
});

// Path "Next" Button
$(document).on('click', '#path-submit', function () {
	var data = $('.path:radio:checked')[0].value;
	var p = fst.getState().round === 1 ? 'path1' : 'path2';
	fst.setLabelIndexName(p, data);
	fst.setFormPage(2);
	populateModal();
});

// Skills checkboxes
$(document).on('click', '.skill', function () {
	var selections = $('.skill:checkbox:checked').length;
	if (selections > 2) {
		$(this)[0].checked = false;
	}
	areBoxesSelected('skill');
});

// Skills "Next" Button
$(document).on('click', '#skill-submit', function () {
	var skills = [];
	$('.skill:checkbox:checked').each(function (i, s) {
		skills.push(s.value.trim());
	});
	var p = fst.getState().round === 1 ? 'path1' : 'path2';
	fst.setSkills(p, skills);
	fst.setFormPage(3);
	populateModal();
});

// Tools checkboxes
$(document).on('click', '.tool', function () {
	var selections = $('.tool:checkbox:checked').length;
	if (selections > 2) {
		$(this)[0].checked = false;
	}
	areBoxesSelected('tool');
});

// Tools "Next" Button
$(document).on('click', '#tool-submit', function () {
	var tools = [];
	$('.tool:checkbox:checked').each(function (i, s) {
		tools.push(s.value.trim());
	});
	var p = fst.getState().round === 1 ? 'path1' : 'path2';
	fst.setTools(p, tools);
	fst.setPathComplete(p);
	fst.setFormPage(4);
	populateModal();
});

// Next Path Button
$(document).on('click', '#roundBtn', function () {
	fst.setFormRoundToFinal();
	fst.setFormPage(1);
	populateModal();
});

// Finish Form Button
$(document).on('click', '#finishBtn', function () {
	buildAssessmentTable();
	fst.resetState();
	fst.getState();
	overlayModalControl(false);
});

// End Form Listeners

// Theme Listeners
$(document).on('click', '.theme-btn-sun', function () {
	$('html').attr('data-theme', 'dark');
	changeTheme('dark');
});
$(document).on('click', '.theme-btn-moon', function () {
	$('html').attr('data-theme', 'light');
	changeTheme('light');
});
