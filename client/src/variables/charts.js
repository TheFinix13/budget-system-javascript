let chart1_2_options = {
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  tooltips: {
    backgroundColor: "#f5f5f5",
    titleFontColor: "#333",
    bodyFontColor: "#666",
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest",
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: "rgba(29,140,248,0.0)",
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 0,
          //suggestedMax: 20,
          padding: 20,
          fontColor: "#9a9a9a",
        },
      },
    ],
    xAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: "rgba(29,140,248,0.1)",
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9a9a9a",
        },
      },
    ],
  },
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################

let chartExample1 = {
  daily: (canvas) => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(58, 182, 74, 0.2)");
    gradientStroke.addColorStop(0.4, "rgba(58, 182, 74,0.0)");
    gradientStroke.addColorStop(0, "rgba(58, 182, 74,0)"); //green colors

    return {
      labels: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ],
      datasets: [
        {
          label: "My First dataset",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#39B54A",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#39B54A",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [120, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
        },
      ],
    };
  },

  options: chart1_2_options,
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
let chartExample2 = {
  data: (canvas) => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    return {
      labels: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
      datasets: [
        {
          label: "Data",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#1f8ef1",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#1f8ef1",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [80, 100, 70, 80, 120, 80],
        },
      ],
    };
  },
  options: chart1_2_options,
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
let chartExample3 = {
  data: (canvas) => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
    gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
    gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

    return {
      labels: ["USA", "GER", "AUS", "UK", "RO", "BR"],
      datasets: [
        {
          label: "Countries",
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: "#d048b6",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [53, 20, 10, 80, 100, 45],
        },
      ],
    };
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: "#f5f5f5",
      titleFontColor: "#333",
      bodyFontColor: "#666",
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 120,
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],
    },
  },
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
const chartExample4 = {
  data: (canvas) => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
    gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors

    return {
      labels: ["JUL", "AUG", "SEP", "OCT", "NOV"],
      datasets: [
        {
          label: "My First dataset",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#00d6b4",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#00d6b4",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#00d6b4",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [90, 27, 60, 12, 80],
        },
      ],
    };
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },

    tooltips: {
      backgroundColor: "#f5f5f5",
      titleFontColor: "#333",
      bodyFontColor: "#666",
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(29,140,248,0.0)",
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],

      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(0,242,195,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],
    },
  },
};

module.exports = {
  chartExample1, // in src/views/Dashboard.js
  chartExample2, // in src/views/Dashboard.js
  chartExample3, // in src/views/Dashboard.js
  chartExample4, // in src/views/Dashboard.js
};


// const daily = (weekSale) =>{

//   this gives an object with dates as keys
//   const groups = weekSale.reduce((groups, sales) => {
//     const date = sales.date.split('T')[0];
//     if (!groups[date]) {
//       groups[date] = [];
//     }
//     groups[date].push(sales);
//     return groups;
//   }, {});
  
//   Edit: to add it in the array format instead
//   const groupArrays = Object.keys(groups).map((date) => {
//     return {
//       date,
//       sales: groups[date],
//       totalQuantity : sum('quantity',groups[date]),
//       totalPrice : sum('price',groups[date]),
//     };
//   });
//   adding missing dates where there werent any sales
//   const firstDate = groupArrays[0].date; // "2015-08-01"

//   const lastDate = groupArrays[groupArrays.length-1].date;
//   const dates = [ ...Array(
//     Date.parse(lastDate)/86400000 - Date.parse(firstDate)/86400000 + 1).keys()]     
//       .map(k => new Date(
//         86400000*k+Date.parse(firstDate)
//           ).toISOString().slice(0, 10)); 

//     let res = []; 
//     for(let i=0,j=0; i<dates.length; i++) { 
//         res[i] = {
//             date: dates[i], 
//             totalQuantity : dates[i] === groupArrays[j].date ? groupArrays[j].totalQuantity : 0,
//             totalPrice: dates[i] === groupArrays[j].date ? groupArrays[j++].totalPrice : 0
//         }; 
//     }; 
//   let quantities = res.map(a => a.totalQuantity);
//   let prices = res.map(a => a.totalPrice);
//   let days = res.map(a => a.date);
  
//   return ({quantities,days,prices});
// }

// const weekly = (monthSale) =>{

//   this gives an object with dates as keys
//   const groups = monthSale.reduce((groups, sales) => {
//     const date = sales.date.split('T')[0];
//     if (!groups[date]) {
//       groups[date] = [];
//     }
//     groups[date].push(sales);
//     return groups;
//   }, {});
  
//   Edit: to add it in the array format instead
//   const groupArrays = Object.keys(groups).map((date) => {
//     return {
//       date,
//       sales: groups[date],
//       totalQuantity : sum('quantity',groups[date]),
//       totalPrice : sum('price',groups[date]),
//     };
//   });
  
//   function getMonday(d) {
//     var day = d.getDay();
//     var diff = d.getDate() - day + (day === 0 ? -6 : 1);  
//     return new Date(d.setDate(diff));
//   }

//   var groupedByWeek = groupArrays.reduce((m, o) => {
//       var monday = getMonday(new Date(o.date));
//       var mondayYMD = monday.toISOString().slice(0,10);
//       var found = m.find(e => e.date === mondayYMD);
//       if (found) {
//           found.totalQuantity += o.totalQuantity;
//           found.totalPrice += o.totalPrice;
//       } else {
//           o.date = mondayYMD;
//           m.push(o);
//       }
//       return m;
//   }, []);

//   let quantities = groupedByWeek.map(a => a.totalQuantity);
//   let prices = groupedByWeek.map(a => a.totalPrice);
//   let days = groupedByWeek.map(a => a.date);

//   return ({quantities,days,prices});
// }