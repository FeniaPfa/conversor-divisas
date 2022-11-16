const clpInput = document.getElementById("clpInput");
const selectMonedas = document.getElementById("selectMonedas");
const form = document.getElementById("form");
const result = document.getElementById("result");
const chartDOM = document.getElementById("myChart")
let myChart

async function getMonedas() {
    try {
        const moneda = selectMonedas.value;
        const inputValue = +clpInput.value;
        if (inputValue == 0 || moneda == "") {
            alert("Debes completar el formulario");
            return;
        }
        const res = await fetch(`https://mindicador.cl/api/${moneda}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error("Error en la peticion");
        }

        const valorMoneda = +data.serie[0].valor;

        result.textContent = valorMoneda * inputValue;


        console.log(data)

        return data;
    } catch (error) {
        console.log(error);
        result.textContent = error;
    }
}

async function prepareChart(monedas) {

    const ejeX = monedas.serie.map((item) => {
        return item.fecha;
    });

    const ejeY = monedas.serie.map((item) => {
      return item.valor
    })

    const config = {
      type: "line",
      data: {
        labels: ejeX,
        datasets: [{
          label: `${selectMonedas.value}`,
          backgroundColor: "red",
          data: ejeY,
        }]
      },
      options: {
        scales:{
          x: { max: 10}
        }
      }
    }

    return config
}

async function renderChart(){
  if(myChart){
    myChart.destroy()
  }
  const monedas = await getMonedas();
  const config = await prepareChart(monedas)

  myChart = new Chart(chartDOM, config)

}



form.addEventListener("submit", (e) => {
    e.preventDefault();
    getMonedas();
    renderChart()
});
