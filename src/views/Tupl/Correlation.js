import React, {Component} from 'react';
import store from '../../store'
import 'react-table-v6/react-table.css';         //table
import 'react-table-filter/lib/styles.css';   //table filter
import Chart from 'react-apexcharts';
import CanvasJSReact from './canvasjs.react';
import {
  Button,
  Card,
  CardHeader,
  FormGroup,
  CardFooter,
  CardBody,
  Label,
  CardGroup,
  Col,
  Container,
  Form, Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row } from 'reactstrap';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;



class Correlation extends Component {
  constructor(props){
    super(props)
    this.state = {
      'results': store.getState().res.results.intra_dataset_analysis.correlation,
      'heatmapdata': []
    }

    this.handleStoreChange = this.handleStoreChange.bind(this)
    this.getHeatMapData = this.getHeatMapData.bind(this)
    store.subscribe(this.handleStoreChange)
  }

  componentWillMount(){
    this.setState({
      'heatmapdata': this.getHeatMapData()
    })
  }

handleStoreChange() {
  this.setState({
    'results': store.getState().res.results.intra_dataset_analysis.correlation
  })
}

getHeatMapData(){
  let heatmapdata_temp = [];
  const correlation = this.state.results
  Object.keys(correlation)
  .map(key => {
    let col = correlation[key].columns;
    let data = correlation[key].data;
    let tempObj = {
      series: [],
      options: {
        chart: {
          height: 350,
          type: 'heatmap',
        },
        dataLabels: {
          enabled: true
        },
        colors: ["#008FFB"],
        title: {
          text: 'HeatMap Chart'
        },
        xaxis: {
          type: 'category',
          categories: []
        }
      },
      group: key
    }
    for (let i in col) {
      let series_data = {
        name: col[i],
        data: data[i]
      }
      tempObj.series.push(series_data);
      tempObj.options.xaxis.categories.push(col[i]);
    }
    heatmapdata_temp.push(tempObj);
  })
  return heatmapdata_temp
}

plotHeapMap(){
  const heatmapdata = this.state.heatmapdata
  let heatmapArr = []
  for (let index in heatmapdata) {
    let heatChart = null;
    if (this.state.heatmapdata[index].series.length !== 0) {
       heatChart = <div key = {index} className="BarChart">
       <Card>
         <CardHeader>
          {heatmapdata[index].group}
         </CardHeader>
         <CardBody>
         <Chart
            options={this.state.heatmapdata[index].options}
            series={this.state.heatmapdata[index].series}
            type="heatmap"
            width="800"
         />
         </CardBody>
       </Card>

  </div>
    }
    else {
       heatChart = <div key = {index} className="BarChart">
       <Card>
         <CardHeader>
         {this.state.heatmapdata[index].group}
         </CardHeader>
         <CardBody>
          <div>
            No correlation result for this dataset!
          </div>
         </CardBody>
       </Card>
      </div>
    }


    heatmapArr.push(heatChart);
  }
  return heatmapArr
}

render() {

  return (
    <div>
        <Card>
        <h2>Correlation</h2>
          {this.plotHeapMap()}

        </Card>

    </div>
  )

}
}
export default Correlation
