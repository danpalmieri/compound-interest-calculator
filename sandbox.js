const form = document.querySelector(".compound-form");
const calculator = document.querySelector(".calculator");
let results = document.querySelector(".results");

let compoundData = [];
let d = new Date();
let year = d.getFullYear();
let xLabels = [year];

let args = {
    allowNegative: false,
    negativeSignAfter: false,
    prefix: 'R$ ',
    suffix: '',
    fixed: false,
    fractionDigits: 2,
    decimalSeparator: ',',
    thousandsSeparator: '.',
    cursor: 'move'
  };

  const input = SimpleMaskMoney.setMask('#principal', args);

form.addEventListener("submit", (e) => {
	e.preventDefault();

	compoundData = [];
	xLabels = [year];

	let P = SimpleMaskMoney.formatToNumber(e.target.principal.value); // principal
	let i = parseFloat(e.target.rate.value.replace(',','.')); // nominal annual interest rate in percentage terms
	let n = parseFloat(e.target.period.value); // number of compounding periods

	let ci;
	compoundData.push(P);
	for (let x = 1; x < n + 1; x++) {
		xLabels.push(year + x);
		ci = P * (1 + i / 100) ** x;
		compoundData.push(ci.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
	}

	const html = `
		<h2 class="text-xl">Resultados</h2>
		<p class="results-text my-2 leading-7 max-w-2xl">
			Com o investimento inicial de <span class="highlight border shadow-sm font-semibold py-0.5 px-2 rounded-full">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(P)}</span>,
			e uma taxa de juros de <span class="highlight border shadow-sm font-semibold py-0.5 px-2 rounded-full">${i}%</span> composta durante <span class="highlight border shadow-sm font-semibold py-0.5 px-2 rounded-full">${n}</span> anos,
			a quantida tota do seu investimento é
			<span class="highlight border shadow-sm font-semibold py-0.5 px-2 rounded-full">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(compoundData[compoundData.length - 1])}</span>.
		</p>
		<div class="chart-wrapper">
			<canvas id="chart"></canvas>
		</div>
	`;

	if (!results) {
        document.getElementById('preview').style.display='none';
		const resDiv = document.createElement("div");
		resDiv.className = "results w-full md:w-9/12 mb-2 p-5 bg-white rounded shadow";
		resDiv.innerHTML = html;

		calculator.appendChild(resDiv);
		results = document.querySelector(".results");
	} else {
		results.innerHTML = html;
	}

	const ctx = document.getElementById("chart").getContext("2d");
	const myChart = new Chart(ctx, {
		type: "line",
		data: {
			labels: xLabels,
			datasets: [
				{
					fill: { target: "origin", above: "rgba(255, 255, 255, 0.5)" },
					label: "Investimento",
					data: compoundData,
					backgroundColor: "#3D7BE2",
					borderColor: "#3D7BE2",
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				x: {
					ticks: {
						// color: "rgba(255, 255, 255, 0.74)",
					},
					grid: {
						display: false,
						// borderColor: "rgba(255, 255, 255, 0.12)",
					},
				},
				y: {
					beginAtZero: true,
					ticks: {
						// Include a euro sign in the ticks
						callback: function (value, index, values) {
							return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
						},
						// color: "rgba(255, 255, 255, 0.74)",
					},
					grid: {
						// borderColor: "rgba(255, 255, 255, 0.12)",
						// color: "rgba(255, 255, 255, 0.12)",
					},
				},
			},
		},
	});
});
