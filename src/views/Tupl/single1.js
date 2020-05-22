import React, {Component} from 'react';
import store from '../../store'
import Calendar from 'react-calendar';
import Logo from './tupl_logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ReactTable from 'react-table-v6';         //table
import 'react-table-v6/react-table.css';         //table
import 'react-table-filter/lib/styles.css';   //table filter
import Chart from 'react-apexcharts';
import CanvasJSReact from './canvasjs.react';
import { createProject, createAnalysis } from '../../api/project'
import {
  changeProjectAction,
  changeAnalysisProjectAction,
  changeAnalysisNameAction,
  changeAnalysisHeaderAction,
  changeAnalysisThresholdAction,
  createProjectAction,
  getAnalysisResultsAction,
  updateChartDataAction,
  changeAnalysisCheckListAction } from '../../store/actionCreators';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;



class Single1 extends Component {
  constructor(props){
    super(props)
    this.state = store.getState()
    this.submitCreateProject = this.submitCreateProject.bind(this);
    this.submitCreateAnalysis = this.submitCreateAnalysis.bind(this);
    this.handleChangeProject = this.handleChangeProject.bind(this)

    this.handleCreateProject = this.handleCreateProject.bind(this)
    this.handleAnalysisData = this.handleAnalysisData.bind(this)
    this.updateChartInfo = this.updateChartInfo.bind(this)
    this.updateChartData = this.updateChartData.bind(this)

    this.handleStoreChange = this.handleStoreChange.bind(this)
    store.subscribe(this.handleStoreChange)
  }




  changeDate = date => this.setState({date})
  backToToday = () => {
    this.setState({date: new Date()});
  }

  //individually
  showHideChart = (index)=>{
    let temp = this.state.isChartShow.slice();
    console.log(index);
    temp[index] = !temp[index];
    this.setState({isChartShow: temp});
    console.log(this.state.isChartShow[index]);

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
        //isChartShow : true

      });
        console.log(this.state.isChartShow);
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
        console.log(this.state.isChartShow);
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
        console.log(category);
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





  //create project submit

submitCreateProject = (e) => {
  e.preventDefault();
  //alert('A project was created: ' + this.state.usercreateprojectname);
  var formData = new FormData(e.target);
  formData.append("project",this.state.usercreateprojectname);

  createProject(formData).then(data => {

      if (data.code === 0){
        this.handleCreateProject()
        alert('Created Project Successfully!')
        // console.log(this.state.usercreateprojectlist)
      }
      else {
        alert(data.msg)
      }
  })

};


submitCreateAnalysis = (e) => {
  e.preventDefault();
  //alert('A project was created: ' + this.state.usercreateprojectname);
  var formData = new FormData(e.target);
  formData.append("project",this.state.createanalysisprojectselected);
  formData.append("analysis_name",this.state.createanalysisname);
  formData.append("header",this.state.createanalysisheader);
  formData.append("threshold", this.state.createanalysisthreshold);
  createAnalysis(formData).then(data => {
      if(data.code === 1){
        alert(data.msg)

      }
      else {
        alert("Created Analysis Successfully!");
        let checktemp = [];
        for (let i = 0 ; i < data.data.datasets.length; i++) {
          checktemp.push(true);
        }
        this.handleChangeAnalysisIsChecked(checktemp)
        this.handleAnalysisData(data.data)
        this.updateChartInfo(data.data.results.single_column_analysis)
      }

  })

};

updateChartInfo(single_column){
  Object.keys(single_column).map(csv =>  {
    // get results for each .csv file
    const single_column_csv = single_column[csv]
    // get results for each column of the .csv file
    Object.keys(single_column_csv).map(col => {
      const col_data = single_column_csv[col]
      this.updateChartData(col_data)
    })
  })
}

updateChartData(chart_data){
  // state.chartData is the results of each column
  const action = updateChartDataAction(chart_data)
  store.dispatch(action)
}
handleChangeProject = (event) => {
  const action = changeProjectAction(event.target.value)
  store.dispatch(action)

}

handleChangeAnalysisProject = (event) => {
  console.log(event.target.value)
  const action = changeAnalysisProjectAction(event.target.value)
  store.dispatch(action)
}

handleChangeAnalysisName = (event) => {
  const action = changeAnalysisNameAction(event.target.value)
  store.dispatch(action)
}


handleChangeAnalysisHeader = (event) => {

  const action = changeAnalysisHeaderAction(event.target.value)
  store.dispatch(action)
}

