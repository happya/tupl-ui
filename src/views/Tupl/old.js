import React, {Component} from 'react';
import Login from './Login';
import './App.css';
import Calendar from 'react-calendar';
import Logo from './tupl_logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import axios from 'axios';
import ReactTable from 'react-table-v6';         //table
import 'react-table-v6/react-table.css';         //table
import 'react-table-filter/lib/styles.css';   //table filter
import Chart from 'react-apexcharts';
import CanvasJSReact from './canvasjs.react';
import InterTable from './Inter';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;




class App extends Component {
  state = {
    res: null,
    datetime:"",
    user:"",
    project:"",
    analysis_result_name:"",
    chartData: [],
    isChartShow: [],
    column2_distribution_null: 0,
    ischecked: [],
    account: {
    username: null,
    password: null,
    formErrors: {
      username: "",
      password: ""
    }
  },
    usercreateprojectname: "",
    usercreateprojectlist: [],
    createprojectresponsemsg:"",
    createprojectresponsecode: 0,
    createanalysisprojectselected: "",
    createanalysisname: "",
    createanalysisheader: "yes",
    createanalysisthreshold: 0,
    createanalysisresponsemsg: "",
    createanalysisresponsecode: 1,
    execute: 1,
    heatmapdata: [],


    date: new Date(),
    today: new Date(),

    treeData : {
      '1': {               // key
        label: 'Node 1 at the first level',
        index: 0, // decide the rendering order on the same level
        nodes: null,
      },
    }

  }



  componentDidMount(){

    this.submitCreateProject = this.submitCreateProject.bind(this);
    this.submitCreateAnalysis = this.submitCreateAnalysis.bind(this);


    



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

  classifyChart = (chartOpt, chartStat, index, columnType, filterchartData) =>
  {
      //index = 0; //Temp (use the 1st data)
      const label = filterchartData[index].label;
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
          const category = filterchartData[index].categories;
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
        const category = filterchartData[index].distribution;
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
        const category = filterchartData[index].length_distribution;
        pieOpt.title.text = columnType[index];
        const category_sample = filterchartData[index].sample_data;
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
            <p key = {index} >
              {label} : {category[label]}
            </p>

          )
        })
      let temp_sum = <div>{temp}<br/> <p className="sampleData">Sample data:</p> <br/>{temp_sample}</div>
        chartStat.push(temp_sum);
        chartOpt.push(pieOpt);

    }
    else if (label === "Null"){
      const category = filterchartData[index].categories;
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
        chartStat.push(filterchartData[index].format);
        const tempPoint = {label: 0, y:0};
        tempPoint.label = "null";
        tempPoint.y = 0;

        pieOpt.data[0].dataPoints.push(tempPoint);
      }

  }





  //create project submit


  handleChangeProject = (event) => {

    this.setState({
      usercreateprojectname: event.target.value,
      createanalysisprojectselected: event.target.value,

    });

  }

  handleChangeAnalysisProject = (event) => {

    this.setState({
      createanalysisprojectselected: event.target.value,

    });

  }

  handleChangeAnalysisName = (event) => {

    this.setState({
      createanalysisname: event.target.value,

    });

  }


  handleChangeAnalysisHeader = (event) => {

    this.setState({
      createanalysisheader: event.target.value,

    });

  }

  handleChangeAnalysisThreshold = (event) => {

    this.setState({
      createanalysisthreshold: event.target.value,

    });

  }



submitCreateProject = (e) => {
  e.preventDefault();
  //alert('A project was created: ' + this.state.usercreateprojectname);
  var formData = new FormData(e.target);
  console.log(e.target);
  console.log(formData);
  var message = {};
 formData.append("project",this.state.usercreateprojectname);
 console.log(formData);
  fetch('http://localhost:5000/api/createProject/', {
      method: 'POST',
      body: formData
  }).then(response => { return response.json(); })
  .then(data => {
      message=data;
      console.log(message);
      this.setState({
        createprojectresponsemsg: message.msg,
        createprojectresponsecode: message.code,
        usercreateprojectlist: [...this.state.usercreateprojectlist, this.state.usercreateprojectname],
      });
      console.log("test");
      console.log(this.state.createprojectresponsemsg);
      console.log(this.state.usercreateprojectlist);
      if(this.state.createprojectresponsecode==0) {
        alert("Created Project Successfully!");

      }
      else {
        alert(this.state.createprojectresponsemsg);
      }
  })

};

