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



class Pattern extends Component {
  constructor(props){
    super(props)
    this.state = {
      'results': store.getState().res.results.intra_dataset_analysis.patterns,
    }

    this.handleStoreChange = this.handleStoreChange.bind(this)
    this.getPatternData = this.getPatternData.bind(this)
    store.subscribe(this.handleStoreChange)
  }

  // componentWillMount(){
  //   this.setState({
  //     'heatmapdata': this.getHeatMapData()
  //   })
  // }

handleStoreChange() {
  this.setState({
    'results': store.getState().res.results.intra_dataset_analysis.patterns
  })
}


getPatternData(){
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
  const results = this.state.results
  const intraKey = Object.keys(results);
  let intraTableArr = []
  for (let i in intraKey) {
    let temp_table =
    <div key = {i} className="BarChart">
          <h2 className="tabHeader">{intraKey[i]}</h2>
          <Card>
            <CardHeader>
              frequent_itemsets
            </CardHeader>
            <CardBody>
              <ReactTable
                  columns={frequent_itemsets_columns}
                  data={results[intraKey[i]].frequent_itemsets}
                  filterable
                  defaultPageSize={10}
                  showPaginationTop

                >
                </ReactTable>
            </CardBody>

          </Card>

          <Card>
            <CardHeader>
              association_rules
            </CardHeader>
            <CardBody>
            <ReactTable
                  columns={association_rules_columns}
                  data={results[intraKey[i]].association_rules}
                  filterable
                  defaultPageSize={10}
                  showPaginationTop

                >


                </ReactTable>
            </CardBody>

          </Card>

          <Card>
            <CardHeader>
              sequences
            </CardHeader>
            <CardBody>
              <ReactTable
                    columns={sequences_columns}
                    data={results[intraKey[i]].sequences}
                    filterable
                    defaultPageSize={10}
                    showPaginationTop

                  >


                  </ReactTable>
            </CardBody>

          </Card>

          <Card>
            <CardHeader>
              top sequences
            </CardHeader>
            <CardBody>
              <ReactTable
                  columns={top_sequences_columns}
                  data={results[intraKey[i]].top_sequences}
                  filterable
                  defaultPageSize={10}
                  showPaginationTop
                >
                </ReactTable>
            </CardBody>

          </Card>
    </div>
    intraTableArr.push(temp_table);
  }
  return (
    intraTableArr
  )
}


render() {

  return (
    <div>
        {this.getPatternData()}
    </div>
  )

}
}
export default Pattern
