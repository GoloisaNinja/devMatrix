// Globals
var boxIdentifier;
var pm = getPathMaps();

// Weights
var perfWeights = [0.5, 0.2, 0.15, 0.15];
var poWeights = [0.16, 0.17, 0.17, 0.17, 0.17, 0.16];

// Reset Func
$(document).on('click', '#reset-btn', function () {
	$('.score').each(function (index, el) {
		el.value = '';
	});
	$('#po-score').html('');
	$('#perf-score').html('');
	removeFocus();
});

// Remove Box Border Focus
function removeFocus() {
	$('.basic-box').each(function (index, box) {
		if (box.classList.contains('selected')) {
			box.classList.remove('selected');
		}
	});
}

// Rating as Score Func

function normalizeScore(rating) {
	if (rating < 2.5) {
		return 1;
	} else if (rating >= 2.5 && rating <= 3.5) {
		return 2;
	} else {
		return 3;
	}
}

// Determine if inputs are complete and recommendations can be given

function setRecommendationStatus() {
	var ok = true,
		rb = $('#recommendations');
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

// Grid Box Select

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
	setRecommendationStatus();
}

// Overlay and Modal control

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

function buildTableRows(d, p) {
	var row, sd, nd, skd, td;
	for (var i = 0; i < d[p].length; i++) {
		row = $('<div></div>').addClass('tr datarow');
		if (i === 0) {
			sd = $('<div></div').addClass('td').html(p);
		} else {
			sd = $('<div></div').addClass('td').html('');
		}
		nd = $('<div></div>').addClass('td').html(d[p][i].name);
		skd = $('<div></div>').addClass('td').html(d[p][i].skills);
		td = $('<div></div>').addClass('td').html(d[p][i].tools);
		row.append(sd, nd, skd, td);
		$('.table').append(row);
	}
}

// Get Static Paths Data Based on Box Identifier and Populate Modal fields

function populateModal(id) {
	$('.datarow').remove();
	var data = pm[id];
	$('#title').html(data.Title);
	buildTableRows(data, 'In Role');
	buildTableRows(data, 'Out of Role');
	buildTableRows(data, 'Out of Branch');
	overlayModalControl(true);
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
$(document).on('change', '.perf-input', function () {
	calcScores(perfWeights, $('.perf-input'));
});
$(document).on('change', '.po-input', function () {
	calcScores(poWeights, $('.po-input'));
});
$(document).on('click', '#recommendations', function () {
	populateModal(boxIdentifier);
});
$(document).on('click', '#close-btn', function () {
	overlayModalControl(false);
});
$(document).on('click', '.theme-btn-sun', function () {
	$('html').attr('data-theme', 'dark');
	changeTheme('dark');
});
$(document).on('click', '.theme-btn-moon', function () {
	$('html').attr('data-theme', 'light');
	changeTheme('light');
});
