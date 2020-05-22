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



class Single extends Component {
  constructor(props){
    super(props)
    this.state = {
      'results': store.getState().res.results.single_column_analysis,
      'chartData': store.getState().chartData,
      'fileData': store.getState().fileData,
      'datasets': store.getState().fileList,
      'isChartShow': store.getState().isChartShow,
      'curFile': ''
    }

    this.handleSelectedFile = this.handleSelectedFile.bind(this)
    this.selectFile = this.selectFile.bind(this)
    this.handleStoreChange = this.handleStoreChange.bind(this)
    store.subscribe(this.handleStoreChange)
  }


  componentDidMount(){
    this.setState({
      'curFile': this.state.datasets[0]
    })

  }


  //individually
  showHideChart = (index)=>{
    let temp = this.state.isChartShow.slice();
    temp[index] = !temp[index];
    this.setState({isChartShow: temp});

  }

  //show all
    showChartAll = ()=>{
      let temp = [];
      for(let i in this.state.isChartShow)
      {
        temp.push(true);
      }
      this.setState({
        isChartShow : temp

      });
  }

    //hide all
    hideChartAll = ()=>{
      let temp = [];
      for(let i in this.state.isChartShow)
      {
        temp.push(false);
      }
      this.setState({
        isChartShow : temp
        //isChartShow : true

      });
  }

