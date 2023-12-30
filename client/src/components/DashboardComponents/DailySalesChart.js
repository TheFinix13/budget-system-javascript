import React, { useState } from 'react'
import { Line } from "react-chartjs-2";
import moment from "moment";
import { sale } from '../../data/api';
// nodejs library that concatenates classes
import classNames from "classnames";
import axios from 'axios';
import Notifications from "components/Notification/Notification";
import { useAuth } from "contexts/AuthContext";
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

import { chartExample1 } from "variables/charts.js";


function DailySalesChart({ sales, setSales }) {
  const [notificationStatus, setNotificationStatus] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState({ msg: "", type: "" });
  const { userDetail } = useAuth();

  async function fetchSales(duration) {
    if (sales.hasOwnProperty(duration)) {
      if (duration === 'daily') {
        const quantities = chartData.daily.quantities.slice();
        const prices = chartData.daily.quantities.slice();
        const days = chartData.daily.days.slice();
        setChartData({ ...chartData, [duration]: { days, quantities, prices } })
      }
      setbigChartData(duration);
    } else {
      let data = { params: {} };
      let id;
      if (userDetail.type === 'staff') {
        id = userDetail.store;
        data = { params: { staffid: userDetail._id } };
      } else {
        id = userDetail._id;
      }
      data.params.duration = duration;

      await axios.get(sale.showSales + '/' + id, data).then((response) => {
        if (response.data.status === true) {
          if (response.data.data.length > 0) {
            let data = response.data.data;
            setSales({ ...sales, [duration]: data });
            if (duration === 'weekly') {
              setChartData({ ...chartData, [duration]: week(data) })
              setbigChartData("weekly");
            } else if (duration === 'monthly') {
              setChartData({ ...chartData, [duration]: month(data) })
              setbigChartData("monthly");
            }
          };
        }
        else {
          setNotificationDetails({ msg: "Error Loading Data, Please Referesh The Page", type: "danger" });
          setNotificationStatus(true);
        }
      })
    }
  }

  //const [chartData, setChartData] = useState({}); 

  const sum1 = (key, sale) => {
    return sale.items.reduce((a, b) => a + (b[key] || 0), 0);
  }

  function groupBy(elements, duration) {
    const formatted = elements.map(elem => {
      return { date: moment(elem.date).startOf(duration).format('YYYY-MM-DD'), items: elem.items }

    })

    const dates = formatted.map(elem => elem.date)
    const uniqueDates = dates.filter((date, index) => dates.indexOf(date) === index)

    return uniqueDates.map(date => {
      const totalQuantity = formatted.filter(elem => elem.date === date).reduce((totalQuantity, elem) => totalQuantity + sum1('quantity', elem), 0)
      const totalPrice = formatted.filter(elem => elem.date === date).reduce((totalQuantity, elem) => totalQuantity + sum1('price', elem), 0)
      return { date, totalQuantity, totalPrice }
    })
  }

  function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => "week " + (start + idx))
  }

  const missing_days = (groupArrays) => {
    //adding missing dates where there werent any sales 
    const firstDate = groupArrays[0].date; // "2015-08-01"

    const lastDate = groupArrays[groupArrays.length - 1].date;
    const dates = [...Array(
      Date.parse(lastDate) / 86400000 - Date.parse(firstDate) / 86400000 + 1).keys()]
      .map(k => new Date(
        86400000 * k + Date.parse(firstDate)
      ).toISOString().slice(0, 10));

    let res = [];
    for (let i = 0, j = 0; i < dates.length; i++) {
      res[i] = {
        date: dates[i],
        totalQuantity: dates[i] === groupArrays[j].date ? groupArrays[j].totalQuantity : 0,
        totalPrice: dates[i] === groupArrays[j].date ? groupArrays[j++].totalPrice : 0
      };
    };
    return (res);
  }

  const day = (sales) => {
    let grouped = groupBy(sales, 'day');
    const newGroup = missing_days(grouped);
    let quantities = newGroup.map(a => a.totalQuantity);
    let prices = newGroup.map(a => a.totalPrice);
    let days = newGroup.map(a => a.date);
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    days = (days.map((a => weekdays[new Date(a).getDay()])));
    return { quantities, days, prices }

  }

  const week = (sales) => {
    let grouped = groupBy(sales, 'week');
    let quantities = grouped.map(a => a.totalQuantity);
    let prices = grouped.map(a => a.totalPrice);
    let days = range(1, quantities.length);
    console.log(grouped);
    return { quantities, days, prices }
  }
  const month = (sales) => {
    let grouped = groupBy(sales, 'month');
    let quantities = grouped.map(a => a.totalQuantity);
    let prices = grouped.map(a => a.totalPrice);
    let days = grouped.map(a => a.date);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    days = (days.map((a => months[new Date(a).getMonth()])));
    return { quantities, days, prices }
  }


  const [bigChartData, setbigChartData] = useState("daily");

  const [chartData, setChartData] = useState({ daily: day(sales.daily) });

  const chartCanvasQuantity = (canvas) => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(58, 182, 74, 0.2)");
    gradientStroke.addColorStop(0.4, "rgba(58, 182, 74,0.0)");
    gradientStroke.addColorStop(0, "rgba(58, 182, 74,0)"); //green colors

    return {
      labels: chartData[bigChartData].days,
      datasets: [
        {
          label: bigChartData + " dataset",
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
          data: chartData[bigChartData].quantities,
        },
      ],
    };
  };

  const chartCanvasPrice = (canvas) => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(58, 182, 74, 0.2)");
    gradientStroke.addColorStop(0.4, "rgba(58, 182, 74,0.0)");
    gradientStroke.addColorStop(0, "rgba(58, 182, 74,0)"); //green colors

    return {
      labels: chartData[bigChartData].days,
      datasets: [
        {
          label: bigChartData + " dataset",
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
          data: chartData[bigChartData].prices,
        },
      ],
    };
  };

  return (
    <>
      {notificationStatus === true ? <Notifications details={notificationDetails} /> : null}
      <Card className="card-chart">
        <CardHeader>
          <Row>
            <Col className="text-left" sm="6">
              <h5 className="card-category">{bigChartData} Sales/Services</h5>
              <CardTitle tag="h2">Quantity Sold</CardTitle>
            </Col>
            <Col sm="6">
              <ButtonGroup
                className="btn-group-toggle float-right"
                data-toggle="buttons"
              >
                <Button
                  tag="label"
                  className={classNames("btn-simple", {
                    active: bigChartData === "daily",
                  })}
                  color="info"
                  id="0"
                  size="sm"
                  onClick={() => { fetchSales("daily") }}
                >
                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                    Daily
                  </span>
                  <span className="d-block d-sm-none">
                    Daily
                  </span>
                </Button>
                <Button
                  color="info"
                  id="1"
                  size="sm"
                  tag="label"
                  className={classNames("btn-simple", {
                    active: bigChartData === "weekly",
                  })}
                  onClick={() => { fetchSales("weekly") }}
                >
                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                    Weekly
                  </span>
                  <span className="d-block d-sm-none">
                    Weekly
                  </span>
                </Button>
                <Button
                  color="info"
                  id="2"
                  size="sm"
                  tag="label"
                  className={classNames("btn-simple", {
                    active: bigChartData === "monthly",
                  })}
                  onClick={() => { fetchSales("monthly") }}
                >
                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                    Monthly
                  </span>
                  <span className="d-block d-sm-none">
                    Monthly
                  </span>
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <div className="chart-area">
            <Line
              data={chartCanvasQuantity}
              options={chartExample1.options}
            />
          </div>
        </CardBody>
      </Card>

      <Card className="card-chart">
        <CardHeader>
          <Row>
            <Col className="text-left" sm="6">
              <h5 className="card-category">{bigChartData} Sales/Services</h5>
              <CardTitle tag="h2">Cash Inflow</CardTitle>
            </Col>
            <Col sm="6">
              <ButtonGroup
                className="btn-group-toggle float-right"
                data-toggle="buttons"
              >
                <Button
                  tag="label"
                  className={classNames("btn-simple", {
                    active: bigChartData === "daily",
                  })}
                  color="info"
                  id="0"
                  size="sm"
                  onClick={() => { fetchSales("daily") }}
                >
                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                    Daily
                  </span>
                  <span className="d-block d-sm-none">
                    Daily
                  </span>
                </Button>
                <Button
                  color="info"
                  id="1"
                  size="sm"
                  tag="label"
                  className={classNames("btn-simple", {
                    active: bigChartData === "weekly",
                  })}
                  onClick={() => { fetchSales("weekly") }}
                >
                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                    Weekly
                  </span>
                  <span className="d-block d-sm-none">
                    Weekly
                  </span>
                </Button>
                <Button
                  color="info"
                  id="2"
                  size="sm"
                  tag="label"
                  className={classNames("btn-simple", {
                    active: bigChartData === "monthly",
                  })}
                  onClick={() => { fetchSales("monthly") }}
                >
                  <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                    Monthly
                  </span>
                  <span className="d-block d-sm-none">
                    Monthly
                  </span>
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <div className="chart-area">
            <Line
              data={chartCanvasPrice}
              options={chartExample1.options}
            />
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default DailySalesChart;
