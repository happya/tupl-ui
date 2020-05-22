import { CHANGE_PROJECT, CREATE_PROJECT, CHANGE_ANALYSIS_PROJECT, CHANGE_ANALYSIS_NAME, CHANGE_ANALYSIS_THRESHOLD, CHANGE_ANALYSIS_CHECK_LIST, GET_ANALYSIS_RESULTS, UPDATE_CHART_DATA, CHANGE_ANALYSIS_HEADER, UPDATE_PROJECT_LIST, UPDATE_FILE_LIST, UPDATE_FILE_DATA } from "./actionTypes"

const defaultState = {
  res: null,
  datetime:"",
  user:"",
  project:"",
  analysis_result_name:"",
  fileList: [],
  chartData: [],
  fileData: {},
  isChartShow: [],
  column2_distribution_null: 0,

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
  createanalysisresponsecode: 0,
  execute: 0,
  heatmapdata:{

    series: [{
      name: 'height',
      data:  [
        1.0,
        0.0415484434,
        -0.1237556002,
        0.0063435012,
        0.3330639499
     ]
    },
    {
      name: 'azimuth',
      data:  [
        0.0415484434,
        1.0,
        -0.0272146151,
        -0.0331086313,
        0.081429367
     ]
    },
    {
      name: 'longitude',
      data: [
        -0.1237556002,
        -0.0272146151,
        1.0,
        0.4870739295,
        -0.0159851218
     ]
    },
    {
      name: 'latitude',
      data:  [
        0.0063435012,
        -0.0331086313,
        0.4870739295,
        1.0,
        -0.0008627408
     ]
    },
    {
      name: 'antenna_gain',
      data: [
        0.3330639499,
        0.081429367,
        -0.0159851218,
        -0.0008627408,
        1.0
     ]

    },

    ],
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
        categories: ['height', 'azimuth', 'longitude', 'latitude', 'antenna_gain']
      },
    },


  },

  // date: new Date(),
  // today: new Date(),

  treeData : {
    '1': {               // key
      label: 'Node 1 at the first level',
      index: 0, // decide the rendering order on the same level
      nodes: null,
    },
  }

}

// reducer 可以接收state,但不能改变state
export default (state = defaultState, action) => {


  if(action.type === CHANGE_PROJECT){
    const newState = JSON.parse(JSON.stringify(state))
    newState.usercreateprojectname = action.value
    newState.createanalysisprojectselected = action.value
    return newState
  }
  if(action.type === CREATE_PROJECT){
    const newState = JSON.parse(JSON.stringify(state))
    newState.usercreateprojectlist.push(newState.usercreateprojectname)
    return newState
  }

  if (action.type === CHANGE_ANALYSIS_PROJECT){
    const newState = JSON.parse(JSON.stringify(state))
    newState.createanalysisprojectselected = action.value
    return newState
  }

  if (action.type === CHANGE_ANALYSIS_NAME){
    const newState = JSON.parse(JSON.stringify(state))
    newState.createanalysisname = action.value
    return newState
  }

  if (action.type === CHANGE_ANALYSIS_HEADER){
    const newState = JSON.parse(JSON.stringify(state))
    newState.createanalysisheader = action.value
    return newState
  }

  if (action.type === CHANGE_ANALYSIS_THRESHOLD){
    const newState = JSON.parse(JSON.stringify(state))
    newState.createanalysisthreshold = action.value
    return newState
  }

  if (action.type === CHANGE_ANALYSIS_CHECK_LIST){
    const newState = JSON.parse(JSON.stringify(state))
    newState.ischecked= action.value
    return newState
  }

  if (action.type === GET_ANALYSIS_RESULTS){
    const newState = JSON.parse(JSON.stringify(state))
    newState.res= action.results
    return newState
  }

  if(action.type === UPDATE_CHART_DATA){
    const newState = JSON.parse(JSON.stringify(state))
    newState.chartData.push(action.chart_data)
    newState.isChartShow.push(false)
    return newState
  }

  if(action.type === UPDATE_PROJECT_LIST){
    const newState = JSON.parse(JSON.stringify(state))
    newState.usercreateprojectlist = action.list
    return newState
  }

  if(action.type === UPDATE_FILE_LIST){
    const newState = JSON.parse(JSON.stringify(state))
    newState.fileList = action.list
    return newState
  }

  if(action.type === UPDATE_FILE_DATA){
    const newState = JSON.parse(JSON.stringify(state))
    newState.fileData[action.csv] = action.list
    return newState
  }

  return state
}
