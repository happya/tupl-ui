import {
  CHANGE_PROJECT,
  CREATE_PROJECT,
  CHANGE_ANALYSIS_PROJECT,
  CHANGE_ANALYSIS_NAME,
  CHANGE_ANALYSIS_HEADER,
  CHANGE_ANALYSIS_THRESHOLD,
  CHANGE_ANALYSIS_CHECK_LIST,
  GET_ANALYSIS_RESULTS,
  UPDATE_CHART_DATA,
  UPDATE_PROJECT_LIST,
  UPDATE_FILE_LIST,
  UPDATE_FILE_DATA
} from "./actionTypes"

export const changeProjectAction = (value) => ({
    type: CHANGE_PROJECT,
    value
})

export const createProjectAction = () => ({
  type: CREATE_PROJECT
})

export const changeAnalysisProjectAction = (value) => ({
  type: CHANGE_ANALYSIS_PROJECT,
  value
})

export const changeAnalysisNameAction = (value) => ({
  type: CHANGE_ANALYSIS_NAME,
  value
})

export const changeAnalysisHeaderAction = (value) => ({
  type: CHANGE_ANALYSIS_HEADER,
  value
})

export const changeAnalysisThresholdAction = (value) => ({
  type: CHANGE_ANALYSIS_THRESHOLD,
  value
})


export const changeAnalysisCheckListAction = (value) => ({
  type: CHANGE_ANALYSIS_CHECK_LIST,
  value
})

export const getAnalysisResultsAction = (results) => ({
  type: GET_ANALYSIS_RESULTS,
  results
})

export const updateChartDataAction = (chart_data) => ({
  type: UPDATE_CHART_DATA,
  chart_data
})

export const updateProjectListAction = (list) => ({
  type: UPDATE_PROJECT_LIST,
  list
})

export const updateFileListAction = (list) => ({
  type: UPDATE_FILE_LIST,
  list
})

export const updateFileDataAction = (csv, list) => ({
  type: UPDATE_FILE_DATA,
  csv,
  list
})