handleChangeAnalysisThreshold = (event) => {

  const action = changeAnalysisThresholdAction(event.target.value)
  store.dispatch(action)

}
handleChangeAnalysisIsChecked(value){
  const action = changeAnalysisCheckListAction(value)
  store.dispatch(action)

}
handleCreateProject(){
  const action = createProjectAction()
  store.dispatch(action)
}

handleAnalysisData(results){
  const action = getAnalysisResultsAction(results)
  store.dispatch(action)
}

handleStoreChange() {
  this.setState(store.getState())
}


render() {



   // var CanvasJS = CanvasJSReact.CanvasJS;



      //table
const frequent_itemsets_columns = [
    {
      Header: "Itemsets",
      accessor: "itemsets",
      sortable: false
    },
    {
      Header: "Support",
      accessor: "support",
      filterable: false
    }
];

const association_rules_columns = [
  {
    Header: "Antecedents",
    accessor: "antecedents",
    sortable: false
  },
  {
    Header: "Consequents",
    accessor: "consequents",
    sortable: false
  },
  {
    Header: "Confidence",
    accessor: "confidence",
    filterable: false
  }

];

const sequences_columns = [
{
  Header: "Sequence",
  accessor: "Sequence",
  sortable: false
},
{
  Header: "Frequency",
  accessor: "Frequency",
  filterable: false
}
];

const top_sequences_columns = [
{
  Header: "Sequence",
  accessor: "Sequence",
  sortable: false
},
{
  Header: "Frequency",
  accessor: "Frequency",
  filterable: false
}
];

//Time setting
// const time =
// <p>
// Today is {this.state.date.getDate()}/{this.state.date.getMonth()+1}/{this.state.date.getFullYear()}
// </p>;

    let test =null;
    let test1=null;
    let temp = null;
    let temp1=null;
    let chartArr =[];
    let chartOpt=[];
    let chartStat=[];
    let intraKey =null;
    let intraTab=null;

    if (this.state.res !== null) {
       console.log(this.state.res)
      //let columnType = Object.keys(this.state.res.results.single_column_analysis.dataset1);
       let columnType =null;

      Object.keys(this.state.res.results.single_column_analysis)
      .map(key=>{
          const obj = this.state.res.results.single_column_analysis[key];
          // console.log(obj);
          columnType = Object.keys(obj);
      });



      console.log(columnType);
        for (let index in this.state.chartData) {
          this.classifyChart(chartOpt, chartStat, index, columnType);
        }
        // console.log(this.state.chartData);

        for (let index in this.state.chartData) {
          // console.log(columnType[index]);
          // console.log(this.state.chartData[index].features);
          const chartTemp =   <div className = "BarChart" key = {index}>
                              <button onClick = {() => this.showHideChart(index)}> {columnType[index]} </button>
            <p>{this.state.chartData[index].label}</p>



          <div className = "BarChartLeft">
            <div>{this.state.isChartShow[index]? (chartStat[index]) : null}</div>
             <div>{this.state.isChartShow[index]? (this.state.chartData[index].features.useful==="True"?
              <div className = "Useful"> Useful</div> : <div className ="Useless">Useless</div>) : null }</div>
             <div>{this.state.isChartShow[index]? (this.state.chartData[index].features.has_invalid_data==="True"?
              <div className ="hasInvalid">Has invalid data</div> : <div className ="noInvalid">No invalid data</div>) : null}</div>

          </div>


          <div className = "BarChartRight">
            {this.state.isChartShow[index]? (this.state.chartData[index].label !== "timestamp"?
            (this.state.chartData[index].label !== "Null"?
            <CanvasJSChart options = {chartOpt[index]}/> : null) : null) : null}
          </div>
        </div>
          chartArr.push(chartTemp);
        }

        intraKey = Object.keys(this.state.res.results.intra_dataset_analysis.patterns);

        intraTab = (
          <Tab eventKey="profile" title="Intra-Dataset Analysis">
                <p>HeatMap test</p>
                    <div>
                           <Chart
                            options={this.state.heatmapdata.options}
                            series={this.state.heatmapdata.series}
                            type="heatmap"
                            width="800"
                          />
                    </div>
                    <p className="intra_table_filter">frequent_itemsets</p>
                    <div>
                      <ReactTable
                        columns={frequent_itemsets_columns}
                        data={this.state.res.results.intra_dataset_analysis.patterns[intraKey[0]].frequent_itemsets}
                        filterable
                        defaultPageSize={10}
                        showPaginationTop

                      >
                      </ReactTable>

                    </div>
                    <p className="intra_table_filter">association_rules</p>
                    <div>
                      <ReactTable
                        columns={association_rules_columns}
                        data={this.state.res.results.intra_dataset_analysis.patterns[intraKey[0]].association_rules}
                        filterable
                        defaultPageSize={10}
                        showPaginationTop

                      >


                      </ReactTable>

                    </div>
                    <p className="intra_table_filter">sequences</p>
                    <div>
                      <ReactTable
                        columns={sequences_columns}
                        data={this.state.res.results.intra_dataset_analysis.patterns[intraKey[0]].sequences}
                        filterable
                        defaultPageSize={10}
                        showPaginationTop

                      >


                      </ReactTable>

                    </div>
                    <p className="intra_table_filter">top sequences</p>
                    <div>
                      <ReactTable
                        columns={top_sequences_columns}
                        data={this.state.res.results.intra_dataset_analysis.patterns[intraKey[0]].top_sequences}
                        filterable
                        defaultPageSize={10}
                        showPaginationTop

                      >


                      </ReactTable>

                    </div>
              </Tab>
        )



    }






  return(
      <div>
        <div>
        <img src={Logo}/>
        </div>

        <div className='title'>
          <h1>Smart Data Analyzer</h1>
        </div>



        <div className = "Calendar">
                <Calendar
                onChange = {this.changeDate}
                value ={this.state.date}
                locale = "en"
                />

        </div>





        <div className="Medium">
              <div className = "Treemenu"></div>
              {/* <TreeMenu data={this.state.treeData} /> */}

              {/* Create project */}
                <div className='createProject'>
                  <h2>Create Project</h2>
                    <form onSubmit={this.submitCreateProject} encType="multipart/form-data">
                      <div className='formElement'>
                        <label style={{fontSize: 16}}>
                              Project name:
                        </label>
                        <input className="inputBox"
                              type="text" value={this.state.usercreateprojectname} onChange={this.handleChangeProject} placeholder="Project Name"
                        />
                      </div>

                      <div className='formElement'>
                        <label style={{fontSize: 16}}>
                                File upload:
                        </label>
                        <input className="inputBox" type="file" name='files' multiple/>
                      </div>

                      <div className='formElement'>
                        <input className="inputBox" type="submit" value="Create Project" />
                      </div>

                    </form>

                </div>

                <div className='createAnalysis'>
                  <h2>Create Analysis</h2>
                      {/* <p>Under Construction...</p> */}
                  <form onSubmit={this.submitCreateAnalysis} encType="multipart/form-data">
                      <div className='formElement'>
                        <label style={{fontSize: 16}}>
                          Select the project:
                          <select className="inputBox"
                                  value = {this.state.createanalysisprojectselected}
                                  onChange = {this.handleChangeAnalysisProject}
                          >
                              {this.state.usercreateprojectlist.map(list=>(
                                <option key = {list} value={list}>
                                  {list}
                                </option>
                              ))}
                          </select>
                        </label>
                      </div>



                      <div className='formElement'>
                        <label style={{fontSize: 16}}>
                          Analysis name:
                          <input className="inputBox" type="text"
                                 value={this.state.createanalysisname}
                                 onChange={this.handleChangeAnalysisName}
                                 placeholder="Analysis name"
                          />
                        </label>
                      </div>



                      <div className='formElement'>
                        <label style={{fontSize: 16}}>
                          header:
                            <select className="inputBox" value = {this.state.createanalysisheader} onChange={this.handleChangeAnalysisHeader}>
                                  <option value="yes">yes</option>
                                  <option value="no">no</option>
                            </select>
                        </label>
                      </div>

                      <div className='formElement'>
                        <label style={{fontSize: 16}}>
                          threshold (Please enter a float (0-1)):
                          <input type="text" className="inputBox" value={this.state.createanalysisthreshold} onChange={this.handleChangeAnalysisThreshold} placeholder="threshold"
                          />
                        </label>
                      </div>

                      <input className="inputBox" type="submit" value="Create Analysis" />
                  </form>
                </div>


        </div>

        <div className ="Tabs">
          <Tabs defaultActiveKey="home" transition={false} id="noanim-tab-example">
            <Tab eventKey="home" title="Single Column Analysis">
              <div className="showHideButton">
                 <button onClick = {() => this.showChartAll()}> Show All </button>
                 <button onClick = {() => this.hideChartAll()}> Hide All </button>

              </div>


                   <div>
                      {chartArr.length === 0? null : chartArr}
                   </div>

                </Tab>
              {this.state.res === null? null : intraTab}


              <Tab eventKey="contact" title="Inter-Dataset Analysis" >
                   <p>test</p>


              </Tab>
      </Tabs>
        </div>

      </div>

    );
  }

}

export default Single1;