  classifyChart = (chartOpt, chartStat, index, columnType) =>
  {
      //index = 0; //Temp (use the 1st data)
      const label = this.state.chartData[index].label;
      let pieOpt ={
        title: {
          text: "Pie Chart"
        },
        data: [{
          type: "pie",
          showInLegend: false,
          toolTipContent: "{label} - {y} (#percent %)",
          legendText: "{label}",
                  dataPoints: []

         }]
      };

      let distributionOpt = {
        title: {
          text: "Distribution"
        },
        data: [{
                  type: "column",
                  indexLabel: "{y}",
                  dataPoints: []
         }]
      };

      if (label === "Categorical"){
          const category = this.state.chartData[index].categories;
          pieOpt.title.text = columnType[index];
          let temp = Object.keys(category).map((label, index)=>{
            const tempPoint = {label: 0, y:0};
            tempPoint.label = label;
            tempPoint.y = category[label];

            pieOpt.data[0].dataPoints.push(tempPoint);

            return(
              <p key = {index}>
                {label} : {category[label]}
              </p>

            )
          })
          chartStat.push(temp);
          chartOpt.push(pieOpt);
      }
      else if (label==="Numerical (Integer)" || label==="Numerical (Float)"){
        const category = this.state.chartData[index].distribution;
        distributionOpt.title.text = columnType[index];
        let temp = Object.keys(category).map((label, index)=>{
          const tempPoint = {label: 0, y:0};
          tempPoint.label = label;
          tempPoint.y = category[label];
          distributionOpt.data[0].dataPoints.push(tempPoint);
          return(
            <p key1 = {index}>
              {label} : {category[label]}
            </p>

          )
        })
        chartStat.push(temp);
        chartOpt.push(distributionOpt);
      }
      else if (label === "ID" || label ==="SemiID"){
        const category = this.state.chartData[index].length_distribution;
        pieOpt.title.text = columnType[index];
        const category_sample = this.state.chartData[index].sample_data;
        let temp_sample = Object.keys(category_sample).map((label, index)=>{
          return(
            <p key = {index}>
              {label} : {category_sample[label]}
            </p>

          )

        })
        let temp = Object.keys(category).map((label, index)=>{
          const tempPoint = {label: 0, y:0};
          tempPoint.label = label;
          tempPoint.y = category[label];

          pieOpt.data[0].dataPoints.push(tempPoint);

          return(
            <p key = {index}>
              {label} : {category[label]}
            </p>

          )
        })
      let temp_sum = <div>{temp}<br/>Sample data: <br/>{temp_sample}</div>
        chartStat.push(temp_sum);
        chartOpt.push(pieOpt);
    }
    else if (label === "Null"){
      const category = this.state.chartData[index].categories;
      pieOpt.title.text = columnType[index];
      let temp = Object.keys(category).map((label, index)=>{
        const tempPoint = {label: 0, y:0};
        tempPoint.label = label;
        tempPoint.y = category[label];

        pieOpt.data[0].dataPoints.push(tempPoint);

        return(
          <p key = {index}>
            {label} : {category[label]}
          </p>

        )
      })
      chartStat.push(temp);
      chartOpt.push(pieOpt);
  }
      else{
        chartStat.push(this.state.chartData[index].format);
        const tempPoint = {label: 0, y:0};
        tempPoint.label = "null";
        tempPoint.y = 0;

        pieOpt.data[0].dataPoints.push(tempPoint);
      }

  }



handleStoreChange() {

  this.setState({
    'results': store.getState().res.results.single_column_analysis,
      'chartData': store.getState().chartData,
      'fileData': store.getState().fileData,
      'datasets': store.getState().fileList,
      'isChartShow': store.getState().isChartShow,
  })

}

getColumnTypes(){
  if (this.state.results !== null) {
   //let columnType = Object.keys(this.state.res.results.single_column_analysis.dataset1);
    let columnType =null;
    const single = this.state.results
   Object.keys(single)
   .map(key => {
       const obj = single[key];
       columnType = Object.keys(obj);
   })
   return columnType
  }
}

plotFile(plotData, csv){
  let chartArr =[];
  let chartOpt=[];
  let chartStat=[];

  if (plotData !== null) {
    //  let columnType = this.getColumnTypes()
    let columnType = Object.keys(this.state.results[csv])


      for (let index in plotData) {
        this.classifyChart(chartOpt, chartStat, index, columnType);
      }
      // console.log(this.state.chartData);

      for (let index in plotData) {
        // console.log(columnType[index]);
        // console.log(this.state.chartData[index].features);
        const chartTemp =   <div className = "BarChart" key = {index}>
                            <button onClick = {() => this.showHideChart(index)}> {columnType[index]} </button>
          <p>{plotData[index].label}</p>


        <CardGroup>
          <Card>
            <CardBody>

            <div>{this.state.isChartShow[index]? (chartStat[index]) : null}</div>
           <div>{this.state.isChartShow[index]? (plotData[index].features.useful==="True"?
            <div className = "Useful"> Useful</div> : <div className ="Useless">Useless</div>) : null }</div>
           <div>{this.state.isChartShow[index]? (plotData[index].features.has_invalid_data==="True"?
            <div className ="hasInvalid">Has invalid data</div> : <div className ="noInvalid">No invalid data</div>) : null}</div>

            </CardBody>
          </Card>

          <Card>
            <CardBody>
              {this.state.isChartShow[index]? (this.state.chartData[index].label !== "timestamp"?
              (this.state.chartData[index].label !== "Null"?
              <CanvasJSChart options = {chartOpt[index]}/> : null) : null) : null}
            </CardBody>
          </Card>
        </CardGroup>


      </div>
        chartArr.push(chartTemp);
      }
  }


return(
    <div className='single-total'>
      <div className="showHideButton">
               <button onClick = {() => this.showChartAll()}> Show All </button>
               <button onClick = {() => this.hideChartAll()}> Hide All </button>

      </div>

      <div>
        {chartArr.length === 0? null : chartArr}
      </div>

    </div>

  );
}
plotAllFiles(){
  const fileData = this.state.fileData
  let allPlots = []
  for(let index in fileData){
    const temp = <div key={index}>
      <h2>{index}</h2>
      {this.plotFile(fileData[index], index)}
    </div>
    allPlots.push(temp)
  }
  return allPlots
}

selectFile(){
  let temp = <div>
      <Input type="select"
             value = {this.state.curFile}
             onChange = {this.handleSelectedFile}
      >
        {this.state.datasets.map((item, index) =>(
              <option key = {index} value={item}>
                {item}
              </option>
        ))}
      </Input>
    </div>

  return temp
}

plotSlectedFile(){
  const curFile = this.state.curFile
  const plotData = this.state.fileData[curFile]
  return this.plotFile(plotData, curFile)
}
handleSelectedFile(event){
  this.setState({
    'curFile': event.target.value
  })
}
render() {
  console.log('render')
  let show = [this.selectFile()]
  if (this.state.curFile !== ''){
    console.log(this.plotSlectedFile())
    const h2 = <h2>{this.state.curFile}</h2>
    show.push(h2)
    show.push(this.plotSlectedFile())
  }
  return (
    <div>
        {show}
        {/* {this.plotAllFiles()} */}
    </div>
  )

}
}
export default Single;
