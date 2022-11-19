const clpInput = document.getElementById("clpInput");
const selectMonedas = document.getElementById("selectMonedas");
const form = document.getElementById("form");
const result = document.getElementById("result");
const chartDOM = document.getElementById("myChart")
let myChart


const getMonedas = async () => {
    try {

        const res = await fetch(`https://mindicador.cl/api/${selectMonedas.value}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error("Error en la peticion");
        }

        const valorMoneda = +data.serie[0].valor;

        result.textContent = (valorMoneda * clpInput.value).toFixed();


        console.log(data)

        return data;
    } catch (err) {
        result.textContent = err;
    }
}

const prepareChart = async(monedas) => {

    const ejeX = monedas.serie.map((item) => {
        return item.fecha.slice(0,10);
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
          backgroundColor: "blue",
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

    if (clpInput.value == 0 || selectMonedas.value == "") {
      alert("Debes completar el formulario");
  } else {
    getMonedas();
    renderChart()
  }
});
