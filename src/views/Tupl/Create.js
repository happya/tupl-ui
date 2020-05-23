import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import store from '../../store'
import Logo from './tupl_logo.png';

import { createProject, createAnalysis, getProjects, getMostRecent } from '../../api/project'
import {
  changeProjectAction,
  changeAnalysisProjectAction,
  changeAnalysisNameAction,
  changeAnalysisHeaderAction,
  changeAnalysisThresholdAction,
  createProjectAction,
  getAnalysisResultsAction,
  updateChartDataAction,
  changeAnalysisCheckListAction,
  updateProjectListAction,
  updateFileListAction,
  updateFileDataAction} from '../../store/actionCreators';

import { Button,
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
// import {CardHeader, CarderFooter}
class Create extends Component {
  constructor(props){
    super(props)
    this.state = store.getState()

    this.handleCreateProject = this.handleCreateProject.bind(this)
    this.handleChangeProject = this.handleChangeProject.bind(this)
    this.submitCreateProject = this.submitCreateProject.bind(this)

    this.handleChangeAnalysisProject = this.handleChangeAnalysisProject.bind(this)
    this.handleChangeAnalysisName = this.handleChangeAnalysisName.bind(this)
    this.handleChangeAnalysisHeader = this.handleChangeAnalysisHeader.bind(this)
    this.handleChangeAnalysisThreshold = this.handleChangeAnalysisThreshold.bind(this)

    this.handleGetResults = this.handleGetResults.bind(this)
    this.handleChangeAnalysisIsChecked = this.handleChangeAnalysisIsChecked.bind(this)
    this.handleAnalysisData = this.handleAnalysisData.bind(this)
    this.updateChartData = this.updateChartData.bind(this)
    this.updateChartInfo = this.updateChartInfo.bind(this)
    this.updateFileInfo = this.updateFileInfo.bind(this)

    this.handleStoreChange = this.handleStoreChange.bind(this)
    store.subscribe(this.handleStoreChange)
  }
  componentDidMount() {
    let project_list = []
    getProjects().then(data => {
      data.forEach(element => {
        project_list.push(element['project'])
      });
      const action = updateProjectListAction(project_list)
      store.dispatch(action)
    })

      getMostRecent().then(data => {
        if (data !== null){
          this.handleGetResults(data)
        }

      })

}
  render() {
    return (
      <div className="app flex-row align-items-center">
        {/* <img src={Logo}/> */}
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
             <Card>
              <CardHeader>
               <strong>Create Project</strong>
              </CardHeader>
              <CardBody>
               <Form onSubmit={this.submitCreateProject}
                  encType="multipart/form-data"
                  className="form-horizontal"
               >

                <FormGroup row>
                 <Col md="3">
                  <Label htmlFor="project">Project Name: </Label>
                 </Col>
                 <Col xs="12" md="9">
                  <Input type="text" id="text-input" name="project"
                     value={this.state.usercreateprojectname}
                     onChange={this.handleChangeProject}
                     placeholder="project name" />
                  {/* <FormText color="muted">This is a help text</FormText> */}
                 </Col>
                </FormGroup>


                <FormGroup row>
                 <Col md="3">
                  <Label htmlFor="file-multiple-input">Multiple File input</Label>
                 </Col>
                 <Col xs="12" md="9">
                  <Input type="file" id="file-multiple-input" name="files" multiple />
                 </Col>
                </FormGroup>
                <Button  type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
               {/* <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button> */}
               </Form>
              </CardBody>

             </Card>

             <Card>
              <CardHeader>
                <strong>Create Analysis</strong>
              </CardHeader>
              <CardBody>
               <Form action="" method="post" encType="multipart/form-data"
                       className="form-horizontal">
                <FormGroup>
                 <Label>Choose project: </Label>
                 <Input type="select"
                               name="project"
                               value = {this.state.createanalysisprojectselected}
                               onChange = {this.handleChangeAnalysisProject}
                       >
                         {this.state.usercreateprojectlist.map(pname =>(
                               <option key = {pname} value={pname}>
                                 {pname}
                               </option>
                         ))}
                       </Input>
                </FormGroup>

                <FormGroup>
                 <Label>header: </Label>
                 <Input type="select" name="header"
                        value = {this.state.createanalysisheader}
                        onChange={this.handleChangeAnalysisHeader}
                 >
                   <option value="yes">yes</option>
                   <option value="no">no</option>
                 </Input>
                </FormGroup>

                <FormGroup row>
                 <Col md="3">
                   <Label htmlFor="analysis"> Analysis name:  </Label>
                 </Col>
                 <Col xs="12" md="9">
                   <Input type="text" id="text-input" name="analysis_name"
                          value={this.state.createanalysisname}
                          onChange={this.handleChangeAnalysisName}
                          placeholder="Analysis name"/>
                   {/* <FormText color="muted">This is a help text</FormText> */}
                 </Col>
               </FormGroup>

                <FormGroup row>
                     <Col md="3">
                       <Label htmlFor="analysis">
                        Categories' threshold (number in 0-1):
                      </Label>
                     </Col>
                     <Col xs="12" md="9">
                       <Input type="text" id="text-input"
                              name="threshold" placeholder="0.0004"
                              value={this.state.createanalysisthreshold}
                              onChange={this.handleChangeAnalysisThreshold}
                      />
                       {/* <FormText color="muted">This is a help text</FormText> */}
                     </Col>
                   </FormGroup>
                <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                {/* <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button> */}
               </Form>
               </CardBody>

              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }


  submitCreateProject = (e) => {
    e.preventDefault();

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

  }


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
          this.handleGetResults(data.data)
        }

    })
  }


  // project
  handleChangeProject = (event) => {
    const action = changeProjectAction(event.target.value)
    store.dispatch(action)

  }
  handleCreateProject(){
    const action = createProjectAction()
    store.dispatch(action)
  }

  // analysis
  handleChangeAnalysisProject = (event) => {
    const action = changeAnalysisProjectAction(event.target.value)
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


  // analsis results
  handleGetResults(data){
    let checktemp = [];
    for (let i = 0 ; i < data.datasets.length; i++) {
      checktemp.push(true);
    }
    this.handleChangeAnalysisIsChecked(checktemp)
    this.handleAnalysisData(data)
    this.updateFileInfo(data.datasets)
    this.updateChartInfo(data.results.single_column_analysis)
  }

  handleChangeAnalysisIsChecked(value){
    const action = changeAnalysisCheckListAction(value)
    store.dispatch(action)

  }
  handleAnalysisData(results){
    const action = getAnalysisResultsAction(results)
    store.dispatch(action)
  }

  updateFileInfo(datasets){
    const action = updateFileListAction(datasets)
    store.dispatch(action)
  }
  updateChartInfo(single_column){
    Object.keys(single_column).map(csv =>  {
      // get results for each .csv file
      const single_column_csv = single_column[csv]
      // get results for each column of the .csv file
      let csv_charts = []
      Object.keys(single_column_csv).map(col => {
        const col_data = single_column_csv[col]
        csv_charts.push(col_data)
        this.updateChartData(col_data)
      })
      this.updateFileData(csv, csv_charts)
    })
  }

  updateChartData(chart){
    // state.chartData is the results of each column
    const action = updateChartDataAction(chart)
    store.dispatch(action)
  }

  updateFileData(csv, csv_charts){
    const action = updateFileDataAction(csv, csv_charts)
    store.dispatch(action)
  }
  // subscribe store changes
  handleStoreChange() {
    this.setState(store.getState())
  }
}

export default Create
