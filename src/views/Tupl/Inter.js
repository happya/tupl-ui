import React, {Component} from 'react';
import store from '../../store'
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';         //table
import 'react-table-filter/lib/styles.css';   //table filter
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



class Inter extends Component {
  constructor(props){
    super(props)
    this.state = {
      'results': store.getState().res.results.inter_dataset_analysis
    }

    this.handleStoreChange = this.handleStoreChange.bind(this)
    store.subscribe(this.handleStoreChange)
  }



handleStoreChange(){
  this.setState({
    'results': store.getState().res.results.inter_dataset_analysis
  })
}


getLinkData() {
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
        accessor: "ratio",
        filterable: false
      },
      ];
  let interTableArr=[];
  const results = this.state.results
  let interKey = Object.keys(results);
  let interTableKey = []; // [[bc],[ac],[ab]]
  for (let i in interKey) {
    let tempKey = Object.keys(results[interKey[i]]);
    interTableKey.push(tempKey);

  }
  for (let i in interKey) {
    let tempArr = [];
    for (let j in interTableKey[i]) {
      let test = results[interKey[i]];
      let temp_table =
      <Card>
        <CardHeader>
          {interTableKey[i][j]}
        </CardHeader>
        <CardBody>
          <ReactTable
                  columns={inter_columns}
                  data={test[interTableKey[i][j]]}
                  filterable
                  defaultPageSize={10}
                  showPaginationTop

          >
          </ReactTable>
        </CardBody>
      </Card>


      tempArr.push(temp_table);
    }
    let temp_table_All =
    <div key = {i}>
        <h2 className="tabHeader">{interKey[i]}</h2>
          {tempArr}

    </div>
    interTableArr.push(temp_table_All);
  }
  return (
    interTableArr
  )
}



render() {

  return (
    <div>
        {this.getLinkData()}
    </div>
  )

}
}
export default Inter;