submitCreateAnalysis = (e) => {
  e.preventDefault();
  //alert('A project was created: ' + this.state.usercreateprojectname);
  var formData = new FormData(e.target);
  // console.log(e.target);
  // console.log(formData);
  var message = {};
 formData.append("project",this.state.createanalysisprojectselected);
 formData.append("analysis_name",this.state.createanalysisname);
 formData.append("header",this.state.createanalysisheader);
 formData.append("threshold", this.state.createanalysisthreshold);
 console.log(formData);
  fetch('http://localhost:5000/api/createAnalysis/', {
      method: 'POST',
      body: formData
  }).then(response => { return response.json(); })
  .then(data => {
      message=data;
      console.log(message);
      this.setState({
        createanalysisresponsemsg: message.msg,
        createanalysisresponsecode: message.code,
      });
      console.log("test");
      console.log(this.state.createanalysisresponsemsg);
      console.log(this.state.createanalysisresponsecode);
      if(this.state.createanalysisresponsecode === 0) {
        alert("Created Analysis Successfully!");
        let checktemp = [];
        for (let i = 0 ; i < message.data.datasets.length; i++) {
          checktemp.push(true);
        }
        console.log(checktemp);
        this.setState({
          res: message.data,
          ischecked: checktemp
        });
        console.log(this.state.execute);

        Object.keys(message.data.results.single_column_analysis)
        .map(key=>{
            const obj = message.data.results.single_column_analysis[key];
            console.log(obj);
            Object.keys(obj)
            .map(key1=>{
              let obj1 = obj[key1];
              obj1 = {...obj1, group: key};
              console.log(obj1);
              this.setState({
                chartData : [...this.state.chartData, obj1],
                isChartShow : [...this.state.isChartShow, false]

              });
            })
        });

        // Deal with intra-data
        let heatmapdata_temp = [];
        Object.keys(message.data.results.intra_dataset_analysis.correlation)
        .map(key => {
          console.log(message.data.results.intra_dataset_analysis);
          let col = message.data.results.intra_dataset_analysis.correlation[key].columns;
          let data = message.data.results.intra_dataset_analysis.correlation[key].data;
          console.log(col);
          console.log(data);
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
        console.log(heatmapdata_temp);
        this.setState({
          heatmapdata: heatmapdata_temp
        })


      }
      else {
        alert(this.state.createanalysisresponsemsg);
      }
  })

};

handleChangeCheckedBox = (e, index) => {
console.log(e);
let temp = this.state.ischecked;
temp[index]=!temp[index];
console.log(temp[index]);
this.setState({
  ischecked: temp
})
// e.target.checked=temp[index];
 console.log(index);
 console.log(e.target.checked);

}

  render() {



   // var CanvasJS = CanvasJSReact.CanvasJS;

    //Pie Chart
    const pie = {
      title: {
        text: "Pie Chart"
      },
      data: [{
        type: "pie",
        animationEnabled: true,
			  zoomEnabled: true,
        showInLegend: false,
        toolTipContent: "{label} - {y} (#percent %)",
        //yValueFormatString: "{label}",
        legendText: "{label}",
                dataPoints: []
                // dataPoints: [
                //     { label: "null",  y: this.state.column2_distribution_null  },
                //     { label: "NaN", y: 10  },
                //     { label: "Banana", y: 2  },
                //     { label: "Mango",  y: 3  },
                //     { label: "Grape",  y: 2  }
                // ]
       }]
    }
    //Distribution Chart
    const distribution = {
      title: {
        text: "Distribution"
      },
      data: [{
                type: "column",
                indexLabel: "{y}",
                dataPoints: []
                // dataPoints: [
                //     { label: "null",  y: this.state.column2_distribution_null  },
                //     { label: "NaN", y: 10  },
                //     { label: "Banana", y: 2  },
                //     { label: "Mango",  y: 3  },
                //     { label: "Grape",  y: 2  }
                // ]
       }]
    }

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

const inter_columns = [
  {
    Header: "Parent",
    accessor: "parent",
    sortable: false
  },
  {
    Header: "Child",
    accessor: "child",
    sortable: false
  },
  {
    Header: "Confidence",
    accessor: "Confidence",
    filterable: false
  },
  ];

//Time setting
const time = <p>Today is {this.state.date.getDate()}/{this.state.date.getMonth()+1}/{this.state.date.getFullYear()}</p>;

    let test =null;
    let test1=null;
    let temp = null;
    let temp1=null;
    let chartArr =[];
    let chartOpt=[];
    let chartStat=[];
    let intraKey =null;
    let intraTab=null;
    let check_box=null
    let filterchartData=[];
    let heatmapArr=[];
    let intraTableArr=[];
    let interTableArr=[];

    if (this.state.res !== null) {


      //checkbox
      check_box = Object.keys(this.state.res.datasets).map((label, index)=>{
        return(
          <div key={index} className="tabHeader">
            <input type="checkbox" checked={this.state.ischecked[index]} onChange={(e)=>this.handleChangeCheckedBox(e, index)}/>
            {this.state.res.datasets[index]}
          </div>


        )

      })

      //filterchartData
      filterchartData=this.state.chartData.filter( key=> {
        console.log(key);
        let group_temp = key.group;
        let group_index = this.state.res.datasets.indexOf(group_temp);
        return this.state.ischecked[group_index] === true;
      })

      //let columnType = Object.keys(this.state.res.data.results.single_column_analysis.dataset1);
      let columnType =[];

      Object.keys(this.state.res.results.single_column_analysis)
      .map(key=>{
          let temp_index = this.state.res.datasets.indexOf(key);
          if (this.state.ischecked[temp_index] === true) {
            const obj = this.state.res.results.single_column_analysis[key];
            console.log(obj);
            const temp = Object.keys(obj);
            console.log(temp);
            columnType = columnType.concat(temp);
          }
      });
      console.log(filterchartData);
      console.log(columnType);


      console.log(columnType);
        for (let index in filterchartData) {
          this.classifyChart(chartOpt, chartStat, index, columnType, filterchartData);
        }
        // console.log(this.state.chartData);

        for (let index in filterchartData) {
          console.log(columnType[index]);
          console.log(this.state.chartData[index].features);
          const chartTemp =   <div className = "BarChart" key = {index}>
                              <button onClick = {() => this.showHideChart(index)}> {columnType[index]} </button>
            <p>{filterchartData[index].label}</p>



          <div className = "BarChartLeft">
            <div>{this.state.isChartShow[index]? (chartStat[index]) : null}</div>
             <div>{this.state.isChartShow[index]? (filterchartData[index].features.useful==="True"?
              <div className = "Useful"> Useful</div> : <div className ="Useless">Useless</div>) : null }</div>
             <div>{this.state.isChartShow[index]? (filterchartData[index].features.has_invalid_data==="True"?
              <div className ="hasInvalid">Has invalid data</div> : <div className ="noInvalid">No invalid data</div>) : null}</div>

          </div>


          <div className = "BarChartRight">
            {this.state.isChartShow[index]? (filterchartData[index].label !== "timestamp"?
            (filterchartData[index].label !== "Null"?
            <CanvasJSChart options = {chartOpt[index]}/> : null) : null) : null}
          </div>
        </div>
          chartArr.push(chartTemp);
        }
        // Intra heatmap
        intraKey = Object.keys(this.state.res.results.intra_dataset_analysis.patterns);
        for (let i in this.state.heatmapdata) {
          let heatChart = null;
          console.log(this.state.heatmapdata[i].series);
          if (this.state.heatmapdata[i].series.length != 0) {
             heatChart = <div key = {i} className="BarChart">
            <p className="tabHeader">{this.state.heatmapdata[i].group}</p>
            <Chart
            options={this.state.heatmapdata[i].options}
            series={this.state.heatmapdata[i].series}
            type="heatmap"
            width="800"
        />
        </div>
          }
          else {
             heatChart = <div key = {i} className="BarChart">
               <p className="tabHeader">{this.state.heatmapdata[i].group}</p>
                <p className="error">No correlation result for this dataset!</p>
            </div>
          }


          heatmapArr.push(heatChart);
        }
        // Intra pattern table
        for (let i in intraKey) {
          let temp_table =
          <div key = {i} className="BarChart">
                <p className="tabHeader">{intraKey[i]}</p>
                <p className="intra_table_filter">frequent_itemsets</p>
                    <div>
                      <ReactTable
                        columns={frequent_itemsets_columns}
                        data={this.state.res.results.intra_dataset_analysis.patterns[intraKey[i]].frequent_itemsets}
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
                        data={this.state.res.results.intra_dataset_analysis.patterns[intraKey[i]].association_rules}
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
                        data={this.state.res.results.intra_dataset_analysis.patterns[intraKey[i]].sequences}
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
                        data={this.state.res.results.intra_dataset_analysis.patterns[intraKey[i]].top_sequences}
                        filterable
                        defaultPageSize={10}
                        showPaginationTop

                      >


                      </ReactTable>

                    </div>

          </div>
            intraTableArr.push(temp_table);
        }
        intraTab = (
          <Tab eventKey="profile" title="Intra-Dataset Analysis">
                <h2>Correlation</h2>
                    {heatmapArr}
                    {/* <div>
                           <Chart
                            options={this.state.heatmapdata.options}
                            series={this.state.heatmapdata.series}
                            type="heatmap"
                            width="800"
                          />
                    </div> */}
                    <h2>Patterns</h2>
                    {intraTableArr}
              </Tab>
        )
      //Inter-dataset analysis

      let interKey = Object.keys(this.state.res.results.inter_dataset_analysis);
      let interTableKey = []; // [[bc],[ac],[ab]]
      for (let i in interKey) {
        let tempKey = Object.keys(this.state.res.results.inter_dataset_analysis[interKey[i]]);
        interTableKey.push(tempKey);

      }
      for (let i in interKey) {
        let tempArr = [];
        for (let j in interTableKey[i]) {
          let test = this.state.res.results.inter_dataset_analysis[interKey[i]];
          console.log(interTableKey[i][j]);
          console.log(test[interTableKey[i][j]]);
          let temp_table =
          <div key = {j}>
              <p>{interTableKey[i][j]}</p>
                    <div>
                  <ReactTable
                    columns={inter_columns}
                    data={test[interTableKey[i][j]]}
                    filterable
                    defaultPageSize={10}
                    showPaginationTop

                  >


                  </ReactTable>

                </div>

          </div>

          tempArr.push(temp_table);
        }
        console.log(tempArr);
        let temp_table_All =
        <div key = {i}>
            <h4>{interKey[i]}</h4>
              {tempArr}



        </div>
        interTableArr.push(temp_table_All);
      }



    }






  return(
      <React.Fragment>

        <img src={Logo}/>
        <h1>Smart Data Analyzer</h1>

        {/* <div>
             <p>{time}</p>
             <p>Project name: {this.state.usercreateprojectname} </p>
        </div> */}

        <div className="Medium">
          {/* Create project */}
        <div className="createProject">
          <h3>Create Project</h3>
            <form onSubmit={this.submitCreateProject} encType="multipart/form-data">
                    <label className="createProjectName">
                      Project name:
                      <input type="text" value={this.state.usercreateprojectname} onChange={this.handleChangeProject} placeholder="Project Name"
                      />
                    </label>
                    <label className="createProjectName">
                      File upload:
                        <input type="file" name='files' multiple/>
                    </label>
                    <label className="createProjectName">
                      <input type="submit" value="Create Project" />
                    </label>


            </form>

        </div>

        <div className = "Calendar">
                <Calendar
                onChange = {this.changeDate}
                value ={this.state.date}
                locale = "en"
                />
                <div className="backToToday">
                    <Login backFunc = {this.backToToday}/>
                  </div>

              </div>
        </div>


        {/* Create Analysis and Calendar */}
        <div className="Medium">
              <div className = "createAnalysis">

                  <h3>Create Analysis</h3>

                    <form onSubmit={this.submitCreateAnalysis} encType="multipart/form-data">
                          <label className="createProjectName">
                            Select the project:
                            <select value = {this.state.createanalysisprojectselected} onChange = {this.handleChangeAnalysisProject}>
                                {this.state.usercreateprojectlist.map(list=>(
                                  <option key = {list} value={list}>
                                    {list}
                                  </option>
                                ))}
                            </select>
                          </label>

                          <label className="createProjectName">
                            Analysis name:
                            <input type="text" value={this.state.createanalysisname} onChange={this.handleChangeAnalysisName} placeholder="Analysis name"
                            />
                          </label>

                          <label className="createProjectName">
                            header:
                              <select value = {this.state.createanalysisheader} onChange={this.handleChangeAnalysisHeader}>
                                    <option value="yes">yes</option>
                                    <option value="no">no</option>
                              </select>
                          </label>

                          <label className="createProjectName">
                            Categories' threshold (number in 0-1):
                            <input type="text" value={this.state.createanalysisthreshold} onChange={this.handleChangeAnalysisThreshold} placeholder="threshold"
                            />
                          </label>
                          <label className="createProjectName">
                                 <input type="submit" value="Create Analysis" />
                          </label>

                  </form>
              </div>

        </div>


      {/* Three different analysis results */}
        <div className ="Tabs">
            <Tabs defaultActiveKey="home" transition={false} id="noanim-tab-example">

                {/* Single column analysis */}
                <Tab eventKey="home" title="Single Column Analysis">
                  <div>
                      {check_box}
                    <button onClick = {() => this.showChartAll()}> Show All </button>
                    <button onClick = {() => this.hideChartAll()}> Hide All </button>

                  </div>


                  <div>
                      {chartArr.length === 0? null : chartArr}
                  </div>

                  </Tab>

                  {/* Intra dataset analysis */}
                  {this.state.res === null? null : intraTab}

                  {/* Inter dataset analysis */}
                  <Tab eventKey="contact" title="Inter-Dataset Analysis" >
                      {this.state.res===null? null : <InterTable res = {this.state.res}/>}

                  </Tab>
          </Tabs>
        </div>





      </React.Fragment>

    );
  }

}

export default App;
