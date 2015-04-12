var gauge1 = new JustGage({
	id: "gauge1",
	title: "",
	value: 50,
	min: 0,
	max: 1,
	humanFriendly: false,
	decimals: 2,
	counter: false,
  gaugeColor: '#ff0000',
  showinnerShadow: false,
  levelColors: ['#00ff00'],
  showMinMax: false,
  labels : '',
  refreshAnimationTime: 1000,
  refreshAnimationType: "bounce"

});

function updateGauge(yes_count, no_count) {
  val = yes_count / (yes_count + no_count);
  val = (yes_count - no_count) ? val : .5;
  val = val.toFixed(2);
  gauge1.refresh(val);
}
