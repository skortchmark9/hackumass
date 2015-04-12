var gauge1 = new JustGage({
	id: "gauge1",
	title: "#1",
	value: 50,
	min: 0,
	max: 1,
	humanFriendly: false,
	decimals: 1,
	counter: false,
  gaugeColor: '#ff0000',
  levelColors: ['#00ff00']
});

function updateGauge(yes_count, no_count) {
  val = yes_count / (yes_count + no_count)
  val = val ? val : .5;
  gauge1.refresh(val);
}
