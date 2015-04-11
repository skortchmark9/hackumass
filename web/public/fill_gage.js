$(document).ready(function() {
  var gauge1 = new JustGage({
	id: "gauge1",
	title: "#1",
	value: 50,
	min: 0,
	max: 100,
	humanFriendly: false,
	decimals: 0,
	counter: true
  });

  var gauge2 = new JustGage({
	id: "gauge2"
  });

  $('#g1_refresh').bind('click', function() {
	gauge1.refresh(getRandomInt(0, 100));
	return false;
  });

  $('#g2_refresh').bind('click', function() {
	gauge2.refresh(getRandomInt(0, 100));
	return false;
  });
});