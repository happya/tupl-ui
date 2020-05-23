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
      'results': store.getState().res.results.intra_dataset_analysis.correlation
    }

    this.handleStoreChange = this.handleStoreChange.bind(this)
    store.subscribe(this.handleStoreChange)
  }

handleStoreChange() {
  this.setState({
    'results': store.getState().res.results.intra_dataset_analysis.correlation
  })
}



render() {

  return (
    <div>
        test
    </div>
  )

}
}
export default Correlation
